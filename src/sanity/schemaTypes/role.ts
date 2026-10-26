import { defineField, defineType } from "sanity";

/**
 * Rolle bzw. Leistung in einem Projekt — etwa Animation, Schnitt, Kamera.
 *
 * Bewusst ein eigener Eintrag statt freier Texteingabe: Vorher standen in
 * den Projekten 27 verschiedene Schreibweisen für zwei Dutzend Rollen,
 * darunter Tippfehler wie „Aniamtion“ und drei Varianten für dieselbe
 * Kameraarbeit. Jetzt gibt es jede Rolle genau einmal, mit deutschem und
 * englischem Namen — eine Korrektur wirkt sofort in allen Projekten.
 */
export const role = defineType({
  name: "role",
  title: "Rolle / Leistung",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Bezeichnung",
      description:
        "Erscheint auf den Projektkacheln und der Projektseite. Fehlt die englische Fassung, wird die deutsche gezeigt.",
      type: "localizedString",
      validation: (rule) =>
        rule.custom((wert) => {
          const de = (wert as { de?: string } | undefined)?.de?.trim();
          return de ? true : "Die deutsche Bezeichnung wird benötigt.";
        }),
    }),
    defineField({
      name: "order",
      title: "Sortierung",
      description:
        "Reihenfolge in der Auswahlliste. Häufig genutzte Rollen nach oben.",
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
      title: de ?? "(ohne Bezeichnung)",
      subtitle: [en ? `EN: ${en}` : "EN fehlt", `Position ${order}`].join(
        " · ",
      ),
    }),
  },
});
