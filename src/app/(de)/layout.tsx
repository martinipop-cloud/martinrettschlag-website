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
    "Portfolio von Martin Rettschlag: Motion Design, Animation und Art Direction.",
};

/**
 * Oberstes Layout der deutschen Fassung.
 *
 * Deutsch ist die Grundsprache und liegt deshalb direkt an der Wurzel:
 * martinrettschlag.de/work bleibt martinrettschlag.de/work. Alle bereits
 * geteilten und von Suchmaschinen erfassten Adressen bleiben damit gültig.
 */
export default function DeutschesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument sprache="de">{children}</RootDocument>;
}
