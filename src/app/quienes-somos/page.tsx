import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Quiénes somos",
};

export default function QuienesSomosPage() {
  return (
    <>
      <PageHero
        title="Quiénes somos"
        subtitle="Una inmobiliaria de confianza en Cantabria, comprometida con hacer real tu proyecto inmobiliario."
      />
      <PageContent narrow>
        <div className="prose-custom space-y-6 text-[var(--color-ink-2)]">
          <p className="text-lg leading-relaxed">
            En <strong className="text-[var(--color-ink)]">Corral Business</strong> llevamos años
            acompañando a familias, propietarios e inversores en Cantabria y Asturias. Nuestra
            filosofía se basa en la transparencia, la atención personalizada y el compromiso total
            con cada cliente.
          </p>
          <p className="leading-relaxed">
            Somos especialistas en compraventa, alquiler, rehabilitación de viviendas e inversión
            inmobiliaria. Conocemos el mercado local y trabajamos para maximizar el valor de cada
            operación, ya sea que quieras vender, comprar, alquilar o invertir.
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
