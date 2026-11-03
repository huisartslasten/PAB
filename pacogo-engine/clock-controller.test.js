import assert from 'node:assert/strict';
import { createClockController, normalizeTime } from './clock-controller.js';

assert.deepEqual(normalizeTime({ hour: 8, minute: 35 }), { hour: 8, minute: 35 });
assert.throws(() => normalizeTime({ hour: 24, minute: 0 }), /hour must be an integer/);
assert.throws(() => normalizeTime({ hour: 8, minute: 60 }), /minute must be an integer/);

const task = {
  task_id: 'CLOCK-T01',
  task_model_id: 'CLOCK.TM1',
  skill_id: 'CLOCK',
  development_id: 'CLOCK.D1',
  claim_id: 'CLOCK.C1',
  evidence_target_ids: ['CLOCK.ET1'],
  variation_key: 'analog_to_digital',
  prompt_level: 'none'
};

const analogController = createClockController({
  task,
  studentKey: 'synthetic-clock-1',
  targetTime: { hour: 8, minute: 35 },
  mode: 'analog_to_digital'
});

assert.throws(() => analogController.submit(), /No clock time has been set/);
analogController.setAnalogTime({ hour: 8, minute: 35 });
const analogResult = analogController.submit();
assert.equal(analogResult.correct, true);
assert.equal(analogResult.observation.correctness, true);
assert.equal(analogResult.observation.response.representation, 'analog_time');
assert.equal(analogResult.observation.performance.representation, 'analog_time');
assert.equal(analogResult.observation.context.clock_mode, 'analog_to_digital');
assert.ok(analogResult.observation.interaction_events.some((event) => event.event_type === 'task_presented'));
assert.ok(analogResult.observation.interaction_events.some((event) => event.event_type === 'analog_time_set'));
assert.ok(analogResult.observation.interaction_events.some((event) => event.event_type === 'clock_submitted'));
assert.equal(analogController.isSubmitted(), true);
assert.throws(() => analogController.setAnalogTime({ hour: 8, minute: 35 }), /already been submitted/);

const digitalController = createClockController({
  task: { ...task, task_id: 'CLOCK-T02', variation_key: 'digital_to_analog' },
  studentKey: 'synthetic-clock-2',
  targetTime: { hour: 17, minute: 5 },
  mode: 'digital_to_analog'
});
digitalController.setDigitalTime({ hour: 17, minute: 5 });
const digitalResult = digitalController.submit();
assert.equal(digitalResult.correct, true);
assert.equal(digitalResult.observation.response.representation, 'digital_time');
assert.equal(digitalResult.observation.response.selected_time.minute, 5);

const incorrectController = createClockController({
  task: { ...task, task_id: 'CLOCK-T03', variation_key: 'time_reading' },
  studentKey: 'synthetic-clock-3',
  targetTime: { hour: 10, minute: 30 },
  mode: 'analog_reading'
});
incorrectController.setAnalogTime({ hour: 10, minute: 25 });
const incorrectResult = incorrectController.submit();
assert.equal(incorrectResult.correct, false);
assert.equal(incorrectResult.observation.quality, 1);
assert.equal(incorrectResult.observation.relevant, true);

console.log('PacoGO clock controller passed.');
