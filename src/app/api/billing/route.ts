import { NextResponse } from "next/server";
import {
  computeInvoiceAmounts,
  isIrpfRate,
  isVatRate,
  parseAmountToCents,
} from "@/lib/billing-utils";
import { isAuthenticated } from "@/lib/auth";
import { siteConfig } from "@/lib/data";
import { createBillingEntry } from "@/lib/storage/billing";
import { isValidSpanishTaxId, normalizeTaxId } from "@/lib/tax-id";
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
      clientName?: string;
      clientTaxId?: string;
      clientAddress?: string;
      issuerTaxId?: string;
      taxBase?: string;
      vatRate?: number;
      irpfRate?: number;
      vatNote?: string;
    };

    const type = body.type;
    const concept = String(body.concept ?? "").trim();
    const entryDate = String(body.entryDate ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    if (!type || (type !== "income" && type !== "expense")) {
      return NextResponse.json({ error: "Tipo de movimiento no válido" }, { status: 400 });
    }

    if (!concept) {
      return NextResponse.json({ error: "El concepto es obligatorio" }, { status: 400 });
    }

    if (!entryDate) {
      return NextResponse.json({ error: "La fecha es obligatoria" }, { status: 400 });
    }

    if (type === "expense") {
      const amountCents = parseAmountToCents(String(body.amount ?? ""));
      if (amountCents === null) {
        return NextResponse.json({ error: "Introduce un importe válido" }, { status: 400 });
      }

      const entry = await createBillingEntry({
        type,
        concept,
        amountCents,
        entryDate,
        notes: notes || undefined,
      });
      return NextResponse.json(entry, { status: 201 });
    }

    const clientName = String(body.clientName ?? "").trim();
    const clientTaxId = normalizeTaxId(String(body.clientTaxId ?? ""));
    const clientAddress = String(body.clientAddress ?? "").trim();
    const issuerTaxId = normalizeTaxId(String(body.issuerTaxId ?? siteConfig.legalTaxId));
    const taxBaseCents = parseAmountToCents(String(body.taxBase ?? ""));
    const vatRate = Number(body.vatRate);
    const irpfRate = Number(body.irpfRate);
    const vatNote = String(body.vatNote ?? "").trim();

    if (!clientName) {
      return NextResponse.json({ error: "El nombre del cliente es obligatorio" }, { status: 400 });
    }
    if (!isValidSpanishTaxId(clientTaxId)) {
      return NextResponse.json({ error: "El NIF, NIE o CIF del cliente no es válido" }, { status: 400 });
    }
    if (!clientAddress) {
      return NextResponse.json({ error: "El domicilio del cliente es obligatorio" }, { status: 400 });
    }
    if (!isValidSpanishTaxId(issuerTaxId)) {
      return NextResponse.json({ error: "El NIF del emisor no es válido" }, { status: 400 });
    }
    if (taxBaseCents === null) {
      return NextResponse.json({ error: "Introduce una base imponible válida" }, { status: 400 });
    }
    if (!isVatRate(vatRate)) {
      return NextResponse.json({ error: "El tipo de IVA no es válido" }, { status: 400 });
    }
    if (!isIrpfRate(irpfRate)) {
      return NextResponse.json({ error: "El tipo de retención no es válido" }, { status: 400 });
    }
    if (vatRate === 0 && !vatNote) {
      return NextResponse.json(
        { error: "Indica el motivo de la exención de IVA" },
        { status: 400 },
      );
    }

    const amounts = computeInvoiceAmounts(taxBaseCents, vatRate, irpfRate);
    if (amounts.totalCents <= 0) {
      return NextResponse.json(
        { error: "El total de la factura tiene que ser mayor que cero" },
        { status: 400 },
      );
    }

    const entry = await createBillingEntry({
      type,
      concept,
      amountCents: amounts.totalCents,
      entryDate,
      notes: notes || undefined,
      invoice: {
        clientName,
        clientTaxId,
        clientAddress,
        issuerName: siteConfig.legalHolder,
        issuerTaxId,
        issuerAddress: siteConfig.addresses[0] ?? "",
        taxBaseCents,
        vatRate,
        vatCents: amounts.vatCents,
        irpfRate,
        irpfCents: amounts.irpfCents,
        vatNote: vatNote || undefined,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al guardar el movimiento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
