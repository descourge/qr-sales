import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  Prisma,
} from "@prisma/client";

import {
  prisma,
} from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {

  try {

    const {
      searchParams,
    } = new URL(request.url);

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

    const startDate =
      searchParams.get("startDate");

    const endDate =
      searchParams.get("endDate");

    const branchId =
      searchParams.get("branchId");

    const userId =
      searchParams.get("userId");

    /* ==========================
       Filtros
    ========================== */

    const where:
      Prisma.SaleWhereInput = {

      companyId,

    };

    if (
      startDate ||
      endDate
    ) {

      where.createdAt = {};

      if (startDate) {

        where.createdAt.gte =
          new Date(startDate);

      }

      if (endDate) {

        const end =
          new Date(endDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        where.createdAt.lte =
          end;

      }

    }

    if (branchId) {

      where.branchId =
        Number(branchId);

    }

    if (userId) {

      where.userId =
        Number(userId);

    }

    /* ==========================
       Ventas
    ========================== */

    const sales =
      await prisma.sale.findMany({

        where,

        select: {

          total: true,

        },

      });

    const totalSales =
      sales.length;

    const totalAmount =
      sales.reduce(

        (sum, sale) =>

          sum +
          Number(sale.total),

        0

      );

    const averageTicket =

      totalSales === 0

        ? 0

        : totalAmount /
          totalSales;

    /* ==========================
       Reporte sucursales
    ========================== */

    const branches =
      await prisma.branch.findMany({

        where: {

          companyId,

        },

        include: {

          sales: {

            where,

          },

        },

      });

const branchReport =
  branches

    .map(branch => ({

      id:
        branch.id,

      name:
        branch.name,

      sales:
        branch.sales.length,

      total:

        branch.sales.reduce(

          (sum, sale) =>

            sum +
            Number(sale.total),

          0

        ),

    }))

.sort((a, b) => {

  if (b.total !== a.total) {

    return b.total - a.total;

  }

  return b.sales - a.sales;

})

    /* ==========================
       Reporte vendedores
    ========================== */

    const sellers =
      await prisma.user.findMany({

        where: {

          companyId,

          role: "CASHIER",

        },

        include: {

          branch: true,

          sales: {

            where,

          },

        },

      });

const sellerReport =
  sellers

    .map(user => ({

      id:
        user.id,

      name:
        user.name,

      branch:
        user.branch?.name ??
        "Sin sucursal",

      sales:
        user.sales.length,

      total:

        user.sales.reduce(

          (sum, sale) =>

            sum +
            Number(
              sale.total
            ),

          0

        ),

    }))

.sort((a, b) => {

  if (b.total !== a.total) {

    return b.total - a.total;

  }

  return b.sales - a.sales;

});

    /* ==========================
       Productos
    ========================== */

    const details =
      await prisma.saleDetail.findMany({

        where: {

          sale: where,

        },

        include: {

          article: true,

        },

      });

    const productMap =
      new Map<

        number,

        {

          id: number;

          name: string;

          quantity: number;

          total: number;

        }

      >();

    for (const detail of details) {

      const current =
        productMap.get(
          detail.articleId
        );

      if (current) {

        current.quantity +=
          detail.quantity;

        current.total +=
          Number(
            detail.subtotal
          );

      } else {

        productMap.set(

          detail.articleId,

          {

            id:
              detail.articleId,

            name:
              detail.article.description,

            quantity:
              detail.quantity,

            total:
              Number(
                detail.subtotal
              ),

          }

        );

      }

    }

    const productReport =

      [...productMap.values()]

        .sort(

          (a, b) =>

            b.quantity -
            a.quantity

        )

.slice(0, 10);

    /* ==========================
       Respuesta
    ========================== */

    return NextResponse.json({

      summary: {

        totalSales,

        totalAmount,

        averageTicket,

      },

      branches:
        branchReport,

      sellers:
        sellerReport,

      products:
        productReport,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        message:
          "No fue posible generar el reporte.",

      },

      {

        status: 500,

      }

    );

  }

}