import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { ContactView } from "@/views/ContactView";

export const metadata: Metadata = {
  title: texte("de").navContact,
  description: texte("de").kontaktBeschreibung,
  alternates: sprachAlternativen("/contact"),
};

export const revalidate = 60;

export default function ContactPage() {
  return <ContactView sprache="de" />;
}
