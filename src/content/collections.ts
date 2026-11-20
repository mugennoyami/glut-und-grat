/** Geplante Sortimente: bewusst getrennt vom bestellbaren Demo-Katalog. */
export type ArmoryMotif = "armor" | "sword" | "katana" | "shield";
export interface Collection {
  slug: string;
  name: string;
  shortName: string;
  number: string;
  motif: ArmoryMotif;
  intro: string;
  description: string;
  pieces: { name: string; description: string }[];
  note: string;
}

export const collections: Collection[] = [
  {
    slug: "ruestungen", name: "Rüstungen & Gewandung", shortName: "Rüstungen", number: "I", motif: "armor",
    intro: "Für den Charakter, den du verkörperst.",
    description: "Vom ersten Rüstungsteil bis zur stimmigen Darstellung: Hier entsteht ein Sortiment für Mittelaltermärkte, Fantasy und Rollenspiel. Stahl, Leder und textile Lagen sollen sich zu deinem Charakter zusammenfügen.",
    pieces: [
      { name: "Helme & Kopfschutz", description: "Historisch inspirierte Formen als Ergänzung für deine Darstellung." },
      { name: "Brust & Schultern", description: "Brustplatten und Schulterteile für Ritter, Wachen und eigene Fantasy-Charaktere." },
      { name: "Arme & Beine", description: "Einzelne Rüstungsteile zum schrittweisen Aufbau deiner Ausrüstung." },
      { name: "Leder & Unterzeug", description: "Lederrüstung und gepolsterte Lagen als Grundlage einer stimmigen Gewandung." },
    ],
    note: "Passform, Materialstärke und Schutzwirkung müssen je Produkt festgelegt werden. Die Konzeptdarstellungen sind keine Schutzausrüstung und keine Zusage für den Kampfeinsatz.",
  },
  {
    slug: "schwerter", name: "Mittelalterliche Schwerter", shortName: "Schwerter", number: "II", motif: "sword",
    intro: "Geschichte in Form gebracht.",
    description: "Europäische Schwertformen für historische Darstellung und Sammlung. Geplant sind klare Linien vom Einhandschwert bis zum langen Schwert – mit Angaben zu Ausführung und Verwendungszweck an jedem späteren Produkt.",
    pieces: [
      { name: "Einhandschwerter", description: "Klassische Formen mit gerader Parierstange für mittelalterlich inspirierte Charaktere." },
      { name: "Langschwerter", description: "Lange Griffe und ausgewogene Proportionen als eigene Linie im künftigen Sortiment." },
      { name: "Historische Vorbilder", description: "Von frühmittelalterlichen Formen bis zu späteren europäischen Klingen." },
      { name: "Scheiden & Gehänge", description: "Passende Aufbewahrung und Tragekonzepte, abgestimmt auf Schwert und Gewandung." },
    ],
    note: "Dekoration, scharfe Klinge und Schaukampf sind unterschiedliche Ausführungen. Eine Eignung für Schaukampf oder Training wird erst nach Prüfung ausdrücklich am jeweiligen Produkt angegeben.",
  },
  {
    slug: "larp", name: "LARP & Rollenspiel", shortName: "LARP & Rollenspiel", number: "III", motif: "shield",
    intro: "Deine Rolle. Deine Geschichte.",
    description: "Für Lagerfeuer, Abenteuer und den nächsten Con: Geplant sind Polsterwaffen, Schilde und Zubehör für Charaktere zwischen Mittelalter und Fantasy. Auch für deinen Besuch auf dem Mittelaltermarkt findest du hier die passende Richtung.",
    pieces: [
      { name: "Polsterwaffen", description: "Ein geplanter, eigener Bereich für LARP-Waffen – getrennt von Stahlklingen." },
      { name: "Schilde", description: "Schildformen für deine Darstellung; Aufbau und Einsatzbereich werden je Modell benannt." },
      { name: "Gürtel & Taschen", description: "Kleine Begleiter für Markt, Lager und Rollenspiel, passend zur Gewandung." },
      { name: "Charakter-Ausrüstung", description: "Ideen für ein stimmiges Gesamtbild vom Wanderer bis zur Burgwache." },
    ],
    note: "Ob Ausrüstung auf einer Veranstaltung zugelassen ist, entscheidet deren Regelwerk und Waffencheck. Stahlklingen sind keine LARP-Polsterwaffen; eine pauschale Con-Freigabe gibt es hier nicht.",
  },
  {
    slug: "katana", name: "Katana & japanische Schwerter", shortName: "Katana & Japan", number: "IV", motif: "katana",
    intro: "Eine andere Tradition. Dieselbe Faszination.",
    description: "Eine eigene Sammlung für japanische Klingenformen: Katana, Wakizashi und Tantō. Im Mittelpunkt stehen die Linien der Klinge, Griffwicklung und Saya – mit transparenten Angaben zu Herkunft und Fertigung, sobald die Produkte feststehen.",
    pieces: [
      { name: "Katana", description: "Die charakteristisch geschwungene Langklinge als Mittelpunkt der geplanten Japan-Kollektion." },
      { name: "Wakizashi", description: "Die kürzere japanische Schwertform als Ergänzung oder eigenständiges Sammlerstück." },
      { name: "Tantō", description: "Kompakte japanische Klingenformen mit eigener gestalterischer Sprache." },
      { name: "Saya & Zubehör", description: "Scheiden, Präsentation und Pflege passend zum späteren Sortiment." },
    ],
    note: "Herkunft, Stahl, Schärfe und Eignung für Training sind noch offen. Es werden keine traditionelle japanische Fertigung, Nihontō-Eigenschaft oder Schnittfestigkeit zugesichert.",
  },
];

export const armory = {
  eyebrow: "Die Rüstkammer",
  title: "Wähle deinen Weg.",
  lead: "Mittelalter, Fantasy oder die Kunst japanischer Klingen: Entdecke die vier Welten unseres kommenden Sortiments.",
  planned: "Sortiment in Planung",
  planningNote: "Die neuen Kollektionen sind in Vorbereitung. Modelle, Preise und Starttermine stehen noch nicht fest. Die Abbildungen sind gestalterische Konzepte, keine Produktfotos.",
};

export const useCases = [
  { title: "Auf den Markt", text: "Gewandung, Leder und Rüstungsteile für deinen nächsten Mittelaltermarkt.", href: "/ruestkammer/ruestungen", action: "Rüstungen entdecken" },
  { title: "Ins Abenteuer", text: "Polsterwaffen, Schilde und Zubehör für deinen LARP-Charakter.", href: "/ruestkammer/larp", action: "LARP entdecken" },
  { title: "In die Sammlung", text: "Europäische und japanische Klingenformen mit Charakter.", href: "/ruestkammer/katana", action: "Japanische Klingen entdecken" },
];
