export function createAgendaImportState(initial = {}) {
  return {
    status: initial.status || 'idle',
    progress: Number(initial.progress) || 0,
    frameResults: Array.isArray(initial.frameResults) ? [...initial.frameResults] : [],
    candidates: Array.isArray(initial.candidates) ? [...initial.candidates] : [],
    error: initial.error || null
  };
}

export function updateAgendaImportState(state, patch = {}) {
  return {
    ...state,
    ...patch,
    progress: patch.progress == null ? state.progress : Number(patch.progress) || 0
  };
}
