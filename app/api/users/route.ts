import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {

  const companyId = Number(
    request.nextUrl.searchParams.get(
      "companyId"
    )
  );

  const branchId = Number(
    request.nextUrl.searchParams.get(
      "branchId"
    )
  );

  if (!companyId) {

    return NextResponse.json([]);

  }

  const users =
    await prisma.user.findMany({

      where: {

        companyId,

        ...(branchId
          ? {
              branchId,
            }
          : {}),

      },

      orderBy: {

        name: "asc",

      },

      select: {

        id: true,

        name: true,

        role: true,

      },

    });

  return NextResponse.json(
    users
  );

}