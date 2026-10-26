import type { Metadata } from "next";

import { NotFoundContent } from "@/components/NotFoundContent";
import { texte } from "@/lib/texte";

export const metadata: Metadata = {
  title: texte("en").seiteNichtGefunden,
  robots: { index: false, follow: true },
};

/**
 * Greift, wenn unter /en ein Projekt oder Artikel nicht existiert.
 * Header und Footer kommen vom umgebenden Layout.
 */
export default function EnNotFound() {
  return <NotFoundContent sprache="en" />;
}
