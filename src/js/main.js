/* Einstiegspunkt: lädt Daten, verdrahtet Komponenten.
   Fachlogik liegt in domain/ (ohne DOM), Anbindungen an das System in services/ und data/. */
import { APP, DATE_FILTER, FILE } from "./config.js";
import { getKpfs } from "./data/kpfs.js";
import { getOutcomes } from "./data/outcomes.js";
import { defaultDateRange, toIsoDate, validateDateRange } from "./domain/dateRange.js";
import { buildFileName } from "./domain/fileName.js";
import { exportReportPdf } from "./services/pdfExportService.js";
import { renderReport } from "./components/reportView.js";
import { initToolbar } from "./components/toolbar.js";

async function init() {
  document.title = `${APP.title} (${APP.badge})`;
  document.querySelector("[data-app-title]").textContent = APP.title;
  document.querySelector("[data-app-badge]").textContent = APP.badge;

  const today = new Date();
  const kpfs = await getKpfs();
  const container = document.querySelector("[data-report]");
  const defaultRange = defaultDateRange(today, DATE_FILTER.schoolYearStart);
  let range = defaultRange;
  let current = null;

  /* Neu laden und zeichnen. Antworten, die nach einer neueren Eingabe eintreffen, werden verworfen. */
  let requestId = 0;
  async function show() {
    const id = ++requestId;
    const kpf = kpfs.find((item) => item.id === toolbar.selectedId());
    const outcomes = await getOutcomes(kpf.id, range);
    if (id !== requestId) return;
    const hasData = renderReport(container, { kpf, outcomes, locale: APP.locale });
    current = { kpf, outcomes };
    toolbar.setExportEnabled(hasData);
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
