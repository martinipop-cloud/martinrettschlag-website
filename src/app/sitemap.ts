import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { client } from "@/sanity/lib/client";

/**
 * Verzeichnis aller Seiten für Suchmaschinen (N-12).
 *
 * Die Projekte werden aus dem CMS gelesen, damit neue Inhalte automatisch
 * aufgenommen werden. Nicht enthalten sind das Studio, die Schnittstellen und
 * die Dankesseite — sie gehören nicht in Suchergebnisse. Ebenfalls nicht
 * enthalten ist „What I Like“ (/blog): Der Bereich ist aus der Navigation
 * genommen und wird durch eine eigene Seite ersetzt.
 *
 * Jede Seite steht zweimal drin: deutsch an der Wurzel, englisch unter /en.
 * Dazu nennt jeder Eintrag über „alternates“ die jeweils andere Fassung, damit
 * Suchmaschinen beide als dasselbe Dokument in zwei Sprachen erkennen und
 * nicht als doppelten Inhalt bewerten.
 */
export const revalidate = 3600;

type Eintrag = { slug: string; aktualisiert: string };

/** Erzeugt beide Sprachfassungen einer Adresse, gegenseitig verknüpft. */
function beideSprachen(
  ziel: string,
  optionen: {
    lastModified: Date;
    changeFrequency: "yearly" | "monthly" | "weekly";
    priority: number;
  },
): MetadataRoute.Sitemap {
  const sauber = ziel === "/" ? "" : ziel;
  const de = `${siteUrl}${sauber || "/"}`;
  const en = `${siteUrl}/en${sauber}`;
  // „x-default“ benennt die Fassung für alle übrigen Sprachen: Englisch,
  // weil es international weiter verständlich ist als Deutsch.
  const alternates = { languages: { de, en, "x-default": en } };

  return [
    { url: de, ...optionen, alternates },
    { url: en, ...optionen, alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projekte = await client.fetch<Eintrag[]>(
    `*[_type == "project" && defined(slug.current)]{
      "slug": slug.current, "aktualisiert": _updatedAt
    }`,
  );

  const jetzt = new Date();

  const feste: MetadataRoute.Sitemap = [
    ...beideSprachen("/", { lastModified: jetzt, changeFrequency: "monthly", priority: 1 }),
    ...beideSprachen("/work", { lastModified: jetzt, changeFrequency: "monthly", priority: 0.9 }),
    ...beideSprachen("/software", { lastModified: jetzt, changeFrequency: "monthly", priority: 0.8 }),
    ...beideSprachen("/trust-me", { lastModified: jetzt, changeFrequency: "monthly", priority: 0.6 }),
    ...beideSprachen("/contact", { lastModified: jetzt, changeFrequency: "yearly", priority: 0.6 }),
    ...beideSprachen("/impressum", { lastModified: jetzt, changeFrequency: "yearly", priority: 0.2 }),
    ...beideSprachen("/datenschutz", { lastModified: jetzt, changeFrequency: "yearly", priority: 0.2 }),
    // AGB und Rückgabe liegen nur auf Deutsch vor.
    { url: `${siteUrl}/agb`, lastModified: jetzt, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/rueckgabe`, lastModified: jetzt, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...feste,
    ...projekte.flatMap((p) =>
      beideSprachen(`/work/${p.slug}`, {
        lastModified: new Date(p.aktualisiert),
        changeFrequency: "monthly",
        priority: 0.8,
      }),
    ),
  ];
}
