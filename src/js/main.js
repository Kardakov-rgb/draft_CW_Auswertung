/* Einstiegspunkt: verdrahtet Komponenten.
   Fachlogik liegt in domain/ (ohne DOM), Anbindungen an das System in services/ und data/. */
import { APP } from "./config.js";

document.title = `${APP.title} (${APP.badge})`;
document.querySelector("[data-app-title]").textContent = APP.title;
document.querySelector("[data-app-badge]").textContent = APP.badge;
