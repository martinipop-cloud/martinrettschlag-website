import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
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
export function ProjectCard({ project }: { project: ProjectCardData }) {
  const still = project.previewStill
    ? urlFor(project.previewStill).width(900).fit("max").auto("format").url()
    : null;
  const preview = project.preview;
  const istVideo = preview?.mimeType?.startsWith("video/") ?? false;
  const alt =
    (project.previewStill as { alt?: string } | null)?.alt ??
    `Vorschau: ${project.title}`;

  const bildKlassen =
    "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]";

  return (
    <article>
      <Link href={`/work/${project.slug}`} className="group block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-raised ring-1 ring-line">
          {preview && istVideo ? (
            <video
              className={bildKlassen}
              // Standbild überbrückt die Zeit, bis das Video bereit ist.
              poster={still ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={alt}
            >
              <source src={preview.url} type={preview.mimeType ?? undefined} />
            </video>
          ) : preview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={preview.url}
              alt={alt}
              loading="lazy"
              decoding="async"
              className={bildKlassen}
            />
          ) : still ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={still}
              alt={alt}
              loading="lazy"
              decoding="async"
              className={bildKlassen}
            />
          ) : null}
        </div>

        <h3 className="display mt-4 text-2xl transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="meta mt-1">
          {[project.client, project.category?.name].filter(Boolean).join(" — ")}
        </p>
      </Link>
    </article>
  );
}
