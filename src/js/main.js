/* Einstiegspunkt: lädt Daten, verdrahtet Komponenten.
   Fachlogik liegt in domain/ (ohne DOM), Anbindungen an das System in services/ und data/. */
import { APP, FILE } from "./config.js";
import { getKpfs } from "./data/kpfs.js";
import { getOutcomes } from "./data/outcomes.js";
import { buildFileName } from "./domain/fileName.js";
import { exportReportPdf } from "./services/pdfExportService.js";
import { renderReport } from "./components/reportView.js";
import { initToolbar } from "./components/toolbar.js";

async function init() {
  document.title = `${APP.title} (${APP.badge})`;
  document.querySelector("[data-app-title]").textContent = APP.title;
  document.querySelector("[data-app-badge]").textContent = APP.badge;

  const kpfs = await getKpfs();
  const container = document.querySelector("[data-report]");
  let current = null;

  async function show(kpfId) {
    const kpf = kpfs.find((item) => item.id === kpfId);
    const outcomes = await getOutcomes(kpfId);
    const hasData = renderReport(container, { kpf, outcomes, locale: APP.locale });
    current = { kpf, outcomes };
    toolbar.setExportEnabled(hasData);
  }

  const toolbar = initToolbar({
    kpfs,
    onKpfChange: show,
    onExport: () =>
      exportReportPdf({
        fileName: buildFileName({
          prefix: FILE.prefix,
          name: current.kpf.name,
          date: current.outcomes.asOf,
        }),
      }),
  });

  await show(toolbar.selectedId());
}

init();
