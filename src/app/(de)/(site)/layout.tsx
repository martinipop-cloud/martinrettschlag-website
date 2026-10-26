import { SiteChrome } from "@/components/SiteChrome";

/**
 * Rahmen für die öffentlichen deutschen Seiten.
 * Das Studio unter /studio liegt bewusst außerhalb dieses Layouts und
 * bekommt daher weder Header noch Footer.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteChrome sprache="de">{children}</SiteChrome>;
}
