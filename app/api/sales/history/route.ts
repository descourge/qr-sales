import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {

  try {

    const {
      searchParams,
    } = new URL(request.url);

    const companyId =
      Number(
        searchParams.get(
          "companyId"
        )
      );

    if (!companyId) {

      return NextResponse.json(

        {
          message:
            "companyId es obligatorio.",
        },

        {
          status: 400,
        }

      );

    }

    const startDate =
      searchParams.get(
        "startDate"
      );

    const endDate =
      searchParams.get(
        "endDate"
      );

    const branchId =
      searchParams.get(
        "branchId"
      );

    const userId =
      searchParams.get(
        "userId"
      );

    /* ==========================
       Filtros
    ========================== */

    const where: any = {

      companyId,

    };

    if (startDate || endDate) {

      where.createdAt = {};

      if (startDate) {

        where.createdAt.gte =
          new Date(startDate);

      }

      if (endDate) {

        const end =
          new Date(endDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        where.createdAt.lte =
          end;

      }

    }

    if (branchId) {

      where.branchId =
        Number(branchId);

    }

    if (userId) {

      where.userId =
        Number(userId);

    }

    /* ==========================
       Consultar ventas
    ========================== */

    const sales =
      await prisma.sale.findMany({

        where,

        orderBy: {

          createdAt: "desc",

        },

        include: {

          branch: true,

          user: true,

          details: {

            include: {

              article: true,

            },

          },

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
          "No fue posible obtener el historial de ventas.",

      },

      {

        status: 500,

      }

    );

  }

}