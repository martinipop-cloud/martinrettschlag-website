import { NextResponse } from "next/server";

import { downloadAdresse, ladeReleases } from "@/lib/github";
import { releaseFuerKanal } from "@/lib/githubReleases";
import { istGueltig } from "@/lib/newsletter";
import { client } from "@/sanity/lib/client";
import { hatSchreibrechte, writeClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";

type ToolDatei = {
  _id: string;
  name: string;
  githubRepo: string | null;
  datei: { url: string; originalFilename: string | null } | null;
} | null;

/**
 * Erhöht den Zähler (F-410).
 *
 * Sanity führt Entwurf und veröffentlichte Fassung getrennt. Beide werden
 * hochgezählt, damit der Stand nicht zurückspringt, sobald ein Tool
 * bearbeitet und erneut veröffentlicht wird.
 */
async function zaehlerErhoehen(id: string) {
  await Promise.all(
    [id, `drafts.${id}`].map(async (dokumentId) => {
      try {
        await writeClient
          .patch(dokumentId)
          .setIfMissing({ downloads: 0 })
          .inc({ downloads: 1 })
          .commit({ visibility: "async" });
      } catch {
        // Eine Entwurfsfassung existiert meistens nicht – das ist kein Fehler.
      }
    }),
  );
}

/**
 * Leitet zum Download weiter und zählt ihn anonym mit.
 *
 * Diese Adresse ist nicht frei aufrufbar: Sie braucht eine Unterschrift, die
 * nur die Bestätigungsseite ausstellt (F-404n). Ohne diese Hürde wäre die
 * Anmeldung wirkungslos — die Namen der Tools stehen ja öffentlich auf der
 * Software-Seite, man könnte die Adresse also einfach zusammensetzen.
 *
 * Liegt das Tool auf GitHub, kommt die Datei aus dem neuesten Release:
 * standardmäßig die stabile Fassung, mit `?kanal=beta` die Beta. Der Kanal
 * steht bewusst nicht in der Unterschrift — beide Fassungen sind gleich
 * geschützt, und so braucht die Bestätigungsseite nur eine.
 * Ist GitHub nicht erreichbar, dient die Datei aus Sanity als Rückfall.
 *
 * Gezählt werden ausschließlich Downloads – keine IP-Adressen, keine
 * Kennungen, nichts Personenbezogenes (F-409).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const abfrage = new URL(request.url).searchParams;

  if (
    !istGueltig(
      "download",
      slug,
      abfrage.get("bis"),
      abfrage.get("sig") ?? undefined,
    )
  ) {
    return new NextResponse(
      "Dieser Download-Link ist abgelaufen oder unvollständig. Fordere ihn auf der Software-Seite neu an.",
      { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  // Nur kostenlose Tools. Ein verkauftes Tool darf ein GitHub-Repository
  // für die Versionsanzeige haben — seine Datei darf hier nie herauskommen
  // (F-414).
  const tool = await client.fetch<ToolDatei>(
    `*[_type == "tool" && slug.current == $slug && vertrieb != "kauf"][0]{
      _id, name, githubRepo, "datei": downloadFile.asset->{url, originalFilename}
    }`,
    { slug },
  );

  if (!tool || (!tool.githubRepo && !tool.datei?.url)) {
    return new NextResponse("Dieses Tool gibt es nicht.", { status: 404 });
  }

  let ziel: string | null = null;

  if (tool.githubRepo) {
    const release = releaseFuerKanal(
      await ladeReleases(tool.githubRepo, { frisch: true }),
      abfrage.get("kanal"),
    );
    if (release) ziel = await downloadAdresse(tool.githubRepo, release.datei.id);
    if (!ziel) {
      console.error(
        `Download ${slug}: kein Release von GitHub erhalten` +
          (tool.datei?.url ? ", weiche auf die Datei in Sanity aus." : "."),
      );
    }
  }

  if (!ziel && tool.datei?.url) {
    ziel = `${tool.datei.url}?dl=${encodeURIComponent(
      tool.datei.originalFilename ?? tool.name,
    )}`;
  }

  if (!ziel) {
    return new NextResponse(
      "Der Download ist gerade nicht erreichbar. Bitte versuche es in ein paar Minuten noch einmal — dein Link bleibt so lange gültig.",
      { status: 502, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  // Der Zähler darf den Download niemals aufhalten: Schlägt er fehl,
  // wird trotzdem weitergeleitet.
  if (hatSchreibrechte()) {
    try {
      await zaehlerErhoehen(tool._id);
    } catch (fehler) {
      console.error("Download-Zähler konnte nicht erhöht werden:", fehler);
    }
  }

  return NextResponse.redirect(ziel, 302);
}
