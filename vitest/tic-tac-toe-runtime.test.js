import { describe, expect, it } from 'vitest';
import { createTicTacToeRuntime } from '../src/features/practice/tic-tac-toe/runtime.js';

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
    const game = createTicTacToeRuntime({ items, gradeAnswer: grader });
    game.start({ gameMode: 'classic', level: 'rookie' });
    game.selectCell(0);
    const state = await game.submitAnswer('wrong');

    expect(state.board[0]).toBeNull();
    expect(state.phase).toBe('paco');
    expect(state.turn).toBe('O');
    expect(state.uniqueAnswered).toBe(1);
  });

  it('places X after a correct answer and supports repeated games until all unique questions are answered', async () => {
    const game = createTicTacToeRuntime({ items, gradeAnswer: grader });
    game.start({ gameMode: 'classic', level: 'rookie' });

    game.selectCell(0);
    let state = await game.submitAnswer('2');
    expect(state.board[0]).toMatchObject({ symbol: 'X' });
    expect(state.phase).toBe('paco');

    game.playPacoMove();
    state = game.snapshot();
    expect(state.turn).toBe('X');
    expect(state.uniqueAnswered).toBe(1);
  });

  it('removes the oldest own piece in infinite mode on the fourth own move', async () => {
    const game = createTicTacToeRuntime({ items: [{ question: 'q', answer: 'a' }], gradeAnswer: grader });
    game.start({ gameMode: 'infinite', level: 'rookie' });

    const state = game.snapshot();
    expect(state.mode).toBe('infinite');
    expect(state.board.every(cell => cell === null)).toBe(true);
  });
});
