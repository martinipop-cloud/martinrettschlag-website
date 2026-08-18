import { defineField, defineType } from "sanity";

/**
 * Impressum und Datenschutzerklärung (Kapitel 5.7, F-701).
 * Die Texte sind im CMS pflegbar, damit Aktualisierungen ohne Entwickler möglich sind.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Rechtstext",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      description: "Zum Beispiel „Impressum“ oder „Datenschutzerklärung“.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adressteil (Slug)",
      description:
        "Muss „impressum“ oder „datenschutz“ lauten, damit die Seite unter der richtigen Adresse erscheint.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Inhalt",
      type: "richText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `/${subtitle}` : undefined,
    }),
  },
});
