import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

type SubscriptionBody = {

  companyId?: number;

  userId?: number;

  subscription?: {

    endpoint?: string;

    keys?: {

      p256dh?: string;

      auth?: string;

    };

  };

};

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json() as
        SubscriptionBody;

    const companyId =
      Number(body.companyId);

    const userId =
      Number(body.userId);

    const endpoint =
      body.subscription
        ?.endpoint
        ?.trim();

    const p256dh =
      body.subscription
        ?.keys
        ?.p256dh
        ?.trim();

    const auth =
      body.subscription
        ?.keys
        ?.auth
        ?.trim();

    if (
      !companyId ||
      !userId ||
      !endpoint ||
      !p256dh ||
      !auth
    ) {

      return NextResponse.json(
        {
          message:
            "La suscripción Push no es válida.",
        },
        {
          status: 400,
        }
      );

    }

    const user =
      await prisma.user.findFirst({

        where: {

          id:
            userId,

          companyId,

        },

        select: {

          id: true,

        },

      });

    if (!user) {

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

    const subscription =
      await prisma.pushSubscription.upsert({

        where: {

          endpoint,

        },

        update: {

          userId,

          p256dh,

          auth,

        },

        create: {

          userId,

          endpoint,

          p256dh,

          auth,

        },

        select: {

          id: true,

        },

      });

    return NextResponse.json(
      subscription,
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "No fue posible registrar la suscripción Push:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No fue posible registrar las notificaciones.",
      },
      {
        status: 500,
      }
    );

  }

}