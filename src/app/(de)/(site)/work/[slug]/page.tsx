import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { projectSlugsQuery } from "@/sanity/lib/queries";
import { projektMetadaten, WorkDetailView } from "@/views/WorkDetailView";

export const revalidate = 60;

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
  return projektMetadaten(slug, "de");
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <WorkDetailView slug={slug} sprache="de" />;
}
