"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, navLinks } from "@/lib/data";
import { LogoMark } from "./LogoMark";
import { ThemeToggle } from "./ThemeToggle";

const SCROLL_ON = 8;
const SCROLL_OFF = 2;

function WhatsAppLink() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)] text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const next =
        !scrolledRef.current && y > SCROLL_ON
          ? true
          : scrolledRef.current && y < SCROLL_OFF
            ? false
            : scrolledRef.current;

      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky z-50 transition-[top,padding] duration-300 ease-out ${
        scrolled ? "top-3 px-3 sm:top-4 sm:px-4" : "top-0"
      }`}
    >
      <div
        className={`mx-auto transition-[max-width,border-radius,box-shadow,padding,background-color,border-color] duration-300 ease-out ${
          scrolled
            ? "max-w-6xl rounded-2xl border border-[var(--color-rule)]/50 bg-[var(--color-paper)]/75 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:px-5 dark:bg-[var(--color-paper)]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "max-w-7xl border-b border-[var(--color-rule)] bg-[var(--color-paper)] px-4 py-4 sm:px-6 lg:px-8"
        }`}
      >
        <div
          className={`flex items-center justify-between ${
            scrolled ? "gap-3" : "gap-3 xl:gap-4"
          }`}
        >
          <Link
            href="/"
            className="flex min-w-0 shrink items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)] xl:gap-3"
          >
            <LogoMark
              priority
              className={scrolled ? "h-10" : "h-12 xl:h-16"}
            />
            <p className="min-w-0 truncate font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-accent)] min-[380px]:text-sm min-[380px]:tracking-widest xl:hidden">
              Corral Business
            </p>
            {scrolled ? (
              <p className="hidden whitespace-nowrap font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-widest text-[var(--color-accent)] xl:block">
                Corral Business
              </p>
            ) : (
              <div className="hidden xl:block">
                <p className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-widest text-[var(--color-accent)]">
                  Corral Business
                </p>
                <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  {siteConfig.tagline}
                </p>
              </div>
            )}
          </Link>

          <div className="flex shrink-0 items-center gap-1 xl:hidden">
            <ThemeToggle />
            <WhatsAppLink />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((current) => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>

          <div className="hidden min-w-0 items-center gap-2 xl:flex">
            <nav aria-label="Navegación principal">
              <ul className="flex flex-nowrap items-center gap-x-2 lg:gap-x-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="whitespace-nowrap px-1.5 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:px-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <span
              className="hidden h-5 w-px shrink-0 bg-[var(--color-rule)] sm:block"
              aria-hidden="true"
            />

            <div className="flex shrink-0 items-center gap-1.5">
              <ThemeToggle />
              <WhatsAppLink />
            </div>
          </div>
        </div>

        {open && (
          <nav id="site-menu" aria-label="Navegación principal" className="mt-3 border-t border-[var(--color-rule)] pt-1 xl:hidden">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2.5 text-sm font-medium uppercase tracking-wider text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
