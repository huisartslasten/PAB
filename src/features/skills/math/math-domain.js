const OPERATION_RANGES = Object.freeze({
  addition: Object.freeze({ min: 1, max: 20 }),
  subtraction: Object.freeze({ min: 10, max: 50 }),
  multiplication: Object.freeze({ min: 2, max: 10 })
});

function randomInt(min, max, random = Math.random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function createAddition(random) {
  const range = OPERATION_RANGES.addition;
  const a = randomInt(range.min, range.max, random);
  const b = randomInt(range.min, range.max, random);
  return Object.freeze({ operation: 'addition', a, b, answer: a + b, text: `${a} + ${b}` });
}

function createSubtraction(random) {
  const range = OPERATION_RANGES.subtraction;
  const a = randomInt(range.min, range.max, random);
  const b = randomInt(0, a, random);
  return Object.freeze({ operation: 'subtraction', a, b, answer: a - b, text: `${a} - ${b}` });
}

function createMultiplication(random) {
  const range = OPERATION_RANGES.multiplication;
  const a = randomInt(range.min, range.max, random);
  const b = randomInt(range.min, range.max, random);
  return Object.freeze({ operation: 'multiplication', a, b, answer: a * b, text: `${a} × ${b}` });
}

const GENERATORS = Object.freeze({
  addition: createAddition,
  subtraction: createSubtraction,
  multiplication: createMultiplication
});

export function createMathQuestion(operation, random = Math.random) {
  const key = String(operation ?? '').trim();
  if (key === 'mixed') {
    const operations = Object.keys(GENERATORS);
    return GENERATORS[operations[randomInt(0, operations.length - 1, random)]](random);
  }
  const generator = GENERATORS[key];
  if (!generator) throw new Error(`Unsupported math operation: ${key}`);
  return generator(random);
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

export function createMathSession({ durationSeconds = 180, operation, random = Math.random } = {}) {
  const duration = Number(durationSeconds);
  if (!Number.isInteger(duration) || duration <= 0) throw new Error('A positive duration is required.');
  let question = createMathQuestion(operation, random);
  let score = 0;
  let answered = 0;
  let correct = 0;

  return Object.freeze({
    durationSeconds: duration,
    operation,
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
      question = createMathQuestion(operation, random);
      return question;
    }
  });
}
