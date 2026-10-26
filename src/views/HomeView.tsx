import Image from "next/image";
import Link from "next/link";

import { HomeStatement } from "@/components/HomeStatement";
import { ProjectCard } from "@/components/ProjectCard";
import { RichText } from "@/components/RichText";
import { pfad, richText, type Sprache, text } from "@/lib/sprache";
import { texte } from "@/lib/texte";
import { client } from "@/sanity/lib/client";
import { hatBild, urlFor } from "@/sanity/lib/image";
import { featuredProjectsQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import type {
  LocalizedRichText,
  LocalizedString,
  ProjectCardData,
  SanityImage,
} from "@/sanity/lib/types";

type SiteSettings = {
  homeStatement: LocalizedRichText;
  bio: LocalizedRichText;
  portrait: SanityImage | null;
  location: LocalizedString;
} | null;

/**
 * Startseite (Kapitel 4.1): reduzierter Text-Einstieg, darunter die im CMS
 * ausgewählten Projekte.
 */
export async function HomeView({ sprache }: { sprache: Sprache }) {
  const t = texte(sprache);
  const [einstellungen, projekte] = await Promise.all([
    client.fetch<SiteSettings>(siteSettingsQuery),
    client.fetch<ProjectCardData[]>(featuredProjectsQuery),
  ]);

  const ort = text(einstellungen?.location ?? null, sprache);
  const statement = richText(einstellungen?.homeStatement ?? null, sprache);
  const bio = richText(einstellungen?.bio ?? null, sprache);
  const portrait = einstellungen?.portrait ?? null;

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="meta leading-relaxed">
            Animation, VFX and Digital Production
            {ort && (
              <>
                <br />
                {ort}
              </>
            )}
          </p>
          <p className="meta">Portfolio 2026</p>
        </div>

        {/* Die große Überschrift erscheint nur, wenn im CMS ein Statement
            hinterlegt ist. Ohne Statement steht hier eine unsichtbare
            Überschrift: Jede Seite braucht genau eine oberste Überschrift,
            sonst fehlt Suchmaschinen und Screenreadern die Einordnung. */}
        {statement ? (
          <h1 className="display mt-20 text-[clamp(3rem,13vw,12rem)] md:mt-32">
            <HomeStatement value={statement} />
          </h1>
        ) : (
          <h1 className="sr-only">
            Martin Rettschlag — Animation, VFX and Digital Production
          </h1>
        )}
      </section>

      {/* Kurzbiografie. Erscheint nur, wenn im CMS ein Text hinterlegt ist. */}
      {bio && (
        <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
          <div className="border-t border-line pt-10">
            <h2 className="meta">{t.ueberMich}</h2>

            <div
              className={`mt-8 gap-10 ${
                hatBild(portrait)
                  ? "grid grid-cols-1 md:grid-cols-[280px_1fr] md:gap-16"
                  : ""
              }`}
            >
              {hatBild(portrait) && (
                <Image
                  src={urlFor(portrait)
                    .width(560)
                    .height(700)
                    .fit("crop")
                    .auto("format")
                    .url()}
                  alt={
                    (portrait as { alt?: string }).alt ?? "Martin Rettschlag"
                  }
                  width={560}
                  height={700}
                  sizes="(min-width: 768px) 280px, 100vw"
                  className="h-auto w-full ring-1 ring-line"
                />
              )}

              {/* Erster Absatz als Einstieg: fett und etwas größer. */}
              <div className="max-w-2xl text-lg [&>p:first-child]:text-2xl [&>p:first-child]:leading-snug [&>p:first-child]:font-bold">
                <RichText value={bio} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="meta">01 — {t.ausgewaehlteArbeiten}</h2>
          <Link
            href={pfad("/work", sprache)}
            className="meta transition-colors hover:text-accent"
          >
            {t.alleProjekte} →
          </Link>
        </div>

        {projekte.length > 0 && (
          /* Raster: 3 Spalten Desktop, 2 Tablet, 1 Smartphone (F-201, F-817). */
          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projekte.map((projekt) => (
              <li key={projekt._id}>
                <ProjectCard project={projekt} sprache={sprache} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
