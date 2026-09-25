import type { Metadata } from "next";
import { PageHero, PageContent } from "@/components/PageLayout";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Aviso legal",
};

export default function AvisoLegalPage() {
  return (
    <>
      <PageHero
        title="Aviso legal"
        subtitle="Información general sobre el titular del sitio web y condiciones de uso."
      />
      <PageContent narrow>
        <div className="prose-custom space-y-6 text-[var(--color-ink-2)]">
          <p className="leading-relaxed">
            En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
            Información y de Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Titular del sitio web
          </h2>
          <ul className="space-y-2">
            <li>
              <strong className="text-[var(--color-ink)]">Denominación:</strong>{" "}
              {siteConfig.legalHolder}
            </li>
            <li>
              <strong className="text-[var(--color-ink)]">Domicilio:</strong>
              <span className="mt-1 block space-y-1">
                {siteConfig.addresses.map((address) => (
                  <span key={address} className="block">
                    {address}
                  </span>
                ))}
              </span>
            </li>
            <li>
              <strong className="text-[var(--color-ink)]">Correo electrónico:</strong>{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-accent)] hover:underline">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <strong className="text-[var(--color-ink)]">Teléfono:</strong>{" "}
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-[var(--color-accent)] hover:underline">
                {siteConfig.phone}
              </a>
            </li>
          </ul>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Objeto
          </h2>
          <p className="leading-relaxed">
            Este sitio web tiene por objeto facilitar al público el conocimiento de las actividades
            de {siteConfig.legalHolder} y de los servicios inmobiliarios que ofrece, así como permitir la
            comunicación con clientes, interesados y usuarios.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Condiciones de uso
          </h2>
          <p className="leading-relaxed">
            El acceso y uso de este sitio web atribuye la condición de usuario e implica la
            aceptación de las presentes condiciones. El usuario se compromete a hacer un uso
            adecuado de los contenidos y servicios, absteniéndose de emplearlos para actividades
            ilícitas o contrarias a la buena fe.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Propiedad intelectual
          </h2>
          <p className="leading-relaxed">
            Los contenidos de este sitio web, incluyendo textos, imágenes, logotipos y diseño,
            están protegidos por la legislación sobre propiedad intelectual e industrial. Queda
            prohibida su reproducción, distribución o comunicación pública sin autorización expresa
            del titular.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Responsabilidad
          </h2>
          <p className="leading-relaxed">
            {siteConfig.legalHolder} no se hace responsable de los daños derivados del uso del sitio web
            ni de la información publicada en el mismo, sin perjuicio de la responsabilidad que
            pudiera derivarse de la normativa aplicable.
          </p>
        </div>
      </PageContent>
    </>
  );
}
