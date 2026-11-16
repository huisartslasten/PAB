/** Deterministic answer evaluation boundary; no AI calls. */
export function evaluateAnswer(entered='', expected='', normalize=value=>String(value??'').trim().toLowerCase()) {
  const actual=normalize(entered), target=normalize(expected);
  return Object.freeze({entered:String(entered??''),expected:String(expected??''),correct:Boolean(actual&&target&&actual===target)});
}
