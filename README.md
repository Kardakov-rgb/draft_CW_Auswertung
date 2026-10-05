# draft_CW_Auswertung

Statische Demo-Seite in reinem HTML, CSS und JavaScript (ES-Module), ohne Build-Schritt und ohne
Laufzeit-Abhängigkeiten. Sie dient als Vorlage, die der IT-Dienstleister in das bestehende System
übernimmt. Zweck, offene Fragen und Übergabehinweise: [docs/HANDOVER.md](docs/HANDOVER.md).

Aktueller Stand: Auswertungsseite pro KPF mit Zeitraum-Filter, Balkendiagrammen und PDF-Export (Browser-Druck).

## Schnellstart

```bash
git clone https://github.com/Kardakov-rgb/draft_CW_Auswertung.git
cd draft_CW_Auswertung
npm start        # lokaler Server auf http://localhost:3000 (benötigt Node.js)
npm test         # Tests der Fachlogik (node --test)
npm run format   # Prettier
```

ES-Module funktionieren nicht über `file://`, daher der lokale Server (oder ein beliebiger
statischer Webserver für `src/`). Läuft unter Windows genauso (Node.js installieren, dann die Befehle oben).

## Veröffentlichung (Demo online)

Änderungen an `main` veröffentlicht `.github/workflows/pages.yml` über GitHub Pages (Ordner `src/`).
Einmalig im Repo: Settings -> Pages -> Source: "GitHub Actions". Die Seite ist öffentlich erreichbar:
nur erfundene Beispieldaten verwenden, keine echten Namen oder Zugangsdaten.

## Struktur

```
src/
  index.html          Einstiegsseite
  css/                fonts -> tokens -> base -> layout -> components
  js/main.js          Einstiegspunkt
  js/config.js        Konfiguration (Fächer, Kategorien, Farben-Token, Texte, Schuljahresbeginn, Dateiname)
  js/components/      ein Modul pro UI-Komponente
  js/domain/          Fachlogik ohne DOM-Zugriff (getestet)
  js/services/        Ersatzpunkte: Anbindungen ans System (in der Demo simuliert)
  js/data/            Ersatzpunkte: Daten (in der Demo erfunden)
  js/vendor/          Fremdbibliotheken, unverändert, mit Lizenz
  assets/             Schriften (lokal, OFL-Lizenz), Bilder
tests/                Tests ohne Abhängigkeiten (npm test)
docs/HANDOVER.md      Übergabe-Checkliste für den Dienstleister
```

## Neues Fach oder neue Kategorie

1. Fach: Eintrag in `SUBJECTS` in `src/js/config.js` (`key`, `label`, `chartTitle`, `text` mit `{share}`).
2. Kategorie: Eintrag in `CATEGORIES` (`key`, `label`, `success`, `colorToken`, `textToken`); die
   Farb-Token legst du in `src/css/tokens.css` an.
3. Die Zahlen dazu liefert `getOutcomes()` in `src/js/data/outcomes.js`. Im Code ist nichts zu ändern.

## Konventionen

- Keine Build-Pipeline, keine Laufzeit-Abhängigkeiten: Dateien sind direkt lauffähig.
- Alle Farben, Abstände und Schriften nur in `src/css/tokens.css`.
- CSS-Klassen nach BEM (`block__element--modifier`), keine IDs für Styling.
- JavaScript: ES-Module, eine Verantwortung pro Datei, keine globalen Variablen.
- Fachlogik ohne DOM in `js/domain/`, mit Test in `tests/`.
- Alles, was später an das System angebunden wird, liegt in `js/services/` oder `js/data/` mit festem
  Rückgabeformat und steht in `docs/HANDOVER.md`.
- Tabellen und Optionen konfigurationsgetrieben über `js/config.js`.
- Texte und Oberfläche auf Deutsch. Formatierung: Prettier (`.editorconfig`, `.prettierrc.json`).
