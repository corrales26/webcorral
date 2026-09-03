import Link from "next/link";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getFeaturedProperties } from "@/lib/storage/properties";

export async function Properties() {
  const properties = await getFeaturedProperties();

  return (
    <section className="bg-[var(--color-paper)] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-wide text-[var(--color-ink)] sm:text-4xl">
            Inmuebles destacados
          </h2>
          <Link
            href="/inmuebles"
            className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Ver todos los inmuebles →
          </Link>
        </div>

        {properties.length === 0 ? (
          <p className="text-center text-[var(--color-muted)]">
            No hay inmuebles destacados disponibles.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
