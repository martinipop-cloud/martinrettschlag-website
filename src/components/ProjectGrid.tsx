"use client";

import { Children, useEffect, useRef, useState } from "react";

/**
 * Projektraster, das beim Scrollen nachlädt.
 *
 * Die Kacheln werden auf dem Server fertig gebaut und hier nur portionsweise
 * in die Seite gestellt. Der Browser muss dadurch nicht 51 Kacheln samt
 * Videos auf einmal aufbauen, sondern bekommt sie in Schüben.
 *
 * Zusätzlich zum automatischen Nachladen steht eine Schaltfläche darunter:
 * Sie ist mit der Tastatur erreichbar und greift auch dann, wenn der Browser
 * den Beobachter nicht unterstützt. Automatisches Nachladen allein wäre eine
 * Sackgasse für alle, die nicht mit der Maus scrollen.
 *
 * Beim Wechsel der Kategorie muss die Zählung von vorn beginnen. Darum
 * bekommt dieses Raster von außen ein `key` mit der Kategorie — React baut es
 * dann neu auf, statt den alten Zählerstand weiterzuverwenden.
 */
export function ProjectGrid({
  children,
  startAnzahl = 9,
  schrittweite = 9,
  mehrLaden,
  rasterKlassen,
}: {
  children: React.ReactNode;
  /** Wie viele Kacheln sofort erscheinen. */
  startAnzahl?: number;
  /** Wie viele je Nachladevorgang dazukommen. */
  schrittweite?: number;
  /** Beschriftung der Schaltfläche in der aktuellen Sprache. */
  mehrLaden: string;
  rasterKlassen: string;
}) {
  const alle = Children.toArray(children);
  const [anzahl, setAnzahl] = useState(startAnzahl);
  const markeRef = useRef<HTMLDivElement>(null);

  const vollstaendig = anzahl >= alle.length;

  useEffect(() => {
    const marke = markeRef.current;
    if (!marke || vollstaendig) return;
    if (typeof IntersectionObserver === "undefined") return;

    const beobachter = new IntersectionObserver(
      ([eintrag]) => {
        if (eintrag.isIntersecting) {
          setAnzahl((bisher) => Math.min(bisher + schrittweite, alle.length));
        }
      },
      // Vorlauf, damit der nächste Schub schon bereitsteht, bevor der
      // Besucher das Ende erreicht.
      { rootMargin: "600px 0px" },
    );

    beobachter.observe(marke);
    return () => beobachter.disconnect();
    // `anzahl` gehört in die Liste, auch wenn es im Rumpf nicht vorkommt:
    // Der Beobachter meldet nur Übergänge. Bleibt die Marke nach einem Schub
    // weiter sichtbar — etwa weil der neue Schub kürzer ist als der Vorlauf —
    // käme nie wieder eine Meldung und das Nachladen bliebe stehen. Durch das
    // Neuaufsetzen nach jedem Schub wird erneut geprüft.
  }, [vollstaendig, schrittweite, alle.length, anzahl]);

  return (
    <>
      <ul className={rasterKlassen}>{alle.slice(0, anzahl)}</ul>

      {!vollstaendig && (
        <>
          {/* Unsichtbare Marke: Sobald sie in Sicht kommt, wird nachgeladen. */}
          <div ref={markeRef} aria-hidden="true" className="h-px" />

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setAnzahl((bisher) =>
                  Math.min(bisher + schrittweite, alle.length),
                )
              }
              className="meta cursor-pointer rounded-full border border-line px-7 py-3 transition-colors hover:border-accent hover:text-accent"
            >
              {mehrLaden} ({alle.length - anzahl})
            </button>
          </div>
        </>
      )}
    </>
  );
}
