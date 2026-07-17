import {
  NextRequest,
  NextResponse,
} from "next/server";

type PushDebugBody = {
  stage?: string;
  data?: unknown;
};

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json() as
        PushDebugBody;

    console.warn(
      "[Push Debug]",
      body.stage ?? "Etapa desconocida",
      body.data ?? null
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "[Push Debug] No fue posible registrar el diagnóstico:",
      error
    );

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );

  }

}