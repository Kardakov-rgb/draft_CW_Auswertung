import { test } from "node:test";
import assert from "node:assert/strict";
import { levelShade } from "../src/js/domain/levelScale.js";

test("levelShade: niedrigste Stufe hell, höchste dunkel", () => {
  assert.equal(levelShade([1, 2, 3, 4], 1), 1);
  assert.equal(levelShade([1, 2, 3, 4], 4), 5);
  assert.equal(levelShade([2, 4, 6], 2), 1);
  assert.equal(levelShade([2, 4, 6], 4), 3);
  assert.equal(levelShade([2, 4, 6], 6), 5);
});

test("levelShade: Farbstufen steigen mit der Stufe", () => {
  const shades = [1, 2, 3, 4].map((level) => levelShade([1, 2, 3, 4], level));
  assert.deepEqual(
    shades,
    [...shades].sort((a, b) => a - b),
  );
  assert.equal(new Set(shades).size, 4);
});

test("levelShade: Text und Zahl gleich, unbekannte Stufe ergibt null", () => {
  assert.equal(levelShade([2, 4, 6], "4"), 3);
  assert.equal(levelShade([2, 4, 6], 3), null);
  assert.equal(levelShade([2, 4, 6], null), null);
});
