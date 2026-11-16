import { createPracticeQuestionSession } from '../question-session.js';

const COLUMNS = 7;
const ROWS = 6;
const BOARD_SIZE = COLUMNS * ROWS;
const WIN_LENGTH = 4;

export const DROP4_AI_LEVELS = Object.freeze([
  Object.freeze({ value: 'rookie', label: 'ROOKIE' }),
  Object.freeze({ value: 'goat', label: 'GOAT' })
]);

function emptyBoard() { return Array(BOARD_SIZE).fill(null); }
function normalizeItems(items) { return (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object'); }
function columnCells(column) { return Array.from({ length: ROWS }, (_, row) => row * COLUMNS + column); }
function availableColumns(board) { return Array.from({ length: COLUMNS }, (_, column) => column).filter(column => board[column] == null); }
function cloneBoard(board) { return board.slice(); }
function dropPiece(board, column, symbol) {
  if (!Number.isInteger(column) || column < 0 || column >= COLUMNS) throw new Error('Ongeldige kolom.');
  const row = [...Array(ROWS).keys()].reverse().find(candidate => board[candidate * COLUMNS + column] == null);
  if (row == null) throw new Error('Deze kolom is vol.');
  const next = cloneBoard(board); const index = row * COLUMNS + column; next[index] = symbol;
  return Object.freeze({ board: next, index });
}
function hasWinner(board, symbol) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let row = 0; row < ROWS; row += 1) for (let column = 0; column < COLUMNS; column += 1) for (const [dr, dc] of directions) {
    let count = 0;
    for (let step = 0; step < WIN_LENGTH; step += 1) {
      const nextRow = row + dr * step; const nextColumn = column + dc * step;
      if (nextRow < 0 || nextRow >= ROWS || nextColumn < 0 || nextColumn >= COLUMNS) break;
      if (board[nextRow * COLUMNS + nextColumn] !== symbol) break;
      count += 1;
    }
    if (count === WIN_LENGTH) return true;
  }
  return false;
}
function isFull(board) { return board.every(Boolean); }
function winner(board) { if (hasWinner(board, 'X')) return 'X'; if (hasWinner(board, 'O')) return 'O'; return null; }
function immediateWinningColumn(board, symbol) { for (const column of availableColumns(board)) { const move = dropPiece(board, column, symbol); if (hasWinner(move.board, symbol)) return column; } return null; }
function windowScore(values, symbol) {
  const opponent = symbol === 'O' ? 'X' : 'O'; const own = values.filter(value => value === symbol).length; const other = values.filter(value => value === opponent).length; const open = values.filter(value => !value).length;
  if (own === 4) return 10000; if (own === 3 && open === 1) return 80; if (own === 2 && open === 2) return 12; if (other === 3 && open === 1) return -90; if (other === 2 && open === 2) return -14; return 0;
}
function strategicValue(board, symbol) {
  let score = columnCells(Math.floor(COLUMNS / 2)).filter(index => board[index] === symbol).length * 8;
  for (let row = 0; row < ROWS; row += 1) for (let column = 0; column <= COLUMNS - WIN_LENGTH; column += 1) score += windowScore(Array.from({ length: WIN_LENGTH }, (_, offset) => board[row * COLUMNS + column + offset]), symbol);
  for (let column = 0; column < COLUMNS; column += 1) for (let row = 0; row <= ROWS - WIN_LENGTH; row += 1) score += windowScore(Array.from({ length: WIN_LENGTH }, (_, offset) => board[(row + offset) * COLUMNS + column]), symbol);
  for (let row = 0; row <= ROWS - WIN_LENGTH; row += 1) for (let column = 0; column <= COLUMNS - WIN_LENGTH; column += 1) score += windowScore(Array.from({ length: WIN_LENGTH }, (_, offset) => board[(row + offset) * COLUMNS + column + offset]), symbol);
  for (let row = WIN_LENGTH - 1; row < ROWS; row += 1) for (let column = 0; column <= COLUMNS - WIN_LENGTH; column += 1) score += windowScore(Array.from({ length: WIN_LENGTH }, (_, offset) => board[(row - offset) * COLUMNS + column + offset]), symbol);
  return score;
}
function chooseRookieMove(board, random) { const columns = availableColumns(board); return columns[Math.floor(random() * columns.length)]; }
function chooseGoatMove(board) {
  const winning = immediateWinningColumn(board, 'O'); if (winning != null) return winning;
  const blocking = immediateWinningColumn(board, 'X'); if (blocking != null) return blocking;
  const columns = availableColumns(board); if (!columns.length) return null;
  return columns.map(column => { const next = dropPiece(board, column, 'O').board; return { column, value: strategicValue(next, 'O') - strategicValue(next, 'X') }; }).sort((a, b) => b.value - a.value)[0].column;
}

export function createDrop4Runtime({ items = [], gradeAnswer, random = Math.random } = {}) {
  if (typeof gradeAnswer !== 'function') throw new Error('A gradeAnswer function is required.');
  if (typeof random !== 'function') throw new Error('A random function is required.');
  const questions = normalizeItems(items); const questionSession = createPracticeQuestionSession(questions, { random });
  let board = emptyBoard(); let turn = null; let phase = questions.length ? 'choosing' : 'finished'; let aiLevel = 'rookie'; let playerTurns = 0; let selectedColumn = null; let pendingQuestion = null; let lastResult = null;

  function chooseStartingTurn() { return random() < 0.5 ? 'X' : 'O'; }
  function questionStats() { const state = questionSession.snapshot(); return { uniqueAnswered: state.attemptedCount, cycle: state.cycle, cycleComplete: state.cycleComplete }; }
  function snapshot() {
    const stats = questionStats();
    return Object.freeze({ board: Object.freeze(board.slice()), columns: COLUMNS, rows: ROWS, turn, phase, aiLevel, selectedColumn, pendingQuestion, item: pendingQuestion ? questions[pendingQuestion.questionIndex] || null : null, uniqueAnswered: stats.uniqueAnswered, totalAnswered: lastResult?.totalAnswered ?? 0, totalQuestions: questions.length, playerTurns, score: lastResult?.gameResult === 'X' ? playerTurns : null, bestScore: null, questionCycle: stats.cycle, questionCycleComplete: stats.cycleComplete, lastResult });
  }
  function start({ level = aiLevel } = {}) {
    aiLevel = level === 'goat' ? 'goat' : 'rookie'; board = emptyBoard(); turn = chooseStartingTurn(); phase = questions.length ? (turn === 'X' ? 'choosing' : 'paco') : 'finished'; questionSession.start(); playerTurns = 0; selectedColumn = null; pendingQuestion = null; lastResult = null; if (!questions.length) phase = 'finished'; return snapshot();
  }
  function selectColumn(column) {
    if (phase !== 'choosing' || turn !== 'X') throw new Error('Je kunt nu geen kolom kiezen.');
    if (!availableColumns(board).includes(column)) throw new Error('Deze kolom is vol.');
    const question = questionSession.next(); if (!question) throw new Error('Er zijn geen oefenvragen beschikbaar.');
    selectedColumn = column; pendingQuestion = { questionIndex: question.index ?? questions.indexOf(question) }; phase = 'question'; return snapshot();
  }
  async function submitAnswer(userAnswer) {
    if (phase !== 'question' || selectedColumn == null || !pendingQuestion) throw new Error('Er staat nu geen oefenvraag klaar.');
    const normalizedAnswer = String(userAnswer ?? '').trim(); if (!normalizedAnswer) throw new Error('Vul eerst een antwoord in.');
    const item = questions[pendingQuestion.questionIndex]; phase = 'checking';
    try {
      const result = await gradeAnswer(item.question, item.answer, normalizedAnswer); const correct = result.correct === true; const sessionResult = questionSession.record(correct); const totalAnswered = (lastResult?.totalAnswered || 0) + 1;
      lastResult = Object.freeze({ correct, feedback: result.feedback || '', expectedAnswer: item.answer, givenAnswer: normalizedAnswer, column: selectedColumn, totalAnswered, questionCycle: sessionResult.cycle });
      if (correct) { playerTurns += 1; board = dropPiece(board, selectedColumn, 'X').board; const gameWinner = winner(board); if (gameWinner) return finishGame(gameWinner); if (isFull(board)) return finishGame('draw'); }
      turn = 'O'; phase = 'paco'; selectedColumn = null; pendingQuestion = null; return snapshot();
    } catch (error) { phase = 'question'; throw error; }
  }
  function playPacoMove() {
    if (phase !== 'paco' || turn !== 'O') throw new Error('Paco is nu niet aan de beurt.');
    const column = aiLevel === 'goat' ? chooseGoatMove(board) : chooseRookieMove(board, random); if (column == null) return finishGame('draw');
    board = dropPiece(board, column, 'O').board; const gameWinner = winner(board); if (gameWinner) return finishGame(gameWinner); if (isFull(board)) return finishGame('draw'); turn = 'X'; phase = 'choosing'; return snapshot();
  }
  function finishGame(result) { lastResult = Object.freeze({ ...(lastResult || {}), gameResult: result }); phase = 'finished'; turn = null; selectedColumn = null; pendingQuestion = null; return snapshot(); }
  return Object.freeze({ start, selectColumn, submitAnswer, playPacoMove, snapshot });
}
export { BOARD_SIZE, COLUMNS, ROWS, WIN_LENGTH, dropPiece, hasWinner, winner };
