import assert from 'node:assert/strict';
import { createLearningInterfaceContract, updateLearningInterfaceState } from './learning-interface-contract.js';

const state = createLearningInterfaceContract({
  interfaceId: 'clock',
  pedagogicalState: { representation: 'analog', hour: 8, minute: 35 },
  interactionState: { selected: false },
  visualState: { theme: 'professional' }
});

assert.equal(state.interface_id, 'clock');
assert.equal(state.pedagogical_state.representation, 'analog');
assert.equal(state.pedagogical_state.minute, 35);
assert.equal(state.interaction_state.selected, false);
assert.equal(state.visual_state.theme, 'professional');

const digital = updateLearningInterfaceState(state, {
  pedagogical_state: { representation: 'digital' },
  interaction_state: { selected: true }
});

assert.equal(digital.interface_id, 'clock');
assert.equal(digital.pedagogical_state.representation, 'digital');
assert.equal(digital.pedagogical_state.hour, 8);
assert.equal(digital.pedagogical_state.minute, 35);
assert.equal(digital.interaction_state.selected, true);
assert.equal(digital.visual_state.theme, 'professional');

assert.throws(() => createLearningInterfaceContract({ interfaceId: 'clock' }), /pedagogicalState is required/);
console.log('PacoGO Learning Interface contract passed.');
