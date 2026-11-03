import { isHeicUpload } from "@/lib/media-utils";

const MAX_EDGE = 1920;

export async function compressImageFile(file: File): Promise<File> {
  if (isHeicUpload(file)) return file;
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  try {
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(bitmap, 0, 0, width, height);
    const blob =
      (await canvasBlob(canvas, "image/webp", 0.82)) ??
      (await canvasBlob(canvas, "image/jpeg", 0.82));
    if (!blob) return file;

    const base = file.name.replace(/\.[^.]+$/, "") || "foto";
    const type = blob.type || "image/jpeg";
    const extension = type === "image/webp" ? "webp" : "jpg";
    return new File([blob], `${base}.${extension}`, { type });
  } finally {
    bitmap.close();
  }
}

function canvasBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}
