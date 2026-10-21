import { NextResponse } from "next/server";
import { renderMarkdownPage } from "@/lib/llms";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

interface MarkdownRouteProps {
  params: Promise<{ slug: string[] }>;
}

export async function GET(_request: Request, { params }: MarkdownRouteProps) {
  const { slug } = await params;
  const page = await renderMarkdownPage(slug.join("/"));

  if (!page) {
    return new NextResponse("No encontrado\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const siteUrl = getSiteUrl().replace(/\/$/, "");
  return new NextResponse(page.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      Link: `<${page.htmlUrl}>; rel="canonical", <${siteUrl}/llms.txt>; rel="describedby"`,
    },
  });
}
