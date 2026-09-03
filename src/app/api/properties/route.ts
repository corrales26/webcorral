import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  createProperty,
  getAllProperties,
} from "@/lib/storage/properties";
import type { PropertyInput } from "@/lib/types/property";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";

  if (admin) {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const properties = await getAllProperties(true);
    return NextResponse.json(properties);
  }

  const properties = await getAllProperties();
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PropertyInput;
    const property = await createProperty(body);
    return NextResponse.json(property, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el inmueble" },
      { status: 500 }
    );
  }
}
