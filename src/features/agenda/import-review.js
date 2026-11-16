import { compareAgendaCandidates } from './candidate-compare.js';

export function findAgendaConflicts(candidates = []) {
  const items = Array.isArray(candidates) ? candidates : [];
  const conflicts = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const comparison = compareAgendaCandidates(items[i], items[j]);
      if (comparison.sameDate && comparison.titleScore >= 0.6) {
        conflicts.push({ left: items[i], right: items[j], comparison });
      }
    }
  }
  return conflicts;
}
