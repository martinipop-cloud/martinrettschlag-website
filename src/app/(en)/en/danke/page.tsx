import type { Metadata } from "next";

import { DankeView } from "@/views/DankeView";

export const metadata: Metadata = {
  title: "Thank you",
  // Die Seite ergibt nur nach einer Spende oder einem Download Sinn und
  // gehört nicht in Suchergebnisse.
  robots: { index: false, follow: true },
};

// Hängt an der Abfrage in der Adresse (?nach=download&…) und darf nicht
// zwischengespeichert werden — sonst bekäme der nächste Besucher den
// Download des vorigen.
export const dynamic = "force-dynamic";

function einzel(wert: string | string[] | undefined): string | undefined {
  return Array.isArray(wert) ? wert[0] : wert;
}

export default async function EnDankePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const abfrage = await searchParams;
  const nachDownload = einzel(abfrage.nach) === "download";
  return (
    <DankeView
      sprache="en"
      download={
        nachDownload
          ? {
              tool: einzel(abfrage.tool),
              bis: einzel(abfrage.bis),
              sig: einzel(abfrage.sig),
              kanal: einzel(abfrage.kanal),
            }
          : undefined
      }
    />
  );
}
