"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig, navLinks } from "@/lib/data";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky z-50 transition-all duration-300 ease-out ${
        scrolled ? "top-3 px-3 sm:top-4 sm:px-4" : "top-0"
      }`}
    >
      <div
        className={`overflow-hidden bg-[var(--color-navy)] text-[var(--color-on-navy)] transition-all duration-300 ease-out ${
          scrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm sm:px-6 lg:px-8">
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="text-[var(--color-on-navy)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            {siteConfig.phone}
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle variant="on-dark" />
            <Link
              href="/contacto"
              className="rounded-sm bg-[var(--color-accent)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`mx-auto transition-all duration-300 ease-out ${
          scrolled
            ? "max-w-5xl rounded-2xl border border-[var(--color-rule)]/50 bg-[var(--color-paper)]/75 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:px-6 dark:bg-[var(--color-paper)]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "max-w-7xl border-b border-[var(--color-rule)] bg-[var(--color-paper)] px-4 py-4 sm:px-6 lg:px-8"
        }`}
      >
        <div
          className={`flex flex-col items-center gap-4 sm:flex-row sm:justify-between ${
            scrolled ? "gap-3 sm:gap-6" : ""
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-focus)]"
          >
            <div
              className={`flex items-center justify-center rounded-full border-2 border-[var(--color-accent)] transition-all duration-300 ${
                scrolled ? "h-10 w-10" : "h-14 w-14"
              }`}
            >
              <span
                className={`font-[family-name:var(--font-display)] font-bold text-[var(--color-accent)] transition-all duration-300 ${
                  scrolled ? "text-sm" : "text-lg"
                }`}
              >
                CB
              </span>
            </div>
            <div className={scrolled ? "hidden sm:block" : ""}>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-widest text-[var(--color-accent)]">
                Corral Business
              </p>
              <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                {siteConfig.tagline}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav aria-label="Navegación principal">
              <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 sm:gap-x-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {scrolled && <ThemeToggle />}
          </div>
        </div>
      </div>
    </header>
  );
}
