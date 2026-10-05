export function createLessonItemModel(item = {}, index = 0) {
  return Object.freeze({
    ...item,
    sort_order: Number(item.sort_order ?? index),
    index
  });
}

export function createLessonItemModels(items = []) {
  return (Array.isArray(items) ? items : []).map((item, index) => createLessonItemModel(item, index));
}
