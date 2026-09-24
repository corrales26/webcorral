"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useCookieConsent } from "@/context/CookieConsentProvider";
import type { CookiePreferences } from "@/lib/cookie-consent";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveTheme(consent: CookiePreferences | null): Theme {
  if (consent?.preferences) {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { consent } = useCookieConsent();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(resolveTheme(consent));
  }, [consent]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      if (consent?.preferences) {
        localStorage.setItem("theme", next);
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
