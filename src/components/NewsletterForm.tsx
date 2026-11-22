"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { pfad, type Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";

type Zustand = "ruht" | "laeuft" | "fertig";

/**
 * Anmeldung zum Newsletter, zugleich Anforderung eines Downloads (F-901).
 *
 * Zwei Felder, ein Haken, fertig: Vollständiger Name und E-Mail. Mehr wird
 * nicht abgefragt, weil mehr nicht gebraucht wird.
 *
 * Mit „tool“ ist es die Download-Anforderung auf einer Tool-Karte, ohne die
 * gewöhnliche Anmeldung am Fuß der Software-Seite (F-908).
 */
export function NewsletterForm({
  sprache,
  tool = null,
  autoFokus = false,
}: {
  sprache: Sprache;
  tool?: string | null;
  autoFokus?: boolean;
}) {
  const t = texte(sprache);
  const kennung = useId();
  const [zustand, setZustand] = useState<Zustand>("ruht");
  const [fehler, setFehler] = useState<string | null>(null);

  async function absenden(ereignis: React.FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    if (zustand === "laeuft") return;

    const formular = new FormData(ereignis.currentTarget);
    const name = String(formular.get("name") ?? "").trim();
    const email = String(formular.get("email") ?? "").trim();
    const einverstanden = formular.get("einverstanden") === "on";

    // Im Browser prüfen, damit niemand auf eine Antwort warten muss, um
    // einen Tippfehler zu sehen. Der Server prüft dasselbe noch einmal.
    if (name.length < 2) return setFehler(t.newsletterFehlerName);
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
      return setFehler(t.fehlerEmailUngueltig);
    }
    if (!einverstanden) return setFehler(t.newsletterFehlerEinverstanden);

    setFehler(null);
    setZustand("laeuft");

    try {
      const antwort = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          einverstanden,
          sprache,
          tool,
          website: String(formular.get("website") ?? ""),
        }),
      });

      if (antwort.ok) {
        setZustand("fertig");
        return;
      }

      const daten = (await antwort.json().catch(() => null)) as {
        fehler?: string;
      } | null;
      setZustand("ruht");
      setFehler(
        daten?.fehler === "zuViele"
          ? t.newsletterZuVieleVersuche
          : daten?.fehler === "email"
            ? t.fehlerEmailUngueltig
            : daten?.fehler === "name"
              ? t.newsletterFehlerName
              : daten?.fehler === "einverstanden"
                ? t.newsletterFehlerEinverstanden
                : t.newsletterFehlerAllgemein,
      );
    } catch {
      setZustand("ruht");
      setFehler(t.newsletterFehlerAllgemein);
    }
  }

  if (zustand === "fertig") {
    return (
      <div aria-live="polite">
        <p className="display text-2xl md:text-3xl">
          {t.newsletterPostfachKopf}
        </p>
        <p className="mt-4 max-w-md leading-relaxed">
          {tool ? t.newsletterPostfachText : t.newsletterPostfachTextOhneTool}
        </p>
        <p className="meta mt-4 text-muted">{t.newsletterSpamHinweis}</p>
      </div>
    );
  }

  return (
    <form onSubmit={absenden} noValidate className="max-w-md">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor={`${kennung}-name`} className="meta block">
            {t.name}
          </label>
          <input
            id={`${kennung}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            autoFocus={autoFokus}
            className="mt-2 w-full border border-line bg-paper px-4 py-3 text-base focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor={`${kennung}-email`} className="meta block">
            {t.email}
          </label>
          <input
            id={`${kennung}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={200}
            className="mt-2 w-full border border-line bg-paper px-4 py-3 text-base focus:border-accent focus:outline-none"
          />
        </div>

        {/* Unsichtbares Feld gegen automatische Ausfüller (F-907). Nicht mit
            display:none versteckt — manche Programme überspringen genau das.
            Für Vorleseprogramme und die Tastatur ist es unerreichbar. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${kennung}-website`}>{t.honeypotLabel}</label>
          <input
            id={`${kennung}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            name="einverstanden"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-accent"
          />
          <span>
            {t.newsletterEinverstanden}{" "}
            {t.newsletterDatenschutzHinweis}{" "}
            <Link
              href={pfad("/datenschutz", sprache)}
              className="underline hover:text-accent"
            >
              {t.datenschutzerklaerung}
            </Link>
            .
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={zustand === "laeuft"}
        className="meta mt-6 cursor-pointer rounded-full border border-accent bg-accent px-7 py-3 !text-accent-contrast transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
      >
        {zustand === "laeuft"
          ? t.newsletterLaeuft
          : tool
            ? t.newsletterAnmeldenDownload
            : t.newsletterAnmelden}
      </button>

      {/* aria-live: Vorleseprogramme geben die Meldung von selbst aus,
          sobald sie erscheint. */}
      <p aria-live="polite" className="mt-4 min-h-6 text-sm text-accent">
        {fehler}
      </p>
    </form>
  );
}
