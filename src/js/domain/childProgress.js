/* Fachlogik der Kind-Auswertung (ohne DOM): Testzeitpunkte -> Verlauf, Quote, Kennzahlen. */

/* Abschnitte gleicher Niveaustufe in aufeinanderfolgenden Zeilen: [{ level, from, to }] (Indizes,
   beide inklusive). Zeilen ohne Niveaustufe bilden je einen eigenen Abschnitt mit level null,
   damit zwischen ihnen und ihren Nachbarn keine Linie gezogen wird. */
export function levelSegments(rows) {
  const segments = [];
  rows.forEach((row, index) => {
    const last = segments.at(-1);
    if (last && row.level !== null && row.level === last.level) last.to = index;
    else segments.push({ level: row.level, from: index, to: index });
  });
  return segments;
}

/* Letzte Niveaustufe vor dem aktuellen Niveau, die davon abweicht (null, wenn es keinen Wechsel gab). */
function previousLevel(rows) {
  const current = rows.at(-1)?.level ?? null;
  if (current === null) return null;
  for (let index = rows.length - 2; index >= 0; index -= 1) {
    const level = rows[index].level;
    if (level !== null && level !== current) return level;
  }
  return null;
}

/* points: [{ testNumber, date: "JJJJ-MM-TT", correct, wrong, level, speed }]
   speed: bearbeitete Items pro Minute (Zahl) oder null, wenn nicht erhoben.
   Rückgabe: Zeilen sortiert nach Datum (dann Testnummer), Niveau-Abschnitte, Anzahl, aktuelles und
   vorheriges Niveau und ob ein Verlauf gezeigt wird (ab minPoints Testzeitpunkten, gezählt über
   alle Niveaus des Fachs). testNumber kann bei jedem Niveauwechsel wieder bei 1 beginnen. Gesamt = richtig + falsch. */
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
      level: point.level ?? null,
      levelStart: false,
      speed: Number.isFinite(point.speed) ? point.speed : null,
      correctShare: total === 0 ? 0 : (correct / total) * 100,
    };
  });
  const segments = levelSegments(rows);
  segments.slice(1).forEach((segment) => {
    rows[segment.from].levelStart = true;
  });
  return {
    rows,
    segments,
    testCount: rows.length,
    level: sorted.at(-1)?.level ?? null,
    previousLevel: previousLevel(rows),
    showChart: rows.length >= minPoints,
  };
}

/* report: { child: { id, name, grade }, results: { [fachKey]: points } }
   subjects: Liste wie SUBJECTS in config.js */
export function summarizeChild(report, subjects, minPoints) {
  const perSubject = subjects.map((subject) => ({
    key: subject.key,
    label: subject.label,
    levels: subject.levels ?? [],
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
