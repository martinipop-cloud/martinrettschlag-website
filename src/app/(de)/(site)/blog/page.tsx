import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { BlogView } from "@/views/BlogView";

export const metadata: Metadata = {
  title: texte("de").navBlog,
  description: texte("de").blogBeschreibung,
  alternates: {
    ...sprachAlternativen("/blog"),
    // Macht den Feed für Browser und Leseprogramme auffindbar.
    types: {
      "application/rss+xml": [
        { url: "/blog/rss.xml", title: "Martin Rettschlag — What I Like" },
      ],
    },
  },
};

export const revalidate = 60;

export default function BlogPage() {
  return <BlogView sprache="de" />;
}
