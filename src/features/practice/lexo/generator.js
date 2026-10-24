import { getWordDictionary, normalizeWord } from '../word-games/dictionary.js';
import { LEXO_GRID_CELLS, findWordPath, validateGrid } from './grid.js';

const ANCHORS = Object.freeze({
  rookie: Object.freeze(['schoolboeken','speeltoestel','zonnebloemen','kinderboeken','schoolvakantie']),
  goat: Object.freeze(['voetbalvelden','verkeerslicht','boekenplankje','kinderschoenen','voetbalschoenen','verjaardagskaart','regenboogkleuren','speelgoedwinkel','voetbalwedstrijd','wintervakantie'])
});

const LETTER_POOL = 'eeeeeeeeeeaaaaaaaaiiiiiiiioooooooouuuuuunnnnnnnrrrrrrttttttllllllsssssskkkmmmpppbbddggvvwzhcj';
const WORDS = Object.freeze(getWordDictionary().filter(word => [...word].length >= 3));

function boundedRandom(random) {
  return Math.max(0, Math.min(0.999999, Number(random()) || 0));
}

function shuffled(values, random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const next = Math.floor(boundedRandom(random) * (index + 1));
    [copy[index], copy[next]] = [copy[next], copy[index]];
  }
  return copy;
}

function randomLetter(random) {
  return LETTER_POOL[Math.floor(boundedRandom(random) * LETTER_POOL.length)];
}

function randomAnchorPath(anchorWord, random) {
  const targetLength = [...anchorWord].length;
  const path = [];
  const used = new Set();

  function walk(position) {
    path.push(position);
    used.add(position);
    if (path.length === targetLength) return true;
    const row = Math.floor(position / 4);
    const col = position % 4;
    const candidates = [];
    for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
      for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
        if (!rowDelta && !colDelta) continue;
        const nextRow = row + rowDelta;
        const nextCol = col + colDelta;
        if (nextRow < 0 || nextRow >= 4 || nextCol < 0 || nextCol >= 4) continue;
        const next = nextRow * 4 + nextCol;
        if (!used.has(next)) candidates.push(next);
      }
    }
    for (const next of shuffled(candidates, random)) {
      if (walk(next)) return true;
    }
    used.delete(position);
    path.pop();
    return false;
  }

  const starts = shuffled([...Array(LEXO_GRID_CELLS).keys()], random);
  for (const start of starts) {
    path.length = 0;
    used.clear();
    if (walk(start)) return path.slice();
  }
  return null;
}

function approvedWordsForGrid(grid) {
  return WORDS
    .filter(word => findWordPath(grid, word))
    .sort((left, right) => [...right].length - [...left].length || left.localeCompare(right, 'nl-NL'));
}

function buildCandidate(anchorWord, random) {
  const path = randomAnchorPath(anchorWord, random);
  if (!path) return null;
  const grid = Array(LEXO_GRID_CELLS).fill('');
  [...anchorWord].forEach((letter, index) => { grid[path[index]] = letter; });
  for (let index = 0; index < grid.length; index += 1) {
    if (!grid[index]) grid[index] = randomLetter(random);
  }
  const validation = validateGrid(grid, { anchorWord, anchorPath: path });
  if (!validation.valid) return null;
  const approvedWords = approvedWordsForGrid(grid);
  return { grid, anchorWord, anchorPath: path, approvedWords };
}

export function getAnchorWords(difficulty = 'rookie') {
  return (ANCHORS[difficulty] || ANCHORS.rookie).slice();
}

export function createLexoLevel({ difficulty = 'rookie', random = Math.random } = {}) {
  if (!['rookie', 'goat'].includes(difficulty)) throw new Error('Ongeldige LEXO moeilijkheidsgraad.');
  const anchors = shuffled(ANCHORS[difficulty], random);
  let best = null;
  for (let attempt = 0; attempt < 180; attempt += 1) {
    const anchorWord = normalizeWord(anchors[attempt % anchors.length]);
    const candidate = buildCandidate(anchorWord, random);
    if (!candidate) continue;
    if (!best || candidate.approvedWords.length > best.approvedWords.length) best = candidate;
    if (candidate.approvedWords.length >= 8) break;
  }
  if (!best) throw new Error('LEXO kon geen geldig speelveld maken.');
  return Object.freeze({
    difficulty,
    size: 4,
    grid: Object.freeze(best.grid.slice()),
    anchorWord: best.anchorWord,
    anchorPath: Object.freeze(best.anchorPath.slice()),
    approvedWords: Object.freeze(best.approvedWords.slice()),
    wordCount: best.approvedWords.length
  });
}
