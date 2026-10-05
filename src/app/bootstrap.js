import { createSupabaseClient } from '../services/supabase-client.js';
import { createLessonService } from '../services/lesson-service.js';
import { createAuthState } from '../core/auth.js';
import { appState } from '../core/state.js';
import { mapLessonRecords } from '../features/lessons/lesson-mapper.js';

export function createPacoGOApp({ supabaseLib = window.supabase, session = null } = {}) {
  const db = createSupabaseClient(supabaseLib);
  return Object.freeze({ db, lessons: createLessonService(db), auth: createAuthState(session), state: appState, mapLessons: mapLessonRecords });
}

// Not mounted automatically: V4.78 remains the visual/behavioral reference until parity checks pass.
