import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { WorkView } from "@/views/WorkView";

export const metadata: Metadata = {
  title: texte("en").navWork,
  description: texte("en").workBeschreibung,
  alternates: sprachAlternativen("/work"),
};

export const revalidate = 60;

export default async function EnWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  return <WorkView sprache="en" kategorie={kategorie} />;
}
