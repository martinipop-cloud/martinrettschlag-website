import type { Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { referencesQuery } from "@/sanity/lib/queries";

type References = {
  brands: string[] | null;
  partners: string[] | null;
} | null;

/** Leere Einträge entfernen; die Reihenfolge aus dem Studio bleibt erhalten. */
function bereinigt(namen: string[] | null | undefined) {
  return (namen ?? []).map((name) => name.trim()).filter(Boolean);
}

/**
 * Referenzlisten „Marken“ und „Partner“, gepflegt im Studio unter
 * „Referenzen (Trust me)“ – in genau der Reihenfolge, die dort per Ziehen
 * festgelegt ist. Leere Listen werden nicht angezeigt.
 *
 * Die Namen selbst sind Eigennamen und werden nicht übersetzt; nur die
 * Überschriften der beiden Listen wechseln die Sprache.
 */
export async function TrustMeView({ sprache }: { sprache: Sprache }) {
  const t = texte(sprache);
  const referenzen = await client.fetch<References>(referencesQuery);

  const listen = [
    { titel: t.marken, namen: bereinigt(referenzen?.brands) },
    { titel: t.partner, namen: bereinigt(referenzen?.partners) },
  ].filter((liste) => liste.namen.length > 0);

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">05 — {t.navTrustMe}</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        {t.navTrustMe}
      </h1>

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
        <p className="meta mt-16">{t.referenzenLeer}</p>
      )}
    </section>
  );
}
