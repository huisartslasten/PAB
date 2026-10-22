import { describe, expect, it } from 'vitest';
import { applyMove, createTicTacToeRuntime } from '../src/features/practice/tic-tac-toe/runtime.js';

const items = [
  { question: '1 + 1', answer: '2' },
  { question: '2 + 2', answer: '4' },
  { question: '3 + 3', answer: '6' },
  { question: '4 + 4', answer: '8' }
];

function grader(question, answer, value) {
  return Promise.resolve({ correct: String(value).trim() === String(answer).trim(), feedback: '' });
}

describe('Tic-Tac-Toe runtime', () => {
  it('keeps the chosen square empty after a wrong answer and gives Paco the turn', async () => {
    const game = createTicTacToeRuntime({ items, gradeAnswer: grader, random: () => 0.9 });
    game.start({ gameMode: 'classic', level: 'rookie' });
    game.selectCell(0);
    const state = await game.submitAnswer('wrong');

    expect(state.board[0]).toBeNull();
    expect(state.phase).toBe('paco');
    expect(state.turn).toBe('O');
    expect(state.uniqueAnswered).toBe(1);
  });

  it('places X after a correct answer', async () => {
    const game = createTicTacToeRuntime({ items, gradeAnswer: grader, random: () => 0.9 });
    game.start({ gameMode: 'classic', level: 'rookie' });

    game.selectCell(0);
    const state = await game.submitAnswer('2');

    expect(state.board[0]).toMatchObject({ symbol: 'X' });
    expect(state.phase).toBe('paco');
    expect(state.turn).toBe('O');
  });

  it('removes the oldest own piece in infinite mode on the fourth own move', () => {
    let board = Array(9).fill(null);
    board = applyMove(board, 'X', 0, 'infinite', 1);
    board = applyMove(board, 'X', 1, 'infinite', 2);
    board = applyMove(board, 'X', 2, 'infinite', 3);
    board = applyMove(board, 'X', 3, 'infinite', 4);

    expect(board[0]).toBeNull();
    expect(board[1]?.symbol).toBe('X');
    expect(board[2]?.symbol).toBe('X');
    expect(board[3]?.symbol).toBe('X');
  });

  it('can randomly let Paco start a new game', () => {
    const game = createTicTacToeRuntime({ items, gradeAnswer: grader, random: () => 0.9 });
    const state = game.start({ gameMode: 'classic', level: 'rookie' });

    expect(state.turn).toBe('O');
    expect(state.phase).toBe('paco');
  });

  it('shuffles the question order instead of always using the first lesson item', () => {
    const game = createTicTacToeRuntime({ items, gradeAnswer: grader, random: () => 0 });
    game.start({ gameMode: 'classic', level: 'rookie' });
    const state = game.selectCell(0);

    expect(state.item?.question).toBe('2 + 2');
  });
});
