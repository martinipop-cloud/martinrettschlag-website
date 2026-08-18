import { defineField, defineType } from "sanity";

/**
 * Kontaktanfrage (Kapitel 5.5 des Lastenhefts).
 *
 * Diese Einträge werden automatisch vom Kontaktformular angelegt (F-605).
 * Die eingegangenen Daten sind schreibgeschützt (F-606) – nur das Häkchen
 * „Erledigt“ lässt sich setzen. Löschen bleibt jederzeit möglich (R-10).
 */
export const inquiry = defineType({
  name: "inquiry",
  title: "Kontaktanfrage",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "E-Mail",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "subject",
      title: "Betreff",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Nachricht",
      type: "text",
      rows: 8,
      readOnly: true,
    }),
    defineField({
      name: "receivedAt",
      title: "Eingegangen am",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "handled",
      title: "Erledigt",
      description: "Zum Abhaken, sobald die Anfrage beantwortet wurde.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Neueste zuerst",
      name: "receivedAtDesc",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      subject: "subject",
      receivedAt: "receivedAt",
      handled: "handled",
    },
    prepare: ({ name, subject, receivedAt, handled }) => ({
      title: `${handled ? "✓ " : ""}${name ?? "Ohne Namen"} – ${subject ?? "Ohne Betreff"}`,
      subtitle: receivedAt
        ? new Date(receivedAt).toLocaleString("de-DE")
        : "Ohne Datum",
    }),
  },
});
