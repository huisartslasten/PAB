function normalizeElementDefinition(definition) {
  if (!definition || typeof definition !== 'object') {
    throw new TypeError('Editor element definition must be an object.');
  }
  const type = String(definition.type || '').trim();
  if (!type) throw new TypeError('Editor element definition requires a type.');
  if (typeof definition.create !== 'function') throw new TypeError(`Editor element "${type}" requires create().`);
  return Object.freeze({ ...definition, type });
}

export function createEditorElementRegistry(definitions = []) {
  const entries = new Map();
  for (const definition of definitions) register(definition);

  function register(definition) {
    const entry = normalizeElementDefinition(definition);
    if (entries.has(entry.type)) throw new Error(`Editor element "${entry.type}" is already registered.`);
    entries.set(entry.type, entry);
    return entry;
  }

  function get(type) {
    return entries.get(String(type || '').trim()) || null;
  }

  function has(type) {
    return Boolean(get(type));
  }

  function list() {
    return [...entries.values()];
  }

  return Object.freeze({ register, get, has, list });
}
