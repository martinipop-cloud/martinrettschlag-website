import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Einfacher Fließtext: Absätze, Fettung, Kursiv, Links.
 * Für Projektbeschreibungen, Einleitungstexte und Anleitungen.
 */
export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Absatz", value: "normal" },
        { title: "Zwischenüberschrift", value: "h3" },
        { title: "Zitat", value: "blockquote" },
      ],
      lists: [
        { title: "Aufzählung", value: "bullet" },
        { title: "Nummerierte Liste", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Fett", value: "strong" },
          { title: "Kursiv", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Adresse (URL)",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({ scheme: ["http", "https", "mailto"] }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});

/**
 * YouTube-Einbettung als Baustein innerhalb von Blogartikeln (F-505).
 */
export const youtubeEmbed = defineType({
  name: "youtubeEmbed",
  title: "YouTube-Video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "YouTube-Adresse (URL)",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Bildunterschrift",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "url", subtitle: "caption" },
    prepare: ({ title, subtitle }) => ({
      title: title || "YouTube-Video",
      subtitle,
    }),
  },
});

/**
 * Bild innerhalb eines Blogartikels, mit Pflicht-Alternativtext (N-21)
 * und optionaler Bildunterschrift (F-504).
 */
export const contentImage = defineType({
  name: "contentImage",
  title: "Bild",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternativtext",
      description:
        "Beschreibt das Bild für Screenreader und wenn das Bild nicht lädt. Pflichtangabe.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Bildunterschrift",
      description: "Wird sichtbar unter dem Bild angezeigt. Optional.",
      type: "string",
    }),
  ],
});

/**
 * Kurzer, stummer Clip innerhalb der Projektgalerie.
 *
 * Sieht im Raster genauso aus wie ein Screenshot, bewegt sich aber. Gedacht
 * für Ausschnitte, bei denen ein Standbild die Arbeit nicht zeigen kann.
 */
export const galleryVideo = defineType({
  name: "galleryVideo",
  title: "Clip",
  type: "object",
  fields: [
    defineField({
      name: "video",
      title: "Videodatei",
      description:
        "Kurzer, stummer Loop als MP4 oder WebM (3–10 Sekunden). Richtwert: unter 2 MB, 1280 Pixel Breite reichen für die Kachel.",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternativtext",
      description:
        "Beschreibt, was im Clip zu sehen ist. Für Screenreader und Suchmaschinen.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Bildunterschrift",
      description: "Wird unter dem Clip angezeigt. Optional.",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "alt", subtitle: "caption" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Clip",
      subtitle: subtitle ?? "Clip",
    }),
  },
});

/**
 * Voller Artikeltext für den Blog: Fließtext plus Bilder, Videos und Codeblöcke.
 */
export const blogBody = defineType({
  name: "blogBody",
  title: "Artikeltext",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Absatz", value: "normal" },
        { title: "Überschrift 2", value: "h2" },
        { title: "Überschrift 3", value: "h3" },
        { title: "Zitat", value: "blockquote" },
      ],
      lists: [
        { title: "Aufzählung", value: "bullet" },
        { title: "Nummerierte Liste", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Fett", value: "strong" },
          { title: "Kursiv", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Adresse (URL)",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({ scheme: ["http", "https", "mailto"] }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "contentImage" }),
    defineArrayMember({ type: "youtubeEmbed" }),
    defineArrayMember({ type: "code", title: "Codeblock" }),
  ],
});
