/** Pure progress calculation for lesson activities. */
export function lessonProgress(current=0,total=0) {
  const c=Math.max(0,Number(current)||0), t=Math.max(0,Number(total)||0);
  return Object.freeze({current:c,total:t,percentage:t?Math.round((c/t)*100):0});
}
