import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: {
        code: "asc",
    },
  });

  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar si ya existe un artículo con el mismo código
    const exists = await prisma.article.findUnique({
      where: {
        code: body.code,
      },
    });

    if (exists) {
      return NextResponse.json(
        {
          message: "Ya existe un artículo con ese código.",
        },
        {
          status: 400,
        }
      );
    }

    const article = await prisma.article.create({
      data: {
        code: body.code,
        description: body.description,
        category: body.category,
        unitPrice: Number(body.unitPrice),
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "No fue posible crear el artículo." },
      { status: 500 }
    );
  }
}