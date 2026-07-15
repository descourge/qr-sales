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

  console.log(
    "[Push] Soporte disponible:",
    supported
  );

  return supported;

}

async function getActiveServiceWorkerRegistration():
  Promise<ServiceWorkerRegistration | null> {

  console.log(
    "[Push] Buscando Service Worker..."
  );

  const directRegistration =
    await navigator.serviceWorker
      .getRegistration();

  if (
    directRegistration?.active
  ) {

    console.log(
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

  console.log(
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

  console.log(
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

  console.log(
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

  console.log(
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

  console.log(
    "[Push] Iniciando registro:",
    {
      companyId,
      userId,
    }
  );

  if (
    !supportsPushNotifications()
  ) {

    throw new Error(
      "Este dispositivo no admite Web Push."
    );

  }

  const publicKey =
    process.env
      .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  console.log(
    "[Push] Clave VAPID pública disponible:",
    Boolean(publicKey)
  );

  if (!publicKey) {

    throw new Error(
      "NEXT_PUBLIC_VAPID_PUBLIC_KEY no está configurada."
    );

  }

  let permission =
    Notification.permission;

  console.log(
    "[Push] Permiso actual:",
    permission
  );

  if (
    permission ===
    "default"
  ) {

    console.log(
      "[Push] Solicitando permiso..."
    );

    permission =
      await Notification
        .requestPermission();

    console.log(
      "[Push] Permiso obtenido:",
      permission
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

  const registration =
    await getActiveServiceWorkerRegistration();

  if (!registration) {

    throw new Error(
      "No existe un Service Worker activo."
    );

  }

  console.log(
    "[Push] Service Worker activo:",
    {
      scope:
        registration.scope,

      scriptURL:
        registration.active
          ?.scriptURL,
    }
  );

  let subscription =
    await registration
      .pushManager
      .getSubscription();

  console.log(
    "[Push] Suscripción existente:",
    subscription
      ? subscription.toJSON()
      : null
  );

  if (!subscription) {

    console.log(
      "[Push] Creando nueva suscripción..."
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

    console.log(
      "[Push] Nueva suscripción creada:",
      subscription.toJSON()
    );

  }

  await saveSubscription(
    companyId,
    userId,
    subscription
  );

  console.log(
    "[Push] Registro completado correctamente."
  );

  return subscription;

}

export async function ensurePushSubscription(
  companyId: number,
  userId: number
): Promise<boolean> {

  console.log(
    "[Push] ensurePushSubscription ejecutado."
  );

  try {

    await subscribeToPushNotifications(
      companyId,
      userId
    );

    console.log(
      "[Push] Dispositivo registrado."
    );

    return true;

  } catch (error) {

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

  console.log(
    "[Push] hasPushSubscription:",
    Boolean(subscription)
  );

  return subscription !== null;

}