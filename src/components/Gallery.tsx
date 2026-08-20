"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryImage = {
  /** Kleine Fassung für die Kachel im Raster. */
  thumbUrl: string;
  /** Große Fassung für die Vollansicht. */
  fullUrl: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

/**
 * Screenshots und Stills eines Projekts (F-305, F-306).
 *
 * Darstellung als Raster kleinerer Vorschaubilder, das ausschließlich nach
 * unten weiterläuft — kein Slider, kein seitwärts scrollender Streifen (F-814).
 * Ein Klick öffnet das Bild in voller Größe.
 */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [offenIndex, setOffenIndex] = useState<number | null>(null);

  const schliessen = useCallback(() => setOffenIndex(null), []);

  const blaettern = useCallback(
    (richtung: -1 | 1) => {
      setOffenIndex((aktuell) => {
        if (aktuell === null) return null;
        return (aktuell + richtung + images.length) % images.length;
      });
    },
    [images.length],
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

  if (images.length === 0) return null;

  const offen = offenIndex === null ? null : images[offenIndex];

  return (
    <>
      <section className="mt-20">
        <h2 className="meta border-b border-line pb-4">
          Screenshots — {images.length} Bilder
        </h2>

        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((bild, index) => (
            <li key={`${bild.thumbUrl}-${index}`}>
              <figure>
                <button
                  type="button"
                  onClick={() => setOffenIndex(index)}
                  aria-label={`${bild.alt} – vergrößern`}
                  className="group block w-full cursor-zoom-in overflow-hidden bg-paper-raised ring-1 ring-line"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={bild.thumbUrl}
                      alt={bild.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                </button>
                {bild.caption && (
                  <figcaption className="meta mt-2">{bild.caption}</figcaption>
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
          <Image
            src={offen.fullUrl}
            alt={offen.alt}
            width={offen.width}
            height={offen.height}
            sizes="100vw"
            className="max-h-[85vh] w-auto max-w-full object-contain"
          />

          {offen.caption && (
            <p className="meta mt-4 !text-white/80">{offen.caption}</p>
          )}

          <p className="meta mt-2 !text-white/50">
            {(offenIndex ?? 0) + 1} von {images.length}
          </p>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  blaettern(-1);
                }}
                aria-label="Vorheriges Bild"
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
                aria-label="Nächstes Bild"
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
