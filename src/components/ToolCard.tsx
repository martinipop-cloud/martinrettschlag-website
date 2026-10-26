import Image from "next/image";
import Link from "next/link";

import { DownloadButton } from "@/components/DownloadButton";
import { RichText } from "@/components/RichText";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { getYouTubeId } from "@/lib/youtube";
import { pfad, richText, type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { hatBild, urlFor } from "@/sanity/lib/image";
import type { ToolData } from "@/sanity/lib/types";

/**
 * Wandelt Bytes in eine lesbare Angabe um.
 * Das Dezimaltrennzeichen richtet sich nach der Sprache: im Deutschen
 * „1,5 MB“, im Englischen „1.5 MB“.
 */
function dateigroesse(bytes: number | null, sprache: Sprache): string | null {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  const megabyte = (bytes / (1024 * 1024)).toFixed(1);
  return `${sprache === "de" ? megabyte.replace(".", ",") : megabyte} MB`;
}

/**
 * Karte für ein einzelnes Tool (F-403 bis F-409).
 *
 * Der Download ist bedingungslos frei – keine Abfrage von Daten, keine
 * Kopplung an die Spende. Die Spende ist ein freiwilliger Hinweis daneben.
 */
export function ToolCard({
  tool,
  standardPaypalLink,
  sprache,
}: {
  tool: ToolData;
  standardPaypalLink: string | null;
  sprache: Sprache;
}) {
  const t = texte(sprache);
  const name = text(tool.name, sprache);
  const istKauf = tool.vertrieb === "kauf";
  const spendenLink = tool.paypalUrl ?? standardPaypalLink;
  const groesse = dateigroesse(tool.datei?.size ?? null, sprache);
  const preis =
    typeof tool.preis === "number"
      ? tool.preis.toLocaleString(t.sprachkennung, {
          style: "currency",
          currency: "EUR",
        })
      : null;
  const videoId = getYouTubeId(tool.demoVideo);
  // Bildfelder ohne hochgeladene Datei aussortieren, statt abzustürzen.
  const screenshots = (tool.screenshots ?? []).filter(hatBild);

  // Der Download läuft über die eigene Adresse, damit er mitgezählt werden
  // kann (F-410). Von dort geht es weiter zur Datei.
  const downloadUrl = tool.datei ? `/api/download/${tool.slug}` : null;

  return (
    <article
      id={tool.slug}
      className="border border-line bg-paper-raised p-6 md:p-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="display text-3xl md:text-4xl">{name}</h2>
          <p className="meta mt-2">{text(tool.compatibility, sprache)}</p>
        </div>
        {istKauf
          ? preis && (
              <p className="display text-2xl whitespace-nowrap">{preis}</p>
            )
          : tool.datei?.extension && (
              <p className="meta">
                .{tool.datei.extension}
                {groesse && ` · ${groesse}`}
                {typeof tool.downloads === "number" &&
                  tool.downloads > 0 &&
                  ` · ${tool.downloads.toLocaleString(t.sprachkennung)} ${t.downloads}`}
              </p>
            )}
      </div>

      <p className="mt-6 max-w-2xl leading-relaxed">{text(tool.shortDescription, sprache)}</p>

      {istKauf ? (
        /* Kostenpflichtig: Kauf läuft über die Verkaufsplattform. Dort werden
           Zahlung, Rechnung, Umsatzsteuer und Auslieferung abgewickelt.

           Ohne Kauf-Link bleibt der Preis trotzdem stehen. Das ist kein
           Schoenheitsfehler, sondern Absicht: Paddle gibt den Verkauf erst
           frei, wenn Produkt und Preis öffentlich auf der Seite stehen — der
           Link entsteht also erst nach der Freigabe. */
        <>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {tool.kaufUrl ? (
              <a
                href={tool.kaufUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
              >
                {t.kaufen} {preis && `— ${preis}`}
                <span className="sr-only"> {t.oeffnetNeuerTab}</span>
              </a>
            ) : (
              <>
                <span className="meta rounded-full border border-line px-7 py-3 text-muted">
                  {t.verkaufStartet}
                </span>
                <Link
                  href={pfad("/contact", sprache)}
                  className="meta transition-colors hover:text-accent"
                >
                  {t.bescheidBekommen}
                </Link>
              </>
            )}
          </div>

          <p className="meta mt-4 max-w-lg leading-relaxed">
            {preis && t.preisInklMwst}
            {t.preisHinweis}{" "}
            {/* AGB und Rückgaberichtlinie liegen nur auf Deutsch vor; die
                Beschriftung wechselt, das Ziel bleibt die deutsche Fassung. */}
            <Link href="/agb" className="underline hover:text-accent">
              {t.agb}
            </Link>{" "}
            {t.preisHinweisUnd}{" "}
            <Link href="/rueckgabe" className="underline hover:text-accent">
              {t.rueckgaberichtlinie}
            </Link>
            .
          </p>
        </>
      ) : (
        /* Kostenlos: Download frei zugänglich, Spende freiwillig daneben
           (F-404, F-405) */
        <>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {downloadUrl && (
              <DownloadButton
                downloadUrl={downloadUrl}
                toolName={name}
                paypalUrl={spendenLink}
                sprache={sprache}
              />
            )}

            {spendenLink && (
              <a
                href={spendenLink}
                target="_blank"
                rel="noopener noreferrer"
                className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
              >
                {t.spendenPayPal}
                <span className="sr-only"> {t.oeffnetNeuerTab}</span>
              </a>
            )}
          </div>

          <p className="meta mt-4 max-w-lg leading-relaxed">
            {t.spendenHinweis}
          </p>
        </>
      )}

      {videoId && (
        <div className="mt-10 max-w-3xl">
          <YouTubeEmbed
            videoId={videoId}
            title={`${name} — ${t.demo}`}
            sprache={sprache}
            posterUrl={
              screenshots[0]
                ? urlFor(screenshots[0]).width(1200).fit("max").auto("format").url()
                : null
            }
          />
        </div>
      )}

      {screenshots.length > 0 && (
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {screenshots.map((bild, index) => (
            <li key={index}>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper ring-1 ring-line">
                <Image
                  src={urlFor(bild).width(600).height(450).fit("crop").auto("format").url()}
                  alt={bild.alt ?? `${name} — ${t.ansicht} ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Anleitung zum Aufklappen (F-406). <details> braucht kein JavaScript
          und ist mit Tastatur und Screenreader bedienbar. */}
      {tool.installation && (
        <details className="group mt-10 border-t border-line pt-6">
          <summary className="meta cursor-pointer list-none transition-colors hover:text-accent">
            <span className="group-open:hidden">▸ {t.anleitungAnzeigen}</span>
            <span className="hidden group-open:inline">
              ▾ {t.anleitungAusblenden}
            </span>
          </summary>
          <div className="mt-6 max-w-2xl">
            <RichText value={richText(tool.installation, sprache)} />
          </div>
        </details>
      )}
    </article>
  );
}
