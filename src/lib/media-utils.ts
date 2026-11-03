export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
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

export const UPLOAD_MEDIA_ACCEPT = [
  ...UPLOAD_MEDIA_MIME_TYPES,
  ".heic",
  ".heif",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".mp4",
  ".webm",
  ".mov",
].join(",");

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

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export function isHeicUpload(file: { type: string; name: string }): boolean {
  const type = file.type.toLowerCase();
  if (type.includes("heic") || type.includes("heif")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return extension === "heic" || extension === "heif";
}

export function resolveUploadMimeType(file: { type: string; name: string }): string {
  if (isHeicUpload(file)) return "image/heic";
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXTENSION[extension] ?? "";
}

export function fileExceedsUploadLimit(file: {
  type: string;
  name: string;
  size: number;
}): string | null {
  const type = resolveUploadMimeType(file);
  if (file.size <= getMaxUploadBytes(type)) return null;
  return isVideoMimeType(type)
    ? `«${file.name}» supera el límite de 50 MB.`
    : `«${file.name}» supera el límite de 5 MB.`;
}

export function validateUploadMediaFile(file: {
  type: string;
  size: number;
}): string | null {
  if (!(UPLOAD_MEDIA_MIME_TYPES as readonly string[]).includes(file.type)) {
    return "Formato no permitido. Usa JPG, PNG, WebP, HEIC, MP4, WebM o MOV.";
  }

  if (file.size > getMaxUploadBytes(file.type)) {
    return isVideoMimeType(file.type)
      ? "El vídeo supera el límite de 50 MB."
      : "La imagen supera el límite de 5 MB.";
  }

  return null;
}
