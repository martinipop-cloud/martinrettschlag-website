import Link from "next/link";

import { DownloadStarten } from "@/components/DownloadStarten";
import { RichText } from "@/components/RichText";
import { istGueltig } from "@/lib/newsletter";
import { pfad, richText, type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { LocalizedRichText, LocalizedString } from "@/sanity/lib/types";

type SiteSettings = {
  thankYouText: LocalizedRichText;
  defaultPaypalUrl: string | null;
} | null;

type ToolKurz = {
  name: LocalizedString;
  paypalUrl: string | null;
} | null;

/** Die unterschriebene Download-Anforderung aus der Adresse. */
export type DownloadAnforderung = {
  tool?: string;
  bis?: string;
  sig?: string;
  kanal?: string;
};

/**
 * Dankesseite — in zwei Fassungen.
 *
 * 1. Nach einer Spende: PayPal leitet nach abgeschlossener Zahlung hierher
 *    weiter. Diese Adresse ist frei aufrufbar und damit kein
 *    Zahlungsnachweis — sie schaltet deshalb bewusst nichts frei.
 *
 * 2. Nach dem Download (\`?nach=download\`): Der Knopf „Download starten“ auf
 *    der Bestätigungsseite führt hierher. Die Seite startet den Download
 *    selbst und bittet um eine freiwillige Spende. Gestartet wird nur mit
 *    gültiger Unterschrift — dieselbe, die /api/download verlangt. Ohne sie
 *    bleibt es beim Dank, und die Anmeldung bleibt die einzige Tür zur
 *    Datei (F-404n).
 */
export async function DankeView({
  sprache,
  download,
}: {
  sprache: Sprache;
  download?: DownloadAnforderung;
}) {
  const t = texte(sprache);

  const gueltig =
    download !== undefined &&
    istGueltig("download", download.tool ?? null, download.bis, download.sig);

  const [einstellungen, tool] = await Promise.all([
    client.fetch<SiteSettings>(siteSettingsQuery),
    gueltig && download?.tool
      ? client.fetch<ToolKurz>(
          `*[_type == "tool" && slug.current == $slug && vertrieb != "kauf"][0]{ name, paypalUrl }`,
          { slug: download.tool },
        )
      : Promise.resolve(null),
  ]);

  if (download === undefined) {
    return <NachSpende sprache={sprache} einstellungen={einstellungen} />;
  }

  const downloadUrl =
    gueltig && download.tool
      ? `/api/download/${encodeURIComponent(download.tool)}?bis=${encodeURIComponent(
          download.bis ?? "",
        )}&sig=${encodeURIComponent(download.sig ?? "")}${
          download.kanal === "beta" ? "&kanal=beta" : ""
        }`
      : null;
  const toolName = tool ? text(tool.name, sprache) : "";
  const spendenLink = tool?.paypalUrl ?? einstellungen?.defaultPaypalUrl ?? null;

  return (
    <section className="mx-auto max-w-[900px] px-5 pt-20 pb-28 md:px-10 md:pt-32">
      {downloadUrl && <DownloadStarten url={downloadUrl} />}

      <h1 className="display text-[clamp(3rem,11vw,9rem)]">
        {t.dankeKopf}
        <span className="script">{t.dankeKopfAkzent}</span>
      </h1>

      <div className="mt-12 max-w-2xl text-lg">
        {downloadUrl ? (
          <>
            <p className="leading-relaxed">
              {t.downloadLaeuftVor}
              {toolName && <strong>{toolName}</strong>}
              {t.downloadLaeuftNach}
            </p>
            <p className="meta mt-4 text-muted">
              {t.downloadStartetNicht}{" "}
              <a href={downloadUrl} rel="nofollow" className="underline hover:text-accent">
                {t.downloadNochmal}
              </a>
            </p>
          </>
        ) : (
          <p className="leading-relaxed text-muted">{t.bestaetigtLinkAbgelaufen}</p>
        )}
      </div>

      {/* Der eigentliche Grund für diese Seite: die Bitte um eine Spende,
          freiwillig und ohne Kopplung an den Download (F-405). */}
      {spendenLink && (
        <div className="mt-14 border border-accent p-8 md:p-10">
          <h2 className="display text-2xl md:text-3xl">{t.spendenAufrufKopf}</h2>
          <p className="mt-4 max-w-xl leading-relaxed">{t.spendenAufrufText}</p>
          <a
            href={spendenLink}
            target="_blank"
            rel="noopener noreferrer"
            className="meta mt-8 inline-block rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
          >
            {t.spendenPayPal}
            <span className="sr-only"> {t.oeffnetNeuerTab}</span>
          </a>
        </div>
      )}

      <div className="mt-14 flex flex-wrap gap-4">
        <Link
          href={pfad("/software", sprache)}
          className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
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

/** Fassung 1: unverändert die bisherige Seite nach einer Spende. */
function NachSpende({
  sprache,
  einstellungen,
}: {
  sprache: Sprache;
  einstellungen: SiteSettings;
}) {
  const t = texte(sprache);
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
