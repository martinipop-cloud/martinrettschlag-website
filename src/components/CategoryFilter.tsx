import Link from "next/link";

import type { Category } from "@/sanity/lib/types";

/**
 * Filter-Buttons nach Kategorie (F-202 bis F-204).
 *
 * Die aktive Kategorie steht in der Adresse (/work?kategorie=…), damit sie
 * teilbar ist. Die Umschaltung läuft über Next.js-Navigation, also ohne
 * vollständiges Neuladen der Seite.
 */
export function CategoryFilter({
  categories,
  active,
}: {
  categories: Category[];
  active: string | null;
}) {
  if (categories.length === 0) return null;

  const entries = [
    { slug: null, name: "Alle" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    <nav aria-label="Projekte nach Kategorie filtern" className="mt-8">
      <ul className="flex flex-wrap gap-2">
        {entries.map((entry) => {
          const isActive = entry.slug === active;
          return (
            <li key={entry.slug ?? "alle"}>
              <Link
                href={entry.slug ? `/work?kategorie=${entry.slug}` : "/work"}
                aria-current={isActive ? "true" : undefined}
                className={`meta inline-block rounded-full border px-4 py-2 transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-accent-contrast"
                    : "border-line hover:border-accent hover:text-accent"
                }`}
              >
                {entry.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
