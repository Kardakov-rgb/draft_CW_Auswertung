/* ERSATZPUNKT (Daten): KPFs, die die angemeldete Person sehen darf.
   Demo: erfundene Beispiele. Produktiv: aus der Datenbank, gefiltert nach Rolle
   (Schulteambegleitung, Ansprechperson) und Zuordnung.
   Rückgabe: Promise<Array<{ id: string, name: string }>> */
const DEMO_KPFS = [
  { id: "kpf-a", name: "KPF Beispiel A" },
  { id: "kpf-b", name: "KPF Beispiel B (Größe äöü)" },
  { id: "kpf-c", name: "KPF Beispiel C (ohne Daten)" },
];

export async function getKpfs() {
  return DEMO_KPFS;
}
