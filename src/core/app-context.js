// Stable application context for the professional PacoGO architecture.
// This is an adapter layer: the V4.78 runtime remains the reference implementation
// until each feature has passed parity checks.

import { appState } from './state.js';
import { createAuthState } from './auth.js';
import { createSupabaseClient } from '../services/supabase-client.js';

export function createAppContext({ supabaseLib = window.supabase, session = null } = {}) {
  const db = createSupabaseClient(supabaseLib);
  const auth = createAuthState(session);

  appState.session = session;

  return Object.freeze({
    db,
    auth,
    state: appState
  });
}
