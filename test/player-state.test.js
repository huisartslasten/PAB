import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonPlayerState } from '../src/features/lessons/player-state.js';

test('player starts at first item and supports mode, answer and reveal state', () => {
  const player = createLessonPlayerState([{ id: 1 }, { id: 2 }]);
  assert.equal(player.index, 0);
  assert.deepEqual(player.currentItem, { id: 1 });
  player.setMode('test');
  player.setAnswer('antwoord');
  player.reveal();
  assert.equal(player.mode, 'test');
  assert.equal(player.answer, 'antwoord');
  assert.equal(player.revealed, true);
});

test('player next resets answer and reveal state', () => {
  const player = createLessonPlayerState([{ id: 1 }, { id: 2 }]);
  player.setAnswer('x');
  player.reveal();
  assert.deepEqual(player.next(), { id: 2 });
  assert.equal(player.index, 1);
  assert.equal(player.answer, '');
  assert.equal(player.revealed, false);
});
