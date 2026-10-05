/** Pure lesson item selection helpers. */
export function selectLessonItem(items=[],index=0) {
  const list=Array.isArray(items)?items:[];
  return list[Math.max(0,Math.min(list.length-1,Number(index)||0))]||null;
}
