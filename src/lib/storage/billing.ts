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

export async function createBillingEntry(input: {
  type: BillingEntryType;
  concept: string;
  amountCents: number;
  entryDate: string;
  notes?: string;
}): Promise<BillingEntry> {
  assertConfigured();
  if (!(input.type in BILLING_TYPES)) {
    throw new Error("Tipo de movimiento no válido");
  }
  if (input.amountCents <= 0) {
    throw new Error("El importe debe ser mayor que cero");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("billing_entries")
    .insert({
      entry_type: input.type,
      concept: encryptString(input.concept.trim()),
      amount_cents: input.amountCents,
      entry_date: input.entryDate,
      notes: input.notes ? encryptString(input.notes.trim()) : null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToEntry(data as BillingRow);
}

export async function deleteBillingEntry(id: string): Promise<boolean> {
  assertConfigured();
  const supabase = getSupabaseAdmin();
  const { data, error: selectError } = await supabase
    .from("billing_entries")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (selectError) throw new Error(selectError.message);
  if (!data) return false;

  const { error } = await supabase.from("billing_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
