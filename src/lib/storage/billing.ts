import { decryptString, encryptString } from "@/lib/crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  BILLING_TYPES,
  type BillingEntry,
  type BillingEntryType,
} from "@/lib/types/billing";

interface BillingRow {
  id: string;
  entry_type: BillingEntryType;
  concept: string;
  amount_cents: number;
  entry_date: string;
  notes: string | null;
  created_at: string;
  invoice_number?: string | null;
  client_name?: string | null;
  client_tax_id?: string | null;
  client_address?: string | null;
  issuer_name?: string | null;
  issuer_tax_id?: string | null;
  issuer_address?: string | null;
  tax_base_cents?: number | null;
  vat_rate?: number | null;
  vat_cents?: number | null;
  irpf_rate?: number | null;
  irpf_cents?: number | null;
  vat_note?: string | null;
}

function optionalText(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return decryptString(value);
}

function rowToEntry(row: BillingRow): BillingEntry {
  return {
    id: row.id,
    type: row.entry_type,
    concept: decryptString(row.concept),
    amountCents: row.amount_cents,
    entryDate: row.entry_date,
    notes: row.notes ? decryptString(row.notes) : undefined,
    createdAt: row.created_at,
    invoiceNumber: row.invoice_number ?? undefined,
    clientName: optionalText(row.client_name),
    clientTaxId: optionalText(row.client_tax_id),
    clientAddress: optionalText(row.client_address),
    issuerName: optionalText(row.issuer_name),
    issuerTaxId: optionalText(row.issuer_tax_id),
    issuerAddress: optionalText(row.issuer_address),
    taxBaseCents: row.tax_base_cents ?? undefined,
    vatRate: row.vat_rate ?? undefined,
    vatCents: row.vat_cents ?? undefined,
    irpfRate: row.irpf_rate ?? undefined,
    irpfCents: row.irpf_cents ?? undefined,
    vatNote: optionalText(row.vat_note),
  };
}

function assertConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado");
  }
}

export async function getAllBillingEntries(): Promise<BillingEntry[]> {
  assertConfigured();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as BillingRow[]).map(rowToEntry);
}

export async function getBillingEntryById(id: string): Promise<BillingEntry | null> {
  assertConfigured();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToEntry(data as BillingRow);
}

export interface InvoiceInput {
  clientName: string;
  clientTaxId: string;
  clientAddress: string;
  issuerName: string;
  issuerTaxId: string;
  issuerAddress: string;
  taxBaseCents: number;
  vatRate: number;
  vatCents: number;
  irpfRate: number;
  irpfCents: number;
  vatNote?: string;
}

async function nextInvoiceNumber(entryDate: string): Promise<string> {
  const year = entryDate.slice(0, 4);
  const prefix = `F-${year}-`;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_entries")
    .select("invoice_number")
    .like("invoice_number", `${prefix}%`);

  if (error) throw new Error(error.message);

  const max = (data ?? []).reduce((highest, row) => {
    const current = Number(String(row.invoice_number ?? "").slice(prefix.length));
    return Number.isFinite(current) ? Math.max(highest, current) : highest;
  }, 0);

  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

export async function createBillingEntry(input: {
  type: BillingEntryType;
  concept: string;
  amountCents: number;
  entryDate: string;
  notes?: string;
  invoice?: InvoiceInput;
}): Promise<BillingEntry> {
  assertConfigured();
  if (!(input.type in BILLING_TYPES)) {
    throw new Error("Tipo de movimiento no válido");
  }
  if (input.amountCents <= 0) {
    throw new Error("El importe debe ser mayor que cero");
  }
  if (input.type === "income" && !input.invoice) {
    throw new Error("Un ingreso necesita los datos de la factura");
  }

  const supabase = getSupabaseAdmin();
  const invoiceNumber = input.invoice ? await nextInvoiceNumber(input.entryDate) : null;
  const invoice = input.invoice;

  const { data, error } = await supabase
    .from("billing_entries")
    .insert({
      entry_type: input.type,
      concept: encryptString(input.concept.trim()),
      amount_cents: input.amountCents,
      entry_date: input.entryDate,
      notes: input.notes ? encryptString(input.notes.trim()) : null,
      invoice_number: invoiceNumber,
      client_name: invoice ? encryptString(invoice.clientName.trim()) : null,
      client_tax_id: invoice ? encryptString(invoice.clientTaxId.trim()) : null,
      client_address: invoice ? encryptString(invoice.clientAddress.trim()) : null,
      issuer_name: invoice ? encryptString(invoice.issuerName.trim()) : null,
      issuer_tax_id: invoice ? encryptString(invoice.issuerTaxId.trim()) : null,
      issuer_address: invoice ? encryptString(invoice.issuerAddress.trim()) : null,
      tax_base_cents: invoice?.taxBaseCents ?? null,
      vat_rate: invoice?.vatRate ?? null,
      vat_cents: invoice?.vatCents ?? null,
      irpf_rate: invoice?.irpfRate ?? null,
      irpf_cents: invoice?.irpfCents ?? null,
      vat_note: invoice?.vatNote ? encryptString(invoice.vatNote.trim()) : null,
    })
    .select("*")
    .single();

  if (error) {
    if (error.message.includes("invoice_number") || error.code === "PGRST204") {
      throw new Error(
        "Falta actualizar la tabla de facturación. Ejecuta supabase/billing-invoices.sql en Supabase.",
      );
    }
    throw new Error(error.message);
  }
  return rowToEntry(data as BillingRow);
}

export async function deleteBillingEntry(id: string): Promise<boolean> {
  assertConfigured();
  const supabase = getSupabaseAdmin();
  const selected = await supabase
    .from("billing_entries")
    .select("id, invoice_number")
    .eq("id", id)
    .maybeSingle();

  if (selected.error?.code === "PGRST204") {
    const fallback = await supabase.from("billing_entries").select("id").eq("id", id).maybeSingle();
    if (fallback.error) throw new Error(fallback.error.message);
    if (!fallback.data) return false;
  } else {
    if (selected.error) throw new Error(selected.error.message);
    if (!selected.data) return false;
    if (selected.data.invoice_number) {
      throw new Error("Una factura emitida no se puede eliminar. El número debe mantenerse correlativo.");
    }
  }

  const { error } = await supabase.from("billing_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
