import { NextResponse } from "next/server";
import { isResendConfigured, sendContactEmail } from "@/lib/resend-mail";

interface ContactRequestBody {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  propertyRef?: string;
  source?: string;
  website?: string;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    if (!isResendConfigured()) {
      return NextResponse.json(
        { error: "El envío de correo no está configurado todavía." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as ContactRequestBody;

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const name = body.name?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    const propertyRef = body.propertyRef?.trim();
    const source = body.source?.trim();

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: "Completa todos los campos obligatorios." },
        { status: 400 },
      );
    }

    if (
      name.length > 120 ||
      phone.length > 40 ||
      email.length > 200 ||
      (source?.length ?? 0) > 200 ||
      (propertyRef?.length ?? 0) > 80
    ) {
      return NextResponse.json(
        { error: "Alguno de los campos es demasiado largo." },
        { status: 400 },
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { error: "Introduce un email válido." },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "El mensaje es demasiado largo." },
        { status: 400 },
      );
    }

    await sendContactEmail({
      name,
      phone,
      email,
      message,
      propertyRef: propertyRef || undefined,
      source: source || undefined,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje. Inténtalo de nuevo más tarde." },
      { status: 500 },
    );
  }
}
