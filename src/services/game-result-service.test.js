import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameResultService } from './game-result-service.js';

function createQuery({ data = null, error = null, filters = [] } = {}) {
  const query = {
    filters,
    insertPayload: null,
    select() { return query; },
    eq(column, value) {
      query.filters.push(['eq', column, value]);
      return query;
    },
    is(column, value) {
      query.filters.push(['is', column, value]);
      return query;
    },
    order(column, options) {
      query.filters.push(['order', column, options]);
      return query;
    },
    limit(value) {
      query.filters.push(['limit', value]);
      return query;
    },
    maybeSingle: async () => ({ data, error }),
    insert(payload) {
      query.insertPayload = payload;
      return Promise.resolve({ error });
    }
  };
  return query;
}

test('game results can be saved without a lesson scope', async () => {
  const resultQuery = createQuery();
  const db = {
    from(table) {
      if (table === 'games') return createQuery({ data: { id: 7, score_direction: 'high' } });
      return resultQuery;
    }
  };

  const service = createGameResultService(db);
  const score = await service.saveResult({
    gameKey: 'math-skill-addition',
    student: 'Paco',
    score: 8
  });

  assert.equal(score, 8);
  assert.deepEqual(resultQuery.insertPayload, {
    game_id: 7,
    lesson_id: null,
    student: 'Paco',
    score: 8
  });
});

test('independent game results read with null lesson scope', async () => {
  const resultQuery = createQuery({ data: { score: 12 } });
  const db = {
    from(table) {
      if (table === 'games') return createQuery({ data: { id: 7, score_direction: 'high' } });
      return resultQuery;
    }
  };

  const service = createGameResultService(db);
  const score = await service.getHighScore({
    gameKey: 'math-skill-addition',
    student: 'Paco'
  });

  assert.equal(score, 12);
  assert.ok(resultQuery.filters.some(([operator, column, value]) =>
    operator === 'is' && column === 'lesson_id' && value === null
  ));
});

test('lesson-scoped game results still accept a lesson id', async () => {
  const resultQuery = createQuery({ data: { score: 4 } });
  const db = {
    from(table) {
      if (table === 'games') return createQuery({ data: { id: 9, score_direction: 'high' } });
      return resultQuery;
    }
  };

  const service = createGameResultService(db);
  const score = await service.getHighScore({
    gameKey: 'double_or_nothing',
    lessonId: 42,
    student: 'Paco'
  });

  assert.equal(score, 4);
  assert.ok(resultQuery.filters.some(([operator, column, value]) =>
    operator === 'eq' && column === 'lesson_id' && value === 42
  ));
});
