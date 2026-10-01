/* Fachlogik der Auswertung (ohne DOM): Zahlen je Kategorie -> Anteile und Erfolgsquote. */

/* counts:     { [categoryKey]: Anzahl der Testungen }
   categories: Liste wie CATEGORIES in config.js (key, success)
   Rückgabe:   { total, segments: [{ key, count, share }], successShare }
   share und successShare sind Prozent (0 bis 100); bei total 0 sind alle Anteile 0. */
export function summarizeOutcomes(counts, categories) {
  const segments = categories.map((category) => ({
    key: category.key,
    count: Number(counts?.[category.key]) || 0,
  }));
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);
  const percent = (count) => (total === 0 ? 0 : (count / total) * 100);

  const successCount = categories
    .filter((category) => category.success)
    .reduce((sum, category) => sum + (segments.find((s) => s.key === category.key)?.count ?? 0), 0);

  return {
    total,
    segments: segments.map((segment) => ({ ...segment, share: percent(segment.count) })),
    successShare: percent(successCount),
  };
}

/* Prozentwert in deutscher Schreibweise, z. B. 81,4 % oder 82 %. */
export function formatPercent(
  value,
  locale,
  { minimumFractionDigits = 0, maximumFractionDigits = 1 } = {},
) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value / 100);
}

/* Ersetzt {name} im Text durch values.name; unbekannte Platzhalter bleiben stehen. */
export function fillTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in values ? values[name] : match));
}
