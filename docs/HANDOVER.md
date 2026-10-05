# Übergabe an den IT-Dienstleister

## Zweck der Demo

Entwurf einer Seite, die der Dienstleister in das bestehende System übernimmt. Es ist **keine
Produktivanwendung**: Alle Daten sind erfunden, Anmeldung und Datenbank fehlen bewusst.
Anbindungen übernimmt der Dienstleister an den unten genannten Ersatzpunkten.

**Stand:** Funktion 1 ist fertig: Auswertungsseite pro KPF (CHANCENkurve) mit PDF-Export. Weitere folgen.

- Organisation / Bereich: _noch zu ergänzen_
- Ziel der Seite (ein Satz): _noch zu ergänzen_

## Funktionen

### 1. Auswertung der CHANCENkurve pro KPF mit PDF-Export

- Die Person wählt eine **KPF** (Auswertung erfolgt pro KPF). Die Seite zeigt eine A4-Berichtsseite:
  Titel, KPF-Name, Zeitraum, Einleitung, je Fach (Mathe, Deutsch) ein **Balkendiagramm** und
  ein Erklärtext. Das Diagramm wechselt je Fach die Seite (links/rechts), wie im Design.
- Balken: Anteil der **Testungen** je Kategorie (Verbessert, Konstant auf hohem Niveau, Unverändert).
  Die **Erfolgsquote** im Text (Verbessert + Konstant hoch) wird aus denselben Zahlen berechnet wie der
  Balken (`domain/outcomes.js`), nicht von Hand gepflegt. Gezählt werden Testungen, nicht Kinder.
- "Als PDF speichern" öffnet in der Demo den Druckdialog des Browsers. Der Seitentitel entspricht dem
  vorgesehenen Dateinamen `CKurve_<KPF-Name>_<von JJJJMMTT>-<bis JJJJMMTT>.pdf` (Umlaute und
  Sonderzeichen bereinigt). Das Datum im Namen ist der ausgewertete Zeitraum, nicht das Erstellungsdatum.
- **Zeitraum-Filter (Von/Bis):** Standard ist der **01.08. des laufenden Schuljahres bis heute**
  (liegt heute vor dem 01.08., beginnt das Schuljahr am 01.08. des Vorjahres). Beide Grenzen gehören
  zum Zeitraum. Der Filter wirkt auf das **Datum der Testung**. "Schuljahr zurücksetzen" stellt den
  Standard wieder her. Ungültige Eingaben (leer, Von nach Bis) zeigen eine Meldung, der Export ist
  dann gesperrt. "Bis" und "Von" können nicht in der Zukunft liegen. Schuljahresbeginn: `DATE_FILTER`
  in `src/js/config.js`. "Heute" ist das Datum im Browser der Person, nicht des Servers: Der
  Dienstleister prüft, ob die Datenbank denselben Tag (Zeitzone) verwendet.
- Hat eine KPF im Zeitraum keine Daten, zeigt die Seite einen Hinweis und der Export ist deaktiviert (Tooltip).
- Fächer, Kategorien, Farben (als Token-Namen), Texte und Dateinamen-Präfix stehen in `src/js/config.js`.
- **Bewusst offen / Entscheidung des Auftraggebers:** keine Mindestanzahl (n) für die Anzeige. Bei
  kleinen Gruppen sind Prozentwerte wenig aussagekräftig und können Einzelne erkennbar machen:
  Datenschutz mit dem Dienstleister klären. Ein Status "Zwischenstand/Final" ist nicht vorgesehen.
  Die Aussage "Ergebnisse zeigen ..." beschreibt Entwicklungen, keine nachgewiesene Wirkung
  (keine Vergleichsgruppe): Formulierung fachlich prüfen.
- **Rollen:** Schulteambegleitung und Ansprechperson sehen nur die KPFs ihrer Zuordnung. Die Demo
  hat keine Anmeldung; `getKpfs()` liefert in der Produktivversion nur erlaubte KPFs.
- **Platzhalter im Layout:** Logo und Fußzeile (Name, Anschrift, Kontakt) übernimmt der Dienstleister
  aus dem Corporate-Design-Template. Echte Organisationsdaten stehen nicht im öffentlichen Repo.

## Offene Fragen an den Dienstleister

1. **Zielsystem:** Welche Technik nutzt das bestehende System (Framework, Templates, Build)? Soll die
   Seite 1:1 als statische Dateien eingebunden oder in Komponenten des Systems überführt werden?
2. **Daten und Schnittstellen:** Welche Schnittstelle (REST, Datenbank direkt, andere) liefert die Daten
   der Ersatzpunkte? Wie sind Rückgabeformate und Fehlerfälle definiert?
3. **Anmeldung und Rechte:** Wie wird die Nutzerin / der Nutzer angemeldet, und wie wird geprüft,
   welche Daten sie oder er sehen darf?
4. **Hosting und Auslieferung:** Wo wird die Seite betrieben, welche Sicherheits-Header
   (Content-Security-Policy u. a.) gelten?
5. **Barrierefreiheit:** Welche Stufe ist Pflicht? (Ziel noch offen, Vorschlag WCAG 2.1 AA.)
6. **Browser und Geräte:** Bestätigung: aktuelle Chrome, Safari, Firefox auf Laptops und Tablets.
7. **Design-Übernahme:** Sollen die Tokens (`src/css/tokens.css`) auf bestehendes CSS des Systems
   abgebildet werden oder bleiben sie eigenständig?
8. **Fremdbibliotheken:** Gibt es Vorgaben für Lizenzen und Updates (Ordner `src/js/vendor/`)?

## Ersatzpunkte (Demo gegen Produktiv)

| Ersatzpunkt (Datei und Funktion) | Demo-Variante | Produktiv-Variante | Rückgabeformat |
| -------------------------------- | ------------- | ------------------ | -------------- |
| `src/js/data/kpfs.js` `getKpfs()` | drei erfundene KPFs | KPFs aus der Datenbank, nach Rolle und Zuordnung der angemeldeten Person gefiltert | `Promise<Array<{ id, name }>>` |
| `src/js/data/outcomes.js` `getOutcomes(kpfId, { from, to })` | erfundene Testungen mit Datum, im Code erzeugt und nach Zeitraum gefiltert | Anzahl der Testungen je Fach und Kategorie, Testdatum zwischen `from` und `to` (beide inklusive), direkt in der Datenbank aggregiert (Berechtigung prüfen) | `Promise<{ kpfId, period: { from, to }, results: { [fach]: { [kategorie]: Zahl } } }>` (Daten als `JJJJ-MM-TT`) |
| `src/js/services/pdfExportService.js` `exportReportPdf({ fileName })` | Druckdialog des Browsers (`window.print()`) | serverseitige PDF-Erzeugung mit diesem Layout; Datei als Download oder in neuem Tab | `Promise<void>` |

Regel: Die Oberfläche bleibt unverändert, solange Signatur und Rückgabeformat der Ersatzpunkte
erhalten bleiben.

## Sicherheits- und Datenschutzhinweise

- Die Demo kann öffentlich erreichbar sein (GitHub Pages): **nur erfundene Daten**, nie echte Namen
  oder Zugangsdaten im Repository.
- Schriften (Montserrat, Noto Serif) liegen lokal in `src/assets/fonts/`. Es werden keine Daten von
  Drittservern geladen.
- Die Fußzeile der Berichtsseite ist ein Platzhalter. Echte Namen, Adressen und Bankdaten der
  Organisation gehören nicht in dieses öffentliche Repository.
- Es gibt keine Anmeldung, keine Rechteprüfung und keine serverseitige Validierung. Beides gehört in
  die Produktivversion (Aufgabe des Dienstleisters).
- Personenbezogene Daten (sobald angebunden): Zweckbindung, Löschkonzept und Protokollierung mit dem
  Datenschutz klären.
