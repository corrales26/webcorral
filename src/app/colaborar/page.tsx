"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function CollaboratorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/colaborar/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      router.push("/colaborar/panel");
      router.refresh();
      return;
    }

    setError("Este correo no está invitado");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-8">
        <p className="text-center font-[family-name:var(--font-display)] text-2xl font-bold uppercase tracking-widest text-[var(--color-accent)]">
          Corral Business
        </p>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
          Entra con el correo con el que te han invitado
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Correo
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            />
          </div>
          {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
