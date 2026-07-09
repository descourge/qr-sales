import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const startDate =
      searchParams.get("startDate");

    const endDate =
      searchParams.get("endDate");

    const category =
      searchParams.get("category");

    /* ==========================
       Filtros dinámicos
    ========================== */

    const saleWhere: any = {};

    if (startDate || endDate) {

      saleWhere.createdAt = {};

      if (startDate) {

        saleWhere.createdAt.gte =
          new Date(startDate);

      }

      if (endDate) {

        const end = new Date(endDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        saleWhere.createdAt.lte = end;

      }

    }

    if (category) {

      saleWhere.details = {
        some: {
          article: {
            category,
          },
        },
      };

    }

    /* ==========================
       Ventas
    ========================== */

    const sales =
      await prisma.sale.findMany({
        where: saleWhere,
      });

    const salesCount =
      sales.length;

    const totalSales =
      sales.reduce(
        (sum, sale) =>
          sum + Number(sale.total),
        0
      );

    const averageSale =
      salesCount === 0
        ? 0
        : totalSales / salesCount;

    /* ==========================
       Artículos vendidos
    ========================== */

    const itemsSold =
      await prisma.saleDetail.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          sale: saleWhere,
          ...(category && {
            article: {
              category,
            },
          }),
        },
      });

    /* ==========================
       Últimas ventas
    ========================== */

    const lastSales =
      await prisma.sale.findMany({
        where: saleWhere,
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      });

    /* ==========================
       Productos más vendidos
    ========================== */

    const topProducts =
      await prisma.saleDetail.groupBy({
        by: ["articleId"],

        where: {
          sale: saleWhere,
          ...(category && {
            article: {
              category,
            },
          }),
        },

        _sum: {
          quantity: true,
        },

        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },

        take: 5,
      });

    const products =
      await Promise.all(
        topProducts.map(
          async (item) => {

            const article =
              await prisma.article.findUnique({
                where: {
                  id: item.articleId,
                },
              });

            return {
              code:
                article?.code,
              description:
                article?.description,
              category:
                article?.category,
              quantity:
                item._sum.quantity ?? 0,
            };

          }
        )
      );

    return NextResponse.json({
      salesCount,
      totalSales,
      averageSale,
      itemsSold:
        itemsSold._sum.quantity ?? 0,
      topProducts: products,
      lastSales,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "No fue posible obtener el dashboard.",
      },
      {
        status: 500,
      }
    );

  }
}