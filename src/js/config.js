/* Zentrale Konfiguration der Demo.
   Alles, was sich später ohne Eingriff in den Code ändern soll (Fächer, Kategorien, Texte,
   Dateiname), steht hier. */

export const APP = {
  title: "Auswertung",
  badge: "Demo-Version",
  /* Sprache der Oberfläche und Zahlenformate */
  locale: "de-DE",
};

/* Kategorien der Auswertung, in dieser Reihenfolge (links nach rechts im Balken).
   key:         Schlüssel in den gelieferten Zahlen (siehe data/outcomes.js)
   label:       Beschriftung in der Legende
   success:     zählt zur Erfolgsquote (Summe der success-Kategorien / alle Testungen)
   colorToken:  Farbe des Segments (Token aus tokens.css)
   textToken:   Textfarbe im Segment (Token aus tokens.css)
   Neue Kategorie = Eintrag hier + Wert in den Daten, kein Eingriff im Code. */
export const CATEGORIES = [
  {
    key: "improved",
    label: "Verbessert (Klasse aufgestiegen)",
    success: true,
    colorToken: "--chart-improved",
    textToken: "--color-on-accent",
  },
  {
    key: "stable",
    label: "Konstant auf hohem Niveau (≥ 80 %)",
    success: true,
    colorToken: "--chart-stable",
    textToken: "--color-on-primary",
  },
  {
    key: "unchanged",
    label: "Unverändert in Ausgangsklasse",
    success: false,
    colorToken: "--chart-unchanged",
    textToken: "--color-on-gray",
  },
];

/* Fächer, in dieser Reihenfolge (Berichtsseite wechselt Diagramm links/rechts).
   Schlüssel = Schlüssel in den gelieferten Daten.
   text: Erklärtext, {share} wird durch die berechnete Erfolgsquote ersetzt. */
export const SUBJECTS = [
  {
    key: "math",
    label: "Mathe",
    chartTitle: "Gesamterfolgsquote der Förderung (Mathematik)",
    text: "Durch die kontinuierliche Begleitung schließen die Schüler:innen grundlegende Verständnislücken in den Grundrechenarten. Die Ergebnisse zeigen: {share} der Testungen zeigen eine verbesserte Niveaustufe oder ein dauerhaft hohes Leistungsniveau (≥ 80 %).",
  },
  {
    key: "german",
    label: "Deutsch",
    chartTitle: "Gesamterfolgsquote der Förderung (Deutsch)",
    text: "In den Übungseinheiten werden Leseverständnis, Wortschatz und Grammatik gestärkt. {share} der Testungen zeigen nachhaltige Lernfortschritte oder ein stabil hohes Kompetenzniveau.",
  },
];

/* Texte der Berichtsseite. */
export const REPORT = {
  title: "Ergebnisse der CHANCENkurve",
  intro:
    "Die CHANCENkurve ist eine datengestützte Lernverlaufsdiagnostik zur Erfassung des individuellen Lernfortschritts. Sie wird in der Regel alle 4 bis 6 Wochen direkt im Rahmen der Lernförderung durchgeführt.",
  scopeLabel: "KPF",
  periodLabel: "Zeitraum",
  /* Platzhalter: Logo und Fußzeile übernimmt der Dienstleister aus dem Corporate-Design-Template. */
  logoPlaceholder: "Logo",
  footer: "Platzhalter für Fußzeile (Name, Anschrift, Kontakt der Organisation)",
  emptyMessage: "Für diese KPF liegen im gewählten Zeitraum keine Auswertungsdaten vor.",
};

/* Achsenbeschriftung des Balkens in Prozent. */
export const AXIS_TICKS = [0, 20, 40, 60, 80, 100];

/* Zeitraum-Filter. Standard: Beginn des laufenden Schuljahres bis heute.
   schoolYearStart: Monat (1-12) und Tag, an dem das Schuljahr beginnt (hier 01.08.). */
export const DATE_FILTER = {
  schoolYearStart: { month: 8, day: 1 },
  errors: {
    missing: "Bitte Von- und Bis-Datum angeben.",
    order: "Das Von-Datum darf nicht nach dem Bis-Datum liegen.",
  },
};

/* Dateiname des PDFs: {FILE.prefix}_{KPF-Name}_{von JJJJMMTT}-{bis JJJJMMTT}.pdf */
export const FILE = { prefix: "CKurve" };

/* ---------- Auswertung pro Kind ---------- */

/* Linien im Verlaufsdiagramm. Gesamt wird aus richtig + falsch berechnet (nicht geliefert).
   marker: circle | square | triangle (verschiedene Formen, damit nicht nur die Farbe unterscheidet) */
export const SERIES = [
  { key: "total", label: "Gesamt beantwortet", colorToken: "--chart-total", marker: "circle" },
  { key: "correct", label: "Richtig beantwortet", colorToken: "--chart-correct", marker: "square" },
  { key: "wrong", label: "Falsch beantwortet", colorToken: "--chart-wrong", marker: "triangle" },
];

export const CHILD = {
  /* Ein Verlauf wird erst ab dieser Zahl an Testzeitpunkten gezeigt (1 und 2 werden nicht gezeigt). */
  minTestPoints: 3,
  /* Höchstzahl beschrifteter Testzeitpunkte auf der x-Achse, sonst wird ausgedünnt. */
  maxXLabels: 12,
  pageTitle: "Auswertung",
  listTitle: "Kinderliste",
  listIntro:
    "Alle Kinder dieser KPF im gewählten Zeitraum. Kinder ohne Test haben keine eigene Seite.",
  chartTitle: "Entwicklung der Antwortzahlen ({subject})",
  xAxisTitle: "Testzeitpunkt",
  yAxisTitle: "Anzahl Aufgaben",
  tableCaption: "Werte je Testzeitpunkt ({subject})",
  tooFewMessage:
    "Ein Verlauf wird ab {min} Testzeitpunkten gezeigt. Im Zeitraum liegen {count} vor.",
  noTestsMessage: "Im Zeitraum wurde in diesem Fach kein Test durchgeführt.",
  emptyListMessage: "Für diese KPF liegen keine Kinder vor.",
  noValue: "–",
};

/* Spalten der Kinderliste und Felder im Infoblock einer Kinder-Seite, in dieser Reihenfolge.
   type: text | subjects | testCount | level (Darstellung in components/childFields.js)
   Neue Angabe = Eintrag hier (+ ggf. Darstellung in childFields.js). */
export const CHILD_FIELDS = [
  { key: "name", label: "Name", type: "text" },
  { key: "grade", label: "Klasse", type: "text" },
  { key: "subjects", label: "Fächer", type: "subjects" },
  { key: "testCount", label: "Anzahl Tests", type: "testCount" },
  { key: "level", label: "Niveau (Levumi)", type: "level" },
];

/* Spalten der Wertetabelle unter dem Diagramm. type: number | date | percent */
export const CHILD_TABLE_COLUMNS = [
  { key: "testNumber", label: "Testzeitpunkt", type: "number" },
  { key: "date", label: "Datum", type: "date" },
  { key: "total", label: "Gesamt", type: "number" },
  { key: "correct", label: "Richtig", type: "number" },
  { key: "wrong", label: "Falsch", type: "number" },
  { key: "correctShare", label: "Richtig in %", type: "percent" },
];
