// First non-formal FR-0002 learning activity: compare and order pencil lengths.
// Task variants observe ordering of 2, then 3, then 4 objects. They do not
// claim to cover the full SLO objective or establish learner mastery.
export const LENGTH_ORDER_TASKS = Object.freeze([
  Object.freeze({ id: 'pencil-order-2', prompt: 'Zet de twee potloden van klein naar groot.', lengths: Object.freeze([92, 148]), initialOrder: Object.freeze([1, 0]) }),
  Object.freeze({ id: 'pencil-order-3', prompt: 'Zet de drie potloden van klein naar groot.', lengths: Object.freeze([82, 124, 166]), initialOrder: Object.freeze([2, 0, 1]) }),
  Object.freeze({ id: 'pencil-order-4', prompt: 'Zet de vier potloden van klein naar groot.', lengths: Object.freeze([76, 108, 140, 172]), initialOrder: Object.freeze([2, 0, 3, 1]) })
]);

export function evaluateLengthOrder(task, orderedIndexes) {
  if (!task || !Array.isArray(task.lengths) || !Array.isArray(orderedIndexes)) throw new TypeError('A task and ordered pencil indexes are required.');
  if (orderedIndexes.length !== task.lengths.length || new Set(orderedIndexes).size !== task.lengths.length || orderedIndexes.some(index => !Number.isInteger(index) || index < 0 || index >= task.lengths.length)) return false;
  return orderedIndexes.every((index, position, indexes) => position === 0 || task.lengths[indexes[position - 1]] < task.lengths[index]);
}
