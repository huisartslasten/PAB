import { createPracticeQuestionSession } from '../question-session.js';

export const ROCK_PAPER_SCISSORS_CHOICES = Object.freeze(['rock', 'paper', 'scissors']);

const BEATS = Object.freeze({ rock: 'scissors', paper: 'rock', scissors: 'paper' });

function normalizeItems(items) {
  return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object');
}

function normalizeAnswer(value) {
  return String(value ?? '').trim();
}

function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function buildQuestions(items, random) {
  return items.map((item, index) => {
    const correct = normalizeAnswer(item.answer);
    const distractors = [];
    const seen = new Set([correct]);
    for (const candidate of shuffle(items, random)) {
      const answer = normalizeAnswer(candidate.answer);
      if (!answer || seen.has(answer)) continue;
      seen.add(answer);
      distractors.push(answer);
      if (distractors.length === 3) break;
    }
    return Object.freeze({
      id: String(item.id ?? index),
      question: normalizeAnswer(item.question),
      answer: correct,
      options: Object.freeze(shuffle([correct, ...distractors], random))
    });
  });
}

function getRpsResult(playerChoice, pacoChoice) {
  if (playerChoice === pacoChoice) return 'draw';
  return BEATS[playerChoice] === pacoChoice ? 'win' : 'loss';
}

function getRpsScore(rpsResult) {
  if (rpsResult === 'win') return 2;
  if (rpsResult === 'draw') return 1;
  return 0;
}

export function createRockPaperScissorsRuntime({ items = [], random = Math.random } = {}) {
  if (typeof random !== 'function') throw new TypeError('A random function is required.');

  const questions = buildQuestions(normalizeItems(items), random);
  const questionSession = createPracticeQuestionSession(questions, { random });
  let score = 0;
  let phase = questions.length ? 'question' : 'finished';
  let currentIndex = null;
  let playerChoice = null;
  let pacoChoice = null;
  let lastResult = null;

  function currentQuestion() {
    return questionSession.current();
  }

  function snapshot() {
    const session = questionSession.snapshot();
    return Object.freeze({
      index: currentIndex,
      total: questions.length,
      score,
      maxScore: questions.length * 2,
      phase,
      item: currentQuestion(),
      playerChoice,
      pacoChoice,
      lastResult,
      questionCycle: session.cycle,
      questionCycleComplete: session.cycleComplete
    });
  }

  function start() {
    questionSession.start();
    score = 0;
    phase = questions.length ? 'question' : 'finished';
    currentIndex = null;
    playerChoice = null;
    pacoChoice = null;
    lastResult = null;
    if (questions.length) {
      const item = questionSession.next();
      currentIndex = questions.indexOf(item);
      pacoChoice = ROCK_PAPER_SCISSORS_CHOICES[Math.floor(random() * ROCK_PAPER_SCISSORS_CHOICES.length)];
    }
    return snapshot();
  }

  function submitAnswer(userAnswer) {
    if (phase !== 'question') throw new Error('Deze vraag kan nu niet worden beantwoord.');
    const item = currentQuestion();
    const givenAnswer = normalizeAnswer(userAnswer);
    const correct = givenAnswer === item.answer;
    questionSession.record(correct);
    lastResult = Object.freeze({ correct, expectedAnswer: item.answer, givenAnswer });
    phase = 'feedback';
    return snapshot();
  }

  function continueAfterFeedback() {
    if (phase !== 'feedback') throw new Error('Er is geen antwoordfeedback beschikbaar.');
    if (!lastResult?.correct) {
      if (questionSession.snapshot().cycleComplete) {
        phase = 'finished';
        return snapshot();
      }
      const item = questionSession.next();
      if (!item) throw new Error('Er zijn geen oefenvragen beschikbaar.');
      currentIndex = questions.indexOf(item);
      playerChoice = null;
      pacoChoice = ROCK_PAPER_SCISSORS_CHOICES[Math.floor(random() * ROCK_PAPER_SCISSORS_CHOICES.length)];
      lastResult = null;
      phase = 'question';
      return snapshot();
    }
    phase = 'choice';
    return snapshot();
  }

  function choose(playerSelection) {
    if (phase !== 'choice') throw new Error('Beantwoord eerst de vraag goed.');
    if (!ROCK_PAPER_SCISSORS_CHOICES.includes(playerSelection)) throw new Error('Ongeldige keuze.');
    playerChoice = playerSelection;
    phase = 'reveal';
    return snapshot();
  }

  function reveal() {
    if (phase !== 'reveal') throw new Error('De kaarten kunnen nu niet worden onthuld.');
    const rpsResult = getRpsResult(playerChoice, pacoChoice);
    const delta = getRpsScore(rpsResult);
    const previousScore = score;
    score += delta;
    lastResult = Object.freeze({ ...lastResult, rpsResult, previousScore, delta, score });
    phase = 'result';
    return snapshot();
  }

  function continueGame() {
    if (phase !== 'result') throw new Error('Er is geen volgende vraag beschikbaar.');
    if (questionSession.snapshot().cycleComplete) {
      phase = 'finished';
      return snapshot();
    }
    const item = questionSession.next();
    if (!item) throw new Error('Er zijn geen oefenvragen beschikbaar.');
    currentIndex = questions.indexOf(item);
    playerChoice = null;
    pacoChoice = ROCK_PAPER_SCISSORS_CHOICES[Math.floor(random() * ROCK_PAPER_SCISSORS_CHOICES.length)];
    lastResult = null;
    phase = 'question';
    return snapshot();
  }

  return Object.freeze({ start, submitAnswer, continueAfterFeedback, choose, reveal, continueGame, snapshot });
}

export { buildQuestions, getRpsResult, getRpsScore, normalizeAnswer };
