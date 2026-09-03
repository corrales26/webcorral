import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Property, PropertyInput } from "@/lib/types/property";
import { slugify } from "@/lib/property-utils";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "properties.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<Property[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Property[];
}

async function writeAll(properties: Property[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(properties, null, 2), "utf-8");
}

export async function getAllProperties(includeUnpublished = false): Promise<Property[]> {
  const properties = await readAll();
  const filtered = includeUnpublished
    ? properties
    : properties.filter((p) => p.published);
  return filtered.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const properties = await getAllProperties();
  return properties.filter((p) => p.featured).slice(0, 4);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = await readAll();
  return properties.find((p) => p.id === id || p.slug === id) ?? null;
}

export async function getSimilarProperties(
  property: Property,
  limit = 3
): Promise<Property[]> {
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
  const properties = await readAll();
  const now = new Date().toISOString();
  const slug = input.slug || slugify(`${input.title}-${input.location}`);

  const existingSlug = properties.some((p) => p.slug === slug);
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  const property: Property = {
    ...input,
    id: randomUUID(),
    slug: finalSlug,
    createdAt: now,
    updatedAt: now,
  };

  properties.push(property);
  await writeAll(properties);
  return property;
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>
): Promise<Property | null> {
  const properties = await readAll();
  const index = properties.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const updated: Property = {
    ...properties[index],
    ...input,
    id: properties[index].id,
    createdAt: properties[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  properties[index] = updated;
  await writeAll(properties);
  return updated;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const properties = await readAll();
  const filtered = properties.filter((p) => p.id !== id);

  if (filtered.length === properties.length) return false;

  await writeAll(filtered);
  return true;
}

export async function getPropertyStats() {
  const properties = await readAll();
  return {
    total: properties.length,
    published: properties.filter((p) => p.published).length,
    draft: properties.filter((p) => !p.published).length,
    featured: properties.filter((p) => p.featured).length,
    venta: properties.filter((p) => p.status === "venta").length,
    alquiler: properties.filter((p) => p.status === "alquiler").length,
    rehabilitar: properties.filter((p) => p.status === "rehabilitar").length,
  };
}
