import { NextResponse } from "next/server";
import { renderLlmsTxt } from "@/lib/llms";

export const dynamic = "force-dynamic";

export async function GET() {
  const body = await renderLlmsTxt();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
