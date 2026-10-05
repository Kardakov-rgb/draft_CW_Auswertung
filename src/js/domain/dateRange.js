/* Zeitraum-Logik (ohne DOM). Alle Daten sind Text "JJJJ-MM-TT" (lokales Kalenderdatum). */

const pad = (number) => String(number).padStart(2, "0");

/* Lokales Kalenderdatum eines Date als "JJJJ-MM-TT" (nicht toISOString: das rechnet in UTC). */
export function toIsoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/* Beginn des Schuljahres, in dem `today` liegt.
   start: { month: 1-12, day } (Standard: 1. August).
   Beispiele bei 01.08.: 05.10.2026 -> 2026-08-01, 15.06.2026 -> 2025-08-01. */
export function schoolYearStart(today, start) {
  const hasStarted =
    today.getMonth() + 1 > start.month ||
    (today.getMonth() + 1 === start.month && today.getDate() >= start.day);
  const year = hasStarted ? today.getFullYear() : today.getFullYear() - 1;
  return `${year}-${pad(start.month)}-${pad(start.day)}`;
}

/* Standard-Zeitraum: Schuljahresbeginn bis heute. */
export function defaultDateRange(today, start) {
  return { from: schoolYearStart(today, start), to: toIsoDate(today) };
}

/* Prüft einen Zeitraum. Rückgabe: { valid, error } mit error "missing" | "order" | null. */
export function validateDateRange({ from, to }) {
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");
  if (!isDate(from) || !isDate(to)) return { valid: false, error: "missing" };
  if (from > to) return { valid: false, error: "order" };
  return { valid: true, error: null };
}

/* Beide Grenzen gehören zum Zeitraum. ISO-Daten lassen sich als Text vergleichen. */
export function isDateInRange(date, { from, to }) {
  return date >= from && date <= to;
}

/* "2026-08-01" -> "01.08.2026". In UTC gerechnet, damit die Zeitzone den Tag nicht verschiebt. */
export function formatIsoDate(isoDate, locale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00Z`),
  );
}
