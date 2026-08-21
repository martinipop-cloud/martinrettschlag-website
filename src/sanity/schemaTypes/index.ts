import type { SchemaTypeDefinition } from "sanity";

import {
  blogBody,
  contentImage,
  galleryVideo,
  richText,
  youtubeEmbed,
} from "./blocks";
import { category } from "./category";
import { inquiry } from "./inquiry";
import { legalPage } from "./legalPage";
import { post } from "./post";
import { project } from "./project";
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
    // Inhalte
    project,
    category,
    tool,
    post,
    inquiry,
    legalPage,
    siteSettings,
  ],
};
