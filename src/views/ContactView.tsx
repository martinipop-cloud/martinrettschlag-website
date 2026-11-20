import { type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { LocalizedString } from "@/sanity/lib/types";

type SiteSettings = {
  contactEmail: string | null;
  location: LocalizedString;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
} | null;

/**
 * Kontaktseite (Kapitel 4.6): Mailadresse, Standort und Social-Links.
 *
 * Seit A-11 ohne Formular. Die Adresse ist damit der einzige Weg von dieser
 * Seite aus und steht deshalb groß und als erstes. Bewusst weiterhin ohne
 * Portraitfoto und ohne Verfügbarkeitsstatus (F-612).
 */
export async function ContactView({ sprache }: { sprache: Sprache }) {
  const t = texte(sprache);
  const einstellungen = await client.fetch<SiteSettings>(siteSettingsQuery);
  const email = einstellungen?.contactEmail ?? "hello@martinrettschlag.de";
  const ort = text(einstellungen?.location ?? null, sprache);

  const socialLinks = [
    { href: einstellungen?.instagramUrl, label: "Instagram" },
    { href: einstellungen?.youtubeUrl, label: "YouTube" },
    { href: einstellungen?.linkedinUrl, label: "LinkedIn" },
  ].filter((link): link is { href: string; label: string } =>
    Boolean(link.href),
  );

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">06 — {t.navContact}</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        {t.kontaktTitel}
      </h1>

      <div className="mt-16 border-t border-line pt-10">
        <h2 className="meta">{t.direkt}</h2>
        {/* Die Adresse darf umbrechen: Auf schmalen Bildschirmen passt sie
            sonst nicht in eine Zeile und schöbe die Seite seitwärts. */}
        <a
          href={`mailto:${email}`}
          className="display mt-4 block text-[clamp(1.5rem,5vw,3.5rem)] break-words text-accent underline-offset-8 hover:underline"
        >
          {email}
        </a>
        <p className="mt-6 max-w-xl text-lg">{t.kontaktHinweis}</p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-line pt-10 sm:grid-cols-2">
        {ort && (
          <div>
            <h2 className="meta">{t.standort}</h2>
            <p className="mt-3 text-lg">{ort}</p>
          </div>
        )}

        {socialLinks.length > 0 && (
          <div>
            <h2 className="meta">{t.social}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg transition-colors hover:text-accent"
                  >
                    {link.label}
                    <span className="sr-only"> {t.oeffnetNeuerTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
