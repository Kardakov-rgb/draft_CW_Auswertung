import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFileName, sanitizeForFileName } from "../src/js/domain/fileName.js";

test("sanitizeForFileName löst Umlaute auf und entfernt Sonderzeichen", () => {
  assert.equal(sanitizeForFileName("KPF Größe äöü (Süd/Nord)"), "KPF-Groesse-aeoeue-Sued-Nord");
});

test("sanitizeForFileName entfernt Akzente", () => {
  assert.equal(sanitizeForFileName("Café Zoë"), "Cafe-Zoe");
});

test("buildFileName: Schema Präfix_Name_VON-BIS.pdf", () => {
  assert.equal(
    buildFileName({
      prefix: "CKurve",
      name: "KPF Beispiel A",
      from: "2026-08-01",
      to: "2026-10-05",
    }),
    "CKurve_KPF-Beispiel-A_20260801-20261005.pdf",
  );
});
