import type { StructureResolver } from "sanity/structure";

/**
 * Aufbau der linken Navigationsspalte im Studio.
 * „Website-Einstellungen“ und „Referenzen“ sind Einzeldokumente und werden deshalb direkt
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
      S.listItem()
        .title("Referenzen (Trust me)")
        .id("references")
        .child(
          S.document()
            .schemaType("references")
            .documentId("references")
            .title("Referenzen (Trust me)"),
        ),
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
