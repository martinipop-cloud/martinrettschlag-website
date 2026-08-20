import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Kleine Selbstauskunft zur Fehlersuche beim Bereitstellen.
 *
 * Meldet ausschließlich, **ob** die benötigten Umgebungsvariablen gesetzt sind —
 * niemals deren Werte. Damit lässt sich nach einem Deployment sofort erkennen,
 * welcher Wert fehlt, ohne im Protokoll suchen zu müssen.
 */
const benoetigt = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "NEXT_PUBLIC_SITE_URL",
  "SANITY_API_READ_TOKEN",
  "SANITY_API_WRITE_TOKEN",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
  "CONTACT_TO",
] as const;

export async function GET() {
  const eintraege = benoetigt.map((name) => {
    const wert = process.env[name]?.trim();
    return { name, gesetzt: Boolean(wert && wert.length > 0) };
  });

  const fehlend = eintraege.filter((e) => !e.gesetzt).map((e) => e.name);

  return NextResponse.json(
    {
      alleGesetzt: fehlend.length === 0,
      fehlend,
      details: Object.fromEntries(eintraege.map((e) => [e.name, e.gesetzt])),
      hinweis:
        "Zeigt nur, ob ein Wert vorhanden ist – niemals den Wert selbst. Bei Vercel unter Settings -> Environment Variables ergaenzen und danach neu bereitstellen.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
