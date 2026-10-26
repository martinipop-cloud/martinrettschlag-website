import type { Metadata } from "next";

import { NotFoundContent } from "@/components/NotFoundContent";
import { RootDocument } from "@/components/RootDocument";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Seite nicht gefunden — Martin Rettschlag",
  robots: { index: false, follow: true },
};

/**
 * Greift bei Adressen, die es auf der ganzen Website nicht gibt.
 *
 * Diese Seite liegt außerhalb der beiden Sprachbereiche und bringt deshalb
 * das HTML-Grundgerüst selbst mit — es gibt hier kein übergeordnetes Layout,
 * von dem sie es erben könnte. Angezeigt wird Deutsch: Bei einer Adresse, die
 * es nicht gibt, lässt sich die gewünschte Sprache nicht ablesen.
 */
export default function NotFound() {
  return (
    <RootDocument sprache="de">
      <SiteChrome sprache="de">
        <NotFoundContent />
      </SiteChrome>
    </RootDocument>
  );
}
