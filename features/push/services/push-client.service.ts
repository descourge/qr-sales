function urlBase64ToUint8Array(
  value: string
): Uint8Array<ArrayBuffer> {

  const padding =
    "=".repeat(
      (4 - (value.length % 4)) % 4
    );

  const base64 =
    `${value}${padding}`
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  const buffer =
    new ArrayBuffer(
      rawData.length
    );

  const output =
    new Uint8Array(
      buffer
    );

  for (
    let index = 0;
    index < rawData.length;
    index++
  ) {

    output[index] =
      rawData.charCodeAt(
        index
      );

  }

  return output;

}

export function supportsPushNotifications(): boolean {

  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  console.warn(
    "[Push] Soporte disponible:",
    supported
  );

  return supported;

}

async function getActiveServiceWorkerRegistration():
  Promise<ServiceWorkerRegistration | null> {

  console.warn(
    "[Push] Buscando Service Worker..."
  );

  const directRegistration =
    await navigator.serviceWorker
      .getRegistration();

  if (
    directRegistration?.active
  ) {

    console.warn(
      "[Push] Service Worker directo encontrado:",
      {
        scope:
          directRegistration.scope,

        scriptURL:
          directRegistration.active
            .scriptURL,
      }
    );

    return directRegistration;

  }

  const registrations =
    await navigator.serviceWorker
      .getRegistrations();

  console.warn(
    "[Push] Registraciones encontradas:",
    registrations.map(
      registration => ({
        scope:
          registration.scope,

        active:
          registration.active
            ?.scriptURL ??
          null,

        waiting:
          registration.waiting
            ?.scriptURL ??
          null,

        installing:
          registration.installing
            ?.scriptURL ??
          null,
      })
    )
  );

  const activeRegistration =
    registrations.find(
      registration =>
        registration.active !== null
    );

  if (!activeRegistration) {

    console.warn(
      "[Push] No existe ningún Service Worker activo."
    );

    return null;

  }

  return activeRegistration;

}

async function saveSubscription(
  companyId: number,
  userId: number,
  subscription: PushSubscription
): Promise<void> {

  const serialized =
    subscription.toJSON();

  console.warn(
    "[Push] Suscripción serializada:",
    serialized
  );

  if (
    !serialized.endpoint ||
    !serialized.keys?.p256dh ||
    !serialized.keys?.auth
  ) {

    throw new Error(
      "La suscripción Push está incompleta."
    );

  }

  console.warn(
    "[Push] Enviando suscripción a la API:",
    {
      companyId,
      userId,
      endpoint:
        serialized.endpoint,
    }
  );

  const response =
    await fetch(
      "/api/push/subscriptions",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            companyId,
            userId,
            subscription:
              serialized,
          }),
      }
    );

  let result: {
    message?: string;
    id?: number;
  };

  try {

    result =
      await response.json();

  } catch {

    result = {
      message:
        "La API devolvió una respuesta inválida.",
    };

  }

  console.warn(
    "[Push] Respuesta de la API:",
    {
      status:
        response.status,

      ok:
        response.ok,

      result,
    }
  );

  if (!response.ok) {

    throw new Error(
      result.message ??
        "No fue posible guardar la suscripción Push."
    );

  }

}

export async function subscribeToPushNotifications(
  companyId: number,
  userId: number
): Promise<PushSubscription> {

  await reportPushDebug(
    "subscribeToPushNotifications iniciado",
    {
      companyId,
      userId,
    }
  );

  const supported =
    supportsPushNotifications();

  await reportPushDebug(
    "Soporte Push comprobado",
    {
      supported,
      hasServiceWorker:
        typeof navigator !== "undefined" &&
        "serviceWorker" in navigator,

      hasPushManager:
        typeof window !== "undefined" &&
        "PushManager" in window,

      hasNotification:
        typeof window !== "undefined" &&
        "Notification" in window,
    }
  );

  if (!supported) {

    throw new Error(
      "Este dispositivo no admite Web Push."
    );

  }

  const publicKey =
    process.env
      .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  await reportPushDebug(
    "Clave VAPID comprobada",
    {
      available:
        Boolean(publicKey),

      length:
        publicKey?.length ?? 0,
    }
  );

  if (!publicKey) {

    throw new Error(
      "NEXT_PUBLIC_VAPID_PUBLIC_KEY no está configurada."
    );

  }

  let permission =
    Notification.permission;

  await reportPushDebug(
    "Permiso actual",
    {
      permission,
    }
  );

  if (
    permission ===
    "default"
  ) {

    permission =
      await Notification
        .requestPermission();

    await reportPushDebug(
      "Permiso solicitado",
      {
        permission,
      }
    );

  }

  if (
    permission !==
    "granted"
  ) {

    throw new Error(
      "Las notificaciones no están autorizadas."
    );

  }

  await reportPushDebug(
    "Buscando Service Worker"
  );

  const registration =
    await getActiveServiceWorkerRegistration();

  await reportPushDebug(
    "Resultado Service Worker",
    {
      found:
        Boolean(registration),

      scope:
        registration?.scope ??
        null,

      activeScript:
        registration?.active
          ?.scriptURL ??
        null,
    }
  );

  if (!registration) {

    throw new Error(
      "No existe un Service Worker activo."
    );

  }

  let subscription =
    await registration
      .pushManager
      .getSubscription();

  await reportPushDebug(
    "Suscripción existente comprobada",
    {
      found:
        Boolean(subscription),
    }
  );

  if (!subscription) {

    await reportPushDebug(
      "Creando suscripción Push"
    );

    subscription =
      await registration
        .pushManager
        .subscribe({
          userVisibleOnly:
            true,

          applicationServerKey:
            urlBase64ToUint8Array(
              publicKey
            ),
        });

    await reportPushDebug(
      "Suscripción Push creada",
      {
        endpoint:
          subscription.endpoint,
      }
    );

  }

  await reportPushDebug(
    "Guardando suscripción en la API"
  );

  await saveSubscription(
    companyId,
    userId,
    subscription
  );

  await reportPushDebug(
    "Suscripción guardada correctamente"
  );

  return subscription;

}

export async function ensurePushSubscription(
  companyId: number,
  userId: number
): Promise<boolean> {

  await reportPushDebug(
    "ensurePushSubscription ejecutado",
    {
      companyId,
      userId,
    }
  );

  try {

    await subscribeToPushNotifications(
      companyId,
      userId
    );

    await reportPushDebug(
      "Registro Push finalizado correctamente"
    );

    return true;

  } catch (error) {

    await reportPushDebug(
      "Error registrando Push",
      {
        message:
          error instanceof Error
            ? error.message
            : String(error),

        name:
          error instanceof Error
            ? error.name
            : null,
      }
    );

    console.error(
      "[Push] No se pudo registrar el dispositivo:",
      error
    );

    return false;

  }

}

export async function hasPushSubscription():
  Promise<boolean> {

  if (
    !supportsPushNotifications()
  ) {

    return false;

  }

  const registration =
    await getActiveServiceWorkerRegistration();

  if (!registration) {

    return false;

  }

  const subscription =
    await registration
      .pushManager
      .getSubscription();

  console.warn(
    "[Push] hasPushSubscription:",
    Boolean(subscription)
  );

  return subscription !== null;

}

async function reportPushDebug(
  stage: string,
  data?: unknown
): Promise<void> {

  try {

    await fetch(
      "/api/push/debug",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          stage,
          data,
        }),
      }
    );

  } catch {

    /*
     * El diagnóstico nunca debe
     * interrumpir el registro Push.
     */

  }

}