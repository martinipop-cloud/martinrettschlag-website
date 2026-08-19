/**
 * Liest die Video-Kennung aus den gängigen YouTube-Adressformaten heraus,
 * damit im CMS jede übliche Form eingefügt werden kann:
 *   youtube.com/watch?v=ID · youtu.be/ID · youtube.com/embed/ID
 *   youtube.com/shorts/ID · youtube.com/live/ID
 */
export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return clean(parsed.pathname.split("/")[1]);
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return clean(fromQuery);

      const segments = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live", "v"].includes(segments[0])) {
        return clean(segments[1]);
      }
    }
  } catch {
    // Keine gültige Adresse – unten wird null zurückgegeben.
  }

  return null;
}

function clean(value: string | undefined): string | null {
  if (!value) return null;
  // YouTube-Kennungen bestehen aus 11 Zeichen dieses Zeichenvorrats.
  return /^[\w-]{11}$/.test(value) ? value : null;
}
