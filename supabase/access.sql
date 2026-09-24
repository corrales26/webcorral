-- Accesos de Corral Business.
-- Ejecutar en Supabase → SQL Editor.
-- El admin solo se crea aquí. La aplicación no puede crear admins, cambiar roles ni borrar usuarios.
-- Solo puede invitar colaboradores (rol fijo).

create extension if not exists pgcrypto;

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('admin', 'collaborator')),
  name text not null,
  email text,
  password_hash text,
  token_hash text unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint access_grants_admin_password check (
    role <> 'admin' or password_hash is not null
  )
);

alter table public.access_grants add column if not exists email text;
alter table public.access_grants drop constraint if exists access_grants_collaborator_token;

create unique index if not exists access_grants_email_unique
  on public.access_grants (lower(email));

create unique index if not exists access_grants_one_admin
  on public.access_grants (role)
  where role = 'admin';

alter table public.access_grants enable row level security;

revoke all on table public.access_grants from public, anon, authenticated, service_role;
grant select, insert on table public.access_grants to service_role;

create or replace function public.protect_access_grants()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.email is null or length(trim(new.email)) = 0 then
      raise exception 'el correo es obligatorio';
    end if;
    new.email := lower(trim(new.email));

    if auth.role() is not null then
      if new.role is distinct from 'collaborator' or new.password_hash is not null then
        raise exception 'desde la aplicacion solo se pueden invitar colaboradores';
      end if;
    elsif new.role = 'admin' then
      if exists (select 1 from public.access_grants where role = 'admin') then
        raise exception 'solo puede existir un admin';
      end if;
      if new.password_hash is null then
        raise exception 'el admin necesita contraseña';
      end if;
    end if;

    return new;
  end if;

  if tg_op = 'UPDATE' then
    if auth.role() is not null then
      raise exception 'no se pueden modificar usuarios desde la aplicacion';
    end if;
    if new.role is distinct from old.role then
      raise exception 'no se puede cambiar el rol';
    end if;
    if new.email is not null then
      new.email := lower(trim(new.email));
    end if;
    return new;
  end if;

  if auth.role() is not null then
    raise exception 'no se pueden borrar usuarios desde la aplicacion';
  end if;

  return old;
end;
$$;

drop trigger if exists protect_access_grants on public.access_grants;

create trigger protect_access_grants
  before insert or update or delete on public.access_grants
  for each row
  execute function public.protect_access_grants();

-- Envíos de colaboradores. El servidor puede crearlos; no puede crear accesos.

create table if not exists public.collaborator_submissions (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid not null references public.access_grants (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists collaborator_submissions_grant_idx
  on public.collaborator_submissions (grant_id, created_at desc);

create table if not exists public.submission_images (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.collaborator_submissions (id) on delete cascade,
  storage_path text not null,
  content_type text not null,
  created_at timestamptz not null default now()
);

alter table public.collaborator_submissions enable row level security;
alter table public.submission_images enable row level security;

revoke all on table public.collaborator_submissions from public, anon, authenticated, service_role;
revoke all on table public.submission_images from public, anon, authenticated, service_role;
grant select, insert on table public.collaborator_submissions to service_role;
grant select, insert on table public.submission_images to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'collaborator-files',
  'collaborator-files',
  false,
  52428800,
  array['application/octet-stream']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Admin único. Cambia el correo y la contraseña antes de ejecutarlo.
-- insert into public.access_grants (role, name, email, password_hash)
-- values (
--   'admin',
--   'Administrador',
--   'tu-correo@corralbusiness.es',
--   crypt('TU_CONTRASEÑA', gen_salt('bf', 12))
-- );
