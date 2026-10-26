import Link from "next/link";

import { pfad, type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import type { Category } from "@/sanity/lib/types";

/**
 * Filter-Buttons nach Kategorie (F-202 bis F-204).
 *
 * Die aktive Kategorie steht in der Adresse (/work?kategorie=…), damit sie
 * teilbar ist. Die Umschaltung läuft über Next.js-Navigation, also ohne
 * vollständiges Neuladen der Seite. Einen „Alle“-Filter gibt es bewusst
 * nicht; ohne Auswahl ist die erste Kategorie aktiv.
 */
export function CategoryFilter({
  categories,
  active,
  sprache,
}: {
  categories: Category[];
  active: string | null;
  sprache: Sprache;
}) {
  if (categories.length === 0) return null;

  return (
    <nav aria-label={texte(sprache).nachKategorieFiltern} className="mt-8">
      <ul className="flex flex-wrap gap-2">
        {categories.map((entry) => {
          const isActive = entry.slug === active;
          return (
            <li key={entry.slug}>
              <Link
                href={pfad(`/work?kategorie=${entry.slug}`, sprache)}
                aria-current={isActive ? "true" : undefined}
                className={`meta inline-block rounded-full border px-4 py-2 transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-accent-contrast"
                    : "border-line hover:border-accent hover:text-accent"
                }`}
              >
                {text(entry.name, sprache)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
