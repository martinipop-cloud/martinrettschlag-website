import type { MetadataRoute } from "next";

/**
 * Hinweise für Suchmaschinen (N-12).
 *
 * Die Download-Adresse ist ausgeschlossen, damit Suchmaschinen-Roboter den
 * Download-Zähler nicht verfälschen. Das Studio und die Schnittstellen
 * gehören ohnehin nicht in Suchergebnisse (B-02).
 */
const basis =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.martinrettschlag.de";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/studio", "/danke"],
    },
    sitemap: `${basis}/sitemap.xml`,
  };
}
