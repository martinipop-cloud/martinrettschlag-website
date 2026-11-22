import Link from "next/link";

import {
  DOWNLOAD_GUELTIG_MS,
  istGueltig,
  unterschriebeneAbfrage,
} from "@/lib/newsletter";
import { pfad, type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { LocalizedString } from "@/sanity/lib/types";

type FreiesTool = {
  slug: string;
  name: LocalizedString;
  dateiname: string | null;
  endung: string | null;
} | null;

type SiteSettings = { defaultPaypalUrl: string | null } | null;

/**
 * Bestätigungsseite der Anmeldung — und der Ort, an dem der Download liegt.
 *
 * Hierher führt der Knopf aus der Bestätigungsmail. Dass der Download erst
 * hier erscheint und nicht schon in der Mail steht, ist der Kern der Sache:
 * Stünde er in der Mail, könnte man ihn benutzen, ohne die Anmeldung
 * bestätigt zu haben — die Bestätigung wäre dann eine Formalität ohne
 * Wirkung.
 *
 * Die Adresse trägt eine Unterschrift. Ohne sie zeigt die Seite nur, dass
 * die Anmeldung geklappt hat; der Name eines Tools allein schaltet nichts
 * frei (F-404n).
 */
export async function NewsletterBestaetigtView({
  sprache,
  tool,
  bis,
  sig,
}: {
  sprache: Sprache;
  tool?: string;
  bis?: string;
  sig?: string;
}) {
  const t = texte(sprache);
  const gueltig = istGueltig("bestaetigt", tool ?? null, bis, sig);

  const [toolDaten, einstellungen] = await Promise.all([
    gueltig && tool
      ? client.fetch<FreiesTool>(
          `*[_type == "tool" && slug.current == $slug && vertrieb != "kauf" && defined(downloadFile.asset)][0]{
            "slug": slug.current,
            name,
            "dateiname": downloadFile.asset->originalFilename,
            "endung": downloadFile.asset->extension
          }`,
          { slug: tool },
        )
      : Promise.resolve(null),
    client.fetch<SiteSettings>(siteSettingsQuery),
  ]);

  const abfrage = toolDaten
    ? unterschriebeneAbfrage("download", toolDaten.slug, DOWNLOAD_GUELTIG_MS)
    : "";
  const downloadUrl =
    toolDaten && abfrage ? `/api/download/${toolDaten.slug}?${abfrage}` : null;
  const toolName = toolDaten ? text(toolDaten.name, sprache) : null;

  // Ein Tool war gewünscht, die Unterschrift stimmt aber nicht mehr.
  const abgelaufen = Boolean(tool) && !downloadUrl;

  return (
    <section className="mx-auto max-w-[900px] px-5 pt-20 pb-28 md:px-10 md:pt-32">
      <h1 className="display text-[clamp(3rem,11vw,9rem)]">
        {t.bestaetigtKopf}
        <span className="script">{t.bestaetigtKopfAkzent}</span>
      </h1>

      <p className="mt-10 max-w-2xl text-lg leading-relaxed">
        {t.bestaetigtText}
      </p>

      {downloadUrl && (
        <div className="mt-14 border-t border-line pt-10">
          <h2 className="meta">{t.bestaetigtDownloadKopf}</h2>
          <p className="display mt-3 text-3xl md:text-4xl">{toolName}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={downloadUrl}
              // Suchmaschinen sollen dem Link nicht folgen, sonst zählen
              // deren Roboter als Downloads mit.
              rel="nofollow"
              className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
            >
              {t.downloadStarten}
            </a>
            {toolDaten?.endung && (
              <span className="meta text-muted">.{toolDaten.endung}</span>
            )}
          </div>
        </div>
      )}

      {abgelaufen && (
        <div className="mt-14 border-t border-line pt-10">
          <p className="max-w-xl leading-relaxed text-muted">
            {t.bestaetigtLinkAbgelaufen}
          </p>
        </div>
      )}

      <div className="mt-14 border-t border-line pt-10">
        <p className="max-w-xl leading-relaxed text-muted">{t.mehrToolsText}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          {einstellungen?.defaultPaypalUrl && (
            <a
              href={einstellungen.defaultPaypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
            >
              {t.spendenPayPal}
              <span className="sr-only"> {t.oeffnetNeuerTab}</span>
            </a>
          )}
          <Link
            href={pfad("/software", sprache)}
            className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
          >
            {t.zurueckZuDenTools}
          </Link>
        </div>
      </div>
    </section>
  );
}
