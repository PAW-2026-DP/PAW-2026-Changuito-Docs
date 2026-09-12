"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage may be unavailable (e.g. private browsing); theme just won't persist.
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  // Avoid a mismatch flash before we know the theme the inline boot script picked.
  if (theme === null) {
    return <div className="h-8 w-24" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        applyTheme(next);
        setTheme(next);
      }}
      aria-label="Cambiar entre modo oscuro y claro"
      className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
    >
      {theme === "dark" ? (
        <>
          <span aria-hidden>☀️</span> Claro
        </>
      ) : (
        <>
          <span aria-hidden>🌙</span> Oscuro
        </>
      )}
    </button>
  );
}
