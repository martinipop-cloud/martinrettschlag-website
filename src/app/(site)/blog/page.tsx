import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { postsQuery } from "@/sanity/lib/queries";
import type { PostCardData } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "What I Like",
  description:
    "Gedanken zu Tools, Techniken und Branche — von Martin Rettschlag.",
};

export const revalidate = 60;

function datumFormatieren(wert: string) {
  return new Date(wert).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Artikelübersicht „What I Like“ (F-501, F-502).
 * Neueste Artikel zuerst, mit Titelbild, Datum und Anrisstext.
 */
export default async function BlogPage() {
  const artikel = await client.fetch<PostCardData[]>(postsQuery);

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">04 — What I Like</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        What I <span className="script">Like</span>
      </h1>

      {artikel.length === 0 ? (
        <p className="mt-16 text-muted">
          Hier entstehen demnächst Artikel zu Tools, Techniken und Branche.
        </p>
      ) : (
        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {artikel.map((beitrag) => (
            <li key={beitrag._id}>
              <article>
                <Link href={`/blog/${beitrag.slug}`} className="group block">
                  {beitrag.coverImage && (
                    <div className="relative aspect-[3/2] w-full overflow-hidden bg-paper-raised ring-1 ring-line">
                      <Image
                        src={urlFor(beitrag.coverImage)
                          .width(900)
                          .height(600)
                          .fit("crop")
                          .auto("format")
                          .url()}
                        alt={
                          (beitrag.coverImage as { alt?: string }).alt ??
                          beitrag.title
                        }
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  <p className="meta mt-4">
                    {datumFormatieren(beitrag.publishedAt)}
                  </p>
                  <h2 className="display mt-2 text-2xl transition-colors group-hover:text-accent">
                    {beitrag.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted">
                    {beitrag.excerpt}
                  </p>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
