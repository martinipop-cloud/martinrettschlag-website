import { NextResponse } from "next/server";

import { anfrageVersenden, mailVersandEingerichtet } from "@/lib/mailer";
import { aufraeumen, pruefeRatenbegrenzung } from "@/lib/rateLimit";
import { hatSchreibrechte, writeClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";

type Eingang = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  consent?: unknown;
  /** Honeypot: für Menschen unsichtbar, Bots füllen es aus (F-607). */
  website?: unknown;
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

export async function POST(request: Request) {
  let daten: Eingang;
  try {
    daten = await request.json();
  } catch {
    return NextResponse.json(
      { fehler: "Anfrage konnte nicht gelesen werden." },
      { status: 400 },
    );
  }

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
    return NextResponse.json(
      { fehler: "Bitte alle Felder ausfüllen." },
      { status: 400 },
    );
  }

  if (!istEmail(email)) {
    return NextResponse.json(
      { fehler: "Bitte eine gültige E-Mail-Adresse angeben." },
      { status: 400 },
    );
  }

  // Einwilligung ist Pflicht (F-608, R-07).
  if (daten.consent !== true) {
    return NextResponse.json(
      { fehler: "Bitte der Datenverarbeitung zustimmen." },
      { status: 400 },
    );
  }

  // Ratenbegrenzung pro Absender-Adresse (F-607, N-43).
  aufraeumen();
  const herkunft =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unbekannt";

  if (!pruefeRatenbegrenzung(herkunft).erlaubt) {
    return NextResponse.json(
      {
        fehler:
          "Es wurden bereits mehrere Anfragen gesendet. Bitte später erneut versuchen.",
      },
      { status: 429 },
    );
  }

  const anfrage = { name, email, subject, message };
  let gespeichert = false;

  // 1. Im CMS ablegen, damit keine Anfrage verloren geht (F-605).
  if (hatSchreibrechte()) {
    try {
      await writeClient.create({
        _type: "inquiry",
        ...anfrage,
        receivedAt: new Date().toISOString(),
        handled: false,
      });
      gespeichert = true;
    } catch (fehler) {
      console.error("Anfrage konnte nicht im CMS gespeichert werden:", fehler);
    }
  } else {
    console.warn("SANITY_API_WRITE_TOKEN fehlt – Anfrage wird nicht gespeichert.");
  }

  // 2. Per E-Mail zustellen (F-604).
  let versendet = false;
  if (mailVersandEingerichtet()) {
    try {
      await anfrageVersenden(anfrage);
      versendet = true;
    } catch (fehler) {
      console.error("Anfrage konnte nicht versendet werden:", fehler);
    }
  } else {
    console.warn("SMTP-Zugangsdaten fehlen – es wird keine E-Mail versendet.");
  }

  // Solange mindestens einer der beiden Wege geklappt hat, ist die Anfrage
  // sicher angekommen und wir bestätigen dem Absender.
  if (!gespeichert && !versendet) {
    return NextResponse.json(
      {
        fehler:
          "Die Anfrage konnte gerade nicht übermittelt werden. Bitte schreib direkt an hello@martinrettschlag.de.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
