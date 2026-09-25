import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, PageContent } from "@/components/PageLayout";
import { CONSENT_COOKIE_NAME, CONSENT_MAX_AGE_DAYS } from "@/lib/cookie-consent";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de cookies",
};

export default function PoliticaCookiesPage() {
  return (
    <>
      <PageHero
        title="Política de cookies"
        subtitle="Información sobre el uso de cookies en este sitio web."
      />
      <PageContent narrow>
        <div className="prose-custom space-y-6 text-[var(--color-ink-2)]">
          <p className="leading-relaxed">
            Este sitio web utiliza cookies y tecnologías similares para garantizar su correcto
            funcionamiento y mejorar la experiencia de navegación. A continuación se detalla su
            uso conforme a la normativa vigente.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Responsable
          </h2>
          <ul className="space-y-2">
            <li>
              <strong className="text-[var(--color-ink)]">Titular:</strong> {siteConfig.legalHolder}
            </li>
            <li>
              <strong className="text-[var(--color-ink)]">Domicilio:</strong> {siteConfig.addresses[0]}
            </li>
            <li>
              <strong className="text-[var(--color-ink)]">Correo:</strong>{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-accent)] hover:underline">
                {siteConfig.email}
              </a>
            </li>
          </ul>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            ¿Qué son las cookies?
          </h2>
          <p className="leading-relaxed">
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando
            visita un sitio web. Permiten recordar preferencias, mantener sesiones o analizar el
            uso del sitio.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Tipos de cookies que utilizamos
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[var(--color-accent)]">●</span>
              <span>
                <strong className="text-[var(--color-ink)]">Cookies necesarias:</strong> imprescindibles
                para el funcionamiento del sitio, como recordar su elección de cookies o mantener
                la sesión de administración.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[var(--color-accent)]">●</span>
              <span>
                <strong className="text-[var(--color-ink)]">Cookies de preferencias:</strong>{" "}
                recuerdan opciones elegidas por el usuario, como el tema claro u oscuro. Solo se
                activan con su consentimiento.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[var(--color-accent)]">●</span>
              <span>
                <strong className="text-[var(--color-ink)]">Cookies analíticas:</strong> permiten
                medir el uso del sitio de forma agregada. Actualmente no están implementadas.
              </span>
            </li>
          </ul>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Cookies utilizadas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--color-rule)] text-left">
                  <th className="py-2 pr-4 font-semibold text-[var(--color-ink)]">Cookie</th>
                  <th className="py-2 pr-4 font-semibold text-[var(--color-ink)]">Tipo</th>
                  <th className="py-2 pr-4 font-semibold text-[var(--color-ink)]">Finalidad</th>
                  <th className="py-2 font-semibold text-[var(--color-ink)]">Duración</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-ink-2)]">
                <tr className="border-b border-[var(--color-rule)]">
                  <td className="py-3 pr-4">{CONSENT_COOKIE_NAME}</td>
                  <td className="py-3 pr-4">Necesaria</td>
                  <td className="py-3 pr-4">Guardar su elección sobre cookies</td>
                  <td className="py-3">{CONSENT_MAX_AGE_DAYS} días</td>
                </tr>
                <tr className="border-b border-[var(--color-rule)]">
                  <td className="py-3 pr-4">cb_admin_session</td>
                  <td className="py-3 pr-4">Necesaria</td>
                  <td className="py-3 pr-4">Sesión del panel de administración</td>
                  <td className="py-3">Sesión</td>
                </tr>
                <tr className="border-b border-[var(--color-rule)]">
                  <td className="py-3 pr-4">cb_collaborator_session</td>
                  <td className="py-3 pr-4">Necesaria</td>
                  <td className="py-3 pr-4">Sesión de colaboradores</td>
                  <td className="py-3">Sesión</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">theme (localStorage)</td>
                  <td className="py-3 pr-4">Preferencias</td>
                  <td className="py-3 pr-4">Recordar tema claro u oscuro</td>
                  <td className="py-3">Persistente</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Gestión de cookies
          </h2>
          <p className="leading-relaxed">
            Puede aceptar, rechazar o configurar las cookies opcionales desde el banner inicial o
            en cualquier momento en la página de{" "}
            <Link href="/preferencias-cookies" className="text-[var(--color-accent)] hover:underline">
              preferencias de cookies
            </Link>
            . También puede configurar su navegador para bloquear o eliminar las cookies, aunque
            ello puede afectar al correcto funcionamiento de algunas funciones.
          </p>

          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Más información
          </h2>
          <p className="leading-relaxed">
            Para consultar cómo tratamos sus datos personales, revise nuestra{" "}
            <Link href="/politica-privacidad" className="text-[var(--color-accent)] hover:underline">
              Política de privacidad
            </Link>
            . Para cualquier duda puede contactar con {siteConfig.legalHolder} en{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-[var(--color-accent)] hover:underline">
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
      </PageContent>
    </>
  );
}
