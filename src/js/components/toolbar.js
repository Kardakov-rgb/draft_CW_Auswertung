/* Werkzeugleiste: KPF-Auswahl und Export-Button. */
export function initToolbar({ kpfs, onKpfChange, onExport }) {
  const select = document.querySelector("[data-kpf-select]");
  const button = document.querySelector("[data-export]");

  select.replaceChildren(
    ...kpfs.map((kpf) => {
      const option = document.createElement("option");
      option.value = kpf.id;
      option.textContent = kpf.name;
      return option;
    }),
  );
  select.addEventListener("change", () => onKpfChange(select.value));
  button.addEventListener("click", onExport);

  return {
    selectedId: () => select.value,
    setExportEnabled(enabled) {
      button.disabled = !enabled;
      button.title = enabled ? "" : "Keine Daten für den Export verfügbar";
    },
  };
}
