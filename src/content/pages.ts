import type { FaqItem, ProcessStep } from "./types";

/**
 * Redaktionelle Texte der Website (Deutsch, Du-Ansprache, kurz und konkret).
 * Hier ändern, nicht in den Komponenten.
 */

export const hero = {
  eyebrow: "Schmiede · Schärfservice · Maßarbeit",
  headline: ["Aus Feuer geformt.", "Für deinen Alltag gemacht."],
  lead: "Kleine handgeschmiedete Messer, ein Schärfservice mit Augenmaß sowie Griffe und Scheiden nach deinen Vorstellungen. Jedes Stück entsteht einzeln, in der Werkstatt von Meisterschmied David.",
  caption: "Konzeptdarstellung des Messers „Esse“ – Beispielprodukt, kein Foto.",
};

export const knivesSection = {
  eyebrow: "01 · Messer",
  title: "Drei Messer für den Anfang.",
  lead: "Klein im Programm, genau im Detail. Jedes Messer wird einzeln gefertigt. Preise und Maße sind in dieser Vorschau Beispieldaten.",
};

export const sharpening = {
  eyebrow: "02 · Schärfservice",
  title: "Schärfe, die zum Messer passt.",
  lead: "Küchenmesser, Taschenmesser oder Outdoor-Klinge: Du beschreibst Messer und Zustand, ich prüfe, was sinnvoll ist. Erst danach geht etwas auf die Reise.",
  steps: [
    {
      title: "Anfrage beschreiben",
      text: "Klingentyp, Anzahl, ungefähre Länge und Zustand: Je genauer, desto besser lässt sich der Aufwand einschätzen.",
    },
    {
      title: "Prüfung und Rückmeldung",
      text: "Ich prüfe deine Anfrage und gebe dir eine Einschätzung zu Machbarkeit, Aufwand und Preis, bevor du etwas einsendest.",
    },
    {
      title: "Messer übergeben",
      text: "Wie das Messer zu mir kommt und wie du es sicher verpackst, stimmen wir in der Rückmeldung ab.",
    },
    {
      title: "Schärfen und Rückgabe",
      text: "Ich schärfe das Messer und gebe es zurück. Gibt es Fragen zum Zustand, melde ich mich vorher.",
    },
  ] satisfies ProcessStep[],
  accepts: [
    "Küchenmesser, europäisch und japanisch",
    "Taschen- und Klappmesser",
    "Feststehende Messer für Outdoor und Werkstatt",
    "Schwerter – nur nach individueller Prüfung",
  ],
  note: "Preise und Dauer stehen noch nicht fest. Sie hängen von Klinge, Länge und Zustand ab; ich nenne sie dir nach deiner Anfrage.",
  pageLead:
    "Ein stumpfes Messer ist selten ein verlorenes. Beschreib, was du hast – dann sehe ich mir an, wie es wieder schneidet.",
};

export const customWork = {
  eyebrow: "03 · Maßarbeit",
  title: "Dein Griff. Deine Scheide.",
  lead: "Form, Holz, Leder und Details legst du mit mir fest. Ausgangspunkt kann eines der Messer sein, dein eigenes Messer oder ein neues nach deinen Vorstellungen.",
  topics: [
    { title: "Griff", text: "Holzart, Form, Größe und Stifte. Passend zu deiner Hand und zu dem, was du damit tust." },
    { title: "Scheide", text: "Leder, Farbe, Tragart und Naht. Von der schlichten Scheide bis zum passenden Etui." },
    { title: "Kombination", text: "Griff und Scheide aufeinander abgestimmt – oder beides einzeln, für ein Messer, das du schon hast." },
  ] satisfies ProcessStep[],
  steps: [
    { title: "Wunsch beschreiben", text: "Du füllst die Projektanfrage aus: Ausgangsprodukt, Material, Stil, Budgetrahmen und eine Beschreibung." },
    { title: "Abstimmen", text: "Wir besprechen Material, Form und Details. Ein Angebot gibt es erst danach." },
    { title: "Anfertigen", text: "Ich fertige Griff und Scheide als Einzelstück. Wie lange das dauert, hängt vom Projekt ab." },
  ] satisfies ProcessStep[],
  materialNote:
    "Materialauswahl als Beispiel. Was für dein Projekt möglich ist, klären wir in der Abstimmung. Die Darstellungen sind Konzeptillustrationen, keine Fotos.",
  pageLead:
    "Ein Messer, das zu deiner Hand passt, sieht man und spürt man. Beschreib dein Projekt, dann klären wir gemeinsam, was möglich ist.",
};

export const workshop = {
  eyebrow: "04 · Werkstatt",
  title: "Handarbeit statt Stückzahl.",
  lead: "Glut & Grat ist eine kleine Schmiede, die von einer Person betrieben wird. Hier entstehen wenige Dinge, dafür einzeln: Messer, Griffe, Scheiden und scharfe Klingen für andere.",
  person: {
    title: "Meisterschmied",
    name: "David",
    text: "Ich bin David, Meisterschmied, und betreibe Glut & Grat allein. Deine Anfrage landet bei mir, und was in der Werkstatt entsteht, geht durch meine Hände.",
    open: "Nachname, Werdegang und ein Foto von David folgen, sobald sie vorliegen. Bis dahin gibt es hier bewusst keine erfundene Biografie.",
  },
  principles: [
    { title: "Material verstehen", text: "Stahl, Holz und Leder verhalten sich unterschiedlich. Wer sie kennt, wählt sie passend zum Einsatz." },
    { title: "Einzeln fertigen", text: "Keine Serie vom Band. Jedes Stück entsteht für sich; kleine Abweichungen gehören dazu." },
    { title: "Klar sagen, was geht", text: "Maße, Materialien und Fertigungszeiten stehen offen auf der Seite. Wenn etwas nicht geht, sage ich es dir vorher." },
  ] satisfies ProcessStep[],
  stations: [
    { title: "Schmieden", text: "Der Stahl wird erhitzt und in Form geschmiedet. Dabei entstehen Profil, Spitze und die typische Schmiedehaut." },
    { title: "Wärmebehandlung", text: "Härten und Anlassen entscheiden, wie hart und wie zäh die Klinge wird." },
    { title: "Schleifen", text: "Fase, Schneide und Oberfläche werden herausgearbeitet und fein abgezogen." },
    { title: "Griff", text: "Das Holz wird gewählt, geformt und mit Stiften befestigt, bis es zur Hand passt." },
    { title: "Scheide und Finish", text: "Leder wird zugeschnitten und genäht, die Klinge geölt und zuletzt scharf abgezogen." },
  ] satisfies ProcessStep[],
  stationsNote: "Allgemeine Beschreibung der Arbeitsschritte. Die konkrete Arbeitsweise der Werkstatt wird ergänzt.",
  materials: [
    {
      title: "Stahl",
      text: "Kohlenstoffstahl lässt sich sehr scharf schleifen und gut nachschärfen. Dafür braucht er Pflege: Er bildet Patina und rostet, wenn er nass bleibt.",
    },
    {
      title: "Holz",
      text: "Dichte Hölzer wie Walnuss, Eiche und Esche sind belastbar und formstabil, wenn sie gut getrocknet sind. Jeder Griff hat eine eigene Maserung.",
    },
    {
      title: "Leder",
      text: "Leder wird mit Gebrauch dunkler und bekommt Charakter. Dauernässe verträgt es nicht, ein wenig Pflege dafür sehr gut.",
    },
  ] satisfies ProcessStep[],
};

export const faq: FaqItem[] = [
  {
    question: "Wer steckt hinter Glut & Grat?",
    answer:
      "Glut & Grat wird von einer Person betrieben: von mir, Meisterschmied David. Du sprichst deshalb direkt mit der Person, die dein Messer fertigt, schärft oder gestaltet.",
  },
  {
    question: "Sind die Messer, Preise und Lieferzeiten echt?",
    answer:
      "Nein, noch nicht. Alle Produkte, Preise, Materialien und Fertigungszeiten sind Beispieldaten für diese Vorschau. Bestellen kann man hier nichts; die Kasse ist ein reiner Demo-Durchlauf.",
  },
  {
    question: "Wie lange dauert die Fertigung eines Messers?",
    answer:
      "Jedes Messer wird einzeln gefertigt. Die Fertigungszeit steht auf der Produktseite – aktuell als Beispielangabe. Verbindliche Zeiten werden mit dem Start festgelegt.",
  },
  {
    question: "Wie pflege ich ein Messer aus Kohlenstoffstahl?",
    answer:
      "Nach Gebrauch von Hand abwaschen und sofort trocknen, nicht in die Spülmaschine. Der Stahl bekommt mit der Zeit Patina; das ist normal. Gelegentlich dünn mit lebensmittelechtem Öl einreiben.",
  },
  {
    question: "Was kostet das Schärfen?",
    answer:
      "Das hängt von Messer, Länge und Zustand ab. Feste Preise gibt es noch nicht. Nach deiner Anfrage bekommst du von mir eine Einschätzung, bevor du etwas einsendest.",
  },
  {
    question: "Werden auch Schwerter geschärft?",
    answer:
      "Nach individueller Prüfung. Beschreib die Klinge in der Anfrage möglichst genau. Mit der Anfrage ist noch keine Zusage verbunden.",
  },
  {
    question: "Wie läuft eine individuelle Anfertigung ab?",
    answer:
      "Du beschreibst dein Projekt in der Projektanfrage. Danach stimmen wir Material und Details ab; ein Angebot gibt es erst nach dieser Abstimmung.",
  },
  {
    question: "Kann ich Fotos mitschicken?",
    answer:
      "Einen Upload gibt es noch nicht. Beschreib Zustand oder Vorstellung bitte in Worten. Bei Rückfragen kannst du Bilder nachreichen.",
  },
  {
    question: "Wie sind Versand, Zahlung und Rückgabe geregelt?",
    answer:
      "Versandarten, Zahlungsarten und Widerrufsbedingungen werden vor dem Start festgelegt und hier veröffentlicht. Bis dahin sind die Seiten dazu Platzhalter.",
  },
];

export const contactSection = {
  eyebrow: "05 · Kontakt",
  title: "Noch eine Frage?",
  lead: "Schreib, was du wissen möchtest. Für einen Schärfauftrag oder ein individuelles Projekt sind die strukturierten Anfragen der bessere Weg.",
};

/** Platzhalter für rechtliche Seiten: Es werden bewusst keine Rechtstexte erfunden. */
export interface LegalContent {
  title: string;
  description: string;
  needed: string[];
  facts?: string[];
}

export const legalPages: Record<"impressum" | "datenschutz" | "agb" | "widerruf", LegalContent> = {
  impressum: {
    title: "Impressum",
    description: "Platzhalter für das Impressum.",
    needed: [
      "Vollständiger Name und Anschrift des Anbieters (bekannt: David, Meisterschmied; Nachname, Anschrift und Rechtsform fehlen noch)",
      "Kontaktmöglichkeiten: E-Mail-Adresse und weiterer Kontaktweg",
      "Registereintrag und Registernummer, falls vorhanden",
      "Umsatzsteuer-Identifikationsnummer oder Hinweis zur Kleinunternehmerregelung, falls zutreffend",
      "Angaben zur zuständigen Kammer oder Aufsicht, falls zutreffend",
    ],
  },
  datenschutz: {
    title: "Datenschutz",
    description: "Platzhalter für die Datenschutzerklärung.",
    needed: [
      "Verantwortliche Stelle und Kontakt",
      "Hosting-Anbieter und Serverstandort",
      "Empfänger der Formularanfragen (Webhook-Ziel, E-Mail-Dienst oder Ticketsystem)",
      "Zahlungsanbieter und Versanddienstleister, sobald angebunden",
      "Speicherdauer, Rechtsgrundlagen und Betroffenenrechte",
    ],
    facts: [
      "Der Warenkorb wird im lokalen Speicher des Browsers abgelegt (Produkt, Auswahl, Menge). Es werden keine Preise oder Kontaktdaten gespeichert.",
      "Schriften werden von der eigenen Seite ausgeliefert; es werden keine Schriften von Drittanbietern nachgeladen.",
      "Es sind keine Analyse- oder Werbedienste eingebunden.",
      "Ohne konfigurierten Versandweg werden Formularangaben weder gesendet noch gespeichert.",
    ],
  },
  agb: {
    title: "Allgemeine Geschäftsbedingungen",
    description: "Platzhalter für die AGB.",
    needed: [
      "Vertragsschluss bei Bestellungen und bei Anfertigungen nach Maß",
      "Preise, Versandkosten und Zahlungsarten",
      "Fertigungs- und Lieferzeiten",
      "Ablauf und Bedingungen des Schärfservice, inklusive Prüfung vor Annahme",
      "Altersnachweis und Versandbeschränkungen für Messer und Klingen",
      "Gewährleistung und Haftung",
    ],
  },
  widerruf: {
    title: "Widerruf & Rückgabe",
    description: "Platzhalter für Widerrufsbelehrung und Rückgabe.",
    needed: [
      "Widerrufsbelehrung und Muster-Widerrufsformular für Standardprodukte",
      "Regelung für Maßanfertigungen und individuelle Projekte",
      "Regelung für den Schärfservice als Dienstleistung",
      "Ablauf von Rücksendung, Kosten und Erstattung",
    ],
  },
};
