"use client";

import { useState } from "react";

/**
 * Datenschutzfreundliche YouTube-Einbettung (F-309, R-06).
 *
 * Vor dem Klick wird nichts von Google geladen – das Vorschaubild kommt aus
 * dem eigenen CMS. Erst nach dem Klick des Nutzers wird der Player über
 * youtube-nocookie.com nachgeladen. Das erspart einen Consent-Zwang für das
 * bloße Betrachten der Projektseite und beschleunigt den Seitenaufbau (N-04).
 */
export function YouTubeEmbed({
  videoId,
  title,
  posterUrl,
}: {
  videoId: string;
  title: string;
  posterUrl: string | null;
}) {
  const [aktiviert, setAktiviert] = useState(false);

  if (aktiviert) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setAktiviert(true)}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-paper-raised ring-1 ring-line"
    >
      {posterUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={posterUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35 text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-contrast transition-transform duration-300 group-hover:scale-110">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="ml-1 h-6 w-6 fill-current"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="meta max-w-md px-6 text-center !text-white/90">
          Video starten — dabei wird eine Verbindung zu YouTube aufgebaut
        </span>
      </span>
    </button>
  );
}
