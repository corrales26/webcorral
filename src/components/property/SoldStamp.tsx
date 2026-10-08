interface SoldStampProps {
  className?: string;
  size?: "card" | "detail";
}

export function SoldStamp({ className = "", size = "card" }: SoldStampProps) {
  const seal =
    size === "detail"
      ? "h-48 w-48 sm:h-56 sm:w-56"
      : "aspect-square h-[58%] w-auto min-h-[6.75rem] max-h-44";
  const title =
    size === "detail"
      ? "text-4xl sm:text-5xl"
      : "text-3xl leading-none";
  const caption = size === "detail" ? "text-[10px] tracking-[0.32em]" : "text-[7px] tracking-[0.22em]";

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/50 via-[var(--color-navy)]/15 to-transparent" />
      <div className={`absolute left-1/2 top-1/2 ${seal} -translate-x-1/2 -translate-y-1/2 -rotate-12`}>
        <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.4)]" aria-hidden="true">
          <circle cx="100" cy="100" r="97" fill="var(--color-navy)" fillOpacity="0.78" stroke="var(--color-accent)" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeDasharray="1.4 3.6" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="var(--color-accent)" strokeWidth="0.7" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="mb-1 block h-px w-8 bg-[var(--color-accent)]" />
          <p className={`font-[family-name:var(--font-display)] italic text-[var(--color-on-navy)] ${title}`}>
            Vendida
          </p>
          <span className="mt-1 block h-px w-8 bg-[var(--color-accent)]" />
          <p className={`mt-1.5 font-semibold uppercase text-[var(--color-accent)] ${caption}`}>
            No disponible
          </p>
        </div>
      </div>
    </div>
  );
}
