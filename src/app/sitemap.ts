import type { MetadataRoute } from "next";

import { client } from "@/sanity/lib/client";

/**
 * Verzeichnis aller Seiten für Suchmaschinen (N-12).
 *
 * Projekte und Blogartikel werden aus dem CMS gelesen, damit neue Inhalte
 * automatisch aufgenommen werden. Nicht enthalten sind das Studio, die
 * Schnittstellen und die Dankesseite — sie gehören nicht in Suchergebnisse.
 */
export const revalidate = 3600;

const basis =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.martinrettschlag.de";

type Eintrag = { slug: string; aktualisiert: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projekte, artikel] = await Promise.all([
    client.fetch<Eintrag[]>(
      `*[_type == "project" && defined(slug.current)]{
        "slug": slug.current, "aktualisiert": _updatedAt
      }`,
    ),
    client.fetch<Eintrag[]>(
      `*[_type == "post" && defined(slug.current)]{
        "slug": slug.current, "aktualisiert": _updatedAt
      }`,
    ),
  ]);

  const jetzt = new Date();

  const feste: MetadataRoute.Sitemap = [
    { url: `${basis}/`, lastModified: jetzt, changeFrequency: "monthly", priority: 1 },
    { url: `${basis}/work`, lastModified: jetzt, changeFrequency: "monthly", priority: 0.9 },
    { url: `${basis}/software`, lastModified: jetzt, changeFrequency: "monthly", priority: 0.8 },
    { url: `${basis}/blog`, lastModified: jetzt, changeFrequency: "weekly", priority: 0.7 },
    { url: `${basis}/contact`, lastModified: jetzt, changeFrequency: "yearly", priority: 0.6 },
    { url: `${basis}/impressum`, lastModified: jetzt, changeFrequency: "yearly", priority: 0.2 },
    { url: `${basis}/datenschutz`, lastModified: jetzt, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...feste,
    ...projekte.map((p) => ({
      url: `${basis}/work/${p.slug}`,
      lastModified: new Date(p.aktualisiert),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...artikel.map((a) => ({
      url: `${basis}/blog/${a.slug}`,
      lastModified: new Date(a.aktualisiert),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
