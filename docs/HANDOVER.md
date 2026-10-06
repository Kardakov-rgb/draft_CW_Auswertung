# Übergabe an den IT-Dienstleister

## Zweck der Demo

Entwurf einer Seite, die der Dienstleister in das bestehende System übernimmt. Es ist **keine
Produktivanwendung**: Alle Daten sind erfunden, Anmeldung und Datenbank fehlen bewusst.
Anbindungen übernimmt der Dienstleister an den unten genannten Ersatzpunkten.

**Stand:** Auswertung pro KPF (Funktion 1), Zeitraum-Filter, Kinderliste und Auswertung pro Kind mit einer Sammel-PDF (Funktion 2). Weitere folgen.

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

### 2. Kinderliste und Auswertung pro Kind (Sammel-PDF)

- Hinter dem KPF-Bericht folgt eine **Kinderliste** (Name, Klasse, Fächer, Anzahl Tests, Niveau) und
  danach **eine Seite je Kind**. Alles zusammen ist **eine einzige PDF** ("Als PDF speichern"). Es gibt
  keine Einzel-PDF je Kind. In der Liste führt der Name zur Kind-Seite.
- **Kind-Seite:** Infoblock und je Fach ein Liniendiagramm "Entwicklung der Antwortzahlen" mit den Linien
  Gesamt, Richtig und Falsch (unterschiedliche Formen und Farben) und einer Wertetabelle (Testzeitpunkt,
  Datum, Gesamt, Richtig, Falsch, Richtig in %). Die Tabelle ist zugleich die barrierefreie Alternative zum
  Diagramm. **Gesamt wird berechnet** (richtig + falsch), nicht geliefert.
- **Mindestanzahl:** Ein Verlauf wird erst ab **3 Testzeitpunkten** je Fach gezeigt (`CHILD.minTestPoints`).
  Bei 1 oder 2 steht stattdessen ein Hinweis, bei 0 ebenfalls. Die Tests zählen trotzdem in "Anzahl Tests".
- Kinder ohne einen Test im Zeitraum stehen in der Liste, haben aber **keine eigene Seite**.
- **Gleicher Zeitraum-Filter** wie beim KPF-Bericht. Die x-Achse beschriftet die Testnummer aus den Daten
  (`testNumber`), nicht eine neue Zählung im Zeitraum.
- **Kein automatischer Fließtext** über einzelne Kinder, nur Zahlen und Grafik. (Bitte bestätigen.)
- Angezeigte Angaben je Kind: `CHILD_FIELDS` in `src/js/config.js` (Name, Klasse, Fächer, Anzahl Tests,
  Niveau). Tabellenspalten: `CHILD_TABLE_COLUMNS`, Linien: `SERIES`.
- **Klarnamen:** Die Demo nutzt erfundene Namen. Produktiv sollen **Klarnamen** erscheinen. Das macht
  Seite und PDF zu personenbezogenen Daten Minderjähriger. Vor Echtbetrieb: Rechtsgrundlage und
  Verarbeitungsverzeichnis, Rechteprüfung auf dem Server (nur Kinder der eigenen KPFs), Protokollierung
  der PDF-Erzeugung, Aufbewahrung und Weitergabe der PDF klären. **Der Dateiname enthält keinen Kindernamen.**

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
| `src/js/data/children.js` `getChildReports(kpfId, { from, to })` | erfundene Kinder und Testzeitpunkte im Code | Kinder der KPF mit Testzeitpunkten, aus den Rohdaten zusammengesetzt (siehe unten), Klarnamen aus der Benutzerverwaltung, nur für berechtigte Personen. Eine Abfrage für die ganze KPF, nicht je Kind. | `Promise<Array<{ child: { id, name, grade }, results: { [fach]: Array<{ testNumber, date, correct, wrong, level }> } }>>` |
| `src/js/services/pdfExportService.js` `exportReportPdf({ fileName })` | Druckdialog des Browsers (`window.print()`) | serverseitige PDF-Erzeugung mit diesem Layout (KPF-Bericht, Kinderliste, Kind-Seiten in einer Datei); Datei als Download oder in neuem Tab | `Promise<void>` |

Regel: Die Oberfläche bleibt unverändert, solange Signatur und Rückgabeformat der Ersatzpunkte
erhalten bleiben.

## Von den Rohdaten zur Auswertung

Die Testdaten liegen als Rohdaten vor und müssen zu den Zahlen für `getChildReports()` und
`getOutcomes()` zusammengesetzt werden. Das ist eine **eigene Aufgabe für den Dienstleister**
(Aggregation in der Datenbank oder im Server, nicht im Browser). Die Demo zeigt nur das Ergebnis.

Bekannte Spalten der Rohdaten: `_id; userID; lessonID; exerciseID; testNumber; date; kpf; grade; type;
answer; result; levumi_subject; levumi_level; levumi_math_category; levumi_overall_answered;
levumi_correctly_answered; levumi_correctly_answered_percent; levumi_reading_accuracy;
levumi_reading_speed_in_questions_per_minute; has_merged_data`. Die **Anwesenheit** kommt aus einer
anderen Datenquelle und wird von der Demo noch nicht verwendet.

**ANNAHME, bitte mit Dienstleister und Fachseite bestätigen** (aus den Spaltennamen abgeleitet, nicht aus
Beispielzeilen):

| Ziel in der Auswertung | Rohdaten | Bemerkung |
| ---------------------- | -------- | --------- |
| Kind (`child.id`) | `userID` | Klarname aus der Benutzerverwaltung (steht nicht in den Rohdaten) |
| Klasse (`child.grade`) | `grade` | |
| KPF-Zugehörigkeit | `kpf` | Filter je KPF |
| Fach (Schlüssel in `SUBJECTS`) | `levumi_subject` | Zuordnung der Werte zu `math`/`german` klären |
| Testzeitpunkt (`testNumber`, `date`) | `testNumber`, `date` | Zählt `testNumber` je Kind und Fach oder je Schuljahr? |
| Richtig (`correct`) | `levumi_correctly_answered` | je Test |
| Falsch (`wrong`) | `levumi_overall_answered` minus `levumi_correctly_answered` | Gesamt = richtig + falsch |
| Niveau (`level`) | `levumi_level` | Bedeutung und Werte klären (Zahl oder Text) |
| nicht verwendet | `_id`, `lessonID`, `exerciseID`, `type`, `answer`, `result`, `levumi_math_category`, `levumi_correctly_answered_percent`, `levumi_reading_*`, `has_merged_data` | `correctly_answered_percent` wird im Browser berechnet |

**Offene Punkte dazu:** Liegt eine Zeile je Test oder je Aufgabe (`exerciseID`) vor? Wiederholen sich die
`levumi_*`-Werte auf jeder Aufgabenzeile (dann nach Test zusammenfassen, nicht aufsummieren)? Was bedeutet
`has_merged_data`? Wofür soll die **Anwesenheit** verwendet werden (z. B. Abwesenheit statt Testlücke
kennzeichnen)? Die KPF-Auswertung (`getOutcomes`) braucht zusätzlich die Regel, wann ein Test "verbessert",
"konstant hoch" oder "unverändert" zählt.

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
