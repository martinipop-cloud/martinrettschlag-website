import type { Metadata } from "next";

import { texte } from "@/lib/texte";
import { NewsletterBestaetigtView } from "@/views/NewsletterBestaetigtView";

export const metadata: Metadata = {
  title: "Anmeldung bestätigt",
  description: texte("de").bestaetigtBeschreibung,
  // Die Seite ergibt nur mit Unterschrift in der Adresse Sinn und gehört
  // nicht in Suchergebnisse.
  robots: { index: false, follow: false },
};

// Die Seite hängt an der Abfrage in der Adresse und darf nicht
// zwischengespeichert werden — sonst sähe der nächste Besucher den
// Download des vorigen.
export const dynamic = "force-dynamic";

function einzel(wert: string | string[] | undefined): string | undefined {
  return Array.isArray(wert) ? wert[0] : wert;
}

export default async function NewsletterBestaetigtPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const abfrage = await searchParams;
  return (
    <NewsletterBestaetigtView
      sprache="de"
      tool={einzel(abfrage.tool)}
      bis={einzel(abfrage.bis)}
      sig={einzel(abfrage.sig)}
    />
  );
}
