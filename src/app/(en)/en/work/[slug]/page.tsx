import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { projectSlugsQuery } from "@/sanity/lib/queries";
import { projektMetadaten, WorkDetailView } from "@/views/WorkDetailView";

export const revalidate = 60;

/**
 * Dieselben Kennungen wie in der deutschen Fassung: Die Adresse eines
 * Projekts bleibt in beiden Sprachen gleich, nur mit /en davor. Damit führt
 * der Sprachumschalter immer auf dasselbe Projekt.
 */
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
  return projektMetadaten(slug, "en");
}

export default async function EnProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <WorkDetailView slug={slug} sprache="en" />;
}
