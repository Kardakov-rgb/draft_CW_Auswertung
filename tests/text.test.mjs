import { test } from "node:test";
import assert from "node:assert/strict";
import { fillTemplate, formatPercent, parseEmphasis } from "../src/js/domain/text.js";

const plain = (text) => text.replace(/\s/g, " ");

test("formatPercent: deutsche Schreibweise", () => {
  assert.equal(plain(formatPercent(82, "de-DE")), "82 %");
  assert.equal(plain(formatPercent(81.4, "de-DE")), "81,4 %");
  assert.equal(plain(formatPercent(39, "de-DE", { minimumFractionDigits: 1 })), "39,0 %");
});

test("fillTemplate ersetzt bekannte Platzhalter und lässt unbekannte stehen", () => {
  assert.equal(fillTemplate("{a} und {b}", { a: "X" }), "X und {b}");
});

test("parseEmphasis trennt fett markierte Teile", () => {
  assert.deepEqual(parseEmphasis("a **b** c"), [
    { text: "a ", strong: false },
    { text: "b", strong: true },
    { text: " c", strong: false },
  ]);
  assert.deepEqual(parseEmphasis("ohne"), [{ text: "ohne", strong: false }]);
});
