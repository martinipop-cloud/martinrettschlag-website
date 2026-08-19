/**
 * Einfache Ratenbegrenzung gegen Missbrauch des Kontaktformulars (F-607, N-43).
 *
 * Die Zählung liegt im Arbeitsspeicher. Das genügt für ein Portfolio mit
 * überschaubarem Aufkommen. Bei mehreren gleichzeitig laufenden Server-
 * Instanzen zählt jede für sich – als Bremse gegen automatisiertes Zumüllen
 * reicht das, in Kombination mit dem Honeypot-Feld im Formular.
 */
const fenster = new Map<string, { anzahl: number; zuruecksetzenUm: number }>();

const FENSTER_MS = 60 * 60 * 1000; // eine Stunde
const MAX_ANFRAGEN = 5;

export function pruefeRatenbegrenzung(kennung: string): {
  erlaubt: boolean;
  verbleibend: number;
} {
  const jetzt = Date.now();
  const eintrag = fenster.get(kennung);

  if (!eintrag || jetzt > eintrag.zuruecksetzenUm) {
    fenster.set(kennung, { anzahl: 1, zuruecksetzenUm: jetzt + FENSTER_MS });
    return { erlaubt: true, verbleibend: MAX_ANFRAGEN - 1 };
  }

  if (eintrag.anzahl >= MAX_ANFRAGEN) {
    return { erlaubt: false, verbleibend: 0 };
  }

  eintrag.anzahl += 1;
  return { erlaubt: true, verbleibend: MAX_ANFRAGEN - eintrag.anzahl };
}

/** Räumt abgelaufene Einträge auf, damit die Liste nicht unbegrenzt wächst. */
export function aufraeumen() {
  const jetzt = Date.now();
  for (const [kennung, eintrag] of fenster) {
    if (jetzt > eintrag.zuruecksetzenUm) fenster.delete(kennung);
  }
}
