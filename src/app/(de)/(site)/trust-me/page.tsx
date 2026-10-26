import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { TrustMeView } from "@/views/TrustMeView";

export const metadata: Metadata = {
  title: texte("de").navTrustMe,
  description: texte("de").trustMeBeschreibung,
  alternates: sprachAlternativen("/trust-me"),
};

export const revalidate = 60;

export default function TrustMePage() {
  return <TrustMeView sprache="de" />;
}
