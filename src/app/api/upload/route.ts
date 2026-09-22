import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAuthenticated } from "@/lib/auth";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  PROPERTY_IMAGES_BUCKET,
} from "@/lib/supabase/admin";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "properties");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa JPG, PNG o WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 5 MB" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const objectPath = `properties/${filename}`;
      const { error } = await supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .upload(objectPath, buffer, {
          contentType: file.type,
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
      { error: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}
