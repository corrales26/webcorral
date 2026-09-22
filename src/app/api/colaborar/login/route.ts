import { NextResponse } from "next/server";
import { findCollaboratorByEmail } from "@/lib/access";
import { createCollaboratorSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email) {
      return NextResponse.json({ error: "Escribe tu correo" }, { status: 400 });
    }

    const collaborator = await findCollaboratorByEmail(email);
    if (!collaborator) {
      return NextResponse.json(
        { error: "Este correo no está invitado" },
        { status: 401 }
      );
    }

    await createCollaboratorSession(collaborator.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "No se pudo entrar" }, { status: 500 });
  }
}
