import test from 'node:test';
import assert from 'node:assert/strict';
import { createDrop4Runtime, dropPiece, hasWinner } from './runtime.js';

const items = [
  { question: '1 + 1', answer: '2' },
  { question: '2 + 2', answer: '4' },
  { question: '3 + 3', answer: '6' },
  { question: '4 + 4', answer: '8' }
];
const correct = async (_question, answer, value) => ({ correct: String(answer) === String(value), feedback: '' });

test('DROP4 detects horizontal, vertical and diagonal wins', () => {
  let board = Array(42).fill(null);
  for (const column of [0, 1, 2, 3]) board = dropPiece(board, column, 'X').board;
  assert.equal(hasWinner(board, 'X'), true);
  board = Array(42).fill(null);
  for (let i = 0; i < 4; i += 1) board = dropPiece(board, 2, 'O').board;
  assert.equal(hasWinner(board, 'O'), true);
  board = Array(42).fill(null);
  for (const [column, symbol] of [[0, 'X'], [1, 'O'], [1, 'X'], [2, 'O'], [2, 'O'], [2, 'X'], [3, 'O'], [3, 'O'], [3, 'O'], [3, 'X']]) board = dropPiece(board, column, symbol).board;
  assert.equal(hasWinner(board, 'X'), true);
});

test('DROP4 randomizes the starting player', () => {
  const playerStarts = createDrop4Runtime({ items, gradeAnswer: correct, random: () => 0.1 });
  const pacoStarts = createDrop4Runtime({ items, gradeAnswer: correct, random: () => 0.9 });
  assert.equal(playerStarts.start().turn, 'X');
  assert.equal(pacoStarts.start().turn, 'O');
});

test('DROP4 counts learner turns needed for a win', async () => {
  const runtime = createDrop4Runtime({ items, gradeAnswer: correct, random: () => 0 });
  runtime.start();
  runtime.selectColumn(0);
  await runtime.submitAnswer('2');
  assert.equal(runtime.snapshot().playerTurns, 1);
});

test('DROP4 cycles its randomized question deck when a game needs more turns than questions', async () => {
  const runtime = createDrop4Runtime({ items: [items[0]], gradeAnswer: correct, random: () => 0 });
  runtime.start();
  for (let turn = 0; turn < 2; turn += 1) {
    if (runtime.snapshot().turn === 'O') runtime.playPacoMove();
    runtime.selectColumn(turn);
    await runtime.submitAnswer('2');
  }
  assert.equal(runtime.snapshot().totalAnswered, 2);
  assert.equal(runtime.snapshot().uniqueAnswered, 1);
});
