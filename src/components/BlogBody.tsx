import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import Image from "next/image";

import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { getYouTubeId } from "@/lib/youtube";
import { urlFor } from "@/sanity/lib/image";

/**
 * Darstellung eines Blogartikels (F-503 bis F-506).
 * Neben Fließtext werden Bilder, YouTube-Videos und Codeblöcke unterstützt.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="display mt-14 mb-5 text-3xl md:text-4xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 text-xl font-semibold">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-accent pl-6 text-xl leading-relaxed italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-5">{children}</ol>
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
  types: {
    contentImage: ({ value }) => {
      const masse = value?.dimensions ?? { width: 1600, height: 1067 };
      return (
        <figure className="my-10">
          <Image
            src={urlFor(value).width(1400).fit("max").auto("format").url()}
            alt={value?.alt ?? ""}
            width={masse.width}
            height={masse.height}
            sizes="(min-width: 1024px) 800px, 100vw"
            className="h-auto w-full ring-1 ring-line"
          />
          {value?.caption && (
            <figcaption className="meta mt-3">{value.caption}</figcaption>
          )}
        </figure>
      );
    },

    youtubeEmbed: ({ value }) => {
      const videoId = getYouTubeId(value?.url);
      if (!videoId) return null;
      return (
        <figure className="my-10">
          <YouTubeEmbed
            videoId={videoId}
            title={value?.caption ?? "Video"}
            posterUrl={null}
          />
          {value?.caption && (
            <figcaption className="meta mt-3">{value.caption}</figcaption>
          )}
        </figure>
      );
    },

    code: ({ value }) => (
      <figure className="my-10">
        {value?.filename && <p className="meta mb-2">{value.filename}</p>}
        <pre className="overflow-x-auto rounded border border-line bg-paper-raised p-5 text-sm">
          <code className="font-mono">{value?.code}</code>
        </pre>
      </figure>
    ),
  },
};

export function BlogBody({ value }: { value: PortableTextBlock[] | null }) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}

/**
 * Grobe Schätzung der Lesedauer aus der Textmenge (F-507).
 * Grundlage: etwa 200 Wörter pro Minute.
 */
export function lesedauerMinuten(value: PortableTextBlock[] | null): number {
  if (!value) return 1;

  const woerter = value
    .filter((block) => block._type === "block")
    .flatMap((block) => {
      const kinder = (block as { children?: { text?: string }[] }).children ?? [];
      return kinder.map((kind) => kind.text ?? "");
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(woerter / 200));
}
