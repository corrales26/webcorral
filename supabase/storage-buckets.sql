-- Ejecutar en Supabase → SQL Editor (una sola vez).
-- Alinea los buckets con la app: fotos/vídeos de inmuebles y archivos de colaboradores.

update storage.buckets
set
  file_size_limit = 52428800,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
where id = 'property-images';

update storage.buckets
set file_size_limit = 52428800
where id = 'collaborator-files';
