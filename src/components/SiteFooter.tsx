import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

type SiteSettings = {
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
} | null;

/**
 * Fußzeile mit Social-Links und den rechtlich verpflichtenden Seiten (F-702).
 *
 * Die Adressen kommen aus den Website-Einstellungen im CMS — denselben
 * Feldern, aus denen sich auch die Kontaktseite bedient. Nicht gepflegte
 * Einträge werden weggelassen, statt ins Leere zu führen.
 */
export async function SiteFooter() {
  const einstellungen = await client.fetch<SiteSettings>(siteSettingsQuery);

  const socialLinks = [
    { href: einstellungen?.instagramUrl, label: "Instagram" },
    { href: einstellungen?.youtubeUrl, label: "YouTube" },
    { href: einstellungen?.linkedinUrl, label: "LinkedIn" },
  ].filter((link): link is { href: string; label: string } =>
    Boolean(link.href),
  );

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        {socialLinks.length > 0 ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  // Öffnet in einem neuen Tab, damit die Website geöffnet bleibt.
                  // rel schützt die Seite vor Zugriff durch das neue Fenster.
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta transition-colors hover:text-accent"
                >
                  {link.label}
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          // Platzhalter, damit die Rechtslinks rechts stehen bleiben.
          <div />
        )}

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link
              href="/impressum"
              className="meta transition-colors hover:text-accent"
            >
              Impressum
            </Link>
          </li>
          <li>
            <Link
              href="/datenschutz"
              className="meta transition-colors hover:text-accent"
            >
              Datenschutz
            </Link>
          </li>
          <li>
            <span className="meta">
              © {new Date().getFullYear()} Martin Rettschlag
            </span>
          </li>
        </ul>
      </div>
    </footer>
  );
}
