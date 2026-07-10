import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {

  try {

    const { searchParams } =
      new URL(request.url);

    const companyId = Number(
      searchParams.get("companyId")
    );

    if (!companyId) {

      return NextResponse.json(
        {
          message: "companyId es obligatorio.",
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

    const categoryId = Number(
      searchParams.get("categoryId")
    );

    /* ==========================
       FILTROS
    ========================== */

    const saleWhere: any = {
      companyId,
    };

    if (startDate || endDate) {

      saleWhere.createdAt = {};

      if (startDate) {

        saleWhere.createdAt.gte =
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

        saleWhere.createdAt.lte =
          end;

      }

    }

    if (!Number.isNaN(categoryId) && categoryId > 0) {

      saleWhere.details = {

        some: {

          article: {

            categoryId,

          },

        },

      };

    }

    /* ==========================
       KPIs
    ========================== */

    const summary =
      await prisma.sale.aggregate({

        where: saleWhere,

        _count: {
          id: true,
        },

        _sum: {
          total: true,
        },

        _avg: {
          total: true,
        },

      });

    /* ==========================
       ARTÍCULOS VENDIDOS
    ========================== */

    const itemsSold =
      await prisma.saleDetail.aggregate({

        _sum: {
          quantity: true,
        },

        where: {

          sale: saleWhere,

          ...(!Number.isNaN(categoryId) &&
            categoryId > 0 && {

              article: {

                categoryId,

              },

            }),

        },

      });

    /* ==========================
       ÚLTIMAS VENTAS
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
       PRODUCTOS MÁS VENDIDOS
    ========================== */

    const topProducts =
      await prisma.saleDetail.groupBy({

        by: ["articleId"],

        where: {

          sale: saleWhere,

          ...(!Number.isNaN(categoryId) &&
            categoryId > 0 && {

              article: {

                categoryId,

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

    const articleIds =
      topProducts.map(
        item => item.articleId
      );

    const articles =
      await prisma.article.findMany({

        where: {

          id: {

            in: articleIds,

          },

        },

        include: {

          category: true,

        },

      });

    const articleMap =
      new Map(

        articles.map(article => [

          article.id,

          article,

        ])

      );

    const products =
      topProducts.map(item => {

        const article =
          articleMap.get(
            item.articleId
          );

        return {

          articleId:
            article?.id,

          code:
            article?.code,

          description:
            article?.description,

          categoryId:
            article?.categoryId,

          category:
            article?.category.name,

          quantity:
            item._sum.quantity ?? 0,

        };

      });

    return NextResponse.json({

      salesCount:
        summary._count.id,

      totalSales:
        Number(
          summary._sum.total ?? 0
        ),

      averageSale:
        Number(
          summary._avg.total ?? 0
        ),

      itemsSold:
        itemsSold._sum.quantity ?? 0,

      topProducts:
        products,

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