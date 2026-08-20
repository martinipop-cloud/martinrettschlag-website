import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/react";

import { RichText } from "@/components/RichText";
import { ToolCard } from "@/components/ToolCard";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery, toolsQuery } from "@/sanity/lib/queries";
import type { ToolData } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "Software",
  description:
    "Kostenlose Plugins und Scripts für Motion Designer — Download frei, Spende freiwillig.",
};

export const revalidate = 60;

type SiteSettings = {
  softwareIntro: PortableTextBlock[] | null;
  defaultPaypalUrl: string | null;
} | null;

/**
 * Software / Scripts (Kapitel 4.4).
 * Alle Tools auf einer Seite als Karten-Liste, Downloads frei zugänglich.
 */
export default async function SoftwarePage() {
  const [tools, einstellungen] = await Promise.all([
    client.fetch<ToolData[]>(toolsQuery),
    client.fetch<SiteSettings>(siteSettingsQuery),
  ]);

  return (
    <section className="mx-auto max-w-[1200px] px-5 pt-12 pb-28 md:px-10 md:pt-20">
      <p className="meta">03 — Software</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,9vw,7rem)]">
        Tools & <span className="script">Scripts</span>
      </h1>

      <div className="mt-10 max-w-2xl text-lg">
        {einstellungen?.softwareIntro ? (
          <RichText value={einstellungen.softwareIntro} />
        ) : (
          <p className="leading-relaxed text-muted">
            Kleine Helfer aus der täglichen Arbeit. Alle Downloads sind
            kostenlos und ohne Anmeldung nutzbar.
          </p>
        )}
      </div>

      {tools.length === 0 ? (
        <p className="mt-16 text-muted">
          Hier erscheinen demnächst die ersten Tools.
        </p>
      ) : (
        <ul className="mt-16 flex flex-col gap-10">
          {tools.map((tool) => (
            <li key={tool._id}>
              <ToolCard
                tool={tool}
                standardPaypalLink={einstellungen?.defaultPaypalUrl ?? null}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
