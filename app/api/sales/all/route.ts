import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const sales =
      await prisma.sale.findMany({

        include: {

          branch: true,

          user: true,

          details: {

            include: {

              article: {

                include: {

                  category: true,

                },

              },

            },

          },

        },

        orderBy: {

          createdAt: "desc",

        },

      });

    return NextResponse.json(
      sales
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        message:
          "No fue posible obtener las ventas.",

      },

      {

        status: 500,

      }

    );

  }

}