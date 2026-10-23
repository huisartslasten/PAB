export const LEXO_GRID_SIZE = 4;
export const LEXO_GRID_CELLS = LEXO_GRID_SIZE * LEXO_GRID_SIZE;

export function neighborsOf(index, size = LEXO_GRID_SIZE) {
  const row = Math.floor(index / size);
  const col = index % size;
  const result = [];
  for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
    for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
      if (rowDelta === 0 && colDelta === 0) continue;
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;
      if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) result.push(nextRow * size + nextCol);
    }
  }
  return result;
}

export function findWordPath(grid, word, size = LEXO_GRID_SIZE) {
  const letters = Array.isArray(grid) ? grid.map(letter => String(letter).toLocaleLowerCase('nl-NL')) : [];
  const target = String(word ?? '').trim().toLocaleLowerCase('nl-NL');
  if (letters.length !== size * size || !target) return null;

  function walk(position, offset, used) {
    if (offset === target.length) return [];
    if (letters[position] !== target[offset] || used.has(position)) return null;
    const nextUsed = new Set(used).add(position);
    if (offset === target.length - 1) return [position];
    for (const next of neighborsOf(position, size)) {
      if (nextUsed.has(next)) continue;
      const tail = walk(next, offset + 1, nextUsed);
      if (tail) return [position, ...tail];
    }
    return null;
  }

  for (let index = 0; index < letters.length; index += 1) {
    const path = walk(index, 0, new Set());
    if (path) return path;
  }
  return null;
}

export function canFormWord(grid, word, size = LEXO_GRID_SIZE) {
  return Boolean(findWordPath(grid, word, size));
}

export function validateGrid(grid, { anchorWord = '', anchorPath = null, size = LEXO_GRID_SIZE } = {}) {
  const letters = Array.isArray(grid) ? grid : [];
  if (letters.length !== size * size) return { valid: false, reason: 'invalid-size' };
  if (anchorWord && [...String(anchorWord)].length < 12) return { valid: false, reason: 'anchor-too-short' };
  const path = anchorPath || (anchorWord ? findWordPath(letters, anchorWord, size) : null);
  if (anchorWord && !path) return { valid: false, reason: 'anchor-not-found' };
  if (path && new Set(path).size !== path.length) return { valid: false, reason: 'anchor-reuses-cell' };
  return { valid: true, anchorPath: path };
}
