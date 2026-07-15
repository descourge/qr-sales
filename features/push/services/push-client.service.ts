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

  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );

}

async function getActiveServiceWorkerRegistration():
  Promise<ServiceWorkerRegistration | null> {

  const registrations =
    await navigator.serviceWorker
      .getRegistrations();

  const registration =
    registrations.find(
      item =>
        item.active !== null
    );

  return registration ?? null;

}

async function saveSubscription(
  companyId: number,
  userId: number,
  subscription: PushSubscription
): Promise<void> {

  const serialized =
    subscription.toJSON();

  console.log(
    "[Push] Suscripción que se enviará:",
    serialized
  );

  if (
    !serialized.endpoint ||
    !serialized.keys?.p256dh ||
    !serialized.keys?.auth
  ) {

    throw new Error(
      "La suscripción Push generada está incompleta."
    );

  }

  const response =
    await fetch(
      "/api/push/subscriptions",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          companyId,
          userId,
          subscription: serialized,
        }),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {

    console.error(
      "[Push] Error API:",
      response.status,
      result
    );

    throw new Error(
      result.message ??
        "No fue posible guardar la suscripción Push."
    );

  }

  console.log(
    "[Push] Dispositivo registrado:",
    result
  );

}

export async function subscribeToPushNotifications(
  companyId: number,
  userId: number
): Promise<PushSubscription> {

  if (!supportsPushNotifications()) {

    throw new Error(
      "Este dispositivo no admite Web Push."
    );

  }

  const publicKey =
    process.env
      .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!publicKey) {

    throw new Error(
      "NEXT_PUBLIC_VAPID_PUBLIC_KEY no está configurada."
    );

  }

  let permission =
    Notification.permission;

  if (permission === "default") {

    permission =
      await Notification
        .requestPermission();

  }

  if (permission !== "granted") {

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
    registration.active?.scriptURL
  );

  let subscription =
    await registration
      .pushManager
      .getSubscription();

  if (!subscription) {

    subscription =
      await registration
        .pushManager
        .subscribe({
          userVisibleOnly: true,

          applicationServerKey:
            urlBase64ToUint8Array(
              publicKey
            ),
        });

    console.log(
      "[Push] Nueva suscripción creada."
    );

  } else {

    console.log(
      "[Push] Suscripción existente encontrada."
    );

  }

  await saveSubscription(
    companyId,
    userId,
    subscription
  );

  return subscription;

}

export async function ensurePushSubscription(
  companyId: number,
  userId: number
): Promise<boolean> {

  try {

    await subscribeToPushNotifications(
      companyId,
      userId
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

  if (!supportsPushNotifications()) {

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

  return subscription !== null;

}