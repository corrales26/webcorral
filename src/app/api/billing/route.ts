import { NextResponse } from "next/server";
import { parseAmountToCents } from "@/lib/billing-utils";
import { isAuthenticated } from "@/lib/auth";
import { createBillingEntry } from "@/lib/storage/billing";
import type { BillingEntryType } from "@/lib/types/billing";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type?: BillingEntryType;
      concept?: string;
      amount?: string;
      entryDate?: string;
      notes?: string;
    };

    const type = body.type;
    const concept = String(body.concept ?? "").trim();
    const amountCents = parseAmountToCents(String(body.amount ?? ""));
    const entryDate = String(body.entryDate ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    if (!type || (type !== "income" && type !== "expense")) {
      return NextResponse.json({ error: "Tipo de movimiento no válido" }, { status: 400 });
    }

    if (!concept) {
      return NextResponse.json({ error: "El concepto es obligatorio" }, { status: 400 });
    }

    if (amountCents === null) {
      return NextResponse.json({ error: "Introduce un importe válido" }, { status: 400 });
    }

    if (!entryDate) {
      return NextResponse.json({ error: "La fecha es obligatoria" }, { status: 400 });
    }

    const entry = await createBillingEntry({
      type,
      concept,
      amountCents,
      entryDate,
      notes: notes || undefined,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al guardar el movimiento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
