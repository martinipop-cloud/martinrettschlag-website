import type { Metadata } from "next";

import { LegalPageView, ladeRechtstext } from "@/components/LegalPageView";

export const metadata: Metadata = {
  title: "Privacy policy",
  robots: { index: false, follow: true },
};

export const revalidate = 60;

/**
 * Die Datenschutzerklärung ist rechtlich in der deutschen Fassung maßgeblich.
 * Ohne englische Übersetzung im CMS erscheint hier deshalb der deutsche Text.
 *
 * Die Adresse bleibt bewusst /en/datenschutz und wird nicht zu /en/privacy:
 * so zeigt der Sprachumschalter auf dieselbe Seite, und im CMS bleibt es eine
 * Kennung für beide Sprachen.
 */
export default async function EnDatenschutzPage() {
  const seite = await ladeRechtstext("datenschutz");
  return (
    <LegalPageView seite={seite} ersatzTitel="Privacy policy" sprache="en" />
  );
}
