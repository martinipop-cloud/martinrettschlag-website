import { NewsletterForm } from "@/components/NewsletterForm";
import { RichText } from "@/components/RichText";
import { ToolCard } from "@/components/ToolCard";
import { richText, type Sprache } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery, toolsQuery } from "@/sanity/lib/queries";
import type { LocalizedRichText, ToolData } from "@/sanity/lib/types";

type SiteSettings = {
  softwareIntro: LocalizedRichText;
  defaultPaypalUrl: string | null;
} | null;

/**
 * Software / Scripts (Kapitel 4.4).
 * Alle Tools auf einer Seite als Karten-Liste, kostenlos; der Download-Link
 * kommt über die E-Mail-Anmeldung (F-404n).
 */
export async function SoftwareView({ sprache }: { sprache: Sprache }) {
  const t = texte(sprache);
  const [tools, einstellungen] = await Promise.all([
    client.fetch<ToolData[]>(toolsQuery),
    client.fetch<SiteSettings>(siteSettingsQuery),
  ]);

  const einleitung = richText(einstellungen?.softwareIntro ?? null, sprache);

  // Lieber kein Anmeldefeld als eines, das nur eine Fehlermeldung ausgibt:
  // Solange die Zugangsdaten für den Versand fehlen, bleibt der Abschnitt
  // weg. Er erscheint von selbst, sobald sie hinterlegt sind.
  const newsletterBereit = Boolean(
    process.env.BREVO_API_KEY &&
    process.env.BREVO_LIST_ID &&
    process.env.NEWSLETTER_SECRET,
  );

  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">03 — {t.navSoftware}</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        {t.softwareTitel}
        <span className="script">{t.softwareTitelAkzent}</span>
      </h1>

      <div className="mt-10 max-w-2xl text-lg">
        {einleitung ? (
          <RichText value={einleitung} />
        ) : (
          <p className="leading-relaxed text-muted">{t.softwareEinleitung}</p>
        )}
      </div>

      {tools.length === 0 ? (
        <p className="mt-16 text-muted">{t.keineTools}</p>
      ) : (
        <ul className="mt-16 flex flex-col gap-10">
          {tools.map((tool) => (
            <li key={tool._id}>
              <ToolCard
                tool={tool}
                standardPaypalLink={einstellungen?.defaultPaypalUrl ?? null}
                sprache={sprache}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Anmeldung auch ohne Tool im Blick (F-908). Wer schon alles hat, soll
          sich eintragen können, ohne erst einen Download anzufordern. */}
      {newsletterBereit && (
        <div className="mt-24 border-t border-line pt-12 md:mt-32">
          <h2 className="display text-[clamp(1.75rem,6vw,3.5rem)]">
            {t.newsletterBlockKopf}
            <span className="script">{t.newsletterBlockKopfAkzent}</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed">
            {t.newsletterBlockText}
          </p>
          <div className="mt-10">
            <NewsletterForm sprache={sprache} />
          </div>
        </div>
      )}
    </section>
  );
}
