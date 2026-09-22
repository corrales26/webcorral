"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BILLING_TYPES, type BillingEntryType } from "@/lib/types/billing";

export function BillingForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [type, setType] = useState<BillingEntryType>("income");

  const inputClass =
    "w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]";

  const labelClass =
    "mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]";

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
      }),
    });
    const data = (await res.json()) as { error?: string };

    setPending(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar el movimiento");
      return;
    }

    form.reset();
    setType("income");
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
            Fecha
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
        {pending ? "Guardando…" : "Añadir movimiento"}
      </button>
    </form>
  );
}
