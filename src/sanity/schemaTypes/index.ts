import type { SchemaTypeDefinition } from "sanity";

import {
  blogBody,
  contentImage,
  galleryVideo,
  richText,
  youtubeEmbed,
} from "./blocks";
import { category } from "./category";
import { legalPage } from "./legalPage";
import {
  localizedRichText,
  localizedString,
  localizedText,
} from "./localized";
import { role } from "./role";
import { post } from "./post";
import { project } from "./project";
import { references } from "./references";
import { siteSettings } from "./siteSettings";
import { tool } from "./tool";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Bausteine
    richText,
    blogBody,
    contentImage,
    galleryVideo,
    youtubeEmbed,
    // Zweisprachigkeit
    localizedString,
    localizedText,
    localizedRichText,
    // Inhalte
    project,
    category,
    role,
    tool,
    post,
    legalPage,
    references,
    siteSettings,
  ],
};
