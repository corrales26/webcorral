import Link from "next/link";

interface PageHeroProps {
  title: string;
  subtitle?: string;
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
    <section className="bg-[var(--color-navy)] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          ← {backLabel}
        </Link>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold uppercase tracking-wide text-[var(--color-on-navy)] sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-[var(--color-on-navy)]/85">
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
    <section className="bg-[var(--color-paper)] py-12 lg:py-16">
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-3xl" : "max-w-7xl"}`}
      >
        {children}
      </div>
    </section>
  );
}
