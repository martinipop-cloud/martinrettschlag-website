"use client";

/**
 * Eigener Bild-Lader für next/image (N-02).
 *
 * Statt der Bildoptimierung von Vercel – im kostenlosen Tarif mengenmäßig
 * begrenzt – rechnet das Sanity-CDN die passenden Größen und modernen
 * Formate selbst aus. next/image erzeugt weiterhin die Größenstaffel
 * (srcset); dieser Lader schreibt nur die gewünschte Breite in die
 * Sanity-Adresse.
 *
 * Ist in der Adresse schon ein Zuschnitt mit fester Höhe angelegt (z. B.
 * 600 × 450 für Kacheln), wird die Höhe im selben Verhältnis mitskaliert,
 * damit das Seitenverhältnis erhalten bleibt.
 *
 * Alle anderen Bilder (eigene Dateien, YouTube-Vorschau über die eigene
 * Schnittstelle) werden unverändert ausgeliefert.
 */
export default function bildLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const url = new URL(src);
    const params = url.searchParams;

    const alteBreite = Number(params.get("w"));
    const alteHoehe = Number(params.get("h"));
    if (alteBreite > 0 && alteHoehe > 0) {
      params.set("h", String(Math.round((alteHoehe * width) / alteBreite)));
    }

    params.set("w", String(width));
    params.set("q", String(quality ?? 75));
    params.set("auto", "format");
    if (!params.has("fit")) params.set("fit", "max");
    return url.href;
  }

  // next/image verlangt, dass die Breite in der Adresse vorkommt. Für eigene
  // Dateien hat sie keine Wirkung.
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
