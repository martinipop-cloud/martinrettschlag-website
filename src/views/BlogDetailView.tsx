import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogBody, lesedauerMinuten } from "@/components/BlogBody";
import { sprachAlternativen } from "@/lib/site";
import { pfad, richText, type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { hatBild, urlFor } from "@/sanity/lib/image";
import { postBySlugQuery, postOrderQuery } from "@/sanity/lib/queries";
import type { PostDetail, ProjectOrderEntry } from "@/sanity/lib/types";

export async function artikelMetadaten(
  slug: string,
  sprache: Sprache,
): Promise<Metadata> {
  const beitrag = await client.fetch<PostDetail | null>(postBySlugQuery, {
    slug,
  });

  if (!beitrag) return { title: texte(sprache).artikelNichtGefunden };

  const titel = text(beitrag.title, sprache);
  const anriss = text(beitrag.excerpt, sprache);

  return {
    title: titel,
    description: anriss,
    alternates: sprachAlternativen(`/blog/${slug}`),
    openGraph: {
      title: titel,
      description: anriss,
      type: "article",
      publishedTime: beitrag.publishedAt,
      images: hatBild(beitrag.coverImage)
        ? [urlFor(beitrag.coverImage).width(1200).height(630).fit("crop").url()]
        : undefined,
    },
  };
}

/** Einzelner Artikel (Kapitel 4.5.2). */
export async function BlogDetailView({
  slug,
  sprache,
}: {
  slug: string;
  sprache: Sprache;
}) {
  const t = texte(sprache);
  const [beitrag, reihenfolge] = await Promise.all([
    client.fetch<PostDetail | null>(postBySlugQuery, { slug }),
    client.fetch<ProjectOrderEntry[]>(postOrderQuery),
  ]);

  if (!beitrag) notFound();

  const titel = text(beitrag.title, sprache);
  const inhalt = richText(beitrag.body, sprache);

  // Vorheriger und nächster Artikel für die Navigation am Seitenende –
  // gleiche Reihenfolge wie in der Übersicht, neueste zuerst.
  const position = reihenfolge.findIndex((e) => e.slug === beitrag.slug);
  const vorheriger = position > 0 ? reihenfolge[position - 1] : null;
  const naechster =
    position >= 0 && position < reihenfolge.length - 1
      ? reihenfolge[position + 1]
      : null;

  const datum = new Date(beitrag.publishedAt).toLocaleDateString(
    t.sprachkennung,
    { day: "2-digit", month: "long", year: "numeric" },
  );

  return (
    <article className="mx-auto max-w-[900px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <Link
        href={pfad("/blog", sprache)}
        className="meta transition-colors hover:text-accent"
      >
        ← {t.zurueckZurUebersicht}
      </Link>

      <p className="meta mt-8">
        {datum} · {lesedauerMinuten(inhalt)} {t.lesezeit}
      </p>

      <h1 className="display mt-4 text-[clamp(2rem,6vw,4.5rem)]">{titel}</h1>

      {hatBild(beitrag.coverImage) && (
        <Image
          src={urlFor(beitrag.coverImage)
            .width(1600)
            .fit("max")
            .auto("format")
            .url()}
          alt={(beitrag.coverImage as { alt?: string }).alt ?? titel}
          width={1600}
          height={1067}
          priority
          sizes="(min-width: 1024px) 900px, 100vw"
          className="mt-10 h-auto w-full ring-1 ring-line"
        />
      )}

      <div className="mt-12 text-lg">
        <BlogBody value={inhalt} sprache={sprache} />
      </div>

      {(vorheriger || naechster) && (
        <nav
          aria-label={t.weitereArtikel}
          className="mt-24 flex flex-wrap items-start justify-between gap-6 border-t border-line pt-8"
        >
          <div>
            {vorheriger && (
              <Link
                href={pfad(`/blog/${vorheriger.slug}`, sprache)}
                className="group block"
              >
                <span className="meta">← {t.vorheriger}</span>
                <span className="display mt-2 block text-xl transition-colors group-hover:text-accent">
                  {text(vorheriger.title, sprache)}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {naechster && (
              <Link
                href={pfad(`/blog/${naechster.slug}`, sprache)}
                className="group block"
              >
                <span className="meta">{t.naechster} →</span>
                <span className="display mt-2 block text-xl transition-colors group-hover:text-accent">
                  {text(naechster.title, sprache)}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
