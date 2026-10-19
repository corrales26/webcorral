import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteProperty,
  getPropertyById,
  updateProperty,
} from "@/lib/storage/properties";
import { revalidatePublicProperties } from "@/lib/revalidate-public";
import type { PropertyInput } from "@/lib/types/property";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return NextResponse.json({ error: "Inmueble no encontrado" }, { status: 404 });
  }

  if (!property.published) {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Inmueble no encontrado" }, { status: 404 });
    }
  }

  return NextResponse.json(property);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = (await request.json()) as Partial<PropertyInput>;
    const property = await updateProperty(id, body);

    if (!property) {
      return NextResponse.json({ error: "Inmueble no encontrado" }, { status: 404 });
    }

    revalidatePublicProperties();
    return NextResponse.json(property);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el inmueble" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteProperty(id);

  if (!deleted) {
    return NextResponse.json({ error: "Inmueble no encontrado" }, { status: 404 });
  }

  revalidatePublicProperties();
  return NextResponse.json({ success: true });
}
