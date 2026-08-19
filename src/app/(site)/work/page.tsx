import type { Metadata } from "next";

import { CategoryFilter } from "@/components/CategoryFilter";
import { ProjectCard } from "@/components/ProjectCard";
import { client } from "@/sanity/lib/client";
import { categoriesQuery, projectsQuery } from "@/sanity/lib/queries";
import type { Category, ProjectCardData } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Work",
  description: "Ausgewählte Motion-Design-Projekte von Martin Rettschlag.",
};

// Änderungen im CMS erscheinen spätestens nach einer Minute.
export const revalidate = 60;

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const aktiveKategorie = kategorie ?? null;

  const [projekte, kategorien] = await Promise.all([
    client.fetch<ProjectCardData[]>(projectsQuery, {
      kategorie: aktiveKategorie,
    }),
    client.fetch<Category[]>(categoriesQuery),
  ]);

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">02 — Work</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">Arbeiten</h1>

      <CategoryFilter categories={kategorien} active={aktiveKategorie} />

      {projekte.length === 0 ? (
        <p className="mt-16 text-muted">
          {aktiveKategorie
            ? "In dieser Kategorie gibt es noch keine Projekte."
            : "Es sind noch keine Projekte veröffentlicht."}
        </p>
      ) : (
        /* Raster: 3 Spalten Desktop, 2 Tablet, 1 Smartphone (F-201, F-817). */
        <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projekte.map((projekt) => (
            <li key={projekt._id}>
              <ProjectCard project={projekt} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
