import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const sales = await prisma.sale.findMany({

    orderBy: {
      createdAt: "desc",
    },

    include: {
        details: {
            include: {
            article: true,
            },
        },
        },

  });

  return NextResponse.json(sales);
}