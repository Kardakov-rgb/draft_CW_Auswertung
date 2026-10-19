/* Text- und Zahlenformate (ohne DOM). */

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

/* Zerlegt Text mit **fett** in Teile: [{ text, strong }]. Ohne Markierung ein einziger Teil. */
export function parseEmphasis(text) {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, index) => ({ text: part, strong: index % 2 === 1 }))
    .filter((part) => part.text !== "");
}
