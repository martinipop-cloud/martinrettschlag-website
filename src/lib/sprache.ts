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
  // Ein einfacher Text statt { de, en } gilt als deutsche Fassung. So
  // stammen Felder, die im CMS (noch) nicht zweisprachig angelegt sind,
  // nicht mehr kommentarlos als Lücke auf der Seite.
  if (typeof feld === "string") {
    meldeEinfachenWert();
    return (feld as string).trim();
  }
  const gewuenscht = feld[sprache]?.trim();
  if (gewuenscht) return gewuenscht;
  return feld[STANDARDSPRACHE]?.trim() ?? "";
}

let einfacherWertGemeldet = false;

/**
 * Ein CMS-Feld liefert einfachen Text statt { de, en }. Die Seite zeigt ihn
 * als Deutsch an, aber das Datenmodell passt dann nicht zur Anzeige —
 * einmal im Server-Log vermerken, damit es nicht unbemerkt bleibt.
 */
function meldeEinfachenWert() {
  if (einfacherWertGemeldet) return;
  einfacherWertGemeldet = true;
  console.warn(
    "sprache: Ein CMS-Feld liefert einfachen Text statt { de, en }. Wird als Deutsch angezeigt; das Schema des Inhaltstyps prüfen.",
  );
}

/** Dasselbe für formatierte Texte. */
export function richText(
  feld: LocalizedRichText,
  sprache: Sprache,
): PortableTextBlock[] | null {
  if (!feld) return null;
  // Wie bei text(): formatierter Text ohne Sprachaufteilung gilt als Deutsch.
  if (Array.isArray(feld)) {
    meldeEinfachenWert();
    return feld.length > 0 ? (feld as PortableTextBlock[]) : null;
  }
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

/**
 * Entfernt den Sprachvorsatz aus einer Adresse.
 * „/en/work/xy“ wird zu „/work/xy“, „/en“ zu „/“. Deutsche Adressen haben
 * keinen Vorsatz und bleiben unverändert.
 */
export function ohneSprache(adresse: string): string {
  if (adresse === "/en") return "/";
  if (adresse.startsWith("/en/")) return adresse.slice(3);
  return adresse;
}

/** Die jeweils andere Sprache — für den Umschalter im Kopfbereich. */
export function andereSprache(sprache: Sprache): Sprache {
  return sprache === "de" ? "en" : "de";
}
