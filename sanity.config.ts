import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Martin Rettschlag",
  // Das Studio läuft als Unterseite der Website unter /studio.
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    codeInput(),
    // Werkzeug zum Testen von Datenbank-Abfragen. Nur für Entwicklung relevant.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
