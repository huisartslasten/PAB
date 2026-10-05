export function createAgendaImportModel({ source = 'AI agenda-import', student = '' } = {}) {
  let status = 'idle';
  let candidates = [];
  let error = null;

  function start() {
    status = 'analyzing';
    candidates = [];
    error = null;
    return snapshot();
  }
  function complete(items = []) {
    status = 'review';
    candidates = Array.isArray(items) ? [...items] : [];
    error = null;
    return snapshot();
  }
  function fail(value) {
    status = 'error';
    error = value instanceof Error ? value.message : String(value || 'Agenda import mislukt.');
    return snapshot();
  }
  function reset() {
    status = 'idle'; candidates = []; error = null;
    return snapshot();
  }
  function snapshot() {
    return Object.freeze({ status, candidates: [...candidates], error, source, student });
  }

  return Object.freeze({ start, complete, fail, reset, snapshot });
}
