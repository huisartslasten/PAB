import assert from 'node:assert/strict';
import { createClockLearningInterface, setClockRepresentation, setClockTime } from './clock-learning-interface.js';

let state = createClockLearningInterface({ hour: 8, minute: 35, mode: 'both' });
assert.equal(state.interface_id, 'clock');
assert.equal(state.pedagogical_state.hour, 8);
assert.equal(state.pedagogical_state.minute, 35);
assert.equal(state.visual_state.analogVisible, true);
assert.equal(state.visual_state.digitalVisible, true);

state = setClockRepresentation(state, 'digital');
assert.equal(state.pedagogical_state.representation, 'digital');
assert.equal(state.visual_state.analogVisible, false);
assert.equal(state.visual_state.digitalVisible, true);

state = setClockTime(state, 14, 5);
assert.equal(state.pedagogical_state.hour, 14);
assert.equal(state.pedagogical_state.minute, 5);

state = setClockRepresentation(state, 'analog');
assert.equal(state.visual_state.analogVisible, true);
assert.equal(state.visual_state.digitalVisible, false);

assert.throws(() => createClockLearningInterface({ hour: 24, minute: 0 }), /hour/);
assert.throws(() => setClockTime(state, 10, 60), /minute/);
assert.throws(() => setClockRepresentation(state, 'text'), /invalid clock representation/);
console.log('PacoGO Clock Learning Interface state model passed.');
