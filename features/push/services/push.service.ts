import {
  prisma,
} from "@/lib/prisma";

import {
  webPush,
} from "@/features/push/lib/web-push";

import {
  useSearchParams,
} from "next/navigation";

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

  if (
    subscriptions.length === 0
  ) {

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

  await Promise.allSettled(

    subscriptions.map(
      async subscription => {

        try {

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

        } catch (error: unknown) {

          const statusCode =

            typeof error === "object" &&
            error !== null &&
            "statusCode" in error

              ? Number(
                  error.statusCode
                )

              : undefined;

          /*
           * 404 y 410 indican normalmente que
           * la suscripción ya no es válida.
           */

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
              .catch(() => undefined);

            return;

          }

          console.error(
            "No fue posible enviar una notificación Push:",
            error
          );

        }

      }
    )

  );

}