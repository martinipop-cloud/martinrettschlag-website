import type { Sprache } from "./sprache";

/**
 * Feste Beschriftungen der Oberfläche in beiden Sprachen.
 *
 * Alles, was nicht aus dem CMS kommt, steht hier — Navigation, Überschriften,
 * Schaltflächen, Formularfelder, Meldungen. Eine Stelle für alle Sprachen,
 * damit beim Übersetzen nichts vergessen wird: Fehlt ein Eintrag in einer
 * Sprache, meldet das der Typprüfer beim Bauen.
 */
const woerterbuch = {
  de: {
    // Navigation
    navWork: "Work",
    navSoftware: "Software",
    navBlog: "What I Like",
    navTrustMe: "Trust me",
    navContact: "Contact",
    hauptnavigation: "Hauptnavigation",
    menueOeffnen: "Menü",
    menueSchliessen: "Schliessen",
    schliessen: "Schliessen",
    zurStartseite: "Zur Startseite",

    // Darstellung
    zuHell: "Hell",
    zuDunkel: "Dunkel",
    zuHellLang: "Zur hellen Darstellung wechseln",
    zuDunkelLang: "Zur dunklen Darstellung wechseln",

    // Sprache
    spracheWechseln: "Sprache wechseln",
    spracheDeutsch: "Deutsch",
    spracheEnglisch: "English",

    // Startseite
    ausgewaehlteArbeiten: "Ausgewählte Arbeiten",
    alleProjekte: "Alle Projekte",
    ueberMich: "Über mich",

    // Work
    workTitel: "Arbeiten",
    keineProjekte: "Es sind noch keine Projekte veröffentlicht.",
    keineProjekteKategorie: "In dieser Kategorie gibt es noch keine Projekte.",
    nachKategorieFiltern: "Projekte nach Kategorie filtern",
    mehrLaden: "Mehr anzeigen",
    zurueckZurUebersicht: "Zurück zur Übersicht",
    kunde: "Kunde",
    agentur: "Agentur / Produktion",
    rolle: "Rolle",
    kategorie: "Kategorie",
    kategorien: "Kategorien",
    weitereProjekte: "Weitere Projekte",
    vorheriges: "Vorheriges",
    naechstes: "Nächstes",
    keinVideo: "Für dieses Projekt ist noch kein Video hinterlegt.",
    videoSchleife: "Videoschleife",
    projektNichtGefunden: "Projekt nicht gefunden",
    vorschau: "Vorschau",
    workBeschreibung:
      "Ausgewählte Motion-Graphics-Projekte von Martin Rettschlag.",

    // Galerie
    screenshots: "Screenshots",
    screenshotsUndClips: "Screenshots & Clips",
    vergroessern: "vergrößern",
    grossansichtSchliessen: "Großansicht schließen",
    vorherigerEintrag: "Vorheriger Eintrag",
    naechsterEintrag: "Nächster Eintrag",
    von: "von",
    clip: "Clip",
    screenshot: "Screenshot",

    // Video
    videoStarten: "Video starten — dabei wird eine Verbindung zu YouTube aufgebaut",

    // Software
    softwareTitel: "Tools & ",
    softwareTitelAkzent: "Scripts",
    softwareEinleitung:
      "Kleine Helfer aus der täglichen Arbeit. Alle Downloads sind kostenlos und ohne Anmeldung nutzbar.",
    keineTools: "Hier erscheinen demnächst die ersten Tools.",
    herunterladen: "Herunterladen",
    spendenPayPal: "Spenden über PayPal",
    spendenHinweis: "Wenn dir das Tool hilft, freue ich mich über eine Spende.",
    kaufen: "Kaufen",
    preisInklMwst: "Preis inklusive Mehrwertsteuer. ",
    preisHinweis:
      "Kauf und Auslieferung laufen über Paddle, unseren Verkaufspartner — dort siehst du den Endbetrag für dein Land. Es gelten die",
    preisHinweisUnd: "und die",
    verkaufStartet: "Verkauf startet in Kürze",
    bescheidBekommen: "Bescheid bekommen",
    anleitungAnzeigen: "Installationsanleitung anzeigen",
    anleitungAusblenden: "Installationsanleitung ausblenden",
    downloads: "Downloads",
    downloadLaeuft: "Download läuft",
    dankeKopf: "Danke",
    dankeKopfAkzent: "schön",
    downloadLaeuftText: "wird gerade geladen.",
    mehrToolsText:
      "Wenn du willst, dass noch mehr solcher Tools entstehen: Genau dafür sind Spenden da. Sie kaufen mir die Zeit frei, neue zu bauen.",
    vielleichtSpaeter: "Vielleicht später",
    ansicht: "Ansicht",
    demo: "Demo",
    softwareBeschreibung:
      "Kostenlose Plugins und Scripts für Motion Designer — Download frei, Spende freiwillig.",
    zurueckZuDenTools: "Zurück zu den Tools",
    arbeitenAnsehen: "Arbeiten ansehen",
    dankeSeiteAbsatz1:
      "Deine Spende ist angekommen — das freut mich sehr und hilft dabei, die Tools weiterzuentwickeln und neue zu bauen.",
    dankeSeiteAbsatz2:
      "Du musst nichts weiter tun. Alle Downloads waren und bleiben frei zugänglich.",

    // Blog
    blogTitel: "Ick mag ",
    blogTitelAkzent: "dit",
    keineArtikel: "Hier entstehen demnächst Artikel zu Tools, Techniken und Branche.",
    lesezeit: "Min. Lesezeit",
    weitereArtikel: "Weitere Artikel",
    vorheriger: "Vorheriger",
    naechster: "Nächster",
    artikelNichtGefunden: "Artikel nicht gefunden",
    blogBeschreibung:
      "Gedanken zu Tools, Techniken und Branche — von Martin Rettschlag.",
    /**
     * Sprachkennung für Datums-, Zahlen- und Währungsausgaben,
     * z. B. „26. Oktober 2026“ und „12,00 €“.
     */
    sprachkennung: "de-DE",

    // Trust me
    trustMeBeschreibung:
      "Marken und Partner, mit denen Martin Rettschlag gearbeitet hat.",
    marken: "Marken",
    partner: "Partner",
    referenzenLeer: "Hier entstehen gerade die Referenzen.",

    // Kontakt
    kontaktTitel: "Kontakt",
    direkt: "Direkt",
    standort: "Standort",
    social: "Social",
    name: "Name",
    email: "E-Mail",
    betreff: "Betreff",
    nachricht: "Nachricht",
    einwilligung:
      "Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden. Weitere Hinweise in der",
    datenschutzerklaerung: "Datenschutzerklärung",
    nachrichtSenden: "Nachricht senden",
    wirdGesendet: "Wird gesendet …",
    pflichtfeld: "* Pflichtfeld",
    dankeNachricht: "Danke für deine Nachricht.",
    dankeNachrichtText: "Die Anfrage ist angekommen. Ich melde mich so bald wie möglich.",
    verbindungFehlgeschlagen: "Die Verbindung ist fehlgeschlagen. Bitte schreib direkt an",
    fehlerAllgemein: "Es ist ein Fehler aufgetreten.",
    kontaktBeschreibung: "Anfragen und Kontakt zu Martin Rettschlag.",
    honeypotLabel: "Website (bitte frei lassen)",

    // Rückmeldungen der Formular-Schnittstelle
    fehlerNichtGelesen: "Anfrage konnte nicht gelesen werden.",
    fehlerAlleFelder: "Bitte alle Felder ausfüllen.",
    fehlerEmailUngueltig: "Bitte eine gültige E-Mail-Adresse angeben.",
    fehlerZustimmung: "Bitte der Datenverarbeitung zustimmen.",
    fehlerZuVieleAnfragen:
      "Es wurden bereits mehrere Anfragen gesendet. Bitte später erneut versuchen.",
    fehlerNichtUebermittelt:
      "Die Anfrage konnte gerade nicht übermittelt werden. Bitte schreib direkt an",

    // Fehlerseite
    fehler404: "Fehler 404",
    nichts: "Nichts ",
    nichtsAkzent: "hier",
    seiteNichtGefunden: "Seite nicht gefunden",
    nichtGefundenText:
      "Diese Seite gibt es nicht — vielleicht wurde sie verschoben, oder in der Adresse hat sich ein Tippfehler eingeschlichen.",
    zuDenArbeiten: "Zu den Arbeiten",

    // Fußzeile
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    agb: "AGB",
    rueckgabe: "Rückgabe",
    rueckgaberichtlinie: "Rückgaberichtlinie",
    oeffnetNeuerTab: "(öffnet in neuem Tab)",
    nochNichtHinterlegt: "Noch nicht hinterlegt",
    rechtstextFehlt:
      "Dieser Text muss vor der Veröffentlichung der Website im CMS eingetragen werden — unter „Rechtstexte“. Für eine geschäftlich genutzte Website in Deutschland ist er gesetzlich vorgeschrieben.",
  },

  en: {
    navWork: "Work",
    navSoftware: "Software",
    navBlog: "What I Like",
    navTrustMe: "Trust me",
    navContact: "Contact",
    hauptnavigation: "Main navigation",
    menueOeffnen: "Menu",
    menueSchliessen: "Close",
    schliessen: "Close",
    zurStartseite: "Go to homepage",

    zuHell: "Light",
    zuDunkel: "Dark",
    zuHellLang: "Switch to light appearance",
    zuDunkelLang: "Switch to dark appearance",

    spracheWechseln: "Change language",
    spracheDeutsch: "Deutsch",
    spracheEnglisch: "English",

    ausgewaehlteArbeiten: "Selected Work",
    alleProjekte: "All projects",
    ueberMich: "About me",

    workTitel: "Work",
    keineProjekte: "No projects published yet.",
    keineProjekteKategorie: "No projects in this category yet.",
    nachKategorieFiltern: "Filter projects by category",
    mehrLaden: "Show more",
    zurueckZurUebersicht: "Back to overview",
    kunde: "Client",
    agentur: "Agency / Production",
    rolle: "Role",
    kategorie: "Category",
    kategorien: "Categories",
    weitereProjekte: "More projects",
    vorheriges: "Previous",
    naechstes: "Next",
    keinVideo: "No video available for this project yet.",
    videoSchleife: "video loop",
    projektNichtGefunden: "Project not found",
    vorschau: "Preview",
    workBeschreibung: "Selected motion graphics work by Martin Rettschlag.",

    screenshots: "Screenshots",
    screenshotsUndClips: "Screenshots & Clips",
    vergroessern: "enlarge",
    grossansichtSchliessen: "Close enlarged view",
    vorherigerEintrag: "Previous item",
    naechsterEintrag: "Next item",
    von: "of",
    clip: "Clip",
    screenshot: "Screenshot",

    videoStarten: "Play video — this will connect to YouTube",

    softwareTitel: "Tools & ",
    softwareTitelAkzent: "Scripts",
    softwareEinleitung:
      "Small helpers from my daily work. All downloads are free and need no sign-up.",
    keineTools: "The first tools will appear here soon.",
    herunterladen: "Download",
    spendenPayPal: "Donate via PayPal",
    spendenHinweis: "If the tool helps you, a donation is always welcome.",
    kaufen: "Buy",
    preisInklMwst: "Price includes VAT. ",
    preisHinweis:
      "Purchase and delivery are handled by Paddle, our sales partner — you will see the final amount for your country there. The following apply: the",
    preisHinweisUnd: "and the",
    verkaufStartet: "On sale shortly",
    bescheidBekommen: "Get notified",
    anleitungAnzeigen: "Show installation guide",
    anleitungAusblenden: "Hide installation guide",
    downloads: "downloads",
    downloadLaeuft: "Download running",
    dankeKopf: "Thank ",
    dankeKopfAkzent: "you",
    downloadLaeuftText: "is downloading.",
    mehrToolsText:
      "If you want more tools like this to exist: that is exactly what donations are for. They buy me the time to build them.",
    vielleichtSpaeter: "Maybe later",
    ansicht: "View",
    demo: "Demo",
    softwareBeschreibung:
      "Free plugins and scripts for motion designers — downloads are free, donations voluntary.",
    zurueckZuDenTools: "Back to the tools",
    arbeitenAnsehen: "See the work",
    dankeSeiteAbsatz1:
      "Your donation has arrived — thank you, it really helps me keep the tools going and build new ones.",
    dankeSeiteAbsatz2:
      "There is nothing else you need to do. All downloads were and remain freely available.",

    blogTitel: "What I ",
    blogTitelAkzent: "Like",
    keineArtikel: "Articles on tools, techniques and the industry will appear here soon.",
    lesezeit: "min read",
    weitereArtikel: "More articles",
    vorheriger: "Previous",
    naechster: "Next",
    artikelNichtGefunden: "Article not found",
    blogBeschreibung:
      "Thoughts on tools, techniques and the industry — by Martin Rettschlag.",
    sprachkennung: "en-GB",

    trustMeBeschreibung:
      "Brands and partners Martin Rettschlag has worked with.",
    marken: "Brands",
    partner: "Partners",
    referenzenLeer: "The references are being put together.",

    kontaktTitel: "Contact",
    direkt: "Direct",
    standort: "Location",
    social: "Social",
    name: "Name",
    email: "Email",
    betreff: "Subject",
    nachricht: "Message",
    einwilligung:
      "I agree that my data will be stored for processing my enquiry. Further information in the",
    datenschutzerklaerung: "privacy policy",
    nachrichtSenden: "Send message",
    wirdGesendet: "Sending …",
    pflichtfeld: "* Required field",
    dankeNachricht: "Thank you for your message.",
    dankeNachrichtText: "Your enquiry has arrived. I will get back to you as soon as possible.",
    verbindungFehlgeschlagen: "The connection failed. Please write directly to",
    fehlerAllgemein: "An error occurred.",
    kontaktBeschreibung: "Enquiries and contact details for Martin Rettschlag.",
    honeypotLabel: "Website (please leave empty)",

    fehlerNichtGelesen: "The request could not be read.",
    fehlerAlleFelder: "Please fill in all fields.",
    fehlerEmailUngueltig: "Please enter a valid email address.",
    fehlerZustimmung: "Please agree to the processing of your data.",
    fehlerZuVieleAnfragen:
      "Several enquiries have already been sent. Please try again later.",
    fehlerNichtUebermittelt:
      "The enquiry could not be delivered right now. Please write directly to",

    fehler404: "Error 404",
    nichts: "Nothing ",
    nichtsAkzent: "here",
    seiteNichtGefunden: "Page not found",
    nichtGefundenText:
      "This page does not exist — it may have moved, or there is a typo in the address.",
    zuDenArbeiten: "Go to work",

    impressum: "Imprint",
    datenschutz: "Privacy",
    agb: "Terms",
    rueckgabe: "Refunds",
    rueckgaberichtlinie: "refund policy",
    oeffnetNeuerTab: "(opens in a new tab)",
    nochNichtHinterlegt: "Not filled in yet",
    rechtstextFehlt:
      "This text has to be entered in the CMS under “Legal pages” before the website goes live. German law requires it for any website used commercially.",
  },
} as const;

/**
 * Die Einträge, die jede Sprache haben muss — abgeleitet aus der deutschen
 * Fassung, die als Grundsprache die Liste vorgibt.
 */
type Eintraege = { readonly [K in keyof typeof woerterbuch.de]: string };

/**
 * Prüft beim Bauen, dass beide Sprachen dieselben Einträge haben.
 * Fehlt einer, schlägt der Typprüfer fehl statt stillschweigend die
 * falsche Sprache anzuzeigen.
 */
const _vollstaendig: Record<Sprache, Eintraege> = woerterbuch;
void _vollstaendig;

export function texte(sprache: Sprache): Eintraege {
  return woerterbuch[sprache];
}
