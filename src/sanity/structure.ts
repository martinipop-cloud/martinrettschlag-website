import type { StructureResolver } from "sanity/structure";

/**
 * Aufbau der linken Navigationsspalte im Studio.
 * „Website-Einstellungen“ ist ein Einzeldokument und wird deshalb direkt
 * geöffnet, statt als Liste mit einem einzigen Eintrag zu erscheinen.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Inhalte")
    .items([
      S.documentTypeListItem("project").title("Projekte"),
      S.documentTypeListItem("category").title("Kategorien"),
      S.divider(),
      S.documentTypeListItem("tool").title("Software / Scripts"),
      S.divider(),
      S.documentTypeListItem("post").title("Blogartikel"),
      S.divider(),
      S.documentTypeListItem("inquiry").title("Kontaktanfragen"),
      S.divider(),
      S.documentTypeListItem("legalPage").title("Rechtstexte"),
      S.listItem()
        .title("Website-Einstellungen")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Website-Einstellungen"),
        ),
    ]);
