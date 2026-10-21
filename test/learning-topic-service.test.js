import test from 'node:test';
import assert from 'node:assert/strict';
import { createLearningTopicService } from '../src/services/learning-topic-service.js';

function mockDb(resultData = { id: 12, student: 'Zyon', subject: 'Nederlands', subvak: 'Boekbespreking', archived: false, deleted: false }) {
  const calls = [];
  return {
    calls,
    from(table) {
      calls.push({ op: 'from', table });
      return {
        upsert(payload, options) {
          calls.push({ op: 'upsert', payload, options });
          return {
            select(selection) {
              calls.push({ op: 'select', selection });
              return {
                single() { return Promise.resolve({ data: resultData, error: null }); }
              };
            }
          };
        }
      };
    }
  };
}

test('saving a learning topic always reactivates its canonical topic record', async () => {
  const db = mockDb();
  const service = createLearningTopicService(db, { canManage: () => true });

  await service.ensureTopic({ student: ' Zyon ', subject: ' Nederlands ', subvak: ' Boekbespreking ' });

  const upsert = db.calls.find(call => call.op === 'upsert');
  assert.deepEqual(upsert.payload, {
    student: 'Zyon',
    subject: 'Nederlands',
    subvak: 'Boekbespreking',
    archived: false,
    deleted: false
  });
  assert.deepEqual(upsert.options, { onConflict: 'student,subject,subvak' });
});
