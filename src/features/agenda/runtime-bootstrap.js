import { installAgendaRuntimeEntry } from './runtime-entry.js';

const REQUIRED = ['storage', 'currentStudent', 'lessons', 'demoItems', 'documentRef'];

function requireHost(host) {
  if (!host || typeof host !== 'object') throw new Error('An agenda bootstrap host is required.');
  for (const key of REQUIRED) {
    if (!(key in host)) throw new Error(`The agenda bootstrap host is missing: ${key}.`);
  }
}

export function bootstrapAgendaRuntime(host, target = globalThis) {
  requireHost(host);
  return installAgendaRuntimeEntry(host, target);
}
