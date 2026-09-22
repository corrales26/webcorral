import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSubmissionImage } from "@/lib/storage/submissions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const image = await getSubmissionImage(id);
    if (!image) {
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(image.bytes), {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "No se pudo cargar la imagen" }, { status: 500 });
  }
}
