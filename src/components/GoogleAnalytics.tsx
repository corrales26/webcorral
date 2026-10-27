"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/context/CookieConsentProvider";

const GA_ID = "G-W44YC6K1Z5";

export function GoogleAnalytics() {
  const { consent } = useCookieConsent();
  const enabled = consent?.analytics === true;

  useEffect(() => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = !enabled;
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
