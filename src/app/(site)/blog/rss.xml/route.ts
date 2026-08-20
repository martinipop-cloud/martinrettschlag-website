import { siteUrl } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { postsQuery } from "@/sanity/lib/queries";
import type { PostCardData } from "@/sanity/lib/types";

export const revalidate = 3600;

/** Ersetzt Zeichen, die in XML eine Sonderbedeutung haben. */
function xml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS-Feed der Blogartikel.
 *
 * Zweck ist zweierlei: Leser können den Blog abonnieren, und
 * Automatisierungsdienste (Buffer, Make, Zapier und ähnliche) können daraus
 * Beiträge für soziale Netzwerke erzeugen. Bewusst kein fest eingebauter
 * Anschluss an einzelne Plattformen — so gibt es keine Zugangsdaten im Code,
 * die ablaufen können, und die Kanäle bleiben frei wählbar.
 */
export async function GET() {
  const artikel = await client.fetch<PostCardData[]>(postsQuery);

  const eintraege = artikel
    .map((beitrag) => {
      const adresse = `${siteUrl}/blog/${beitrag.slug}`;
      const bild = beitrag.coverImage
        ? urlFor(beitrag.coverImage).width(1200).fit("max").auto("format").url()
        : null;

      return [
        "    <item>",
        `      <title>${xml(beitrag.title)}</title>`,
        `      <link>${xml(adresse)}</link>`,
        `      <guid isPermaLink="true">${xml(adresse)}</guid>`,
        `      <pubDate>${new Date(beitrag.publishedAt).toUTCString()}</pubDate>`,
        `      <description>${xml(beitrag.excerpt)}</description>`,
        bild ? `      <enclosure url="${xml(bild)}" type="image/jpeg" />` : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Martin Rettschlag — What I Like</title>",
    `    <link>${siteUrl}/blog</link>`,
    "    <description>Gedanken zu Tools, Techniken und Branche.</description>",
    "    <language>de</language>",
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
    eintraege,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
