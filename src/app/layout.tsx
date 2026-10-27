import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { CookieConsentProvider } from "@/context/CookieConsentProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/lib/data";
import { businessJsonLd, jsonLdScript } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const siteDescription =
  "Compraventa, alquiler, rehabilitación e inversión en toda España. Oficina en Cicero, Cantabria. Tu vivienda en buenas manos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Corral Business | Inmobiliaria en Cantabria",
    template: "%s | Corral Business",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: siteConfig.name,
    title: "Corral Business | Inmobiliaria en Cantabria",
    description: siteDescription,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Corral Business. Oficina en Cicero, Cantabria. Actividad en toda España.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corral Business | Inmobiliaria en Cantabria",
    description: siteDescription,
    images: ["/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-96x96.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <link rel="describedby" href="/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(businessJsonLd()) }}
        />
        <CookieConsentProvider>
          <GoogleAnalytics />
          <ThemeProvider>
            <SiteShell>{children}</SiteShell>
          </ThemeProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
