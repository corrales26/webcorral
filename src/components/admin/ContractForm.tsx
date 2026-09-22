"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONTRACT_TYPES, type ContractType } from "@/lib/types/contract";

interface ContractFormProps {
  properties: { reference: string; title: string }[];
}

export function ContractForm({ properties }: ContractFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const inputClass =
    "w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]";

  const labelClass =
    "mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = event.currentTarget;
    const res = await fetch("/api/contracts", {
      method: "POST",
      body: new FormData(form),
    });
    const data = (await res.json()) as { error?: string };

    setPending(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar el contrato");
      return;
    }

    form.reset();
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
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Título
          </label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="type" className={labelClass}>
            Tipo
          </label>
          <select id="type" name="type" required className={inputClass} defaultValue="compraventa">
            {(Object.entries(CONTRACT_TYPES) as [ContractType, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="clientName" className={labelClass}>
            Cliente
          </label>
          <input id="clientName" name="clientName" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="propertyReference" className={labelClass}>
            Inmueble
          </label>
          <select id="propertyReference" name="propertyReference" className={inputClass} defaultValue="">
            <option value="">Sin inmueble</option>
            {properties.map((property) => (
              <option key={property.reference} value={property.reference}>
                {property.reference} — {property.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="signedAt" className={labelClass}>
            Fecha de firma
          </label>
          <input id="signedAt" name="signedAt" type="date" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="file" className={labelClass}>
            PDF
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="application/pdf"
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
        className="w-full rounded-sm bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Guardando…" : "Guardar contrato"}
      </button>
    </form>
  );
}
