import { NextResponse } from "next/server";

import { anfrageVersenden, mailVersandEingerichtet } from "@/lib/mailer";
import { aufraeumen, pruefeRatenbegrenzung } from "@/lib/rateLimit";
import { istSprache, STANDARDSPRACHE } from "@/lib/sprache";
import { texte } from "@/lib/texte";

export const runtime = "nodejs";

/** Adresse, die bei Störungen als direkter Weg genannt wird. */
const DIREKTE_ADRESSE = "hello@martinrettschlag.de";

type Eingang = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  consent?: unknown;
  /** Honeypot: für Menschen unsichtbar, Bots füllen es aus (F-607). */
  website?: unknown;
  /** Sprache des Formulars, damit die Antwort dazu passt. */
  sprache?: unknown;
};

function text(wert: unknown, maxLaenge: number): string | null {
  if (typeof wert !== "string") return null;
  const getrimmt = wert.trim();
  if (getrimmt.length === 0 || getrimmt.length > maxLaenge) return null;
  return getrimmt;
}

function istEmail(wert: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wert);
}

/**
 * Nimmt Kontaktanfragen entgegen und stellt sie per E-Mail zu (F-604).
 *
 * Bewusst ohne Speicherung im CMS: Der Sanity-Datensatz ist öffentlich
 * lesbar, gespeicherte Anfragen wären damit für jeden abrufbar. Das Postfach
 * ist das Archiv. Schlägt der Versand fehl, erfährt der Absender das sofort
 * und bekommt die direkte Adresse genannt — es geht also nichts stillschweigend
 * verloren.
 */
export async function POST(request: Request) {
  let daten: Eingang;
  try {
    daten = await request.json();
  } catch {
    return NextResponse.json(
      { fehler: texte(STANDARDSPRACHE).fehlerNichtGelesen },
      { status: 400 },
    );
  }

  // Unbekannte oder fehlende Angabe fällt auf Deutsch zurück.
  const t = texte(istSprache(daten.sprache) ? daten.sprache : STANDARDSPRACHE);

  // Honeypot: ausgefüllt heißt Bot. Wir antworten bewusst mit "erfolgreich",
  // damit der Absender nicht erkennt, dass er erkannt wurde.
  if (typeof daten.website === "string" && daten.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = text(daten.name, 100);
  const email = text(daten.email, 200);
  const subject = text(daten.subject, 200);
  const message = text(daten.message, 5000);

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ fehler: t.fehlerAlleFelder }, { status: 400 });
  }

  if (!istEmail(email)) {
    return NextResponse.json(
      { fehler: t.fehlerEmailUngueltig },
      { status: 400 },
    );
  }

  // Einwilligung ist Pflicht (F-608, R-07).
  if (daten.consent !== true) {
    return NextResponse.json({ fehler: t.fehlerZustimmung }, { status: 400 });
  }

  // Ratenbegrenzung pro Absender-Adresse (F-607, N-43).
  aufraeumen();
  const herkunft =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unbekannt";

  if (!pruefeRatenbegrenzung(herkunft).erlaubt) {
    return NextResponse.json(
      { fehler: t.fehlerZuVieleAnfragen },
      { status: 429 },
    );
  }

  const stoerung = `${t.fehlerNichtUebermittelt} ${DIREKTE_ADRESSE}.`;

  if (!mailVersandEingerichtet()) {
    console.error("SMTP-Zugangsdaten fehlen – Anfrage konnte nicht zugestellt werden.");
    return NextResponse.json({ fehler: stoerung }, { status: 500 });
  }

  try {
    await anfrageVersenden({ name, email, subject, message });
  } catch (fehler) {
    console.error("Anfrage konnte nicht versendet werden:", fehler);
    return NextResponse.json({ fehler: stoerung }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
