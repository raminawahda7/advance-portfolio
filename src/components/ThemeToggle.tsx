"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Light/dark toggle. Persists the choice in localStorage and flips the `dark`
 * class on <html>. A no-flash inline script in the root layout applies the saved
 * theme before paint, so this component only syncs UI state + handles clicks.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore storage errors (private mode) */
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex items-center gap-1.5 border border-ink px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-text-primary transition-colors duration-150 hover:border-accent hover:text-accent"
    >
      <span aria-hidden>{theme === "dark" ? "☀" : "☾"}</span>
      <span>{theme === "dark" ? "light" : "dark"}</span>
    </button>
  );
}
