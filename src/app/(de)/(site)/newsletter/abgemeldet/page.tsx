import type { Metadata } from "next";

import { texte } from "@/lib/texte";
import { NewsletterAbgemeldetView } from "@/views/NewsletterAbgemeldetView";

export const metadata: Metadata = {
  title: "Abgemeldet",
  description: texte("de").abgemeldetBeschreibung,
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function NewsletterAbgemeldetPage() {
  return <NewsletterAbgemeldetView sprache="de" />;
}
