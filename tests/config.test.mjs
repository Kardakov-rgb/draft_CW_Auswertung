/* Rauchtest: Konfiguration lässt sich ohne Browser laden und hat die erwartete Form. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { APP, COLUMNS } from "../src/js/config.js";

test("APP enthält Titel, Badge und Sprache", () => {
  assert.equal(typeof APP.title, "string");
  assert.equal(typeof APP.badge, "string");
  assert.equal(APP.locale, "de-DE");
});

test("COLUMNS ist eine Liste", () => {
  assert.ok(Array.isArray(COLUMNS));
});
