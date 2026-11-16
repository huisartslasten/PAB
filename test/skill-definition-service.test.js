import { describe, expect, it, vi } from 'vitest';
import { createSkillDefinitionService } from '../src/services/skill-definition-service.js';

function createDb({ rows = [] } = {}) {
  const state = { rows: rows.map(row => ({ ...row })) };
  const makeQuery = (mode = 'select') => {
    const query = {
      eq: vi.fn((field, value) => { query.filters.push(['eq', field, value]); return query; }),
      is: vi.fn((field, value) => { query.filters.push(['is', field, value]); return query; }),
      not: vi.fn((field, operator, value) => { query.filters.push(['not', field, operator, value]); return query; }),
      order: vi.fn(() => query),
      update: vi.fn(payload => { query.mode = 'update'; query.payload = payload; return query; }),
      delete: vi.fn(() => { query.mode = 'delete'; return query; }),
      select: vi.fn(() => query),
      upsert: vi.fn(payload => { query.mode = 'upsert'; query.payload = payload; return query; }),
      maybeSingle: vi.fn(async () => ({ data: state.rows.find(row => query.filters.every(filter => filter[0] !== 'eq' || row[filter[1]] === filter[2])) || null, error: null })),
      single: vi.fn(async () => ({ data: state.rows[0] || null, error: null }))
    };
    query.filters = [];
    return query;
  };
  return {
    from: vi.fn(() => makeQuery()),
    state
  };
}

describe('skill-definition-service', () => {
  it('normalizes archive and trash lifecycle fields', async () => {
    const db = createDb({ rows: [{ id: 'math-1', category: 'math', title: 'Optellen', description: '', definition: { kind: 'math' }, enabled: true, sort_order: 10, archived_at: null, trashed_at: null }] });
    const service = createSkillDefinitionService(db, { canConfigure: () => true });
    const skill = await service.get('math-1');
    expect(skill.archivedAt).toBeNull();
    expect(skill.trashedAt).toBeNull();
  });

  it('exposes canonical archive, trash and permanent delete operations', () => {
    const db = createDb();
    const service = createSkillDefinitionService(db, { canConfigure: () => true });
    expect(service).toEqual(expect.objectContaining({
      list: expect.any(Function),
      listRecovery: expect.any(Function),
      save: expect.any(Function),
      archive: expect.any(Function),
      restoreFromArchive: expect.any(Function),
      moveToTrash: expect.any(Function),
      restoreFromTrash: expect.any(Function),
      permanentlyDelete: expect.any(Function)
    }));
  });
});
