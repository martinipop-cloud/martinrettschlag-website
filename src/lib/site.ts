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
