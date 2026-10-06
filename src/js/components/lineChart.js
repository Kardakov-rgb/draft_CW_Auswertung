/* Liniendiagramm als SVG, ohne Bibliothek, mit Legende und Wertetabelle (auch für Screenreader).
   Reihen: SERIES, Tabellenspalten: CHILD_TABLE_COLUMNS (beides in config.js). */
import { CHILD, CHILD_TABLE_COLUMNS, SERIES } from "../config.js";
import { formatIsoDate } from "../domain/dateRange.js";
import { formatPercent, fillTemplate } from "../domain/outcomes.js";
import { labelStep, niceTicks, pointPosition } from "../domain/scale.js";
import { el } from "./reportParts.js";

const NS = "http://www.w3.org/2000/svg";
const VIEW = { width: 600, height: 145, left: 48, right: 16, top: 12, bottom: 40, inset: 16 };

function svg(tag, attributes = {}, text) {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  if (text !== undefined) node.textContent = text;
  return node;
}

function marker(kind, x, y) {
  const attributes = { class: "line-chart__marker" };
  if (kind === "square")
    return svg("rect", { ...attributes, x: x - 4, y: y - 4, width: 8, height: 8 });
  if (kind === "triangle") {
    return svg("polygon", {
      ...attributes,
      points: `${x},${y - 5.5} ${x + 5},${y + 4} ${x - 5},${y + 4}`,
    });
  }
  return svg("circle", { ...attributes, cx: x, cy: y, r: 4.5 });
}

/* Legende der Reihen; auf einer Seite genügt eine für alle Diagramme. */
export function createLegend() {
  const list = el("ul", "line-chart__legend");
  for (const series of SERIES) {
    const item = el("li", "line-chart__legend-item");
    item.style.setProperty("--series-color", `var(${series.colorToken})`);
    const icon = svg("svg", {
      class: "line-chart__legend-icon",
      viewBox: "0 0 28 12",
      "aria-hidden": "true",
    });
    icon.append(
      svg("line", { class: "line-chart__line", x1: 0, y1: 6, x2: 28, y2: 6 }),
      marker(series.marker, 14, 6),
    );
    item.append(icon, series.label);
    list.append(item);
  }
  return list;
}

function createPlot({ rows, title, description }) {
  const plotWidth = VIEW.width - VIEW.left - VIEW.right;
  const plotHeight = VIEW.height - VIEW.top - VIEW.bottom;
  const maxValue = Math.max(...rows.map((row) => row.total));
  const ticks = niceTicks(maxValue);
  const top = ticks.at(-1);
  const x = (index) =>
    VIEW.left + VIEW.inset + pointPosition(index, rows.length) * (plotWidth - 2 * VIEW.inset);
  const y = (value) => VIEW.top + plotHeight - (value / top) * plotHeight;

  const chart = svg("svg", {
    class: "line-chart__svg",
    viewBox: `0 0 ${VIEW.width} ${VIEW.height}`,
    role: "img",
    "aria-label": `${title}. ${description}`,
  });

  for (const tick of ticks) {
    chart.append(
      svg("line", {
        class: "line-chart__grid",
        x1: VIEW.left,
        x2: VIEW.width - VIEW.right,
        y1: y(tick),
        y2: y(tick),
      }),
      svg(
        "text",
        { class: "line-chart__label line-chart__label--y", x: VIEW.left - 8, y: y(tick) + 4 },
        String(tick),
      ),
    );
  }
  chart.append(
    svg("line", {
      class: "line-chart__axis",
      x1: VIEW.left,
      x2: VIEW.left,
      y1: VIEW.top,
      y2: VIEW.top + plotHeight,
    }),
    svg("line", {
      class: "line-chart__axis",
      x1: VIEW.left,
      x2: VIEW.width - VIEW.right,
      y1: VIEW.top + plotHeight,
      y2: VIEW.top + plotHeight,
    }),
  );

  const step = labelStep(rows.length, CHILD.maxXLabels);
  rows.forEach((row, index) => {
    if (index % step !== 0) return;
    chart.append(
      svg(
        "text",
        {
          class: "line-chart__label line-chart__label--x",
          x: x(index),
          y: VIEW.top + plotHeight + 16,
        },
        String(row.testNumber),
      ),
    );
  });
  chart.append(
    svg(
      "text",
      { class: "line-chart__title", x: VIEW.left + plotWidth / 2, y: VIEW.height - 6 },
      CHILD.xAxisTitle,
    ),
    svg(
      "text",
      {
        class: "line-chart__title",
        transform: `rotate(-90 12 ${VIEW.top + plotHeight / 2})`,
        x: 12,
        y: VIEW.top + plotHeight / 2,
      },
      CHILD.yAxisTitle,
    ),
  );

  for (const series of SERIES) {
    const group = svg("g");
    group.style.setProperty("--series-color", `var(${series.colorToken})`);
    const points = rows.map((row, index) => [x(index), y(row[series.key])]);
    group.append(
      svg("polyline", {
        class: "line-chart__line",
        points: points.map((p) => p.join(",")).join(" "),
      }),
    );
    for (const [px, py] of points) group.append(marker(series.marker, px, py));
    chart.append(group);
  }
  return chart;
}

function formatCell(column, value, locale) {
  if (column.type === "date") return formatIsoDate(value, locale);
  if (column.type === "percent") return formatPercent(value, locale);
  return new Intl.NumberFormat(locale).format(value);
}

function createTable({ rows, caption, locale }) {
  const table = el("table", "data-table data-table--compact");
  table.append(el("caption", "visually-hidden", caption));
  const head = el("tr");
  for (const column of CHILD_TABLE_COLUMNS) {
    const cell = el("th", `data-table__head data-table__head--${column.type}`, column.label);
    cell.scope = "col";
    head.append(cell);
  }
  const thead = el("thead");
  thead.append(head);
  table.append(thead);
  const body = el("tbody");
  for (const row of rows) {
    const line = el("tr");
    for (const column of CHILD_TABLE_COLUMNS) {
      line.append(
        el(
          "td",
          `data-table__cell data-table__cell--${column.type}`,
          formatCell(column, row[column.key], locale),
        ),
      );
    }
    body.append(line);
  }
  table.append(body);
  return table;
}

/* subjectLabel: Name des Fachs; rows: Zeilen aus summarizeSubject (domain/childProgress.js). */
export function createLineChart({ subjectLabel, rows, locale }) {
  const title = fillTemplate(CHILD.chartTitle, { subject: subjectLabel });
  const first = rows[0];
  const last = rows.at(-1);
  const description = `${rows.length} Testzeitpunkte von ${formatIsoDate(first.date, locale)} bis ${formatIsoDate(last.date, locale)}. Die Werte stehen in der Tabelle darunter.`;

  const figure = el("figure", "line-chart");
  figure.append(
    el("figcaption", "line-chart__caption", title),
    createPlot({ rows, title, description }),
    createTable({
      rows,
      caption: fillTemplate(CHILD.tableCaption, { subject: subjectLabel }),
      locale,
    }),
  );
  return figure;
}
