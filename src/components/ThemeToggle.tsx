"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Umschalter zwischen heller und dunkler Darstellung (F-801, F-802, F-803).
 * Die Wahl wird im Browser gespeichert; ohne gespeicherte Wahl gilt die
 * Systemeinstellung.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Vor dem ersten Rendern im Browser ist die Wahl noch unbekannt.
      // Der Platzhaltertext hält die Breite stabil, damit nichts springt (F-808).
      aria-label={
        theme === "dark"
          ? "Zur hellen Darstellung wechseln"
          : "Zur dunklen Darstellung wechseln"
      }
      className="meta cursor-pointer rounded-full border border-line px-3 py-1.5 transition-colors hover:border-accent hover:text-accent"
    >
      {theme === null ? "     " : theme === "dark" ? "Hell" : "Dunkel"}
    </button>
  );
}
