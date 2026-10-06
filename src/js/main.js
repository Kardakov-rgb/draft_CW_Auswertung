/* Einstiegspunkt: lädt Daten, verdrahtet Komponenten.
   Fachlogik liegt in domain/ (ohne DOM), Anbindungen an das System in services/ und data/. */
import { APP, CHILD, DATE_FILTER, FILE, SUBJECTS } from "./config.js";
import { getKpfs } from "./data/kpfs.js";
import { getChildReports } from "./data/children.js";
import { getOutcomes } from "./data/outcomes.js";
import { defaultDateRange, toIsoDate, validateDateRange } from "./domain/dateRange.js";
import { summarizeChild } from "./domain/childProgress.js";
import { buildFileName } from "./domain/fileName.js";
import { exportReportPdf } from "./services/pdfExportService.js";
import { renderChildPages } from "./components/childView.js";
import { createPage } from "./components/reportParts.js";
import { renderReport } from "./components/reportView.js";
import { initToolbar } from "./components/toolbar.js";

async function init() {
  document.title = `${APP.title} (${APP.badge})`;
  document.querySelector("[data-app-title]").textContent = APP.title;
  document.querySelector("[data-app-badge]").textContent = APP.badge;

  const today = new Date();
  const kpfs = await getKpfs();
  const documentEl = document.querySelector("[data-document]");
  const defaultRange = defaultDateRange(today, DATE_FILTER.schoolYearStart);
  let range = defaultRange;
  let current = null;

  /* Neu laden und zeichnen. Antworten, die nach einer neueren Eingabe eintreffen, werden verworfen. */
  let requestId = 0;
  async function show() {
    const id = ++requestId;
    const kpf = kpfs.find((item) => item.id === toolbar.selectedId());
    const [outcomes, childReports] = await Promise.all([
      getOutcomes(kpf.id, range),
      getChildReports(kpf.id, range),
    ]);
    if (id !== requestId) return;

    const reportPage = createPage("Auswertung der KPF");
    const hasReportData = renderReport(reportPage, { kpf, outcomes, locale: APP.locale });
    const summaries = childReports.map((report) =>
      summarizeChild(report, SUBJECTS, CHILD.minTestPoints),
    );
    const childPages = renderChildPages({
      kpf,
      period: outcomes.period,
      summaries,
      locale: APP.locale,
    });
    documentEl.replaceChildren(reportPage, ...childPages);

    current = { kpf, outcomes };
    toolbar.setExportEnabled(hasReportData || summaries.some((summary) => summary.hasData));
  }

  function changeRange(next) {
    const { valid, error } = validateDateRange(next);
    toolbar.setError(valid ? null : DATE_FILTER.errors[error]);
    if (!valid) {
      toolbar.setExportEnabled(false);
      return;
    }
    range = next;
    show();
  }

  const toolbar = initToolbar({
    kpfs,
    range,
    maxDate: toIsoDate(today),
    onKpfChange: show,
    onRangeChange: changeRange,
    onReset: () => {
      toolbar.setRange(defaultRange);
      changeRange(defaultRange);
    },
    onExport: () =>
      exportReportPdf({
        fileName: buildFileName({
          prefix: FILE.prefix,
          name: current.kpf.name,
          from: current.outcomes.period.from,
          to: current.outcomes.period.to,
        }),
      }),
  });

  await show();
}

init();
