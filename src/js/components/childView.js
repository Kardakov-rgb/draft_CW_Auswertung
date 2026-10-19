/* Erste Seite (Einleitung, QR-Code, Kinderliste) und eine Seite je Kind (A4, Teil der Sammel-PDF). */
import { CHILD, CHILD_FIELDS, REPORT } from "../config.js";
import { fillTemplate, parseEmphasis } from "../domain/text.js";
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

function createCard({ title, text }) {
  const card = el("section", "intro-card");
  const paragraph = el("p", "intro-card__text");
  for (const part of parseEmphasis(text)) {
    paragraph.append(part.strong ? el("strong", "", part.text) : part.text);
  }
  card.append(el("h3", "intro-card__title", title), paragraph);
  return card;
}

function createQrBox() {
  const { url, qrImage, callToAction, hint } = REPORT.website;
  const box = el("figure", "qr-box");
  const image = el("img", "qr-box__image");
  image.src = qrImage;
  image.alt = REPORT.qrAlt;
  const caption = el("figcaption", "qr-box__caption");
  caption.append(
    el("strong", "qr-box__cta", callToAction),
    el("span", "qr-box__url", url.replace(/^https?:\/\//, "")),
    el("span", "qr-box__hint", hint),
  );
  box.append(image, caption);
  return box;
}

function createIntro() {
  const [first, ...rest] = REPORT.introCards;
  const intro = el("div", "intro");
  const top = el("div", "intro__top");
  top.append(createCard(first), createQrBox());
  intro.append(top, ...rest.map(createCard));
  return intro;
}

function createStartPage({ kpf, period, summaries, locale }) {
  const page = createPage(REPORT.title);
  const header = createReportHeader({
    title: REPORT.title,
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
  page.append(header, createIntro());
  if (summaries.length === 0) page.append(el("p", "", CHILD.emptyListMessage));
  else page.append(table);
  page.append(createReportFooter());
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
      section.append(
        createLineChart({
          subjectLabel: subject.label,
          rows: subject.rows,
          segments: subject.segments,
          levels: subject.levels,
          locale,
        }),
      );
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

/* summaries: Ergebnis von summarizeChild je Kind. Die erste Seite gibt es immer. */
export function renderChildPages({ kpf, period, summaries, locale }) {
  return [
    createStartPage({ kpf, period, summaries, locale }),
    ...summaries
      .filter((summary) => summary.hasData)
      .map((summary) => createChildPage({ kpf, period, summary, locale })),
  ];
}
