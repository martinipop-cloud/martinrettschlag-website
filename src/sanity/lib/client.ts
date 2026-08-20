import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

/**
 * Lesender Zugang zur Datenbank – ausschließlich serverseitig.
 *
 * Wichtig zum Datenschutz: Da Kontaktanfragen im CMS gespeichert werden, steht
 * der Datensatz bei Sanity auf „privat“. Sonst könnte jeder mit Kenntnis der
 * Projekt-ID sämtliche Anfragen samt Namen, Adressen und Nachrichten über die
 * öffentliche Schnittstelle auslesen.
 *
 * Das Lese-Token liegt ausschließlich in einer Umgebungsvariablen und gelangt
 * nie in den Browser – "server-only" lässt den Build scheitern, falls diese
 * Datei versehentlich aus einer Browser-Komponente heraus verwendet wird (N-42).
 */
const token = process.env.SANITY_API_READ_TOKEN?.trim();

/**
 * Fehlt das Token, antwortet ein privater Datensatz **nicht mit einem Fehler**,
 * sondern mit einem leeren Ergebnis. Die Website wäre dann still und heimlich
 * inhaltsleer – schlimmer als ein sichtbarer Fehler. Deshalb wird hier
 * abgebrochen, sobald die Seite produktiv läuft.
 */
if (!token) {
  const hinweis = [
    "Umgebungsvariable SANITY_API_READ_TOKEN fehlt oder ist leer.",
    "",
    "Ohne dieses Token liefert der private Sanity-Datensatz leere Ergebnisse,",
    "ohne einen Fehler zu melden. Projekte, Artikel und Tools würden auf der",
    "Website schlicht nicht erscheinen.",
    "",
    "Token erzeugen: sanity.io/manage -> Projekt -> API -> Tokens,",
    "Berechtigung 'Viewer'. Dann eintragen:",
    "  lokal  -> .env.local",
    "  Vercel -> Settings -> Environment Variables (für 'Production' freigeben)",
  ].join("\n");

  if (process.env.NODE_ENV === "production") {
    throw new Error(hinweis);
  }
  console.warn(`\n[Warnung] ${hinweis}\n`);
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Ohne Token darf der schnelle CDN-Weg genutzt werden. Mit Token wird direkt
  // abgefragt, damit keine authentifizierten Antworten zwischengespeichert werden.
  useCdn: !token,
  // Nur veröffentlichte Inhalte ausliefern – Entwürfe bleiben auf der Website unsichtbar.
  perspective: "published",
  token,
});
