import type { Metadata } from "next";

import { RootDocument } from "@/components/RootDocument";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Martin Rettschlag — Motion Design",
    template: "%s — Martin Rettschlag",
  },
  description:
    "Portfolio of Martin Rettschlag: motion design, animation and art direction.",
};

/**
 * Oberstes Layout der englischen Fassung.
 *
 * Eigenes oberstes Layout, weil im lang-Attribut des HTML-Dokuments „en“
 * stehen muss — daran entscheiden Screenreader die Aussprache und
 * Suchmaschinen die Sprachzuordnung.
 */
export default function EnglischesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument sprache="en">{children}</RootDocument>;
}
