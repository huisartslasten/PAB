import { createPracticeQuestionSession } from '../question-session.js';
import { isWord, normalizeWord } from '../word-games/dictionary.js';
import { createLexoLevel } from './generator.js';
import { scoreForWord } from './scoring.js';

function normalizeItems(items = []) { return (Array.isArray(items) ? items : []).map((item, index) => ({ index, question: String(item?.question ?? '').trim(), answer: String(item?.answer ?? '').trim() })).filter(item => item.question && item.answer); }
export function createLexoRuntime({ items = [], gradeAnswer, difficulty = 'rookie', random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new TypeError('LEXO runtime requires answer grading.'); if (!['rookie', 'goat'].includes(difficulty)) throw new Error('Ongeldige LEXO moeilijkheidsgraad.');
  const source = normalizeItems(items); const questionSession = createPracticeQuestionSession(source, { random }); const level = createLexoLevel({ difficulty, random }); const approvedWords = new Set(level.approvedWords);
  let current = null; let phase = 'idle'; let turns = 0; let score = 0; let foundWords = []; let feedback = null;
  function nextQuestion() { const item = questionSession.next(); if (!item) { current = null; phase = 'finished'; return; } current = item; phase = 'question'; }
  function restart() { questionSession.start(); current = null; turns = 0; score = 0; foundWords = []; feedback = null; phase = 'idle'; nextQuestion(); return snapshot(); }
  async function submitExerciseAnswer(value) {
    if (phase !== 'question' || !current) throw new Error('Geen oefenvraag beschikbaar.'); turns += 1; const result = await gradeAnswer(current.question, current.answer, value); const correct = result?.correct === true; questionSession.record(correct);
    if (!correct) { feedback = { type: 'exercise', correct: false, question: current.question, studentAnswer: String(value ?? ''), correctAnswer: current.answer, message: String(result?.feedback ?? '').trim() }; return snapshot(); }
    feedback = { type: 'exercise', correct: true, message: String(result?.feedback ?? '').trim() }; phase = 'word'; return snapshot();
  }
  function continueAfterExerciseFeedback() { feedback = null; if (phase === 'question') nextQuestion(); return snapshot(); }
  function submitWord(value) {
    if (phase !== 'word') throw new Error('Beantwoord eerst de oefenvraag.'); const word = normalizeWord(value); if (!word || !isWord(word) || !approvedWords.has(word)) { feedback = { type: 'word', correct: false, invalid: true, studentAnswer: String(value ?? ''), message: 'Dit woord kan niet met dit veld worden gevormd.' }; return snapshot(); }
    if (foundWords.includes(word)) { feedback = { type: 'word', correct: false, duplicate: true, studentAnswer: word, message: 'Dit woord heb je al gevonden.' }; return snapshot(); }
    const points = scoreForWord(word, difficulty); foundWords = [...foundWords, word]; score += points; feedback = { type: 'word', correct: true, word, points };
    if (questionSession.snapshot().cycleComplete) { phase = 'finished'; current = null; } else { phase = 'word-feedback'; current = null; }
    return snapshot();
  }
  function continueAfterWordResult() { if (phase === 'word-feedback') { feedback = null; nextQuestion(); } else feedback = null; return snapshot(); }
  function snapshot() { const qs = questionSession.snapshot(); return Object.freeze({ phase, difficulty, grid: level.grid, anchorWord: level.anchorWord, anchorPath: level.anchorPath, revealedCount: difficulty === 'rookie' ? 2 : 1, approvedWordCount: level.wordCount, current, turns, score, foundWords: Object.freeze(foundWords.slice()), remainingCount: Math.max(0, source.length - qs.correctCount), totalCount: source.length, completedCount: qs.correctCount, questionCycle: qs.cycle, questionCycleComplete: qs.cycleComplete, feedback }); }
  return Object.freeze({ restart, submitExerciseAnswer, continueAfterExerciseFeedback, submitWord, continueAfterWordResult, snapshot });
}
