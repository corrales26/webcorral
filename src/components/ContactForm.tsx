"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/lib/data";

interface ContactFormProps {
  title?: string;
  description?: string;
  submitLabel?: string;
  propertyRef?: string;
  propertyTitle?: string;
}

export function ContactForm({
  title = "Cuéntanos qué necesitas",
  description = "Rellena el formulario y nos pondremos en contacto contigo lo antes posible.",
  submitLabel = "Enviar solicitud",
  propertyRef,
  propertyTitle,
}: ContactFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultMessage = propertyTitle
    ? `Me interesa el inmueble "${propertyTitle}" (Ref. ${propertyRef}).`
    : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("nombre"),
          phone: data.get("telefono"),
          email: data.get("email"),
          message: data.get("mensaje"),
          propertyRef: data.get("inmueble") || propertyRef,
          source: pathname,
          website: data.get("website"),
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "No se pudo enviar el mensaje.");
        return;
      }

      router.push("/contacto/gracias");
    } catch {
      setError("No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 lg:p-8">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--color-ink-2)]">{description}</p>

      {propertyRef && (
        <p className="mt-3 rounded-md bg-[var(--color-paper)] px-3 py-2 text-xs text-[var(--color-muted)]">
          Inmueble: <strong className="text-[var(--color-ink)]">{propertyRef}</strong>
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        {propertyRef && (
          <input type="hidden" name="inmueble" value={propertyRef} />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              disabled={submitting}
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              disabled={submitting}
              className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:opacity-60"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={submitting}
            className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="mensaje" className="mb-1 block text-sm font-medium text-[var(--color-ink)]">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={4}
            required
            defaultValue={defaultMessage}
            disabled={submitting}
            className="w-full rounded-md border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:opacity-60"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {submitting ? "Enviando..." : submitLabel}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--color-muted)]">
        También puedes llamarnos al{" "}
        <a
          href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
          className="font-medium text-[var(--color-accent)] hover:underline"
        >
          {siteConfig.phone}
        </a>{" "}
        o escribir a{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="font-medium text-[var(--color-accent)] hover:underline"
        >
          {siteConfig.email}
        </a>
      </p>
    </div>
  );
}
