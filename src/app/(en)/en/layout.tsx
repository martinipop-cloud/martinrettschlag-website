import { SiteChrome } from "@/components/SiteChrome";

/**
 * Rahmen für die öffentlichen englischen Seiten.
 * Gleiche Hülle wie die deutsche Fassung, nur mit englischen Beschriftungen.
 */
export default function EnSiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteChrome sprache="en">{children}</SiteChrome>;
}
