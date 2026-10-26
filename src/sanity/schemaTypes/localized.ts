import { defineField, defineType } from "sanity";

/**
 * Bausteine für zweisprachige Inhalte (Deutsch / Englisch).
 *
 * Statt für jede Sprache ein eigenes Dokument anzulegen, stecken beide
 * Fassungen im selben Eintrag. Vorteil: Bilder, Videos, Kunde, Jahr und
 * Sortierung bleiben gemeinsam — nur der Text existiert doppelt. Das
 * halbiert den Pflegeaufwand gegenüber getrennten Dokumenten.
 *
 * Deutsch ist die Grundsprache: Fehlt eine englische Fassung, zeigt die
 * Website den deutschen Text, statt eine Lücke zu lassen.
 */

export const localizedString = defineType({
  name: "localizedString",
  title: "Text (zweisprachig)",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({ name: "de", title: "Deutsch", type: "string" }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
});

export const localizedText = defineType({
  name: "localizedText",
  title: "Mehrzeiliger Text (zweisprachig)",
  type: "object",
  fields: [
    defineField({ name: "de", title: "Deutsch", type: "text", rows: 3 }),
    defineField({ name: "en", title: "English", type: "text", rows: 3 }),
  ],
});

export const localizedRichText = defineType({
  name: "localizedRichText",
  title: "Formatierter Text (zweisprachig)",
  type: "object",
  fields: [
    defineField({ name: "de", title: "Deutsch", type: "richText" }),
    defineField({ name: "en", title: "English", type: "richText" }),
  ],
});
