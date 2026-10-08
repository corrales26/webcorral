import {
  IRPF_RATES,
  VAT_RATES,
  type BillingEntry,
  type BillingTotals,
  type IrpfRate,
  type VatRate,
} from "@/lib/types/billing";

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function isVatRate(value: number): value is VatRate {
  return (VAT_RATES as readonly number[]).includes(value);
}

export function isIrpfRate(value: number): value is IrpfRate {
  return (IRPF_RATES as readonly number[]).includes(value);
}

export function computeInvoiceAmounts(
  taxBaseCents: number,
  vatRate: number,
  irpfRate: number,
): { vatCents: number; irpfCents: number; totalCents: number } {
  const vatCents = Math.round((taxBaseCents * vatRate) / 100);
  const irpfCents = Math.round((taxBaseCents * irpfRate) / 100);
  return {
    vatCents,
    irpfCents,
    totalCents: taxBaseCents + vatCents - irpfCents,
  };
}

export function formatInvoiceDate(date: string): string {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
}

export function isCompleteInvoice(entry: BillingEntry): boolean {
  return Boolean(
    entry.invoiceNumber &&
      entry.clientName &&
      entry.clientTaxId &&
      entry.clientAddress &&
      entry.issuerName &&
      entry.issuerTaxId &&
      entry.issuerAddress &&
      entry.taxBaseCents != null &&
      entry.vatRate != null &&
      entry.vatCents != null,
  );
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
