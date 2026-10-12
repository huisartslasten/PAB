import { createCreatorService } from './creator-service.js';

const REQUIRED_KEYS = ['db', 'canCreate'];

function requireRuntime(runtime) {
  if (!runtime || typeof runtime !== 'object') {
    throw new Error('A creator runtime bridge is required.');
  }
  for (const key of REQUIRED_KEYS) {
    if (!(key in runtime)) throw new Error(`The creator runtime bridge is missing: ${key}.`);
  }
  if (!runtime.db) throw new Error('The creator runtime bridge is missing: db.');
  if (typeof runtime.canCreate !== 'function') {
    throw new Error('The creator runtime bridge is missing: canCreate function.');
  }
}

export function createCreatorRuntime(runtime) {
  requireRuntime(runtime);
  return createCreatorService(runtime.db, { canCreate: runtime.canCreate });
}

export async function executeCreatorAction(runtime, action, ...args) {
  const service = createCreatorRuntime(runtime);
  if (typeof service[action] !== 'function') {
    throw new Error(`Unknown creator action: ${action}.`);
  }
  return service[action](...args);
}

export function installCreatorRuntimeEntry(runtime, target = globalThis) {
  requireRuntime(runtime);
  if (!target || typeof target !== 'object') throw new Error('A runtime target is required.');

  target.pacoGOCreatorListAiRules = () => executeCreatorAction(runtime, 'listAiRules');
  target.pacoGOCreatorAddAiRule = ruleText => executeCreatorAction(runtime, 'addAiRule', ruleText);
  target.pacoGOCreatorSetAiRuleEnabled = (id, enabled) => executeCreatorAction(runtime, 'setAiRuleEnabled', id, enabled);
  target.pacoGOCreatorDeleteAiRule = id => executeCreatorAction(runtime, 'deleteAiRule', id);
  target.pacoGOCreatorListNotes = () => executeCreatorAction(runtime, 'listNotes');
  target.pacoGOCreatorAddNote = payload => executeCreatorAction(runtime, 'addNote', payload);
  target.pacoGOCreatorToggleNoteStatus = id => executeCreatorAction(runtime, 'toggleNoteStatus', id);
  target.pacoGOCreatorDeleteNote = id => executeCreatorAction(runtime, 'deleteNote', id);

  return Object.freeze({
    listAiRules: target.pacoGOCreatorListAiRules,
    addAiRule: target.pacoGOCreatorAddAiRule,
    setAiRuleEnabled: target.pacoGOCreatorSetAiRuleEnabled,
    deleteAiRule: target.pacoGOCreatorDeleteAiRule,
    listNotes: target.pacoGOCreatorListNotes,
    addNote: target.pacoGOCreatorAddNote,
    toggleNoteStatus: target.pacoGOCreatorToggleNoteStatus,
    deleteNote: target.pacoGOCreatorDeleteNote
  });
}
