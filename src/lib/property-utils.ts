import type { Property, PropertyStatus, PropertyType, PropertyCondition } from "@/lib/types/property";
import { PROPERTY_CONDITIONS, PROPERTY_STATUSES, PROPERTY_TYPES } from "@/lib/types/property";

export function getCoverImage(property: Property): string {
  return property.images[0] ?? "/uploads/placeholder.jpg";
}

export function formatPrice(property: Property): string {
  if (property.priceLabel) return property.priceLabel;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(property.price);
}

export function statusLabel(status: PropertyStatus): string {
  return PROPERTY_STATUSES[status];
}

export function typeLabel(type: PropertyType): string {
  return PROPERTY_TYPES[type];
}

export function conditionLabel(condition: PropertyCondition): string {
  return PROPERTY_CONDITIONS[condition];
}

export function statusColor(status: PropertyStatus): string {
  const colors: Record<PropertyStatus, string> = {
    venta: "bg-[var(--color-accent)] text-[var(--color-on-accent)]",
    alquiler:
      "bg-[var(--color-navy-light)] text-[var(--color-on-navy)] border border-[var(--color-accent)]",
    rehabilitar: "bg-orange-600 text-white",
  };
  return colors[status];
}

export function nextReference(existing: string[], date = new Date()): string {
  const year = date.getFullYear();
  const prefix = `CB-${year}-`;
  const max = existing.reduce((highest, reference) => {
    if (!reference.startsWith(prefix)) return highest;
    const number = Number.parseInt(reference.slice(prefix.length), 10);
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 0);

  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getActiveAmenities(property: Property): string[] {
  const labels: Record<string, string> = {
    parking: "Parking / Garaje",
    elevator: "Ascensor",
    terrace: "Terraza",
    garden: "Jardín",
    pool: "Piscina",
    storage: "Trastero",
    furnished: "Amueblado",
  };

  return Object.entries(labels)
    .filter(([key]) => property[key as keyof Property] === true)
    .map(([, label]) => label);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
