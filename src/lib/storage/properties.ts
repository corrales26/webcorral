import { randomUUID } from "crypto";
import type { Property, PropertyInput } from "@/lib/types/property";
import {
  capFeaturedProperties,
  takeHomeHighlights,
} from "@/lib/featured-properties";
import { nextReference, slugify } from "@/lib/property-utils";
import {
  decryptJson,
  decryptString,
  encryptJson,
  encryptString,
  isEncrypted,
} from "@/lib/crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import * as localStore from "@/lib/storage/properties-local";

interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  location: string;
  address: string | null;
  province: string;
  price: number;
  price_label: string | null;
  status: Property["status"];
  type: Property["type"];
  condition: Property["condition"];
  bedrooms: number;
  bathrooms: number;
  area: number;
  plot_area: number | null;
  floor: number | null;
  total_floors: number | null;
  year_built: number | null;
  energy_rating: string | null;
  orientation: string | null;
  parking: boolean;
  elevator: boolean;
  terrace: boolean;
  garden: boolean;
  pool: boolean;
  storage: boolean;
  furnished: boolean;
  images: string;
  description: string;
  features: string;
  reference: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

function optionalText(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const plain = isEncrypted(value) ? decryptString(value) : value;
  return plain || undefined;
}

function rowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    address: optionalText(row.address),
    province: row.province,
    price: row.price,
    priceLabel: row.price_label ?? undefined,
    status: row.status,
    type: row.type,
    condition: row.condition,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    plotArea: row.plot_area ?? undefined,
    floor: row.floor ?? undefined,
    totalFloors: row.total_floors ?? undefined,
    yearBuilt: row.year_built ?? undefined,
    energyRating: optionalText(row.energy_rating),
    orientation: optionalText(row.orientation),
    parking: row.parking,
    elevator: row.elevator,
    terrace: row.terrace,
    garden: row.garden,
    pool: row.pool,
    storage: row.storage,
    furnished: row.furnished,
    images: decryptJson<string[]>(row.images, []),
    description: row.description
      ? isEncrypted(row.description)
        ? decryptString(row.description)
        : row.description
      : "",
    features: decryptJson<string[]>(row.features, []),
    reference: row.reference,
    featured: row.featured,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function propertyToRow(property: Property) {
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    location: property.location,
    address: property.address ? encryptString(property.address) : null,
    province: property.province,
    price: property.price,
    price_label: property.priceLabel ?? null,
    status: property.status,
    type: property.type,
    condition: property.condition,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    plot_area: property.plotArea ?? null,
    floor: property.floor ?? null,
    total_floors: property.totalFloors ?? null,
    year_built: property.yearBuilt ?? null,
    energy_rating: property.energyRating
      ? encryptString(property.energyRating)
      : null,
    orientation: property.orientation ? encryptString(property.orientation) : null,
    parking: property.parking,
    elevator: property.elevator,
    terrace: property.terrace,
    garden: property.garden,
    pool: property.pool,
    storage: property.storage,
    furnished: property.furnished,
    images: encryptJson(property.images),
    description: encryptString(property.description),
    features: encryptJson(property.features),
    reference: property.reference,
    featured: property.featured,
    published: property.published,
    created_at: property.createdAt,
    updated_at: property.updatedAt,
  };
}

async function readAll(): Promise<Property[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as PropertyRow[]).map(rowToProperty);
}

export async function getAllProperties(
  includeUnpublished = false
): Promise<Property[]> {
  if (!isSupabaseConfigured()) return localStore.getAllProperties(includeUnpublished);

  const properties = await readAll();
  return includeUnpublished ? properties : properties.filter((p) => p.published);
}

export async function getHomeHighlightProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) return localStore.getHomeHighlightProperties();

  const properties = await getAllProperties();
  return takeHomeHighlights(properties);
}

async function writeFeaturedFlag(id: string, featured: boolean): Promise<void> {
  const current = await getPropertyById(id);
  if (!current) return;

  const updated: Property = {
    ...current,
    featured,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("properties")
    .update(propertyToRow(updated))
    .eq("id", current.id);

  if (error) throw new Error(error.message);
}

async function enforceFeaturedLimit(priorityId: string): Promise<void> {
  await capFeaturedProperties(readAll, writeFeaturedFlag, priorityId);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) return localStore.getPropertyById(id);

  const supabase = getSupabaseAdmin();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    );

  const query = supabase.from("properties").select("*");
  const { data, error } = isUuid
    ? await query.eq("id", id).maybeSingle()
    : await query.eq("slug", id).maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToProperty(data as PropertyRow);
}

export async function getSimilarProperties(
  property: Property,
  limit = 3
): Promise<Property[]> {
  if (!isSupabaseConfigured()) return localStore.getSimilarProperties(property, limit);

  const properties = await getAllProperties();
  return properties
    .filter((p) => p.id !== property.id && p.published)
    .filter(
      (p) =>
        p.status === property.status ||
        p.province === property.province ||
        p.type === property.type
    )
    .slice(0, limit);
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  if (!isSupabaseConfigured()) return localStore.createProperty(input);

  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const slug = input.slug || slugify(`${input.title}-${input.location}`);

  const { data: existing } = await supabase
    .from("properties")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  const property: Property = {
    ...input,
    id: randomUUID(),
    slug: finalSlug,
    reference: input.reference.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const { error } = await supabase.from("properties").insert(propertyToRow(property));
  if (error) throw new Error(error.message);

  if (property.featured) {
    await enforceFeaturedLimit(property.id);
    return (await getPropertyById(property.id)) ?? property;
  }

  return property;
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>
): Promise<Property | null> {
  if (!isSupabaseConfigured()) return localStore.updateProperty(id, input);

  const current = await getPropertyById(id);
  if (!current) return null;

  const updated: Property = {
    ...current,
    ...input,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("properties")
    .update(propertyToRow(updated))
    .eq("id", current.id);

  if (error) throw new Error(error.message);

  if (updated.featured) {
    await enforceFeaturedLimit(updated.id);
    return (await getPropertyById(updated.id)) ?? updated;
  }

  return updated;
}

export async function deleteProperty(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return localStore.deleteProperty(id);

  const current = await getPropertyById(id);
  if (!current) return false;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("properties").delete().eq("id", current.id);
  if (error) throw new Error(error.message);
  return true;
}

export async function getNextReference(): Promise<string> {
  const properties = await getAllProperties(true);
  return nextReference(properties.map((item) => item.reference));
}

export async function getPropertyStats() {
  if (!isSupabaseConfigured()) return localStore.getPropertyStats();

  const properties = await readAll();
  return {
    total: properties.length,
    published: properties.filter((p) => p.published).length,
    draft: properties.filter((p) => !p.published).length,
    featured: properties.filter((p) => p.featured).length,
    venta: properties.filter((p) => p.status === "venta").length,
    alquiler: properties.filter((p) => p.status === "alquiler").length,
    rehabilitar: properties.filter((p) => p.status === "rehabilitar").length,
    vendida: properties.filter((p) => p.status === "vendida").length,
    alquilada: properties.filter((p) => p.status === "alquilada").length,
    reservada: properties.filter((p) => p.status === "reservada").length,
    proximamente: properties.filter((p) => p.status === "proximamente").length,
  };
}
