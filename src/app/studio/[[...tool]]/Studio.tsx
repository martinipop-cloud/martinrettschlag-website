"use client";

/**
 * Das Sanity-Studio ist eine reine Browser-Anwendung. Es wird deshalb bewusst
 * als Client-Komponente eingebunden und nicht in der Server-Component-Ebene
 * ausgewertet – dort lassen sich einige Abhängigkeiten des Studios nicht
 * auflösen.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export function Studio() {
  return <NextStudio config={config} />;
}
