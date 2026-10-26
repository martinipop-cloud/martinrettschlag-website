import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { SoftwareView } from "@/views/SoftwareView";

export const metadata: Metadata = {
  title: texte("de").navSoftware,
  description: texte("de").softwareBeschreibung,
  alternates: sprachAlternativen("/software"),
};

export const revalidate = 60;

export default function SoftwarePage() {
  return <SoftwareView sprache="de" />;
}
