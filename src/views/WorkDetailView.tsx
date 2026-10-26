import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Gallery, type GalleryItem } from "@/components/Gallery";
import { RichText } from "@/components/RichText";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { sprachAlternativen } from "@/lib/site";
import { pfad, richText, type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { getYouTubeId } from "@/lib/youtube";
import { client } from "@/sanity/lib/client";
import { hatBild, urlFor } from "@/sanity/lib/image";
import { projectBySlugQuery, projectOrderQuery } from "@/sanity/lib/queries";
import type {
  ProjectDetail,
  ProjectOrderEntry,
  RoleRef,
  SanityImage,
} from "@/sanity/lib/types";

/**
 * Rollennamen in der aktuellen Sprache. Fehlt eine Übersetzung,
 * greift die deutsche Fassung.
 */
function rollenNamen(
  rollen: RoleRef[] | null | undefined,
  sprache: Sprache,
): string[] {
  return (rollen ?? [])
    .map((rolle) => text(rolle.name, sprache))
    .filter((name): name is string => Boolean(name));
}

/** Ein Eintrag der Projektgalerie – entweder ein Bild oder ein Clip. */
type GallerySource = SanityImage & {
  _type: string;
  dimensions?: { width: number; height: number } | null;
  videoUrl?: string | null;
  mimeType?: string | null;
};

export async function projektMetadaten(
  slug: string,
  sprache: Sprache,
): Promise<Metadata> {
  const projekt = await client.fetch<ProjectDetail | null>(projectBySlugQuery, {
    slug,
  });

  if (!projekt) return { title: texte(sprache).projektNichtGefunden };

  const beschreibung = [
    projekt.client,
    rollenNamen(projekt.roles, sprache).join(", "),
  ]
    .filter(Boolean)
    .join(" — ");

  const titel = text(projekt.title, sprache);

  return {
    title: titel,
    description: beschreibung || undefined,
    // Verweist auf die jeweils andere Sprachfassung derselben Seite (N-13).
    alternates: sprachAlternativen(`/work/${slug}`),
    openGraph: {
      title: titel,
      description: beschreibung || undefined,
      images: hatBild(projekt.previewStill)
        ? [urlFor(projekt.previewStill).width(1200).height(630).fit("crop").url()]
        : undefined,
    },
  };
}

/** Projekt-Detailseite (Kapitel 4.3.2). */
export async function WorkDetailView({
  slug,
  sprache,
}: {
  slug: string;
  sprache: Sprache;
}) {
  const t = texte(sprache);

  const [projekt, reihenfolge] = await Promise.all([
    client.fetch<ProjectDetail | null>(projectBySlugQuery, { slug }),
    client.fetch<ProjectOrderEntry[]>(projectOrderQuery),
  ]);

  if (!projekt) notFound();

  const titel = text(projekt.title, sprache);
  const rollen = rollenNamen(projekt.roles, sprache);
  const videoId = getYouTubeId(projekt.youtubeUrl);
  const poster = hatBild(projekt.previewStill)
    ? urlFor(projekt.previewStill).width(1600).fit("max").auto("format").url()
    : null;

  const galerie: GalleryItem[] = ((projekt.gallery ?? []) as GallerySource[])
    .map((eintrag): GalleryItem | null => {
      if (eintrag._type === "galleryVideo") {
        if (!eintrag.videoUrl) return null;
        return {
          art: "clip",
          url: eintrag.videoUrl,
          mimeType: eintrag.mimeType ?? "video/mp4",
          alt: eintrag.alt ?? "",
          caption: eintrag.caption,
        };
      }

      // Bildfelder ohne hochgeladene Datei überspringen, statt abzustürzen.
      if (!hatBild(eintrag)) return null;

      return {
        art: "bild",
        // Kleine Fassung fürs Raster, große erst beim Anklicken – spart Ladezeit.
        thumbUrl: urlFor(eintrag)
          .width(600)
          .height(450)
          .fit("crop")
          .auto("format")
          .url(),
        fullUrl: urlFor(eintrag).width(2000).fit("max").auto("format").url(),
        alt: eintrag.alt ?? "",
        caption: eintrag.caption,
        width: eintrag.dimensions?.width ?? 1600,
        height: eintrag.dimensions?.height ?? 1200,
      };
    })
    .filter((eintrag): eintrag is GalleryItem => eintrag !== null)
    // Ohne eigenen Alternativtext einen aus Titel und Position erzeugen,
    // z. B. „Projekt – Screenshot 2 von 6“.
    .map((eintrag, index, alle) => ({
      ...eintrag,
      alt:
        eintrag.alt.trim() ||
        `${titel} – ${eintrag.art === "clip" ? t.clip : t.screenshot} ${
          index + 1
        } ${t.von} ${alle.length}`,
    }));

  // Vorheriges und nächstes Projekt für die Navigation am Seitenende (F-307).
  const position = reihenfolge.findIndex((e) => e.slug === projekt.slug);
  const vorheriges = position > 0 ? reihenfolge[position - 1] : null;
  const naechstes =
    position >= 0 && position < reihenfolge.length - 1
      ? reihenfolge[position + 1]
      : null;

  return (
    <article className="mx-auto max-w-[1200px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <Link
        href={pfad("/work", sprache)}
        className="meta transition-colors hover:text-accent"
      >
        ← {t.zurueckZurUebersicht}
      </Link>

      <h1 className="display mt-8 text-[clamp(2.25rem,7vw,5.5rem)]">{titel}</h1>

      <div className="mt-12">
        {projekt.medium === "loop" && projekt.loop ? (
          /* Eigener Loop: läuft sofort, stumm und in Schleife. Kein Klick
             nötig, weil die Datei vom eigenen Speicher kommt und keine
             Verbindung zu Dritten entsteht. */
          <video
            className="w-full bg-paper-raised ring-1 ring-line"
            poster={poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${titel} — ${t.videoSchleife}`}
          >
            <source
              src={projekt.loop.url}
              type={projekt.loop.mimeType ?? "video/mp4"}
            />
          </video>
        ) : videoId ? (
          <YouTubeEmbed
            videoId={videoId}
            title={titel}
            posterUrl={poster}
            sprache={sprache}
          />
        ) : (
          <p className="meta">{t.keinVideo}</p>
        )}
      </div>

      {/* Kunde und Rolle direkt unter dem Video (F-303) */}
      <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="meta">{t.kunde}</dt>
          <dd className="mt-2 text-lg">{projekt.client}</dd>
        </div>
        {projekt.agency && (
          <div>
            <dt className="meta">{t.agentur}</dt>
            <dd className="mt-2 text-lg">{projekt.agency}</dd>
          </div>
        )}
        {rollen.length > 0 && (
          <div>
            <dt className="meta">{t.rolle}</dt>
            <dd className="mt-2 text-lg">{rollen.join(", ")}</dd>
          </div>
        )}
        {projekt.categories.length > 0 && (
          <div>
            <dt className="meta">
              {projekt.categories.length > 1 ? t.kategorien : t.kategorie}
            </dt>
            <dd className="mt-2 text-lg">
              {projekt.categories.map((kategorie, index) => (
                <span key={kategorie.slug}>
                  {index > 0 && ", "}
                  <Link
                    href={pfad(`/work?kategorie=${kategorie.slug}`, sprache)}
                    className="transition-colors hover:text-accent"
                  >
                    {text(kategorie.name, sprache)}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {richText(projekt.description, sprache) && (
        <div className="mt-12 max-w-2xl text-lg">
          <RichText value={richText(projekt.description, sprache)} />
        </div>
      )}

      <Gallery items={galerie} sprache={sprache} />

      {(vorheriges || naechstes) && (
        <nav
          aria-label={t.weitereProjekte}
          className="mt-24 flex flex-wrap items-start justify-between gap-6 border-t border-line pt-8"
        >
          <div>
            {vorheriges && (
              <Link
                href={pfad(`/work/${vorheriges.slug}`, sprache)}
                className="group block"
              >
                <span className="meta">← {t.vorheriges}</span>
                <span className="display mt-2 block text-xl transition-colors group-hover:text-accent">
                  {text(vorheriges.title, sprache)}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {naechstes && (
              <Link
                href={pfad(`/work/${naechstes.slug}`, sprache)}
                className="group block"
              >
                <span className="meta">{t.naechstes} →</span>
                <span className="display mt-2 block text-xl transition-colors group-hover:text-accent">
                  {text(naechstes.title, sprache)}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
