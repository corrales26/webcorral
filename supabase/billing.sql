-- Ejecutar en Supabase → SQL Editor.

create table if not exists public.billing_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in ('income', 'expense')),
  concept text not null,
  amount_cents integer not null check (amount_cents > 0),
  entry_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists billing_entries_entry_date_idx on public.billing_entries (entry_date desc);
create index if not exists billing_entries_created_at_idx on public.billing_entries (created_at desc);

alter table public.billing_entries enable row level security;
