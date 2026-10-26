import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";
import type { Sprache } from "@/lib/sprache";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/**
 * Stellt die Darstellung schon vor dem ersten Zeichnen der Seite richtig ein,
 * damit beim Laden nicht kurz die falsche Farbwelt aufblitzt (F-802, F-803).
 */
const themeScript = `
try {
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

/**
 * Das HTML-Grundgerüst der Website.
 *
 * Jede Sprachfassung hat ihr eigenes oberstes Layout, damit im lang-Attribut
 * die richtige Sprache steht — Screenreader entscheiden daran, mit welcher
 * Aussprache sie den Text vorlesen, und Suchmaschinen erkennen daran die
 * Sprache der Seite. Dieses Gerüst ist der gemeinsame Teil davon.
 */
export function RootDocument({
  sprache,
  children,
}: Readonly<{ sprache: Sprache; children: React.ReactNode }>) {
  return (
    // Die Schrift-Variablen hängen am <html>, damit sie auf :root-Ebene liegen
    // und von den Regeln in globals.css aufgelöst werden können.
    <html
      lang={sprache}
      className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
