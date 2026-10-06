/* Konfiguration lässt sich ohne Browser laden und ist in sich stimmig. */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  APP,
  AXIS_TICKS,
  CATEGORIES,
  CHILD,
  CHILD_FIELDS,
  CHILD_TABLE_COLUMNS,
  DATE_FILTER,
  SERIES,
  SUBJECTS,
} from "../src/js/config.js";

test("APP enthält Titel, Badge und Sprache", () => {
  assert.equal(typeof APP.title, "string");
  assert.equal(APP.locale, "de-DE");
});

test("Kategorien haben eindeutige Schlüssel und Token-Namen", () => {
  const keys = CATEGORIES.map((category) => category.key);
  assert.equal(new Set(keys).size, keys.length);
  for (const category of CATEGORIES) {
    assert.match(category.colorToken, /^--/);
    assert.match(category.textToken, /^--/);
  }
});

test("Fächer haben eindeutige Schlüssel und einen Text mit {share}", () => {
  const keys = SUBJECTS.map((subject) => subject.key);
  assert.equal(new Set(keys).size, keys.length);
  for (const subject of SUBJECTS) assert.ok(subject.text.includes("{share}"));
});

test("Achse reicht von 0 bis 100", () => {
  assert.equal(AXIS_TICKS[0], 0);
  assert.equal(AXIS_TICKS.at(-1), 100);
});

test("Schuljahresbeginn ist ein gültiges Datum", () => {
  const { month, day } = DATE_FILTER.schoolYearStart;
  assert.ok(month >= 1 && month <= 12 && day >= 1 && day <= 31);
});

test("Kind-Auswertung: Reihen, Felder und Tabellenspalten haben eindeutige Schlüssel", () => {
  for (const list of [SERIES, CHILD_FIELDS, CHILD_TABLE_COLUMNS]) {
    const keys = list.map((item) => item.key);
    assert.equal(new Set(keys).size, keys.length);
  }
  assert.ok(CHILD.minTestPoints >= 1);
  for (const series of SERIES) assert.match(series.colorToken, /^--/);
});
