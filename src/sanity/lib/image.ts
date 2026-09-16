import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Prüft, ob in einem Bildfeld wirklich ein Bild steckt.
 *
 * Wichtig: Ein Bildfeld im CMS kann vorhanden sein, ohne eine Datei zu
 * enthalten — etwa wenn nur ein Alternativtext eingetragen wurde. Ohne diese
 * Prüfung scheitert die Adressbildung und die ganze Seite bricht ab.
 */
export function hatBild<T>(
  quelle: T,
): quelle is NonNullable<T> & SanityImageSource {
  return Boolean(
    quelle &&
      typeof quelle === "object" &&
      (quelle as { asset?: { _ref?: string } }).asset?._ref,
  );
}
