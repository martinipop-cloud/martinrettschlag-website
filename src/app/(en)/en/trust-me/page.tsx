import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { TrustMeView } from "@/views/TrustMeView";

export const metadata: Metadata = {
  title: texte("en").navTrustMe,
  description: texte("en").trustMeBeschreibung,
  alternates: sprachAlternativen("/trust-me"),
};

export const revalidate = 60;

export default function EnTrustMePage() {
  return <TrustMeView sprache="en" />;
}
