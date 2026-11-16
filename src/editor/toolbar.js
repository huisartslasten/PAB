function normalizeCommand(command) {
  const name = String(command?.name || '').trim().toLowerCase();
  if (!name) throw new TypeError('Editor toolbar command requires a name.');
  if (typeof command.run !== 'function') throw new TypeError(`Editor toolbar command "${name}" requires run().`);
  return Object.freeze({ ...command, name });
}

export function createEditorToolbar(commands = []) {
  const entries = new Map();
  for (const command of commands) register(command);

  function register(command) {
    const entry = normalizeCommand(command);
    if (entries.has(entry.name)) throw new Error(`Editor toolbar command "${entry.name}" is already registered.`);
    entries.set(entry.name, entry);
    return entry;
  }

  function get(name) {
    return entries.get(String(name || '').trim().toLowerCase()) || null;
  }

  function has(name) {
    return Boolean(get(name));
  }

  function list() {
    return [...entries.values()];
  }

  function execute(name, context) {
    const command = get(name);
    if (!command) return false;
    return command.run(context) !== false;
  }

  return Object.freeze({ register, get, has, list, execute });
}
