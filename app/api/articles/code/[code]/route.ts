import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      code: string;
    }>;
  }
) {

  try {

    const {
      code,
    } = await params;

    const companyId =
      Number(
        request.nextUrl.searchParams.get(
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

    const article =
      await prisma.article.findFirst({

        where: {

          companyId,

          code,

        },

        include: {

          category: true,

        },

      });

    if (!article) {

      return NextResponse.json(

        {
          message:
            "Artículo no encontrado.",
        },

        {
          status: 404,
        }

      );

    }

    return NextResponse.json(
      article
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {
        message:
          "No fue posible obtener el artículo.",
      },

      {
        status: 500,
      }

    );

  }

}