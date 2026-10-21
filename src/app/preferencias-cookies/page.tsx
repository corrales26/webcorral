import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, PageContent } from "@/components/PageLayout";
import { CookiePreferencesForm } from "@/components/CookiePreferencesForm";

export const metadata: Metadata = {
  title: "Preferencias de cookies",
  robots: { index: false, follow: false },
};

export default function PreferenciasCookiesPage() {
  return (
    <>
      <PageHero
        title="Preferencias de cookies"
        subtitle="Configure qué cookies opcionales desea permitir en este sitio web."
      />
      <PageContent narrow>
        <p className="mb-8 text-sm leading-relaxed text-[var(--color-ink-2)]">
          Puede modificar su elección en cualquier momento. Para más información, consulte nuestra{" "}
          <Link href="/politica-cookies" className="text-[var(--color-accent)] hover:underline">
            política de cookies
          </Link>
          .
        </p>
        <CookiePreferencesForm />
      </PageContent>
    </>
  );
}
