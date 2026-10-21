import { investorFeatures, services, siteConfig } from "@/lib/data";
import {
  conditionLabel,
  formatPrice,
  statusLabel,
  typeLabel,
} from "@/lib/property-utils";
import { getSiteUrl } from "@/lib/site-url";
import { getAllProperties, getPropertyById } from "@/lib/storage/properties";
import type { Property } from "@/lib/types/property";

export type MarkdownPage = {
  body: string;
  htmlUrl: string;
};

type StaticPage = {
  key: string;
  title: string;
  note: string;
  section: "paginas" | "servicios" | "optional";
  body: string;
};

function siteUrl(): string {
  return getSiteUrl().replace(/\/$/, "");
}

export function normalizeMarkdownKey(raw: string): string {
  let key = raw.replace(/^\/+|\/+$/g, "");
  key = key.replace(/\.md$/, "");
  key = key.replace(/\/index$/, "");
  if (key === "" || key === "index") return "index";
  return key;
}

function markdownUrl(key: string): string {
  const base = siteUrl();
  if (key === "index") return `${base}/index.md`;
  return `${base}/${key}/index.md`;
}

function pageUrl(key: string): string {
  const base = siteUrl();
  if (key === "index") return `${base}/`;
  return `${base}/${key}`;
}

function contactLines(): string[] {
  return [
    `Teléfono: ${siteConfig.phone}`,
    `WhatsApp: https://wa.me/${siteConfig.whatsapp}`,
    `Email: ${siteConfig.email}`,
    `Dirección: ${siteConfig.addresses[0]}`,
    `Horario: ${siteConfig.hours}`,
    `Titular: ${siteConfig.legalHolder}`,
  ];
}

function htmlPointer(key: string): string {
  return `Página HTML: ${pageUrl(key)}`;
}

function rehabilitacionBody(): string {
  return [
    "# Rehabilitamos tu vivienda",
    "",
    "Transformamos tu inmueble en una nueva oportunidad.",
    "",
    "Estudiamos el potencial del inmueble y te ofrecemos soluciones para sacarle el mayor partido, proyecto adaptado a las posibilidades.",
    "",
    services.find((service) => service.href === "/servicios/rehabilitacion")?.description ?? "",
    "",
    htmlPointer("servicios/rehabilitacion"),
    "",
    ...contactLines(),
    "",
  ].join("\n");
}

function staticPages(): StaticPage[] {
  const serviceList = services
    .map((service) => `- [${service.title}](${markdownUrl(service.href.slice(1))}): ${service.description}`)
    .join("\n");

  return [
    {
      key: "index",
      title: "Inicio",
      note: "Oficina en Cicero, Cantabria. Compraventa, alquiler, rehabilitación e inversión en toda España.",
      section: "paginas",
      body: [
        `# ${siteConfig.name}`,
        "",
        `> ${siteConfig.tagline}. Compraventa, alquiler, rehabilitación e inversión en toda España. Oficina en Cicero, Cantabria.`,
        "",
        `${siteConfig.name} tiene la oficina en Cicero (Cantabria) y trabaja en toda España. El titular es ${siteConfig.legalHolder}.`,
        "",
        ...contactLines(),
        "",
        "## Servicios",
        "",
        serviceList,
        "",
        htmlPointer("index"),
        "",
      ].join("\n"),
    },
    {
      key: "quienes-somos",
      title: "Quiénes somos",
      note: "Cómo trabaja Corral Business y a quién se dirige.",
      section: "paginas",
      body: [
        "# Quiénes somos",
        "",
        "SOMOS Corral Business, una forma diferente de entender el sector inmobiliario.",
        "",
        "No nos limitamos a ofrecerte opciones, Buscamos oportunidades, analizamos posibilidades y encontramos soluciones adaptadas a cada situación.",
        "",
        "Tú nos cuentas qué necesitas, Nosotros nos ponemos a trabajar para conseguirlo.",
        "",
        htmlPointer("quienes-somos"),
        "",
      ].join("\n"),
    },
    {
      key: "servicios",
      title: "Servicios",
      note: "Alquiler, compraventa, locales, rehabilitación, inversión y valoración.",
      section: "paginas",
      body: [
        "# Servicios",
        "",
        "Soluciones integrales para todas tus necesidades inmobiliarias en toda España.",
        "",
        serviceList,
        "",
        htmlPointer("servicios"),
        "",
      ].join("\n"),
    },
    {
      key: "inmuebles",
      title: "Inmuebles",
      note: "Catálogo publicado, con precio, estado y municipio.",
      section: "paginas",
      body: [
        "# Inmuebles",
        "",
        "Catálogo publicado de Corral Business. El precio, el estado y la disponibilidad de cada ficha son los de la web.",
        "",
        "Estados posibles: En venta, En alquiler, Para rehabilitar, Vendida, Alquilada, Reservada y Próximamente.",
        "",
        htmlPointer("inmuebles"),
        "",
        ...contactLines(),
        "",
      ].join("\n"),
    },
    {
      key: "inversores",
      title: "Inversores",
      note: "Búsqueda de oportunidades, rehabilitación y comercialización.",
      section: "paginas",
      body: [
        "# Inversores",
        "",
        "Encontramos Oportunidades. Creamos Valor.",
        "",
        "Seleccionamos propiedades con potencial y gestionamos todo el proceso, desde la adquisición y rehabilitación hasta su venta o alquiler.",
        "",
        "Tú decides dónde invertir. Nosotros buscamos y creamos la oportunidad.",
        "",
        investorFeatures.map((feature) => `- ${feature.label}`).join("\n"),
        "",
        "## Emprendimiento",
        "",
        "Buscamos el Local adecuado para que puedas poner en marcha tu negocio.",
        "",
        "- Análisis de mercado y selección de oportunidades",
        "- Gestión integral de la rehabilitación",
        "- Comercialización y seguimiento post-inversión",
        "",
        htmlPointer("inversores"),
        "",
        ...contactLines(),
        "",
      ].join("\n"),
    },
    {
      key: "contacto",
      title: "Contacto",
      note: "Teléfono, WhatsApp, email y dirección en Cicero.",
      section: "paginas",
      body: [
        "# Háblanos",
        "",
        "Tu proyecto inmobiliario empieza con una buena conversación.",
        "",
        "Cuéntanos qué necesitas y trabajamos para ti.",
        "",
        ...contactLines(),
        "",
        `Formulario: ${pageUrl("contacto")}`,
        "",
        htmlPointer("contacto"),
        "",
      ].join("\n"),
    },
    {
      key: "quiero-vender",
      title: "Quiero vender",
      note: "Acompañamiento en la venta del inmueble.",
      section: "paginas",
      body: [
        "# Convertimos tu vivienda en una oportunidad",
        "",
        "Te acompañamos en todo el proceso de venta, con una estrategia y adaptada a tu inmueble sin complicaciones ni ataduras.",
        "",
        htmlPointer("quiero-vender"),
        "",
        ...contactLines(),
        "",
      ].join("\n"),
    },
    {
      key: "quiero-comprar",
      title: "Quiero comprar",
      note: "Búsqueda y negociación de la compra.",
      section: "paginas",
      body: [
        "# Buscamos, negociamos. Tú decides.",
        "",
        "Localizamos oportunidades inmobiliarias y defendemos tus intereses para que compres con confianza.",
        "",
        htmlPointer("quiero-comprar"),
        "",
        ...contactLines(),
        "",
      ].join("\n"),
    },
    {
      key: "alquilar",
      title: "Alquilar",
      note: "Búsqueda de alquiler y gestión del proceso.",
      section: "paginas",
      body: [
        "# Alquilar",
        "",
        "Encontramos el Alquiler que necesitas. Nos ocupamos de todo el proceso.",
        "",
        htmlPointer("alquilar"),
        "",
        ...contactLines(),
        "",
      ].join("\n"),
    },
    {
      key: "valoracion",
      title: "Valoración gratuita",
      note: "Valoración del inmueble sin compromiso.",
      section: "paginas",
      body: [
        "# Valoración gratuita",
        "",
        "Conoce el valor real de tu inmueble sin compromiso. Nuestros expertos te asesorarán con total transparencia.",
        "",
        htmlPointer("valoracion"),
        "",
        ...contactLines(),
        "",
      ].join("\n"),
    },
    ...services.map((service) => ({
      key: service.href.slice(1),
      title: service.title,
      note: service.description,
      section: "servicios" as const,
      body:
        service.href === "/servicios/rehabilitacion"
          ? rehabilitacionBody()
          : [
              `# ${service.title}`,
              "",
              service.description,
              "",
              htmlPointer(service.href.slice(1)),
              "",
              ...contactLines(),
              "",
            ].join("\n"),
    })),
    {
      key: "aviso-legal",
      title: "Aviso legal",
      note: "Titular, dirección y correo del sitio.",
      section: "optional",
      body: legalBody("Aviso legal", "aviso-legal"),
    },
    {
      key: "politica-privacidad",
      title: "Política de privacidad",
      note: "Responsable del tratamiento y datos de contacto.",
      section: "optional",
      body: legalBody("Política de privacidad", "politica-privacidad"),
    },
    {
      key: "politica-cookies",
      title: "Política de cookies",
      note: "Información sobre las cookies del sitio.",
      section: "optional",
      body: legalBody("Política de cookies", "politica-cookies"),
    },
  ];
}

function legalBody(title: string, key: string): string {
  return [
    `# ${title}`,
    "",
    "El texto completo y vigente está en la página HTML. Estos son los datos identificativos del sitio:",
    "",
    ...contactLines(),
    "",
    htmlPointer(key),
    "",
  ].join("\n");
}

function plain(value: string): string {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

function propertyNote(property: Property): string {
  return `${statusLabel(property.status)} · ${typeLabel(property.type)} · ${property.location} · ${plain(formatPrice(property))} · Ref. ${property.reference}`;
}

function propertyBody(property: Property): string {
  const amenities = [
    property.parking ? "Parking" : null,
    property.elevator ? "Ascensor" : null,
    property.terrace ? "Terraza" : null,
    property.garden ? "Jardín" : null,
    property.pool ? "Piscina" : null,
    property.storage ? "Trastero" : null,
    property.furnished ? "Amueblado" : null,
  ].filter((item): item is string => Boolean(item));

  const extras = property.features.filter((feature) => feature.trim().length > 0);
  const facts = [
    `- Referencia: ${property.reference}`,
    `- Precio: ${plain(formatPrice(property))}`,
    `- Estado: ${statusLabel(property.status)}`,
    `- Tipo: ${typeLabel(property.type)}`,
    `- Conservación: ${conditionLabel(property.condition)}`,
    `- Habitaciones: ${property.bedrooms}`,
    `- Baños: ${property.bathrooms}`,
    `- Superficie: ${property.area} m²`,
    property.plotArea ? `- Parcela: ${property.plotArea} m²` : null,
    property.floor != null ? `- Planta: ${property.floor}` : null,
    property.yearBuilt ? `- Año: ${property.yearBuilt}` : null,
    property.energyRating ? `- Certificación energética: ${property.energyRating}` : null,
    property.address ? `- Dirección: ${property.address}` : null,
    `- Municipio: ${property.location}`,
    `- Provincia: ${property.province}`,
  ].filter((line): line is string => Boolean(line));

  return [
    `# ${property.title}`,
    "",
    `> ${propertyNote(property)}`,
    "",
    ...facts,
    "",
    "## Descripción",
    "",
    property.description.trim(),
    "",
    amenities.length || extras.length ? "## Características" : "",
    amenities.length ? amenities.map((item) => `- ${item}`).join("\n") : "",
    extras.length ? extras.map((item) => `- ${item}`).join("\n") : "",
    "",
    htmlPointer(`inmuebles/${property.slug}`),
    "",
    ...contactLines(),
    "",
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n");
}

function listItem(title: string, url: string, note: string): string {
  const cleanNote = note.replace(/\s+/g, " ").trim();
  return `- [${title}](${url}): ${cleanNote}`;
}

export async function renderLlmsTxt(): Promise<string> {
  const pages = staticPages();
  const sections: Record<StaticPage["section"], string[]> = {
    paginas: [],
    servicios: [],
    optional: [],
  };

  for (const page of pages) {
    sections[page.section].push(listItem(page.title, markdownUrl(page.key), page.note));
  }

  let propertyItems = ["- El catálogo publicado se consulta en la página de inmuebles."];
  try {
    const properties = await getAllProperties();
    const published = [...properties].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (published.length > 0) {
      propertyItems = published.map((property) =>
        listItem(property.title, markdownUrl(`inmuebles/${property.slug}`), propertyNote(property)),
      );
    }
  } catch {
    propertyItems = ["- El catálogo no está disponible en este momento. Consúltalo en la web."];
  }

  sections.optional.push(
    listItem("Sitemap", `${siteUrl()}/sitemap.xml`, "Listado de páginas públicas para buscadores."),
  );

  return [
    `# ${siteConfig.name}`,
    "",
    `> Oficina en Cicero, Cantabria. Compraventa, alquiler, rehabilitación e inversión en toda España. ${siteConfig.tagline}.`,
    "",
    `Titular: ${siteConfig.legalHolder}. Teléfono y WhatsApp: ${siteConfig.phone}. Email: ${siteConfig.email}. Dirección: ${siteConfig.addresses[0]}. Horario: ${siteConfig.hours}.`,
    "",
    "Los enlaces llevan a una versión Markdown de cada página. La página HTML es la versión para las personas. Precio, estado y disponibilidad de cada inmueble son los publicados en la web y pueden cambiar.",
    "",
    "Las zonas privadas (administración, API y panel de colaboradores) no forman parte de este contenido.",
    "",
    "## Páginas",
    "",
    ...sections.paginas,
    "",
    "## Servicios",
    "",
    ...sections.servicios,
    "",
    "## Inmuebles",
    "",
    ...propertyItems,
    "",
    "## Optional",
    "",
    ...sections.optional,
    "",
  ].join("\n");
}

const BLOCKED_PREFIXES = ["admin", "api", "_next", "colaborar"];

export async function renderMarkdownPage(rawKey: string): Promise<MarkdownPage | null> {
  const key = normalizeMarkdownKey(rawKey);
  if (BLOCKED_PREFIXES.some((prefix) => key === prefix || key.startsWith(`${prefix}/`))) {
    return null;
  }

  const page = staticPages().find((item) => item.key === key);
  if (page) {
    return { body: page.body, htmlUrl: pageUrl(key) };
  }

  if (key.startsWith("inmuebles/")) {
    const slug = key.slice("inmuebles/".length);
    if (!slug || slug.includes("/")) return null;
    const property = await getPropertyById(slug);
    if (!property || !property.published) return null;
    return { body: propertyBody(property), htmlUrl: pageUrl(key) };
  }

  return null;
}
