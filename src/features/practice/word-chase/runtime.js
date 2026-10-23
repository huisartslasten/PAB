import { isFiveLetterWord, normalizeWord, pickWord } from './dictionary.js';

function normalizeItems(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item, index) => ({ index, question: String(item?.question ?? '').trim(), answer: String(item?.answer ?? '').trim() }))
    .filter(item => item.question && item.answer);
}

function shuffle(values, random = Math.random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const next = Math.floor(random() * (index + 1));
    [copy[index], copy[next]] = [copy[next], copy[index]];
  }
  return copy;
}

function scoreForDifficulty(difficulty) {
  return difficulty === 'rookie' ? 1 : 1;
}

function revealCountForDifficulty(difficulty) {
  return difficulty === 'rookie' ? 2 : 1;
}

export function createWordChaseRuntime({ items = [], gradeAnswer, difficulty = 'rookie', random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new TypeError('Word Chase runtime requires answer grading.');
  if (!['rookie', 'goat'].includes(difficulty)) throw new Error('Ongeldige moeilijkheidsgraad.');

  const source = normalizeItems(items);
  const revealCount = revealCountForDifficulty(difficulty);
  let target = '';
  let revealedIndices = new Set();
  let remaining = new Set(source.map(item => item.index));
  let questionQueue = [];
  let current = null;
  let phase = 'idle';
  let turns = 0;
  let wordAttempts = 0;
  let feedback = null;

  function refillQuestionQueue() {
    const indices = remaining.size
      ? [...remaining]
      : source.map(item => item.index);
    questionQueue = shuffle(indices, random);
  }

  function nextQuestion() {
    if (!source.length) {
      current = null;
      phase = 'finished';
      return;
    }
    if (!questionQueue.length) refillQuestionQueue();
    const nextIndex = questionQueue.shift();
    current = source.find(item => item.index === nextIndex) || null;
    if (!current) return nextQuestion();
    phase = 'question';
  }

  function revealInitialLetters() {
    const indices = shuffle([...Array(5).keys()], random).slice(0, revealCount);
    revealedIndices = new Set(indices);
  }

  function startWord(nextTarget = '') {
    const candidate = normalizeWord(nextTarget) || pickWord(random, target);
    if (!isFiveLetterWord(candidate)) throw new Error('Word Chase heeft een geldig vijfletterwoord nodig.');
    target = candidate;
    revealedIndices = new Set();
    revealInitialLetters();
    wordAttempts = 0;
    feedback = null;
    nextQuestion();
    return snapshot();
  }

  function restart() {
    remaining = new Set(source.map(item => item.index));
    questionQueue = [];
    current = null;
    target = '';
    revealedIndices = new Set();
    turns = 0;
    wordAttempts = 0;
    feedback = null;
    phase = 'idle';
    return startWord();
  }

  async function submitExerciseAnswer(value) {
    if (phase !== 'question' || !current) throw new Error('Geen oefenvraag beschikbaar.');
    turns += 1;
    const result = await gradeAnswer(current.question, current.answer, value);
    if (!result?.correct) {
      feedback = {
        type: 'exercise',
        correct: false,
        question: current.question,
        studentAnswer: String(value ?? ''),
        correctAnswer: current.answer,
        message: String(result?.feedback ?? '').trim()
      };
      return snapshot();
    }

    remaining.delete(current.index);
    feedback = { type: 'exercise', correct: true, message: String(result?.feedback ?? '').trim() };
    phase = 'word';
    return snapshot();
  }

  function continueAfterExerciseFeedback() {
    feedback = null;
    if (phase === 'question') nextQuestion();
    return snapshot();
  }

  function submitWord(value) {
    if (phase !== 'word') throw new Error('Beantwoord eerst de oefenvraag.');
    const guess = normalizeWord(value);
    if (!isFiveLetterWord(guess)) {
      feedback = { type: 'word', correct: false, invalid: true, studentAnswer: String(value ?? '') };
      return snapshot();
    }

    wordAttempts += 1;
    if (guess === target) {
      feedback = { type: 'word', correct: true, guess, target };
      if (!remaining.size) {
        phase = 'finished';
        current = null;
      } else {
        phase = 'new-word';
        current = null;
      }
      return snapshot();
    }

    feedback = { type: 'word', correct: false, guess, evaluation: evaluateGuess(guess, target) };
    nextQuestion();
    return snapshot();
  }

  function continueAfterWordResult() {
    feedback = null;
    if (phase === 'new-word') return startWord();
    if (phase === 'question') return snapshot();
    return snapshot();
  }

  function evaluateGuess(guess, solution) {
    const result = Array(5).fill('absent');
    const remainingLetters = {};
    [...solution].forEach((letter, index) => {
      if (guess[index] === letter) result[index] = 'correct';
      else remainingLetters[letter] = (remainingLetters[letter] || 0) + 1;
    });
    [...guess].forEach((letter, index) => {
      if (result[index] === 'correct') return;
      if (remainingLetters[letter] > 0) {
        result[index] = 'present';
        remainingLetters[letter] -= 1;
      }
    });
    return result;
  }

  function snapshot() {
    return Object.freeze({
      phase,
      difficulty,
      revealCount,
      target,
      revealedIndices: [...revealedIndices],
      current,
      turns,
      wordAttempts,
      remainingCount: remaining.size,
      totalCount: source.length,
      completedCount: source.length - remaining.size,
      feedback,
      scoreUnit: scoreForDifficulty(difficulty)
    });
  }

  return Object.freeze({ restart, startWord, submitExerciseAnswer, continueAfterExerciseFeedback, submitWord, continueAfterWordResult, snapshot, evaluateGuess });
}

export { revealCountForDifficulty };
