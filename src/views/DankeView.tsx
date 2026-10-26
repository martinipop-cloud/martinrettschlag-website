import Link from "next/link";

import { RichText } from "@/components/RichText";
import { pfad, richText, type Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { LocalizedRichText } from "@/sanity/lib/types";

type SiteSettings = {
  thankYouText: LocalizedRichText;
} | null;

/**
 * Dankesseite nach einer Spende.
 *
 * PayPal leitet nach abgeschlossener Zahlung hierher weiter. Wichtig: Diese
 * Adresse ist frei aufrufbar und damit kein Zahlungsnachweis — sie schaltet
 * deshalb bewusst nichts frei. Die Downloads sind ohnehin frei zugänglich
 * (F-404, F-409).
 */
export async function DankeView({ sprache }: { sprache: Sprache }) {
  const t = texte(sprache);
  const einstellungen = await client.fetch<SiteSettings>(siteSettingsQuery);
  const dankestext = richText(einstellungen?.thankYouText ?? null, sprache);

  return (
    <section className="mx-auto max-w-[900px] px-5 pt-20 pb-28 md:px-10 md:pt-32">
      <h1 className="display text-[clamp(3rem,11vw,9rem)]">
        {t.dankeKopf}
        <span className="script">{t.dankeKopfAkzent}</span>
      </h1>

      <div className="mt-12 max-w-2xl text-lg">
        {dankestext ? (
          <RichText value={dankestext} />
        ) : (
          <>
            <p className="mb-5 leading-relaxed">{t.dankeSeiteAbsatz1}</p>
            <p className="leading-relaxed text-muted">{t.dankeSeiteAbsatz2}</p>
          </>
        )}
      </div>

      <div className="mt-14 flex flex-wrap gap-4">
        <Link
          href={pfad("/software", sprache)}
          className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
        >
          {t.zurueckZuDenTools}
        </Link>
        <Link
          href={pfad("/work", sprache)}
          className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
        >
          {t.arbeitenAnsehen}
        </Link>
      </div>
    </section>
  );
}
