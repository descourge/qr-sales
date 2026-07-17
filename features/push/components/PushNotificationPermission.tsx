"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Bell,
  BellOff,
  LoaderCircle,
  X,
} from "lucide-react";

import {
  ensurePushSubscription,
  supportsPushNotifications,
} from "@/features/push/services/push-client.service";

type PushNotificationPermissionProps = {
  companyId: number;
  userId: number;
};

type PermissionState =
  | NotificationPermission
  | "unsupported";

export default function PushNotificationPermission({
  companyId,
  userId,
}: PushNotificationPermissionProps) {

  const [
    permission,
    setPermission,
  ] =
    useState<PermissionState>(
      "default"
    );

  const [
    registering,
    setRegistering,
  ] =
    useState(false);

  const [
    dismissed,
    setDismissed,
  ] =
    useState(false);

  const registerSubscription =
    useCallback(
      async () => {

        setRegistering(true);

        try {

          const success =
            await ensurePushSubscription(
              companyId,
              userId
            );

          if (success) {

            setPermission(
              Notification.permission
            );

          }

        } finally {

          setRegistering(false);

        }

      },
      [
        companyId,
        userId,
      ]
    );

  useEffect(() => {

    if (
      !supportsPushNotifications()
    ) {

      setPermission(
        "unsupported"
      );

      return;

    }

    const currentPermission =
      Notification.permission;

    setPermission(
      currentPermission
    );

    /*
     * Si el usuario ya dio permiso,
     * podemos registrar o actualizar
     * silenciosamente la suscripción.
     */
    if (
      currentPermission ===
      "granted"
    ) {

      void registerSubscription();

    }

  }, [registerSubscription]);

  async function handleEnableNotifications() {

    if (
      !supportsPushNotifications()
    ) {

      setPermission(
        "unsupported"
      );

      return;

    }

    setRegistering(true);

    try {

      /*
       * ensurePushSubscription solicita
       * el permiso cuando está en default
       * y luego registra el dispositivo.
       */
      const success =
        await ensurePushSubscription(
          companyId,
          userId
        );

      setPermission(
        Notification.permission
      );

      if (success) {

        setDismissed(true);

      }

    } finally {

      setRegistering(false);

    }

  }

  if (
    permission === "granted" ||
    permission === "unsupported" ||
    dismissed
  ) {

    return null;

  }

  if (
    permission === "denied"
  ) {

    return (

      <div
        className="
          flex
          items-start
          gap-4
          rounded-xl
          border
          border-amber-200
          bg-amber-50
          p-4
        "
      >

        <BellOff
          size={24}
          className="
            mt-0.5
            shrink-0
            text-amber-600
          "
        />

        <div className="min-w-0 flex-1">

          <p
            className="
              font-semibold
              text-amber-900
            "
          >

            Las notificaciones están bloqueadas

          </p>

          <p
            className="
              mt-1
              text-sm
              text-amber-800
            "
          >

            Para recibir avisos de nuevos mensajes, habilita las
            notificaciones desde la configuración del navegador.

          </p>

        </div>

        <button
          type="button"
          onClick={
            () =>
              setDismissed(true)
          }
          className="
            rounded-md
            p-1
            text-amber-700
            hover:bg-amber-100
          "
          aria-label="Cerrar aviso"
        >

          <X size={18} />

        </button>

      </div>

    );

  }

  return (

    <div
      className="
        flex
        flex-col
        gap-4
        rounded-xl
        border
        border-blue-200
        bg-blue-50
        p-4
        sm:flex-row
        sm:items-center
      "
    >

      <div
        className="
          flex
          min-w-0
          flex-1
          items-start
          gap-4
        "
      >

        <Bell
          size={24}
          className="
            mt-0.5
            shrink-0
            text-blue-600
          "
        />

        <div>

          <p
            className="
              font-semibold
              text-blue-950
            "
          >

            Activa las notificaciones

          </p>

          <p
            className="
              mt-1
              text-sm
              text-blue-800
            "
          >

            Recibe avisos cuando otro usuario te envíe un mensaje.

          </p>

        </div>

      </div>

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <button
          type="button"
          onClick={
            handleEnableNotifications
          }
          disabled={
            registering
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          {registering ? (

            <LoaderCircle
              size={18}
              className="animate-spin"
            />

          ) : (

            <Bell size={18} />

          )}

          {registering
            ? "Activando..."
            : "Activar"}

        </button>

        <button
          type="button"
          onClick={
            () =>
              setDismissed(true)
          }
          className="
            rounded-lg
            p-2
            text-blue-700
            hover:bg-blue-100
          "
          aria-label="Cerrar aviso"
        >

          <X size={18} />

        </button>

      </div>

    </div>

  );

}