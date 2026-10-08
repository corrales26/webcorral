import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/LogoMark";
import { PrintInvoiceButton } from "@/components/admin/PrintInvoiceButton";
import { formatCurrency, formatInvoiceDate, isCompleteInvoice } from "@/lib/billing-utils";
import { siteConfig } from "@/lib/data";
import { getBillingEntryById } from "@/lib/storage/billing";

export const metadata: Metadata = {
  title: "Factura",
};

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;
  const entry = await getBillingEntryById(id);

  if (!entry || entry.type !== "income") {
    notFound();
  }

  if (!isCompleteInvoice(entry)) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
          Factura incompleta
        </h1>
        <p className="mt-2 max-w-xl text-[var(--color-muted)]">
          Este ingreso se registró antes de guardar cliente, NIF e impuestos. No se puede imprimir
          como factura.
        </p>
        <Link
          href="/admin/facturacion"
          className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:underline"
        >
          Volver a facturación
        </Link>
      </div>
    );
  }

  const lines = [
    { label: "Base imponible", amount: entry.taxBaseCents! },
    { label: `IVA ${entry.vatRate} %`, amount: entry.vatCents! },
  ];
  if ((entry.irpfCents ?? 0) > 0) {
    lines.push({ label: `Retención IRPF ${entry.irpfRate} %`, amount: -entry.irpfCents! });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/admin/facturacion"
          className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:underline"
        >
          ← Volver a facturación
        </Link>
        <PrintInvoiceButton />
      </div>

      <article className="mx-auto max-w-3xl rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper)] p-6 text-[var(--color-ink)] sm:p-10 print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-0 print:text-black">
        <header className="flex flex-col gap-6 border-b border-[var(--color-rule)] pb-6 sm:flex-row sm:items-start sm:justify-between print:border-neutral-300">
          <div className="flex items-center gap-4">
            <LogoMark className="h-16" priority />
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl font-bold uppercase tracking-widest text-[var(--color-accent)] print:text-black">
                {siteConfig.name}
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink-2)] print:text-neutral-700">
                {entry.issuerName}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-wide">
              Factura
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)] print:text-neutral-600">
              {entry.invoiceNumber}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)] print:text-neutral-600">
              Fecha de expedición: {formatInvoiceDate(entry.entryDate)}
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] print:text-neutral-500">
              Emisor
            </p>
            <p className="mt-2 font-medium">{entry.issuerName}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-2)] print:text-neutral-700">
              NIF: {entry.issuerTaxId}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-2)] print:text-neutral-700">
              {entry.issuerAddress}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-2)] print:text-neutral-700">
              {siteConfig.email}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] print:text-neutral-500">
              Destinatario
            </p>
            <p className="mt-2 font-medium">{entry.clientName}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-2)] print:text-neutral-700">
              NIF: {entry.clientTaxId}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-2)] print:text-neutral-700">
              {entry.clientAddress}
            </p>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-rule)] text-xs uppercase tracking-wider text-[var(--color-muted)] print:border-neutral-300 print:text-neutral-500">
              <th className="py-3 font-semibold">Descripción</th>
              <th className="py-3 text-right font-semibold">Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-rule)] print:border-neutral-200">
              <td className="py-4 pr-4">{entry.concept}</td>
              <td className="py-4 text-right font-medium">{formatCurrency(entry.taxBaseCents!)}</td>
            </tr>
          </tbody>
        </table>

        {entry.vatNote && (
          <p className="mt-4 text-sm text-[var(--color-ink-2)] print:text-neutral-700">{entry.vatNote}</p>
        )}

        <div className="mt-6 space-y-2 border-t border-[var(--color-rule)] pt-4 text-sm print:border-neutral-300">
          {lines.map((line) => (
            <div key={line.label} className="flex justify-between gap-4">
              <span className="text-[var(--color-ink-2)] print:text-neutral-700">{line.label}</span>
              <span>{formatCurrency(line.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-4 pt-2">
            <span className="font-[family-name:var(--font-display)] text-2xl font-bold">Total</span>
            <span className="font-[family-name:var(--font-display)] text-2xl font-bold">
              {formatCurrency(entry.amountCents)}
            </span>
          </div>
        </div>

        {entry.notes && (
          <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-2)] print:text-neutral-700">
            {entry.notes}
          </p>
        )}
      </article>
    </div>
  );
}
