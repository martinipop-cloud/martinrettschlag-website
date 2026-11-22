import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Unterschriften für die Newsletter-Strecke (Kapitel 4.9).
 *
 * Hintergrund: Der Download eines kostenlosen Tools liegt hinter der
 * Bestätigung der Anmeldung (F-404n). Damit das nicht umgangen werden kann,
 * darf die Bestätigungsseite nicht einfach zu erraten sein — der Name des
 * Tools steht ja öffentlich auf der Software-Seite. Deshalb trägt jede
 * Adresse eine Unterschrift, die nur mit dem Geheimnis auf dem Server
 * erzeugt werden kann.
 *
 * Bewusst ohne Datenbank: Es gibt keine Sitzung, keinen Zähler, kein
 * Merkmal am Besucher. Die Adresse selbst trägt alles, was zu ihrer Prüfung
 * nötig ist — und läuft von allein ab.
 *
 * Nur für den Server. Dieses Modul darf nicht in eine Client-Komponente
 * geraten, sonst läge das Geheimnis im Browser.
 */

/** Wie lange der Link aus der Bestätigungsmail gilt. */
export const BESTAETIGUNG_GUELTIG_MS = 14 * 24 * 60 * 60 * 1000;

/** Wie lange der Download-Link auf der Bestätigungsseite gilt. */
export const DOWNLOAD_GUELTIG_MS = 24 * 60 * 60 * 1000;

/**
 * „bestaetigt“ unterschreibt die Seite, „download“ die Datei selbst.
 * Getrennte Zwecke, damit eine Unterschrift nicht für das jeweils andere
 * weiterverwendet werden kann.
 */
export type Zweck = "bestaetigt" | "download";

function geheimnis(): string | null {
  const wert = process.env.NEWSLETTER_SECRET?.trim();
  return wert && wert.length >= 16 ? wert : null;
}

/** Erzeugt die Unterschrift oder null, wenn kein Geheimnis hinterlegt ist. */
export function unterschreiben(
  zweck: Zweck,
  slug: string,
  bis: number,
): string | null {
  const schluessel = geheimnis();
  if (!schluessel) return null;
  return createHmac("sha256", schluessel)
    .update(`${zweck}:${slug}:${bis}`)
    .digest("hex")
    .slice(0, 32);
}

/** Prüft eine Unterschrift und gleichzeitig, ob sie noch gilt. */
export function istGueltig(
  zweck: Zweck,
  slug: string | null,
  bis: unknown,
  gegeben: unknown,
): boolean {
  if (!slug || typeof gegeben !== "string") return false;

  const frist = typeof bis === "string" ? Number(bis) : bis;
  if (typeof frist !== "number" || !Number.isFinite(frist)) return false;
  if (frist < Date.now()) return false;

  const erwartet = unterschreiben(zweck, slug, frist);
  if (!erwartet || erwartet.length !== gegeben.length) return false;

  // Zeichenweiser Vergleich mit gleichbleibender Laufzeit: Ein gewöhnlicher
  // Vergleich bricht beim ersten Unterschied ab und verrät damit über die
  // Antwortzeit, wie viele Zeichen schon stimmten.
  return timingSafeEqual(Buffer.from(erwartet), Buffer.from(gegeben));
}

/**
 * Baut die Abfrage für eine unterschriebene Adresse.
 * Ohne Geheimnis bleibt sie leer — die Prüfung schlägt dann fehl, statt
 * stillschweigend alles durchzulassen.
 */
export function unterschriebeneAbfrage(
  zweck: Zweck,
  slug: string,
  gueltigkeitMs: number,
): string {
  const bis = Date.now() + gueltigkeitMs;
  const sig = unterschreiben(zweck, slug, bis);
  if (!sig) return "";
  return `tool=${encodeURIComponent(slug)}&bis=${bis}&sig=${sig}`;
}
