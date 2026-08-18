import { defineField, defineType } from "sanity";

/**
 * Kategorie für den Work-Filter (F-202, F-203).
 * Kategorien können jederzeit ergänzt oder umbenannt werden.
 */
export const category = defineType({
  name: "category",
  title: "Kategorie",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "Beschriftung des Filter-Buttons, z. B. „Commercial“.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adressteil (Slug)",
      description:
        "Wird automatisch aus dem Namen erzeugt und taucht im Filter-Link auf.",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sortierung",
      description:
        "Reihenfolge der Filter-Buttons. Kleinere Zahl steht weiter links.",
      type: "number",
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
  ],
  preview: {
    select: { title: "name", subtitle: "order" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: `Position ${subtitle}`,
    }),
  },
});
