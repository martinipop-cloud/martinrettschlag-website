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

/** Ein Textfeld mit beiden Sprachfassungen, wie es aus dem CMS kommt. */
export type ZweisprachigerText = {
  de?: string | null;
  en?: string | null;
} | null;

/**
 * Liefert den Text in der gewünschten Sprache, sonst in der Grundsprache.
 */
export function text(
  feld: ZweisprachigerText,
  sprache: Sprache,
): string | null {
  if (!feld) return null;
  const gewuenscht = feld[sprache]?.trim();
  if (gewuenscht) return gewuenscht;
  const ersatz = feld[STANDARDSPRACHE]?.trim();
  return ersatz || null;
}

/** Prüft, ob eine Zeichenkette eine unterstützte Sprache benennt. */
export function istSprache(wert: unknown): wert is Sprache {
  return typeof wert === "string" && SPRACHEN.includes(wert as Sprache);
}
