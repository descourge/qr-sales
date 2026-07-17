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

type DeleteSubscriptionBody = {
  companyId?: number;
  userId?: number;
  endpoint?: string;
};

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json() as
        SubscriptionBody;

    console.log(
      "[Push API] Body recibido:",
      JSON.stringify(body, null, 2)
    );

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

    console.log(
      "[Push API] Datos procesados:",
      {
        companyId,
        userId,
        hasEndpoint:
          Boolean(endpoint),
        hasP256dh:
          Boolean(p256dh),
        hasAuth:
          Boolean(auth),
      }
    );

    if (
      !companyId ||
      !userId ||
      !endpoint ||
      !p256dh ||
      !auth
    ) {

      console.warn(
        "[Push API] Suscripción inválida."
      );

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

    console.log(
      "[Push API] Buscando usuario..."
    );

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

      console.warn(
        "[Push API] Usuario no encontrado."
      );

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

    console.log(
      "[Push API] Usuario encontrado."
    );

    console.log(
      "[Push API] Ejecutando upsert..."
    );

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

          userId: true,

          endpoint: true,

        },

      });

    console.log(
      "[Push API] Suscripción registrada:",
      subscription
    );

    return NextResponse.json(
      subscription,
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "[Push API] Error registrando suscripción:",
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

export async function DELETE(
  request: NextRequest
) {

  try {

    const body =
      await request.json() as
        DeleteSubscriptionBody;

    const companyId =
      Number(body.companyId);

    const userId =
      Number(body.userId);

    const endpoint =
      body.endpoint?.trim();

    if (
      !companyId ||
      !userId ||
      !endpoint
    ) {

      return NextResponse.json(
        {
          message:
            "Los datos de la suscripción no son válidos.",
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

    await prisma.pushSubscription.deleteMany({
      where: {
        endpoint,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "[Push API] No fue posible desvincular la suscripción:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No fue posible desvincular las notificaciones.",
      },
      {
        status: 500,
      }
    );

  }

}