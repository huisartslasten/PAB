export function createWordTrainerState(initial = {}) {
  return {
    phase: initial.phase || 'idle',
    index: Number.isFinite(Number(initial.index)) ? Number(initial.index) : 0,
    total: Number.isFinite(Number(initial.total)) ? Number(initial.total) : 0,
    entered: String(initial.entered ?? ''),
    result: initial.result || null,
    hint: initial.hint || null
  };
}

export function setWordTrainerAnswer(state, entered = '') {
  return { ...createWordTrainerState(state), entered: String(entered ?? '') };
}
