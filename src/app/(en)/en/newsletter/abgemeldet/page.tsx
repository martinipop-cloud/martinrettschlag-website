import type { Metadata } from "next";

import { texte } from "@/lib/texte";
import { NewsletterAbgemeldetView } from "@/views/NewsletterAbgemeldetView";

export const metadata: Metadata = {
  title: "Unsubscribed",
  description: texte("en").abgemeldetBeschreibung,
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function EnNewsletterAbgemeldetPage() {
  return <NewsletterAbgemeldetView sprache="en" />;
}
