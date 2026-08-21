import Image from "next/image";

import { DownloadButton } from "@/components/DownloadButton";
import { RichText } from "@/components/RichText";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { getYouTubeId } from "@/lib/youtube";
import { urlFor } from "@/sanity/lib/image";
import type { ToolData } from "@/sanity/lib/types";

/** Wandelt Bytes in eine lesbare Angabe um. */
function dateigroesse(bytes: number | null): string | null {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
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
}: {
  tool: ToolData;
  standardPaypalLink: string | null;
}) {
  const spendenLink = tool.paypalUrl ?? standardPaypalLink;
  const groesse = dateigroesse(tool.datei?.size ?? null);
  const videoId = getYouTubeId(tool.demoVideo);
  const screenshots = tool.screenshots ?? [];

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
          <h2 className="display text-3xl md:text-4xl">{tool.name}</h2>
          <p className="meta mt-2">{tool.compatibility}</p>
        </div>
        {tool.datei?.extension && (
          <p className="meta">
            .{tool.datei.extension}
            {groesse && ` · ${groesse}`}
            {typeof tool.downloads === "number" &&
              tool.downloads > 0 &&
              ` · ${tool.downloads.toLocaleString("de-DE")} Downloads`}
          </p>
        )}
      </div>

      <p className="mt-6 max-w-2xl leading-relaxed">{tool.shortDescription}</p>

      {/* Download frei zugänglich, Spende freiwillig daneben (F-404, F-405) */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        {downloadUrl && (
          <DownloadButton
            downloadUrl={downloadUrl}
            toolName={tool.name}
            paypalUrl={spendenLink}
          />
        )}

        {spendenLink && (
          <a
            href={spendenLink}
            target="_blank"
            rel="noopener noreferrer"
            className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
          >
            Spenden über PayPal
            <span className="sr-only"> (öffnet in neuem Tab)</span>
          </a>
        )}
      </div>

      <p className="meta mt-4 max-w-lg leading-relaxed">
        Wenn dir das Tool hilft, freue ich mich über eine Spende.
      </p>

      {videoId && (
        <div className="mt-10 max-w-3xl">
          <YouTubeEmbed
            videoId={videoId}
            title={`${tool.name} — Demo`}
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
                  alt={bild.alt ?? `${tool.name} — Ansicht ${index + 1}`}
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
            <span className="group-open:hidden">▸ Installationsanleitung anzeigen</span>
            <span className="hidden group-open:inline">▾ Installationsanleitung ausblenden</span>
          </summary>
          <div className="mt-6 max-w-2xl">
            <RichText value={tool.installation} />
          </div>
        </details>
      )}
    </article>
  );
}
