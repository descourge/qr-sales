import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    await prisma.article.delete({
        where: {
            id: Number(id),
        },
    });

    return NextResponse.json({
        success: true,
    });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await request.json();

  const article = await prisma.article.update({
    where: {
      id: Number(id),
    },
    data: {
      code: body.code,
      description: body.description,
      category: body.category,
      unitPrice: body.unitPrice,
    },
  });

  return NextResponse.json(article);
}