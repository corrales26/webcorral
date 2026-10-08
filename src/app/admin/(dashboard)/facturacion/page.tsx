import Link from "next/link";
import { BillingForm } from "@/components/admin/BillingForm";
import { DeleteBillingButton } from "@/components/admin/DeleteBillingButton";
import {
  computeBillingTotals,
  formatBillingDate,
  formatCurrency,
} from "@/lib/billing-utils";
import { siteConfig } from "@/lib/data";
import { getAllBillingEntries } from "@/lib/storage/billing";
import { BILLING_TYPES } from "@/lib/types/billing";

export default async function AdminBillingPage() {
  let entries: Awaited<ReturnType<typeof getAllBillingEntries>> = [];
  let loadError = "";

  try {
    entries = await getAllBillingEntries();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "No se pudieron cargar los movimientos";
  }

  const totals = computeBillingTotals(entries);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)] sm:text-3xl">
        Facturación
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Registra ingresos y gastos de la agencia. Los conceptos y notas se cifran antes de guardarse.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Ingresos
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totals.incomeCents)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Gastos
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totals.expenseCents)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Balance
          </p>
          <p
            className={`mt-2 font-[family-name:var(--font-display)] text-2xl font-bold ${
              totals.balanceCents >= 0
                ? "text-[var(--color-accent)]"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(totals.balanceCents)}
          </p>
        </div>
      </div>

      <section className="mt-8 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Nuevo movimiento
        </h2>
        <BillingForm issuerTaxId={siteConfig.legalTaxId} />
      </section>

      {loadError ? (
        <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {loadError.includes("billing_entries")
            ? "Falta la tabla de facturación en Supabase. Ejecuta el archivo supabase/billing.sql en el SQL Editor."
            : loadError}
        </p>
      ) : (
        <>
          <ul className="mt-8 space-y-3 md:hidden">
            {entries.length === 0 ? (
              <li className="rounded-lg border border-[var(--color-rule)] px-4 py-6 text-sm text-[var(--color-muted)]">
                Todavía no hay movimientos registrados.
              </li>
            ) : (
              entries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-ink)]">{entry.concept}</p>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        {BILLING_TYPES[entry.type]}
                        {entry.invoiceNumber ? ` · ${entry.invoiceNumber}` : ""} ·{" "}
                        {formatBillingDate(entry.entryDate)}
                      </p>
                      {entry.notes && (
                        <p className="mt-2 break-words text-sm text-[var(--color-ink-2)]">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                    <p
                      className={`shrink-0 font-[family-name:var(--font-display)] text-lg font-bold ${
                        entry.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {entry.type === "income" ? "+" : "-"}
                      {formatCurrency(entry.amountCents)}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {entry.invoiceNumber && (
                      <Link
                        href={`/admin/facturacion/${entry.id}`}
                        className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:underline"
                      >
                        Ver factura
                      </Link>
                    )}
                    {!entry.invoiceNumber && <DeleteBillingButton id={entry.id} />}
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="mt-8 hidden overflow-x-auto rounded-lg border border-[var(--color-rule)] md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[var(--color-paper-2)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Concepto</th>
                  <th className="px-4 py-3">Importe</th>
                  <th className="px-4 py-3">Notas</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-[var(--color-muted)]">
                      Todavía no hay movimientos registrados.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="border-t border-[var(--color-rule)]">
                      <td className="px-4 py-3 text-[var(--color-muted)]">
                        {formatBillingDate(entry.entryDate)}
                      </td>
                      <td className="px-4 py-3">
                        {BILLING_TYPES[entry.type]}
                        {entry.invoiceNumber ? (
                          <span className="mt-1 block text-xs text-[var(--color-muted)]">
                            {entry.invoiceNumber}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 font-medium">{entry.concept}</td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          entry.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {entry.type === "income" ? "+" : "-"}
                        {formatCurrency(entry.amountCents)}
                      </td>
                      <td className="max-w-xs px-4 py-3 text-[var(--color-muted)]">
                        {entry.notes ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {entry.invoiceNumber && (
                            <Link
                              href={`/admin/facturacion/${entry.id}`}
                              className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:underline"
                            >
                              Factura
                            </Link>
                          )}
                          {!entry.invoiceNumber && <DeleteBillingButton id={entry.id} />}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
