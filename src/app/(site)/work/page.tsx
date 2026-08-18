import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Ausgewählte Motion-Design-Projekte von Martin Rettschlag.",
};

/**
 * Work-Übersicht (Kapitel 4.2).
 * Filter-Buttons und Projektraster werden in Phase 4 an das CMS angebunden.
 */
export default function WorkPage() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">02 — Work</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">Arbeiten</h1>

      <p className="mt-10 max-w-2xl text-muted">
        Platzhalter. Hier entstehen die Filter-Buttons nach Kategorie und das
        Projektraster.
      </p>
    </section>
  );
}
