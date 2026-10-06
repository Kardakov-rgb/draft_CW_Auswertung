import { test } from "node:test";
import assert from "node:assert/strict";
import { labelStep, niceTicks, pointPosition } from "../src/js/domain/scale.js";

test("niceTicks: 47 -> 0 bis 50 in Zehnerschritten", () => {
  assert.deepEqual(niceTicks(47), [0, 10, 20, 30, 40, 50]);
});

test("niceTicks: kleine und leere Werte", () => {
  assert.deepEqual(niceTicks(4), [0, 1, 2, 3, 4, 5].slice(0, niceTicks(4).length));
  assert.ok(niceTicks(0).length >= 2);
  assert.ok(niceTicks(4).at(-1) >= 4);
});

test("niceTicks: Obergrenze liegt nie unter dem Maximalwert", () => {
  for (const max of [1, 7, 33, 99, 101, 250, 1234]) {
    assert.ok(niceTicks(max).at(-1) >= max, `max ${max}`);
  }
});

test("pointPosition: Einzelpunkt mittig, sonst gleichmäßig von 0 bis 1", () => {
  assert.equal(pointPosition(0, 1), 0.5);
  assert.equal(pointPosition(0, 5), 0);
  assert.equal(pointPosition(4, 5), 1);
  assert.equal(pointPosition(2, 5), 0.5);
});

test("labelStep: dünnt Beschriftungen aus", () => {
  assert.equal(labelStep(6, 12), 1);
  assert.equal(labelStep(24, 12), 2);
  assert.equal(labelStep(25, 12), 3);
});
