import Link from "next/link";

/**
 * Startseite (Kapitel 4.1): reduzierter Text-Einstieg, darunter eine
 * kuratierte Projektauswahl.
 *
 * Die Texte und Projekte sind derzeit Platzhalter. Sobald das Sanity-Projekt
 * verbunden ist, kommen sie aus dem CMS (F-101 bis F-103).
 */
export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="meta leading-relaxed">
            Motion Design & Animation
            <br />
            Platzhalter — Standort
          </p>
          <p className="meta">Portfolio 2026</p>
        </div>

        <h1 className="display mt-20 text-[clamp(3rem,13vw,12rem)] md:mt-32">
          Motion
          <br />
          <span className="script">with</span> Impact
        </h1>

        <p className="mt-16 max-w-2xl text-lg leading-relaxed text-muted md:mt-24">
          Platzhalter für das Startseiten-Statement. Dieser Text wird später in
          den Website-Einstellungen im CMS gepflegt und beschreibt in zwei bis
          drei Sätzen, wer du bist und was du machst.
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="meta">01 — Ausgewählte Arbeiten</h2>
          <Link href="/work" className="meta transition-colors hover:text-accent">
            Alle Projekte →
          </Link>
        </div>

        {/* Raster: 3 Spalten Desktop, 2 Tablet, 1 Smartphone (F-201, F-817).
            Läuft ausschließlich nach unten weiter – kein seitwärts Scrollen. */}
        <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <li key={n}>
              <article>
                <div className="aspect-[4/3] w-full bg-paper-raised ring-1 ring-line" />
                <h3 className="display mt-4 text-2xl">Projekt {n}</h3>
                <p className="meta mt-1">Kunde — Platzhalter</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
