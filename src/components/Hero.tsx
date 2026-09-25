import Image from "next/image";
import Link from "next/link";
import { HeroPropertySearch } from "@/components/property/HeroPropertySearch";

const heroLinks = [
  { href: "/quiero-vender", label: "Quiero vender" },
  { href: "/quiero-comprar", label: "Quiero comprar" },
  { href: "/alquilar", label: "Alquilar" },
  { href: "/servicios/rehabilitacion", label: "Rehabilitamos tu vivienda" },
  { href: "/valoracion", label: "Valoración gratis" },
] as const;

const heroLinkClass =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm border border-[var(--color-accent)] px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-3 sm:text-xs lg:px-4 lg:py-2.5 lg:text-sm lg:tracking-wider";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
        alt="Salón de lujo con vistas al mar"
        fill
        priority
        className="scale-105 object-cover blur-[3px]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[var(--color-navy)]/65" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-[var(--color-on-navy)] sm:text-5xl lg:text-6xl">
            Hacemos real{" "}
            <span className="text-[var(--color-accent)]">tu proyecto inmobiliario</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--color-on-navy)]/90">
            No paralizamos tu activo, trabajamos para ti
          </p>
        </div>

        <HeroPropertySearch />

        <nav
          aria-label="Accesos rápidos"
          className="mt-6 flex w-full max-w-6xl flex-nowrap items-center justify-center gap-2 overflow-x-auto pb-1 sm:gap-3"
        >
          {heroLinks.map((link) => (
            <Link key={link.href} href={link.href} className={heroLinkClass}>
              {link.label} →
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
