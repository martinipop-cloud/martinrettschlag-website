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
      description:
        "Beschriftung des Filter-Buttons. Fehlt die englische Fassung, wird die deutsche gezeigt.",
      type: "localizedString",
      validation: (rule) =>
        rule.custom((wert) => {
          const de = (wert as { de?: string } | undefined)?.de?.trim();
          return de ? true : "Der deutsche Name wird benötigt.";
        }),
    }),
    defineField({
      name: "slug",
      title: "Adressteil (Slug)",
      description:
        "Taucht im Filter-Link auf und gilt für beide Sprachen.",
      type: "slug",
      options: {
        source: (doc: Record<string, unknown>) =>
          (doc.name as { de?: string } | undefined)?.de ?? "",
        maxLength: 96,
      },
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
    select: { de: "name.de", en: "name.en", order: "order" },
    prepare: ({ de, en, order }) => ({
      title: de ?? "(ohne Namen)",
      subtitle: [en ? `EN: ${en}` : "EN fehlt", `Position ${order}`].join(" · "),
    }),
  },
});
