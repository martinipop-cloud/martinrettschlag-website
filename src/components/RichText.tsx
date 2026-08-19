import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

/**
 * Stellt die im CMS formatierten Texte dar (Absätze, Listen, Links, Zitate).
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed last:mb-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="display mt-12 mb-4 text-3xl first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 text-xl font-semibold first:mt-0">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-5 text-xl leading-relaxed italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-paper-raised px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          className="text-accent underline underline-offset-4"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value }: { value: PortableTextBlock[] | null }) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
