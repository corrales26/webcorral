-- Ejecutar en Supabase → SQL Editor.

create table if not exists public.billing_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in ('income', 'expense')),
  concept text not null,
  amount_cents integer not null check (amount_cents > 0),
  entry_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  invoice_number text,
  client_name text,
  client_tax_id text,
  client_address text,
  issuer_name text,
  issuer_tax_id text,
  issuer_address text,
  tax_base_cents integer,
  vat_rate integer,
  vat_cents integer,
  irpf_rate integer,
  irpf_cents integer,
  vat_note text
);

create index if not exists billing_entries_entry_date_idx on public.billing_entries (entry_date desc);
create index if not exists billing_entries_created_at_idx on public.billing_entries (created_at desc);
create unique index if not exists billing_entries_invoice_number_idx
  on public.billing_entries (invoice_number)
  where invoice_number is not null;

alter table public.billing_entries enable row level security;
