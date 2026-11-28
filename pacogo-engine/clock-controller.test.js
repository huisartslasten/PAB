import test from 'node:test';
import assert from 'node:assert/strict';
import { createClockController, normalizeTime } from './clock-controller.js';

const baseTask = {
  task_id: 'CLOCK-T01',
  task_model_id: 'CLOCK.TM1',
  skill_id: 'CLOCK',
  development_id: 'CLOCK.D1',
  claim_id: 'CLOCK.C1',
  evidence_target_ids: ['CLOCK.ET1'],
  prompt_level: 'none'
};

test('clock time normalization rejects invalid values', () => {
  assert.deepEqual(normalizeTime({ hour: 8, minute: 35 }), { hour: 8, minute: 35 });
  assert.throws(() => normalizeTime({ hour: 24, minute: 0 }), /hour must be an integer/);
  assert.throws(() => normalizeTime({ hour: 8, minute: 60 }), /minute must be an integer/);
});

test('reading an analog clock requires a digital response and records the reading action', () => {
  const controller = createClockController({
    task: { ...baseTask, task_type: 'read_analog_time', variation_key: 'read_analog_time' },
    studentKey: 'synthetic-clock-read',
    targetTime: { hour: 8, minute: 35 }
  });

  assert.throws(() => controller.submit(), /No clock response has been set/);
  assert.throws(() => controller.setAnalogTime({ hour: 8, minute: 35 }), /only the response for set_analog_clock/);
  controller.setDigitalTime({ hour: 8, minute: 35 });
  const result = controller.submit();

  assert.equal(result.correct, true);
  assert.equal(result.observation.correctness, true);
  assert.equal(result.observation.response.task_type, 'read_analog_time');
  assert.equal(result.observation.response.representation, 'digital_time');
  assert.equal(result.observation.response.source_representation, 'analog_clock');
  assert.equal(result.observation.response.response_representation, 'digital_time_entry');
  assert.equal(result.observation.performance.strategy, 'read_time');
  assert.equal(result.observation.context.clock_task_type, 'read_analog_time');
  assert.ok(result.observation.interaction_events.some((event) => event.event_type === 'digital_time_set'));
  assert.ok(result.observation.interaction_events.some((event) => event.event_type === 'clock_submitted'));
  assert.equal(controller.isSubmitted(), true);
  assert.throws(() => controller.setDigitalTime({ hour: 8, minute: 35 }), /already been submitted/);
});

test('setting an analog clock requires analog manipulation and records the setting action', () => {
  const controller = createClockController({
    task: { ...baseTask, task_id: 'CLOCK-T02', task_type: 'set_analog_clock', variation_key: 'set_analog_clock' },
    studentKey: 'synthetic-clock-set',
    targetTime: { hour: 17, minute: 5 }
  });

  assert.throws(() => controller.setDigitalTime({ hour: 17, minute: 5 }), /only the response for read_analog_time/);
  controller.setAnalogTime({ hour: 17, minute: 5 });
  const result = controller.submit();

  assert.equal(result.correct, true);
  assert.equal(result.observation.response.task_type, 'set_analog_clock');
  assert.equal(result.observation.response.representation, 'analog_time');
  assert.equal(result.observation.response.source_representation, 'digital_time');
  assert.equal(result.observation.performance.strategy, 'set_time');
  assert.equal(result.observation.context.clock_mode, 'digital_to_analog');
});

test('representation matching records the selected option and whether its time is equivalent', () => {
  const controller = createClockController({
    task: {
      ...baseTask,
      task_id: 'CLOCK-T03',
      task_type: 'match_representations',
      variation_key: 'match_representations',
      options: [
        { option_id: 'option-a', time: { hour: 8, minute: 30 } },
        { option_id: 'option-b', time: { hour: 8, minute: 35 } },
        { option_id: 'option-c', time: { hour: 9, minute: 35 } }
      ]
    },
    studentKey: 'synthetic-clock-match',
    targetTime: { hour: 8, minute: 35 }
  });

  assert.throws(() => controller.submit(), /No clock response has been set/);
  assert.throws(() => controller.selectRepresentation('unknown'), /Unknown clock representation option/);
  assert.throws(() => controller.setDigitalTime({ hour: 8, minute: 35 }), /only the response for read_analog_time/);
  controller.selectRepresentation('option-b');
  const result = controller.submit();

  assert.equal(result.correct, true);
  assert.equal(result.observation.response.type, 'clock_representation_match');
  assert.equal(result.observation.response.selected_option_id, 'option-b');
  assert.equal(result.observation.response.source_representation, 'analog_clock');
  assert.equal(result.observation.response.option_representation, 'digital_time');
  assert.equal(result.observation.response.selected_time.minute, 35);
  assert.equal(result.observation.performance.strategy, 'match_representations');
  assert.ok(result.observation.interaction_events.some((event) => event.event_type === 'representation_option_selected'));
});


test('digital source matching records analog options in the observation contract', () => {
  const controller = createClockController({
    task: {
      ...baseTask,
      task_id: 'CLOCK-T05',
      task_type: 'match_representations',
      source_representation: 'digital_time',
      variation_key: 'match_representations',
      options: [
        { option_id: 'option-a', time: { hour: 8, minute: 30 } },
        { option_id: 'option-b', time: { hour: 8, minute: 35 } },
        { option_id: 'option-c', time: { hour: 9, minute: 35 } }
      ]
    },
    studentKey: 'synthetic-clock-match-reverse',
    targetTime: { hour: 8, minute: 35 },
    mode: 'match_representations'
  });
  controller.selectRepresentation('option-b');
  const result = controller.submit();

  assert.equal(result.correct, true);
  assert.equal(result.observation.response.source_representation, 'digital_time');
  assert.equal(result.observation.response.option_representation, 'analog_clock');
  assert.equal(result.observation.response.selected_option_id, 'option-b');
});

test('incorrect time reading is preserved as incorrect evidence', () => {
  const controller = createClockController({
    task: { ...baseTask, task_id: 'CLOCK-T04', task_type: 'read_analog_time', variation_key: 'read_analog_time' },
    studentKey: 'synthetic-clock-incorrect',
    targetTime: { hour: 10, minute: 30 }
  });
  controller.setDigitalTime({ hour: 10, minute: 25 });
  const result = controller.submit();

  assert.equal(result.correct, false);
  assert.equal(result.observation.quality, 1);
  assert.equal(result.observation.relevant, true);
  assert.equal(result.observation.response.selected_time.minute, 25);
});

test('clock controller rejects a task type and mode mismatch', () => {
  assert.throws(() => createClockController({
    task: { ...baseTask, task_type: 'set_analog_clock' },
    studentKey: 'synthetic-clock-mismatch',
    targetTime: { hour: 8, minute: 35 },
    mode: 'analog_to_digital'
  }), /requires mode digital_to_analog/);
});
