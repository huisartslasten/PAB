const DEFAULT_ROWS = 4;
const DEFAULT_COLUMNS = 4;

function normalizeItems(items) {
  return (Array.isArray(items) ? items : [])
    .filter(item => item && typeof item === 'object')
    .map((item, index) => ({ index, question: String(item.question ?? '').trim(), answer: String(item.answer ?? '').trim() }))
    .filter(item => item.question && item.answer);
}

function edgeKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function createEdges(rows, columns) {
  const edges = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const a = row * columns + column;
      edges.push({ a, b: a + 1, orientation: 'horizontal', row, column });
    }
  }
  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * columns + column;
      edges.push({ a, b: a + columns, orientation: 'vertical', row, column });
    }
  }
  return edges;
}

function createBoxes(rows, columns) {
  const boxes = [];
  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const top = edgeKey(row * columns + column, row * columns + column + 1);
      const bottom = edgeKey((row + 1) * columns + column, (row + 1) * columns + column + 1);
      const left = edgeKey(row * columns + column, (row + 1) * columns + column);
      const right = edgeKey(row * columns + column + 1, (row + 1) * columns + column + 1);
      boxes.push({ row, column, edges: [top, right, bottom, left] });
    }
  }
  return boxes;
}

function shuffle(values, random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function createConnectTheDotsRuntime({ items = [], gradeAnswer, random = Math.random, rows = DEFAULT_ROWS, columns = DEFAULT_COLUMNS } = {}) {
  if (typeof gradeAnswer !== 'function') throw new TypeError('Connect the Dots runtime requires answer grading.');
  if (rows < 2 || columns < 2) throw new RangeError('Connect the Dots requires at least a 2x2 dot grid.');

  const questions = normalizeItems(items);
  const edges = createEdges(rows, columns);
  const boxes = createBoxes(rows, columns);
  let aiLevel = 'rookie';
  let takenEdges = new Map();
  let ownedBoxes = new Map();
  let turn = 'X';
  let phase = questions.length ? 'choosing' : 'finished';
  let questionQueue = [];
  let pendingEdge = null;
  let pendingQuestion = null;
  let totalAnswered = 0;
  let uniqueAnswered = 0;
  let lastResult = null;
  let gameResult = null;

  function refillQuestions() {
    questionQueue = shuffle(questions.map(item => item.index), random);
  }

  function nextQuestion() {
    if (!questionQueue.length) refillQuestions();
    const index = questionQueue.shift();
    return questions.find(item => item.index === index) || null;
  }

  function snapshot() {
    const playerBoxes = [...ownedBoxes.values()].filter(owner => owner === 'X').length;
    const pacoBoxes = [...ownedBoxes.values()].filter(owner => owner === 'O').length;
    return Object.freeze({
      rows, columns, aiLevel, turn, phase,
      edges: Object.freeze(edges.map(edge => Object.freeze({ ...edge, key: edgeKey(edge.a, edge.b), owner: takenEdges.get(edgeKey(edge.a, edge.b)) || null }))),
      boxes: Object.freeze(boxes.map((box, index) => Object.freeze({ ...box, index, owner: ownedBoxes.get(index) || null }))),
      playerBoxes, pacoBoxes,
      score: playerBoxes,
      bestScore: playerBoxes,
      totalBoxes: boxes.length,
      totalAnswered, uniqueAnswered, totalQuestions: questions.length,
      pendingEdge, pendingQuestion,
      lastResult, gameResult,
      item: pendingQuestion ? questions.find(question => question.index === pendingQuestion.questionIndex) || null : null
    });
  }

  function start({ level = aiLevel } = {}) {
    aiLevel = level === 'goat' ? 'goat' : 'rookie';
    takenEdges = new Map();
    ownedBoxes = new Map();
    turn = random() < 0.5 ? 'X' : 'O';
    phase = questions.length ? (turn === 'X' ? 'choosing' : 'paco') : 'finished';
    questionQueue = [];
    pendingEdge = null;
    pendingQuestion = null;
    totalAnswered = 0;
    uniqueAnswered = 0;
    lastResult = null;
    gameResult = null;
    return snapshot();
  }

  function selectEdge(key) {
    if (phase !== 'choosing' || turn !== 'X') throw new Error('Je kunt nu geen lijn kiezen.');
    if (!edges.some(edge => edgeKey(edge.a, edge.b) === key)) throw new Error('Ongeldige lijn.');
    if (takenEdges.has(key)) throw new Error('Deze lijn is al gezet.');
    const question = nextQuestion();
    if (!question) throw new Error('Er zijn geen oefenvragen beschikbaar.');
    pendingEdge = key;
    pendingQuestion = { questionIndex: question.index };
    phase = 'question';
    return snapshot();
  }

  function boxesCompletedBy(key) {
    return boxes.filter(box => box.edges.includes(key) && box.edges.every(edge => takenEdges.has(edge)));
  }

  function completeTurn(owner, key) {
    takenEdges.set(key, owner);
    const completed = boxesCompletedBy(key);
    completed.forEach(box => ownedBoxes.set(box.row * (columns - 1) + box.column, owner));
    const finished = takenEdges.size === edges.length;
    if (finished) {
      const playerBoxes = [...ownedBoxes.values()].filter(value => value === 'X').length;
      const pacoBoxes = [...ownedBoxes.values()].filter(value => value === 'O').length;
      gameResult = playerBoxes > pacoBoxes ? 'X' : playerBoxes < pacoBoxes ? 'O' : 'draw';
      phase = 'finished';
      turn = null;
      return completed.length;
    }
    if (completed.length) {
      turn = owner;
      phase = owner === 'X' ? 'choosing' : 'paco';
    } else {
      turn = owner === 'X' ? 'O' : 'X';
      phase = turn === 'X' ? 'choosing' : 'paco';
    }
    return completed.length;
  }

  async function submitAnswer(value) {
    if (phase !== 'question' || !pendingEdge || !pendingQuestion) throw new Error('Er staat nu geen oefenvraag klaar.');
    const answer = String(value ?? '').trim();
    if (!answer) throw new Error('Vul eerst een antwoord in.');
    const item = questions.find(question => question.index === pendingQuestion.questionIndex);
    const result = await gradeAnswer(item.question, item.answer, answer);
    const correct = result?.correct === true;
    totalAnswered += 1;
    if (uniqueAnswered < questions.length) uniqueAnswered += 1;
    lastResult = Object.freeze({ correct, feedback: result?.feedback || '', expectedAnswer: item.answer, givenAnswer: answer });
    if (correct) {
      completeTurn('X', pendingEdge);
      pendingEdge = null;
      pendingQuestion = null;
      return snapshot();
    }
    pendingEdge = null;
    pendingQuestion = null;
    turn = 'O';
    phase = 'paco';
    return snapshot();
  }

  function choosePacoEdge() {
    const available = edges.filter(edge => !takenEdges.has(edgeKey(edge.a, edge.b)));
    if (!available.length) return null;
    if (aiLevel === 'rookie') return available[Math.floor(random() * available.length)];
    const scoring = available.find(edge => boxes.some(box => box.edges.includes(edgeKey(edge.a, edge.b)) && box.edges.filter(item => takenEdges.has(item)).length === 3));
    if (scoring) return scoring;
    const safe = available.find(edge => !boxes.some(box => box.edges.includes(edgeKey(edge.a, edge.b)) && box.edges.filter(item => takenEdges.has(item)).length === 2));
    return safe || available[0];
  }

  function playPacoMove() {
    if (phase !== 'paco' || turn !== 'O') throw new Error('Paco is nu niet aan de beurt.');
    const edge = choosePacoEdge();
    if (!edge) { phase = 'finished'; turn = null; gameResult = 'draw'; return snapshot(); }
    completeTurn('O', edgeKey(edge.a, edge.b));
    return snapshot();
  }

  return Object.freeze({ start, selectEdge, submitAnswer, playPacoMove, snapshot });
}

export { DEFAULT_ROWS, DEFAULT_COLUMNS, edgeKey, createEdges, createBoxes };
