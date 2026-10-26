"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  andereSprache,
  ohneSprache,
  pfad,
  type Sprache,
} from "@/lib/sprache";
import { texte } from "@/lib/texte";

import { ThemeToggle } from "./ThemeToggle";

/**
 * Dauerhaft sichtbare Navigationsleiste (F-809 bis F-812).
 * Bleibt beim Scrollen am oberen Rand stehen und grenzt sich dort
 * sichtbar vom darunterliegenden Inhalt ab.
 */
export function SiteHeader({ sprache }: { sprache: Sprache }) {
  const t = texte(sprache);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { ziel: "/work", label: t.navWork },
    { ziel: "/software", label: t.navSoftware },
    { ziel: "/blog", label: t.navBlog },
    { ziel: "/trust-me", label: t.navTrustMe },
    { ziel: "/contact", label: t.navContact },
  ];

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Beim Seitenwechsel das mobile Menü wieder schließen.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(ziel: string) {
    const href = pfad(ziel, sprache);
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Der Umschalter führt auf dieselbe Seite in der anderen Sprache. Nur die
  // Startseite kennt keinen eigenen Pfad, deshalb wird dort auf „/“ gewechselt.
  const zweite = andereSprache(sprache);
  const umschalterZiel = pfad(ohneSprache(pathname), zweite);
  const umschalterLabel =
    zweite === "de" ? texte(zweite).spracheDeutsch : texte(zweite).spracheEnglisch;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      {/* Auf dem Handy stehen hier drei Schaltflächen neben dem Namenszug.
          Deshalb engere Abstände als auf dem Rechner, damit der Name in einer
          Zeile bleibt. */}
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-5 md:gap-6 md:px-10">
        <Link
          href={pfad("/", sprache)}
          className="display text-sm leading-none tracking-tight whitespace-nowrap sm:text-base md:text-lg"
        >
          Martin Rettschlag
        </Link>

        <nav aria-label={t.hauptnavigation} className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.ziel}>
                <Link
                  href={pfad(item.ziel, sprache)}
                  aria-current={isActive(item.ziel) ? "page" : undefined}
                  className={`meta transition-colors hover:text-accent ${
                    isActive(item.ziel) ? "text-accent" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Sprachumschalter. Zeigt die Sprache, in die gewechselt wird —
              nicht die aktuelle. hrefLang und lang sagen Browsern und
              Screenreadern, dass das Ziel in der anderen Sprache ist. */}
          <Link
            href={umschalterZiel}
            hrefLang={zweite}
            lang={zweite}
            aria-label={`${t.spracheWechseln}: ${umschalterLabel}`}
            className="meta rounded-full border border-line px-2.5 py-1.5 transition-colors hover:border-accent hover:text-accent md:px-3"
          >
            {zweite.toUpperCase()}
          </Link>

          <ThemeToggle sprache={sprache} />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="meta cursor-pointer rounded-full border border-line px-2.5 py-1.5 md:hidden"
          >
            {menuOpen ? t.menueSchliessen : t.menueOeffnen}
          </button>
        </div>
      </div>

      {/* Mobile Navigation als Overlay (F-805) */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label={t.hauptnavigation}
          className="border-t border-line bg-paper md:hidden"
        >
          <ul className="flex flex-col px-5 py-4">
            {navigation.map((item) => (
              <li key={item.ziel}>
                <Link
                  href={pfad(item.ziel, sprache)}
                  aria-current={isActive(item.ziel) ? "page" : undefined}
                  className={`display block py-3 text-3xl ${
                    isActive(item.ziel) ? "text-accent" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
