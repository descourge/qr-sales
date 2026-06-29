import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;

    const article = await prisma.article.findUnique({
        where: {
            code,
        },
    });

    if (!article) {
        return NextResponse.json(
            {
                message: "Artículo no encontrado.",
            },
            {
                status: 404,
            }
        );
    }

    return NextResponse.json(article);
}