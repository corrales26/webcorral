import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, PageContent } from "@/components/PageLayout";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Alquiler, compraventa, locales, rehabilitación, inversión y valoración. Oficina en Cicero y actividad en toda España.",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        title="Servicios"
        subtitle="Soluciones integrales para todas tus necesidades inmobiliarias en toda España."
      />
      <PageContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="flex flex-col rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
                {service.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-ink-2)]">
                {service.description}
              </p>
              <Link
                href={service.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                Saber más →
              </Link>
            </article>
          ))}
        </div>
      </PageContent>
    </>
  );
}
