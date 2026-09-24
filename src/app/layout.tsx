import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { CookieConsentProvider } from "@/context/CookieConsentProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { SiteShell } from "@/components/SiteShell";
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

export const metadata: Metadata = {
  title: {
    default: "Corral Business | Inmobiliaria en Cantabria",
    template: "%s | Corral Business",
  },
  description:
    "Especialistas en compraventa, alquiler, rehabilitación e inversión inmobiliaria en Cantabria. Tu vivienda en buenas manos.",
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
        <CookieConsentProvider>
          <ThemeProvider>
            <SiteShell>{children}</SiteShell>
          </ThemeProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
