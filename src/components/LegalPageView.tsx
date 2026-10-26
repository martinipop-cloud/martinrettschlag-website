import { RichText } from "@/components/RichText";
import { richText, STANDARDSPRACHE, type Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { legalPageQuery } from "@/sanity/lib/queries";
import type { LocalizedRichText } from "@/sanity/lib/types";

type LegalPage = {
  title: string;
  content: LocalizedRichText;
} | null;

export async function ladeRechtstext(slug: string): Promise<LegalPage> {
  return client.fetch<LegalPage>(legalPageQuery, { slug });
}

/**
 * Darstellung der Rechtstexte (F-701, F-702).
 * Die Texte werden im CMS gepflegt und liegen bewusst nicht im Code,
 * damit Aktualisierungen ohne Entwickler möglich sind.
 *
 * Ohne englische Fassung erscheint auch auf der englischen Seite der deutsche
 * Text — bei Impressum und Datenschutzerklärung ist die deutsche Fassung
 * ohnehin die rechtlich maßgebliche.
 */
export function LegalPageView({
  seite,
  ersatzTitel,
  sprache = STANDARDSPRACHE,
}: {
  seite: LegalPage;
  ersatzTitel: string;
  sprache?: Sprache;
}) {
  const inhalt = richText(seite?.content ?? null, sprache);

  return (
    <section className="mx-auto max-w-[900px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <h1 className="display text-[clamp(2rem,6vw,4rem)]">
        {seite?.title ?? ersatzTitel}
      </h1>

      {inhalt ? (
        <div className="mt-12">
          <RichText value={inhalt} />
        </div>
      ) : (
        <div className="mt-12 border border-line bg-paper-raised p-6">
          <p className="meta">{texte(sprache).nochNichtHinterlegt}</p>
          <p className="mt-3 leading-relaxed text-muted">
            {texte(sprache).rechtstextFehlt}
          </p>
        </div>
      )}
    </section>
  );
}
