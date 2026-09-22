export const BILLING_TYPES = {
  income: "Ingreso",
  expense: "Gasto",
} as const;

export type BillingEntryType = keyof typeof BILLING_TYPES;

export interface BillingEntry {
  id: string;
  type: BillingEntryType;
  concept: string;
  amountCents: number;
  entryDate: string;
  notes?: string;
  createdAt: string;
}

export interface BillingTotals {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
}
