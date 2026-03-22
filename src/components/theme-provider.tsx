"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface ThemeContextType {
  readonly isDark: boolean;
  readonly toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggle: () => {} });

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Persist preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
    else if (saved === "light") setIsDark(false);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setIsDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Dark mode toggle — iPhone-style ─────────────────────────────
export function DarkModeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "relative",
        width: 36,
        height: 20,
        borderRadius: 20,
        border: "none",
        background: isDark ? "#34c759" : "#e5e5ea",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        transition: "background 0.25s ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: isDark ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#ffffff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.04)",
          transition: "left 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />
    </button>
  );
}
