import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What I Like",
  description:
    "Gedanken zu Tools, Techniken und Branche — von Martin Rettschlag.",
};

/**
 * What I Like — Blogübersicht (Kapitel 4.5).
 * Artikelliste folgt in Phase 5.
 */
export default function BlogPage() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">04 — What I Like</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        What I <span className="script">Like</span>
      </h1>

      <p className="mt-10 max-w-2xl text-muted">
        Platzhalter. Hier entsteht die Artikelübersicht mit Titelbild, Datum und
        Anrisstext.
      </p>
    </section>
  );
}
