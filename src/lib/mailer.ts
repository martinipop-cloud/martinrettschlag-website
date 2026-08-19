import "server-only";

import nodemailer from "nodemailer";

/**
 * Versand der Formularanfragen über das bestehende All-Inkl-Postfach (F-604).
 *
 * Die Website meldet sich dort an wie ein gewöhnliches Mailprogramm. Dadurch
 * sind keine DNS-Änderungen nötig, der Mailbetrieb bleibt unangetastet (T-03)
 * und es kommt kein weiterer Auftragsverarbeiter hinzu.
 *
 * Alle Zugangsdaten stehen ausschließlich in Umgebungsvariablen (N-42).
 */
export function mailVersandEingerichtet(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD,
  );
}

function transporterErzeugen() {
  const port = Number(process.env.SMTP_PORT ?? 587);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Port 465 verschlüsselt von Anfang an, 587 schaltet per STARTTLS um.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export type Anfrage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function anfrageVersenden(anfrage: Anfrage): Promise<void> {
  const absender = process.env.SMTP_FROM ?? process.env.SMTP_USER!;
  const empfaenger = process.env.CONTACT_TO ?? absender;

  const text = [
    `Neue Anfrage über das Kontaktformular`,
    ``,
    `Name:    ${anfrage.name}`,
    `E-Mail:  ${anfrage.email}`,
    `Betreff: ${anfrage.subject}`,
    ``,
    `Nachricht:`,
    anfrage.message,
  ].join("\n");

  await transporterErzeugen().sendMail({
    from: `"Kontaktformular" <${absender}>`,
    to: empfaenger,
    // Antworten gehen direkt an die anfragende Person.
    replyTo: `"${anfrage.name}" <${anfrage.email}>`,
    subject: `Anfrage über die Website: ${anfrage.subject}`,
    text,
  });
}
