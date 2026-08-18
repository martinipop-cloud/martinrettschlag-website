import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Nur veröffentlichte Inhalte ausliefern – Entwürfe bleiben auf der Website unsichtbar.
  perspective: "published",
});
