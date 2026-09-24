import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getContentTypeFromFileName } from "@/lib/document-utils";
import { getContractFile } from "@/lib/storage/contracts";

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
    const file = await getContractFile(id);
    if (!file) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });
    }

    const safeName = file.fileName.replace(/[\r\n"]/g, "") || "contrato.pdf";
    const contentType = getContentTypeFromFileName(safeName);

    return new NextResponse(new Uint8Array(file.bytes), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al descargar el contrato";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
