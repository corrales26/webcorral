import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "SOMOS Corral Business, una forma diferente de entender el sector inmobiliario. Buscamos oportunidades y soluciones adaptadas a cada situación.",
};

export default function QuienesSomosPage() {
  return (
    <>
      <PageHero
        title="¿Quiénes somos?"
      />
      <PageContent narrow>
        <div className="prose-custom space-y-6 text-[var(--color-ink-2)]">
          <p className="text-lg leading-relaxed">
            <strong className="text-[var(--color-ink)]">SOMOS</strong> Corral Business, una forma
            diferente de entender el sector inmobiliario.
          </p>
          <p className="leading-relaxed">
            No nos limitamos a ofrecerte opciones, Buscamos oportunidades, analizamos posibilidades
            y encontramos soluciones adaptadas a cada situación.
          </p>
          <p className="leading-relaxed">
            Tú nos cuentas qué necesitas, Nosotros nos ponemos a trabajar para conseguirlo.
          </p>
        </div>
      </PageContent>
    </>
  );
}
