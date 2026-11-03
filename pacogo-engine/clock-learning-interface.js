import { createLearningInterfaceContract, updateLearningInterfaceState } from './learning-interface-contract.js';

function createClockLearningInterface({ hour, minute = 0, mode = 'analog' }) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError('hour must be an integer from 0 to 23');
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new RangeError('minute must be an integer from 0 to 59');
  if (!['analog', 'digital', 'both'].includes(mode)) throw new Error('mode must be analog, digital or both');

  return createLearningInterfaceContract({
    interfaceId: 'clock',
    pedagogicalState: { hour, minute, representation: mode },
    interactionState: { selectedRepresentation: mode },
    visualState: { analogVisible: mode !== 'digital', digitalVisible: mode !== 'analog' }
  });
}

function setClockRepresentation(state, representation) {
  if (!['analog', 'digital', 'both'].includes(representation)) throw new Error('invalid clock representation');
  return updateLearningInterfaceState(state, {
    pedagogical_state: { representation },
    interaction_state: { selectedRepresentation: representation },
    visual_state: { analogVisible: representation !== 'digital', digitalVisible: representation !== 'analog' }
  });
}

function setClockTime(state, hour, minute) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError('hour must be an integer from 0 to 23');
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new RangeError('minute must be an integer from 0 to 59');
  return updateLearningInterfaceState(state, {
    pedagogical_state: { hour, minute }
  });
}

export { createClockLearningInterface, setClockRepresentation, setClockTime };
