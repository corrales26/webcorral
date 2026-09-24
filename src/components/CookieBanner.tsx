"use client";

import Link from "next/link";
import { useCookieConsent } from "@/context/CookieConsentProvider";

export function CookieBanner() {
  const { bannerVisible, acceptAll, acceptNecessaryOnly } = useCookieConsent();

  if (!bannerVisible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:p-6 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2
            id="cookie-banner-title"
            className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-ink)]"
          >
            Uso de cookies
          </h2>
          <p
            id="cookie-banner-description"
            className="mt-2 text-sm leading-relaxed text-[var(--color-ink-2)]"
          >
            Utilizamos cookies propias para el funcionamiento del sitio y, con su consentimiento,
            para recordar preferencias. Puede aceptar todas, rechazar las opcionales o configurarlas
            en detalle. Consulte nuestra{" "}
            <Link href="/politica-cookies" className="text-[var(--color-accent)] hover:underline">
              política de cookies
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:shrink-0">
          <button
            type="button"
            onClick={acceptNecessaryOnly}
            className="inline-flex items-center justify-center rounded-sm border border-[var(--color-navy)] px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-[var(--color-navy)] transition-colors hover:bg-[var(--color-navy)] hover:text-[var(--color-on-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] dark:border-[var(--color-on-navy)] dark:text-[var(--color-on-navy)] dark:hover:bg-[var(--color-on-navy)] dark:hover:text-[var(--color-navy)]"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Aceptar todas
          </button>
          <Link
            href="/preferencias-cookies"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--color-rule)] px-4 py-2.5 text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            Configurar
          </Link>
        </div>
      </div>
    </div>
  );
}
