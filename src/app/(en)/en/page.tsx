import type { Metadata } from "next";

import { sprachAlternativen } from "@/lib/site";
import { HomeView } from "@/views/HomeView";

export const metadata: Metadata = {
  alternates: sprachAlternativen("/"),
};

export const revalidate = 60;

export default function EnHomePage() {
  return <HomeView sprache="en" />;
}
