-- Ejecutar en Supabase → SQL Editor si la tabla billing_entries ya existía.
-- Añade los datos de una factura ordinaria: número, destinatario e impuestos.

alter table public.billing_entries
  add column if not exists invoice_number text,
  add column if not exists client_name text,
  add column if not exists client_tax_id text,
  add column if not exists client_address text,
  add column if not exists issuer_name text,
  add column if not exists issuer_tax_id text,
  add column if not exists issuer_address text,
  add column if not exists tax_base_cents integer,
  add column if not exists vat_rate integer,
  add column if not exists vat_cents integer,
  add column if not exists irpf_rate integer,
  add column if not exists irpf_cents integer,
  add column if not exists vat_note text;

create unique index if not exists billing_entries_invoice_number_idx
  on public.billing_entries (invoice_number)
  where invoice_number is not null;
