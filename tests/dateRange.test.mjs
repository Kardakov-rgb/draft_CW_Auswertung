import { test } from "node:test";
import assert from "node:assert/strict";
import {
  defaultDateRange,
  formatIsoDate,
  isDateInRange,
  schoolYearStart,
  toIsoDate,
  validateDateRange,
} from "../src/js/domain/dateRange.js";

const START = { month: 8, day: 1 };

test("schoolYearStart: ab 01.08. gilt das laufende Jahr, davor das Vorjahr", () => {
  assert.equal(schoolYearStart(new Date(2026, 9, 5), START), "2026-08-01");
  assert.equal(schoolYearStart(new Date(2026, 7, 1), START), "2026-08-01");
  assert.equal(schoolYearStart(new Date(2026, 6, 31), START), "2025-08-01");
  assert.equal(schoolYearStart(new Date(2027, 0, 15), START), "2026-08-01");
  assert.equal(schoolYearStart(new Date(2026, 11, 31), START), "2026-08-01");
});

test("defaultDateRange: Schuljahresbeginn bis heute", () => {
  assert.deepEqual(defaultDateRange(new Date(2026, 9, 5), START), {
    from: "2026-08-01",
    to: "2026-10-05",
  });
});

test("toIsoDate nutzt das lokale Datum, auch kurz nach Mitternacht", () => {
  assert.equal(toIsoDate(new Date(2026, 0, 2, 0, 5)), "2026-01-02");
});

test("validateDateRange", () => {
  assert.deepEqual(validateDateRange({ from: "2026-08-01", to: "2026-10-05" }), {
    valid: true,
    error: null,
  });
  assert.equal(validateDateRange({ from: "2026-08-01", to: "2026-08-01" }).valid, true);
  assert.equal(validateDateRange({ from: "2026-10-05", to: "2026-08-01" }).error, "order");
  assert.equal(validateDateRange({ from: "", to: "2026-08-01" }).error, "missing");
  assert.equal(validateDateRange({ from: "2026-08-01" }).error, "missing");
});

test("isDateInRange: beide Grenzen gehören dazu", () => {
  const range = { from: "2026-08-01", to: "2026-10-05" };
  assert.ok(isDateInRange("2026-08-01", range));
  assert.ok(isDateInRange("2026-10-05", range));
  assert.ok(!isDateInRange("2026-07-31", range));
  assert.ok(!isDateInRange("2026-10-06", range));
});

test("formatIsoDate: deutsches Format", () => {
  assert.equal(formatIsoDate("2026-08-01", "de-DE"), "01.08.2026");
});
