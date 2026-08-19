import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

export type SanityImage = SanityImageSource & {
  alt?: string;
  caption?: string;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
};

/** Die bewegte Vorschau einer Kachel — Video oder (noch) ein GIF. */
export type PreviewAsset = {
  url: string;
  extension: string | null;
  mimeType: string | null;
} | null;

/** Daten für eine Projektkachel in den Übersichten. */
export type ProjectCardData = {
  _id: string;
  title: string;
  slug: string;
  client: string;
  category: Pick<Category, "name" | "slug"> | null;
  previewStill: SanityImage | null;
  preview: PreviewAsset;
};

/** Daten für die Projekt-Detailseite. */
export type ProjectDetail = {
  _id: string;
  title: string;
  slug: string;
  client: string;
  roles: string[] | null;
  description: PortableTextBlock[] | null;
  youtubeUrl: string | null;
  previewStill: SanityImage | null;
  gallery: SanityImage[] | null;
  category: Pick<Category, "name" | "slug"> | null;
};

export type ProjectOrderEntry = {
  title: string;
  slug: string;
};
