export function createActivityState(initial = {}) {
  return {
    mode: initial.mode || 'practice',
    index: Number(initial.index) || 0,
    answers: Array.isArray(initial.answers) ? [...initial.answers] : [],
    status: initial.status || 'idle',
    result: initial.result ?? null
  };
}

export function updateActivityState(state, patch = {}) {
  return {
    ...state,
    ...patch,
    index: patch.index == null ? state.index : Math.max(0, Number(patch.index) || 0)
  };
}
