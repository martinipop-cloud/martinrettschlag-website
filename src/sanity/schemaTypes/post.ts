import { defineField, defineType } from "sanity";

/**
 * Blogartikel für den Bereich „What I Like“ (Kapitel 5.4 des Lastenhefts).
 * Entwürfe bleiben unsichtbar, solange sie nicht über „Publish“ freigegeben sind.
 */
export const post = defineType({
  name: "post",
  title: "Blogartikel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adressteil (Slug)",
      description: "Bildet die Adresse des Artikels, z. B. /blog/mein-artikel.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Titelbild",
      description:
        "Erscheint in der Artikelübersicht und beim Teilen des Links in sozialen Netzwerken.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternativtext",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Anrisstext",
      description:
        "Kurzfassung für die Übersicht und für Suchmaschinen. Zwei bis drei Sätze.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "publishedAt",
      title: "Veröffentlichungsdatum",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Artikeltext",
      type: "blogBody",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Neueste zuerst",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "publishedAt", media: "coverImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date
        ? new Date(date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Ohne Datum",
      media,
    }),
  },
});
