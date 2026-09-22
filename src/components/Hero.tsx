import Image from "next/image";
import { HeroPropertySearch } from "@/components/property/HeroPropertySearch";

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

      <div className="relative mx-auto flex min-h-[85vh] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
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
      </div>
    </section>
  );
}
