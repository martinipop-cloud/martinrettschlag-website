import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Anfragen und Kontakt zu Martin Rettschlag.",
};

/**
 * Kontaktseite (Kapitel 4.6).
 * Formular, Spam-Schutz und Speicherung im CMS folgen in Phase 5.
 */
export default function ContactPage() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">05 — Contact</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">Kontakt</h1>

      <div className="mt-12 max-w-2xl">
        <a
          href="mailto:hello@martinrettschlag.de"
          className="display text-[clamp(1.5rem,5vw,3rem)] text-accent underline-offset-8 hover:underline"
        >
          hello@martinrettschlag.de
        </a>
        <p className="mt-10 text-muted">
          Platzhalter. Hier entstehen das Kontaktformular, die Angabe zu Standort
          und Arbeitsweise sowie die Social-Links.
        </p>
      </div>
    </section>
  );
}
