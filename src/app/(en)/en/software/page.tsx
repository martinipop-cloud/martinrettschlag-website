import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { SoftwareView } from "@/views/SoftwareView";

export const metadata: Metadata = {
  title: texte("en").navSoftware,
  description: texte("en").softwareBeschreibung,
  alternates: sprachAlternativen("/software"),
};

export const revalidate = 60;

export default function EnSoftwarePage() {
  return <SoftwareView sprache="en" />;
}
