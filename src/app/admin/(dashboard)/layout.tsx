import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/inmuebles", label: "Inmuebles" },
  { href: "/admin/inmuebles/nuevo", label: "Nuevo inmueble" },
];

export default async function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)]">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-rule)] bg-[var(--color-navy)] lg:block">
        <div className="flex h-full flex-col p-6">
          <Link href="/admin" className="mb-8">
            <p className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-widest text-[var(--color-accent)]">
              Corral CMS
            </p>
            <p className="text-xs text-[var(--color-muted)]">Panel de administración</p>
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

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3 lg:px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/admin" className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-accent)]">
              CMS
            </Link>
            <nav className="flex gap-2 text-xs">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden lg:block">
              <AdminLogoutButton />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
