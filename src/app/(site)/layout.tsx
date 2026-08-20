import { Analytics } from "@vercel/analytics/next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * Rahmen für alle öffentlichen Seiten.
 * Das Studio unter /studio liegt bewusst außerhalb dieses Layouts und
 * bekommt daher weder Header noch Footer.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {/* Abstand nach oben, weil der Header fixiert ist und sonst Inhalt verdeckt. */}
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />

      {/* Cookiefreie Besucherzählung. Speichert nichts auf dem Gerät der
          Besucher und kommt daher ohne Einwilligungsbanner aus. Sendet nur,
          wenn die Seite auf Vercel läuft – lokal passiert nichts.
          Bewusst nur hier und nicht im Studio eingebunden. */}
      <Analytics />
    </div>
  );
}
