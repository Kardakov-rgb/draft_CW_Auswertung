/* Dateiname für den PDF-Export (ohne DOM). Schema: Präfix_Name_JJJJMMTT.pdf */

const UMLAUTS = { ä: "ae", ö: "oe", ü: "ue", Ä: "Ae", Ö: "Oe", Ü: "Ue", ß: "ss" };

/* Umlaute auflösen, Akzente entfernen, alles außer Buchstaben und Ziffern zu "-". */
export function sanitizeForFileName(text) {
  return text
    .replace(/[äöüÄÖÜß]/g, (char) => UMLAUTS[char])
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* date: Date oder ISO-Text "JJJJ-MM-TT". */
export function buildFileName({ prefix, name, date }) {
  const iso = typeof date === "string" ? date : date.toISOString();
  const compactDate = iso.slice(0, 10).replaceAll("-", "");
  return `${prefix}_${sanitizeForFileName(name)}_${compactDate}.pdf`;
}
