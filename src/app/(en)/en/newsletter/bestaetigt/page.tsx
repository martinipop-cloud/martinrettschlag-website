import type { Metadata } from "next";

import { texte } from "@/lib/texte";
import { NewsletterBestaetigtView } from "@/views/NewsletterBestaetigtView";

export const metadata: Metadata = {
  title: "Sign-up confirmed",
  description: texte("en").bestaetigtBeschreibung,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function einzel(wert: string | string[] | undefined): string | undefined {
  return Array.isArray(wert) ? wert[0] : wert;
}

export default async function EnNewsletterBestaetigtPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const abfrage = await searchParams;
  return (
    <NewsletterBestaetigtView
      sprache="en"
      tool={einzel(abfrage.tool)}
      bis={einzel(abfrage.bis)}
      sig={einzel(abfrage.sig)}
    />
  );
}
