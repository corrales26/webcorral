import Link from "next/link";

interface PageHeroProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageHero({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Volver al inicio",
}: PageHeroProps) {
  return (
    <section className="border-b border-[var(--color-navy-light)] bg-[var(--color-navy)] py-4 lg:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="mb-2 inline-flex items-center gap-1 text-xs text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          ← {backLabel}
        </Link>
        <h1 className="break-words font-[family-name:var(--font-display)] text-lg font-semibold uppercase tracking-wide text-[var(--color-on-navy)] sm:text-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm text-[var(--color-on-navy)]/70">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

interface PageContentProps {
  children: React.ReactNode;
  narrow?: boolean;
}

export function PageContent({ children, narrow = false }: PageContentProps) {
  return (
    <section className="bg-[var(--color-paper)] py-8 lg:py-10">
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-3xl" : "max-w-7xl"}`}
      >
        {children}
      </div>
    </section>
  );
}
