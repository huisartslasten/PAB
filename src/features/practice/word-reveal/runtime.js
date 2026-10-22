function shuffle(values, random = Math.random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const next = Math.floor(random() * (index + 1));
    [copy[index], copy[next]] = [copy[next], copy[index]];
  }
  return copy;
}

function normalizeItems(items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item, index) => ({ index, question: String(item?.question ?? '').trim(), answer: String(item?.answer ?? '').trim() }))
    .filter(item => item.question && item.answer);
}

function normalizeTarget(target) {
  const text = String(target?.text ?? '').trim();
  if (!text) throw new Error('Een doelwoord of zin is vereist.');
  const revealableIndices = [...text].reduce((indices, character, index) => {
    if (/\p{L}|\p{N}/u.test(character)) indices.push(index);
    return indices;
  }, []);
  if (!revealableIndices.length) throw new Error('Het doel bevat geen onthulbare letters.');
  return Object.freeze({ type: String(target?.type ?? 'word'), text, meaning: String(target?.meaning ?? '').trim(), revealableIndices });
}

export function createWordRevealRuntime({ items = [], gradeAnswer, random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new TypeError('Word Reveal runtime requires answer grading.');
  const source = normalizeItems(items);
  const remaining = new Set(source.map(item => item.index));
  let questionQueue = [];
  let current = null;
  let target = null;
  let revealedIndices = new Set();
  let turns = 0;
  let phase = 'idle';
  let feedback = null;

  function refillQuestionQueue() {
    questionQueue = shuffle(source.filter(item => remaining.has(item.index)).map(item => item.index), random);
  }

  function selectNextQuestion() {
    if (!remaining.size) { current = null; return null; }
    if (!questionQueue.some(index => remaining.has(index))) refillQuestionQueue();
    const nextIndex = questionQueue.find(index => remaining.has(index));
    questionQueue = questionQueue.filter(index => index !== nextIndex);
    current = source.find(item => item.index === nextIndex) || null;
    return current;
  }

  function startRound(nextTarget) {
    target = normalizeTarget(nextTarget);
    revealedIndices = new Set();
    feedback = null;
    questionQueue = [];
    phase = remaining.size ? 'question' : 'finished';
    if (phase === 'question') selectNextQuestion();
    return snapshot();
  }

  function restart(nextTarget) {
    remaining.clear();
    source.forEach(item => remaining.add(item.index));
    questionQueue = [];
    current = null;
    turns = 0;
    return startRound(nextTarget);
  }

  function completeAfterReveal() {
    if (!remaining.size) {
      revealedIndices = new Set(target.revealableIndices);
      phase = 'finished';
      current = null;
      return;
    }
    if (revealedIndices.size >= target.revealableIndices.length) {
      phase = 'round-complete';
      current = null;
      return;
    }
    phase = 'question';
    selectNextQuestion();
  }

  async function submitAnswer(value) {
    if (phase !== 'question' || !current) throw new Error('Geen vraag beschikbaar.');
    const result = await gradeAnswer(current.question, current.answer, value);
    if (!result?.correct) {
      feedback = { correct: false, question: current.question, studentAnswer: String(value ?? ''), correctAnswer: current.answer, message: String(result?.feedback ?? '').trim() };
      return snapshot();
    }
    remaining.delete(current.index);
    turns += 1;
    feedback = { correct: true, question: current.question, message: String(result?.feedback ?? '').trim() };
    phase = 'reveal-choice';
    return snapshot();
  }

  function continueAfterFeedback() {
    feedback = null;
    if (phase === 'question') selectNextQuestion();
    return snapshot();
  }

  function revealLetter(index) {
    if (phase !== 'reveal-choice') throw new Error('Kies nu eerst een letter om te onthullen.');
    const targetIndex = Number(index);
    if (!target.revealableIndices.includes(targetIndex)) throw new Error('Deze positie kan niet worden onthuld.');
    if (revealedIndices.has(targetIndex)) throw new Error('Deze letter is al onthuld.');

    revealedIndices.add(targetIndex);
    feedback = null;
    completeAfterReveal();
    return snapshot();
  }

  function guessSolution(value) {
    if (phase !== 'question') throw new Error('Je kunt de oplossing nu niet raden.');
    turns += 1;
    const guess = String(value ?? '').trim().toLocaleLowerCase('nl-NL');
    const solution = target.text.trim().toLocaleLowerCase('nl-NL');
    if (guess === solution) {
      feedback = { correct: true, guess: true };
      revealedIndices = new Set(target.revealableIndices);
      if (!remaining.size) { phase = 'finished'; current = null; }
      else { phase = 'round-complete'; current = null; }
      return snapshot();
    }
    feedback = { correct: false, guess: true, studentAnswer: String(value ?? '') };
    return snapshot();
  }

  function snapshot() {
    return Object.freeze({
      phase,
      current,
      target,
      revealedIndices: [...revealedIndices],
      revealedCount: revealedIndices.size,
      turns,
      remainingCount: remaining.size,
      totalCount: source.length,
      completedCount: source.length - remaining.size,
      feedback
    });
  }

  return Object.freeze({ startRound, restart, submitAnswer, continueAfterFeedback, revealLetter, guessSolution, snapshot });
}

export { normalizeTarget };
