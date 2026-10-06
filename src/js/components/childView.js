/* Kinderliste und eine Seite je Kind (A4, Teil der Sammel-PDF). Liefert die Seiten als Liste. */
import { CHILD, CHILD_FIELDS, REPORT } from "../config.js";
import { fillTemplate } from "../domain/outcomes.js";
import { formatChildField } from "./childFields.js";
import { createLegend, createLineChart } from "./lineChart.js";
import {
  createPage,
  createReportFooter,
  createReportHeader,
  el,
  periodText,
} from "./reportParts.js";

const pageId = (child) => `seite-${child.id}`;

function createList({ kpf, period, summaries, locale }) {
  const page = createPage(CHILD.listTitle);
  const header = createReportHeader({
    title: CHILD.listTitle,
    meta: `${REPORT.scopeLabel}: ${kpf.name} · ${periodText(period, locale)}`,
  });
  const table = el("table", "data-table");
  const headRow = el("tr");
  for (const field of CHILD_FIELDS) {
    const cell = el("th", "data-table__head", field.label);
    cell.scope = "col";
    headRow.append(cell);
  }
  const thead = el("thead");
  thead.append(headRow);
  table.append(thead);
  const body = el("tbody");
  for (const summary of summaries) {
    const row = el("tr");
    for (const field of CHILD_FIELDS) {
      const cell = el("td", "data-table__cell");
      const text = formatChildField(summary, field);
      if (field.key === "name" && summary.hasData) {
        const link = el("a", "data-table__link", text);
        link.href = `#${pageId(summary)}`;
        cell.append(link);
      } else {
        cell.textContent = text;
      }
      row.append(cell);
    }
    body.append(row);
  }
  table.append(body);
  page.append(header, el("p", "report__intro", CHILD.listIntro), table, createReportFooter());
  return page;
}

function createChildPage({ kpf, period, summary, locale }) {
  const page = createPage(`${CHILD.pageTitle}: ${summary.name}`, pageId(summary));
  page.classList.add("report--compact");
  page.append(
    createReportHeader({
      title: `${CHILD.pageTitle}: ${summary.name}`,
      meta: `${REPORT.scopeLabel}: ${kpf.name} · ${periodText(period, locale)}`,
    }),
  );

  const info = el("dl", "info-list");
  for (const field of CHILD_FIELDS) {
    info.append(
      el("dt", "info-list__label", field.label),
      el("dd", "info-list__value", formatChildField(summary, field)),
    );
  }
  page.append(info);
  if (summary.subjects.some((subject) => subject.showChart)) page.append(createLegend());

  for (const subject of summary.subjects) {
    const section = el("section", "child-section");
    section.setAttribute("aria-label", subject.label);
    if (subject.showChart) {
      section.append(createLineChart({ subjectLabel: subject.label, rows: subject.rows, locale }));
    } else {
      section.append(el("h3", "report__subject", subject.label));
      const message =
        subject.testCount === 0
          ? CHILD.noTestsMessage
          : fillTemplate(CHILD.tooFewMessage, {
              min: CHILD.minTestPoints,
              count: subject.testCount,
            });
      section.append(el("p", "child-section__note", message));
    }
    page.append(section);
  }
  page.append(createReportFooter());
  return page;
}

/* summaries: Ergebnis von summarizeChild je Kind. Ohne Kinder: keine Seiten. */
export function renderChildPages({ kpf, period, summaries, locale }) {
  if (summaries.length === 0) return [];
  return [
    createList({ kpf, period, summaries, locale }),
    ...summaries
      .filter((summary) => summary.hasData)
      .map((summary) => createChildPage({ kpf, period, summary, locale })),
  ];
}
