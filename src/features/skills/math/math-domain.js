import { getMathProfile, listMathProfiles } from './math-profile-registry.js';

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

const GENERATORS = Object.freeze({
  addition: createAddition,
  subtraction: createSubtraction,
  multiplication: createMultiplication
});

export function createMathQuestion(profileId, random = Math.random) {
  const key = String(profileId ?? '').trim();
  const profile = getMathProfile(key);
  if (!profile) throw new Error(`Unsupported math profile: ${key}`);
  const generator = GENERATORS[profile.operation];
  return generator(profile, random);
}

export function createMixedMathQuestion(profileIds, random = Math.random) {
  const ids = [...new Set((profileIds || []).map((id) => String(id).trim()).filter(Boolean))];
  if (!ids.length) throw new Error('At least one math profile is required for mixed practice.');
  return createMathQuestion(ids[randomInt(0, ids.length - 1, random)], random);
}

export function evaluateMathAnswer(question, value) {
  const normalized = String(value ?? '').trim();
  if (!normalized) return Object.freeze({ correct: false, answered: false });
  const numeric = Number(normalized);
  return Object.freeze({
    correct: Number.isFinite(numeric) && numeric === question.answer,
    answered: true
  });
}

export function createMathSession({ durationSeconds = 180, profileId, mixedProfileIds, random = Math.random } = {}) {
  const duration = Number(durationSeconds);
  if (!Number.isInteger(duration) || duration <= 0) throw new Error('A positive duration is required.');
  const mixed = Array.isArray(mixedProfileIds);
  if (!profileId && !mixed) throw new Error('A math profile is required.');
  const createQuestion = mixed
    ? () => createMixedMathQuestion(mixedProfileIds, random)
    : () => createMathQuestion(profileId, random);
  let question = createQuestion();
  let score = 0;
  let answered = 0;
  let correct = 0;

  return Object.freeze({
    durationSeconds: duration,
    profileId: profileId || null,
    mixedProfileIds: mixed ? [...mixedProfileIds] : null,
    get score() { return score; },
    get answered() { return answered; },
    get correct() { return correct; },
    get question() { return question; },
    answer(value) {
      const result = evaluateMathAnswer(question, value);
      if (result.answered) {
        answered += 1;
        if (result.correct) {
          correct += 1;
          score += 1;
        }
      }
      return result;
    },
    nextQuestion() {
      question = createQuestion();
      return question;
    }
  });
}

export function listDefaultMixedProfileIds() {
  return listMathProfiles().map((profile) => profile.id);
}
