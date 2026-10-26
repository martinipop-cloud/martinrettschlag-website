import type { PortableTextBlock } from "@portabletext/react";

import type { LocalizedRichText, LocalizedString } from "@/sanity/lib/types";

/**
 * Zweisprachigkeit: Deutsch ist die Grundsprache, Englisch die Übersetzung.
 *
 * Fehlt eine englische Fassung, zeigt die Website den deutschen Text. Das ist
 * bewusst so: Eine Lücke wäre schlimmer als ein Text in der falschen Sprache,
 * gerade bei 70 Projekten, die nach und nach übersetzt werden.
 */
export const SPRACHEN = ["de", "en"] as const;
export type Sprache = (typeof SPRACHEN)[number];

export const STANDARDSPRACHE: Sprache = "de";

/** Liefert einen Text in der gewünschten Sprache, sonst in der Grundsprache. */
export function text(feld: LocalizedString, sprache: Sprache): string {
  if (!feld) return "";
  const gewuenscht = feld[sprache]?.trim();
  if (gewuenscht) return gewuenscht;
  return feld[STANDARDSPRACHE]?.trim() ?? "";
}

/** Dasselbe für formatierte Texte. */
export function richText(
  feld: LocalizedRichText,
  sprache: Sprache,
): PortableTextBlock[] | null {
  if (!feld) return null;
  const gewuenscht = feld[sprache];
  if (gewuenscht && gewuenscht.length > 0) return gewuenscht;
  const ersatz = feld[STANDARDSPRACHE];
  return ersatz && ersatz.length > 0 ? ersatz : null;
}

/** Prüft, ob eine Zeichenkette eine unterstützte Sprache benennt. */
export function istSprache(wert: unknown): wert is Sprache {
  return typeof wert === "string" && SPRACHEN.includes(wert as Sprache);
}

/**
 * Baut eine Adresse für die gewünschte Sprache.
 * Deutsch bleibt ohne Vorsatz, damit die bestehenden Adressen gültig bleiben;
 * Englisch liegt unter /en.
 */
export function pfad(ziel: string, sprache: Sprache): string {
  const sauber = ziel.startsWith("/") ? ziel : `/${ziel}`;
  if (sprache === STANDARDSPRACHE) return sauber;
  return sauber === "/" ? "/en" : `/en${sauber}`;
}
