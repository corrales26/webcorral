import { siteConfig } from "@/lib/data";
import { isVideoMediaUrl } from "@/lib/media-utils";
import { getCoverImage, statusLabel } from "@/lib/property-utils";
import { getSiteUrl } from "@/lib/site-url";
import type { Property, PropertyStatus, PropertyType } from "@/lib/types/property";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function metaDescription(text: string, fallback = ""): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const source = clean || fallback;
  if (source.length <= 160) return source;
  const cut = source.slice(0, 157);
  const space = cut.lastIndexOf(" ");
  return `${(space > 80 ? cut.slice(0, space) : cut).trim()}…`;
}

function padTime(value: string): string {
  const [hours, minutes] = value.split(":");
  return `${hours.padStart(2, "0")}:${minutes}`;
}

function officeHours() {
  const match = siteConfig.hours.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: WEEKDAYS,
    opens: match ? padTime(match[1]) : "09:00",
    closes: match ? padTime(match[2]) : "19:00",
  };
}

export function businessJsonLd() {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: siteUrl,
    email: siteConfig.email,
    telephone: `+${siteConfig.whatsapp}`,
    image: absoluteUrl("/og"),
    logo: absoluteUrl("/logocorral.svg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "C/ Carnerizas S/N",
      postalCode: "39790",
      addressLocality: "Cicero",
      addressRegion: "Cantabria",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.41137,
      longitude: -3.477484,
    },
    openingHoursSpecification: officeHours(),
    areaServed: {
      "@type": "Country",
      name: "España",
    },
  };
}

export function catalogJsonLd(properties: Property[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Inmuebles publicados de Corral Business",
    numberOfItems: properties.length,
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: property.title,
      url: absoluteUrl(`/inmuebles/${property.slug}`),
    })),
  };
}

function accommodationType(type: PropertyType): string {
  if (type === "piso" || type === "atico") return "Apartment";
  if (type === "chalet" || type === "casa") return "House";
  if (type === "local") return "Store";
  return "Place";
}

function availability(status: PropertyStatus): string {
  if (status === "vendida" || status === "alquilada") return "https://schema.org/SoldOut";
  if (status === "reservada") return "https://schema.org/Reserved";
  if (status === "proximamente") return "https://schema.org/PreOrder";
  return "https://schema.org/InStock";
}

function isRent(property: Property): boolean {
  if (property.status === "alquiler" || property.status === "alquilada") return true;
  return /mes|month/i.test(property.priceLabel ?? "");
}

function businessFunction(property: Property): string {
  return isRent(property)
    ? "http://purl.org/goodrelations/v1#LeaseOut"
    : "http://purl.org/goodrelations/v1#Sell";
}

export function propertyShareImage(property: Property): string | undefined {
  const cover = getCoverImage(property);
  if (!cover || cover.includes("placeholder") || isVideoMediaUrl(cover)) return undefined;
  return absoluteUrl(cover);
}

export function propertyJsonLd(property: Property) {
  const kind = accommodationType(property.type);
  const image = propertyShareImage(property);
  const rent = isRent(property);
  const about: Record<string, unknown> = {
    "@type": kind,
    name: property.title,
    address: listingAddress(property),
  };

  if (property.area > 0) {
    about.floorSize = {
      "@type": "QuantitativeValue",
      value: property.area,
      unitCode: "MTK",
    };
  }
  if ((kind === "Apartment" || kind === "House") && property.bedrooms > 0) {
    about.numberOfBedrooms = property.bedrooms;
  }
  if ((kind === "Apartment" || kind === "House") && property.bathrooms > 0) {
    about.numberOfBathroomsTotal = property.bathrooms;
  }

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    availability: availability(property.status),
    businessFunction: businessFunction(property),
    url: absoluteUrl(`/inmuebles/${property.slug}`),
  };
  if (property.price > 0) {
    offer.price = property.price;
    offer.priceCurrency = "EUR";
    if (rent) {
      offer.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: property.price,
        priceCurrency: "EUR",
        unitCode: "MON",
      };
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: metaDescription(
      property.description,
      `${property.title} en ${property.location}. ${statusLabel(property.status)}.`,
    ),
    url: absoluteUrl(`/inmuebles/${property.slug}`),
    datePosted: property.createdAt,
    dateModified: property.updatedAt,
    ...(image ? { image } : {}),
    identifier: {
      "@type": "PropertyValue",
      name: "Referencia",
      value: property.reference,
    },
    address: listingAddress(property),
    offers: offer,
    about,
  };
}

function listingAddress(property: Property) {
  return {
    "@type": "PostalAddress",
    ...(property.address ? { streetAddress: property.address } : {}),
    addressLocality: property.location,
    addressRegion: property.province,
    addressCountry: "ES",
  };
}
