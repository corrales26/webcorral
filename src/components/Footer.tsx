import Link from "next/link";
import { EmailAddress } from "@/components/EmailAddress";
import { LogoMark } from "@/components/LogoMark";
import { legalLinks, siteConfig } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-[var(--color-navy)] text-[var(--color-on-navy)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-accent)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Llámanos
              </h3>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="block text-lg font-medium transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                {siteConfig.phone}
              </a>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{siteConfig.hours}</p>
            </div>

            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-accent)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                WhatsApp
              </h3>
              <Link
                href="/contacto"
                className="block text-lg font-medium transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                Escríbenos
              </Link>
              <p className="mt-1 text-sm text-[var(--color-muted)]">Respuesta rápida</p>
            </div>

            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-accent)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Email
              </h3>
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-sm font-medium transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                <EmailAddress email={siteConfig.email} />
              </a>
            </div>

            <div>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-accent)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Oficina
              </h3>
              <p className="text-sm leading-relaxed">{siteConfig.address}</p>
            </div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-6 border-t border-[var(--color-navy-light)] pt-8 sm:grid-cols-3">
          <Link href="/" className="flex items-center justify-center gap-2 sm:justify-self-start">
            <LogoMark className="h-10" />
            <span className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]">
              Corral Business
            </span>
          </Link>

          <p className="text-center font-[family-name:var(--font-display)] text-lg italic text-[var(--color-accent)] sm:justify-self-center">
            Tu vivienda en buenas manos
          </p>

          <div className="flex items-center justify-center gap-4 sm:justify-self-end">
            <a href="#" aria-label="Instagram" className="text-[var(--color-on-navy)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-[var(--color-on-navy)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-[var(--color-on-navy)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        <nav
          aria-label="Enlaces legales"
          className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} Corral Business. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
