"use client";

import { useEffect, useRef, useState } from "react";

const bildKlassen =
  "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]";

/**
 * Vorschaubild oder -video einer Projektkachel.
 *
 * Entscheidend für die Flüssigkeit der Übersichtsseite: Es laufen nur die
 * Videos, die gerade zu sehen sind. Alles andere ist angehalten und noch gar
 * nicht geladen. Bei 51 Projekten in einer Kategorie würden sonst 51 Videos
 * gleichzeitig dekodiert — daran erstickt jeder Rechner beim Scrollen.
 *
 * Die Videos laufen weiterhin von selbst, sobald sie sichtbar sind, und zwar
 * unabhängig von der Systemeinstellung „Bewegung reduzieren“ (A-06 im
 * Lastenheft). Es ändert sich also nur, *wann* geladen und abgespielt wird.
 */
export function ProjectPreview({
  videoUrl,
  mimeType,
  bildUrl,
  stillUrl,
  alt,
}: {
  /** Bewegte Vorschau als Video. */
  videoUrl: string | null;
  mimeType: string | null;
  /** Bewegte Vorschau als GIF – nur noch für Altbestände. */
  bildUrl: string | null;
  /** Standbild, dient auch als Platzhalter, solange das Video lädt. */
  stillUrl: string | null;
  alt: string;
}) {
  const rahmenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Erst wenn die Kachel in die Nähe des sichtbaren Bereichs kommt, wird die
  // Videodatei überhaupt angefordert.
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const rahmen = rahmenRef.current;
    if (!rahmen || !videoUrl) return;

    // Ohne Unterstützung für den Beobachter läuft das Video wie bisher sofort.
    if (typeof IntersectionObserver === "undefined") {
      setSichtbar(true);
      return;
    }

    const beobachter = new IntersectionObserver(
      ([eintrag]) => setSichtbar(eintrag.isIntersecting),
      // Etwas Vorlauf, damit das Video beim Hereinscrollen schon läuft
      // und nicht erst anruckelt.
      { rootMargin: "300px 0px" },
    );

    beobachter.observe(rahmen);
    return () => beobachter.disconnect();
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (sichtbar) {
      // Beim ersten Sichtbarwerden hat das Video noch gar keine Quelle
      // gesehen. load() weist den Browser ausdrücklich an, die eben
      // eingefügte Quelle zu lesen, statt sich darauf zu verlassen, dass
      // play() das nebenbei miterledigt.
      if (video.networkState === video.NETWORK_EMPTY) video.load();

      // play() kann abgelehnt werden, etwa wenn der Browser die Seite im
      // Hintergrund hält. Das ist kein Fehler, den der Besucher sehen müsste.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [sichtbar]);

  return (
    <div
      ref={rahmenRef}
      className="relative aspect-video w-full overflow-hidden bg-paper-raised ring-1 ring-line"
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          className={bildKlassen}
          // Standbild überbrückt die Zeit, bis das Video bereit ist.
          poster={stillUrl ?? undefined}
          muted
          loop
          playsInline
          preload={sichtbar ? "auto" : "none"}
          aria-label={alt}
        >
          {/* Die Quelle kommt erst, wenn die Kachel in Sicht ist – sonst
              lädt der Browser die Datei trotz preload="none" teilweise. */}
          {sichtbar && <source src={videoUrl} type={mimeType ?? undefined} />}
        </video>
      ) : bildUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={bildUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={bildKlassen}
        />
      ) : stillUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={stillUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={bildKlassen}
        />
      ) : null}
    </div>
  );
}
