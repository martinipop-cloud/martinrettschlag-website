import type { Metadata } from "next";

import { LegalPageView, ladeRechtstext } from "@/components/LegalPageView";
import { texte } from "@/lib/texte";

export const metadata: Metadata = {
  title: texte("en").impressum,
  robots: { index: false, follow: true },
};

export const revalidate = 60;

/**
 * Das Impressum ist rechtlich in der deutschen Fassung maßgeblich. Ohne
 * englische Übersetzung im CMS erscheint hier deshalb der deutsche Text —
 * das ist zulässig und besser als eine leere Seite.
 */
export default async function EnImpressumPage() {
  const seite = await ladeRechtstext("impressum");
  return (
    <LegalPageView
      seite={seite}
      ersatzTitel={texte("en").impressum}
      sprache="en"
    />
  );
}
