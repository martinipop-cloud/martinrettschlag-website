import type { Metadata } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";

import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Martin Rettschlag — Motion Design",
    template: "%s — Martin Rettschlag",
  },
  description:
    "Portfolio von Martin Rettschlag: Motion Design, Animation und Art Direction.",
};

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Die Schrift-Variablen hängen am <html>, damit sie auf :root-Ebene liegen
    // und von den Regeln in globals.css aufgelöst werden können.
    <html
      lang="de"
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
