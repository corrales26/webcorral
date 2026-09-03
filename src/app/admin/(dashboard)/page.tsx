import Link from "next/link";
import { getPropertyStats, getAllProperties } from "@/lib/storage/properties";
import { formatPrice, statusLabel } from "@/lib/property-utils";

export default async function AdminDashboardPage() {
  const [stats, properties] = await Promise.all([
    getPropertyStats(),
    getAllProperties(true),
  ]);

  const recent = properties.slice(0, 5);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-ink)]">
        Panel de control
      </h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Gestiona los inmuebles y revisa el estado de la web.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total inmuebles", value: stats.total },
          { label: "Publicados", value: stats.published },
          { label: "Borradores", value: stats.draft },
          { label: "Destacados", value: stats.featured },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-5"
          >
            <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-accent)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "En venta", value: stats.venta },
          { label: "En alquiler", value: stats.alquiler },
          { label: "Para rehabilitar", value: stats.rehabilitar },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4"
          >
            <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
            <p className="text-xl font-bold text-[var(--color-ink)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
          Últimos inmuebles
        </h2>
        <Link
          href="/admin/inmuebles/nuevo"
          className="rounded-sm bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          + Nuevo inmueble
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--color-rule)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[var(--color-paper-2)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">Referencia</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {recent.map((property) => (
              <tr key={property.id} className="border-t border-[var(--color-rule)]">
                <td className="px-4 py-3 font-mono text-xs">{property.reference}</td>
                <td className="px-4 py-3">{property.title}</td>
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
                    {property.published ? "Sí" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/inmuebles/${property.id}/editar`}
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
