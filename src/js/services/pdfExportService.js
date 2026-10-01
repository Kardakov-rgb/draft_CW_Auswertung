/* ERSATZPUNKT (Service): PDF der Berichtsseite erzeugen.
   Demo: öffnet den Druckdialog des Browsers ("Als PDF speichern"). Der Seitentitel wird kurz auf
   den gewünschten Dateinamen gesetzt, Browser schlagen ihn als Dateinamen vor.
   Produktiv: serverseitige PDF-Erzeugung mit denselben Daten und diesem Layout; Antwort ist die
   PDF-Datei (Download oder neuer Tab). Berechtigung der Person serverseitig prüfen.
   Signatur: exportReportPdf({ fileName: string }) -> Promise<void> */
export async function exportReportPdf({ fileName }) {
  const originalTitle = document.title;
  document.title = fileName.replace(/\.pdf$/, "");
  const restore = () => {
    document.title = originalTitle;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.print();
}
