import "server-only";

import {
  type GithubReleaseRoh,
  repoAus,
  type ToolReleases,
  waehleReleases,
} from "./githubReleases";

/**
 * Abruf der Tool-Releases bei GitHub (F-413, F-414).
 *
 * Die Repositories sind privat: Ohne Token sieht niemand die Dateien, auch
 * nicht über GitHub selbst. Der einzige Weg zur Datei führt also weiterhin
 * über die Newsletter-Bestätigung und /api/download (F-404n, A-15).
 *
 * Das Token bleibt auf dem Server. Wer herunterlädt, bekommt von GitHub eine
 * eigene, unterschriebene Adresse, die nach wenigen Minuten verfällt.
 */

const API = "https://api.github.com";

/** So lange gilt die Versionsliste als aktuell. Neue Releases erscheinen also spätestens nach fünf Minuten. */
const LISTE_GUELTIG_S = 300;

function kopfzeilen(accept: string): HeadersInit {
  const kopf: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    // GitHub lehnt Anfragen ohne User-Agent ab.
    "User-Agent": "website-tool-releases",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) kopf.Authorization = `Bearer ${token}`;
  return kopf;
}

/**
 * Neueste stabile Fassung und neueste Beta eines Tools.
 *
 * Liefert `null`, wenn das Repository nicht erreichbar ist. Das wird laut
 * protokolliert, damit ein abgelaufenes Token nicht stillschweigend alle
 * Download-Knöpfe verschwinden lässt.
 *
 * @param frisch Ohne Zwischenspeicher abrufen — für den Download selbst,
 *   damit nie eine gerade gelöschte Datei angefordert wird.
 */
export async function ladeReleases(
  repoEingabe: string | null | undefined,
  { frisch = false }: { frisch?: boolean } = {},
): Promise<ToolReleases | null> {
  const repo = repoAus(repoEingabe);
  if (!repo) {
    if (repoEingabe) {
      console.error(`GitHub: „${repoEingabe}" ist keine gültige Repository-Angabe.`);
    }
    return null;
  }
  if (!process.env.GITHUB_TOKEN) {
    console.error(
      `GitHub: GITHUB_TOKEN fehlt — private Repositories (hier ${repo}) sind so nicht lesbar.`,
    );
  }

  try {
    const antwort = await fetch(`${API}/repos/${repo}/releases?per_page=30`, {
      headers: kopfzeilen("application/vnd.github+json"),
      ...(frisch
        ? { cache: "no-store" as const }
        : { next: { revalidate: LISTE_GUELTIG_S, tags: [`github-releases:${repo}`] } }),
    });
    if (!antwort.ok) {
      // 404 heißt bei privaten Repos meistens: Token fehlt oder darf das
      // Repo nicht lesen. GitHub verrät die Existenz privater Repos nicht.
      console.error(
        `GitHub: Releases von ${repo} nicht lesbar (HTTP ${antwort.status}).` +
          (antwort.status === 404
            ? " Repository-Name prüfen und ob das Token Zugriff darauf hat."
            : ""),
      );
      return null;
    }
    const liste = (await antwort.json()) as GithubReleaseRoh[];
    const ergebnis = waehleReleases(liste);
    // Häufigster Fehler beim Veröffentlichen: Release angelegt, Datei
    // vergessen. Ohne diese Meldung verschwände der Download-Knopf kommentarlos.
    if (liste.length > 0 && !ergebnis.stabil && !ergebnis.beta) {
      console.error(
        `GitHub: ${repo} hat ${liste.length} Release(s), aber keines mit fertig hochgeladener Datei. Datei an das Release anhängen.`,
      );
    }
    return ergebnis;
  } catch (fehler) {
    console.error(`GitHub: Abruf der Releases von ${repo} fehlgeschlagen:`, fehler);
    return null;
  }
}

/**
 * Kurzlebige Download-Adresse für eine Release-Datei.
 *
 * GitHub antwortet auf den Abruf mit 302 und einer unterschriebenen Adresse
 * (gültig wenige Minuten, Dateiname schon gesetzt). Die wird abgegriffen
 * statt der Datei selbst — so läuft der Download nicht durch die Website.
 */
export async function downloadAdresse(
  repoEingabe: string,
  dateiId: number,
): Promise<string | null> {
  const repo = repoAus(repoEingabe);
  if (!repo) return null;
  try {
    const antwort = await fetch(`${API}/repos/${repo}/releases/assets/${dateiId}`, {
      headers: kopfzeilen("application/octet-stream"),
      redirect: "manual",
      cache: "no-store",
    });
    const ziel = antwort.headers.get("location");
    if (antwort.status >= 300 && antwort.status < 400 && ziel) return ziel;
    console.error(
      `GitHub: Datei ${dateiId} aus ${repo} lieferte HTTP ${antwort.status} statt einer Weiterleitung.`,
    );
    return null;
  } catch (fehler) {
    console.error(`GitHub: Datei ${dateiId} aus ${repo} nicht abrufbar:`, fehler);
    return null;
  }
}
