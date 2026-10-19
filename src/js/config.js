/* Zentrale Konfiguration der Demo.
   Alles, was sich später ohne Eingriff in den Code ändern soll (Fächer, Kategorien, Texte,
   Dateiname), steht hier. */

export const APP = {
  title: "Auswertung",
  badge: "Demo-Version",
  /* Sprache der Oberfläche und Zahlenformate */
  locale: "de-DE",
};

/* Fächer, in dieser Reihenfolge. Schlüssel = Schlüssel in den gelieferten Daten. */
export const SUBJECTS = [
  { key: "math", label: "Mathe" },
  { key: "german", label: "Deutsch" },
];

/* Texte der ersten Seite. */
export const REPORT = {
  title: "Ergebnisse der CHANCENkurve",
  /* Zwei Infokarten unter dem Kopf. **fett** im Text markiert wichtige Begriffe. */
  introCards: [
    {
      title: "Wer wir sind",
      text: "Chancenwerk e.V. möchte die Chancen auf einen **gerechteren Bildungserfolg** von Kindern und Jugendlichen **unabhängig von ihrer sozioökonomischen Herkunft** erhöhen. Daher unterstützen wir Schüler:innen beim Lernen in ihrer Schule oder digital zu Hause, deren Erziehungsberechtigte ihnen aus zeitlichen, sprachlichen oder finanziellen Gründen nicht helfen können. Mehr Informationen über unseren Verein, unsere Angebote und unsere Wirkung finden Sie auf unserer Website:",
    },
    {
      title: "Was ist die CHANCENkurve?",
      text: "Die CHANCENkurve ist unser Instrument zur **Lernverlaufsdiagnostik**. Sie basiert auf den Levumi-Tests und macht den individuellen Lernfortschritt sichtbar. Im Rahmen der Lernförderung an dieser Schule findet sie in der Regel **alle vier bis sechs Wochen** statt. Im Mittelpunkt stehen grundlegende Kompetenzen in **Mathematik und Deutsch**. So erkennen wir früh, wo noch Basiswissen fehlt, und können genau dort ansetzen.",
    },
  ],
  /* Hervorgehobener QR-Code-Block neben der ersten Karte; der Code führt zu website.url. */
  website: {
    url: "https://www.chancenwerk.de",
    qrImage: "assets/images/qr-chancenwerk.svg",
    callToAction: "Mehr über uns erfahren",
    hint: "QR-Code scannen oder Adresse aufrufen",
  },
  qrAlt: "QR-Code zur Website von Chancenwerk e.V.",
  scopeLabel: "KPF",
  periodLabel: "Zeitraum",
  /* Logo (hellgrün, transparent: steht auf einer dunkelgrünen Fläche). Die Fußzeile ist ein Platzhalter,
     den der Dienstleister aus dem Corporate-Design-Template übernimmt. */
  logo: { src: "assets/images/chancenwerk-logo.png", alt: "Chancenwerk e.V." },
  footer: "Platzhalter für Fußzeile (Name, Anschrift, Kontakt der Organisation)",
};

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
