import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

/** Ein Textfeld mit deutscher und englischer Fassung. */
export type LocalizedString = { de?: string | null; en?: string | null } | null;

/** Ein formatierter Text mit deutscher und englischer Fassung. */
export type LocalizedRichText = {
  de?: PortableTextBlock[] | null;
  en?: PortableTextBlock[] | null;
} | null;

export type SanityImage = SanityImageSource & {
  alt?: string;
  caption?: string;
};

export type Category = {
  _id: string;
  name: LocalizedString;
  slug: string;
};

/** Die bewegte Vorschau einer Kachel — Video oder (noch) ein GIF. */
export type PreviewAsset = {
  url: string;
  extension: string | null;
  mimeType: string | null;
} | null;

/** Eine Rolle bzw. Leistung, zweisprachig gepflegt. */
export type RoleRef = {
  _id: string;
  name: { de?: string | null; en?: string | null } | null;
  order: number | null;
};

/** Daten für eine Projektkachel in den Übersichten. */
export type ProjectCardData = {
  _id: string;
  title: LocalizedString;
  slug: string;
  client: string;
  agency: string | null;
  roles: RoleRef[];
  previewStill: SanityImage | null;
  preview: PreviewAsset;
};

/** Daten für die Projekt-Detailseite. */
export type ProjectDetail = {
  _id: string;
  title: LocalizedString;
  slug: string;
  client: string;
  agency: string | null;
  roles: RoleRef[] | null;
  description: LocalizedRichText;
  /** "youtube" = eingebettetes YouTube-Video, "loop" = eigenes Loop-Video. */
  medium: "youtube" | "loop" | null;
  youtubeUrl: string | null;
  loop: { url: string; mimeType: string | null } | null;
  previewStill: SanityImage | null;
  gallery: SanityImage[] | null;
  categories: Pick<Category, "name" | "slug">[];
};

export type ProjectOrderEntry = {
  title: LocalizedString;
  slug: string;
};

/** Ein Tool im Software-Bereich. */
export type ToolData = {
  _id: string;
  name: LocalizedString;
  slug: string;
  shortDescription: LocalizedString;
  compatibility: LocalizedString;
  installation: LocalizedRichText;
  demoVideo: string | null;
  /** "kostenlos" = freier Download mit Spendenhinweis, "kauf" = Verkauf über Plattform. */
  vertrieb: "kostenlos" | "kauf" | null;
  preis: number | null;
  kaufUrl: string | null;
  paypalUrl: string | null;
  downloads: number | null;
  screenshots: (SanityImage & {
    dimensions?: { width: number; height: number } | null;
  })[] | null;
  datei: {
    url: string;
    originalFilename: string | null;
    size: number | null;
    extension: string | null;
  } | null;
};

/** Artikel in der Blogübersicht. */
export type PostCardData = {
  _id: string;
  title: LocalizedString;
  slug: string;
  excerpt: LocalizedString;
  publishedAt: string;
  coverImage: SanityImage | null;
};

/** Vollständiger Blogartikel. */
export type PostDetail = PostCardData & {
  body: LocalizedRichText;
};
