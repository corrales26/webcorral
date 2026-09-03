import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center bg-[var(--color-paper)] px-4 py-24">
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold text-[var(--color-accent)]">
          404
        </h1>
        <p className="mt-4 text-lg text-[var(--color-ink-2)]">
          La página que buscas no existe.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-sm bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
