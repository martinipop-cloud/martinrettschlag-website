import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { hatSchreibrechte, writeClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";

type ToolDatei = {
  _id: string;
  name: string;
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
 * Es werden ausschließlich Downloads gezählt – keine IP-Adressen, keine
 * Kennungen, nichts Personenbezogenes (F-409).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const tool = await client.fetch<ToolDatei>(
    `*[_type == "tool" && slug.current == $slug][0]{
      _id, name, "datei": downloadFile.asset->{url, originalFilename}
    }`,
    { slug },
  );

  if (!tool?.datei?.url) {
    return new NextResponse("Dieses Tool gibt es nicht.", { status: 404 });
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

  const ziel = `${tool.datei.url}?dl=${encodeURIComponent(
    tool.datei.originalFilename ?? tool.name,
  )}`;

  return NextResponse.redirect(ziel, 302);
}
