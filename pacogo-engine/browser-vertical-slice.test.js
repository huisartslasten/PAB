import assert from 'node:assert/strict';
import test from 'node:test';
import { createBrowserVerticalSliceRuntime } from './browser-vertical-slice.js';

test('browser vertical slice resolves tasks and delegates observations to registry', () => {
  const calls = [];
  const registry = {
    runSkillCycle(input) {
      calls.push(input);
      return { ok: true };
    }
  };
  const taskSet = {
    tasks: [
      { task_id: 'A1-T01', skill_id: 'A1-D1' },
      { task_id: 'B1-T01', skill_id: 'B1-D1' }
    ]
  };

  const runtime = createBrowserVerticalSliceRuntime({ registry, taskSet });
  assert.deepEqual(runtime.getTask('A1-T01'), taskSet.tasks[0]);
  assert.throws(() => runtime.getTask('missing'), /task not found/);

  const observation = {
    student_key: 'student-1',
    skill_id: 'A1-D1',
    observed_at: '2026-11-03T10:00:00Z',
    performance: { correct: true }
  };
  const result = runtime.runObservation({
    observation,
    priorEvidence: ['prior'],
    state: { status: 'NOT_ASSESSED' },
    priorState: { status: 'INSUFFICIENT_EVIDENCE' }
  });

  assert.deepEqual(result, { ok: true });
  assert.deepEqual(calls, [{
    studentKey: 'student-1',
    skillId: 'A1-D1',
    observation,
    priorEvidence: ['prior'],
    state: { status: 'NOT_ASSESSED' },
    priorState: { status: 'INSUFFICIENT_EVIDENCE' },
    asOf: '2026-11-03T10:00:00Z'
  }]);
});

test('browser vertical slice rejects invalid task sets and observations', () => {
  assert.throws(
    () => createBrowserVerticalSliceRuntime({ registry: {}, taskSet: { tasks: [] } }),
    /registry with runSkillCycle is required/
  );

  const registry = { runSkillCycle() {} };
  assert.throws(
    () => createBrowserVerticalSliceRuntime({ registry, taskSet: {} }),
    /taskSet with tasks is required/
  );
  assert.throws(
    () => createBrowserVerticalSliceRuntime({ registry, taskSet: { tasks: [{ task_id: 'A1-T01' }, { task_id: 'A1-T01' }] } }),
    /duplicate task id/
  );

  const runtime = createBrowserVerticalSliceRuntime({ registry, taskSet: { tasks: [] } });
  assert.throws(() => runtime.runObservation({}), /observation is required/);
  assert.throws(
    () => runtime.runObservation({ observation: { skill_id: 'A1-D1', observed_at: 'now' } }),
    /observation.student_key is required/
  );
  assert.throws(
    () => runtime.runObservation({ observation: { student_key: 'student-1', observed_at: 'now' } }),
    /observation.skill_id is required/
  );
  assert.throws(
    () => runtime.runObservation({ observation: { student_key: 'student-1', skill_id: 'A1-D1' } }),
    /observation.observed_at is required/
  );
});
