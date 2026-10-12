import test from 'node:test';
import assert from 'node:assert/strict';
import { createCreatorService } from '../src/features/creator/creator-service.js';

function makeHarness() {
  const calls = [];
  const responses = new Map();
  function query(table) {
    const state = { table, filters: [] };
    const chain = {
      select(fields) { calls.push(['select', table, fields]); return chain; },
      order(field, options) { calls.push(['order', table, field, options]); return chain; },
      insert(payload) { calls.push(['insert', table, payload]); return chain; },
      update(payload) { calls.push(['update', table, payload]); return chain; },
      delete() { calls.push(['delete', table]); return chain; },
      eq(field, value) { state.filters.push([field, value]); calls.push(['eq', table, field, value]); return chain; },
      single: async () => {
        calls.push(['single', table, state.filters]);
        return responses.get(table)?.single || { data: null, error: null };
      },
      then(resolve, reject) {
        return Promise.resolve(responses.get(table)?.list || { data: [], error: null }).then(resolve, reject);
      }
    };
    return chain;
  }
  const db = { from: table => query(table) };
  return { db, calls, responses };
}

test('creator service owns creator AI rule and note persistence', async () => {
  const harness = makeHarness();
  const rule = { id: 1, rule_text: 'Gebruik korte zinnen.', enabled: true };
  const note = { id: 2, note_type: 'idea', title: 'Test', body: 'Notitie', status: 'open', created_at: '2026-10-12T00:00:00Z' };
  harness.responses.set('creator_ai_rules', { list: { data: [rule], error: null }, single: { data: rule, error: null } });
  harness.responses.set('creator_notes', { list: { data: [note], error: null }, single: { data: note, error: null } });
  const service = createCreatorService(harness.db, { canCreate: () => true });

  assert.deepEqual(await service.listAiRules(), [rule]);
  assert.deepEqual(await service.addAiRule(' Nieuwe afspraak '), rule);
  assert.deepEqual(await service.setAiRuleEnabled(1, false), rule);
  await service.deleteAiRule(1);
  assert.deepEqual(await service.listNotes(), [note]);
  assert.deepEqual(await service.addNote({ noteType: 'idea', title: ' Test ', body: ' Notitie ' }), note);
  assert.deepEqual(await service.toggleNoteStatus(2), note);
  await service.deleteNote(2);

  assert.ok(harness.calls.some(call => call[0] === 'select' && call[1] === 'creator_ai_rules'));
  assert.ok(harness.calls.some(call => call[0] === 'insert' && call[1] === 'creator_ai_rules'));
  assert.ok(harness.calls.some(call => call[0] === 'update' && call[1] === 'creator_ai_rules'));
  assert.ok(harness.calls.some(call => call[0] === 'delete' && call[1] === 'creator_ai_rules'));
  assert.ok(harness.calls.some(call => call[0] === 'select' && call[1] === 'creator_notes'));
  assert.ok(harness.calls.some(call => call[0] === 'insert' && call[1] === 'creator_notes'));
  assert.ok(harness.calls.some(call => call[0] === 'update' && call[1] === 'creator_notes'));
  assert.ok(harness.calls.some(call => call[0] === 'delete' && call[1] === 'creator_notes'));
});

test('creator service blocks non-creator access before touching Supabase', async () => {
  const harness = makeHarness();
  const service = createCreatorService(harness.db, { canCreate: () => false });

  await assert.rejects(() => service.listAiRules(), /hoofdbeheerder/);
  await assert.rejects(() => service.addAiRule('regel'), /hoofdbeheerder/);
  await assert.rejects(() => service.listNotes(), /hoofdbeheerder/);
  await assert.rejects(() => service.addNote({ title: 'x', body: 'y' }), /hoofdbeheerder/);
  assert.deepEqual(harness.calls, []);
});
