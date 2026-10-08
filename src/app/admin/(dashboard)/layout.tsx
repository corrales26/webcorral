import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
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

export default async function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[var(--color-paper)]">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-rule)] bg-[var(--color-navy)] print:hidden lg:block">
        <div className="flex h-full flex-col p-6">
          <Link href="/admin" className="mb-6 flex flex-col items-center gap-3 text-center">
            <LogoMark className="h-14" />
            <span>
              <p className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-widest text-[var(--color-accent)]">
                Corral CMS
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">Panel de administración</p>
            </span>
          </Link>
          <Link
            href="/admin/inmuebles/nuevo"
            className="mb-6 block rounded-md bg-[var(--color-accent)] px-3 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            + Nuevo inmueble
          </Link>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-[var(--color-on-navy)] transition-colors hover:bg-[var(--color-navy-light)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-3 border-t border-[var(--color-navy-light)] pt-4">
            <Link
              href="/"
              target="_blank"
              className="block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              Ver web pública →
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3 print:hidden lg:flex lg:items-center lg:justify-end lg:px-8">
          <AdminMobileNav />
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <AdminLogoutButton />
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 print:p-0 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
