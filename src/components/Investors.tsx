import Link from "next/link";
import Image from "next/image";
import { investorFeatures } from "@/lib/data";

function FeatureIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    search: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    hammer: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" />
        <path d="m18 15 4-4" />
        <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
      </svg>
    ),
    value: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  };
  return icons[icon] ?? icons.search;
}

export function Investors() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-navy)] py-16 lg:py-24">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase leading-tight text-[var(--color-on-navy)] sm:text-4xl">
              Trabajamos con inversores —{" "}
              <span className="text-[var(--color-accent)]">
                juntos, multiplicamos resultados
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--color-on-navy)]/85">
              Buscamos oportunidades inmobiliarias con potencial de revalorización en Cantabria y Asturias.
              Nos asociamos contigo para rehabilitar con calidad, maximizar el valor y gestionar la venta o alquiler del inmueble.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {investorFeatures.map((feature) => (
                <div key={feature.label} className="text-center sm:text-left">
                  <div className="mb-2 inline-flex text-[var(--color-accent)]">
                    <FeatureIcon icon={feature.icon} />
                  </div>
                  <p className="text-xs font-semibold uppercase leading-snug tracking-wide text-[var(--color-on-navy)]">
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/inversores"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-sm border-2 border-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:w-auto"
            >
              Más información para inversores →
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
              alt="Espacio de oficina moderno para inversores"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
