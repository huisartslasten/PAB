import { createPracticeQuestionSession } from '../question-session.js';

function normalizeItems(items) { return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object'); }
function normalizeAnswer(value) { return String(value ?? '').trim(); }
function shuffle(values, random = Math.random) { const result = [...values]; for (let index = result.length - 1; index > 0; index -= 1) { const swap = Math.floor(random() * (index + 1)); [result[index], result[swap]] = [result[swap], result[index]]; } return result; }
function buildOptions(items, itemIndex, random) { const correct = normalizeAnswer(items[itemIndex]?.answer); const distractors = []; const seen = new Set([correct]); for (const item of shuffle(items, random)) { const answer = normalizeAnswer(item.answer); if (!answer || seen.has(answer)) continue; seen.add(answer); distractors.push(answer); if (distractors.length === 3) break; } return shuffle([correct, ...distractors], random); }
function buildQuestions(items, random) { return items.map((item, index) => Object.freeze({ question: normalizeAnswer(item.question), answer: normalizeAnswer(item.answer), options: Object.freeze(buildOptions(items, index, random)) })); }

export function createFlashRuntime({ items = [], random = Math.random } = {}) {
  if (typeof random !== 'function') throw new Error('A random function is required.');
  const lessonItems = normalizeItems(items); const questions = buildQuestions(lessonItems, random); const questionSession = createPracticeQuestionSession(questions, { random });
  let currentIndex = null; let score = 0; let phase = questions.length ? 'question' : 'finished'; let lastResult = null;
  function currentQuestion() { return questionSession.current(); }
  function snapshot() { const qs = questionSession.snapshot(); return Object.freeze({ index: currentIndex, total: questions.length, score, maxScore: questions.length, phase, item: currentQuestion(), lastResult, questionCycle: qs.cycle, questionCycleComplete: qs.cycleComplete }); }
  function start() { questionSession.start(); score = 0; phase = questions.length ? 'question' : 'finished'; currentIndex = null; lastResult = null; if (questions.length) { const item = questionSession.next(); currentIndex = questions.indexOf(item); } return snapshot(); }
  function submitAnswer(userAnswer) {
    if (phase !== 'question') throw new Error('Deze vraag kan nu niet worden beantwoord.'); const item = currentQuestion(); const givenAnswer = normalizeAnswer(userAnswer); const correct = givenAnswer === item.answer; const previousScore = score; const delta = correct ? 1 : 0; score += delta; questionSession.record(correct); lastResult = Object.freeze({ correct, expectedAnswer: item.answer, givenAnswer, previousScore, score, delta }); phase = questionSession.snapshot().cycleComplete ? 'finished' : 'result'; return snapshot();
  }
  function continueGame() { if (phase !== 'result') throw new Error('Er is geen volgende vraag beschikbaar.'); const item = questionSession.next(); if (!item) throw new Error('Er zijn geen oefenvragen beschikbaar.'); currentIndex = questions.indexOf(item); phase = 'question'; lastResult = null; return snapshot(); }
  return Object.freeze({ start, submitAnswer, continueGame, snapshot });
}
export { buildOptions, buildQuestions, normalizeAnswer };
