-- Ejecutar en Supabase → SQL Editor si la tabla properties ya existía.
-- Añade Alquilada, Reservada y Próximamente.

alter table public.properties drop constraint if exists properties_status_check;

alter table public.properties
  add constraint properties_status_check
  check (status in (
    'venta',
    'alquiler',
    'rehabilitar',
    'vendida',
    'alquilada',
    'reservada',
    'proximamente'
  ));
