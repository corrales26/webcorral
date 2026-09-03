import Link from "next/link";
import Image from "next/image";
import { heroValues } from "@/lib/data";

function ValueIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    shield: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    chart: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    heart: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  };
  return icons[icon] ?? icons.shield;
}

export function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
        alt="Salón de lujo con vistas al mar"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy)]/95 via-[var(--color-navy)]/70 to-transparent" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-[var(--color-on-navy)] sm:text-5xl lg:text-6xl">
            Hacemos real{" "}
            <span className="text-[var(--color-accent)]">tu proyecto inmobiliario</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--color-on-navy)]/90">
            Especialistas en compraventa, alquiler, rehabilitación e inversión inmobiliaria en Cantabria.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {heroValues.map((value) => (
              <div key={value.label} className="flex flex-col items-center text-center">
                <div className="mb-2 text-[var(--color-accent)]">
                  <ValueIcon icon={value.icon} />
                </div>
                <p className="text-xs font-medium uppercase leading-snug tracking-wide text-[var(--color-on-navy)]">
                  {value.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quiero-vender"
              className="inline-flex items-center gap-2 rounded-sm border-2 border-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Quiero vender →
            </Link>
            <Link
              href="/quiero-comprar"
              className="inline-flex items-center gap-2 rounded-sm border-2 border-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Quiero comprar →
            </Link>
            <Link
              href="/alquilar"
              className="inline-flex items-center gap-2 rounded-sm border-2 border-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Alquilar →
            </Link>
          </div>

          <div className="mt-4 w-full max-w-xs rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-navy)]/90 p-5 backdrop-blur-sm lg:absolute lg:bottom-0 lg:right-0 lg:mt-0">
          <div className="mb-2 flex items-center gap-2 text-[var(--color-accent)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Rehabilitación</span>
          </div>
          <p className="text-sm font-semibold uppercase leading-snug text-[var(--color-on-navy)]">
            Rehabilitamos tu vivienda
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Asociándonos contigo para luego sacarla al mercado.
          </p>
          <Link
            href="/servicios/reforma"
            className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Saber más →
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
