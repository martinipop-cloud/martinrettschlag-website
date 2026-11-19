/**
 * YouTube-Vorschaubild über die eigene Domain (R-06).
 *
 * Der Server holt das Bild bei YouTube ab und gibt es weiter. Der Browser der
 * Besucher hat so vor dem Klick auf „Abspielen“ keinen Kontakt zu Google.
 *
 * Die Antwort wird ein Jahr lang im CDN von Vercel zwischengespeichert. Jedes
 * Vorschaubild wird dadurch praktisch nur einmal bei YouTube abgeholt – das
 * belastet weder die Bildoptimierung noch nennenswert das Funktionskontingent.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // YouTube-Kennungen bestehen aus genau 11 Zeichen dieses Zeichenvorrats.
  // Alles andere wird abgewiesen, damit die Schnittstelle nicht als
  // allgemeiner Weiterleiter missbraucht werden kann.
  if (!/^[\w-]{11}$/.test(id)) {
    return new Response("Ungültige Video-Kennung", { status: 400 });
  }

  const antwort = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  if (!antwort.ok || !antwort.body) {
    return new Response("Vorschaubild nicht gefunden", { status: 404 });
  }

  return new Response(antwort.body, {
    headers: {
      "Content-Type": antwort.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
