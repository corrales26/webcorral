export const CONSENT_COOKIE_NAME = "cb_cookie_consent";
export const CONSENT_MAX_AGE_DAYS = 365;

export interface CookiePreferences {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
}

export const necessaryOnlyConsent: CookiePreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
};

export const acceptAllConsent: CookiePreferences = {
  necessary: true,
  preferences: true,
  analytics: true,
};

function encodeConsent(preferences: CookiePreferences): string {
  return encodeURIComponent(JSON.stringify(preferences));
}

export function parseConsentCookie(value: string | undefined): CookiePreferences | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<CookiePreferences>;
    if (parsed.necessary !== true) return null;

    return {
      necessary: true,
      preferences: Boolean(parsed.preferences),
      analytics: Boolean(parsed.analytics),
    };
  } catch {
    return null;
  }
}

export function getConsentCookie(): CookiePreferences | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!match) return null;

  return parseConsentCookie(match.slice(CONSENT_COOKIE_NAME.length + 1));
}

export function setConsentCookie(preferences: CookiePreferences): void {
  if (typeof document === "undefined") return;

  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeConsent(preferences)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearPreferenceStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("theme");
}
