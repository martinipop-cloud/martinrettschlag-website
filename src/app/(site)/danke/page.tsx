import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/react";
import Link from "next/link";

import { RichText } from "@/components/RichText";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Danke",
  // Die Seite ergibt nur nach einer Spende Sinn und gehört nicht in
  // Suchergebnisse.
  robots: { index: false, follow: true },
};

export const revalidate = 60;

type SiteSettings = {
  thankYouText: PortableTextBlock[] | null;
} | null;

/**
 * Dankesseite nach einer Spende.
 *
 * PayPal leitet nach abgeschlossener Zahlung hierher weiter. Wichtig: Diese
 * Adresse ist frei aufrufbar und damit kein Zahlungsnachweis — sie schaltet
 * deshalb bewusst nichts frei. Die Downloads sind ohnehin frei zugänglich
 * (F-404, F-409).
 */
export default async function DankePage() {
  const einstellungen = await client.fetch<SiteSettings>(siteSettingsQuery);

  return (
    <section className="mx-auto max-w-[900px] px-5 pt-20 pb-28 md:px-10 md:pt-32">
      <h1 className="display text-[clamp(3rem,11vw,9rem)]">
        Danke<span className="script">schön</span>
      </h1>

      <div className="mt-12 max-w-2xl text-lg">
        {einstellungen?.thankYouText ? (
          <RichText value={einstellungen.thankYouText} />
        ) : (
          <>
            <p className="mb-5 leading-relaxed">
              Deine Spende ist angekommen — das freut mich sehr und hilft
              dabei, die Tools weiterzuentwickeln und neue zu bauen.
            </p>
            <p className="leading-relaxed text-muted">
              Du musst nichts weiter tun. Alle Downloads waren und bleiben frei
              zugänglich.
            </p>
          </>
        )}
      </div>

      <div className="mt-14 flex flex-wrap gap-4">
        <Link
          href="/software"
          className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
        >
          Zurück zu den Tools
        </Link>
        <Link
          href="/work"
          className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
        >
          Arbeiten ansehen
        </Link>
      </div>
    </section>
  );
}
