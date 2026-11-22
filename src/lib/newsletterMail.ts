import type { Sprache } from "./sprache";

/**
 * Die eine E-Mail, die nicht als Vorlage bei Brevo liegt.
 *
 * Wer schon auf der Liste steht und bestätigt hat, bekommt keine zweite
 * Anmeldebestätigung — das wäre unsinnig und würde die Anmeldung erneut
 * abfragen. Diese Person bekommt den Link direkt. Deshalb entsteht diese
 * Mail hier im Code, während die Anmeldebestätigung als Vorlage bei Brevo
 * liegt (dort kann sie ohne Veröffentlichung geändert werden).
 *
 * Gestaltung bewusst schlicht und mit Tabellen: Outlook und die meisten
 * Postfächer rechnen modernes CSS nicht zuverlässig.
 */

const PAPIER = "#f2efea";
const KARTE = "#ffffff";
const LINIE = "#e2ddd5";
const TINTE = "#141210";
const LEISE = "#6b655d";
const AKZENT = "#1f1ceb";

function rahmen(inhalt: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${PAPIER};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPIER};">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${KARTE};border:1px solid ${LINIE};">
<tr><td style="padding:40px 32px;font-family:Helvetica,Arial,sans-serif;color:${TINTE};">
${inhalt}
</td></tr></table>
</td></tr></table>
</body></html>`;
}

function knopf(ziel: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px 0;">
<tr><td style="background:${AKZENT};">
<a href="${ziel}" style="display:inline-block;padding:16px 32px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;text-decoration:none;">${text}</a>
</td></tr></table>`;
}

/**
 * „Hier ist dein Download“ für bereits bestätigte Empfänger.
 * @param ziel Die unterschriebene Adresse der Bestätigungsseite.
 */
export function downloadMail(
  sprache: Sprache,
  toolName: string,
  ziel: string,
): { subject: string; htmlContent: string; textContent: string } {
  // Kein Abmeldelink: Diese Mail beantwortet eine einzelne Anforderung und
  // ist damit keine Werbung. Der Abmeldelink steht in jedem Newsletter —
  // dort wird er von Brevo selbst eingesetzt.
  const fussDe = `Diese Mail hast du gerade auf martinrettschlag.de angefordert.<br>Martin Rettschlag · <a href="https://www.martinrettschlag.de/impressum" style="color:${LEISE};">Impressum</a> · <a href="https://www.martinrettschlag.de/datenschutz" style="color:${LEISE};">Datenschutz</a>`;
  const fussEn = `You requested this email just now on martinrettschlag.de.<br>Martin Rettschlag · <a href="https://www.martinrettschlag.de/impressum" style="color:${LEISE};">Imprint</a> · <a href="https://www.martinrettschlag.de/datenschutz" style="color:${LEISE};">Privacy</a>`;

  const fuss = (zeilen: string) =>
    `<hr style="border:0;border-top:1px solid ${LINIE};margin:32px 0 20px;">
<p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${LEISE};">${zeilen}</p>`;

  if (sprache === "en") {
    return {
      subject: `Your download: ${toolName}`,
      htmlContent: rahmen(`
<p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${LEISE};">Martin Rettschlag</p>
<h1 style="margin:16px 0 0;font-size:30px;line-height:1.15;font-weight:bold;">Here you go</h1>
<p style="margin:20px 0 0;font-size:16px;line-height:1.65;">You are already on the list, so there is nothing to confirm. <strong>${toolName}</strong> is waiting for you:</p>
${knopf(ziel, "Go to the download")}
<p style="margin:0;font-size:16px;line-height:1.65;color:${LEISE};">The link stays valid for two weeks. After that, just request it again on the tool page.</p>
${fuss(fussEn)}`),
      textContent: `You are already on the list, so there is nothing to confirm. ${toolName} is waiting for you: ${ziel}\n\nThe link stays valid for two weeks.`,
    };
  }

  return {
    subject: `Dein Download: ${toolName}`,
    htmlContent: rahmen(`
<p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${LEISE};">Martin Rettschlag</p>
<h1 style="margin:16px 0 0;font-size:30px;line-height:1.15;font-weight:bold;">Hier, bitte</h1>
<p style="margin:20px 0 0;font-size:16px;line-height:1.65;">Du stehst schon auf der Liste — es gibt also nichts zu bestätigen. <strong>${toolName}</strong> wartet hier auf dich:</p>
${knopf(ziel, "Zum Download")}
<p style="margin:0;font-size:16px;line-height:1.65;color:${LEISE};">Der Link gilt zwei Wochen. Danach kannst du ihn auf der Tool-Seite einfach neu anfordern.</p>
${fuss(fussDe)}`),
    textContent: `Du stehst schon auf der Liste — es gibt also nichts zu bestätigen. ${toolName} wartet hier auf dich: ${ziel}\n\nDer Link gilt zwei Wochen.`,
  };
}
