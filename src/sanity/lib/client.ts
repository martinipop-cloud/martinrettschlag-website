import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

/**
 * Lesender Zugang zur Datenbank – ausschließlich serverseitig.
 *
 * Wichtig zum Datenschutz: Sobald Kontaktanfragen im CMS gespeichert werden,
 * muss der Datensatz bei Sanity auf „privat“ stehen. Sonst könnte jeder mit
 * Kenntnis der Projekt-ID sämtliche Anfragen samt Namen, Adressen und
 * Nachrichten über die öffentliche Schnittstelle auslesen.
 *
 * Für einen privaten Datensatz wird ein Lese-Token benötigt. Es liegt
 * ausschließlich in einer Umgebungsvariablen und gelangt nie in den Browser –
 * "server-only" lässt den Build scheitern, falls diese Datei versehentlich
 * aus einer Browser-Komponente heraus verwendet wird (N-42).
 */
const token = process.env.SANITY_API_READ_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Ohne Token darf der schnelle CDN-Weg genutzt werden. Mit Token wird direkt
  // abgefragt, damit keine authentifizierten Antworten zwischengespeichert werden.
  useCdn: !token,
  // Nur veröffentlichte Inhalte ausliefern – Entwürfe bleiben auf der Website unsichtbar.
  perspective: "published",
  token,
});
