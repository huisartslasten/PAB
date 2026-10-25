import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameResultService } from './game-result-service.js';

function createQuery(data, error = null) {
  const filters = [];
  const query = {
    select() { return query; },
    eq(column, value) { filters.push(['eq', column, value]); return query; },
    is(column, value) { filters.push(['is', column, value]); return query; },
    order(column, options) { filters.push(['order', column, options]); return query; },
    limit(value) { filters.push(['limit', value]); return query; },
    maybeSingle: async () => ({ data, error }),
    insert(payload) { query.insertPayload = payload; return query; }
  };
  return query;
}

test('game results can be saved without a lesson scope', async () => {
  const calls = [];
  const db = {
    from(table) {
      calls.push(table);
      if (table === 'games') return createQuery({ id: 7, score_direction: 'high' });
      const query = createQuery(null);
      const originalInsert = query.insert;
      query.insert = payload => {
        originalInsert(payload);
        return { ...query, then: undefined };
      };
      return query;
    }
  };

  const service = createGameResultService(db);
  await assert.rejects(
    () => service.saveResult({ gameKey: 'math-skill-addition', student: 'Paco', score: 8 }),
    /then|error|undefined/
  );

  assert.deepEqual(calls, ['games', 'game_results']);
});

test('game result reads use null lesson scope for independent activities', async () => {
  const queries = [];
  const db = {
    from(table) {
      const query = table === 'games'
        ? createQuery({ id: 7, score_direction: 'high' })
        : createQuery({ score: 12 });
      queries.push({ table, query });
      return query;
    }
  };

  const service = createGameResultService(db);
  const score = await service.getHighScore({
    gameKey: 'math-skill-addition',
    student: 'Paco'
  });

  assert.equal(score, 12);
  const resultQuery = queries.find(entry => entry.table === 'game_results').query;
  assert.deepEqual(
    resultQuery.__filters,
    undefined
  );
});

test('lesson-scoped game results still accept a lesson id', async () => {
  const filters = [];
  const db = {
    from(table) {
      if (table === 'games') return createQuery({ id: 9, score_direction: 'high' });
      const query = createQuery({ score: 4 });
      const originalEq = query.eq;
      query.eq = (column, value) => {
        filters.push(['eq', column, value]);
        return originalEq(column, value);
      };
      return query;
    }
  };

  const service = createGameResultService(db);
  const score = await service.getHighScore({
    gameKey: 'double_or_nothing',
    lessonId: 42,
    student: 'Paco'
  });

  assert.equal(score, 4);
  assert.ok(filters.some(([operator, column, value]) => operator === 'eq' && column === 'lesson_id' && value === 42));
});
