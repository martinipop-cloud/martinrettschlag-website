import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software",
  description:
    "Kostenlose Plugins und Scripts für Motion Designer — Download frei, Spende freiwillig.",
};

/**
 * Software / Scripts (Kapitel 4.4).
 * Karten-Liste mit freiem Download und PayPal-Spenden-Button, Phase 5.
 */
export default function SoftwarePage() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">03 — Software</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        Tools & <span className="script">Scripts</span>
      </h1>

      <p className="mt-10 max-w-2xl text-muted">
        Platzhalter. Hier entsteht die Liste der Tools mit Kompatibilitäts&shy;angabe,
        Installationsanleitung, freiem Download und Spenden-Button.
      </p>
    </section>
  );
}
