import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let total = 0;

    const details: {
      articleId: number;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[] = [];

    for (const item of body.items) {
      const article = await prisma.article.findUnique({
        where: {
          id: item.articleId,
        },
      });

      if (!article) {
        return NextResponse.json(
          { message: "Artículo no encontrado." },
          { status: 404 }
        );
      }

      const unitPrice = Number(article.unitPrice);
      const subtotal = unitPrice * item.quantity;

      total += subtotal;

      details.push({
        articleId: article.id,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });
    }

    const sale = await prisma.sale.create({
      data: {
        latitude: body.latitude,
        longitude: body.longitude,
        total,
      },
    });

    await prisma.saleDetail.createMany({
      data: details.map((detail) => ({
        saleId: sale.id,
        articleId: detail.articleId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        subtotal: detail.subtotal,
      })),
    });

    return NextResponse.json({
      id: sale.id,
      createdAt: sale.createdAt,
      total: Number(sale.total),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "No fue posible registrar la venta.",
      },
      {
        status: 500,
      }
    );
  }
}