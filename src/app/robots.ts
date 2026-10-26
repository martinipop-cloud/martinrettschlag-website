import type { MetadataRoute } from "next";

/**
 * Hinweise für Suchmaschinen (N-12).
 *
 * Die Download-Adresse ist ausgeschlossen, damit Suchmaschinen-Roboter den
 * Download-Zähler nicht verfälschen. Das Studio und die Schnittstellen
 * gehören ohnehin nicht in Suchergebnisse (B-02).
 */
import { siteUrl } from "@/lib/site";

/**
 * Testadressen von Vercel sollen nicht in Suchmaschinen landen. Sonst steht
 * dieselbe Seite doppelt im Index — einmal unter der Testadresse, einmal unter
 * der echten Domain — was der Auffindbarkeit schadet.
 */
const istTestadresse = /\.vercel\.app$/i.test(new URL(siteUrl).hostname);

export default function robots(): MetadataRoute.Robots {
  if (istTestadresse) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /danke in beiden Sprachen: Die Seite ergibt nur nach einer Spende
      // Sinn und gehört nicht in Suchergebnisse.
      disallow: ["/api/", "/studio", "/danke", "/en/danke"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
