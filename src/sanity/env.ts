/**
 * Zentrale Stelle für die Sanity-Zugangsdaten.
 * Die Werte kommen aus .env.local (lokal) bzw. aus den Vercel-Umgebungsvariablen (Produktion).
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-15";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/**
 * Bricht ab, wenn eine Umgebungsvariable fehlt ODER leer ist.
 *
 * Die Prüfung auf „leer“ ist wichtig: Eine angelegte, aber unbefüllte Variable
 * rutschte früher durch und führte weiter unten zu einer schwer deutbaren
 * Fehlermeldung von Sanity. Jetzt steht sofort da, welcher Wert fehlt.
 */
function assertValue(wert: string | undefined, name: string): string {
  if (typeof wert !== "string" || wert.trim() === "") {
    throw new Error(
      [
        `Umgebungsvariable ${name} fehlt oder ist leer.`,
        "",
        "Lokal:  Wert in der Datei .env.local eintragen.",
        "Vercel: Settings -> Environment Variables. Dort muss der Eintrag",
        "        einen Wert haben und für die Umgebung 'Production'",
        "        freigegeben sein. Nach dem Ändern neu bereitstellen",
        "        (Deployments -> ... -> Redeploy).",
      ].join("\n"),
    );
  }
  return wert.trim();
}
