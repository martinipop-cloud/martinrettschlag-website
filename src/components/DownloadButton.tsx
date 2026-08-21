"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Download-Schaltfläche mit anschließendem Spendenhinweis (F-404, F-405).
 *
 * Wichtig: Der Download bleibt ein gewöhnlicher Link. Die Datei wird mit
 * „Content-Disposition: attachment“ ausgeliefert, der Browser lädt sie also
 * herunter, ohne die Seite zu verlassen — das Fenster kann danach erscheinen,
 * ohne den Vorgang zu stören. Ist JavaScript abgeschaltet, funktioniert der
 * Download trotzdem, es erscheint dann lediglich kein Hinweis.
 *
 * Es wird nichts gespeichert und nichts gezählt, was über den anonymen
 * Download-Zähler hinausgeht.
 */
export function DownloadButton({
  downloadUrl,
  toolName,
  paypalUrl,
}: {
  downloadUrl: string;
  toolName: string;
  paypalUrl: string | null;
}) {
  const [offen, setOffen] = useState(false);
  const schliessenRef = useRef<HTMLButtonElement>(null);

  const schliessen = useCallback(() => setOffen(false), []);

  useEffect(() => {
    if (!offen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") schliessen();
    }
    document.addEventListener("keydown", onKey);

    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    schliessenRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = vorher;
    };
  }, [offen, schliessen]);

  return (
    <>
      <a
        href={downloadUrl}
        // Suchmaschinen sollen dem Link nicht folgen, sonst zählen
        // deren Roboter als Downloads mit.
        rel="nofollow"
        // Kein preventDefault: Der Download startet ganz normal,
        // der Hinweis erscheint zusätzlich.
        onClick={() => setOffen(true)}
        className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
      >
        Herunterladen
      </a>

      {offen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="spenden-titel"
          onClick={schliessen}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-lg border border-line bg-paper p-8 md:p-10"
          >
            <p className="meta">Download läuft</p>

            <h2
              id="spenden-titel"
              className="display mt-4 text-[clamp(2rem,7vw,3.5rem)]"
            >
              Danke<span className="script">schön</span>
            </h2>

            <p className="mt-6 leading-relaxed">
              <strong>{toolName}</strong> wird gerade geladen — kostenlos und
              ohne Gegenleistung.
            </p>

            <p className="mt-4 leading-relaxed text-muted">
              Diese Tools entstehen in meiner freien Zeit. Wenn dir eins die
              Arbeit erleichtert, freue ich mich über eine Spende. Sie ist
              freiwillig und ändert nichts daran, dass alles frei verfügbar
              bleibt.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {paypalUrl && (
                <a
                  href={paypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={schliessen}
                  className="meta rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85"
                >
                  Spenden über PayPal
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
              )}
              <button
                ref={schliessenRef}
                type="button"
                onClick={schliessen}
                className="meta cursor-pointer rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
              >
                Vielleicht später
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
