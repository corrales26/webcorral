import { NextResponse } from "next/server";
import { inviteCollaborator } from "@/lib/access";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { name, email } = (await request.json()) as {
      name?: string;
      email?: string;
    };

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y correo son obligatorios" }, { status: 400 });
    }

    await inviteCollaborator(name, email);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo invitar";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
