/* Fachlogik der Kind-Auswertung (ohne DOM): Testzeitpunkte -> Verlauf, Quote, Kennzahlen. */

/* points: [{ testNumber, date: "JJJJ-MM-TT", correct, wrong, level }]
   Rückgabe: Zeilen sortiert nach Datum (dann Testnummer), Anzahl, aktuelles Niveau und ob ein
   Verlauf gezeigt wird (ab minPoints Testzeitpunkten). Gesamt = richtig + falsch. */
export function summarizeSubject(points, minPoints) {
  const sorted = [...(points ?? [])].sort(
    (a, b) => a.date.localeCompare(b.date) || a.testNumber - b.testNumber,
  );
  const rows = sorted.map((point) => {
    const correct = Number(point.correct) || 0;
    const wrong = Number(point.wrong) || 0;
    const total = correct + wrong;
    return {
      testNumber: point.testNumber,
      date: point.date,
      correct,
      wrong,
      total,
      correctShare: total === 0 ? 0 : (correct / total) * 100,
    };
  });
  return {
    rows,
    testCount: rows.length,
    level: sorted.at(-1)?.level ?? null,
    showChart: rows.length >= minPoints,
  };
}

/* report: { child: { id, name, grade }, results: { [fachKey]: points } }
   subjects: Liste wie SUBJECTS in config.js */
export function summarizeChild(report, subjects, minPoints) {
  const perSubject = subjects.map((subject) => ({
    key: subject.key,
    label: subject.label,
    ...summarizeSubject(report.results?.[subject.key], minPoints),
  }));
  const testCount = perSubject.reduce((sum, subject) => sum + subject.testCount, 0);
  return {
    id: report.child.id,
    name: report.child.name,
    grade: report.child.grade,
    subjects: perSubject,
    testCount,
    hasData: testCount > 0,
  };
}
