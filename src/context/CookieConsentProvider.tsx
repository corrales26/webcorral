"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  acceptAllConsent,
  clearPreferenceStorage,
  getConsentCookie,
  necessaryOnlyConsent,
  setConsentCookie,
  type CookiePreferences,
} from "@/lib/cookie-consent";

interface CookieConsentContextValue {
  consent: CookiePreferences | null;
  bannerVisible: boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  savePreferences: (preferences: Omit<CookiePreferences, "necessary">) => void;
  openBanner: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(
  undefined,
);

function applyConsent(preferences: CookiePreferences) {
  setConsentCookie(preferences);
  if (!preferences.preferences) {
    clearPreferenceStorage();
    document.documentElement.classList.remove("dark");
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = getConsentCookie();
    setConsent(stored);
    setBannerVisible(!stored);
    setHydrated(true);
  }, []);

  const acceptAll = useCallback(() => {
    applyConsent(acceptAllConsent);
    setConsent(acceptAllConsent);
    setBannerVisible(false);
  }, []);

  const acceptNecessaryOnly = useCallback(() => {
    applyConsent(necessaryOnlyConsent);
    setConsent(necessaryOnlyConsent);
    setBannerVisible(false);
  }, []);

  const savePreferences = useCallback(
    (preferences: Omit<CookiePreferences, "necessary">) => {
      const next: CookiePreferences = { necessary: true, ...preferences };
      applyConsent(next);
      setConsent(next);
      setBannerVisible(false);
    },
    [],
  );

  const openBanner = useCallback(() => {
    setBannerVisible(true);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        bannerVisible: hydrated && bannerVisible,
        acceptAll,
        acceptNecessaryOnly,
        savePreferences,
        openBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}
