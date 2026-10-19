/* ERSATZPUNKT (Daten): Kinder einer KPF mit ihren Testzeitpunkten im Zeitraum.
   Demo: erfundene Kinder und Zahlen, im Code erzeugt. Produktiv: aus den Rohdaten der Tests
   zusammengesetzt (siehe docs/HANDOVER.md, "Von den Rohdaten zur Auswertung"), nur für berechtigte
   Personen, mit Klarnamen aus der Benutzerverwaltung.
   Aufruf:   getChildReports(kpfId, { from: "JJJJ-MM-TT", to: "JJJJ-MM-TT" })
   Rückgabe: Promise<Array<{
     child: { id: string, name: string, grade: string },
     results: {                       // je Fach (Schlüssel wie SUBJECTS in js/config.js)
       [subjectKey]: Array<{          // ein Eintrag je Testzeitpunkt im Zeitraum
         testNumber: number,          // beginnt bei jedem Niveauwechsel wieder bei 1
         date: string,                // "JJJJ-MM-TT"
         correct: number,             // richtig beantwortete Aufgaben
         wrong: number,               // falsch beantwortete Aufgaben
         level: number | string | null, // Niveaustufe (levumi_level) bei diesem Test
         speed: number | null           // Geschwindigkeit: bearbeitete Items pro Minute, null wenn nicht erhoben
       }>
     }
   }>>
   Gesamt wird nicht geliefert, es ist richtig + falsch. Fächer ohne Test im Zeitraum fehlen oder
   sind leer. Kinder ohne Test im Zeitraum werden trotzdem geliefert. */
import { isDateInRange } from "../domain/dateRange.js";

/* Erfundene Kinder (Fantasienamen). */
const DEMO_CHILDREN = {
  "kpf-a": [
    { id: "kind-a1", name: "Mia Musterkind", grade: "5a" },
    { id: "kind-a2", name: "Ben Beispiel", grade: "5a" },
    { id: "kind-a3", name: "Lena Probe", grade: "5a" },
    { id: "kind-a4", name: "Noah Demo", grade: "5b" },
    { id: "kind-a5", name: "Emma Platzhalter", grade: "5b" },
    { id: "kind-a6", name: "Paul Testmann", grade: "5b" },
    { id: "kind-a7", name: "Sofia Vorlage", grade: "5b" },
    { id: "kind-a8", name: "Luca Ohnetest", grade: "5b" },
  ],
  "kpf-b": [
    { id: "kind-b1", name: "Zoë Beispiel-Süd", grade: "6a" },
    { id: "kind-b2", name: "Jonas Muster", grade: "6a" },
    { id: "kind-b3", name: "Hannah Demo", grade: "6a" },
    { id: "kind-b4", name: "Finn Probe", grade: "6b" },
  ],
};

const DEMO_SUBJECTS = ["math", "german"];
const DEMO_START = Date.UTC(2025, 7, 1);
const DAY = 86_400_000;
const DEMO_TESTS = 57; // alle 14 Tage, reicht über zwei Schuljahre

/* Besonderheiten zur Anschauung: Kind 4 (Index 3) nur Mathe, Kind 6 (Index 5) beginnt spät
   (wenige Testzeitpunkte im Standard-Zeitraum), das letzte Kind der KPF A hat keinen Test. */
function createResults(childIndex, isLastOfKpfA) {
  if (isLastOfKpfA) return {};
  const results = {};
  DEMO_SUBJECTS.forEach((subject, subjectIndex) => {
    if (childIndex % 4 === 3 && subject === "german") return;
    const startOffset = childIndex === 5 ? 400 : 0;
    /* Niveaustufe steigt ab Test t1 und dann alle 8 Tests (je Kind und Fach versetzt, bis zur höchsten
       Stufe des Fachs). Die Testnummer beginnt bei jedem Niveauwechsel wieder bei 1. */
    const ladder = subject === "math" ? [1, 2, 3, 4] : [2, 4, 6];
    const t1 = 26 + ((childIndex * 3 + subjectIndex * 2) % 6);
    const levelOf = (i) =>
      ladder[Math.min(ladder.length - 1, i < t1 ? 0 : 1 + Math.floor((i - t1) / 8))];
    results[subject] = Array.from({ length: DEMO_TESTS }, (_, i) => {
      const level = levelOf(i);
      let testNumber = 1;
      while (i - testNumber >= 0 && levelOf(i - testNumber) === level) testNumber += 1;
      const day = startOffset + i * 14 + childIndex * 2 + subjectIndex * 3;
      const total = 30 + ((childIndex * 7 + testNumber * 5 + subjectIndex * 3) % 14);
      const wrong = (childIndex + testNumber * 3 + subjectIndex) % 5;
      return {
        testNumber,
        date: new Date(DEMO_START + day * DAY).toISOString().slice(0, 10),
        correct: total - wrong,
        wrong,
        level,
        speed:
          8 + ((childIndex * 3 + testNumber * 7 + subjectIndex * 5) % 10) + (testNumber % 4) / 4,
      };
    });
  });
  return results;
}

export async function getChildReports(kpfId, period) {
  const children = DEMO_CHILDREN[kpfId] ?? [];
  return children.map((child, index) => {
    const all = createResults(index, kpfId === "kpf-a" && index === children.length - 1);
    const results = {};
    for (const [subject, points] of Object.entries(all)) {
      const inPeriod = points.filter((point) => isDateInRange(point.date, period));
      if (inPeriod.length > 0) results[subject] = inPeriod;
    }
    return { child, results };
  });
}
