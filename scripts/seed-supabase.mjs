import { createCipheriv, randomBytes } from "crypto";
import { readFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const encryptionKey = process.env.DATA_ENCRYPTION_KEY;

if (!url || !key || !encryptionKey) {
  console.error(
    "Define NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y DATA_ENCRYPTION_KEY"
  );
  process.exit(1);
}

const secret = Buffer.from(encryptionKey, "base64");
if (secret.length !== 32) {
  console.error("DATA_ENCRYPTION_KEY debe ser 32 bytes en base64");
  process.exit(1);
}

function encryptString(plain) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secret, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

function encryptJson(value) {
  return encryptString(JSON.stringify(value));
}

const raw = await readFile(new URL("../data/properties.json", import.meta.url), "utf8");
const properties = JSON.parse(raw);

const rows = properties.map((property) => ({
  id: crypto.randomUUID(),
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
  energy_rating: property.energyRating ? encryptString(property.energyRating) : null,
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
}));

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.from("properties").upsert(rows, { onConflict: "slug" });
if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Importados ${rows.length} inmuebles.`);
