import type { BillingEntry, BillingTotals } from "@/lib/types/billing";

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatBillingDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function computeBillingTotals(entries: BillingEntry[]): BillingTotals {
  const incomeCents = entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
  const expenseCents = entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amountCents, 0);

  return {
    incomeCents,
    expenseCents,
    balanceCents: incomeCents - expenseCents,
  };
}

export function parseAmountToCents(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
}
