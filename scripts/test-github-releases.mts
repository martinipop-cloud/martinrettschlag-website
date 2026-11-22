// Prüft die Auswahl der GitHub-Releases (src/lib/githubReleases.ts).
// Aufruf:  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/test-github-releases.mts
// (Laeuft direkt mit Node 24, ohne Build. Von der Typpruefung der Website
// ausgenommen, siehe tsconfig.json: Node braucht den Import mit .ts-Endung.)
import {
  type GithubReleaseRoh,
  releaseFuerKanal,
  repoAus,
  versionAus,
  waehleReleases,
} from "../src/lib/githubReleases.ts";

let fehler = 0;
function gleich(ist: unknown, soll: unknown, was: string) {
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if (!ok) fehler++;
  console.log(`${ok ? "  OK    " : "  FALSCH"}  ${was}${ok ? "" : `   ist: ${JSON.stringify(ist)}  soll: ${JSON.stringify(soll)}`}`);
}

let id = 1;
function rel(tag: string, datum: string, extra: Partial<GithubReleaseRoh> = {}): GithubReleaseRoh {
  return {
    tag_name: tag, name: tag, draft: false, prerelease: false,
    published_at: datum, body: "", html_url: `https://github.com/x/y/releases/tag/${tag}`,
    assets: [{ id: id++, name: "Tool.jsx", size: 1234, state: "uploaded" }],
    ...extra,
  };
}
const v = (r: { stabil: { version: string } | null; beta: { version: string } | null }) =>
  [r.stabil?.version ?? null, r.beta?.version ?? null];

console.log("\n=== Repository-Angabe ===");
gleich(repoAus("martinipop-cloud/deep-duplicate-comp"), "martinipop-cloud/deep-duplicate-comp", "besitzer/name");
gleich(repoAus("https://github.com/a/b/releases"), "a/b", "kopierte Adresse mit /releases");
gleich(repoAus("https://github.com/a/b.git"), "a/b", "Adresse mit .git");
gleich(repoAus("  github.com/a/b  "), "a/b", "ohne https, mit Leerzeichen");
gleich(repoAus("nur-ein-name"), null, "ohne Schrägstrich ungültig");
gleich(repoAus(""), null, "leer");
gleich(repoAus("a/b/../../etc"), "a/b", "Pfadreste werden abgeschnitten");

console.log("\n=== Versionsnummer ===");
gleich(versionAus("v2.0.0"), "2.0.0", "führendes v entfernt");
gleich(versionAus("2.1.0-beta.1"), "2.1.0-beta.1", "ohne v unverändert");
gleich(versionAus("version-2"), "version-2", "v nur vor einer Ziffer");

console.log("\n=== Auswahl ===");
gleich(v(waehleReleases([])), [null, null], "keine Releases");
gleich(v(waehleReleases([rel("v1.0.0", "2026-01-01T00:00:00Z")])), ["1.0.0", null], "nur stabil");
gleich(v(waehleReleases([rel("v2.0.0-beta.1", "2026-02-01T00:00:00Z", { prerelease: true })])), [null, "2.0.0-beta.1"], "nur Beta");
gleich(
  v(waehleReleases([
    rel("v2.0.0-beta.1", "2026-03-01T00:00:00Z", { prerelease: true }),
    rel("v1.0.0", "2026-01-01T00:00:00Z"),
  ])),
  ["1.0.0", "2.0.0-beta.1"],
  "stabil + neuere Beta",
);
gleich(
  v(waehleReleases([
    rel("v2.0.0", "2026-04-01T00:00:00Z"),
    rel("v2.0.0-beta.1", "2026-03-01T00:00:00Z", { prerelease: true }),
  ])),
  ["2.0.0", null],
  "Beta von der stabilen überholt: keine Beta mehr",
);
gleich(
  v(waehleReleases([
    rel("v1.0.0", "2026-01-01T00:00:00Z"),
    rel("v1.1.0", "2026-02-01T00:00:00Z"),
  ])),
  ["1.1.0", null],
  "sortiert nach Veröffentlichung, nicht nach Listenplatz",
);
gleich(
  v(waehleReleases([
    rel("v3.0.0", "2026-05-01T00:00:00Z", { draft: true }),
    rel("v2.0.0", "2026-04-01T00:00:00Z", { assets: [] }),
    rel("v1.0.0", "2026-01-01T00:00:00Z"),
  ])),
  ["1.0.0", null],
  "Entwurf und Release ohne Datei übersprungen",
);
gleich(
  v(waehleReleases([
    rel("v2.0.0", "2026-04-01T00:00:00Z", { assets: [{ id: 99, name: "x.jsx", size: 1, state: "open" }] }),
    rel("v1.0.0", "2026-01-01T00:00:00Z"),
  ])),
  ["1.0.0", null],
  "halb hochgeladene Datei zählt nicht",
);
{
  const r = waehleReleases([
    rel("v1.0.0", "2026-01-01T00:00:00Z", {
      assets: [
        { id: 10, name: "Readme.md", size: 5, state: "uploaded" },
        { id: 11, name: "Tool_v1.ZIP", size: 50, state: "uploaded" },
      ],
    }),
  ]);
  gleich([r.stabil?.datei.id, r.stabil?.datei.endung], [11, "zip"], "Archiv wird bevorzugt, Endung klein");
}

console.log("\n=== Kanal beim Download ===");
const beide = waehleReleases([
  rel("v2.0.0-beta.1", "2026-03-01T00:00:00Z", { prerelease: true }),
  rel("v1.0.0", "2026-01-01T00:00:00Z"),
]);
const nurBeta = waehleReleases([rel("v2.0.0-beta.1", "2026-03-01T00:00:00Z", { prerelease: true })]);
const nurStabil = waehleReleases([rel("v1.0.0", "2026-01-01T00:00:00Z")]);
gleich(releaseFuerKanal(beide, null)?.version, "1.0.0", "ohne Kanal: stabil");
gleich(releaseFuerKanal(beide, "beta")?.version, "2.0.0-beta.1", "kanal=beta: Beta");
gleich(releaseFuerKanal(nurBeta, null)?.version, "2.0.0-beta.1", "nur Beta vorhanden: Beta auch ohne Kanal");
gleich(releaseFuerKanal(nurStabil, "beta")?.version, "1.0.0", "Beta angefordert, aber überholt: stabil");
gleich(releaseFuerKanal(beide, "irgendwas")?.version, "1.0.0", "unbekannter Kanal: stabil");
gleich(releaseFuerKanal(null, "beta"), null, "GitHub nicht erreichbar: nichts");

console.log(fehler ? `\n${fehler} FALSCH` : "\nalles OK");
process.exit(fehler ? 1 : 0);
