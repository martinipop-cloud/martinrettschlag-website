import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { texte } from "@/lib/texte";
import { BlogView } from "@/views/BlogView";

export const metadata: Metadata = {
  title: texte("en").navBlog,
  description: texte("en").blogBeschreibung,
  alternates: {
    ...sprachAlternativen("/blog"),
    // Es gibt einen Feed, gespeist aus denselben Artikeln.
    types: {
      "application/rss+xml": [
        { url: "/blog/rss.xml", title: "Martin Rettschlag — What I Like" },
      ],
    },
  },
};

export const revalidate = 60;

export default function EnBlogPage() {
  return <BlogView sprache="en" />;
}
