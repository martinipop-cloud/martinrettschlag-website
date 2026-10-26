import type { Metadata } from "next";

import { LegalPageView, ladeRechtstext } from "@/components/LegalPageView";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: true },
};

export const revalidate = 60;

export default async function DatenschutzPage() {
  const seite = await ladeRechtstext("datenschutz");
  return <LegalPageView seite={seite} ersatzTitel="Datenschutzerklärung" />;
}
