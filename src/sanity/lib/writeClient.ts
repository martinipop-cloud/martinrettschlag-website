import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

/**
 * Schreibender Zugang zur Datenbank – ausschließlich serverseitig.
 *
 * Der Token darf niemals in den Browser gelangen. Der Import von
 * "server-only" sorgt dafür, dass der Build abbricht, falls diese Datei
 * versehentlich aus einer Browser-Komponente heraus verwendet wird (N-42).
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export function hatSchreibrechte(): boolean {
  return Boolean(process.env.SANITY_API_WRITE_TOKEN);
}
