import Link from "next/link";

import { HomeStatement } from "@/components/HomeStatement";
import { ProjectCard } from "@/components/ProjectCard";
import { client } from "@/sanity/lib/client";
import { featuredProjectsQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import type { ProjectCardData } from "@/sanity/lib/types";
import type { PortableTextBlock } from "@portabletext/react";

export const revalidate = 60;

type SiteSettings = {
  homeStatement: PortableTextBlock[] | null;
  location: string | null;
} | null;

/**
 * Startseite (Kapitel 4.1): reduzierter Text-Einstieg, darunter die im CMS
 * ausgewählten Projekte.
 */
export default async function HomePage() {
  const [einstellungen, projekte] = await Promise.all([
    client.fetch<SiteSettings>(siteSettingsQuery),
    client.fetch<ProjectCardData[]>(featuredProjectsQuery),
  ]);

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="meta leading-relaxed">
            Motion Design & Animation
            {einstellungen?.location && (
              <>
                <br />
                {einstellungen.location}
              </>
            )}
          </p>
          <p className="meta">Portfolio 2026</p>
        </div>

        <h1 className="display mt-20 text-[clamp(3rem,13vw,12rem)] md:mt-32">
          <HomeStatement value={einstellungen?.homeStatement ?? null} />
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="meta">01 — Ausgewählte Arbeiten</h2>
          <Link
            href="/work"
            className="meta transition-colors hover:text-accent"
          >
            Alle Projekte →
          </Link>
        </div>

        {projekte.length > 0 && (
          /* Raster: 3 Spalten Desktop, 2 Tablet, 1 Smartphone (F-201, F-817). */
          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projekte.map((projekt) => (
              <li key={projekt._id}>
                <ProjectCard project={projekt} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
