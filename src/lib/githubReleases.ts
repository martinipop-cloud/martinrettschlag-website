/**
 * Welche GitHub-Releases eines Tools angeboten werden (F-413).
 *
 * Reine Rechnung ohne Netz und ohne Imports, damit sie sich direkt mit Node
 * prüfen lässt (scripts/test-github-releases.mts). Der Abruf selbst steht in
 * github.ts.
 *
 * Regeln:
 * - Entwürfe zählen nie.
 * - Ein Release ohne hochgeladene Datei wird übersprungen — es gäbe nichts
 *   herunterzuladen.
 * - „Beta" heißt: bei GitHub als „pre-release" markiert. Der Versionsname
 *   wird dafür nicht ausgewertet.
 * - Angeboten werden die neueste stabile Fassung und die neueste Beta, die
 *   Beta aber nur, wenn sie jünger ist als die stabile. Sonst wäre sie
 *   ein Rückschritt mit Warnschild.
 */

export type GithubAssetRoh = {
  id: number;
  name: string;
  size: number;
  state?: string;
};

export type GithubReleaseRoh = {
  tag_name: string;
  name: string | null;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  body: string | null;
  html_url: string;
  assets: GithubAssetRoh[];
};

export type ToolRelease = {
  /** Versionsnummer ohne führendes „v", z. B. „2.1.0-beta.1". */
  version: string;
  /** ISO-Datum der Veröffentlichung. */
  datum: string;
  beta: boolean;
  /** Releasetext von GitHub (Markdown), falls vorhanden. */
  notizen: string | null;
  /** Release-Seite bei GitHub. Bei privatem Repo nur für Berechtigte sichtbar. */
  seite: string;
  datei: { id: number; name: string; size: number; endung: string | null };
};

export type ToolReleases = {
  stabil: ToolRelease | null;
  beta: ToolRelease | null;
};

/**
 * Macht aus dem, was im CMS steht, die Form „besitzer/name".
 * Angenommen werden auch kopierte Adressen wie
 * „https://github.com/besitzer/name/releases".
 */
export function repoAus(eingabe: string | null | undefined): string | null {
  if (!eingabe) return null;
  const s = eingabe
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^github\.com\//i, "");
  const treffer = s.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(\.git)?(\/.*)?$/);
  if (!treffer) return null;
  return `${treffer[1]}/${treffer[2]}`;
}

export function versionAus(tag: string): string {
  return tag.replace(/^v(?=\d)/i, "");
}

function endungAus(dateiname: string): string | null {
  const punkt = dateiname.lastIndexOf(".");
  return punkt > 0 ? dateiname.slice(punkt + 1).toLowerCase() : null;
}

/**
 * Liegen mehrere Dateien am Release, wird ein Archiv bevorzugt — darin
 * steckt üblicherweise alles. Sonst die erste fertig hochgeladene.
 */
function dateiWaehlen(assets: GithubAssetRoh[]): GithubAssetRoh | null {
  const fertig = assets.filter((a) => !a.state || a.state === "uploaded");
  return fertig.find((a) => /\.zip$/i.test(a.name)) ?? fertig[0] ?? null;
}

export function waehleReleases(liste: GithubReleaseRoh[]): ToolReleases {
  const brauchbar: ToolRelease[] = [];

  for (const r of liste) {
    if (r.draft || !r.published_at) continue;
    const datei = dateiWaehlen(r.assets ?? []);
    if (!datei) continue;
    brauchbar.push({
      version: versionAus(r.tag_name),
      datum: r.published_at,
      beta: r.prerelease,
      notizen: r.body?.trim() || null,
      seite: r.html_url,
      datei: {
        id: datei.id,
        name: datei.name,
        size: datei.size,
        endung: endungAus(datei.name),
      },
    });
  }

  // Neueste zuerst. GitHub liefert schon so, aber nach Erstellung des
  // Tags, nicht nach Veröffentlichung — das kann auseinanderfallen.
  brauchbar.sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));

  const stabil = brauchbar.find((r) => !r.beta) ?? null;
  const juengsteBeta = brauchbar.find((r) => r.beta) ?? null;
  const beta =
    juengsteBeta && (!stabil || juengsteBeta.datum > stabil.datum)
      ? juengsteBeta
      : null;

  return { stabil, beta };
}

/**
 * Was beim Download ausgeliefert wird. Ohne ausdrücklichen Wunsch die
 * stabile Fassung; gibt es nur Betas, die Beta. Wer eine Beta anfordert,
 * die inzwischen von einer stabilen Fassung überholt wurde, bekommt die
 * stabile — sie ist dann die neuere.
 */
export function releaseFuerKanal(
  releases: ToolReleases | null,
  kanal: string | null,
): ToolRelease | null {
  if (!releases) return null;
  if (kanal === "beta") return releases.beta ?? releases.stabil;
  return releases.stabil ?? releases.beta;
}
