export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const UPLOAD_MEDIA_MIME_TYPES = [
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
] as const;

export type UploadMediaMimeType = (typeof UPLOAD_MEDIA_MIME_TYPES)[number];

export const UPLOAD_MEDIA_ACCEPT = UPLOAD_MEDIA_MIME_TYPES.join(",");

export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024;

export function isVideoMimeType(type: string): boolean {
  return (VIDEO_MIME_TYPES as readonly string[]).includes(type) || type.startsWith("video/");
}

export function isVideoMediaUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

export function isVideoContentType(contentType: string): boolean {
  return contentType.startsWith("video/");
}

export function getMaxUploadBytes(type: string): number {
  return isVideoMimeType(type) ? MAX_VIDEO_UPLOAD_BYTES : MAX_IMAGE_UPLOAD_BYTES;
}

export function validateUploadMediaFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!(UPLOAD_MEDIA_MIME_TYPES as readonly string[]).includes(file.type)) {
    return "Formato no permitido. Usa JPG, PNG, WebP, MP4, WebM o MOV.";
  }

  const maxBytes = getMaxUploadBytes(file.type);
  if (file.size > maxBytes) {
    return isVideoMimeType(file.type)
      ? "El vídeo supera el límite de 50 MB"
      : "La imagen supera el límite de 5 MB";
  }

  return null;
}
