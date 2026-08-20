import { defineField, defineType } from "sanity";

/**
 * Website-Einstellungen (Kapitel 5.6 des Lastenhefts).
 * Einzeldokument – es existiert genau ein Eintrag dieser Art.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Website-Einstellungen",
  type: "document",
  groups: [
    { name: "texts", title: "Texte", default: true },
    { name: "contact", title: "Kontakt & Social" },
    { name: "seo", title: "Suchmaschinen" },
  ],
  fields: [
    defineField({
      name: "homeStatement",
      title: "Startseiten-Statement",
      description:
        "Der große Text-Einstieg auf der Startseite: wer du bist und was du machst.",
      type: "richText",
      group: "texts",
    }),
    defineField({
      name: "softwareIntro",
      title: "Einleitung Software-Bereich",
      description: "Kurzer Text über der Liste der Tools.",
      type: "richText",
      group: "texts",
    }),
    defineField({
      name: "thankYouText",
      title: "Text auf der Dankesseite",
      description:
        "Erscheint unter /danke — dorthin leitet PayPal nach einer Spende weiter. Bleibt das Feld leer, wird ein Standardtext angezeigt.",
      type: "richText",
      group: "texts",
    }),

    defineField({
      name: "contactEmail",
      title: "Kontakt-E-Mail",
      description:
        "Wird auf der Kontaktseite angezeigt und empfängt die Formularanfragen.",
      type: "string",
      group: "contact",
      initialValue: "hello@martinrettschlag.de",
      validation: (rule) =>
        rule.required().email().error("Bitte eine gültige E-Mail-Adresse angeben."),
    }),
    defineField({
      name: "location",
      title: "Standort / Arbeitsweise",
      description: "Zum Beispiel: „Berlin – remote und vor Ort“.",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube-Kanal",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "defaultPaypalUrl",
      title: "Standard-PayPal-Spendenlink",
      description:
        "Wird für alle Tools verwendet, bei denen kein eigener Link hinterlegt ist.",
      type: "url",
      group: "contact",
    }),

    defineField({
      name: "seoTitle",
      title: "Standard-Seitentitel",
      description:
        "Erscheint im Browser-Tab und in Suchergebnissen, wenn eine Seite keinen eigenen Titel hat.",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "Standard-Beschreibung",
      description: "Kurztext für Suchmaschinen, etwa 150 Zeichen.",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "ogImage",
      title: "Social-Vorschaubild",
      description:
        "Wird angezeigt, wenn ein Link zur Website geteilt wird. Empfohlen: 1200 × 630 Pixel.",
      type: "image",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Website-Einstellungen" }),
  },
});
