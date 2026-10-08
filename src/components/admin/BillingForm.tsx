"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { computeInvoiceAmounts, formatCurrency, parseAmountToCents } from "@/lib/billing-utils";
import {
  BILLING_TYPES,
  IRPF_RATES,
  VAT_RATES,
  type BillingEntryType,
  type IrpfRate,
  type VatRate,
} from "@/lib/types/billing";

interface BillingFormProps {
  issuerTaxId?: string;
}

export function BillingForm({ issuerTaxId = "" }: BillingFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [type, setType] = useState<BillingEntryType>("income");
  const [taxBase, setTaxBase] = useState("");
  const [vatRate, setVatRate] = useState<VatRate>(21);
  const [irpfRate, setIrpfRate] = useState<IrpfRate>(0);

  const inputClass =
    "w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]";

  const labelClass =
    "mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]";

  const preview = useMemo(() => {
    const baseCents = parseAmountToCents(taxBase);
    if (baseCents === null) return null;
    return computeInvoiceAmounts(baseCents, vatRate, irpfRate);
  }, [taxBase, vatRate, irpfRate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        concept: formData.get("concept"),
        amount: formData.get("amount"),
        entryDate: formData.get("entryDate"),
        notes: formData.get("notes"),
        clientName: formData.get("clientName"),
        clientTaxId: formData.get("clientTaxId"),
        clientAddress: formData.get("clientAddress"),
        issuerTaxId: formData.get("issuerTaxId"),
        taxBase,
        vatRate,
        irpfRate,
        vatNote: formData.get("vatNote"),
      }),
    });
    const data = (await res.json()) as { error?: string; id?: string; type?: BillingEntryType };

    setPending(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar el movimiento");
      return;
    }

    if (data.type === "income" && data.id) {
      router.push(`/admin/facturacion/${data.id}`);
      return;
    }

    form.reset();
    setType("income");
    setTaxBase("");
    setVatRate(21);
    setIrpfRate(0);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="billing-type" className={labelClass}>
            Tipo
          </label>
          <select
            id="billing-type"
            value={type}
            onChange={(event) => setType(event.target.value as BillingEntryType)}
            className={inputClass}
          >
            {(Object.entries(BILLING_TYPES) as [BillingEntryType, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <label htmlFor="entryDate" className={labelClass}>
            Fecha de expedición
          </label>
          <input
            id="entryDate"
            name="entryDate"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="concept" className={labelClass}>
            Concepto
          </label>
          <input id="concept" name="concept" required className={inputClass} />
        </div>

        {type === "income" ? (
          <>
            <div>
              <label htmlFor="issuerTaxId" className={labelClass}>
                NIF del emisor
              </label>
              <input
                id="issuerTaxId"
                name="issuerTaxId"
                required
                defaultValue={issuerTaxId}
                className={inputClass}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="clientTaxId" className={labelClass}>
                NIF, NIE o CIF del cliente
              </label>
              <input id="clientTaxId" name="clientTaxId" required className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="clientName" className={labelClass}>
                Cliente
              </label>
              <input id="clientName" name="clientName" required className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="clientAddress" className={labelClass}>
                Domicilio del cliente
              </label>
              <input id="clientAddress" name="clientAddress" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="taxBase" className={labelClass}>
                Base imponible (€)
              </label>
              <input
                id="taxBase"
                name="taxBase"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={taxBase}
                onChange={(event) => setTaxBase(event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="vatRate" className={labelClass}>
                IVA
              </label>
              <select
                id="vatRate"
                value={vatRate}
                onChange={(event) => setVatRate(Number(event.target.value) as VatRate)}
                className={inputClass}
              >
                {VAT_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate === 0 ? "Exento (0 %)" : `${rate} %`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="irpfRate" className={labelClass}>
                Retención IRPF
              </label>
              <select
                id="irpfRate"
                value={irpfRate}
                onChange={(event) => setIrpfRate(Number(event.target.value) as IrpfRate)}
                className={inputClass}
              >
                {IRPF_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate === 0 ? "Sin retención" : `${rate} %`}
                  </option>
                ))}
              </select>
            </div>
            {vatRate === 0 && (
              <div className="sm:col-span-2">
                <label htmlFor="vatNote" className={labelClass}>
                  Motivo de la exención
                </label>
                <input id="vatNote" name="vatNote" required className={inputClass} />
              </div>
            )}
            {preview && (
              <div className="sm:col-span-2 rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink-2)]">
                <p>IVA: {formatCurrency(preview.vatCents)}</p>
                {irpfRate > 0 && <p>Retención: {formatCurrency(preview.irpfCents)}</p>}
                <p className="mt-1 font-semibold text-[var(--color-ink)]">
                  Total: {formatCurrency(preview.totalCents)}
                </p>
              </div>
            )}
          </>
        ) : (
          <div>
            <label htmlFor="amount" className={labelClass}>
              Importe (€)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              className={inputClass}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="notes" className={labelClass}>
            Notas
          </label>
          <textarea id="notes" name="notes" rows={3} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Guardando…" : type === "income" ? "Emitir factura" : "Añadir movimiento"}
      </button>
    </form>
  );
}
