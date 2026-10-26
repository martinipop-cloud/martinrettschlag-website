import type { Metadata, Viewport } from "next";

import { Studio } from "./Studio";

/**
 * Bindet das Sanity-Studio als Unterseite unter /studio ein.
 * Der Zugang ist nur nach Anmeldung möglich (B-01).
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Studio",
  // Das Studio soll nicht in Suchmaschinen auftauchen (B-02).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <Studio />;
}
