import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createSkillDefinitionService } from '../src/services/skill-definition-service.js';

function createDb({ rows = [] } = {}, t) {
  const state = { rows: rows.map(row => ({ ...row })) };
  const makeQuery = () => {
    const query = {
      eq: t.mock.fn((field, value) => { query.filters.push(['eq', field, value]); return query; }),
      is: t.mock.fn((field, value) => { query.filters.push(['is', field, value]); return query; }),
      not: t.mock.fn((field, operator, value) => { query.filters.push(['not', field, operator, value]); return query; }),
      order: t.mock.fn(() => query),
      update: t.mock.fn(payload => { query.mode = 'update'; query.payload = payload; return query; }),
      delete: t.mock.fn(() => { query.mode = 'delete'; return query; }),
      select: t.mock.fn(() => query),
      upsert: t.mock.fn(payload => { query.mode = 'upsert'; query.payload = payload; return query; }),
      maybeSingle: t.mock.fn(async () => ({ data: state.rows.find(row => query.filters.every(filter => filter[0] !== 'eq' || row[filter[1]] === filter[2])) || null, error: null })),
      single: t.mock.fn(async () => ({ data: state.rows[0] || null, error: null }))
    };
    query.filters = [];
    return query;
  };
  return {
    from: t.mock.fn(() => makeQuery()),
    state
  };
}

describe('skill-definition-service', () => {
  it('normalizes archive and trash lifecycle fields', async t => {
    const db = createDb({ rows: [{ id: 'math-1', category: 'math', title: 'Optellen', description: '', definition: { kind: 'math' }, enabled: true, sort_order: 10, archived_at: null, trashed_at: null }] }, t);
    const service = createSkillDefinitionService(db, { canConfigure: () => true });
    const skill = await service.get('math-1');

    assert.equal(skill.archivedAt, null);
    assert.equal(skill.trashedAt, null);
  });

  it('exposes canonical archive, trash and permanent delete operations', t => {
    const db = createDb({}, t);
    const service = createSkillDefinitionService(db, { canConfigure: () => true });

    for (const method of ['list', 'listRecovery', 'save', 'archive', 'restoreFromArchive', 'moveToTrash', 'restoreFromTrash', 'permanentlyDelete']) {
      assert.equal(typeof service[method], 'function', `Expected service.${method} to be a function`);
    }
  });
});
