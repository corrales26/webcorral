import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  images: {
    localPatterns: [
      { pathname: "/api/colaboraciones/imagen/**" },
      { pathname: "/uploads/**" },
      { pathname: "/logocorral.svg" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
    "/api/**/*": ["./data/**/*"],
  },
  async rewrites() {
    return [
      { source: "/llm.txt", destination: "/llms.txt" },
      { source: "/index.md", destination: "/api/llm-page/index" },
      { source: "/:path*/index.md", destination: "/api/llm-page/:path*" },
      { source: "/:path*.md", destination: "/api/llm-page/:path*" },
    ];
  },
};

export default nextConfig;
