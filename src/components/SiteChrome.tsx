import { Analytics } from "@vercel/analytics/next";

import { CustomCursor } from "@/components/CustomCursor";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { Sprache } from "@/lib/sprache";

/**
 * Rahmen für alle öffentlichen Seiten: Kopfzeile, Inhalt, Fußzeile.
 *
 * Wird von beiden Sprachfassungen verwendet, damit Deutsch und Englisch
 * dieselbe Hülle teilen und nicht auseinanderlaufen. Das Studio unter /studio
 * liegt bewusst außerhalb und bekommt daher weder Header noch Footer.
 */
export function SiteChrome({
  sprache,
  children,
}: Readonly<{ sprache: Sprache; children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader sprache={sprache} />
      {/* Abstand nach oben, weil der Header fixiert ist und sonst Inhalt verdeckt. */}
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter sprache={sprache} />
      <CustomCursor />

      {/* Cookiefreie Besucherzählung. Speichert nichts auf dem Gerät der
          Besucher und kommt daher ohne Einwilligungsbanner aus. Sendet nur,
          wenn die Seite auf Vercel läuft – lokal passiert nichts.
          Bewusst nur hier und nicht im Studio eingebunden. */}
      <Analytics />
    </div>
  );
}
