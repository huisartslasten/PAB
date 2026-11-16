import test from 'node:test';
import assert from 'node:assert/strict';
import { CLOCK_TASK_CONTRACTS, resolveClockTaskContract, validateClockTaskDefinition } from './clock-task-contract.js';

test('clock reading, setting and matching are distinct task contracts', () => {
  assert.deepEqual(['read_analog_time', 'set_analog_clock', 'match_representations'].map((type) => {
    const c = resolveClockTaskContract(type); return [c.pedagogicalAction, c.sourceRepresentation, c.responseRepresentation];
  }), [['read_time','analog_clock','digital_time_entry'],['set_time','digital_time','analog_clock_setting'],['match_representations','time_representation','representation_choice']]);
  assert.equal(Object.isFrozen(CLOCK_TASK_CONTRACTS.read_analog_time), true);
});
test('clock reading and setting task definitions validate', () => {
  assert.equal(validateClockTaskDefinition({task_id:'READ',task_type:'read_analog_time',target_time:{hour:8,minute:35}}).evidenceMeaning,'learner_reads_time_from_analog_representation');
  assert.equal(validateClockTaskDefinition({task_id:'SET',task_type:'set_analog_clock',target_time:{hour:17,minute:5}}).interactionType,'clock_hand_manipulation');
});
test('matching contract supports both representation directions', () => {
  const options=[{option_id:'a',time:{hour:8,minute:30}},{option_id:'b',time:{hour:8,minute:35}},{option_id:'c',time:{hour:9,minute:35}}];
  const analog=validateClockTaskDefinition({task_id:'MATCH-A',task_type:'match_representations',source_representation:'analog_clock',target_time:{hour:8,minute:35},options});
  const digital=validateClockTaskDefinition({task_id:'MATCH-D',task_type:'match_representations',source_representation:'digital_time',target_time:{hour:8,minute:35},options});
  assert.equal(analog.optionRepresentation,'digital_time');
  assert.equal(digital.optionRepresentation,'analog_clock');
});
test('matching contract rejects missing, duplicate, ambiguous and unsupported options', () => {
  const base={task_id:'MATCH',task_type:'match_representations',target_time:{hour:8,minute:35},options:[{option_id:'a',time:{hour:8,minute:35}},{option_id:'b',time:{hour:8,minute:30}}]};
  assert.throws(()=>validateClockTaskDefinition({...base,options:[base.options[0]]}),/at least two options/);
  assert.throws(()=>validateClockTaskDefinition({...base,options:[base.options[0],base.options[0]]}),/IDs must be unique/);
  assert.throws(()=>validateClockTaskDefinition({...base,source_representation:'words'}),/source_representation must be/);
  assert.throws(()=>validateClockTaskDefinition({...base,options:[{option_id:'a',time:{hour:8,minute:30}},{option_id:'b',time:{hour:8,minute:40}}]}),/exactly one option equivalent/);
});
test('clock task contracts reject invalid task types and times', () => {
  assert.throws(()=>resolveClockTaskContract('guess_time'),/Unsupported clock task type/);
  assert.throws(()=>validateClockTaskDefinition({task_id:'READ',task_type:'read_analog_time',target_time:{hour:24,minute:0}}),/target_time.hour/);
  assert.throws(()=>validateClockTaskDefinition({task_id:'READ',task_type:'read_analog_time',target_time:{hour:8,minute:35},options:[]}),/does not accept matching options/);
});
