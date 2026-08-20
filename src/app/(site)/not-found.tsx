import type { Metadata } from "next";

import { NotFoundContent } from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

/**
 * Greift, wenn innerhalb der Website ein Projekt oder Artikel nicht existiert.
 * Header und Footer kommen vom umgebenden Layout.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
