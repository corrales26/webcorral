import { PROPERTY_STATUSES, PROPERTY_TYPES } from "@/lib/types/property";

const inputClass =
  "w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]";

const labelClass =
  "mb-1 block text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-on-navy)]/80";

export function HeroPropertySearch() {
  return (
    <form
      action="/inmuebles"
      method="get"
      className="mt-8 w-full max-w-3xl rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-navy)]/90 p-4 text-left backdrop-blur-sm sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="hero-search" className={labelClass}>
            Buscar
          </label>
          <input
            id="hero-search"
            name="q"
            type="search"
            placeholder="Ubicación, referencia..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hero-status" className={labelClass}>
            Operación
          </label>
          <select id="hero-status" name="status" defaultValue="all" className={inputClass}>
            <option value="all">Todas</option>
            {Object.entries(PROPERTY_STATUSES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="hero-type" className={labelClass}>
            Tipo
          </label>
          <select id="hero-type" name="type" defaultValue="all" className={inputClass}>
            <option value="all">Todos</option>
            {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:w-auto"
      >
        Buscar inmuebles →
      </button>
    </form>
  );
}
