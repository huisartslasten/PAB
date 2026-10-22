const BOARD_SIZE = 9;
const WIN_LINES = Object.freeze([
  Object.freeze([0, 1, 2]), Object.freeze([3, 4, 5]), Object.freeze([6, 7, 8]),
  Object.freeze([0, 3, 6]), Object.freeze([1, 4, 7]), Object.freeze([2, 5, 8]),
  Object.freeze([0, 4, 8]), Object.freeze([2, 4, 6])
]);

export const TIC_TAC_TOE_MODES = Object.freeze([
  Object.freeze({ id: 'classic', label: 'CLASSIC', description: 'Gewoon Tic-Tac-Toe.' }),
  Object.freeze({ id: 'infinite', label: 'INFINITE', description: 'Je oudste teken verdwijnt zodra je een vierde eigen teken plaatst.' })
]);

export const TIC_TAC_TOE_AI_LEVELS = Object.freeze([
  Object.freeze({ id: 'rookie', label: 'ROOKIE' }),
  Object.freeze({ id: 'goat', label: 'GOAT' })
]);

function normalizeItems(items) {
  return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object');
}

function emptyBoard() {
  return Array(BOARD_SIZE).fill(null);
}

function cloneBoard(board) {
  return board.map(cell => cell ? { ...cell } : null);
}

function emptyCells(board) {
  return board.map((cell, index) => cell ? -1 : index).filter(index => index >= 0);
}

function hasWinner(board, symbol) {
  return WIN_LINES.some(line => line.every(index => board[index]?.symbol === symbol));
}

function winner(board) {
  if (hasWinner(board, 'X')) return 'X';
  if (hasWinner(board, 'O')) return 'O';
  return null;
}

function isFull(board) {
  return board.every(Boolean);
}

function orderedOwnPieces(board, symbol) {
  return board
    .map((cell, index) => cell?.symbol === symbol ? { ...cell, index } : null)
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

function applyMove(board, symbol, cellIndex, mode, nextOrder) {
  if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= BOARD_SIZE) throw new Error('Ongeldig vakje.');
  if (board[cellIndex]) throw new Error('Dit vakje is al bezet.');

  const next = cloneBoard(board);
  if (mode === 'infinite') {
    const own = orderedOwnPieces(next, symbol);
    if (own.length >= 3) next[own[0].index] = null;
  }
  next[cellIndex] = { symbol, order: nextOrder };
  return next;
}

function immediateWinningMove(board, symbol, mode, nextOrder) {
  for (const cellIndex of emptyCells(board)) {
    const next = applyMove(board, symbol, cellIndex, mode, nextOrder);
    if (hasWinner(next, symbol)) return cellIndex;
  }
  return null;
}

function linePotential(board, symbol) {
  const opponent = symbol === 'X' ? 'O' : 'X';
  return WIN_LINES.reduce((score, line) => {
    const own = line.filter(index => board[index]?.symbol === symbol).length;
    const other = line.filter(index => board[index]?.symbol === opponent).length;
    const open = line.filter(index => !board[index]).length;
    if (other === 0 && own === 2 && open === 1) return score + 30;
    if (other === 0 && own === 1 && open === 2) return score + 6;
    if (own === 0 && other === 2 && open === 1) return score - 26;
    if (own === 0 && other === 1 && open === 2) return score - 5;
    return score;
  }, 0);
}

function strategicValue(board, symbol) {
  const center = board[4]?.symbol === symbol ? 8 : 0;
  const corners = [0, 2, 6, 8].filter(index => board[index]?.symbol === symbol).length * 3;
  return linePotential(board, symbol) + center + corners;
}

function chooseRookieMove(board, random) {
  const cells = emptyCells(board);
  return cells[Math.floor(random() * cells.length)];
}

function chooseGoatMove(board, mode, nextOrder) {
  const winning = immediateWinningMove(board, 'O', mode, nextOrder);
  if (winning != null) return winning;

  const blocking = immediateWinningMove(board, 'X', mode, nextOrder);
  if (blocking != null) return blocking;

  const cells = emptyCells(board);
  if (!cells.length) return null;

  const ranked = cells.map(cellIndex => {
    const next = applyMove(board, 'O', cellIndex, mode, nextOrder);
    return {
      cellIndex,
      value: strategicValue(next, 'O') - strategicValue(next, 'X')
    };
  }).sort((a, b) => b.value - a.value);

  return ranked[0].cellIndex;
}

function shuffleIndices(length, random) {
  const order = Array.from({ length }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }
  return order;
}

function normalizeMode(mode) {
  return mode === 'infinite' ? 'infinite' : 'classic';
}

function normalizeAiLevel(level) {
  return level === 'goat' ? 'goat' : 'rookie';
}

export function createTicTacToeRuntime({ items = [], gradeAnswer, random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new Error('A gradeAnswer function is required.');
  if (typeof random !== 'function') throw new Error('A random function is required.');

  const questions = normalizeItems(items);
  let mode = 'classic';
  let aiLevel = 'rookie';
  let board = emptyBoard();
  let turn = 'X';
  let moveOrder = 0;
  let questionOrder = [];
  let questionCursor = 0;
  let uniqueAnswered = 0;
  let totalAnswered = 0;
  let wins = 0;
  let draws = 0;
  let gamesPlayed = 0;
  let phase = questions.length ? 'choosing' : 'finished';
  let selectedCell = null;
  let pendingQuestion = null;
  let lastResult = null;

  function chooseStartingTurn() {
    return random() < 0.5 ? 'X' : 'O';
  }

  function beginTurnForNewGame() {
    turn = chooseStartingTurn();
    phase = turn === 'X' ? 'choosing' : 'paco';
  }

  function snapshot() {
    return Object.freeze({
      mode,
      aiLevel,
      board: Object.freeze(board.map(cell => cell ? Object.freeze({ ...cell }) : null)),
      turn,
      questionIndex: pendingQuestion?.questionIndex ?? null,
      uniqueAnswered,
      totalAnswered,
      totalQuestions: questions.length,
      wins,
      draws,
      gamesPlayed,
      score: wins,
      bestScore: wins,
      phase,
      selectedCell,
      pendingQuestion,
      lastResult,
      item: pendingQuestion ? questions[pendingQuestion.questionIndex] || null : null
    });
  }

  function start({ gameMode = mode, level = aiLevel } = {}) {
    mode = normalizeMode(gameMode);
    aiLevel = normalizeAiLevel(level);
    board = emptyBoard();
    moveOrder = 0;
    questionOrder = shuffleIndices(questions.length, random);
    questionCursor = 0;
    uniqueAnswered = 0;
    totalAnswered = 0;
    wins = 0;
    draws = 0;
    gamesPlayed = 0;
    selectedCell = null;
    pendingQuestion = null;
    lastResult = null;
    if (questions.length) beginTurnForNewGame();
    else { phase = 'finished'; turn = null; }
    return snapshot();
  }

  function beginNextGame() {
    board = emptyBoard();
    moveOrder = 0;
    gamesPlayed += 1;
    selectedCell = null;
    pendingQuestion = null;
    lastResult = null;
    beginTurnForNewGame();
    return snapshot();
  }

  function selectCell(cellIndex) {
    if (phase !== 'choosing' || turn !== 'X') throw new Error('Je kunt nu geen vakje kiezen.');
    if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= BOARD_SIZE) throw new Error('Ongeldig vakje.');
    if (board[cellIndex]) throw new Error('Dit vakje is al bezet.');
    const questionIndex = questionOrder[questionCursor];
    if (!Number.isInteger(questionIndex)) throw new Error('Er zijn geen oefenvragen meer beschikbaar.');
    selectedCell = cellIndex;
    pendingQuestion = { questionIndex };
    phase = 'question';
    return snapshot();
  }

  async function submitAnswer(userAnswer) {
    if (phase !== 'question' || selectedCell == null || !pendingQuestion) throw new Error('Er staat nu geen oefenvraag klaar.');
    const normalizedAnswer = String(userAnswer ?? '').trim();
    if (!normalizedAnswer) throw new Error('Vul eerst een antwoord in.');

    const item = questions[pendingQuestion.questionIndex];
    phase = 'checking';
    try {
      const result = await gradeAnswer(item.question, item.answer, normalizedAnswer);
      const correct = result.correct === true;
      totalAnswered += 1;
      if (uniqueAnswered < questions.length) uniqueAnswered += 1;
      questionCursor += 1;

      lastResult = Object.freeze({
        correct,
        feedback: result.feedback || '',
        expectedAnswer: item.answer,
        givenAnswer: normalizedAnswer,
        cellIndex: selectedCell
      });

      if (correct) {
        moveOrder += 1;
        board = applyMove(board, 'X', selectedCell, mode, moveOrder);
        const gameWinner = winner(board);
        if (gameWinner) return finishGame(gameWinner);
        if (isFull(board)) return finishGame('draw');
      }

      turn = 'O';
      selectedCell = null;
      pendingQuestion = null;
      phase = 'paco';
      return snapshot();
    } catch (error) {
      phase = 'question';
      throw error;
    }
  }

  function playPacoMove() {
    if (phase !== 'paco' || turn !== 'O') throw new Error('Paco is nu niet aan de beurt.');
    const cellIndex = aiLevel === 'goat'
      ? chooseGoatMove(board, mode, moveOrder + 1)
      : chooseRookieMove(board, random);
    if (cellIndex == null) return finishGame('draw');
    moveOrder += 1;
    board = applyMove(board, 'O', cellIndex, mode, moveOrder);
    const gameWinner = winner(board);
    if (gameWinner) return finishGame(gameWinner);
    if (isFull(board)) return finishGame('draw');
    turn = 'X';
    selectedCell = null;
    pendingQuestion = null;
    phase = 'choosing';
    return snapshot();
  }

  function finishGame(result) {
    if (result === 'X') wins += 1;
    if (result === 'draw') draws += 1;
    lastResult = Object.freeze({ ...(lastResult || {}), gameResult: result });
    const uniqueComplete = uniqueAnswered >= questions.length;
    if (uniqueComplete) {
      phase = 'finished';
      turn = null;
    } else {
      phase = 'game-over';
      turn = null;
    }
    selectedCell = null;
    pendingQuestion = null;
    return snapshot();
  }

  function continueAfterGame() {
    if (phase !== 'game-over') throw new Error('Er is nu geen nieuw potje nodig.');
    return beginNextGame();
  }

  return Object.freeze({ start, selectCell, submitAnswer, playPacoMove, continueAfterGame, snapshot });
}

export { BOARD_SIZE, WIN_LINES, hasWinner, winner, applyMove };
