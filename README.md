# Corral Business

Web de inmobiliaria en Cantabria — Next.js 16, Tailwind CSS 4, CMS propio.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `ADMIN_SECRET` | Firma la cookie de sesión del admin. La contraseña del admin se guarda solo en Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role (solo servidor, nunca en el cliente) |
| `DATA_ENCRYPTION_KEY` | Clave AES-256 en base64 para cifrar datos sensibles |

Valores por defecto en desarrollo: ver `.env.example`.

Sin variables de Supabase, el CMS sigue usando `data/properties.json` en local.

### Panel CMS

- URL: `/admin/login`
- Gestión de inmuebles, subida de imágenes y publicación

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (detección automática).
3. Añade las variables de entorno en **Settings → Environment Variables**:
   - `ADMIN_SECRET` — cadena aleatoria larga (mín. 32 caracteres)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATA_ENCRYPTION_KEY`
4. En Supabase, ejecuta `supabase/schema.sql` y `supabase/access.sql` en el SQL Editor. El admin y las invitaciones se crean ahí, no desde la web.
5. Despliega.

El CMS en producción lee y escribe en Supabase. Dirección, descripción, extras e imágenes se cifran con AES-256-GCM antes de guardarse. Las  fotos van al bucket privado `property-images`.

## Estructura

```
src/app/          → Rutas públicas y admin
src/components/   → UI (hero, inmuebles, CMS)
data/             → Inmuebles locales (respaldo sin Supabase)
supabase/         → Esquema SQL de Postgres y Storage
public/uploads/   → Imágenes locales si no hay Supabase
```

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Servidor producción
npm run lint     # ESLint
```
