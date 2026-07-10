import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest
) {

  const {

    userId,

  } =
    await request.json();

  const user =
    await prisma.user.findUnique({

      where: {

        id: userId,

      },

      include: {

        company: true,

        branch: true,

      },

    });

  if (!user) {

    return NextResponse.json(

      {

        message:
          "Usuario no encontrado.",

      },

      {

        status: 404,

      }

    );

  }

  return NextResponse.json({

    company: {

      id:
        user.company.id,

      name:
        user.company.name,

      logoUrl:
        user.company.logoUrl,

      theme:
        user.company.theme,

    },

    branch:
      user.branch,

    user: {

      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      theme:
        user.theme,

    },

  });

}