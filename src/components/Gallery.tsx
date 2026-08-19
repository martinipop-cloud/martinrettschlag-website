"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryImage = {
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

/**
 * Bildergalerie der Projektseite (F-305, F-306).
 * Die Bilder stehen ausschließlich untereinander – kein Slider, kein
 * seitwärts scrollender Streifen (F-814). Ein Klick vergrößert das Bild.
 */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [offenIndex, setOffenIndex] = useState<number | null>(null);

  const schliessen = useCallback(() => setOffenIndex(null), []);

  useEffect(() => {
    if (offenIndex === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") schliessen();
    }
    document.addEventListener("keydown", onKey);

    // Hintergrund nicht mitscrollen lassen, solange die Großansicht offen ist.
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = vorher;
    };
  }, [offenIndex, schliessen]);

  if (images.length === 0) return null;

  const offen = offenIndex === null ? null : images[offenIndex];

  return (
    <>
      <ul className="mt-16 flex flex-col gap-6">
        {images.map((bild, index) => (
          <li key={`${bild.url}-${index}`}>
            <figure>
              <button
                type="button"
                onClick={() => setOffenIndex(index)}
                aria-label={`${bild.alt} – vergrößern`}
                className="block w-full cursor-zoom-in"
              >
                <Image
                  src={bild.url}
                  alt={bild.alt}
                  width={bild.width}
                  height={bild.height}
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="h-auto w-full ring-1 ring-line"
                />
              </button>
              {bild.caption && (
                <figcaption className="meta mt-3">{bild.caption}</figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>

      {offen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={offen.alt}
          onClick={schliessen}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 md:p-10"
        >
          <Image
            src={offen.url}
            alt={offen.alt}
            width={offen.width}
            height={offen.height}
            sizes="100vw"
            className="max-h-full w-auto max-w-full object-contain"
          />
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
