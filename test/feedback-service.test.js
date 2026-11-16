import test from 'node:test';
import assert from 'node:assert/strict';
import { createFeedbackService } from '../src/services/feedback-service.js';

function makeDb() {
  const calls = [];
  const rows = [{ id: 1, feedback_type: 'idea', subject: 'Idee', message: 'Meer oefeningen.', status: 'new', created_at: '2026-10-11T10:00:00Z' }];

  const db = {
    calls,
    from(table) {
      assert.equal(table, 'parent_feedback');
      const state = { operation: null, payload: null, id: null };
      const query = {
        select(fields) {
          calls.push(['select', fields]);
          state.operation = 'select';
          return query;
        },
        order(field, options) {
          calls.push(['order', field, options]);
          return Promise.resolve({ data: rows.map(row => ({ ...row })), error: null });
        },
        insert(payload) {
          calls.push(['insert', payload]);
          state.operation = 'insert';
          state.payload = payload;
          return query;
        },
        update(payload) {
          calls.push(['update', payload]);
          state.operation = 'update';
          state.payload = payload;
          return query;
        },
        eq(field, value) {
          calls.push(['eq', field, value]);
          state.id = value;
          return query;
        },
        single() {
          calls.push(['single']);
          const data = {
            id: state.id || 2,
            feedback_type: state.payload?.feedback_type || 'idea',
            subject: state.payload?.subject || 'Nieuwe feedback',
            message: state.payload?.message || 'Bericht',
            status: state.payload?.status || 'new',
            created_at: '2026-10-11T11:00:00Z'
          };
          return Promise.resolve({ data, error: null });
        }
      };
      return query;
    }
  };

  return db;
}

test('feedback service owns the parent_feedback Supabase boundary', async () => {
  const db = makeDb();
  const service = createFeedbackService(db);

  const listed = await service.listAll();
  assert.equal(listed.length, 1);
  assert.equal(listed[0].subject, 'Idee');

  const created = await service.create({ feedbackType: 'bug', subject: 'Fout', message: 'Testmelding' });
  assert.equal(created.id, 2);
  assert.equal(created.feedback_type, 'bug');

  const updated = await service.updateStatus(1, 'resolved');
  assert.equal(updated.id, 1);
  assert.equal(updated.status, 'resolved');

  assert.equal(db.calls.filter(call => call[0] === 'select').length, 3);
  assert.deepEqual(db.calls.filter(call => call[0] === 'insert'), [
    ['insert', { feedback_type: 'bug', subject: 'Fout', message: 'Testmelding' }]
  ]);
  assert.deepEqual(db.calls.filter(call => call[0] === 'update'), [
    ['update', { status: 'resolved' }]
  ]);
});
