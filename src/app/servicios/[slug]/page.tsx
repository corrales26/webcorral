import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";
import { services } from "@/lib/data";

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
  if (!service) return { title: "Servicio no encontrado" };
  return { title: service.title };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.href === `/servicios/${slug}`);

  if (!service) {
    notFound();
  }

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.description}
        backHref="/servicios"
        backLabel="Volver a servicios"
      />
      <PageContent>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-[var(--color-ink-2)]">
              En Corral Business ofrecemos un servicio de {service.title.toLowerCase()} integral,
              adaptado a las necesidades de cada cliente. Nuestro equipo te acompañará en cada paso
              del proceso con transparencia y profesionalidad.
            </p>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              Ver todos los servicios →
            </Link>
          </div>
          <ContactForm
            title={`Solicitar ${service.title.toLowerCase()}`}
            description="Déjanos tus datos y te contactaremos para explicarte cómo podemos ayudarte."
          />
        </div>
      </PageContent>
    </>
  );
}
