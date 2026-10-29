import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAuthenticated } from "@/lib/auth";
import {
  isVideoMimeType,
  resolveUploadMimeType,
  validateUploadMediaFile,
} from "@/lib/media-utils";
import { optimizePropertyImage } from "@/lib/optimize-property-image";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  PROPERTY_IMAGES_BUCKET,
} from "@/lib/supabase/admin";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "properties");

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    const mimeType = resolveUploadMimeType(file);
    const validationError = validateUploadMediaFile({
      type: mimeType,
      size: file.size,
    });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const source = Buffer.from(await file.arrayBuffer());
    const video = isVideoMimeType(mimeType);
    let buffer = source;
    let contentType = mimeType;
    let ext =
      file.name.split(".").pop()?.toLowerCase() ||
      EXT_BY_MIME[mimeType] ||
      (video ? "mp4" : "jpg");

    if (!video) {
      try {
        buffer = Buffer.from(await optimizePropertyImage(source));
        contentType = "image/webp";
        ext = "webp";
      } catch {
        return NextResponse.json(
          { error: "No se ha podido procesar la imagen. Prueba con JPG o PNG." },
          { status: 400 }
        );
      }
    }

    const filename = `${randomUUID()}.${ext}`;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const objectPath = `properties/${filename}`;
      const { error } = await supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .upload(objectPath, buffer, {
          contentType,
          upsert: false,
        });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { data } = supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .getPublicUrl(objectPath);

      return NextResponse.json({ url: data.publicUrl });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/properties/${filename}` });
  } catch {
    return NextResponse.json(
      { error: "Error al subir el archivo" },
      { status: 500 },
    );
  }
}
