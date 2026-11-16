/** Pure selection helpers for agenda review. */
export function toggleReviewSelection(selected=[],id) {
  const set=new Set(Array.isArray(selected)?selected:[]);
  if(id) set.has(id)?set.delete(id):set.add(id);
  return [...set];
}
export function selectAllReviewItems(items=[]) {
  return (Array.isArray(items)?items:[]).map(item=>item?.id).filter(Boolean);
}
