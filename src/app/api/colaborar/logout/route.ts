import { NextResponse } from "next/server";
import { destroyCollaboratorSession } from "@/lib/auth";

export async function POST() {
  await destroyCollaboratorSession();
  return NextResponse.json({ success: true });
}
