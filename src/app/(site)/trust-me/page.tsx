import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { referencesQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Trust me",
  description: "Marken und Partner, mit denen Martin Rettschlag gearbeitet hat.",
};

export const revalidate = 60;

type References = {
  brands: string[] | null;
  partners: string[] | null;
} | null;

/** Alphabetisch nach deutscher Sortierung, Groß-/Kleinschreibung egal. */
function sortiert(namen: string[] | null | undefined) {
  return (namen ?? [])
    .map((name) => name.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "de", { sensitivity: "base" }));
}

/**
 * Referenzlisten „Marken“ und „Partner“, gepflegt im Studio unter
 * „Referenzen (Trust me)“. Leere Listen werden nicht angezeigt.
 */
export default async function TrustMePage() {
  const referenzen = await client.fetch<References>(referencesQuery);

  const listen = [
    { titel: "Marken", namen: sortiert(referenzen?.brands) },
    { titel: "Partner", namen: sortiert(referenzen?.partners) },
  ].filter((liste) => liste.namen.length > 0);

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">05 — Trust me</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">Trust me</h1>

      {listen.length > 0 ? (
        <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-10">
          {listen.map((liste) => (
            <div key={liste.titel}>
              <h2 className="meta border-b border-line pb-4">
                {liste.titel} — {liste.namen.length}
              </h2>
              <ul className="mt-6 flex flex-col gap-1.5 text-lg">
                {liste.namen.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="meta mt-16">Hier entstehen gerade die Referenzen.</p>
      )}
    </section>
  );
}
