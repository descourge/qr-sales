import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { date_ini, date_fin, category } = await req.json();

    const today = new Date(date_ini);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(date_fin);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const categoryFilter = category ? { category } : {};

    // Ventas de hoy
    const todaySales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        details:{
            some: {
                article:{
                        category: category,
                }
            }
        }
      },
    });

    const salesCount = todaySales.length;

    const totalSales = todaySales.reduce(
      (sum, sale) => sum + Number(sale.total),
      0
    );

    const averageSale =
      salesCount === 0
        ? 0
        : totalSales / salesCount;

    // Artículos vendidos hoy
    const todayItems = await prisma.saleDetail.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        sale: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
          details:{
            some: {
                article:{
                        category: category,
                }
            }
        }
        },
      },
    });

    // Últimas ventas
    const lastSales = await prisma.sale.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
        },
        details:{
            some: {
                article:{
                        category: category,
                }
            }
        }
      },
    });

    // Top productos
    const topProducts =
      await prisma.saleDetail.groupBy({
        by: ["articleId"],

        _sum: {
          quantity: true,
        },

        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },

        take: 20,
      });

    const products = await Promise.all(
      topProducts.map(async (item) => {
        const article =
          await prisma.article.findUnique({
            where: {
              id: item.articleId,
            },
          });

        return {
          code: article?.code,
          description: article?.description,
          quantity: item._sum.quantity ?? 0,
          category: article?.category ?? "",
        };
      })
    );

    return NextResponse.json({
      salesCount,
      totalSales,
      averageSale,
      itemsSold:
        todayItems._sum.quantity ?? 0,
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