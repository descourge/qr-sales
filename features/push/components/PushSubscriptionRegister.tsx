"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  useSession,
} from "@/features/auth/context/SessionProvider";

import {
  hasPushSubscription,
  subscribeToPushNotifications,
  supportsPushNotifications,
} from "@/features/push/services/push-client.service";

export default function PushSubscriptionRegister() {

  const {
    session,
  } =
    useSession();

  const attemptedRef =
    useRef(false);

  useEffect(() => {

    if (
      !session ||
      attemptedRef.current
    ) {

      return;

    }

    attemptedRef.current =
      true;

    async function registerPush() {

      if (
        !supportsPushNotifications()
      ) {

        return;

      }

      try {

        const alreadySubscribed =
          await hasPushSubscription();

        if (alreadySubscribed) {

          /*
           * Aunque la suscripción ya exista en el
           * navegador, volvemos a registrarla en
           * el servidor para asociarla a la sesión
           * actual.
           */

          await subscribeToPushNotifications(

            session!.company.id,

            session!.user.id

          );

          return;

        }

        /*
         * Si el permiso ya fue concedido anteriormente,
         * podemos registrar la suscripción sin mostrar
         * nuevamente el diálogo.
         */

        if (
          Notification.permission ===
          "granted"
        ) {

          await subscribeToPushNotifications(

            session!.company.id,

            session!.user.id

          );

          return;

        }

        /*
         * No solicitamos permiso automáticamente cuando
         * todavía está en estado "default", ya que varios
         * navegadores exigen una interacción del usuario.
         */

      } catch (error) {

        console.error(
          "No fue posible registrar las notificaciones Push:",
          error
        );

      }

    }

    registerPush();

  }, [session]);

  return null;

}