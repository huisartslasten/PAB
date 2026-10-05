import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonPlayerState } from '../src/features/lessons/player-state.js';

test('player starts at first item and exposes total', () => {
  const player = createLessonPlayerState([{ id: 1 }, { id: 2 }]);
  assert.equal(player.index, 0);
  assert.deepEqual(player.currentItem, { id: 1 });
  assert.equal(player.total, 2);
});

test('player reveal and next reset transient answer state', () => {
  const player = createLessonPlayerState([{ id: 1 }, { id: 2 }]);
  player.setAnswer('antwoord');
  player.reveal();
  assert.equal(player.revealed, true);
  player.next();
  assert.equal(player.index, 1);
  assert.equal(player.answer, '');
  assert.equal(player.revealed, false);
});

test('player mode is limited to practice or test', () => {
  const player = createLessonPlayerState([]);
  player.setMode('test');
  assert.equal(player.mode, 'test');
  player.setMode('something-else');
  assert.equal(player.mode, 'practice');
});
