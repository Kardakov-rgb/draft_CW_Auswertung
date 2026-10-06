/* Achsen-Berechnung für Diagramme (ohne DOM). */

/* Gleichmäßige Achsenwerte von 0 bis über den Maximalwert, z. B. 47 -> 0, 10, 20, 30, 40, 50. */
export function niceTicks(maxValue, maxTickCount = 5) {
  const max = Math.max(Number(maxValue) || 0, 1);
  const rough = max / maxTickCount;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10]
    .map((factor) => factor * power)
    .find((candidate) => candidate >= rough);
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let value = 0; value <= top + step / 1000; value += step) {
    ticks.push(Math.round(value * 1e6) / 1e6);
  }
  return ticks;
}

/* Lage eines Punktes auf der x-Achse von 0 bis 1; ein einzelner Punkt liegt in der Mitte. */
export function pointPosition(index, count) {
  return count <= 1 ? 0.5 : index / (count - 1);
}

/* Schrittweite für Achsenbeschriftungen: jede n-te, sodass höchstens maxLabels erscheinen. */
export function labelStep(count, maxLabels) {
  return Math.max(1, Math.ceil(count / maxLabels));
}
