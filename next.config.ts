import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/api/colaboraciones/imagen/**" },
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
};

export default nextConfig;
