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
| `ADMIN_PASSWORD` | Contraseña del panel CMS (`/admin/login`) |
| `ADMIN_SECRET` | Secreto para firmar la sesión del CMS |

Valores por defecto en desarrollo: ver `.env.example`.

### Panel CMS

- URL: `/admin/login`
- Gestión de inmuebles, subida de imágenes y publicación

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (detección automática).
3. Añade las variables de entorno en **Settings → Environment Variables**:
   - `ADMIN_PASSWORD` — contraseña segura para producción
   - `ADMIN_SECRET` — cadena aleatoria larga (mín. 32 caracteres)
4. Despliega.

> **Nota sobre el CMS en Vercel:** el almacenamiento actual usa `data/properties.json` y `public/uploads/`. En Vercel el filesystem es efímero, por lo que los cambios del CMS **no persisten** entre despliegues. Para producción con CMS activo conviene migrar a Vercel Blob, Supabase o similar. La web pública y los inmuebles del JSON incluido en el repo sí funcionan correctamente.

## Estructura

```
src/app/          → Rutas públicas y admin
src/components/   → UI (hero, inmuebles, CMS)
data/             → Inmuebles (JSON)
public/uploads/   → Imágenes subidas por el CMS
```

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Servidor producción
npm run lint     # ESLint
```
