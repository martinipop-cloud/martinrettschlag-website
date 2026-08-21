import { defineQuery } from "next-sanity";

/** Felder, die für eine Projektkachel in den Übersichten gebraucht werden. */
const cardFields = `
  _id,
  title,
  "slug": slug.current,
  client,
  "category": category->{name, "slug": slug.current},
  previewStill,
  "preview": previewAnimation.asset->{url, extension, mimeType}
`;

/**
 * Alle Projekte, optional auf eine Kategorie eingeschränkt (F-202).
 * Ohne Kategorie ($kategorie = null) werden alle zurückgegeben.
 */
export const projectsQuery = defineQuery(`
  *[_type == "project" && ($kategorie == null || category->slug.current == $kategorie)]
    | order(order asc, title asc) {
    ${cardFields}
  }
`);

/** Kuratierte Auswahl für die Startseite (F-102, F-103). */
export const featuredProjectsQuery = defineQuery(`
  *[_type == "project" && featured == true] | order(order asc, title asc)[0...6] {
    ${cardFields}
  }
`);

/** Kategorien für die Filter-Buttons (F-203). */
export const categoriesQuery = defineQuery(`
  *[_type == "category"] | order(order asc, name asc) {
    _id, name, "slug": slug.current
  }
`);

/** Einzelnes Projekt für die Detailseite (Kapitel 4.3). */
export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    client,
    roles,
    description,
    youtubeUrl,
    previewStill,
    gallery[]{
      ...,
      _type == "contentImage" => {
        "dimensions": asset->metadata.dimensions
      },
      _type == "galleryVideo" => {
        "videoUrl": video.asset->url,
        "mimeType": video.asset->mimeType
      }
    },
    "category": category->{name, "slug": slug.current}
  }
`);

/**
 * Reihenfolge aller Projekte – daraus wird auf der Detailseite
 * das vorherige und nächste Projekt bestimmt (F-307).
 */
export const projectOrderQuery = defineQuery(`
  *[_type == "project"] | order(order asc, title asc) {
    title, "slug": slug.current
  }
`);

/** Alle Slugs, um die Detailseiten beim Bauen vorzuerzeugen. */
export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`);

/** Alle Tools für den Software-Bereich (Kapitel 4.4). */
export const toolsQuery = defineQuery(`
  *[_type == "tool"] | order(order asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    compatibility,
    installation,
    demoVideo,
    paypalUrl,
    downloads,
    screenshots[]{
      ...,
      "dimensions": asset->metadata.dimensions
    },
    "datei": downloadFile.asset->{url, originalFilename, size, extension}
  }
`);

/** Artikelübersicht „What I Like“, neueste zuerst (F-501, F-502). */
export const postsQuery = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage
  }
`);

/** Einzelner Blogartikel (F-503 bis F-506). */
export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    body[]{
      ...,
      _type == "contentImage" => {
        "dimensions": asset->metadata.dimensions
      }
    }
  }
`);

/** Alle Artikel-Slugs, um die Detailseiten beim Bauen vorzuerzeugen. */
export const postSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`);

/** Impressum bzw. Datenschutzerklärung, ausgewählt über den Adressteil. */
export const legalPageQuery = defineQuery(`
  *[_type == "legalPage" && slug.current == $slug][0] {
    title, content
  }
`);

/** Einstellungen der Website (Einzeldokument). */
export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    homeStatement,
    bio,
    portrait,
    softwareIntro,
    thankYouText,
    contactEmail,
    location,
    instagramUrl,
    youtubeUrl,
    linkedinUrl,
    defaultPaypalUrl,
    seoTitle,
    seoDescription,
    ogImage
  }
`);
