# Übergabe an den IT-Dienstleister

## Zweck der Demo

Entwurf einer Seite, die der Dienstleister in das bestehende System übernimmt. Es ist **keine
Produktivanwendung**: Alle Daten sind erfunden, Anmeldung und Datenbank fehlen bewusst.
Anbindungen übernimmt der Dienstleister an den unten genannten Ersatzpunkten.

**Stand:** Grundstruktur (leere Seite mit Header und Footer). Fachliche Funktionen folgen.

- Organisation / Bereich: _noch zu ergänzen_
- Ziel der Seite (ein Satz): _noch zu ergänzen_

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

Bisher keine. Jeder Ersatzpunkt wird hier eingetragen, sobald er entsteht:

| Ersatzpunkt (Datei und Funktion) | Demo-Variante | Produktiv-Variante | Rückgabeformat |
| -------------------------------- | ------------- | ------------------ | -------------- |
| _folgt_                          |               |                    |                |

Regel: Die Oberfläche bleibt unverändert, solange Signatur und Rückgabeformat der Ersatzpunkte
erhalten bleiben.

## Sicherheits- und Datenschutzhinweise

- Die Demo kann öffentlich erreichbar sein (GitHub Pages): **nur erfundene Daten**, nie echte Namen
  oder Zugangsdaten im Repository.
- Schriften (Montserrat, Noto Serif) liegen lokal in `src/assets/fonts/`. Es werden keine Daten von
  Drittservern geladen.
- Es gibt keine Anmeldung, keine Rechteprüfung und keine serverseitige Validierung. Beides gehört in
  die Produktivversion (Aufgabe des Dienstleisters).
- Personenbezogene Daten (sobald angebunden): Zweckbindung, Löschkonzept und Protokollierung mit dem
  Datenschutz klären.
