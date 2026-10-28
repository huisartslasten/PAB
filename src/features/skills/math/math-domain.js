function randomInt(min, max, random = Math.random) {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) throw new Error('Invalid integer range.');
  return Math.floor(random() * (max - min + 1)) + min;
}

function normalizeRange(value, label, { minimum = 0 } = {}) {
  const min = Number(value?.min);
  const max = Number(value?.max);
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < minimum || max < min) throw new Error(`Invalid ${label} range.`);
  return Object.freeze({ min, max });
}

function normalizeMathDefinition(profile) {
  const value = profile && typeof profile === 'object' ? profile : null;
  const definition = value?.definition;
  if (!value?.id || definition?.kind !== 'math' || !definition.operation) throw new Error('A valid math profile is required.');
  return Object.freeze({ id: String(value.id), ...definition });
}

function createAddition(profile, random) {
  const [left, right] = profile.operands.map((range, index) => normalizeRange(range, `addition operand ${index + 1}`));
  const resultMax = profile.resultMax == null ? Number.POSITIVE_INFINITY : Number(profile.resultMax);
  const leftMax = Math.min(left.max, resultMax - right.min);
  if (left.min > leftMax) throw new Error('Addition configuration has no valid questions.');
  const a = randomInt(left.min, leftMax, random);
  const bMax = Math.min(right.max, resultMax - a);
  if (right.min > bMax) throw new Error('Addition configuration has no valid questions.');
  const b = randomInt(right.min, bMax, random);
  return Object.freeze({ operation: 'addition', profileId: profile.id, a, b, answer: a + b, text: `${a} + ${b}` });
}

function createSubtraction(profile, random) {
  const [left, right] = profile.operands.map((range, index) => normalizeRange(range, `subtraction operand ${index + 1}`));
  const aMin = Math.max(left.min, right.min);
  if (aMin > left.max) throw new Error('Subtraction configuration has no non-negative questions.');
  const a = randomInt(aMin, left.max, random);
  const bMax = Math.min(right.max, a);
  if (right.min > bMax) throw new Error('Subtraction configuration has no non-negative questions.');
  const b = randomInt(right.min, bMax, random);
  return Object.freeze({ operation: 'subtraction', profileId: profile.id, a, b, answer: a - b, text: `${a} − ${b}` });
}

function createMultiplication(profile, random) {
  const [left, right] = profile.operands.map((range, index) => normalizeRange(range, `multiplication operand ${index + 1}`));
  const a = randomInt(left.min, left.max, random);
  const b = randomInt(right.min, right.max, random);
  return Object.freeze({ operation: 'multiplication', profileId: profile.id, a, b, answer: a * b, text: `${a} × ${b}` });
}

function createDivision(profile, random) {
  const [dividend, divisor] = profile.operands.map((range, index) => normalizeRange(range, `division operand ${index + 1}`, { minimum: 1 }));
  const remainderAllowed = profile.remainderAllowed !== false;
  if (remainderAllowed) {
    const a = randomInt(dividend.min, dividend.max, random);
    const b = randomInt(divisor.min, divisor.max, random);
    return Object.freeze({ operation: 'division', profileId: profile.id, a, b, answer: a / b, text: `${a} ÷ ${b}`, remainderAllowed: true });
  }
  const validDivisors = [];
  for (let divisorValue = divisor.min; divisorValue <= divisor.max; divisorValue += 1) {
    const quotientMin = Math.ceil(dividend.min / divisorValue);
    const quotientMax = Math.floor(dividend.max / divisorValue);
    if (quotientMin <= quotientMax && quotientMax >= 1) validDivisors.push({ divisor: divisorValue, quotientMin, quotientMax });
  }
  if (!validDivisors.length) throw new Error('Division configuration has no exact questions.');
  const candidate = validDivisors[randomInt(0, validDivisors.length - 1, random)];
  const quotient = randomInt(Math.max(1, candidate.quotientMin), candidate.quotientMax, random);
  const a = candidate.divisor * quotient;
  return Object.freeze({ operation: 'division', profileId: profile.id, a, b: candidate.divisor, answer: quotient, text: `${a} ÷ ${candidate.divisor}`, remainderAllowed: false });
}

function gcd(a, b) {
  let x = Math.abs(a); let y = Math.abs(b);
  while (y) { const next = x % y; x = y; y = next; }
  return x || 1;
}

function normalizeFraction(numerator, denominator) {
  if (denominator === 0) throw new Error('A fraction denominator cannot be zero.');
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ numerator: sign * numerator / divisor, denominator: sign * denominator / divisor });
}

function addFractions(left, right, operation) {
  if (operation === 'addition') return { numerator: left.numerator * right.denominator + right.numerator * left.denominator, denominator: left.denominator * right.denominator };
  if (operation === 'subtraction') return { numerator: left.numerator * right.denominator - right.numerator * left.denominator, denominator: left.denominator * right.denominator };
  if (operation === 'multiplication') return { numerator: left.numerator * right.numerator, denominator: left.denominator * right.denominator };
  if (operation === 'division') {
    if (right.numerator === 0) throw new Error('Fraction division requires a non-zero divisor.');
    return { numerator: left.numerator * right.denominator, denominator: left.denominator * right.numerator };
  }
  throw new Error(`Unsupported fraction operation: ${operation}`);
}

function createFraction(profile, random) {
  const operation = profile.fractionOperation || 'addition';
  const ranges = profile.fractionOperands;
  if (!Array.isArray(ranges) || ranges.length !== 2) throw new Error('Two fraction operand ranges are required.');
  const fractions = ranges.map((range, index) => {
    const numerator = normalizeRange(range?.numerator, `fraction ${index + 1} numerator`);
    const denominator = normalizeRange(range?.denominator, `fraction ${index + 1} denominator`, { minimum: 1 });
    return normalizeFraction(randomInt(numerator.min, numerator.max, random), randomInt(denominator.min, denominator.max, random));
  });
  if (operation === 'division' && fractions[1].numerator === 0) throw new Error('Fraction division requires a non-zero divisor range.');
  const rawAnswer = addFractions(fractions[0], fractions[1], operation);
  const answer = profile.simplifyAnswer === false ? Object.freeze({ numerator: rawAnswer.numerator, denominator: rawAnswer.denominator }) : normalizeFraction(rawAnswer.numerator, rawAnswer.denominator);
  return Object.freeze({
    operation: 'fraction',
    fractionOperation: operation,
    profileId: profile.id,
    fractions,
    answer,
    text: `${fractions[0].numerator}/${fractions[0].denominator} ${operation === 'addition' ? '+' : operation === 'subtraction' ? '−' : operation === 'multiplication' ? '×' : '÷'} ${fractions[1].numerator}/${fractions[1].denominator}`
  });
}

const GENERATORS = Object.freeze({ addition: createAddition, subtraction: createSubtraction, multiplication: createMultiplication, division: createDivision, fraction: createFraction });

export function createMathQuestion(profile, random = Math.random) {
  const normalized = normalizeMathDefinition(profile);
  const generator = GENERATORS[normalized.operation];
  if (!generator) throw new Error(`Unsupported math operation: ${normalized.operation}`);
  return generator(normalized, random);
}

export function createMixedMathQuestion(profiles, random = Math.random) {
  const normalized = [...new Map((profiles || []).map(profile => [String(profile?.id || ''), profile]).filter(([id]) => id)).values()];
  if (!normalized.length) throw new Error('At least one math profile is required for mixed practice.');
  return createMathQuestion(normalized[randomInt(0, normalized.length - 1, random)], random);
}

function parseFraction(value) {
  const normalized = String(value ?? '').trim().replace(/\s+/g, '');
  const match = normalized.match(/^(-?\d+)\/(-?\d+)$/);
  if (!match) return null;
  const numerator = Number(match[1]); const denominator = Number(match[2]);
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) return null;
  return normalizeFraction(numerator, denominator);
}

export function evaluateMathAnswer(question, value) {
  const normalized = String(value ?? '').trim();
  if (!normalized) return Object.freeze({ correct: false, answered: false });
  if (question.operation === 'fraction') {
    const answer = parseFraction(normalized);
    return Object.freeze({ correct: Boolean(answer && answer.numerator === question.answer.numerator && answer.denominator === question.answer.denominator), answered: true });
  }
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
