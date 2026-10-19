import Link from "next/link";
import type { Property } from "@/lib/types/property";
import { PropertyMedia } from "@/components/media/PropertyMedia";
import { FeaturedBadge } from "@/components/property/FeaturedBadge";
import { SoldStamp } from "@/components/property/SoldStamp";
import {
  closedStampTitle,
  formatPrice,
  getCoverImage,
  getCoverIsVideo,
  statusColor,
  statusLabel,
  typeLabel,
} from "@/lib/property-utils";

interface PropertyCardProps {
  property: Property;
  showTitle?: boolean;
  showFeaturedBadge?: boolean;
}

export function PropertyCard({
  property,
  showTitle = false,
  showFeaturedBadge = false,
}: PropertyCardProps) {
  const cover = getCoverImage(property);
  const coverIsVideo = getCoverIsVideo(property);
  const stampTitle = closedStampTitle(property.status);

  return (
    <article className="group overflow-hidden rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-2)] transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <PropertyMedia
          src={cover}
          alt={property.title}
          fill
          className={`object-cover ${coverIsVideo ? "" : "transition-transform duration-300 group-hover:scale-105"}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {!stampTitle && (
          <span
            className={`absolute left-3 top-3 z-20 rounded-sm px-2 py-1 text-xs font-semibold uppercase tracking-wider ${statusColor(property.status)}`}
          >
            {statusLabel(property.status)}
          </span>
        )}
        {stampTitle && <SoldStamp title={stampTitle} />}
        {showFeaturedBadge && (
          <FeaturedBadge className="absolute right-3 top-3 z-20" />
        )}
        <span className="absolute bottom-3 left-3 z-20 rounded-sm bg-[var(--color-navy)]/80 px-2 py-1 text-xs text-[var(--color-on-navy)]">
          {typeLabel(property.type)}
        </span>
      </div>

      <div className="p-4">
        <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-accent)]">
          {formatPrice(property)}
        </p>
        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-[var(--color-ink)]">
          {property.location}
        </p>
        {showTitle && (
          <p className="mt-1 text-sm text-[var(--color-muted)]">{property.title}</p>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-muted)]">
          <span>{property.bedrooms} hab.</span>
          <span>{property.bathrooms} baños</span>
          <span>{property.area} m²</span>
        </div>

        <Link
          href={`/inmuebles/${property.slug}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-sm border border-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-on-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          Ver detalles →
        </Link>
      </div>
    </article>
  );
}
