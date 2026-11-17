import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createSkillConfigurationService } from '../src/services/skill-configuration-service.js';

function createDb(t) {
  const query = {
    filters: [],
    eq: t.mock.fn((field, value) => { query.filters.push([field, value]); return query; }),
    order: t.mock.fn(() => query),
    upsert: t.mock.fn(payload => { query.payload = payload; return query; }),
    select: t.mock.fn(() => query)
  };
  query.upsertResult = { data: [{ id: 101, student: 'Zephon', skill_id: 'math-test', enabled: true, settings: {}, updated_at: '2026-10-25T00:00:00Z', created_at: '2026-10-25T00:00:00Z' }], error: null };
  query.then = resolve => resolve(query.upsertResult);
  return { from: t.mock.fn(() => query), query };
}

function assertObjectContaining(actual, expected) {
  for (const [key, value] of Object.entries(expected)) {
    assert.deepStrictEqual(actual[key], value, `Expected property "${key}" to match`);
  }
}

describe('skill-configuration-service', () => {
  it('persists a newly created Skill as enabled for the selected learner', async t => {
    const { from, query } = createDb(t);
    const service = createSkillConfigurationService({ from }, { canConfigure: () => true });

    const saved = await service.saveForStudent('Zephon', [{ skillId: 'math-test', enabled: true }]);

    assert.equal(query.payload.length, 1);
    assertObjectContaining(query.payload[0], {
      student: 'Zephon',
      skill_id: 'math-test',
      enabled: true,
      settings: {}
    });
    assertObjectContaining(saved[0], { student: 'Zephon', skillId: 'math-test', enabled: true });
  });
});
