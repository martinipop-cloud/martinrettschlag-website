import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Gallery, type GalleryImage } from "@/components/Gallery";
import { RichText } from "@/components/RichText";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { getYouTubeId } from "@/lib/youtube";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  projectBySlugQuery,
  projectOrderQuery,
  projectSlugsQuery,
} from "@/sanity/lib/queries";
import type {
  ProjectDetail,
  ProjectOrderEntry,
  SanityImage,
} from "@/sanity/lib/types";

export const revalidate = 60;

type GallerySource = SanityImage & {
  dimensions?: { width: number; height: number } | null;
};

/** Erzeugt die Projektseiten beim Bauen vor, damit sie sofort ausgeliefert werden. */
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(projectSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projekt = await client.fetch<ProjectDetail | null>(projectBySlugQuery, {
    slug,
  });

  if (!projekt) return { title: "Projekt nicht gefunden" };

  const beschreibung = [projekt.client, projekt.roles?.join(", ")]
    .filter(Boolean)
    .join(" — ");

  return {
    title: projekt.title,
    description: beschreibung || undefined,
    openGraph: {
      title: projekt.title,
      description: beschreibung || undefined,
      images: projekt.previewStill
        ? [urlFor(projekt.previewStill).width(1200).height(630).fit("crop").url()]
        : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [projekt, reihenfolge] = await Promise.all([
    client.fetch<ProjectDetail | null>(projectBySlugQuery, { slug }),
    client.fetch<ProjectOrderEntry[]>(projectOrderQuery),
  ]);

  if (!projekt) notFound();

  const videoId = getYouTubeId(projekt.youtubeUrl);
  const poster = projekt.previewStill
    ? urlFor(projekt.previewStill).width(1600).fit("max").auto("format").url()
    : null;

  const galerie: GalleryImage[] = (
    (projekt.gallery ?? []) as GallerySource[]
  ).map((bild) => ({
    url: urlFor(bild).width(1600).fit("max").auto("format").url(),
    alt: bild.alt ?? "",
    caption: bild.caption,
    width: bild.dimensions?.width ?? 1600,
    height: bild.dimensions?.height ?? 1200,
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
      <Link href="/work" className="meta transition-colors hover:text-accent">
        ← Zurück zur Übersicht
      </Link>

      <h1 className="display mt-8 text-[clamp(2.25rem,7vw,5.5rem)]">
        {projekt.title}
      </h1>

      <div className="mt-12">
        {videoId ? (
          <YouTubeEmbed
            videoId={videoId}
            title={projekt.title}
            posterUrl={poster}
          />
        ) : (
          projekt.youtubeUrl && (
            <p className="meta">
              Die hinterlegte Video-Adresse konnte nicht gelesen werden.
            </p>
          )
        )}
      </div>

      {/* Kunde und Rolle direkt unter dem Video (F-303) */}
      <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
        <div>
          <dt className="meta">Kunde</dt>
          <dd className="mt-2 text-lg">{projekt.client}</dd>
        </div>
        {projekt.roles && projekt.roles.length > 0 && (
          <div>
            <dt className="meta">Rolle</dt>
            <dd className="mt-2 text-lg">{projekt.roles.join(", ")}</dd>
          </div>
        )}
        {projekt.category && (
          <div>
            <dt className="meta">Kategorie</dt>
            <dd className="mt-2 text-lg">
              <Link
                href={`/work?kategorie=${projekt.category.slug}`}
                className="transition-colors hover:text-accent"
              >
                {projekt.category.name}
              </Link>
            </dd>
          </div>
        )}
      </dl>

      {projekt.description && (
        <div className="mt-12 max-w-2xl text-lg">
          <RichText value={projekt.description} />
        </div>
      )}

      <Gallery images={galerie} />

      {(vorheriges || naechstes) && (
        <nav
          aria-label="Weitere Projekte"
          className="mt-24 flex flex-wrap items-start justify-between gap-6 border-t border-line pt-8"
        >
          <div>
            {vorheriges && (
              <Link href={`/work/${vorheriges.slug}`} className="group block">
                <span className="meta">← Vorheriges</span>
                <span className="display mt-2 block text-xl transition-colors group-hover:text-accent">
                  {vorheriges.title}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {naechstes && (
              <Link href={`/work/${naechstes.slug}`} className="group block">
                <span className="meta">Nächstes →</span>
                <span className="display mt-2 block text-xl transition-colors group-hover:text-accent">
                  {naechstes.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
