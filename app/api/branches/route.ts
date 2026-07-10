import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {

  const companyId = Number(
    request.nextUrl.searchParams.get(
      "companyId"
    )
  );

  if (!companyId) {

    return NextResponse.json([]);

  }

  const branches =
    await prisma.branch.findMany({

      where: {

        companyId,

        isActive: true,

      },

      orderBy: {

        name: "asc",

      },

      select: {

  id: true,

  name: true,

  companyId: true,

},

    });

  return NextResponse.json(
    branches
  );

}