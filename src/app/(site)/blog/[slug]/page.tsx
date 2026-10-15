import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogBody, lesedauerMinuten } from "@/components/BlogBody";
import { client } from "@/sanity/lib/client";
import { hatBild, urlFor } from "@/sanity/lib/image";
import {
  postBySlugQuery,
  postOrderQuery,
  postSlugsQuery,
} from "@/sanity/lib/queries";
import type { PostDetail, ProjectOrderEntry } from "@/sanity/lib/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(postSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const beitrag = await client.fetch<PostDetail | null>(postBySlugQuery, {
    slug,
  });

  if (!beitrag) return { title: "Artikel nicht gefunden" };

  return {
    title: beitrag.title,
    description: beitrag.excerpt,
    openGraph: {
      title: beitrag.title,
      description: beitrag.excerpt,
      type: "article",
      publishedTime: beitrag.publishedAt,
      images: hatBild(beitrag.coverImage)
        ? [urlFor(beitrag.coverImage).width(1200).height(630).fit("crop").url()]
        : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [beitrag, reihenfolge] = await Promise.all([
    client.fetch<PostDetail | null>(postBySlugQuery, { slug }),
    client.fetch<ProjectOrderEntry[]>(postOrderQuery),
  ]);

  if (!beitrag) notFound();

  // Vorheriger und nächster Artikel für die Navigation am Seitenende –
  // gleiche Reihenfolge wie in der Übersicht, neueste zuerst.
  const position = reihenfolge.findIndex((e) => e.slug === beitrag.slug);
  const vorheriger = position > 0 ? reihenfolge[position - 1] : null;
  const naechster =
    position >= 0 && position < reihenfolge.length - 1
      ? reihenfolge[position + 1]
      : null;

  const datum = new Date(beitrag.publishedAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-[900px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <Link href="/blog" className="meta transition-colors hover:text-accent">
        ← Zurück zur Übersicht
      </Link>

      <p className="meta mt-8">
        {datum} · {lesedauerMinuten(beitrag.body)} Min. Lesezeit
      </p>

      <h1 className="display mt-4 text-[clamp(2rem,6vw,4.5rem)]">
        {beitrag.title}
      </h1>

      {hatBild(beitrag.coverImage) && (
        <Image
          src={urlFor(beitrag.coverImage)
            .width(1600)
            .fit("max")
            .auto("format")
            .url()}
          alt={(beitrag.coverImage as { alt?: string }).alt ?? beitrag.title}
          width={1600}
          height={1067}
          priority
          sizes="(min-width: 1024px) 900px, 100vw"
          className="mt-10 h-auto w-full ring-1 ring-line"
        />
      )}

      <div className="mt-12 text-lg">
        <BlogBody value={beitrag.body} />
      </div>

      {(vorheriger || naechster) && (
        <nav
          aria-label="Weitere Artikel"
          className="mt-24 flex flex-wrap items-start justify-between gap-6 border-t border-line pt-8"
        >
          <div>
            {vorheriger && (
              <Link href={`/blog/${vorheriger.slug}`} className="group block">
                <span className="meta">← Vorheriger</span>
                <span className="display mt-2 block text-xl transition-colors group-hover:text-accent">
                  {vorheriger.title}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {naechster && (
              <Link href={`/blog/${naechster.slug}`} className="group block">
                <span className="meta">Nächster →</span>
                <span className="display mt-2 block text-xl transition-colors group-hover:text-accent">
                  {naechster.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
