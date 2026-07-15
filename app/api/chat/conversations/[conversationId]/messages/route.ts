import {
  prisma,
} from "@/lib/prisma";

import {
  webPush,
} from "@/features/push/lib/web-push";

type ChatPushPayload = {

  conversationId: number;

  senderName: string;

  content: string;

};

export async function sendChatPushNotifications(

  receiverUserId: number,

  payload: ChatPushPayload

) {

  const subscriptions =
    await prisma.pushSubscription.findMany({

      where: {

        userId:
          receiverUserId,

      },

    });

  console.log(

    `[Push] Usuario receptor ${receiverUserId}: ${subscriptions.length} suscripción(es).`

  );

  if (
    subscriptions.length === 0
  ) {

    console.warn(

      `[Push] El usuario ${receiverUserId} no tiene dispositivos registrados.`

    );

    return;

  }

  const notificationPayload =
    JSON.stringify({

      type:
        "chat",

      title:
        payload.senderName,

      body:
        payload.content,

      url:
        `/chat?conversationId=${payload.conversationId}`,

      conversationId:
        payload.conversationId,

    });

  const results =
    await Promise.allSettled(

      subscriptions.map(

        async subscription => {

          try {

            const result =
              await webPush.sendNotification(

                {

                  endpoint:
                    subscription.endpoint,

                  keys: {

                    p256dh:
                      subscription.p256dh,

                    auth:
                      subscription.auth,

                  },

                },

                notificationPayload

              );

            console.log(

              `[Push] Envío aceptado. Suscripción ${subscription.id}. Estado: ${result.statusCode}`

            );

            return result;

          } catch (error: unknown) {

            const statusCode =

              typeof error === "object" &&
              error !== null &&
              "statusCode" in error

                ? Number(
                    error.statusCode
                  )

                : undefined;

            console.error(

              `[Push] Error en suscripción ${subscription.id}. Estado: ${statusCode ?? "desconocido"}`,

              error

            );

            if (
              statusCode === 404 ||
              statusCode === 410
            ) {

              await prisma
                .pushSubscription
                .delete({

                  where: {

                    endpoint:
                      subscription.endpoint,

                  },

                })
                .catch(
                  () => undefined
                );

            }

            throw error;

          }

        }

      )

    );

  const fulfilled =
    results.filter(

      result =>

        result.status ===
        "fulfilled"

    ).length;

  console.log(

    `[Push] Resultado: ${fulfilled}/${results.length} envío(s) aceptado(s).`

  );

}