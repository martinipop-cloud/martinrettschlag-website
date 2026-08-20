import type { Metadata } from "next";

import { NotFoundContent } from "@/components/NotFoundContent";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

/**
 * Greift bei Adressen, die es auf der ganzen Website nicht gibt.
 * Diese Seite liegt außerhalb des Website-Layouts und bringt Header und
 * Footer deshalb selbst mit.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pt-16">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
