const DEFAULT_HOOKS = Object.freeze([
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'
]);

function normalizeHookIds(ids = DEFAULT_HOOKS) {
  return [...new Set(ids)].filter((id) => /^C([1-9]|10)$/.test(id));
}

function createValidationHookState({ hookIds, evidence = [], state }) {
  const ids = normalizeHookIds(hookIds);
  return Object.freeze(Object.fromEntries(ids.map((id) => [id, {
    status: 'NOT_RUN',
    evidence_count: evidence.length,
    note: 'Validation hook available; empirical criterion is not established by runtime execution.'
  }])));
}

function evaluateValidationHooks({ hookIds, evidence = [], state, context = {} }) {
  const base = createValidationHookState({ hookIds, evidence, state });
  const configured = context.validation_hooks || {};
  const result = {};

  for (const [id, value] of Object.entries(base)) {
    const configuration = configured[id];
    result[id] = configuration
      ? { ...value, configured: true, scope: configuration.scope || null }
      : value;
  }

  return Object.freeze(result);
}

export { DEFAULT_HOOKS, normalizeHookIds, createValidationHookState, evaluateValidationHooks };
