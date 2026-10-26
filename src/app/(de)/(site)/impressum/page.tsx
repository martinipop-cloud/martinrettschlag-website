import type { Metadata } from "next";

import { LegalPageView, ladeRechtstext } from "@/components/LegalPageView";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export const revalidate = 60;

export default async function ImpressumPage() {
  const seite = await ladeRechtstext("impressum");
  return <LegalPageView seite={seite} ersatzTitel="Impressum" />;
}
