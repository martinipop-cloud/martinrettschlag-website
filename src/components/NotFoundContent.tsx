import Link from "next/link";

/**
 * Inhalt der 404-Seite (F-806).
 * Wird an zwei Stellen verwendet: für nicht gefundene Adressen der ganzen
 * Website und für nicht gefundene Projekte oder Artikel.
 */
export function NotFoundContent() {
  return (
    <section className="mx-auto max-w-[900px] px-5 pt-20 pb-28 md:px-10 md:pt-32">
      <p className="meta">Fehler 404</p>

      <h1 className="display mt-6 text-[clamp(3rem,12vw,10rem)]">
        Nichts <span className="script">hier</span>
      </h1>

      <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
        Diese Seite gibt es nicht — vielleicht wurde sie verschoben, oder in der
        Adresse hat sich ein Tippfehler eingeschlichen.
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/work"
          className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
        >
          Zu den Arbeiten
        </Link>
        <Link
          href="/"
          className="meta rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
        >
          Zur Startseite
        </Link>
      </div>
    </section>
  );
}
