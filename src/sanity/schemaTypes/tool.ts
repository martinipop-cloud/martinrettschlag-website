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
      name: "vertrieb",
      title: "Abgabe",
      description:
        "Legt fest, ob das Tool verschenkt oder verkauft wird. Die Karte auf der Website passt sich entsprechend an.",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Kostenlos — Download frei, Spende freiwillig", value: "kostenlos" },
          { title: "Kostenpflichtig — Verkauf über Plattform", value: "kauf" },
        ],
        layout: "radio",
      },
      initialValue: "kostenlos",
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
        "Die eigentliche Datei, z. B. .jsx oder .zip. Richtwert: bis etwa 20 MB. Nur bei kostenlosen Tools nötig — verkaufte Tools werden von der Verkaufsplattform ausgeliefert.",
      type: "file",
      group: "media",
      hidden: ({ document }) => document?.vertrieb === "kauf",
      validation: (rule) =>
        rule.custom((wert, kontext) => {
          const vertrieb = (kontext.document as { vertrieb?: string } | undefined)
            ?.vertrieb;
          if (vertrieb !== "kauf" && !wert) {
            return "Für ein kostenloses Tool wird eine Datei benötigt.";
          }
          return true;
        }),
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
      name: "preis",
      title: "Preis in Euro",
      description:
        "Wird auf der Karte angezeigt, z. B. 19. Der endgültige Betrag inklusive der jeweiligen Landes-Mehrwertsteuer entsteht beim Bezahlvorgang auf der Verkaufsplattform.",
      type: "number",
      group: "settings",
      hidden: ({ document }) => document?.vertrieb !== "kauf",
      validation: (rule) =>
        rule.custom((wert, kontext) => {
          const vertrieb = (kontext.document as { vertrieb?: string } | undefined)
            ?.vertrieb;
          if (vertrieb === "kauf" && (wert === undefined || wert === null)) {
            return "Für ein kostenpflichtiges Tool wird ein Preis benötigt.";
          }
          if (typeof wert === "number" && wert <= 0) {
            return "Der Preis muss größer als null sein.";
          }
          return true;
        }),
    }),
    defineField({
      name: "kaufUrl",
      title: "Link zur Verkaufsseite",
      description:
        "Adresse des Produkts bei Gumroad, Lemon Squeezy oder Paddle. Dorthin führt der Kaufen-Button.",
      type: "url",
      group: "settings",
      hidden: ({ document }) => document?.vertrieb !== "kauf",
      validation: (rule) =>
        rule.custom((wert, kontext) => {
          const vertrieb = (kontext.document as { vertrieb?: string } | undefined)
            ?.vertrieb;
          if (vertrieb === "kauf" && !wert) {
            return "Für ein kostenpflichtiges Tool wird die Adresse der Verkaufsseite benötigt.";
          }
          return true;
        }),
    }),
    defineField({
      name: "paypalUrl",
      title: "PayPal-Spendenlink",
      description:
        "Ziel des Spenden-Buttons. Bleibt das Feld leer, wird der Standardlink aus den Website-Einstellungen verwendet. Nur bei kostenlosen Tools relevant.",
      type: "url",
      group: "settings",
      hidden: ({ document }) => document?.vertrieb === "kauf",
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
