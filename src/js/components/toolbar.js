/* Werkzeugleiste: KPF-Auswahl, Zeitraum (Von/Bis) und Export-Button. */
export function initToolbar({
  kpfs,
  range,
  maxDate,
  onKpfChange,
  onRangeChange,
  onReset,
  onExport,
}) {
  const select = document.querySelector("[data-kpf-select]");
  const fromInput = document.querySelector("[data-date-from]");
  const toInput = document.querySelector("[data-date-to]");
  const resetButton = document.querySelector("[data-date-reset]");
  const errorBox = document.querySelector("[data-date-error]");
  const exportButton = document.querySelector("[data-export]");

  select.replaceChildren(
    ...kpfs.map((kpf) => {
      const option = document.createElement("option");
      option.value = kpf.id;
      option.textContent = kpf.name;
      return option;
    }),
  );
  toInput.max = maxDate;
  fromInput.max = maxDate;

  const setRange = (next) => {
    fromInput.value = next.from;
    toInput.value = next.to;
  };
  setRange(range);

  select.addEventListener("change", () => onKpfChange(select.value));
  const readRange = () => ({ from: fromInput.value, to: toInput.value });
  fromInput.addEventListener("change", () => onRangeChange(readRange()));
  toInput.addEventListener("change", () => onRangeChange(readRange()));
  resetButton.addEventListener("click", onReset);
  exportButton.addEventListener("click", onExport);

  return {
    selectedId: () => select.value,
    setRange,
    setError(message) {
      errorBox.textContent = message ?? "";
      fromInput.toggleAttribute("aria-invalid", Boolean(message));
      toInput.toggleAttribute("aria-invalid", Boolean(message));
    },
    setExportEnabled(enabled) {
      exportButton.disabled = !enabled;
      exportButton.title = enabled ? "" : "Keine Daten für den Export verfügbar";
    },
  };
}
