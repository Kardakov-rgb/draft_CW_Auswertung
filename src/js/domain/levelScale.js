/* Zuordnung Niveaustufe -> Farbstufe (ohne DOM). Je Fach gibt es eine Leiter der möglichen Stufen
   (SUBJECTS[].levels, niedrigste zuerst). Die Farbstufen reichen von 1 (hell) bis steps (dunkel);
   die Leiter wird gleichmäßig darauf verteilt, die höchste Stufe ist immer die dunkelste. */

/* levels: z. B. [2, 4, 6]; level: Niveaustufe eines Tests; steps: Anzahl Farbstufen (Standard 5).
   Rückgabe: Farbstufe 1..steps, oder null bei unbekannter Stufe. Verglichen wird als Text,
   damit 2 und "2" gleich sind. */
export function levelShade(levels, level, steps = 5) {
  const index = levels.findIndex((candidate) => String(candidate) === String(level));
  if (index === -1) return null;
  if (levels.length === 1) return steps;
  return 1 + Math.round((index * (steps - 1)) / (levels.length - 1));
}
