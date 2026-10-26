import { defineField, defineType } from "sanity";

/**
 * Impressum, Datenschutzerklärung, AGB und Rückgaberichtlinie (Kapitel 5.7, F-701).
 *
 * AGB und Rückgabe kamen mit dem Verkauf dazu: der Zahlungsdienstleister gibt
 * den Verkauf erst frei, wenn beide Texte öffentlich auf der Seite stehen.
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
        "Muss „impressum“, „datenschutz“, „agb“ oder „rueckgabe“ lauten, damit die Seite unter der richtigen Adresse erscheint.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Inhalt",
      description:
        "Ohne englische Fassung erscheint auch auf der englischen Seite der deutsche Text. Bei Impressum und Datenschutzerklärung ist die deutsche Fassung ohnehin die rechtlich maßgebliche.",
      type: "localizedRichText",
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
