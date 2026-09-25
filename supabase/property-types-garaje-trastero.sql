-- Ejecutar en Supabase → SQL Editor si la tabla properties ya existía.
-- Permite los tipos garaje y trastero en el CMS.

alter table public.properties drop constraint if exists properties_type_check;

alter table public.properties
  add constraint properties_type_check
  check (type in (
    'piso',
    'chalet',
    'atico',
    'casa',
    'local',
    'terreno',
    'garaje',
    'trastero'
  ));
