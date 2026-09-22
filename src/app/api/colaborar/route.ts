import { NextResponse } from "next/server";
import { findCollaboratorById } from "@/lib/access";
import { getCollaboratorId } from "@/lib/auth";
import { createSubmission } from "@/lib/storage/submissions";

const MAX_FILES = 8;
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    const collaboratorId = await getCollaboratorId();
    const collaborator = collaboratorId
      ? await findCollaboratorById(collaboratorId)
      : null;

    if (!collaborator) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const body = String(formData.get("body") ?? "").trim();

    if (!body) {
      return NextResponse.json({ error: "Escribe un texto" }, { status: 400 });
    }

    if (body.length > 5000) {
      return NextResponse.json(
        { error: "El texto supera los 5000 caracteres" },
        { status: 400 }
      );
    }

    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: "Añade al menos una foto" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Máximo ${MAX_FILES} fotos` },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Usa fotos JPG, PNG o WebP" },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Cada foto puede pesar hasta 5 MB" },
          { status: 400 }
        );
      }
    }

    await createSubmission({
      grantId: collaborator.id,
      body,
      files: await Promise.all(
        files.map(async (file) => ({
          bytes: Buffer.from(await file.arrayBuffer()),
          contentType: file.type,
        }))
      ),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo enviar" },
      { status: 500 }
    );
  }
}
