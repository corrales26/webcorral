import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";
import { services } from "@/lib/data";
import { metaDescription } from "@/lib/seo";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.href.replace("/servicios/", ""),
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.href === `/servicios/${slug}`);
  if (!service) return { title: "Servicio no encontrado", robots: { index: false, follow: false } };
  const description =
    slug === "rehabilitacion"
      ? "Estudiamos el potencial del inmueble y te ofrecemos soluciones para sacarle el mayor partido, proyecto adaptado a las posibilidades."
      : service.description;
  return { title: service.title, description: metaDescription(description) };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.href === `/servicios/${slug}`);

  if (!service) {
    notFound();
  }

  const isRehabilitacion = slug === "rehabilitacion";

  return (
    <>
      <PageHero
        title={
          isRehabilitacion ? (
            <>
              Rehabilitamos tu vivienda
              <br />
              Transformamos tu inmueble en una nueva oportunidad
            </>
          ) : (
            service.title
          )
        }
        subtitle={
          isRehabilitacion
            ? "Estudiamos el potencial del inmueble y te ofrecemos soluciones para sacarle el mayor partido, proyecto adaptado a las posibilidades."
            : service.description
        }
        backHref="/servicios"
        backLabel="Volver a servicios"
      />
      <PageContent>
        <div className="mx-auto w-full max-w-3xl">
          <ContactForm
            title={`Solicitar ${service.title.toLowerCase()}`}
            description="Déjanos tus datos y te contactaremos para explicarte cómo podemos ayudarte."
          />
        </div>
      </PageContent>
    </>
  );
}
