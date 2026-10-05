/* ERSATZPUNKT (Daten): Auswertungszahlen einer KPF in einem Zeitraum.
   Demo: erfundene Testungen mit Datum, im Code erzeugt und hier nach Zeitraum gefiltert.
   Produktiv: Abfrage in der Datenbank (Testdatum zwischen from und to, beide inklusive),
   nur für berechtigte Personen.
   Aufruf:    getOutcomes(kpfId, { from: "JJJJ-MM-TT", to: "JJJJ-MM-TT" })
   Rückgabe:  Promise<{
     kpfId: string,
     period: { from, to },           // der abgefragte Zeitraum
     results: {                      // je Fach: Anzahl der Testungen je Kategorie
       [subjectKey]: { [categoryKey]: number }
     }
   }>
   Fächer und Kategorien: SUBJECTS und CATEGORIES in js/config.js.
   Fehlt ein Fach oder sind alle Zahlen 0, zeigt die Seite "keine Daten". */
import { CATEGORIES } from "../config.js";
import { isDateInRange } from "../domain/dateRange.js";

/* Erfundene Testungen: je KPF und Fach alle `every` Tage ab 01.08.2025 ein Eintrag mit Zahlen.
   kpf-c hat bewusst keine Testungen. */
const DEMO_SETUP = {
  "kpf-a": { every: 4, seed: 1 },
  "kpf-b": { every: 9, seed: 3 },
};
const DEMO_SUBJECTS = ["math", "german"];
const DEMO_START = Date.UTC(2025, 7, 1);
const DEMO_DAYS = 800;

function createDemoRecords(kpfId) {
  const setup = DEMO_SETUP[kpfId];
  if (!setup) return [];
  const records = [];
  DEMO_SUBJECTS.forEach((subject, subjectIndex) => {
    const seed = setup.seed + subjectIndex * 2;
    for (let day = 0; day < DEMO_DAYS; day += setup.every) {
      const date = new Date(DEMO_START + day * 86_400_000).toISOString().slice(0, 10);
      records.push({
        date,
        subject,
        counts: {
          improved: 1 + ((day * 5 + seed) % 4),
          stable: 2 + ((day * 3 + seed) % 5),
          unchanged: (day * 7 + seed) % 3,
        },
      });
    }
  });
  return records;
}

export async function getOutcomes(kpfId, period) {
  const results = {};
  for (const record of createDemoRecords(kpfId)) {
    if (!isDateInRange(record.date, period)) continue;
    results[record.subject] ??= Object.fromEntries(CATEGORIES.map((category) => [category.key, 0]));
    for (const category of CATEGORIES) {
      results[record.subject][category.key] += record.counts[category.key] ?? 0;
    }
  }
  return { kpfId, period, results };
}
