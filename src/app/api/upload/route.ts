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
import { convertHeicToJpeg, isHeicBuffer } from "@/lib/convert-heic";
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

  const requestType = request.headers.get("content-type") ?? "";
  if (requestType.includes("application/json")) {
    return createDirectVideoUpload(request);
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

    let source = Buffer.from(await file.arrayBuffer());
    const video = isVideoMimeType(mimeType);
    if (!video && (mimeType === "image/heic" || mimeType === "image/heif" || isHeicBuffer(source))) {
      try {
        source = Buffer.from(await convertHeicToJpeg(source));
      } catch {
        return NextResponse.json(
          { error: "No se ha podido procesar la foto del iPhone. Prueba con JPG o PNG." },
          { status: 400 }
        );
      }
    }
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

async function createDirectVideoUpload(request: Request) {
  let body: { name?: unknown; type?: unknown; size?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "No se ha podido preparar la subida" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name : "";
  const type = resolveUploadMimeType({
    type: typeof body.type === "string" ? body.type : "",
    name,
  });
  const size = typeof body.size === "number" ? body.size : Number.NaN;

  if (!isVideoMimeType(type)) {
    return NextResponse.json(
      { error: "Formato no permitido. Usa JPG, PNG, WebP, HEIC, MP4, WebM o MOV." },
      { status: 400 }
    );
  }

  const validationError = validateUploadMediaFile({ type, size });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ fallback: true });
  }

  const supabase = getSupabaseAdmin();
  const bucket = await supabase.storage.getBucket(PROPERTY_IMAGES_BUCKET);
  const bucketLimit = Number(bucket.data?.file_size_limit);
  if (Number.isFinite(bucketLimit) && bucketLimit > 0 && size > bucketLimit) {
    const megabytes = Math.floor(bucketLimit / (1024 * 1024));
    return NextResponse.json(
      { error: `El almacén solo acepta vídeos de hasta ${megabytes} MB.` },
      { status: 400 }
    );
  }

  const ext = EXT_BY_MIME[type] ?? "mp4";
  const objectPath = `properties/${randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .createSignedUploadUrl(objectPath);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message || "No se ha podido preparar la subida" },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(PROPERTY_IMAGES_BUCKET).getPublicUrl(objectPath);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    url: pub.publicUrl,
    contentType: type,
  });
}
