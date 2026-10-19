-- Corral Business — esquema CMS
-- Ejecutar en Supabase → SQL Editor (una sola vez).
-- Los campos address, description, features e images se guardan cifrados (AES-256-GCM) en la app.

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null,
  address text,
  province text not null,
  price integer not null,
  price_label text,
  status text not null check (status in ('venta', 'alquiler', 'rehabilitar', 'vendida', 'alquilada', 'reservada', 'proximamente')),
  type text not null check (type in ('piso', 'chalet', 'atico', 'casa', 'local', 'terreno', 'garaje', 'trastero')),
  condition text not null check (condition in ('nuevo', 'reformado', 'buen_estado', 'a_reformar')),
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  area integer not null default 0,
  plot_area integer,
  floor integer,
  total_floors integer,
  year_built integer,
  energy_rating text,
  orientation text,
  parking boolean not null default false,
  elevator boolean not null default false,
  terrace boolean not null default false,
  garden boolean not null default false,
  pool boolean not null default false,
  storage boolean not null default false,
  furnished boolean not null default false,
  images text not null default '',
  description text not null default '',
  features text not null default '',
  reference text not null,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_published_idx on public.properties (published);
create index if not exists properties_updated_at_idx on public.properties (updated_at desc);

alter table public.properties enable row level security;

-- Sin políticas para anon/authenticated: solo la service role (servidor) accede.
-- Así la clave pública del navegador no puede leer ni escribir inmuebles.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Contratos: título, cliente, notas y nombre de archivo se cifran en la app.
-- El PDF se guarda cifrado en el bucket privado contracts.

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  contract_type text not null check (contract_type in ('arras', 'compraventa', 'alquiler', 'encargo', 'otro')),
  client_name text not null,
  property_reference text,
  notes text,
  signed_at date,
  file_path text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

create index if not exists contracts_created_at_idx on public.contracts (created_at desc);

alter table public.contracts enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'contracts',
  'contracts',
  false,
  10485760,
  array['application/octet-stream']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Facturación (ingresos y gastos): supabase/billing.sql
-- Admin, invitaciones y envíos de colaboradores: supabase/access.sql
