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
  asOfLabel: "Stand",
  /* Platzhalter: Logo und Fußzeile übernimmt der Dienstleister aus dem Corporate-Design-Template. */
  logoPlaceholder: "Logo",
  footer: "Platzhalter für Fußzeile (Name, Anschrift, Kontakt der Organisation)",
  emptyMessage: "Für diese KPF liegen noch keine Auswertungsdaten vor.",
};

/* Achsenbeschriftung des Balkens in Prozent. */
export const AXIS_TICKS = [0, 20, 40, 60, 80, 100];

/* Dateiname des PDFs: {FILE.prefix}_{KPF-Name}_{JJJJMMTT}.pdf */
export const FILE = { prefix: "CKurve" };
