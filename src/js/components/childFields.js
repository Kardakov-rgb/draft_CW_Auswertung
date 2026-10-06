/* Darstellung der Kinder-Angaben (Kinderliste und Infoblock). Typen siehe CHILD_FIELDS in config.js. */
import { CHILD } from "../config.js";

const withData = (summary) => summary.subjects.filter((subject) => subject.testCount > 0);

const RENDERERS = {
  text: (summary, field) => summary[field.key] || CHILD.noValue,
  subjects: (summary) => {
    const labels = withData(summary).map((subject) => subject.label);
    return labels.length > 0 ? labels.join(", ") : CHILD.noValue;
  },
  testCount: (summary) => {
    const parts = withData(summary);
    if (parts.length === 0) return "0";
    const detail =
      parts.length > 1 ? parts.map((s) => `${s.label}: ${s.testCount}`).join(", ") : "";
    return detail ? `${summary.testCount} (${detail})` : String(summary.testCount);
  },
  level: (summary) => {
    const parts = withData(summary).filter((subject) => subject.level !== null);
    return parts.length > 0
      ? parts.map((subject) => `${subject.label}: ${subject.level}`).join(", ")
      : CHILD.noValue;
  },
};

export function formatChildField(summary, field) {
  return RENDERERS[field.type](summary, field);
}
