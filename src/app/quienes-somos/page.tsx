import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Quiénes somos",
};

export default function QuienesSomosPage() {
  return (
    <>
      <PageHero
        title="¿Quiénes somos?"
        subtitle="Somos Corral Business, una forma diferente de entender el sector inmobiliario."
      />
      <PageContent narrow>
        <div className="prose-custom space-y-6 text-[var(--color-ink-2)]">
          <p className="text-lg leading-relaxed">
            No nos limitamos a ofrecerte opciones. Buscamos oportunidades, analizamos posibilidades
            y encontramos soluciones adaptadas a cada situación.
          </p>
          <p className="leading-relaxed">
            Tú nos cuentas qué necesitas. Nosotros nos ponemos a trabajar para conseguirlo.
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Nuestros valores
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[var(--color-accent)]">●</span>
              <span><strong className="text-[var(--color-ink)]">Transparencia y confianza</strong> — Información clara en cada paso del proceso.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[var(--color-accent)]">●</span>
              <span><strong className="text-[var(--color-ink)]">Atención personalizada</strong> — Cada cliente tiene un asesor dedicado.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[var(--color-accent)]">●</span>
              <span><strong className="text-[var(--color-ink)]">Máxima rentabilidad</strong> — Buscamos la mejor opción para tu situación.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[var(--color-accent)]">●</span>
              <span><strong className="text-[var(--color-ink)]">Compromiso total</strong> — Contigo desde el primer contacto hasta el cierre.</span>
            </li>
          </ul>
        </div>
      </PageContent>
    </>
  );
}
