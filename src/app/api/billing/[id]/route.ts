import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteBillingEntry } from "@/lib/storage/billing";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await deleteBillingEntry(id);
    if (!deleted) {
      return NextResponse.json({ error: "Movimiento no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al eliminar el movimiento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
