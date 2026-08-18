import Link from "next/link";

/**
 * Fußzeile mit Social-Links und den rechtlich verpflichtenden Seiten (F-702).
 * Die Adressen kommen später aus den Website-Einstellungen im CMS.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a
              href="https://instagram.com"
              className="meta transition-colors hover:text-accent"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://youtube.com"
              className="meta transition-colors hover:text-accent"
            >
              YouTube
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com"
              className="meta transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          </li>
        </ul>

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
