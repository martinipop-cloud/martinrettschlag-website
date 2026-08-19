"use client";

import Link from "next/link";
import { useState } from "react";

type Zustand = "bereit" | "sendet" | "gesendet";

const feldKlassen =
  "mt-2 w-full border border-line bg-paper-raised px-4 py-3 text-base outline-none transition-colors focus:border-accent";

/**
 * Kontaktformular (F-601 bis F-608).
 * Pflichtfelder werden vor dem Absenden geprüft, die Einwilligung zur
 * Datenverarbeitung ist verpflichtend, und ein für Menschen unsichtbares
 * Feld hält einfache Bots ab.
 */
export function ContactForm({ kontaktEmail }: { kontaktEmail: string }) {
  const [zustand, setZustand] = useState<Zustand>("bereit");
  const [fehler, setFehler] = useState<string | null>(null);

  async function absenden(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFehler(null);
    setZustand("sendet");

    const formular = new FormData(event.currentTarget);

    try {
      const antwort = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formular.get("name"),
          email: formular.get("email"),
          subject: formular.get("subject"),
          message: formular.get("message"),
          consent: formular.get("consent") === "on",
          website: formular.get("website"),
        }),
      });

      const ergebnis = await antwort.json();

      if (!antwort.ok) {
        setFehler(ergebnis?.fehler ?? "Es ist ein Fehler aufgetreten.");
        setZustand("bereit");
        return;
      }

      setZustand("gesendet");
    } catch {
      setFehler(
        `Die Verbindung ist fehlgeschlagen. Bitte schreib direkt an ${kontaktEmail}.`,
      );
      setZustand("bereit");
    }
  }

  // Bestätigung nach erfolgreichem Absenden (F-603)
  if (zustand === "gesendet") {
    return (
      <div
        role="status"
        className="border border-accent bg-paper-raised p-8 md:p-10"
      >
        <p className="display text-2xl">Danke für deine Nachricht.</p>
        <p className="mt-4 text-muted">
          Die Anfrage ist angekommen. Ich melde mich so bald wie möglich.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={absenden} noValidate={false} className="max-w-2xl">
      {/* Honeypot – für Menschen unsichtbar, aber nicht per display:none,
          damit Bots ihn im Quelltext finden und ausfüllen (F-607). */}
      <div aria-hidden="true" className="absolute left-[-9999px] w-px">
        <label htmlFor="website">Website (bitte frei lassen)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="meta">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            className={feldKlassen}
          />
        </div>

        <div>
          <label htmlFor="email" className="meta">
            E-Mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={feldKlassen}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="subject" className="meta">
          Betreff *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          className={feldKlassen}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="message" className="meta">
          Nachricht *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          maxLength={5000}
          className={`${feldKlassen} resize-y`}
        />
      </div>

      <div className="mt-8 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-muted">
          Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der
          Anfrage gespeichert werden. Weitere Hinweise in der{" "}
          <Link
            href="/datenschutz"
            className="text-accent underline underline-offset-4"
          >
            Datenschutzerklärung
          </Link>
          . *
        </label>
      </div>

      {fehler && (
        <p role="alert" className="mt-6 border border-accent px-4 py-3 text-sm">
          {fehler}
        </p>
      )}

      <button
        type="submit"
        disabled={zustand === "sendet"}
        className="meta mt-8 cursor-pointer rounded-full border border-accent bg-accent px-8 py-3 !text-accent-contrast transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
      >
        {zustand === "sendet" ? "Wird gesendet …" : "Nachricht senden"}
      </button>

      <p className="meta mt-4">* Pflichtfeld</p>
    </form>
  );
}
