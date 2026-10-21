import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, PageContent } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertySpecs } from "@/components/property/PropertySpecs";
import { FeaturedBadge } from "@/components/property/FeaturedBadge";
import { PropertyCard } from "@/components/property/PropertyCard";
import {
  getPropertyById,
  getAllProperties,
  getSimilarProperties,
} from "@/lib/storage/properties";
import {
  closedStampTitle,
  formatPrice,
  statusColor,
  statusLabel,
  typeLabel,
  conditionLabel,
  formatDate,
  featuredBadgePropertyIds,
} from "@/lib/property-utils";
import { jsonLdScript, metaDescription, propertyJsonLd, propertyShareImage } from "@/lib/seo";

export const revalidate = 0;
export const dynamicParams = true;

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const properties = await getAllProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyById(slug);
  if (!property || !property.published) {
    return { title: "Inmueble no encontrado", robots: { index: false, follow: false } };
  }

  const title = `${property.title} en ${property.location}`;
  const description = metaDescription(
    property.description,
    `${title}. ${statusLabel(property.status)}.`,
  );
  const image = propertyShareImage(property);

  return {
    title,
    description,
    alternates: { canonical: `/inmuebles/${property.slug}` },
    openGraph: {
      title,
      description,
      url: `/inmuebles/${property.slug}`,
      type: "website",
      ...(image ? { images: [{ url: image, alt: property.title }] } : {}),
    },
    ...(image ? { twitter: { card: "summary_large_image" as const, images: [image] } } : {}),
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyById(slug);

  if (!property || !property.published) {
    notFound();
  }

  const [similar, allPublished] = await Promise.all([
    getSimilarProperties(property),
    getAllProperties(),
  ]);
  const featuredBadgeIds = featuredBadgePropertyIds(allPublished);
  const showFeaturedBadge = featuredBadgeIds.has(property.id);
  const stampTitle = closedStampTitle(property.status);
  const comingSoon = property.status === "proximamente";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(propertyJsonLd(property)) }}
      />
      <PageHero
        title={property.title}
        subtitle={property.location}
        backHref="/inmuebles"
        backLabel="Volver a inmuebles"
      />
      <PageContent>
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-8">
            <PropertyGallery images={property.images} title={property.title} stampTitle={stampTitle ?? undefined} />

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--color-accent)]">
                  {formatPrice(property)}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Ref. {property.reference}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusColor(property.status)}`}
                >
                  {statusLabel(property.status)}
                </span>
                <span className="rounded-sm border border-[var(--color-rule)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-2)]">
                  {typeLabel(property.type)}
                </span>
                <span className="rounded-sm border border-[var(--color-rule)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-2)]">
                  {conditionLabel(property.condition)}
                </span>
                {showFeaturedBadge && <FeaturedBadge />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[
                { label: "Habitaciones", value: property.bedrooms },
                { label: "Baños", value: property.bathrooms },
                { label: "Superficie", value: `${property.area} m²` },
                property.plotArea
                  ? { label: "Parcela", value: `${property.plotArea} m²` }
                  : null,
              ]
                .filter(Boolean)
                .map((item) => (
                  <div
                    key={item!.label}
                    className="min-w-0 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-3 text-center sm:p-4"
                  >
                    <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-accent)]">
                      {item!.value}
                    </p>
                    <p className="mt-1 break-words text-[11px] uppercase tracking-wide text-[var(--color-muted)] sm:text-xs sm:tracking-wider">
                      {item!.label}
                    </p>
                  </div>
                ))}
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
                Descripción
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-ink-2)]">
                {property.description.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <PropertySpecs property={property} />

            {property.address && (
              <div className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6">
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
                  Ubicación
                </h2>
                <p className="mt-2 text-[var(--color-ink-2)]">{property.address}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {property.location}, {property.province}
                </p>
              </div>
            )}

            <p className="text-xs text-[var(--color-muted)]">
              Actualizado el {formatDate(property.updatedAt)}
            </p>
          </div>

          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ContactForm
              title={
                property.status === "vendida"
                  ? "Inmueble vendido"
                  : property.status === "alquilada"
                    ? "Inmueble alquilado"
                    : property.status === "reservada"
                      ? "Inmueble reservado"
                      : comingSoon
                        ? "Promoción próximamente"
                        : "Solicitar información"
              }
              description={
                stampTitle
                  ? `Este inmueble en ${property.location} ya no está disponible. Cuéntanos qué buscas y te ayudamos a encontrar otro.`
                  : comingSoon
                    ? `Esta promoción en ${property.location} todavía no ha comenzado. Déjanos tus datos y te avisamos.`
                    : `¿Te interesa este inmueble en ${property.location}? Déjanos tus datos y te contactaremos.`
              }
              submitLabel={stampTitle || comingSoon ? "Contactar" : "Solicitar visita"}
              propertyRef={property.reference}
              propertyTitle={property.title}
            />
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-16 border-t border-[var(--color-rule)] pt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
              Inmuebles similares
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  showTitle
                  showFeaturedBadge={featuredBadgeIds.has(p.id)}
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/inmuebles"
                className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:underline"
              >
                Ver todos los inmuebles →
              </Link>
            </div>
          </div>
        )}
      </PageContent>
    </>
  );
}
