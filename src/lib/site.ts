/**
 * Adresse, unter der die Website erreichbar ist.
 *
 * Wichtig: Eine angelegte, aber leere Umgebungsvariable muss wie eine fehlende
 * behandelt werden. Der Operator ?? greift nur bei null und undefined – eine
 * leere Zeichenkette rutscht durch und führte dazu, dass in der Sitemap
 * Adressen wie "/work" statt "https://…/work" standen.
 */
const roh = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl =
  roh && roh.length > 0
    ? roh.replace(/\/+$/, "")
    : "https://www.martinrettschlag.de";

/**
 * Verweise auf die anderen Sprachfassungen derselben Seite (N-13).
 *
 * Suchmaschinen erkennen daran, dass deutsche und englische Fassung dasselbe
 * Dokument sind, und zeigen Suchenden die passende Sprache — statt die beiden
 * Seiten als doppelten Inhalt gegeneinander zu bewerten.
 *
 * „x-default“ benennt die Fassung für alle übrigen Sprachen. Das ist hier
 * Englisch, weil es international weiter verständlich ist als Deutsch.
 *
 * @param ziel Adresse ohne Sprachvorsatz, z. B. „/work“ oder „/“.
 */
export function sprachAlternativen(ziel: string) {
  const sauber = ziel === "/" ? "" : ziel.replace(/\/+$/, "");
  return {
    languages: {
      de: `${siteUrl}${sauber || "/"}`,
      en: `${siteUrl}/en${sauber}`,
      "x-default": `${siteUrl}/en${sauber}`,
    },
  };
}
