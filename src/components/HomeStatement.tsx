import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

/**
 * Das große Statement auf der Startseite (F-101).
 *
 * Besonderheit: Was im CMS *kursiv* ausgezeichnet wird, erscheint hier im
 * blauen Schreibschrift-Stil. So lässt sich der Akzent aus dem Moodboard
 * direkt beim Schreiben setzen, ohne dass dafür Code geändert werden muss.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <span className="block">{children}</span>
    ),
  },
  marks: {
    em: ({ children }) => <span className="script">{children}</span>,
    strong: ({ children }) => <span>{children}</span>,
  },
};

/**
 * Ohne Text im CMS erscheint gar keine Überschrift — kein Ersatztext.
 * Die Startseite beginnt dann direkt mit der Kurzbiografie.
 */
export function HomeStatement({
  value,
}: {
  value: PortableTextBlock[] | null;
}) {
  if (!value || value.length === 0) return null;

  return <PortableText value={value} components={components} />;
}
