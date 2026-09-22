import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createContract } from "@/lib/storage/contracts";
import type { ContractType } from "@/lib/types/contract";

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "").trim();
    const type = String(formData.get("type") ?? "") as ContractType;
    const clientName = String(formData.get("clientName") ?? "").trim();
    const propertyReference = String(formData.get("propertyReference") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();
    const signedAt = String(formData.get("signedAt") ?? "").trim();

    if (!title || !clientName || !type) {
      return NextResponse.json(
        { error: "Título, cliente y tipo son obligatorios" },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Adjunta el PDF del contrato" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "El contrato debe ser un PDF" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 10 MB" },
        { status: 400 }
      );
    }

    const contract = await createContract({
      title,
      type,
      clientName,
      propertyReference: propertyReference || undefined,
      notes: notes || undefined,
      signedAt: signedAt || undefined,
      fileName: file.name,
      file: Buffer.from(await file.arrayBuffer()),
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al guardar el contrato";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
