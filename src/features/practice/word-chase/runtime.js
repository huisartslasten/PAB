import { createPracticeQuestionSession } from '../question-session.js';
import { isFiveLetterWord, normalizeWord, pickWord, getSecretWordDictionary } from '../word-games/dictionary.js';

function normalizeItems(items = []) { return (Array.isArray(items) ? items : []).map((item, index) => ({ index, question: String(item?.question ?? '').trim(), answer: String(item?.answer ?? '').trim() })).filter(item => item.question && item.answer); }
function shuffle(values, random = Math.random) { const copy = [...values]; for (let index = copy.length - 1; index > 0; index -= 1) { const next = Math.floor(random() * (index + 1)); [copy[index], copy[next]] = [copy[next], copy[index]]; } return copy; }
function scoreForDifficulty(difficulty) { return difficulty === 'rookie' ? 1 : 1; }
function revealCountForDifficulty(difficulty) { return difficulty === 'rookie' ? 2 : 1; }

export function createWordChaseRuntime({ items = [], gradeAnswer, difficulty = 'rookie', random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new TypeError('Word Chase runtime requires answer grading.'); if (!['rookie', 'goat'].includes(difficulty)) throw new Error('Ongeldige moeilijkheidsgraad.');
  const source = normalizeItems(items); const questionSession = createPracticeQuestionSession(source, { random }); const revealCount = revealCountForDifficulty(difficulty); const targetPoolSize = getSecretWordDictionary().length;
  let target = ''; let usedTargets = new Set(); let revealedIndices = new Set(); let current = null; let phase = 'idle'; let turns = 0; let wordAttempts = 0; let feedback = null;
  function nextQuestion() { const item = questionSession.next(); if (!item) { current = null; phase = 'finished'; return; } current = item; phase = 'question'; }
  function revealInitialLetters() { revealedIndices = new Set(shuffle([...Array(5).keys()], random).slice(0, revealCount)); }
  function chooseTarget() { if (usedTargets.size >= targetPoolSize) usedTargets = new Set(); const candidate = pickWord(random, [...usedTargets]); if (!candidate) throw new Error('Word Chase heeft geen geheime woorden beschikbaar.'); usedTargets.add(candidate); return candidate; }
  function startWord(nextTarget = '') { const candidate = normalizeWord(nextTarget) || chooseTarget(); if (!isFiveLetterWord(candidate)) throw new Error('Word Chase heeft een geldig vijfletterwoord nodig.'); target = candidate; if (nextTarget) usedTargets.add(candidate); revealedIndices = new Set(); revealInitialLetters(); wordAttempts = 0; feedback = null; nextQuestion(); return snapshot(); }
  function restart() { questionSession.start(); current = null; target = ''; usedTargets = new Set(); revealedIndices = new Set(); turns = 0; wordAttempts = 0; feedback = null; phase = 'idle'; return startWord(); }
  async function submitExerciseAnswer(value) {
    if (phase !== 'question' || !current) throw new Error('Geen oefenvraag beschikbaar.'); turns += 1; const result = await gradeAnswer(current.question, current.answer, value); const correct = result?.correct === true; questionSession.record(correct);
    if (!correct) { feedback = { type: 'exercise', correct: false, question: current.question, studentAnswer: String(value ?? ''), correctAnswer: current.answer, message: String(result?.feedback ?? '').trim() }; return snapshot(); }
    feedback = { type: 'exercise', correct: true, message: String(result?.feedback ?? '').trim() }; phase = 'word'; return snapshot();
  }
  function continueAfterExerciseFeedback() { feedback = null; if (phase === 'question') nextQuestion(); return snapshot(); }
  function submitWord(value) {
    if (phase !== 'word') throw new Error('Beantwoord eerst de oefenvraag.'); const guess = normalizeWord(value); if (!isFiveLetterWord(guess)) { feedback = { type: 'word', correct: false, invalid: true, studentAnswer: String(value ?? '') }; return snapshot(); }
    wordAttempts += 1; if (guess === target) { feedback = { type: 'word', correct: true, guess, target }; if (questionSession.snapshot().cycleComplete) { phase = 'finished'; current = null; } else { phase = 'new-word'; current = null; } return snapshot(); }
    feedback = { type: 'word', correct: false, guess, evaluation: evaluateGuess(guess, target) }; nextQuestion(); return snapshot();
  }
  function continueAfterWordResult() { feedback = null; if (phase === 'new-word') return startWord(); if (phase === 'question') return snapshot(); return snapshot(); }
  function evaluateGuess(guess, solution) { const result = Array(5).fill('absent'); const remainingLetters = {}; [...solution].forEach((letter, index) => { if (guess[index] === letter) result[index] = 'correct'; else remainingLetters[letter] = (remainingLetters[letter] || 0) + 1; }); [...guess].forEach((letter, index) => { if (result[index] === 'correct') return; if (remainingLetters[letter] > 0) { result[index] = 'present'; remainingLetters[letter] -= 1; } }); return result; }
  function snapshot() { const qs = questionSession.snapshot(); return Object.freeze({ phase, difficulty, revealCount, target, revealedIndices: [...revealedIndices], current, turns, wordAttempts, remainingCount: Math.max(0, source.length - qs.correctCount), totalCount: source.length, completedCount: qs.correctCount, questionCycle: qs.cycle, questionCycleComplete: qs.cycleComplete, feedback, scoreUnit: scoreForDifficulty(difficulty) }); }
  return Object.freeze({ restart, startWord, submitExerciseAnswer, continueAfterExerciseFeedback, submitWord, continueAfterWordResult, snapshot, evaluateGuess });
}
export { revealCountForDifficulty };
