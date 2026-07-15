function urlBase64ToUint8Array(
  value: string
) {

  const padding =
    "=".repeat(
      (4 - value.length % 4) %
      4
    );

  const base64 =
    (
      value +
      padding
    )
      .replace(
        /-/g,
        "+"
      )
      .replace(
        /_/g,
        "/"
      );

  const rawData =
    window.atob(
      base64
    );

  return Uint8Array.from(

    [...rawData].map(

      character =>

        character.charCodeAt(0)

    )

  );

}

export function supportsPushNotifications() {

  return (

    typeof window !==
      "undefined" &&

    "serviceWorker" in
      navigator &&

    "PushManager" in
      window &&

    "Notification" in
      window

  );

}

export async function subscribeToPushNotifications(

  companyId: number,

  userId: number

) {

  if (
    !supportsPushNotifications()
  ) {

    throw new Error(
      "Este dispositivo no admite notificaciones Push."
    );

  }

  const publicKey =
    process.env
      .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!publicKey) {

    throw new Error(
      "No se configuró la clave pública VAPID."
    );

  }

    let permission =
    Notification.permission;

    if (
    permission ===
    "default"
    ) {

    permission =
        await Notification
        .requestPermission();

    }

    if (
    permission !==
    "granted"
    ) {

    throw new Error(
        "Las notificaciones no están autorizadas en este dispositivo."
    );

    }

  const registration =
  await navigator.serviceWorker
    .getRegistration();

if (!registration) {

  throw new Error(
    "No existe un Service Worker activo."
  );

}

  let subscription =
    await registration
      .pushManager
      .getSubscription();

  if (!subscription) {

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

  }

  const serialized =
    subscription.toJSON();

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

  const result =
    await response.json();

  if (!response.ok) {

    throw new Error(

      result.message ??

      "No fue posible registrar las notificaciones."

    );

  }

  return subscription;

}

export async function hasPushSubscription() {

  if (
    !supportsPushNotifications()
  ) {

    return false;

  }

const registration =
  await navigator.serviceWorker
    .getRegistration();

if (!registration) {

  throw new Error(
    "No existe un Service Worker activo."
  );

}

  const subscription =
    await registration
      .pushManager
      .getSubscription();

  return Boolean(
    subscription
  );

}

export async function ensurePushSubscription(
  companyId: number,
  userId: number
): Promise<boolean> {

  if (
    !supportsPushNotifications()
  ) {

    return false;

  }

  if (
    Notification.permission ===
    "denied"
  ) {

    return false;

  }

  /*
   * Evita esperar indefinidamente a
   * navigator.serviceWorker.ready.
   */
  const registration =
    await navigator.serviceWorker
      .getRegistration();

  if (!registration) {

    console.warn(
      "No existe un Service Worker activo para registrar Push."
    );

    return false;

  }

  try {

    await subscribeToPushNotifications(
      companyId,
      userId
    );

    return true;

  } catch (error) {

    console.warn(
      "No fue posible registrar Push:",
      error
    );

    return false;

  }

}