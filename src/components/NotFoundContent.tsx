import Link from "next/link";

import { pfad, STANDARDSPRACHE, type Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";

/**
 * Inhalt der 404-Seite (F-806).
 * Wird an zwei Stellen verwendet: für nicht gefundene Adressen der ganzen
 * Website und für nicht gefundene Projekte oder Artikel.
 *
 * Bei einer Adresse, die es gar nicht gibt, lässt sich die Sprache des
 * Besuchers nicht aus dem Pfad ablesen — dort gilt Deutsch.
 */
export function NotFoundContent({
  sprache = STANDARDSPRACHE,
}: {
  sprache?: Sprache;
}) {
  const t = texte(sprache);

  return (
    <section className="mx-auto max-w-[900px] px-5 pt-20 pb-28 md:px-10 md:pt-32">
      <p className="meta">{t.fehler404}</p>

      <h1 className="display mt-6 text-[clamp(3rem,12vw,10rem)]">
        {t.nichts}
        <span className="script">{t.nichtsAkzent}</span>
      </h1>

      <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
        {t.nichtGefundenText}
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href={pfad("/work", sprache)}
          className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
        >
          {t.zuDenArbeiten}
        </Link>
        <Link
          href={pfad("/", sprache)}
          className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
        >
          {t.zurStartseite}
        </Link>
      </div>
    </section>
  );
}
