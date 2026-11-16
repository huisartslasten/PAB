import test from 'node:test';
import assert from 'node:assert/strict';
import { createMasteryService } from '../src/services/mastery-service.js';

function createStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
}

test('mastery starts unmastered and records a three-answer streak', () => {
  const mastery = createMasteryService({ storage: createStorage() });
  assert.deepEqual(mastery.get('Zyon', 1, 2), { streak: 0, mastered: false });

  mastery.record('Zyon', 1, 2, true);
  mastery.record('Zyon', 1, 2, true);
  const result = mastery.record('Zyon', 1, 2, true);

  assert.deepEqual(result, { streak: 3, mastered: true });
});

test('a wrong answer resets the streak', () => {
  const mastery = createMasteryService({ storage: createStorage() });
  mastery.record('Zyon', 1, 2, true);
  mastery.record('Zyon', 1, 2, true);
  assert.deepEqual(mastery.record('Zyon', 1, 2, false), { streak: 0, mastered: false });
});
