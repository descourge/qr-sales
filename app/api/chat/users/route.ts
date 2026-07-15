import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

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

    const users =
      await prisma.user.findMany({
        where: {
          companyId,
          id: {
            not: userId,
          },
        },
        orderBy: {
          name: "asc",
        },
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
      });

    return NextResponse.json(
      users
    );

  } catch (error) {

    console.error(
      "No fue posible obtener los usuarios del chat:",
      error
    );

    return NextResponse.json(
      {
        message:
          "No fue posible obtener los usuarios.",
      },
      {
        status: 500,
      }
    );

  }

}