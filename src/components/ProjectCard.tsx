import Link from "next/link";

import { ProjectPreview } from "@/components/ProjectPreview";
import { pfad, type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { hatBild, urlFor } from "@/sanity/lib/image";
import type { ProjectCardData } from "@/sanity/lib/types";

/**
 * Projektkachel für Startseite und Work-Übersicht (F-104, F-205 bis F-208).
 *
 * Die Vorschau läuft dauerhaft in Schleife — bewusst unabhängig von der
 * Systemeinstellung „Bewegung reduzieren“. Entscheidung des Auftraggebers
 * vom 19.08.2026: In einem Motion-Design-Portfolio ist die Bewegung der
 * Inhalt selbst und soll allen Besuchern gezeigt werden (siehe A-05 im
 * Lastenheft).
 *
 * Videos sind das vorgesehene Format. GIFs werden weiterhin dargestellt,
 * solange noch welche in der Datenbank liegen.
 */
export function ProjectCard({
  project,
  sprache,
}: {
  project: ProjectCardData;
  sprache: Sprache;
}) {
  const titel = text(project.title, sprache);
  const still = hatBild(project.previewStill)
    ? urlFor(project.previewStill).width(900).fit("max").auto("format").url()
    : null;
  const preview = project.preview;
  const istVideo = preview?.mimeType?.startsWith("video/") ?? false;
  const alt =
    (project.previewStill as { alt?: string } | null)?.alt?.trim() ||
    `${texte(sprache).vorschau}: ${titel}`;

  // Rollen in der aktuellen Sprache; fehlt die Übersetzung, greift Deutsch.
  const rollen = (project.roles ?? [])
    .map((rolle) => text(rolle.name, sprache))
    .filter((name): name is string => Boolean(name));

  return (
    <article>
      <Link href={pfad(`/work/${project.slug}`, sprache)} className="group block">
        <ProjectPreview
          videoUrl={preview && istVideo ? preview.url : null}
          mimeType={preview?.mimeType ?? null}
          bildUrl={preview && !istVideo ? preview.url : null}
          stillUrl={still}
          alt={alt}
        />

        <h3 className="display mt-4 text-2xl transition-colors group-hover:text-accent">
          {titel}
        </h3>
        {rollen.length > 0 && <p className="meta mt-1">{rollen.join(", ")}</p>}
        <p className="meta mt-1">
          {[project.client, project.agency].filter(Boolean).join(" – ")}
        </p>
      </Link>
    </article>
  );
}
