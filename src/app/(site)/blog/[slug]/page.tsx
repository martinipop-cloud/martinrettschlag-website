import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogBody, lesedauerMinuten } from "@/components/BlogBody";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/lib/queries";
import type { PostDetail } from "@/sanity/lib/types";

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
      images: beitrag.coverImage
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
  const beitrag = await client.fetch<PostDetail | null>(postBySlugQuery, {
    slug,
  });

  if (!beitrag) notFound();

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

      {beitrag.coverImage && (
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
    </article>
  );
}
