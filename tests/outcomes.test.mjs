import { test } from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES } from "../src/js/config.js";
import { fillTemplate, formatPercent, summarizeOutcomes } from "../src/js/domain/outcomes.js";

const plain = (text) => text.replace(/\s/g, " ");

test("summarizeOutcomes: Mathe-Beispiel ergibt n = 428 und 82 % Erfolgsquote", () => {
  const summary = summarizeOutcomes({ improved: 167, stable: 184, unchanged: 77 }, CATEGORIES);
  assert.equal(summary.total, 428);
  assert.equal(
    plain(formatPercent(summary.segments[0].share, "de-DE", { minimumFractionDigits: 1 })),
    "39,0 %",
  );
  assert.equal(plain(formatPercent(summary.successShare, "de-DE")), "82 %");
});

test("summarizeOutcomes: Deutsch-Beispiel ergibt 81,4 %", () => {
  const summary = summarizeOutcomes({ improved: 88, stable: 153, unchanged: 55 }, CATEGORIES);
  assert.equal(summary.total, 296);
  assert.equal(plain(formatPercent(summary.successShare, "de-DE")), "81,4 %");
});

test("summarizeOutcomes: Anteile summieren sich auf 100", () => {
  const summary = summarizeOutcomes({ improved: 1, stable: 2, unchanged: 4 }, CATEGORIES);
  const sum = summary.segments.reduce((total, segment) => total + segment.share, 0);
  assert.ok(Math.abs(sum - 100) < 1e-9);
});

test("summarizeOutcomes: keine Daten ergibt total 0 und Anteile 0 (keine Division durch 0)", () => {
  for (const counts of [undefined, {}, { improved: 0, stable: 0, unchanged: 0 }]) {
    const summary = summarizeOutcomes(counts, CATEGORIES);
    assert.equal(summary.total, 0);
    assert.equal(summary.successShare, 0);
    assert.ok(summary.segments.every((segment) => segment.share === 0));
  }
});

test("summarizeOutcomes: ungültige Zahlen zählen als 0", () => {
  const summary = summarizeOutcomes({ improved: "x", stable: 5, unchanged: null }, CATEGORIES);
  assert.equal(summary.total, 5);
});

test("fillTemplate ersetzt bekannte Platzhalter und lässt unbekannte stehen", () => {
  assert.equal(fillTemplate("{a} und {b}", { a: "X" }), "X und {b}");
});
