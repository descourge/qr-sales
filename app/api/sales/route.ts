import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();

    /* ==========================
       Validaciones
    ========================== */

    if (
      !body.companyId ||
      !body.userId
    ) {

      return NextResponse.json(

        {
          message:
            "La sesión no es válida.",
        },

        {
          status: 400,
        }

      );

    }

    if (
      !body.items ||
      body.items.length === 0
    ) {

      return NextResponse.json(

        {
          message:
            "La venta no contiene productos.",
        },

        {
          status: 400,
        }

      );

    }

    /* ==========================
       Obtener artículos
    ========================== */

    const articles =
      await prisma.article.findMany({

        where: {

          companyId:
            body.companyId,

          id: {

            in: body.items.map(
              (item: {
                articleId: number;
              }) =>
                item.articleId
            ),

          },

        },

      });

    const articleMap =
      new Map(

        articles.map(
          article => [

            article.id,

            article,

          ]
        )

      );

    /* ==========================
       Calcular total
    ========================== */

    let total = 0;

    const details: {

      articleId: number;

      quantity: number;

      unitPrice: number;

      subtotal: number;

    }[] = [];

    for (const item of body.items) {

      const article =
        articleMap.get(
          item.articleId
        );

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

      const unitPrice =
        Number(
          article.unitPrice
        );

      const subtotal =
        unitPrice *
        item.quantity;

      total += subtotal;

      details.push({

        articleId:
          article.id,

        quantity:
          item.quantity,

        unitPrice,

        subtotal,

      });

    }

    /* ==========================
       Crear venta
    ========================== */

    const sale =
      await prisma.sale.create({

        data: {

          companyId:
            body.companyId,

          branchId:
            body.branchId,

          userId:
            body.userId,

          createdAt:
            new Date(
              body.createdAt
            ),

          latitude:
            body.latitude,

          longitude:
            body.longitude,

          total,

          details: {

            create:
              details,

          },

        },

      });

    return NextResponse.json({

      id:
        sale.id,

      createdAt:
        sale.createdAt,

      total:
        Number(
          sale.total
        ),

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {
        message:
          "No fue posible registrar la venta.",
      },

      {
        status: 500,
      }

    );

  }

}