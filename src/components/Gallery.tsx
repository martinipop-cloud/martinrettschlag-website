"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Gemeinsam = {
  alt: string;
  caption?: string;
};

export type GalleryItem =
  | (Gemeinsam & {
      art: "bild";
      /** Kleine Fassung für die Kachel im Raster. */
      thumbUrl: string;
      /** Große Fassung für die Vollansicht. */
      fullUrl: string;
      width: number;
      height: number;
    })
  | (Gemeinsam & {
      art: "clip";
      url: string;
      mimeType: string;
    });

/**
 * Screenshots und Clips eines Projekts (F-305, F-306).
 *
 * Beides erscheint im selben Raster und sieht gleich aus — Clips laufen
 * stumm in Schleife, wie die Vorschauen in der Projektübersicht. Das Raster
 * läuft ausschließlich nach unten weiter, kein Slider (F-814). Ein Klick
 * öffnet den Eintrag groß.
 */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const [offenIndex, setOffenIndex] = useState<number | null>(null);

  const schliessen = useCallback(() => setOffenIndex(null), []);

  const blaettern = useCallback(
    (richtung: -1 | 1) => {
      setOffenIndex((aktuell) => {
        if (aktuell === null) return null;
        return (aktuell + richtung + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (offenIndex === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") schliessen();
      if (event.key === "ArrowRight") blaettern(1);
      if (event.key === "ArrowLeft") blaettern(-1);
    }
    document.addEventListener("keydown", onKey);

    // Hintergrund nicht mitscrollen lassen, solange die Großansicht offen ist.
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = vorher;
    };
  }, [offenIndex, schliessen, blaettern]);

  if (items.length === 0) return null;

  const offen = offenIndex === null ? null : items[offenIndex];
  const anzahlClips = items.filter((e) => e.art === "clip").length;

  return (
    <>
      <section className="mt-20">
        <h2 className="meta border-b border-line pb-4">
          {anzahlClips > 0 ? "Screenshots & Clips" : "Screenshots"} —{" "}
          {items.length}
        </h2>

        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((eintrag, index) => (
            <li key={index}>
              <figure>
                <button
                  type="button"
                  onClick={() => setOffenIndex(index)}
                  aria-label={`${eintrag.alt} – vergrößern`}
                  className="group block w-full cursor-zoom-in overflow-hidden bg-paper-raised ring-1 ring-line"
                >
                  <div className="relative aspect-[4/3] w-full">
                    {eintrag.art === "bild" ? (
                      <Image
                        src={eintrag.thumbUrl}
                        alt={eintrag.alt}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <video
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={eintrag.alt}
                      >
                        <source src={eintrag.url} type={eintrag.mimeType} />
                      </video>
                    )}
                  </div>
                </button>
                {eintrag.caption && (
                  <figcaption className="meta mt-2">
                    {eintrag.caption}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {offen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={offen.alt}
          onClick={schliessen}
          className="fixed inset-0 z-[100] flex cursor-zoom-out flex-col items-center justify-center bg-black/90 p-4 md:p-12"
        >
          {offen.art === "bild" ? (
            <Image
              src={offen.fullUrl}
              alt={offen.alt}
              width={offen.width}
              height={offen.height}
              sizes="100vw"
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          ) : (
            <video
              // Klick auf das Video soll die Ansicht nicht schließen,
              // damit die Bedienelemente nutzbar bleiben.
              onClick={(event) => event.stopPropagation()}
              className="max-h-[85vh] w-auto max-w-full cursor-auto"
              controls
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={offen.url} type={offen.mimeType} />
            </video>
          )}

          {offen.caption && (
            <p className="meta mt-4 !text-white/80">{offen.caption}</p>
          )}

          <p className="meta mt-2 !text-white/50">
            {(offenIndex ?? 0) + 1} von {items.length}
          </p>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  blaettern(-1);
                }}
                aria-label="Vorheriger Eintrag"
                className="meta absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer rounded-full border border-white/40 px-4 py-3 !text-white md:left-6"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  blaettern(1);
                }}
                aria-label="Nächster Eintrag"
                className="meta absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full border border-white/40 px-4 py-3 !text-white md:right-6"
              >
                →
              </button>
            </>
          )}

          <button
            type="button"
            onClick={schliessen}
            aria-label="Großansicht schließen"
            className="meta absolute top-5 right-5 cursor-pointer rounded-full border border-white/40 px-4 py-2 !text-white"
          >
            Schliessen
          </button>
        </div>
      )}
    </>
  );
}
