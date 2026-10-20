// Canonical domain runtime for the Double or Nothing practice game.
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
    if (score === 0) throw new Error('Bij 0 botjes is deze vraag gratis.');

    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0 || value > score) {
      throw new Error('De inzet moet tussen 0 en je huidige aantal botjes liggen.');
    }
    stake = Math.floor(value);
    return snapshot();
  }

  async function submitAnswer(userAnswer) {
    if (phase !== 'question') throw new Error('Deze vraag kan nu niet worden beantwoord.');
    if (index > 0 && score > 0 && stake == null) throw new Error('Kies eerst hoeveel botjes je waagt.');

    const normalizedAnswer = String(userAnswer ?? '').trim();
    if (!normalizedAnswer) throw new Error('Vul eerst een antwoord in.');

    const item = questions[index];
    const recoveryRound = index > 0 && score === 0;
    const usedStake = index === 0 || recoveryRound ? FIRST_REWARD : Number(stake);
    if (!Number.isFinite(usedStake) || usedStake < 0) throw new Error('De inzet is ongeldig.');

    // Lock the question before awaiting the grader. This is the domain-level
    // guard against duplicate clicks and concurrent submissions.
    phase = 'checking';

    try {
      const result = await gradeAnswer(item.question, item.answer, normalizedAnswer);
      const previousScore = score;
      const delta = result.correct === true ? usedStake : -usedStake;
      score = Math.max(0, score + delta);
      bestScore = Math.max(bestScore, score);
      lastResult = Object.freeze({
        correct: result.correct === true,
        feedback: result.feedback || '',
        expectedAnswer: item.answer,
        givenAnswer: normalizedAnswer,
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
