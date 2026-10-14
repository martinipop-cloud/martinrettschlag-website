import type { Metadata } from "next";
import Image from "next/image";

import { ContactForm } from "@/components/ContactForm";
import { RichText } from "@/components/RichText";
import { client } from "@/sanity/lib/client";
import { hatBild, urlFor } from "@/sanity/lib/image";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SanityImage } from "@/sanity/lib/types";
import type { PortableTextBlock } from "@portabletext/react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Anfragen und Kontakt zu Martin Rettschlag.",
};

export const revalidate = 60;

type SiteSettings = {
  bio: PortableTextBlock[] | null;
  portrait: SanityImage | null;
  contactEmail: string | null;
  location: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
} | null;

/**
 * Kontaktseite (Kapitel 4.6): oben Kurzbiografie mit Portrait, darunter
 * Formular, Mailadresse, Standort und Social-Links. Ohne Verfügbarkeitsstatus
 * (F-612). Das Portrait steht hier abweichend von F-612 auf Wunsch des
 * Auftraggebers (Oktober 2026).
 */
export default async function ContactPage() {
  const einstellungen = await client.fetch<SiteSettings>(siteSettingsQuery);
  const email = einstellungen?.contactEmail ?? "hello@martinrettschlag.de";

  const socialLinks = [
    { href: einstellungen?.instagramUrl, label: "Instagram" },
    { href: einstellungen?.youtubeUrl, label: "YouTube" },
    { href: einstellungen?.linkedinUrl, label: "LinkedIn" },
  ].filter((link): link is { href: string; label: string } =>
    Boolean(link.href),
  );

  return (
    <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">06 — Contact</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">Kontakt</h1>

      {/* Kurzbiografie mit Portrait. Erscheint nur, wenn im CMS ein Text
          hinterlegt ist; ohne Bild läuft der Text über die volle Breite. */}
      {einstellungen?.bio && (
        <div
          className={`mt-16 border-b border-line pb-16 ${
            hatBild(einstellungen.portrait)
              ? "grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr] md:gap-16"
              : ""
          }`}
        >
          {hatBild(einstellungen.portrait) && (
            <Image
              src={urlFor(einstellungen.portrait)
                .width(560)
                .height(700)
                .fit("crop")
                .auto("format")
                .url()}
              alt={
                (einstellungen.portrait as { alt?: string }).alt?.trim() ||
                "Martin Rettschlag"
              }
              width={560}
              height={700}
              sizes="(min-width: 768px) 280px, 100vw"
              className="h-auto w-full max-w-[280px] ring-1 ring-line"
            />
          )}

          <div className="max-w-2xl text-lg">
            <RichText value={einstellungen.bio} />
          </div>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
        <div>
          <ContactForm kontaktEmail={email} />
        </div>

        <aside className="lg:w-72">
          <h2 className="meta">Direkt</h2>
          <a
            href={`mailto:${email}`}
            className="mt-3 block text-lg text-accent underline-offset-4 hover:underline"
          >
            {email}
          </a>

          {einstellungen?.location && (
            <>
              <h2 className="meta mt-10">Standort</h2>
              <p className="mt-3 text-lg">{einstellungen.location}</p>
            </>
          )}

          {socialLinks.length > 0 && (
            <>
              <h2 className="meta mt-10">Social</h2>
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
                      <span className="sr-only"> (öffnet in neuem Tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
