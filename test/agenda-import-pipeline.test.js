import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAgendaFrameTimes, createAgendaImportPipeline } from '../src/features/agenda/import-pipeline.js';

test('calculateAgendaFrameTimes creates evenly spaced bounded samples', () => {
  const times = calculateAgendaFrameTimes(10, 5);
  assert.deepEqual(times, [0, 2.5, 5, 7.5, 10]);
});

test('calculateAgendaFrameTimes handles invalid duration safely', () => {
  assert.deepEqual(calculateAgendaFrameTimes(0, 30), [0]);
  assert.deepEqual(calculateAgendaFrameTimes(-1, 30), [0]);
});

test('agenda import pipeline analyzes frames and converts results to review candidates', async () => {
  const calls = [];
  const pipeline = createAgendaImportPipeline({
    student: 'Zyon',
    now: '2026-10-05T12:00:00.000Z',
    analyzeFrame: async frame => {
      calls.push(frame);
      return frame.result;
    }
  });
  const result = await pipeline.run({
    frames: [
      { result: { date: '2026-11-06', title: 'Topografie' } },
      { result: null },
      { result: { date: '2026-11-11', title: 'Maatschappijleer', type: 'test' } }
    ]
  });
  assert.equal(calls.length, 3);
  assert.equal(result.frameResults.length, 2);
  assert.equal(result.candidates.length, 2);
  assert.equal(result.candidates[0].student, 'Zyon');
  assert.equal(result.candidates[1].type, 'test');
});

test('agenda import pipeline can refine transition results without changing initial results', async () => {
  const pipeline = createAgendaImportPipeline({
    analyzeFrame: async frame => frame,
    refineTransition: async result => [{ date: result.date, title: 'Refined' }]
  });
  const result = await pipeline.run({
    frames: [{ date: '2026-11-06', title: 'Topografie', transition: true }]
  });
  assert.equal(result.frameResults.length, 2);
  assert.equal(result.candidates[1].title, 'Refined');
});
