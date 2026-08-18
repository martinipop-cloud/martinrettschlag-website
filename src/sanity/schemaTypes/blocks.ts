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
