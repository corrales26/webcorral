"use client";

import { usePathname } from "next/navigation";
import { CookieBanner } from "@/components/CookieBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIsolated =
    pathname.startsWith("/admin") || pathname.startsWith("/colaborar");

  if (isIsolated) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
