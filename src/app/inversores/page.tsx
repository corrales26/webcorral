import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";
import { investorFeatures } from "@/lib/data";

export const metadata: Metadata = {
  title: "Inversores",
};

function FeatureIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    search: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    hammer: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" />
        <path d="m18 15 4-4" />
        <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
      </svg>
    ),
    value: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  };
  return icons[icon] ?? icons.search;
}

export default function InversoresPage() {
  return (
    <>
      <PageHero
        title="Inversores"
        subtitle="Juntos, multiplicamos resultados. Asóciate con nosotros para invertir en el mercado inmobiliario cantábrico."
      />
      <PageContent>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-[var(--color-ink-2)]">
              En Corral Business identificamos oportunidades inmobiliarias con potencial de
              revalorización. Nos encargamos de la rehabilitación con calidad y gestionamos la
              venta o alquiler para maximizar tu retorno de inversión.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {investorFeatures.map((feature) => (
                <div key={feature.label} className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 text-center">
                  <div className="mb-2 inline-flex text-[var(--color-accent)]">
                    <FeatureIcon icon={feature.icon} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]">
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>
            <ul className="space-y-3 text-[var(--color-ink-2)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent)]">✓</span>
                Análisis de mercado y selección de oportunidades
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent)]">✓</span>
                Gestión integral de la rehabilitación
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent)]">✓</span>
                Comercialización y seguimiento post-inversión
              </li>
            </ul>
          </div>
          <ContactForm
            title="Información para inversores"
            description="Cuéntanos tu perfil de inversión y te presentaremos oportunidades adaptadas a tus objetivos."
            submitLabel="Solicitar información"
          />
        </div>
      </PageContent>
    </>
  );
}
