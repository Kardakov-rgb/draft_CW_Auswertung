/* Dateiname für den PDF-Export (ohne DOM). Schema: Präfix_Name_VON-BIS.pdf (Daten als JJJJMMTT) */

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

/* from, to: ISO-Text "JJJJ-MM-TT". */
export function buildFileName({ prefix, name, from, to }) {
  const compact = (iso) => iso.replaceAll("-", "");
  return `${prefix}_${sanitizeForFileName(name)}_${compact(from)}-${compact(to)}.pdf`;
}
