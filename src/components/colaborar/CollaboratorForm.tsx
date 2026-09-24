"use client";

import { useState } from "react";
import { UPLOAD_MEDIA_ACCEPT } from "@/lib/media-utils";

export function CollaboratorForm() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const inputClass =
    "w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]";

  const labelClass =
    "mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = event.currentTarget;
    const res = await fetch("/api/colaborar", {
      method: "POST",
      body: new FormData(form),
    });
    const data = (await res.json()) as { error?: string };

    setPending(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo enviar");
      return;
    }

    form.reset();
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {sent && (
        <p className="rounded-md bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)]">
          Enviado. Puedes mandar otro cuando quieras.
        </p>
      )}
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="body" className={labelClass}>
          Texto
        </label>
        <textarea id="body" name="body" required rows={6} maxLength={5000} className={inputClass} />
      </div>
      <div>
        <label htmlFor="files" className={labelClass}>
          Fotos y vídeos
        </label>
        <input
          id="files"
          name="files"
          type="file"
          accept={UPLOAD_MEDIA_ACCEPT}
          multiple
          required
          className={inputClass}
        />
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          JPG, PNG, WebP (hasta 5 MB) · MP4, WebM, MOV (hasta 50 MB)
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
