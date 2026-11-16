import { createActivityResult } from './result-model.js';

/** Pure summary helper for learner-facing results. */
export function summarizeActivity(score=0,total=0) {
  const result=createActivityResult({score,total});
  return result.percentage>=80?'Goed gedaan!':result.percentage>=50?'Nog even oefenen.':'We oefenen dit nog een keer.';
}
