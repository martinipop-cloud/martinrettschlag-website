import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { WorkView } from "@/views/WorkView";

export const metadata: Metadata = {
  title: texte("de").navWork,
  description: texte("de").workBeschreibung,
  alternates: sprachAlternativen("/work"),
};

// Änderungen im CMS erscheinen spätestens nach einer Minute.
export const revalidate = 60;

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  return <WorkView sprache="de" kategorie={kategorie} />;
}
