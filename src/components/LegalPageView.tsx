import type { PortableTextBlock } from "@portabletext/react";

import { RichText } from "@/components/RichText";
import { client } from "@/sanity/lib/client";
import { legalPageQuery } from "@/sanity/lib/queries";

type LegalPage = {
  title: string;
  content: PortableTextBlock[] | null;
} | null;

export async function ladeRechtstext(slug: string): Promise<LegalPage> {
  return client.fetch<LegalPage>(legalPageQuery, { slug });
}

/**
 * Darstellung von Impressum und Datenschutzerklärung (F-701, F-702).
 * Die Texte werden im CMS gepflegt und liegen bewusst nicht im Code,
 * damit Aktualisierungen ohne Entwickler möglich sind.
 */
export function LegalPageView({
  seite,
  ersatzTitel,
}: {
  seite: LegalPage;
  ersatzTitel: string;
}) {
  return (
    <section className="mx-auto max-w-[900px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <h1 className="display text-[clamp(2rem,6vw,4rem)]">
        {seite?.title ?? ersatzTitel}
      </h1>

      {seite?.content ? (
        <div className="mt-12">
          <RichText value={seite.content} />
        </div>
      ) : (
        <div className="mt-12 border border-line bg-paper-raised p-6">
          <p className="meta">Noch nicht hinterlegt</p>
          <p className="mt-3 leading-relaxed text-muted">
            Dieser Text muss vor der Veröffentlichung der Website im CMS
            eingetragen werden — unter „Rechtstexte“. Für eine geschäftlich
            genutzte Website in Deutschland ist er gesetzlich vorgeschrieben.
          </p>
        </div>
      )}
    </section>
  );
}
