export type PropertyStatus = "venta" | "alquiler" | "rehabilitar";
export type PropertyType =
  | "piso"
  | "chalet"
  | "atico"
  | "casa"
  | "local"
  | "terreno"
  | "garaje"
  | "trastero";
export type PropertyCondition = "nuevo" | "reformado" | "buen_estado" | "a_reformar";

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  address?: string;
  province: string;
  price: number;
  priceLabel?: string;
  status: PropertyStatus;
  type: PropertyType;
  condition: PropertyCondition;
  bedrooms: number;
  bathrooms: number;
  area: number;
  plotArea?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  energyRating?: string;
  orientation?: string;
  parking: boolean;
  elevator: boolean;
  terrace: boolean;
  garden: boolean;
  pool: boolean;
  storage: boolean;
  furnished: boolean;
  images: string[];
  description: string;
  features: string[];
  reference: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PropertyInput = Omit<Property, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export const PROPERTY_TYPES: Record<PropertyType, string> = {
  piso: "Piso",
  chalet: "Chalet",
  atico: "Ático",
  casa: "Casa",
  local: "Local comercial",
  terreno: "Terreno",
  garaje: "Garaje",
  trastero: "Trastero",
};

export const PROPERTY_CONDITIONS: Record<PropertyCondition, string> = {
  nuevo: "Obra nueva",
  reformado: "Reformado",
  buen_estado: "Buen estado",
  a_reformar: "A reformar",
};

export const PROPERTY_STATUSES: Record<PropertyStatus, string> = {
  venta: "En venta",
  alquiler: "En alquiler",
  rehabilitar: "Para rehabilitar",
};

export const AMENITY_OPTIONS = [
  { key: "parking" as const, label: "Parking" },
  { key: "elevator" as const, label: "Ascensor" },
  { key: "terrace" as const, label: "Terraza" },
  { key: "garden" as const, label: "Jardín" },
  { key: "pool" as const, label: "Piscina" },
  { key: "storage" as const, label: "Trastero" },
  { key: "furnished" as const, label: "Amueblado" },
];
