/* Berichtsseite (A4-Layout, auch Vorlage für das PDF): Kopf, Einleitung, je Fach Text und Diagramm. */
import { CATEGORIES, REPORT, SUBJECTS } from "../config.js";
import { fillTemplate, formatPercent, summarizeOutcomes } from "../domain/outcomes.js";
import { createBarChart } from "./barChart.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatDate(isoDate, locale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(isoDate));
}

/* Liefert false, wenn für kein Fach Daten vorliegen (dann ist der Export nicht sinnvoll). */
export function renderReport(container, { kpf, outcomes, locale }) {
  const summaries = SUBJECTS.map((subject) => ({
    subject,
    summary: summarizeOutcomes(outcomes.results[subject.key], CATEGORIES),
  })).filter(({ summary }) => summary.total > 0);

  const header = el("header", "report__header");
  const heading = el("div");
  heading.append(
    el("h2", "report__title", REPORT.title),
    el(
      "p",
      "report__meta",
      `${REPORT.scopeLabel}: ${kpf.name} · ${REPORT.asOfLabel}: ${formatDate(outcomes.asOf, locale)}`,
    ),
  );
  header.append(heading, el("div", "report__logo", REPORT.logoPlaceholder));

  const body = [header];
  if (summaries.length === 0) {
    body.push(el("p", "report__empty", REPORT.emptyMessage));
  } else {
    body.push(el("p", "report__intro", REPORT.intro));
    summaries.forEach(({ subject, summary }, index) => {
      const section = el("section", "report__section");
      if (index % 2 === 1) section.classList.add("report__section--reverse");
      const text = el("div", "report__text");
      text.append(
        el("h3", "report__subject", subject.label),
        el(
          "p",
          "",
          fillTemplate(subject.text, { share: formatPercent(summary.successShare, locale) }),
        ),
      );
      const chart = createBarChart({ title: subject.chartTitle, summary, locale });
      section.append(chart, text);
      body.push(section);
    });
  }
  body.push(el("footer", "report__footer", REPORT.footer));

  container.replaceChildren(...body);
  return summaries.length > 0;
}
