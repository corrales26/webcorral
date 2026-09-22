"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InviteCollaboratorForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const inputClass =
    "w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]";

  const labelClass =
    "mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const res = await fetch("/api/colaboraciones/invitar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = (await res.json()) as { error?: string };

    setPending(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo invitar");
      return;
    }

    setName("");
    setEmail("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div>
        <label htmlFor="collaborator-name" className={labelClass}>
          Nombre
        </label>
        <input
          id="collaborator-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="collaborator-email" className={labelClass}>
          Correo
        </label>
        <input
          id="collaborator-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Invitando…" : "Invitar"}
      </button>
      {error && (
        <p className="sm:col-span-3 text-sm text-red-700 dark:text-red-300">{error}</p>
      )}
    </form>
  );
}
