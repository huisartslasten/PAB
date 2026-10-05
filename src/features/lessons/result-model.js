/** Stable presentation model for a completed lesson activity. */
export function createActivityResult({score=0,total=0,items=[]}={}) {
  const safeTotal=Math.max(0,Number(total)||0);
  const safeScore=Math.max(0,Math.min(safeTotal,Number(score)||0));
  return Object.freeze({score:safeScore,total:safeTotal,percentage:safeTotal?Math.round((safeScore/safeTotal)*100):0,items:Array.isArray(items)?[...items]:[]});
}
