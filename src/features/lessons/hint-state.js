export function createHintState(initial = {}) {
  return {
    requested: Boolean(initial.requested),
    visible: Boolean(initial.visible),
    text: String(initial.text || '').trim()
  };
}

export function requestHint(state, text = '') {
  return {
    ...createHintState(state),
    requested: true,
    visible: Boolean(String(text || '').trim()),
    text: String(text || '').trim()
  };
}

export function clearHint() {
  return createHintState();
}
