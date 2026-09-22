"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-8">
        <div className="mb-8 text-center">
          <LogoMark className="mx-auto mb-4 h-16" />
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold uppercase tracking-widest text-[var(--color-accent)]">
            Corral CMS
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Accede al panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Correo
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Accediendo..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
            ← Volver a la web
          </Link>
        </p>
      </div>
    </div>
  );
}
