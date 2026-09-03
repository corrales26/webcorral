import type { Property } from "@/lib/types/property";
import {
  conditionLabel,
  getActiveAmenities,
  typeLabel,
} from "@/lib/property-utils";

interface PropertySpecsProps {
  property: Property;
}

export function PropertySpecs({ property }: PropertySpecsProps) {
  const amenities = getActiveAmenities(property);

  const specs = [
    { label: "Referencia", value: property.reference },
    { label: "Tipo", value: typeLabel(property.type) },
    { label: "Estado", value: conditionLabel(property.condition) },
    { label: "Superficie", value: `${property.area} m²` },
    property.plotArea
      ? { label: "Parcela", value: `${property.plotArea} m²` }
      : null,
    { label: "Habitaciones", value: String(property.bedrooms) },
    { label: "Baños", value: String(property.bathrooms) },
    property.floor !== undefined
      ? {
          label: "Planta",
          value:
            property.totalFloors !== undefined
              ? `${property.floor}ª de ${property.totalFloors}`
              : `${property.floor}ª`,
        }
      : null,
    property.yearBuilt
      ? { label: "Año construcción", value: String(property.yearBuilt) }
      : null,
    property.energyRating
      ? { label: "Certificación energética", value: property.energyRating }
      : null,
    property.orientation
      ? { label: "Orientación", value: property.orientation }
      : null,
    property.address ? { label: "Dirección", value: property.address } : null,
    { label: "Provincia", value: property.province },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
          Características
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="flex justify-between gap-4 border-b border-[var(--color-rule)] py-2 text-sm"
            >
              <dt className="text-[var(--color-muted)]">{spec.label}</dt>
              <dd className="text-right font-medium text-[var(--color-ink)]">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {amenities.length > 0 && (
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Comodidades
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {amenities.map((amenity) => (
              <li
                key={amenity}
                className="flex items-center gap-2 text-sm text-[var(--color-ink-2)]"
              >
                <span className="text-[var(--color-accent)]">✓</span>
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {property.features.length > 0 && (
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
            Detalles destacados
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {property.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-[var(--color-ink-2)]"
              >
                <span className="text-[var(--color-accent)]">●</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
