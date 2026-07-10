import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {

  const companyId =
    Number(
      request.nextUrl.searchParams.get(
        "companyId"
      )
    );

  if (!companyId) {

    return NextResponse.json([]);

  }

  const sales =
    await prisma.sale.findMany({

      where: {

        companyId,

      },

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

}