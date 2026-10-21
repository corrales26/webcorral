import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, PageContent } from "@/components/PageLayout";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de Corral Business. Responsable: Jaime Corral Roseñada. Contacto: gestion.inmuebles@corralbusiness.es.",
};

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <PageHero
        title="Política de privacidad"
        subtitle="Información sobre el tratamiento de datos personales conforme al RGPD."
      />
      <PageContent narrow>
        <div className="prose-custom space-y-6 text-[var(--color-ink-2)]">
          <p className="leading-relaxed">
            De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de
            Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD),{" "}
            {siteConfig.legalHolder} informa a los usuarios sobre el tratamiento de sus datos personales.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Responsable del tratamiento
          </h2>
          <ul className="space-y-2">
            <li>
              <strong className="text-[var(--color-ink)]">Responsable:</strong>{" "}
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
              <strong className="text-[var(--color-ink)]">Correo:</strong>{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-accent)] hover:underline">
                {siteConfig.email}
              </a>
            </li>
          </ul>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Finalidad del tratamiento
          </h2>
          <p className="leading-relaxed">
            Los datos personales facilitados a través de formularios de contacto, solicitud de
            información o valoración serán tratados para atender su consulta, gestionar la relación
            comercial y, en su caso, prestar los servicios inmobiliarios solicitados.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Legitimación
          </h2>
          <p className="leading-relaxed">
            La base legal del tratamiento es el consentimiento del interesado al enviar sus datos,
            la ejecución de medidas precontractuales o contractuales, y el interés legítimo del
            responsable en responder a las solicitudes recibidas.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Conservación de datos
          </h2>
          <p className="leading-relaxed">
            Los datos se conservarán mientras se mantenga la relación con el usuario y, posteriormente,
            durante los plazos legalmente exigibles para atender posibles responsabilidades.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Destinatarios
          </h2>
          <p className="leading-relaxed">
            No se cederán datos a terceros salvo obligación legal o cuando sea necesario para la
            prestación del servicio solicitado (por ejemplo, proveedores de hosting o herramientas
            tecnológicas con las garantías adecuadas).
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Derechos del interesado
          </h2>
          <p className="leading-relaxed">
            Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación
            del tratamiento y portabilidad enviando un correo a{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-accent)] hover:underline">
              {siteConfig.email}
            </a>
            , adjuntando copia de su documento identificativo. También tiene derecho a presentar una
            reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
          </p>

          <p className="leading-relaxed">
            Para más información sobre el uso de cookies, consulte nuestra{" "}
            <Link href="/politica-cookies" className="text-[var(--color-accent)] hover:underline">
              Política de cookies
            </Link>
            .
          </p>
        </div>
      </PageContent>
    </>
  );
}
