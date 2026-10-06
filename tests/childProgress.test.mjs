import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeChild, summarizeSubject } from "../src/js/domain/childProgress.js";

const SUBJECTS = [
  { key: "math", label: "Mathe" },
  { key: "german", label: "Deutsch" },
];

/* Werte aus dem Beispieldiagramm "Fallbeispiel 7 (Deutsch)": Gesamt 35, 42, 36, 45, 40, 47 */
const CASE_7 = [
  [34, 1],
  [41, 1],
  [35, 1],
  [41, 4],
  [38, 2],
  [44, 3],
].map(([correct, wrong], index) => ({
  testNumber: index + 1,
  date: `2026-09-${String(index + 1).padStart(2, "0")}`,
  correct,
  wrong,
  level: 2,
}));

test("summarizeSubject: Gesamt = richtig + falsch (Fallbeispiel 7)", () => {
  const summary = summarizeSubject(CASE_7, 3);
  assert.deepEqual(
    summary.rows.map((row) => row.total),
    [35, 42, 36, 45, 40, 47],
  );
  assert.equal(summary.testCount, 6);
  assert.equal(summary.showChart, true);
});

test("summarizeSubject: Quote richtig in Prozent", () => {
  const [first] = summarizeSubject(CASE_7, 3).rows;
  assert.ok(Math.abs(first.correctShare - (34 / 35) * 100) < 1e-9);
});

test("summarizeSubject: Verlauf erst ab minPoints Testzeitpunkten (1 und 2 nicht)", () => {
  assert.equal(summarizeSubject(CASE_7.slice(0, 1), 3).showChart, false);
  assert.equal(summarizeSubject(CASE_7.slice(0, 2), 3).showChart, false);
  assert.equal(summarizeSubject(CASE_7.slice(0, 3), 3).showChart, true);
});

test("summarizeSubject: sortiert nach Datum, Niveau stammt vom letzten Test", () => {
  const shuffled = [
    { testNumber: 2, date: "2026-09-10", correct: 5, wrong: 1, level: 3 },
    { testNumber: 1, date: "2026-09-01", correct: 4, wrong: 2, level: 2 },
  ];
  const summary = summarizeSubject(shuffled, 3);
  assert.deepEqual(
    summary.rows.map((row) => row.testNumber),
    [1, 2],
  );
  assert.equal(summary.level, 3);
});

test("summarizeSubject: keine Daten, Quote ohne Division durch 0", () => {
  assert.equal(summarizeSubject(undefined, 3).testCount, 0);
  const [row] = summarizeSubject(
    [{ testNumber: 1, date: "2026-09-01", correct: 0, wrong: 0 }],
    3,
  ).rows;
  assert.equal(row.correctShare, 0);
});

test("summarizeChild: zählt Tests über alle Fächer, Kind ohne Test hat keine Daten", () => {
  const child = { id: "k1", name: "Test Kind", grade: "5a" };
  const withTests = summarizeChild(
    { child, results: { math: CASE_7, german: CASE_7.slice(0, 2) } },
    SUBJECTS,
    3,
  );
  assert.equal(withTests.testCount, 8);
  assert.equal(withTests.hasData, true);
  assert.equal(withTests.subjects[1].showChart, false);

  const without = summarizeChild({ child, results: {} }, SUBJECTS, 3);
  assert.equal(without.testCount, 0);
  assert.equal(without.hasData, false);
});
