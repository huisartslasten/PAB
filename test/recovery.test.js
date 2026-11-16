import test from 'node:test';
import assert from 'node:assert/strict';
import { createLessonRecovery } from '../src/features/lessons/recovery.js';

test('recovery delegates archive, trash and restore to the canonical service', async () => {
  const calls = [];
  const service = {
    archive: async id => calls.push(['archive', id]),
    moveToTrash: async id => calls.push(['trash', id]),
    restore: async id => calls.push(['restore', id])
  };
  let refreshed = 0;
  const recovery = createLessonRecovery({ lessonService: service, refresh: async () => { refreshed += 1; } });
  await recovery.archive(1);
  await recovery.trash(2);
  await recovery.restore(3);
  assert.deepEqual(calls, [['archive',1],['trash',2],['restore',3]]);
  assert.equal(refreshed, 3);
});
