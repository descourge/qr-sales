import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {

  try {

    const { searchParams } =
      new URL(request.url);

    const companyId =
      Number(
        searchParams.get(
          "companyId"
        )
      );

    if (!companyId) {

      return NextResponse.json(
        {
          message:
            "companyId es obligatorio.",
        },
        {
          status: 400,
        }
      );

    }

    const categories =
      await prisma.category.findMany({

        where: {

          companyId,

        },

        orderBy: {

          name: "asc",

        },

      });

    return NextResponse.json(
      categories
    );

  } catch {

    return NextResponse.json(
      {
        message:
          "No fue posible obtener las categorías.",
      },
      {
        status: 500,
      }
    );

  }

}