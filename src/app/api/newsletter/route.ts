import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import {
  BESTAETIGUNG_GUELTIG_MS,
  unterschriebeneAbfrage,
} from "@/lib/newsletter";
import { downloadMail } from "@/lib/newsletterMail";
import { siteUrl } from "@/lib/site";
import { istSprache, pfad, type Sprache, text } from "@/lib/sprache";
import { client } from "@/sanity/lib/client";
import type { LocalizedString } from "@/sanity/lib/types";

export const runtime = "nodejs";

const BREVO = "https://api.brevo.com/v3";

/**
 * Anmeldung zum Newsletter und Anforderung eines Downloads (F-901 bis F-910).
 *
 * Ablauf: Die Adresse wird nicht hier gespeichert, sondern bei Brevo — mit
 * Bestätigung per E-Mail (Double Opt-in). Erst der Klick in dieser Mail legt
 * den Kontakt auf der Liste ab und führt zur Bestätigungsseite, auf der der
 * Download liegt.
 *
 * Diese Antwort verrät nie, ob eine Adresse schon bekannt ist: Sie lautet in
 * jedem Fall gleich (F-910). Sonst ließe sich die Liste mit dem Formular
 * abfragen.
 */

type Eingabe = {
  name?: unknown;
  email?: unknown;
  tool?: unknown;
  sprache?: unknown;
  einverstanden?: unknown;
  website?: unknown;
};

/** Ein Versuchsfenster je Besucher, nur im Arbeitsspeicher. */
const versuche = new Map<string, number[]>();
const FENSTER_MS = 60 * 60 * 1000;
const MAX_JE_FENSTER = 5;

/**
 * Begrenzt die Anfragen je Besucher (F-907).
 *
 * Die Adresse des Besuchers wird nur als Prüfsumme gehalten und verfällt mit
 * dem Fenster — gespeichert wird keine IP. Auf einer Plattform mit mehreren
 * Instanzen greift die Grenze je Instanz; als zweite Hürde steht das
 * unsichtbare Feld daneben.
 */
function zuVieleVersuche(request: Request): boolean {
  const roh =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unbekannt";
  const kennung = createHash("sha256")
    .update(`${roh}:${process.env.NEWSLETTER_SECRET ?? ""}`)
    .digest("hex")
    .slice(0, 16);

  const jetzt = Date.now();
  const bisher = (versuche.get(kennung) ?? []).filter(
    (zeit) => jetzt - zeit < FENSTER_MS,
  );

  if (bisher.length >= MAX_JE_FENSTER) {
    versuche.set(kennung, bisher);
    return true;
  }

  bisher.push(jetzt);
  versuche.set(kennung, bisher);

  // Aufräumen, damit die Karte nicht unbegrenzt wächst.
  if (versuche.size > 5000) {
    for (const [k, zeiten] of versuche) {
      if (zeiten.every((zeit) => jetzt - zeit >= FENSTER_MS)) versuche.delete(k);
    }
  }
  return false;
}

/** Bewusst großzügig: Die Mail entscheidet, ob die Adresse stimmt. */
function istEmail(wert: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(wert) && wert.length <= 200;
}

/** Teilt „Martin Rettschlag“ in Vor- und Nachnamen (F-901). */
function nameTeilen(name: string): { vorname: string; nachname: string } {
  const teile = name.split(/\s+/).filter(Boolean);
  if (teile.length === 1) return { vorname: teile[0], nachname: "" };
  return {
    vorname: teile.slice(0, -1).join(" "),
    nachname: teile[teile.length - 1],
  };
}

async function brevo(methode: string, weg: string, daten?: unknown) {
  const schluessel = process.env.BREVO_API_KEY?.trim();
  if (!schluessel) throw new Error("BREVO_API_KEY fehlt");

  const antwort = await fetch(`${BREVO}${weg}`, {
    method: methode,
    headers: {
      "api-key": schluessel,
      accept: "application/json",
      ...(daten ? { "content-type": "application/json" } : {}),
    },
    body: daten ? JSON.stringify(daten) : undefined,
  });
  return antwort;
}

type FreiesTool = { slug: string; name: LocalizedString } | null;

export async function POST(request: Request) {
  let eingabe: Eingabe;
  try {
    eingabe = (await request.json()) as Eingabe;
  } catch {
    return NextResponse.json({ ok: false, fehler: "eingabe" }, { status: 400 });
  }

  // Unsichtbares Feld: Nur automatische Ausfüller tragen hier etwas ein.
  // Sie bekommen eine freundliche Antwort und sonst nichts (F-907).
  if (typeof eingabe.website === "string" && eingabe.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof eingabe.name === "string" ? eingabe.name.trim() : "";
  const email =
    typeof eingabe.email === "string" ? eingabe.email.trim().toLowerCase() : "";
  const sprache: Sprache = istSprache(eingabe.sprache) ? eingabe.sprache : "de";
  const slugWunsch =
    typeof eingabe.tool === "string" && /^[a-z0-9-]{1,96}$/.test(eingabe.tool)
      ? eingabe.tool
      : null;

  if (eingabe.einverstanden !== true) {
    return NextResponse.json(
      { ok: false, fehler: "einverstanden" },
      { status: 400 },
    );
  }
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, fehler: "name" }, { status: 400 });
  }
  if (!istEmail(email)) {
    return NextResponse.json({ ok: false, fehler: "email" }, { status: 400 });
  }
  if (zuVieleVersuche(request)) {
    return NextResponse.json({ ok: false, fehler: "zuViele" }, { status: 429 });
  }

  const listenId = Number(process.env.BREVO_LIST_ID);
  const vorlage = Number(
    sprache === "en"
      ? process.env.BREVO_DOI_TEMPLATE_ID_EN
      : process.env.BREVO_DOI_TEMPLATE_ID_DE,
  );
  if (!process.env.BREVO_API_KEY || !listenId || !vorlage) {
    console.error(
      "Newsletter: BREVO_API_KEY, BREVO_LIST_ID oder BREVO_DOI_TEMPLATE_ID_* fehlt.",
    );
    return NextResponse.json({ ok: false, fehler: "dienst" }, { status: 503 });
  }

  // Nur ein wirklich vorhandenes, kostenloses Tool darf unterschrieben
  // werden. Sonst könnte über das Formular eine Adresse für eine beliebige
  // Zeichenkette erzeugt werden.
  let tool: FreiesTool = null;
  if (slugWunsch) {
    tool = await client.fetch<FreiesTool>(
      `*[_type == "tool" && slug.current == $slug && vertrieb != "kauf" && (defined(downloadFile.asset) || defined(githubRepo))][0]{
        "slug": slug.current, name
      }`,
      { slug: slugWunsch },
    );
  }

  const ziel = tool
    ? `${siteUrl}${pfad("/newsletter/bestaetigt", sprache)}?${unterschriebeneAbfrage(
        "bestaetigt",
        tool.slug,
        BESTAETIGUNG_GUELTIG_MS,
      )}`
    : `${siteUrl}${pfad("/newsletter/bestaetigt", sprache)}`;

  const { vorname, nachname } = nameTeilen(name);
  const merkmale = {
    VORNAME: vorname,
    NACHNAME: nachname,
    SPRACHE: sprache,
    ...(tool ? { TOOL: tool.slug } : {}),
  };

  try {
    // Steht die Adresse schon bestätigt auf der Liste? Dann wäre eine zweite
    // Anmeldebestätigung sinnlos — diese Person bekommt den Link direkt.
    const vorhanden = await brevo(
      "GET",
      `/contacts/${encodeURIComponent(email)}`,
    );

    let bereitsAufDerListe = false;
    if (vorhanden.status === 200) {
      const kontakt = (await vorhanden.json()) as {
        emailBlacklisted?: boolean;
        listIds?: number[];
      };
      bereitsAufDerListe =
        !kontakt.emailBlacklisted &&
        Array.isArray(kontakt.listIds) &&
        kontakt.listIds.includes(listenId);
    }

    if (bereitsAufDerListe) {
      if (!tool) {
        // Nichts zu tun: schon angemeldet, kein Download angefordert.
        // Die Antwort bleibt dieselbe wie sonst (F-910).
        return NextResponse.json({ ok: true });
      }

      const mail = downloadMail(sprache, text(tool.name, sprache) || tool.slug, ziel);
      const gesendet = await brevo("POST", "/smtp/email", {
        sender: { name: "Martin Rettschlag", email: absender() },
        to: [{ email, name }],
        ...mail,
      });
      if (!gesendet.ok) {
        console.error(
          "Newsletter: Download-Mail abgelehnt",
          gesendet.status,
          await gesendet.text(),
        );
        return NextResponse.json(
          { ok: false, fehler: "dienst" },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Neu, unbestätigt oder früher abgemeldet: Anmeldung bestätigen lassen.
    const doi = await brevo("POST", "/contacts/doubleOptinConfirmation", {
      email,
      attributes: merkmale,
      includeListIds: [listenId],
      templateId: vorlage,
      redirectionUrl: ziel,
    });

    if (!doi.ok) {
      console.error(
        "Newsletter: Bestätigungsmail abgelehnt",
        doi.status,
        await doi.text(),
      );
      return NextResponse.json({ ok: false, fehler: "dienst" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (fehler) {
    console.error("Newsletter: Anmeldung fehlgeschlagen", fehler);
    return NextResponse.json({ ok: false, fehler: "dienst" }, { status: 502 });
  }
}

/**
 * Absender der direkten Download-Mail.
 *
 * Solange kein Absender auf der eigenen Domain bei Brevo bestätigt ist, muss
 * die Mail von der dort hinterlegten Adresse kommen — eine unbestätigte
 * lehnt Brevo ab. Die Anmeldebestätigung selbst trägt ihren Absender in der
 * Vorlage und braucht diesen Wert nicht.
 */
function absender(): string {
  return (
    process.env.BREVO_SENDER_EMAIL?.trim() || "martinrettschlag@gmail.com"
  );
}
