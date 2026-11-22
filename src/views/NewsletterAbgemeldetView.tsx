import Link from "next/link";

import { pfad, type Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";

/**
 * Abmeldeseite (F-905).
 *
 * Hierher leitet Brevo nach einem Klick auf den Abmeldelink in einer E-Mail
 * weiter. Die Abmeldung selbst ist zu diesem Zeitpunkt schon vollzogen —
 * diese Seite bestätigt sie nur. Deshalb steht hier auch keine Rückfrage:
 * Ein Abmeldelink, der noch einmal nachfragt, ist kein Abmeldelink.
 */
export function NewsletterAbgemeldetView({ sprache }: { sprache: Sprache }) {
  const t = texte(sprache);

  return (
    <section className="mx-auto max-w-[900px] px-5 pt-20 pb-28 md:px-10 md:pt-32">
      <h1 className="display text-[clamp(3rem,11vw,9rem)]">
        {t.abgemeldetKopf}
        <span className="script">{t.abgemeldetKopfAkzent}</span>
      </h1>

      <p className="mt-10 max-w-2xl text-lg leading-relaxed">
        {t.abgemeldetText}
      </p>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        {t.abgemeldetZusatz}
      </p>

      <div className="mt-14 flex flex-wrap gap-4">
        <Link
          href={pfad("/software", sprache)}
          className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
        >
          {t.zurueckZuDenTools}
        </Link>
        <Link
          href={pfad("/work", sprache)}
          className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
        >
          {t.arbeitenAnsehen}
        </Link>
      </div>
    </section>
  );
}
