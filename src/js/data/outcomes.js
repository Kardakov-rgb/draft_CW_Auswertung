/* ERSATZPUNKT (Daten): Auswertungszahlen einer KPF.
   Demo: erfundene Zahlen. Produktiv: aus der Datenbank (nur für berechtigte Personen).
   Rückgabe: Promise<{
     kpfId: string,
     asOf: string,                 // Stand der Daten, "JJJJ-MM-TT"
     results: {                    // je Fach: Anzahl der Testungen je Kategorie
       [subjectKey]: { [categoryKey]: number }
     }
   }>
   Fächer und Kategorien: SUBJECTS und CATEGORIES in js/config.js.
   Fehlt ein Fach oder sind alle Zahlen 0, zeigt die Seite "keine Daten". */
const DEMO_OUTCOMES = {
  "kpf-a": {
    asOf: "2026-09-22",
    results: {
      math: { improved: 120, stable: 150, unchanged: 60 },
      german: { improved: 70, stable: 110, unchanged: 45 },
    },
  },
  "kpf-b": {
    asOf: "2026-09-22",
    results: {
      math: { improved: 30, stable: 28, unchanged: 22 },
      german: { improved: 12, stable: 40, unchanged: 8 },
    },
  },
  "kpf-c": { asOf: "2026-09-22", results: {} },
};

export async function getOutcomes(kpfId) {
  const outcomes = DEMO_OUTCOMES[kpfId] ?? { asOf: "2026-09-22", results: {} };
  return { kpfId, ...outcomes };
}
