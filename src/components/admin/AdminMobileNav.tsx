"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { LogoMark } from "@/components/LogoMark";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/inmuebles", label: "Inmuebles" },
  { href: "/admin/contratos", label: "Contratos" },
  { href: "/admin/colaboraciones", label: "Colaboraciones" },
  { href: "/admin/invitaciones", label: "Invitaciones" },
  { href: "/admin/facturacion", label: "Facturación" },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/admin"
          className="flex min-w-0 items-center gap-2 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]"
        >
          <LogoMark className="h-8" />
          <span className="truncate">Corral CMS</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="admin-mobile-menu"
            onClick={() => setOpen((current) => !current)}
            className="rounded-md border border-[var(--color-rule)] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]"
          >
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

      {open && (
        <nav id="admin-mobile-menu" className="mt-3 flex flex-col gap-1 border-t border-[var(--color-rule)] pt-3">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-3 text-sm ${
                  active
                    ? "bg-[var(--color-paper)] font-semibold text-[var(--color-accent)]"
                    : "text-[var(--color-ink-2)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin/inmuebles/nuevo"
            className="mt-2 rounded-md bg-[var(--color-accent)] px-3 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)]"
          >
            + Nuevo inmueble
          </Link>
          <div className="mt-3 flex items-center justify-between border-t border-[var(--color-rule)] pt-3">
            <Link href="/" target="_blank" className="text-sm text-[var(--color-muted)]">
              Ver web pública →
            </Link>
            <AdminLogoutButton />
          </div>
        </nav>
      )}
    </div>
  );
}
