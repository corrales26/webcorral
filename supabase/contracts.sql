-- Ejecutar en Supabase → SQL Editor si la tabla properties ya existe.

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
