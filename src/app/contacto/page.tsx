import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";
import { EmailAddress } from "@/components/EmailAddress";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contacto",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        title="Háblanos"
        subtitle={
          <>
            Tu proyecto inmobiliario empieza con una buena conversación.
            <br />
            Cuéntanos qué necesitas y trabajamos para ti.
          </>
        }
      />
      <PageContent>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">
                Datos de contacto
              </h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Teléfono</dt>
                  <dd className="mt-1">
                    <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-lg text-[var(--color-ink)] hover:text-[var(--color-accent)]">
                      {siteConfig.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${siteConfig.email}`} className="text-lg text-[var(--color-ink)] hover:text-[var(--color-accent)]">
                      <EmailAddress email={siteConfig.email} />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Oficina</dt>
                  <dd className="mt-1 text-[var(--color-ink-2)]">{siteConfig.addresses[0]}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Horario</dt>
                  <dd className="mt-1 text-[var(--color-ink-2)]">{siteConfig.hours}</dd>
                </div>
              </dl>
            </div>
          </div>
          <ContactForm />
        </div>
      </PageContent>
    </>
  );
}
