import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLOCK_TASK_CONTRACTS,
  resolveClockTaskContract,
  validateClockTaskDefinition
} from './clock-task-contract.js';

test('clock reading, setting and representation matching are distinct task contracts', () => {
  assert.deepEqual(
    ['read_analog_time', 'set_analog_clock', 'match_representations'].map((type) => {
      const contract = resolveClockTaskContract(type);
      return [contract.pedagogicalAction, contract.sourceRepresentation, contract.responseRepresentation];
    }),
    [
      ['read_time', 'analog_clock', 'digital_time_entry'],
      ['set_time', 'digital_time', 'analog_clock_setting'],
      ['match_representations', 'time_representation', 'equivalent_representation_choice']
    ]
  );
  assert.equal(Object.isFrozen(CLOCK_TASK_CONTRACTS.read_analog_time), true);
});

test('clock reading task accepts a valid analog source time', () => {
  const contract = validateClockTaskDefinition({
    task_id: 'CLOCK-READ-01',
    task_type: 'read_analog_time',
    target_time: { hour: 8, minute: 35 }
  });
  assert.equal(contract.evidenceMeaning, 'learner_reads_time_from_analog_representation');
});

test('clock setting task accepts a valid digital source time', () => {
  const contract = validateClockTaskDefinition({
    task_id: 'CLOCK-SET-01',
    task_type: 'set_analog_clock',
    target_time: { hour: 17, minute: 5 }
  });
  assert.equal(contract.interactionType, 'clock_hand_manipulation');
});

test('representation matching requires unique options and exactly one equivalent time', () => {
  const contract = validateClockTaskDefinition({
    task_id: 'CLOCK-MATCH-01',
    task_type: 'match_representations',
    target_time: { hour: 8, minute: 35 },
    options: [
      { option_id: 'a', time: { hour: 8, minute: 30 } },
      { option_id: 'b', time: { hour: 8, minute: 35 } },
      { option_id: 'c', time: { hour: 9, minute: 35 } }
    ]
  });
  assert.equal(contract.interactionType, 'representation_selection');
});

test('representation matching rejects missing, duplicate or ambiguous correct options', () => {
  const base = {
    task_id: 'CLOCK-MATCH-02',
    task_type: 'match_representations',
    target_time: { hour: 8, minute: 35 },
    options: [
      { option_id: 'a', time: { hour: 8, minute: 35 } },
      { option_id: 'b', time: { hour: 8, minute: 30 } }
    ]
  };
  assert.throws(() => validateClockTaskDefinition({ ...base, options: [base.options[0]] }), /at least two options/);
  assert.throws(() => validateClockTaskDefinition({ ...base, options: [base.options[0], base.options[0]] }), /IDs must be unique/);
  assert.throws(() => validateClockTaskDefinition({
    ...base,
    options: [...base.options, { option_id: 'c', time: { hour: 8, minute: 35 } }]
  }), /exactly one option equivalent/);
  assert.throws(() => validateClockTaskDefinition({
    ...base,
    options: [
      { option_id: 'a', time: { hour: 8, minute: 30 } },
      { option_id: 'b', time: { hour: 8, minute: 40 } }
    ]
  }), /exactly one option equivalent/);
});

test('clock task contracts reject invalid task types and times', () => {
  assert.throws(() => resolveClockTaskContract('guess_time'), /Unsupported clock task type/);
  assert.throws(() => validateClockTaskDefinition({
    task_id: 'CLOCK-READ-02',
    task_type: 'read_analog_time',
    target_time: { hour: 24, minute: 0 }
  }), /target_time.hour/);
  assert.throws(() => validateClockTaskDefinition({
    task_id: 'CLOCK-READ-03',
    task_type: 'read_analog_time',
    target_time: { hour: 8, minute: 35 },
    options: []
  }), /does not accept matching options/);
});
