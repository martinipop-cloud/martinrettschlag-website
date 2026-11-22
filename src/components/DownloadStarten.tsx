"use client";

import { useEffect } from "react";

/**
 * Startet den Download, sobald die Danke-Seite steht.
 *
 * Warum hier und nicht schon beim Klick auf der Bestätigungsseite: Wechselt
 * der Browser direkt nach dem Start eines Downloads die Seite, brechen
 * manche Browser den Download ab. Also führt der Knopf zur Danke-Seite, und
 * die holt die Datei. Die Adresse liefert die Datei als Anhang aus — der
 * Browser lädt sie herunter und bleibt auf der Danke-Seite.
 *
 * Bewusst kein unsichtbarer iframe: Schlägt der Download fehl, sähe man das
 * dort nicht. So erscheint eine Fehlermeldung des Servers sichtbar.
 *
 * Jeder Link startet nur einmal von selbst. Lädt man die Seite neu, kommt
 * kein zweiter Download (und kein zweiter Zählerschritt); dafür gibt es den
 * Link „Noch einmal laden“.
 */
export function DownloadStarten({ url }: { url: string }) {
  useEffect(() => {
    const merker = `download-gestartet:${url}`;
    try {
      if (sessionStorage.getItem(merker)) return;
    } catch {
      // Ohne Speicher (privates Fenster, gesperrt): trotzdem starten.
    }
    // Kurz warten, damit die Seite sichtbar ist, bevor der Browser den
    // Download-Dialog zeigt. Vermerkt wird der Start erst, wenn er wirklich
    // passiert: React führt Effekte in der Entwicklung doppelt aus, und ein
    // zu früh gesetzter Merker ließe den zweiten Lauf den Download
    // überspringen.
    const zeitgeber = window.setTimeout(() => {
      try {
        sessionStorage.setItem(merker, "1");
      } catch {
        // siehe oben
      }
      window.location.assign(url);
    }, 600);
    return () => window.clearTimeout(zeitgeber);
  }, [url]);

  return null;
}
