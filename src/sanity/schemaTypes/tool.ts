import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Software / Script zum kostenlosen Download (Kapitel 5.3 des Lastenhefts).
 * Der Download ist immer frei; die Spende bleibt freiwillig (F-404, F-409).
 */
export const tool = defineType({
  name: "tool",
  title: "Software / Script",
  type: "document",
  groups: [
    { name: "content", title: "Inhalt", default: true },
    { name: "media", title: "Medien" },
    { name: "settings", title: "Einstellungen" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adressteil (Slug)",
      description: "Wird für die Verlinkung innerhalb der Seite verwendet.",
      type: "slug",
      group: "content",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Kurzbeschreibung",
      description: "Ein bis zwei Sätze. Erscheint direkt auf der Karte.",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "compatibility",
      title: "Kompatibilität",
      description:
        "Womit läuft das Tool? Zum Beispiel: „After Effects ab CC 2022, Windows & macOS“.",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "installation",
      title: "Installationsanleitung",
      description:
        "Schritt-für-Schritt-Anleitung. Wird auf der Karte zum Aufklappen angeboten.",
      type: "richText",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "downloadFile",
      title: "Download-Datei",
      description:
        "Die eigentliche Datei, z. B. .jsx oder .zip. Richtwert: bis etwa 20 MB.",
      type: "file",
      group: "media",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "demoVideo",
      title: "Demo-Video (YouTube)",
      description: "Optional: zeigt das Tool in Aktion.",
      type: "url",
      group: "media",
    }),
    defineField({
      name: "screenshots",
      title: "Screenshots",
      description:
        "Optional. Werden untereinander angezeigt, nicht als seitwärts scrollender Streifen.",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "contentImage" })],
    }),

    defineField({
      name: "paypalUrl",
      title: "PayPal-Spendenlink",
      description:
        "Ziel des Spenden-Buttons. Bleibt das Feld leer, wird der Standardlink aus den Website-Einstellungen verwendet.",
      type: "url",
      group: "settings",
    }),
    defineField({
      name: "order",
      title: "Sortierung",
      description: "Reihenfolge in der Liste. Kleinere Zahl steht weiter oben.",
      type: "number",
      group: "settings",
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "downloads",
      title: "Downloads",
      description:
        "Anonymer Zähler. Wird automatisch hochgezählt und sollte nicht von Hand geändert werden.",
      type: "number",
      group: "settings",
      readOnly: true,
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sortierung",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "compatibility" },
  },
});
