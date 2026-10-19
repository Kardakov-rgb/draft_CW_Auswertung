/* Gemeinsame Bausteine der A4-Seiten (KPF-Bericht, Kinderliste, Kind-Seiten). */
import { REPORT } from "../config.js";
import { formatIsoDate } from "../domain/dateRange.js";

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* Eine A4-Seite (im Browser eine Karte, im Druck eine Seite). */
export function createPage(label, id) {
  const page = el("article", "report");
  page.setAttribute("aria-label", label);
  if (id) page.id = id;
  return page;
}

export function periodText(period, locale) {
  return `${REPORT.periodLabel}: ${formatIsoDate(period.from, locale)} – ${formatIsoDate(period.to, locale)}`;
}

export function createReportHeader({ title, meta }) {
  const header = el("header", "report__header");
  const heading = el("div");
  heading.append(el("h2", "report__title", title), el("p", "report__meta", meta));
  const logo = el("img", "report__logo");
  logo.src = REPORT.logo.src;
  logo.alt = REPORT.logo.alt;
  header.append(heading, logo);
  return header;
}

export function createReportFooter() {
  return el("footer", "report__footer", REPORT.footer);
}
