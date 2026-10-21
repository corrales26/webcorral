import type { MetadataRoute } from "next";
import { services } from "@/lib/data";
import { getAllProperties } from "@/lib/storage/properties";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const staticPaths = [
  "",
  "/quienes-somos",
  "/servicios",
  "/inmuebles",
  "/inversores",
  "/contacto",
  "/quiero-vender",
  "/quiero-comprar",
  "/alquilar",
  "/valoracion",
  "/aviso-legal",
  "/politica-privacidad",
  "/politica-cookies",
  ...services.map((service) => service.href),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  let properties: { slug: string; updatedAt: string }[] = [];
  try {
    properties = await getAllProperties();
  } catch {
    properties = [];
  }

  return [
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.3,
    },
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path || "/"}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...properties.map((property) => ({
      url: `${siteUrl}/inmuebles/${property.slug}`,
      lastModified: new Date(property.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
