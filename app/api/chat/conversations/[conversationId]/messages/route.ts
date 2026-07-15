import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  sendChatPushNotifications,
} from "@/features/push/services/push.service";

type RouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

/* ===========================================
   VALIDAR ACCESO
=========================================== */

async function validateConversationAccess(
  conversationId: number,
  companyId: number,
  userId: number
) {

  return prisma.conversation.findFirst({
    where: {
      id:
        conversationId,

      companyId,

      participants: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
    },
  });

}

/* ===========================================
   OBTENER MENSAJES
=========================================== */

export async function GET(
  request: NextRequest,
  context: RouteContext
) {

  try {

    const {
      conversationId:
        conversationIdParam,
    } =
      await context.params;

    const conversationId =
      Number(
        conversationIdParam
      );

    const companyId =
      Number(
        request.nextUrl.searchParams.get(
          "companyId"
        )
      );

    const userId =
      Number(
        request.nextUrl.searchParams.get(
          "userId"
        )
      );

    const afterId =
      Number(
        request.nextUrl.searchParams.get(
          "afterId"
        )
      );

    if (
      !conversationId ||
      !companyId ||
      !userId
    ) {

      return NextResponse.json(
        {
          message:
            "conversationId, companyId y userId son obligatorios.",
        },
        {
          status: 400,
        }
      );

    }

    const conversation =
      await validateConversationAccess(
        conversationId,
        companyId,
        userId
      );

    if (!conversation) {

      return NextResponse.json(
        {
          message:
            "No tiene acceso a esta conversación.",
        },
        {
          status: 403,
        }
      );

    }

    const messages =
      await prisma.message.findMany({
        where: {
          conversationId,

          ...(afterId
            ? {
                id: {
                  gt: afterId,
                },
              }
            : {}),
        },
        orderBy: {
          id: "asc",
        },
        take: afterId
          ? 100
          : 200,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    return NextResponse.json(
      messages
    );

  } catch (error) {

    console.error(
      "No fue posible obtener los mensajes:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No fue posible obtener los mensajes.",
      },
      {
        status: 500,
      }
    );

  }

}

/* ===========================================
   ENVIAR MENSAJE
=========================================== */

export async function POST(
  request: NextRequest,
  context: RouteContext
) {

  try {

    const {
      conversationId:
        conversationIdParam,
    } =
      await context.params;

    const conversationId =
      Number(
        conversationIdParam
      );

    const body =
      await request.json();

    const companyId =
      Number(body.companyId);

    const userId =
      Number(body.userId);

    const content =
      typeof body.content ===
      "string"

        ? body.content.trim()

        : "";

    if (
      !conversationId ||
      !companyId ||
      !userId ||
      !content
    ) {

      return NextResponse.json(
        {
          message:
            "conversationId, companyId, userId y content son obligatorios.",
        },
        {
          status: 400,
        }
      );

    }

    if (
      content.length > 1000
    ) {

      return NextResponse.json(
        {
          message:
            "El mensaje no puede superar los 1000 caracteres.",
        },
        {
          status: 400,
        }
      );

    }

    const conversation =
      await prisma.conversation.findFirst({

        where: {

          id:
            conversationId,

          companyId,

          participants: {

            some: {

              userId,

            },

          },

        },

        include: {

          participants: {

            select: {

              userId: true,

            },

          },

        },

      });

    if (!conversation) {

      return NextResponse.json(
        {
          message:
            "No tiene acceso a esta conversación.",
        },
        {
          status: 403,
        }
      );

    }

    const receiver =
      conversation.participants.find(

        participant =>

          participant.userId !==
          userId

      );

    if (!receiver) {

      return NextResponse.json(
        {
          message:
            "No fue posible identificar al destinatario.",
        },
        {
          status: 400,
        }
      );

    }

    const message =
      await prisma.$transaction(

        async transaction => {

          const createdMessage =
            await transaction.message.create({

              data: {

                conversationId,

                senderId:
                  userId,

                content,

              },

              include: {

                sender: {

                  select: {

                    id: true,

                    name: true,

                  },

                },

              },

            });

          await transaction
            .conversation
            .update({

              where: {

                id:
                  conversationId,

              },

              data: {

                updatedAt:
                  new Date(),

              },

            });

          return createdMessage;

        }

      );

    /*
     * La respuesta del mensaje no debe depender
     * de que el proveedor Push esté disponible.
     */

    void sendChatPushNotifications(

      receiver.userId,

      {

        conversationId,

        senderName:
          message.sender.name,

        content:
          message.content,

      }

    ).catch(error => {

      console.error(
        "El mensaje fue guardado, pero la notificación falló:",
        error
      );

    });

    return NextResponse.json(
      message,
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "No fue posible enviar el mensaje:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No fue posible enviar el mensaje.",
      },
      {
        status: 500,
      }
    );

  }

}