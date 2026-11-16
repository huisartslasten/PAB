export function createAgendaReviewState(candidates = []) {
  let items = Array.isArray(candidates) ? [...candidates] : [];
  let selected = new Set(items.map(item => item?.id).filter(Boolean));

  function list() { return [...items]; }
  function selectedItems() { return items.filter(item => selected.has(item?.id)); }
  function replace(next = []) {
    items = Array.isArray(next) ? [...next] : [];
    selected = new Set(items.map(item => item?.id).filter(Boolean));
    return list();
  }
  function toggle(id) {
    if (!id) return selectedItems();
    if (selected.has(id)) selected.delete(id); else selected.add(id);
    return selectedItems();
  }
  function clearSelection() { selected.clear(); return selectedItems(); }

  return Object.freeze({ list, selectedItems, replace, toggle, clearSelection });
}
