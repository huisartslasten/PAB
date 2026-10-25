function randomInt(min, max, random = Math.random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function createAddition(profile, random) {
  const a = randomInt(profile.operandMin, profile.resultMax - profile.operandMin, random);
  const b = randomInt(profile.operandMin, profile.resultMax - a, random);
  return Object.freeze({ operation: 'addition', profileId: profile.id, a, b, answer: a + b, text: `${a} + ${b}` });
}

function createSubtraction(profile, random) {
  const a = randomInt(profile.operandMin, profile.resultMax, random);
  const b = randomInt(profile.operandMin, a, random);
  return Object.freeze({ operation: 'subtraction', profileId: profile.id, a, b, answer: a - b, text: `${a} - ${b}` });
}

function createMultiplication(profile, random) {
  const a = randomInt(profile.factorMin, profile.factorMax, random);
  const b = randomInt(profile.factorMin, profile.factorMax, random);
  return Object.freeze({ operation: 'multiplication', profileId: profile.id, a, b, answer: a * b, text: `${a} × ${b}` });
}

const GENERATORS = Object.freeze({ addition: createAddition, subtraction: createSubtraction, multiplication: createMultiplication });

function normalizeProfile(profile) {
  const value = profile && typeof profile === 'object' ? profile : null;
  if (!value?.id || !value?.definition?.operation) throw new Error('A valid math profile is required.');
  return Object.freeze({ id: String(value.id), ...value.definition });
}

export function createMathQuestion(profile, random = Math.random) {
  const normalized = normalizeProfile(profile);
  const generator = GENERATORS[normalized.operation];
  if (!generator) throw new Error(`Unsupported math operation: ${normalized.operation}`);
  return generator(normalized, random);
}

export function createMixedMathQuestion(profiles, random = Math.random) {
  const normalized = [...new Map((profiles || []).map(profile => [String(profile?.id || ''), profile]).filter(([id]) => id)) .values()];
  if (!normalized.length) throw new Error('At least one math profile is required for mixed practice.');
  return createMathQuestion(normalized[randomInt(0, normalized.length - 1, random)], random);
}

export function evaluateMathAnswer(question, value) {
  const normalized = String(value ?? '').trim();
  if (!normalized) return Object.freeze({ correct: false, answered: false });
  const numeric = Number(normalized);
  return Object.freeze({ correct: Number.isFinite(numeric) && numeric === question.answer, answered: true });
}

export function createMathSession({ durationSeconds = 180, profile, mixedProfiles, random = Math.random } = {}) {
  const duration = Number(durationSeconds);
  if (!Number.isInteger(duration) || duration <= 0) throw new Error('A positive duration is required.');
  if (!profile && !Array.isArray(mixedProfiles)) throw new Error('A math profile is required.');
  const createQuestion = Array.isArray(mixedProfiles) ? () => createMixedMathQuestion(mixedProfiles, random) : () => createMathQuestion(profile, random);
  let question = createQuestion();
  let score = 0;
  let answered = 0;
  let correct = 0;
  return Object.freeze({
    durationSeconds: duration,
    profileId: profile?.id || null,
    mixedProfileIds: Array.isArray(mixedProfiles) ? mixedProfiles.map(item => item.id) : null,
    get score() { return score; },
    get answered() { return answered; },
    get correct() { return correct; },
    get question() { return question; },
    answer(value) { const result = evaluateMathAnswer(question, value); if (result.answered) { answered += 1; if (result.correct) { correct += 1; score += 1; } } return result; },
    nextQuestion() { question = createQuestion(); return question; }
  });
}
