"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { acceptAllConsent, necessaryOnlyConsent } from "@/lib/cookie-consent";
import { useCookieConsent } from "@/context/CookieConsentProvider";

export function CookiePreferencesForm() {
  const router = useRouter();
  const { consent, savePreferences, acceptAll, acceptNecessaryOnly } = useCookieConsent();
  const [preferences, setPreferences] = useState({
    preferences: consent?.preferences ?? false,
    analytics: consent?.analytics ?? false,
  });

  useEffect(() => {
    if (!consent) return;
    setPreferences({
      preferences: consent.preferences,
      analytics: consent.analytics,
    });
  }, [consent]);

  function handleSave() {
    savePreferences(preferences);
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
              Cookies necesarias
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-2)]">
              Imprescindibles para el funcionamiento del sitio (por ejemplo, recordar si aceptó o
              rechazó cookies). No se pueden desactivar.
            </p>
          </div>
          <span className="shrink-0 rounded-sm bg-[var(--color-navy)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-on-navy)]">
            Siempre activas
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <label className="flex cursor-pointer items-start justify-between gap-4">
          <span>
            <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
              Cookies de preferencias
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-[var(--color-ink-2)]">
              Permiten recordar opciones como el tema claro u oscuro.
            </span>
          </span>
          <input
            type="checkbox"
            checked={preferences.preferences}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                preferences: event.target.checked,
              }))
            }
            className="mt-1 rounded border-[var(--color-rule)] text-[var(--color-accent)] focus:ring-[var(--color-focus)]"
          />
        </label>
      </div>

      <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-4 sm:p-6">
        <label className="flex cursor-pointer items-start justify-between gap-4">
          <span>
            <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
              Cookies analíticas
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-[var(--color-ink-2)]">
              Nos ayudan a entender el uso del sitio de forma agregada. Actualmente no están
              activas en la web.
            </span>
          </span>
          <input
            type="checkbox"
            checked={preferences.analytics}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                analytics: event.target.checked,
              }))
            }
            className="mt-1 rounded border-[var(--color-rule)] text-[var(--color-accent)] focus:ring-[var(--color-focus)]"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => {
            setPreferences({
              preferences: acceptAllConsent.preferences,
              analytics: acceptAllConsent.analytics,
            });
            acceptAll();
            router.push("/");
          }}
          className="inline-flex items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          Aceptar todas
        </button>
        <button
          type="button"
          onClick={() => {
            setPreferences({
              preferences: necessaryOnlyConsent.preferences,
              analytics: necessaryOnlyConsent.analytics,
            });
            acceptNecessaryOnly();
            router.push("/");
          }}
          className="inline-flex items-center justify-center rounded-sm border border-[var(--color-navy)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-navy)] transition-colors hover:bg-[var(--color-navy)] hover:text-[var(--color-on-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] dark:border-[var(--color-on-navy)] dark:text-[var(--color-on-navy)] dark:hover:bg-[var(--color-on-navy)] dark:hover:text-[var(--color-navy)]"
        >
          Rechazar
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center rounded-sm border border-[var(--color-rule)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          Guardar preferencias
        </button>
      </div>
    </div>
  );
}
