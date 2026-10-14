import { defineField, defineType } from "sanity";

/**
 * Referenzlisten für die Seite „Trust me“.
 * Einzeldokument – es existiert genau ein Eintrag dieser Art (ID „references“).
 */
export const references = defineType({
  name: "references",
  title: "Referenzen (Trust me)",
  type: "document",
  fields: [
    defineField({
      name: "brands",
      title: "Marken",
      description:
        "Kunden und Marken, für die du gearbeitet hast. Die Website zeigt die Namen in genau dieser Reihenfolge – per Ziehen am Griff links änderbar. Bleibt die Liste leer, entfällt die Spalte.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "partners",
      title: "Partner",
      description:
        "Agenturen und Produktionen, mit denen du gearbeitet hast. Erscheinen in genau dieser Reihenfolge auf der Website.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Referenzen (Trust me)" }),
  },
});
