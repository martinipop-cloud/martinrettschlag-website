"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { href: "/work", label: "Work" },
  { href: "/software", label: "Software" },
  { href: "/blog", label: "What I Like" },
  { href: "/contact", label: "Contact" },
];

/**
 * Dauerhaft sichtbare Navigationsleiste (F-809 bis F-812).
 * Bleibt beim Scrollen am oberen Rand stehen und grenzt sich dort
 * sichtbar vom darunterliegenden Inhalt ab.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">
        <Link
          href="/"
          className="display text-base leading-none tracking-tight md:text-lg"
        >
          Martin Rettschlag
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`meta transition-colors hover:text-accent ${
                    isActive(item.href) ? "text-accent" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="meta cursor-pointer rounded-full border border-line px-3 py-1.5 md:hidden"
          >
            {menuOpen ? "Schliessen" : "Menü"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation als Overlay (F-805) */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Hauptnavigation"
          className="border-t border-line bg-paper md:hidden"
        >
          <ul className="flex flex-col px-5 py-4">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`display block py-3 text-3xl ${
                    isActive(item.href) ? "text-accent" : ""
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
