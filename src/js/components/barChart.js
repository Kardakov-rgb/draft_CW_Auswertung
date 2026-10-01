/* Balkendiagramm (100 %-gestapelt) als HTML/CSS, ohne Bibliothek.
   Segmentbreite = Anzahl (flex-grow), Beschriftung steht als Text im Segment (barrierefrei). */
import { AXIS_TICKS, CATEGORIES } from "../config.js";
import { formatPercent } from "../domain/outcomes.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function createBarChart({ title, summary, locale }) {
  const figure = el("figure", "bar-chart");
  const caption = el("figcaption", "bar-chart__title");
  caption.append(
    title,
    el("br"),
    `Stichprobe: n = ${new Intl.NumberFormat(locale).format(summary.total)} Testungen`,
  );

  const bar = el("div", "bar-chart__bar");
  for (const segment of summary.segments) {
    if (segment.count === 0) continue;
    const category = CATEGORIES.find((item) => item.key === segment.key);
    const node = el("div", "bar-chart__segment");
    node.style.setProperty("--share", segment.count);
    node.style.setProperty("--segment-color", `var(${category.colorToken})`);
    node.style.setProperty("--segment-text", `var(${category.textToken})`);
    const countLabel = el("span", "bar-chart__count", String(segment.count));
    countLabel.append(el("span", "bar-chart__unit", " Testungen"));
    node.append(
      countLabel,
      el(
        "span",
        "bar-chart__percent",
        `(${formatPercent(segment.share, locale, { minimumFractionDigits: 1 })})`,
      ),
    );
    bar.append(node);
  }

  const axis = el("div", "bar-chart__axis");
  axis.setAttribute("aria-hidden", "true");
  for (const tick of AXIS_TICKS) {
    const label = el("span", "bar-chart__tick", String(tick));
    label.style.setProperty("--position", tick);
    axis.append(label);
  }
  const axisTitle = el("p", "bar-chart__axis-title", "Anteil der Testungen (%)");

  const legend = el("ul", "bar-chart__legend");
  for (const category of CATEGORIES) {
    const item = el("li", "bar-chart__legend-item");
    const swatch = el("span", "bar-chart__swatch");
    swatch.style.setProperty("--segment-color", `var(${category.colorToken})`);
    item.append(swatch, category.label);
    legend.append(item);
  }

  figure.append(caption, bar, axis, axisTitle, legend);
  return figure;
}
