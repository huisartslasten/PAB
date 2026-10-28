const SCORE_BY_LENGTH = Object.freeze({ 3: 3, 4: 4, 5: 6, 6: 8, 7: 10 });

export function scoreForWord(word, difficulty = 'rookie') {
  const length = [...String(word ?? '')].length;
  const base = SCORE_BY_LENGTH[length] || (length >= 8 ? 12 : 0);
  return difficulty === 'goat' ? base + (base > 0 ? 1 : 0) : base;
}

export function getScoreTable(difficulty = 'rookie') {
  return Object.freeze([3, 4, 5, 6, 7, 8].map(length => ({ length, points: scoreForWord('a'.repeat(length), difficulty) })));
}
