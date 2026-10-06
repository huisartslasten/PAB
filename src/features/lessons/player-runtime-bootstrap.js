// Browser bootstrap boundary for the first lesson-player runtime.
// It creates the runtime from the existing Supabase library and exposes it only
// when the legacy runtime explicitly calls this bootstrap.
// No DOM rendering, navigation, or automatic execution belongs here.

import { createSupabaseClient } from '../../services/supabase-client.js';
import { createPlayerRuntime } from './player-runtime.js';

export function bootstrapPlayerRuntime({
  supabaseLib = globalThis.supabase,
  target = globalThis
} = {}) {
  const db = createSupabaseClient(supabaseLib);
  const runtime = createPlayerRuntime({ db });

  if (target && typeof target === 'object') {
    target.pacoGOPlayerRuntime = runtime;
  }

  return runtime;
}
