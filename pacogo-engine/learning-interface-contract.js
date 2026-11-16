function createLearningInterfaceContract({ interfaceId, version = '0.1', pedagogicalState, interactionState = {}, visualState = {} }) {
  if (!interfaceId || typeof interfaceId !== 'string') throw new TypeError('interfaceId is required');
  if (!pedagogicalState || typeof pedagogicalState !== 'object') throw new TypeError('pedagogicalState is required');
  return Object.freeze({
    interface_id: interfaceId,
    version,
    pedagogical_state: Object.freeze({ ...pedagogicalState }),
    interaction_state: Object.freeze({ ...interactionState }),
    visual_state: Object.freeze({ ...visualState })
  });
}

function updateLearningInterfaceState(current, patch = {}) {
  if (!current || typeof current !== 'object') throw new TypeError('current interface state is required');
  return createLearningInterfaceContract({
    interfaceId: current.interface_id,
    version: current.version,
    pedagogicalState: { ...current.pedagogical_state, ...(patch.pedagogical_state || {}) },
    interactionState: { ...current.interaction_state, ...(patch.interaction_state || {}) },
    visualState: { ...current.visual_state, ...(patch.visual_state || {}) }
  });
}

export { createLearningInterfaceContract, updateLearningInterfaceState };
