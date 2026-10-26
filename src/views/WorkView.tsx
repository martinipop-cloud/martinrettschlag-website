import { CategoryFilter } from "@/components/CategoryFilter";
import { ProjectCard } from "@/components/ProjectCard";
import type { Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { categoriesQuery, projectsQuery } from "@/sanity/lib/queries";
import type { Category, ProjectCardData } from "@/sanity/lib/types";

/** Projektübersicht mit Filter nach Kategorie (Kapitel 4.3). */
export async function WorkView({
  sprache,
  kategorie,
}: {
  sprache: Sprache;
  kategorie?: string;
}) {
  const t = texte(sprache);
  const kategorien = await client.fetch<Category[]>(categoriesQuery);

  // Kein „Alle“-Filter: ohne (gültige) Auswahl startet die Seite mit der
  // ersten Kategorie laut Sortierung im CMS – aktuell Motion Design.
  const aktiveKategorie =
    kategorien.find((k) => k.slug === kategorie)?.slug ??
    kategorien[0]?.slug ??
    null;

  const projekte = await client.fetch<ProjectCardData[]>(projectsQuery, {
    kategorie: aktiveKategorie,
  });

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">02 — {t.navWork}</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        {t.workTitel}
      </h1>

      <CategoryFilter
        categories={kategorien}
        active={aktiveKategorie}
        sprache={sprache}
      />

      {projekte.length === 0 ? (
        <p className="mt-16 text-muted">
          {aktiveKategorie ? t.keineProjekteKategorie : t.keineProjekte}
        </p>
      ) : (
        /* Raster: 3 Spalten Desktop, 2 Tablet, 1 Smartphone (F-201, F-817). */
        <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projekte.map((projekt) => (
            <li key={projekt._id}>
              <ProjectCard project={projekt} sprache={sprache} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
