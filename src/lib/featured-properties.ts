import type { Property } from "@/lib/types/property";
import {
  comparePropertiesForListing,
  FEATURED_BADGE_LIMIT,
  featuredBadgePropertyIds,
  HOME_HIGHLIGHT_LIMIT,
} from "@/lib/property-utils";

export async function capFeaturedProperties(
  readAll: () => Promise<Property[]>,
  writeFeatured: (id: string, featured: boolean) => Promise<void>,
  priorityId: string,
): Promise<void> {
  const properties = await readAll();
  const others = properties
    .filter((property) => property.featured && property.id !== priorityId)
    .sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );

  const allowedOthers = FEATURED_BADGE_LIMIT - 1;
  const excess = others.length - allowedOthers;

  if (excess <= 0) return;

  for (const property of others.slice(0, excess)) {
    await writeFeatured(property.id, false);
  }
}

export function sortForHomeHighlights(properties: Property[]): Property[] {
  const priorityIds = featuredBadgePropertyIds(properties);

  return [...properties].sort((a, b) =>
    comparePropertiesForListing(a, b, "recent", priorityIds),
  );
}

export function takeHomeHighlights(
  properties: Property[],
  limit = HOME_HIGHLIGHT_LIMIT,
): Property[] {
  return sortForHomeHighlights(properties).slice(0, limit);
}
