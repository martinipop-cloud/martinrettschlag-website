import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Work-Projekt (Kapitel 5.1 des Lastenhefts).
 *
 * Hinweis zum Veröffentlichen: Sanity trennt Entwurf und veröffentlichte Fassung
 * bereits von Haus aus. Solange ein Projekt nicht über „Publish“ freigegeben ist,
 * erscheint es nicht auf der Website. Ein zusätzliches Feld „Veröffentlicht“
 * wäre doppelt gemoppelt und wurde deshalb weggelassen.
 */
export const project = defineType({
  name: "project",
  title: "Projekt",
  type: "document",
  groups: [
    { name: "content", title: "Inhalt", default: true },
    { name: "media", title: "Medien" },
    { name: "settings", title: "Einstellungen" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adressteil (Slug)",
      description:
        "Bildet die Adresse der Projektseite, z. B. /work/mein-projekt. Wird aus dem Titel erzeugt.",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Kunde",
      description: "Auftraggeber oder Agentur. Wird unter dem Video angezeigt.",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "roles",
      title: "Rolle",
      description:
        "Eigene Aufgaben im Projekt, z. B. Animation, Design, Concept. Mehrere Einträge möglich.",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      description: "Steuert, unter welchem Filter das Projekt erscheint.",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beschreibung",
      type: "richText",
      group: "content",
    }),
    defineField({
      name: "year",
      title: "Jahr",
      description:
        "Optional. Wird aktuell nicht öffentlich angezeigt (siehe offener Punkt O-9).",
      type: "number",
      group: "content",
      validation: (rule) => rule.integer().min(1990).max(2100),
    }),

    defineField({
      name: "youtubeUrl",
      title: "YouTube-Adresse (URL)",
      description: "Link zum Video, das auf der Projektseite eingebettet wird.",
      type: "url",
      group: "media",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "previewAnimation",
      title: "Vorschau-Animation",
      description:
        "Bewegte Kachel-Vorschau als GIF oder WebP. Richtwert: höchstens 1,5 MB, damit die Übersicht schnell lädt.",
      type: "file",
      group: "media",
      options: { accept: "image/gif,image/webp" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "previewStill",
      title: "Vorschau-Standbild",
      description:
        "Wird verwendet, solange die Animation lädt, bei der Einstellung „Bewegung reduzieren“ und beim Teilen in sozialen Netzwerken.",
      type: "image",
      group: "media",
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
      name: "gallery",
      title: "Bildergalerie (Stills / Breakdowns)",
      description:
        "Werden auf der Projektseite untereinander angezeigt. Reihenfolge per Ziehen änderbar.",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "contentImage" })],
    }),

    defineField({
      name: "featured",
      title: "Auf Startseite zeigen",
      description:
        "Legt fest, ob dieses Projekt in der kuratierten Auswahl auf der Startseite erscheint.",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sortierung",
      description:
        "Reihenfolge in den Übersichten. Kleinere Zahl steht weiter vorne.",
      type: "number",
      group: "settings",
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Sortierung",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Titel A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      featured: "featured",
      media: "previewStill",
    },
    prepare: ({ title, client, featured, media }) => ({
      title,
      subtitle: [client, featured ? "★ Startseite" : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
