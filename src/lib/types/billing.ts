export const BILLING_TYPES = {
  income: "Ingreso",
  expense: "Gasto",
} as const;

export type BillingEntryType = keyof typeof BILLING_TYPES;

export const VAT_RATES = [21, 10, 4, 0] as const;
export const IRPF_RATES = [0, 7, 15] as const;

export type VatRate = (typeof VAT_RATES)[number];
export type IrpfRate = (typeof IRPF_RATES)[number];

export interface BillingEntry {
  id: string;
  type: BillingEntryType;
  concept: string;
  amountCents: number;
  entryDate: string;
  notes?: string;
  createdAt: string;
  invoiceNumber?: string;
  clientName?: string;
  clientTaxId?: string;
  clientAddress?: string;
  issuerName?: string;
  issuerTaxId?: string;
  issuerAddress?: string;
  taxBaseCents?: number;
  vatRate?: number;
  vatCents?: number;
  irpfRate?: number;
  irpfCents?: number;
  vatNote?: string;
}

export interface BillingTotals {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
}
