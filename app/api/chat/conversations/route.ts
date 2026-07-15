import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

/* ===========================================
   LISTAR CONVERSACIONES
=========================================== */

export async function GET(
  request: NextRequest
) {

  try {

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

    if (
      !companyId ||
      !userId
    ) {

      return NextResponse.json(
        {
          message:
            "companyId y userId son obligatorios.",
        },
        {
          status: 400,
        }
      );

    }

    const currentUser =
      await prisma.user.findFirst({
        where: {
          id: userId,
          companyId,
        },
        select: {
          id: true,
        },
      });

    if (!currentUser) {

      return NextResponse.json(
        {
          message:
            "Usuario no autorizado.",
        },
        {
          status: 403,
        }
      );

    }

    const conversations =
      await prisma.conversation.findMany({
        where: {
          companyId,
          participants: {
            some: {
              userId,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                  branch: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          messages: {
            orderBy: {
              id: "desc",
            },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

    const result =
      conversations.map(
        conversation => {

          const otherParticipant =
            conversation.participants.find(
              participant =>
                participant.userId !==
                userId
            );

          return {
            id:
              conversation.id,

            companyId:
              conversation.companyId,

            createdAt:
              conversation.createdAt,

            updatedAt:
              conversation.updatedAt,

            otherUser:
              otherParticipant?.user ??
              null,

            lastMessage:
              conversation.messages[0] ??
              null,
          };

        }
      );

    return NextResponse.json(
      result
    );

  } catch (error) {

    console.error(
      "No fue posible obtener las conversaciones:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No fue posible obtener las conversaciones.",
      },
      {
        status: 500,
      }
    );

  }

}

/* ===========================================
   CREAR O RECUPERAR CONVERSACIÓN
=========================================== */

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();

    const companyId =
      Number(body.companyId);

    const userId =
      Number(body.userId);

    const targetUserId =
      Number(body.targetUserId);

    if (
      !companyId ||
      !userId ||
      !targetUserId
    ) {

      return NextResponse.json(
        {
          message:
            "companyId, userId y targetUserId son obligatorios.",
        },
        {
          status: 400,
        }
      );

    }

    if (
      userId === targetUserId
    ) {

      return NextResponse.json(
        {
          message:
            "No puede iniciar una conversación consigo mismo.",
        },
        {
          status: 400,
        }
      );

    }

    const users =
      await prisma.user.findMany({
        where: {
          companyId,
          id: {
            in: [
              userId,
              targetUserId,
            ],
          },
        },
        select: {
          id: true,
        },
      });

    if (
      users.length !== 2
    ) {

      return NextResponse.json(
        {
          message:
            "Los usuarios no pertenecen a la misma empresa.",
        },
        {
          status: 403,
        }
      );

    }

    const possibleConversations =
      await prisma.conversation.findMany({
        where: {
          companyId,
          AND: [
            {
              participants: {
                some: {
                  userId,
                },
              },
            },
            {
              participants: {
                some: {
                  userId:
                    targetUserId,
                },
              },
            },
          ],
        },
        include: {
          participants: {
            select: {
              userId: true,
            },
          },
        },
      });

    const existingConversation =
      possibleConversations.find(
        conversation =>
          conversation.participants
            .length === 2
      );

    if (existingConversation) {

      return NextResponse.json(
        {
          id:
            existingConversation.id,
        }
      );

    }

    const conversation =
      await prisma.conversation.create({
        data: {
          companyId,
          participants: {
            create: [
              {
                userId,
              },
              {
                userId:
                  targetUserId,
              },
            ],
          },
        },
        select: {
          id: true,
        },
      });

    return NextResponse.json(
      conversation,
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "No fue posible crear la conversación:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No fue posible crear la conversación.",
      },
      {
        status: 500,
      }
    );

  }

}