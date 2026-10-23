import { createPracticeQuestionSession } from '../question-session.js';

const FIRST_REWARD = 10;
function normalizeItems(items) { return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object'); }
function maxScoreFor(total) { if (total <= 0) return 0; return FIRST_REWARD * (2 ** Math.max(0, total - 1)); }

export function createDoubleOrNothingRuntime({ items = [], gradeAnswer, random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new Error('A gradeAnswer function is required.');
  const questions = normalizeItems(items); const questionSession = createPracticeQuestionSession(questions, { random });
  let score = 0; let bestScore = 0; let stake = null; let phase = questions.length ? 'question' : 'finished'; let lastResult = null;
  function snapshot() { const qs = questionSession.snapshot(); return Object.freeze({ index: qs.currentIndex, total: questions.length, score, bestScore, stake, phase, lastResult, maxScore: maxScoreFor(questions.length), item: questionSession.current(), questionCycle: qs.cycle, questionCycleComplete: qs.cycleComplete }); }
  function start() { questionSession.start(); score = 0; bestScore = 0; stake = null; phase = questions.length ? 'question' : 'finished'; lastResult = null; if (questions.length) questionSession.next(); return snapshot(); }
  function chooseStake(amount) {
    if (phase !== 'question') throw new Error('Er kan nu geen inzet worden gekozen.');
    const qs = questionSession.snapshot(); if (qs.currentIndex === 0) throw new Error('De eerste vraag heeft geen inzet.'); if (score === 0) throw new Error('Bij 0 botjes is deze vraag gratis.');
    const value = Number(amount); if (!Number.isFinite(value) || value < 0 || value > score) throw new Error('De inzet moet tussen 0 en je huidige aantal botjes liggen.'); stake = Math.floor(value); return snapshot();
  }
  async function submitAnswer(userAnswer) {
    if (phase !== 'question') throw new Error('Deze vraag kan nu niet worden beantwoord.'); const qs = questionSession.snapshot(); if (qs.currentIndex > 0 && score > 0 && stake == null) throw new Error('Kies eerst hoeveel botjes je waagt.');
    const item = questionSession.current(); const normalizedAnswer = String(userAnswer ?? '').trim(); if (!normalizedAnswer) throw new Error('Vul eerst een antwoord in.'); const recoveryRound = qs.currentIndex > 0 && score === 0; const usedStake = qs.currentIndex === 0 || recoveryRound ? FIRST_REWARD : Number(stake); if (!Number.isFinite(usedStake) || usedStake < 0) throw new Error('De inzet is ongeldig.');
    phase = 'checking';
    try {
      const result = await gradeAnswer(item.question, item.answer, normalizedAnswer); const correct = result.correct === true; const previousScore = score; const delta = correct ? usedStake : -usedStake; score = Math.max(0, score + delta); bestScore = Math.max(bestScore, score); questionSession.record(correct);
      lastResult = Object.freeze({ correct, feedback: result.feedback || '', expectedAnswer: item.answer, givenAnswer: normalizedAnswer, stake: usedStake, previousScore, score, delta }); stake = null; phase = questionSession.snapshot().cycleComplete ? 'finished' : 'result'; return snapshot();
    } catch (error) { phase = 'question'; throw error; }
  }
  function continueGame() { if (phase !== 'result') throw new Error('Er is geen volgende vraag beschikbaar.'); const item = questionSession.next(); if (!item) throw new Error('Er zijn geen oefenvragen beschikbaar.'); stake = null; phase = 'question'; lastResult = null; return snapshot(); }
  return Object.freeze({ start, chooseStake, submitAnswer, continueGame, snapshot });
}
export { FIRST_REWARD, maxScoreFor };
