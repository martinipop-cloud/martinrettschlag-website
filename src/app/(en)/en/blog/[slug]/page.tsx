import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { postSlugsQuery } from "@/sanity/lib/queries";
import { artikelMetadaten, BlogDetailView } from "@/views/BlogDetailView";

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
  return artikelMetadaten(slug, "en");
}

export default async function EnBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogDetailView slug={slug} sprache="en" />;
}
