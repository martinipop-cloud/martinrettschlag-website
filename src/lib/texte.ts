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
    credits: "Credits",
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
      "Kleine Helfer aus der täglichen Arbeit. Alle Tools sind kostenlos — den Download-Link schicke ich dir per E-Mail.",
    keineTools: "Hier erscheinen demnächst die ersten Tools.",
    herunterladen: "Herunterladen",
    spendenPayPal: "Spenden über PayPal",
    spendenHinweis: "Wenn dir das Tool hilft, freue ich mich über eine Spende.",
    kaufen: "Kaufen",
    preisInklMwst: "Preis inklusive Mehrwertsteuer. ",
    preisHinweis:
      "Kauf und Auslieferung laufen über Gumroad, unseren Verkaufspartner — dort siehst du den Endbetrag für dein Land. Es gelten die",
    preisHinweisUnd: "und die",
    verkaufStartet: "Verkauf startet in Kürze",
    bescheidBekommen: "Bescheid bekommen",
    anleitungAnzeigen: "Installationsanleitung anzeigen",
    anleitungAusblenden: "Installationsanleitung ausblenden",
    downloads: "Downloads",
    version: "Version",
    beta: "Beta",
    betaVerfuegbar: "verfügbar — nach der Anmeldung wählbar",
    betaLaden: "Beta laden",
    betaHinweis:
      "Die Beta ist neuer, aber noch nicht ausgiebig getestet. Wenn dir etwas auffällt, freue ich mich über eine Nachricht.",
    dankeKopf: "Danke",
    dankeKopfAkzent: "schön",
    mehrToolsText:
      "Wenn du willst, dass noch mehr solcher Tools entstehen: Genau dafür sind Spenden da. Sie kaufen mir die Zeit frei, neue zu bauen.",
    ansicht: "Ansicht",
    demo: "Demo",
    softwareBeschreibung:
      "Kostenlose Plugins und Scripts für Motion Designer — Link per E-Mail, Spende freiwillig.",
    zurueckZuDenTools: "Zurück zu den Tools",
    arbeitenAnsehen: "Arbeiten ansehen",
    dankeSeiteAbsatz1:
      "Deine Spende ist angekommen — das freut mich sehr und hilft dabei, die Tools weiterzuentwickeln und neue zu bauen.",
    dankeSeiteAbsatz2:
      "Du musst nichts weiter tun. Die Tools bleiben für alle kostenlos.",

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
    kontaktHinweis:
      "Schreib mir einfach. Ein Formular gibt es hier nicht — eine Mail ist schneller und du hast sie selbst im Postausgang.",
    kontaktBeschreibung: "Anfragen und Kontakt zu Martin Rettschlag.",

    // Formularbausteine. Das Kontaktformular ist mit A-11 entfallen; diese
    // Beschriftungen bleiben für die Newsletter-Anmeldung (Kapitel 4.9).
    name: "Vollständiger Name",
    email: "E-Mail",
    datenschutzerklaerung: "Datenschutzerklärung",
    honeypotLabel: "Website (bitte frei lassen)",
    fehlerEmailUngueltig: "Bitte eine gültige E-Mail-Adresse angeben.",

    // Newsletter und Download-Anforderung (Kapitel 4.9)
    newsletterDownloadKopf: "Download anfordern",
    newsletterDownloadText:
      "Trag dich ein, dann liegt der Download einen Klick entfernt in deinem Postfach — und du erfährst, wenn es eine neue Fassung gibt.",
    newsletterBlockKopf: "Neue Tools, neue ",
    newsletterBlockKopfAkzent: "Fassungen",
    newsletterBlockText:
      "Eine E-Mail, wenn ein neues Tool fertig ist oder ein bestehendes ein Update bekommt. Sonst nichts.",
    newsletterEinverstanden:
      "Ich möchte diese E-Mails bekommen. Abmelden kann ich mich jederzeit mit einem Klick.",
    newsletterDatenschutzHinweis: "Was mit deinen Daten passiert, steht in der",
    newsletterAnmelden: "Anmelden",
    newsletterAnmeldenDownload: "Link anfordern",
    newsletterLaeuft: "Einen Moment …",
    newsletterPostfachKopf: "Schau in dein Postfach",
    newsletterPostfachText:
      "Die E-Mail ist unterwegs. Der Knopf darin bestätigt die Anmeldung und führt dich direkt zum Download.",
    newsletterPostfachTextOhneTool:
      "Die E-Mail ist unterwegs. Der Knopf darin bestätigt die Anmeldung. Ohne diesen Klick speichere ich nichts.",
    newsletterSpamHinweis: "Nichts angekommen? Dann sieh bitte im Spam-Ordner nach.",
    newsletterFehlerName: "Bitte den vollständigen Namen angeben.",
    newsletterFehlerEinverstanden:
      "Ohne dieses Einverständnis darf ich dir keine E-Mail schicken.",
    newsletterFehlerAllgemein:
      "Das hat gerade nicht geklappt. Bitte später noch einmal versuchen.",
    newsletterZuVieleVersuche:
      "Das waren mehrere Versuche in kurzer Zeit. Bitte warte einen Moment.",
    warumAnmeldung: "Warum die Anmeldung?",
    warumAnmeldungText:
      "So kann ich dir Bescheid geben, wenn es eine neue Fassung gibt — bei Skripten für After Effects ist das der halbe Nutzen. Deine Adresse bekommt niemand sonst zu sehen.",

    // Bestätigung und Abmeldung
    bestaetigtKopf: "Alles ",
    bestaetigtKopfAkzent: "klar",
    bestaetigtText: "Deine Anmeldung ist bestätigt — du stehst auf der Liste.",
    bestaetigtDownloadKopf: "Dein Download",
    downloadStarten: "Download starten",
    bestaetigtLinkAbgelaufen:
      "Dieser Download-Link ist abgelaufen. Fordere ihn auf der Tool-Seite einfach neu an; deine Anmeldung bleibt davon unberührt.",
    bestaetigtBeschreibung: "Bestätigung der Newsletter-Anmeldung.",
    abgemeldetKopf: "Ab",
    abgemeldetKopfAkzent: "gemeldet",
    abgemeldetText:
      "Deine Adresse ist aus der Liste entfernt. Du bekommst keine weiteren E-Mails von mir.",
    abgemeldetZusatz:
      "Versehentlich abgemeldet? Auf der Tool-Seite kannst du dich jederzeit wieder eintragen.",
    abgemeldetBeschreibung: "Abmeldung vom Newsletter.",

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
    credits: "Credits",
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
      "Small helpers from my daily work. Every tool is free — I send you the download link by email.",
    keineTools: "The first tools will appear here soon.",
    herunterladen: "Download",
    spendenPayPal: "Donate via PayPal",
    spendenHinweis: "If the tool helps you, a donation is always welcome.",
    kaufen: "Buy",
    preisInklMwst: "Price includes VAT. ",
    preisHinweis:
      "Purchase and delivery are handled by Gumroad, our sales partner — you will see the final amount for your country there. The following apply: the",
    preisHinweisUnd: "and the",
    verkaufStartet: "On sale shortly",
    bescheidBekommen: "Get notified",
    anleitungAnzeigen: "Show installation guide",
    anleitungAusblenden: "Hide installation guide",
    downloads: "downloads",
    version: "Version",
    beta: "Beta",
    betaVerfuegbar: "available — selectable after signing up",
    betaLaden: "Get the beta",
    betaHinweis:
      "The beta is newer but not yet thoroughly tested. If you notice anything, I would love to hear about it.",
    dankeKopf: "Thank ",
    dankeKopfAkzent: "you",
    mehrToolsText:
      "If you want more tools like this to exist: that is exactly what donations are for. They buy me the time to build them.",
    ansicht: "View",
    demo: "Demo",
    softwareBeschreibung:
      "Free plugins and scripts for motion designers — link by email, donations voluntary.",
    zurueckZuDenTools: "Back to the tools",
    arbeitenAnsehen: "See the work",
    dankeSeiteAbsatz1:
      "Your donation has arrived — thank you, it really helps me keep the tools going and build new ones.",
    dankeSeiteAbsatz2:
      "There is nothing else you need to do. The tools stay free for everyone.",

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
    kontaktHinweis:
      "Just write to me. There is no form here — an email is quicker, and you keep a copy in your own sent folder.",
    kontaktBeschreibung: "Enquiries and contact details for Martin Rettschlag.",

    name: "Full name",
    email: "Email",
    datenschutzerklaerung: "privacy policy",
    honeypotLabel: "Website (please leave empty)",
    fehlerEmailUngueltig: "Please enter a valid email address.",

    newsletterDownloadKopf: "Request the download",
    newsletterDownloadText:
      "Sign up and the download sits one click away in your inbox — and you will hear about new versions.",
    newsletterBlockKopf: "New tools, new ",
    newsletterBlockKopfAkzent: "versions",
    newsletterBlockText:
      "One email when a new tool is ready or an existing one gets an update. Nothing else.",
    newsletterEinverstanden:
      "Yes, send me these emails. I can unsubscribe with one click at any time.",
    newsletterDatenschutzHinweis: "What happens to your data is explained in the",
    newsletterAnmelden: "Sign up",
    newsletterAnmeldenDownload: "Send me the link",
    newsletterLaeuft: "One moment …",
    newsletterPostfachKopf: "Check your inbox",
    newsletterPostfachText:
      "The email is on its way. The button inside confirms your sign-up and takes you straight to the download.",
    newsletterPostfachTextOhneTool:
      "The email is on its way. The button inside confirms your sign-up. Without that click nothing is stored.",
    newsletterSpamHinweis: "Nothing there? Please check your spam folder.",
    newsletterFehlerName: "Please enter your full name.",
    newsletterFehlerEinverstanden:
      "Without this consent I am not allowed to email you.",
    newsletterFehlerAllgemein: "That did not work. Please try again later.",
    newsletterZuVieleVersuche:
      "That was several attempts in a short time. Please wait a moment.",
    warumAnmeldung: "Why sign up?",
    warumAnmeldungText:
      "It lets me tell you when a new version is out — with After Effects scripts that is half the value. Nobody else gets to see your address.",

    bestaetigtKopf: "All ",
    bestaetigtKopfAkzent: "set",
    bestaetigtText: "Your sign-up is confirmed — you are on the list.",
    bestaetigtDownloadKopf: "Your download",
    downloadStarten: "Start download",
    bestaetigtLinkAbgelaufen:
      "This download link has expired. Just request it again on the tool page; your sign-up is not affected.",
    bestaetigtBeschreibung: "Newsletter sign-up confirmation.",
    abgemeldetKopf: "Unsub",
    abgemeldetKopfAkzent: "scribed",
    abgemeldetText:
      "Your address has been removed from the list. You will not receive any further emails from me.",
    abgemeldetZusatz:
      "Unsubscribed by mistake? You can sign up again on the tool page at any time.",
    abgemeldetBeschreibung: "Newsletter unsubscribe.",

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
