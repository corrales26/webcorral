import Link from "next/link";
import { getAllProperties } from "@/lib/storage/properties";
import { formatPrice, statusLabel } from "@/lib/property-utils";

export default async function AdminPropertiesPage() {
  const properties = await getAllProperties(true);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-ink)]">
            Inmuebles
          </h1>
          <p className="mt-1 text-[var(--color-muted)]">
            {properties.length} inmuebles en total
          </p>
        </div>
        <Link
          href="/admin/inmuebles/nuevo"
          className="rounded-sm bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          + Nuevo inmueble
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-[var(--color-rule)]">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[var(--color-paper-2)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">Ref.</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Ubicación</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Operación</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fotos</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-[var(--color-rule)]">
                <td className="px-4 py-3 font-mono text-xs">{property.reference}</td>
                <td className="px-4 py-3 font-medium">{property.title}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{property.location}</td>
                <td className="px-4 py-3">{formatPrice(property)}</td>
                <td className="px-4 py-3">{statusLabel(property.status)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-xs ${
                      property.published
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                    }`}
                  >
                    {property.published ? "Publicado" : "Borrador"}
                  </span>
                  {property.featured && (
                    <span className="ml-1 rounded-sm bg-[var(--color-accent)]/20 px-2 py-0.5 text-xs text-[var(--color-accent)]">
                      ★
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{property.images.length}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/inmuebles/${property.id}/editar`}
                      className="text-[var(--color-accent)] hover:underline"
                    >
                      Editar
                    </Link>
                    {property.published && (
                      <Link
                        href={`/inmuebles/${property.slug}`}
                        target="_blank"
                        className="text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      >
                        Ver
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
