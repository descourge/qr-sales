import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const categories =
      await prisma.article.findMany({

        distinct: ["category"],

        select: {
          category: true,
        },

        orderBy: {
          category: "asc",
        },

      });

    return NextResponse.json(
      categories.map(item => item.category)
    );

  } catch {

    return NextResponse.json(
      [],
      { status: 500 }
    );

  }
}