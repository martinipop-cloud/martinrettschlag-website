"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { NewsletterForm } from "@/components/NewsletterForm";
import type { Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";

/**
 * Download-Schaltfläche mit Anmeldung davor (F-404n).
 *
 * Der Download läuft nicht mehr unmittelbar los: Ein Fenster fragt Namen und
 * E-Mail ab, der Link kommt per Mail und liegt hinter der Bestätigung. Das
 * ist der Preis dafür, dass neue Fassungen überhaupt jemanden erreichen
 * können — ohne Liste wäre jedes Update ein Zuruf ins Leere.
 *
 * Ohne JavaScript bleibt der Knopf wirkungslos. Das ist hier vertretbar: Die
 * Anmeldung braucht ohnehin eine Rückmeldung im Browser, und die
 * Installationsanleitung samt Beschreibung steht weiterhin offen auf der
 * Seite.
 */
export function DownloadGate({
  toolSlug,
  toolName,
  sprache,
}: {
  toolSlug: string;
  toolName: string;
  sprache: Sprache;
}) {
  const t = texte(sprache);
  const [offen, setOffen] = useState(false);
  const schliessenRef = useRef<HTMLButtonElement>(null);

  const schliessen = useCallback(() => setOffen(false), []);

  useEffect(() => {
    if (!offen) return;

    function onKey(ereignis: KeyboardEvent) {
      if (ereignis.key === "Escape") schliessen();
    }
    document.addEventListener("keydown", onKey);

    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = vorher;
    };
  }, [offen, schliessen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="meta cursor-pointer rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
      >
        {t.herunterladen}
      </button>

      {offen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`download-titel-${toolSlug}`}
          onClick={schliessen}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4"
        >
          <div
            onClick={(ereignis) => ereignis.stopPropagation()}
            className="relative my-auto w-full max-w-lg border border-line bg-paper p-8 md:p-10"
          >
            <button
              ref={schliessenRef}
              type="button"
              onClick={schliessen}
              aria-label={t.schliessen}
              className="meta absolute top-4 right-5 cursor-pointer text-muted transition-colors hover:text-accent"
            >
              ✕
            </button>

            <p className="meta">{t.newsletterDownloadKopf}</p>
            <h2
              id={`download-titel-${toolSlug}`}
              className="display mt-3 text-[clamp(1.75rem,6vw,2.75rem)]"
            >
              {toolName}
            </h2>
            <p className="mt-4 leading-relaxed">{t.newsletterDownloadText}</p>

            <div className="mt-8">
              <NewsletterForm sprache={sprache} tool={toolSlug} autoFokus />
            </div>

            <details className="mt-6 border-t border-line pt-5">
              <summary className="meta cursor-pointer list-none transition-colors hover:text-accent">
                {t.warumAnmeldung}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t.warumAnmeldungText}
              </p>
            </details>
          </div>
        </div>
      )}
    </>
  );
}
