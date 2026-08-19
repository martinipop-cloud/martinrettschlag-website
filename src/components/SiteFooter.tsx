import Link from "next/link";

/**
 * Fußzeile mit Social-Links und den rechtlich verpflichtenden Seiten (F-702).
 * Die Adressen kommen später aus den Website-Einstellungen im CMS.
 */
const socialLinks = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://youtube.com", label: "YouTube" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socialLinks.map((link) => (
            <li key={link.href}>
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
