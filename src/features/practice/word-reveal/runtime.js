import { createPracticeQuestionSession } from '../question-session.js';

function normalizeItems(items = []) { return (Array.isArray(items) ? items : []).map((item, index) => ({ index, question: String(item?.question ?? '').trim(), answer: String(item?.answer ?? '').trim() })).filter(item => item.question && item.answer); }
function normalizeTarget(target) {
  const text = String(target?.text ?? '').trim(); if (!text) throw new Error('Een doelwoord of zin is vereist.');
  const revealableIndices = [...text].reduce((indices, character, index) => { if (/\p{L}|\p{N}/u.test(character)) indices.push(index); return indices; }, []);
  if (!revealableIndices.length) throw new Error('Het doel bevat geen onthulbare letters.');
  return Object.freeze({ type: String(target?.type ?? 'word'), text, meaning: String(target?.meaning ?? '').trim(), revealableIndices });
}

export function createWordRevealRuntime({ items = [], gradeAnswer, random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new TypeError('Word Reveal runtime requires answer grading.');
  const source = normalizeItems(items); const questionSession = createPracticeQuestionSession(source, { random });
  let current = null; let target = null; let revealedIndices = new Set(); let turns = 0; let phase = 'idle'; let feedback = null;
  function selectNextQuestion() { const item = questionSession.next(); if (!item) { current = null; phase = 'finished'; return null; } current = item; phase = 'question'; return current; }
  function startRound(nextTarget) { target = normalizeTarget(nextTarget); revealedIndices = new Set(); feedback = null; phase = source.length ? 'question' : 'finished'; if (phase === 'question') selectNextQuestion(); return snapshot(); }
  function restart(nextTarget) { questionSession.start(); current = null; turns = 0; return startRound(nextTarget); }
  function completeRound() { current = null; phase = questionSession.snapshot().cycleComplete ? 'finished' : 'round-complete'; }
  async function submitAnswer(value) {
    if (phase !== 'question' || !current) throw new Error('Geen vraag beschikbaar.'); const result = await gradeAnswer(current.question, current.answer, value); const correct = result?.correct === true; questionSession.record(correct);
    if (!correct) { feedback = { correct: false, question: current.question, studentAnswer: String(value ?? ''), correctAnswer: current.answer, message: String(result?.feedback ?? '').trim() }; return snapshot(); }
    turns += 1; feedback = { correct: true, question: current.question, message: String(result?.feedback ?? '').trim() }; phase = 'reveal-choice'; return snapshot();
  }
  function continueAfterFeedback() { feedback = null; if (phase === 'question') selectNextQuestion(); return snapshot(); }
  function revealLetter(index) {
    if (phase !== 'reveal-choice') throw new Error('Kies nu eerst een letter om te onthullen.'); const targetIndex = Number(index); if (!target.revealableIndices.includes(targetIndex)) throw new Error('Deze positie kan niet worden onthuld.'); if (revealedIndices.has(targetIndex)) throw new Error('Deze letter is al onthuld.');
    revealedIndices.add(targetIndex); feedback = null; if (revealedIndices.size >= target.revealableIndices.length) completeRound(); else selectNextQuestion(); return snapshot();
  }
  function guessSolution(value) {
    if (phase !== 'question') throw new Error('Je kunt de oplossing nu niet raden.'); turns += 1; const guess = String(value ?? '').trim().toLocaleLowerCase('nl-NL'); const solution = target.text.trim().toLocaleLowerCase('nl-NL');
    if (guess === solution) { feedback = { correct: true, guess: true }; revealedIndices = new Set(target.revealableIndices); completeRound(); return snapshot(); }
    feedback = { correct: false, guess: true, studentAnswer: String(value ?? '') }; return snapshot();
  }
  function snapshot() { const qs = questionSession.snapshot(); return Object.freeze({ phase, current, target, revealedIndices: [...revealedIndices], revealedCount: revealedIndices.size, turns, remainingCount: Math.max(0, source.length - qs.correctCount), totalCount: source.length, completedCount: qs.correctCount, questionCycle: qs.cycle, questionCycleComplete: qs.cycleComplete, feedback }); }
  return Object.freeze({ startRound, restart, submitAnswer, continueAfterFeedback, revealLetter, guessSolution, snapshot });
}
export { normalizeTarget };
