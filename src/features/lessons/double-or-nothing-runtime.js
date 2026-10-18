// Canonical domain runtime for the Double or Nothing lesson game.
// Presentation and persistence are intentionally kept outside this module.

const FIRST_REWARD = 10;

function normalizeItems(items) {
  return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object');
}

function maxScoreFor(total) {
  if (total <= 0) return 0;
  return FIRST_REWARD * (2 ** Math.max(0, total - 1));
}

export function createDoubleOrNothingRuntime({ items = [], gradeAnswer } = {}) {
  if (typeof gradeAnswer !== 'function') throw new Error('A gradeAnswer function is required.');

  const questions = normalizeItems(items);
  let index = 0;
  let score = 0;
  let bestScore = 0;
  let stake = null;
  let phase = questions.length ? 'question' : 'finished';
  let lastResult = null;

  function snapshot() {
    return Object.freeze({
      index,
      total: questions.length,
      score,
      bestScore,
      stake,
      phase,
      lastResult,
      maxScore: maxScoreFor(questions.length),
      item: questions[index] || null
    });
  }

  function start() {
    index = 0;
    score = 0;
    bestScore = 0;
    stake = null;
    phase = questions.length ? 'question' : 'finished';
    lastResult = null;
    return snapshot();
  }

  function chooseStake(amount) {
    if (phase !== 'question') throw new Error('Er kan nu geen inzet worden gekozen.');
    if (index === 0) throw new Error('De eerste vraag heeft geen inzet.');

    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0 || value > score) {
      throw new Error('De inzet moet tussen 0 en je huidige aantal botjes liggen.');
    }
    stake = Math.floor(value);
    return snapshot();
  }

  async function submitAnswer(userAnswer) {
    if (phase !== 'question') throw new Error('Deze vraag kan nu niet worden beantwoord.');
    if (index > 0 && stake == null) throw new Error('Kies eerst hoeveel botjes je waagt.');

    const item = questions[index];
    const usedStake = index === 0 ? FIRST_REWARD : Number(stake);
    if (!Number.isFinite(usedStake) || usedStake < 0) throw new Error('De inzet is ongeldig.');

    // Lock the question before awaiting the grader. This is the domain-level
    // guard against duplicate clicks and concurrent submissions.
    phase = 'checking';

    try {
      const result = await gradeAnswer(item.question, item.answer, userAnswer);
      const previousScore = score;
      const delta = result.correct === true ? usedStake : -usedStake;
      score = Math.max(0, score + delta);
      bestScore = Math.max(bestScore, score);
      lastResult = Object.freeze({
        correct: result.correct === true,
        feedback: result.feedback || '',
        expectedAnswer: item.answer,
        givenAnswer: userAnswer,
        stake: usedStake,
        previousScore,
        score,
        delta
      });
      index += 1;
      stake = null;
      phase = index >= questions.length ? 'finished' : 'result';
      return snapshot();
    } catch (error) {
      phase = 'question';
      throw error;
    }
  }

  function continueGame() {
    if (phase !== 'result') throw new Error('Er is geen volgende vraag beschikbaar.');
    phase = 'question';
    lastResult = null;
    return snapshot();
  }

  return Object.freeze({ start, chooseStake, submitAnswer, continueGame, snapshot });
}

export { FIRST_REWARD, maxScoreFor };
