import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {

  try {

    const { searchParams } =
      new URL(request.url);

    const companyId =
      Number(
        searchParams.get("companyId")
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

    const articles =
      await prisma.article.findMany({

        where: {

          companyId,

        },

        include: {

          category: true,

        },

        orderBy: {

          code: "asc",

        },

      });

    return NextResponse.json(
      articles
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        message:
          "No fue posible obtener los artículos.",

      },

      {

        status: 500,

      }

    );

  }

}

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();

    const exists =
      await prisma.article.findFirst({

        where: {

          companyId:
            body.companyId,

          code:
            body.code,

        },

      });

    if (exists) {

      return NextResponse.json(

        {

          message:
            "Ya existe un artículo con ese código.",

        },

        {

          status: 400,

        }

      );

    }

    const article =
      await prisma.article.create({

        data: {

          companyId:
            body.companyId,

          categoryId:
            body.categoryId,

          code:
            body.code,

          description:
            body.description,

          unitPrice:
            Number(
              body.unitPrice
            ),

        },

        include: {

          category: true,

        },

      });

    return NextResponse.json(
      article,
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        message:
          "No fue posible crear el artículo.",

      },

      {

        status: 500,

      }

    );

  }

}