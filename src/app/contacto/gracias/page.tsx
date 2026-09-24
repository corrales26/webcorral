import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, PageContent } from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Mensaje enviado",
};

export default function ContactoGraciasPage() {
  return (
    <>
      <PageHero
        title="Mensaje enviado"
        subtitle="Hemos recibido tu solicitud. Nos pondremos en contacto contigo lo antes posible."
      />
      <PageContent narrow>
        <p className="text-[var(--color-ink-2)]">
          Gracias por confiar en Corral Business. Si necesitas una respuesta urgente, también
          puedes llamarnos desde la página de{" "}
          <Link href="/contacto" className="text-[var(--color-accent)] hover:underline">
            contacto
          </Link>
          .
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          Volver al inicio
        </Link>
      </PageContent>
    </>
  );
}
