import type { Metadata } from "next";

import { DankeView } from "@/views/DankeView";

export const metadata: Metadata = {
  title: "Thank you",
  // Die Seite ergibt nur nach einer Spende Sinn und gehört nicht in
  // Suchergebnisse.
  robots: { index: false, follow: true },
};

export const revalidate = 60;

export default function EnDankePage() {
  return <DankeView sprache="en" />;
}
