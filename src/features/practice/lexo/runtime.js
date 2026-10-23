import { isWord, normalizeWord } from '../word-games/dictionary.js';
import { createLexoLevel } from './generator.js';
import { scoreForWord } from './scoring.js';

function normalizeItems(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item, index) => ({ index, question: String(item?.question ?? '').trim(), answer: String(item?.answer ?? '').trim() }))
    .filter(item => item.question && item.answer);
}

function shuffle(values, random = Math.random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const next = Math.floor((Number(random()) || 0) * (index + 1));
    [copy[index], copy[next]] = [copy[next], copy[index]];
  }
  return copy;
}

export function createLexoRuntime({ items = [], gradeAnswer, difficulty = 'rookie', random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new TypeError('LEXO runtime requires answer grading.');
  if (!['rookie', 'goat'].includes(difficulty)) throw new Error('Ongeldige LEXO moeilijkheidsgraad.');

  const source = normalizeItems(items);
  const level = createLexoLevel({ difficulty, random });
  const approvedWords = new Set(level.approvedWords);
  let remaining = new Set(source.map(item => item.index));
  let questionQueue = [];
  let current = null;
  let phase = 'idle';
  let turns = 0;
  let score = 0;
  let foundWords = [];
  let feedback = null;

  function refillQuestionQueue() {
    const indices = remaining.size ? [...remaining] : source.map(item => item.index);
    questionQueue = shuffle(indices, random);
  }

  function nextQuestion() {
    if (!source.length) {
      current = null;
      phase = 'finished';
      return;
    }
    if (!questionQueue.length) refillQuestionQueue();
    const nextIndex = questionQueue.shift();
    current = source.find(item => item.index === nextIndex) || null;
    if (!current) return nextQuestion();
    phase = 'question';
  }

  function restart() {
    remaining = new Set(source.map(item => item.index));
    questionQueue = [];
    current = null;
    turns = 0;
    score = 0;
    foundWords = [];
    feedback = null;
    phase = 'idle';
    nextQuestion();
    return snapshot();
  }

  async function submitExerciseAnswer(value) {
    if (phase !== 'question' || !current) throw new Error('Geen oefenvraag beschikbaar.');
    turns += 1;
    const result = await gradeAnswer(current.question, current.answer, value);
    if (!result?.correct) {
      feedback = { type: 'exercise', correct: false, question: current.question, studentAnswer: String(value ?? ''), correctAnswer: current.answer, message: String(result?.feedback ?? '').trim() };
      return snapshot();
    }
    remaining.delete(current.index);
    feedback = { type: 'exercise', correct: true, message: String(result?.feedback ?? '').trim() };
    phase = 'word';
    return snapshot();
  }

  function continueAfterExerciseFeedback() {
    feedback = null;
    if (phase === 'question') nextQuestion();
    return snapshot();
  }

  function submitWord(value) {
    if (phase !== 'word') throw new Error('Beantwoord eerst de oefenvraag.');
    const word = normalizeWord(value);
    if (!word || !isWord(word) || !approvedWords.has(word)) {
      feedback = { type: 'word', correct: false, invalid: true, studentAnswer: String(value ?? ''), message: 'Dit woord kan niet met dit veld worden gevormd.' };
      return snapshot();
    }
    if (foundWords.includes(word)) {
      feedback = { type: 'word', correct: false, duplicate: true, studentAnswer: word, message: 'Dit woord heb je al gevonden.' };
      return snapshot();
    }
    const points = scoreForWord(word, difficulty);
    foundWords = [...foundWords, word];
    score += points;
    feedback = { type: 'word', correct: true, word, points };
    if (!remaining.size) {
      phase = 'finished';
      current = null;
    } else {
      phase = 'word-feedback';
      current = null;
    }
    return snapshot();
  }

  function continueAfterWordResult() {
    if (phase === 'word-feedback') {
      feedback = null;
      nextQuestion();
    } else {
      feedback = null;
    }
    return snapshot();
  }

  function snapshot() {
    const revealedCount = difficulty === 'rookie' ? 2 : 1;
    return Object.freeze({
      phase,
      difficulty,
      grid: level.grid,
      anchorWord: level.anchorWord,
      anchorPath: level.anchorPath,
      revealedCount,
      approvedWordCount: level.wordCount,
      current,
      turns,
      score,
      foundWords: Object.freeze(foundWords.slice()),
      remainingCount: remaining.size,
      totalCount: source.length,
      completedCount: source.length - remaining.size,
      feedback
    });
  }

  return Object.freeze({ restart, submitExerciseAnswer, continueAfterExerciseFeedback, submitWord, continueAfterWordResult, snapshot });
}
