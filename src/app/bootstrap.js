import { createSupabaseClient } from '../services/supabase-client.js';
import { createLessonService } from '../services/lesson-service.js';
import { createAuthState } from '../core/auth.js';
import { appState } from '../core/state.js';
import { mapLessonRecords } from '../features/lessons/lesson-mapper.js';
import { createPhotoStorageService } from '../features/photo-lessons/photo-storage-service.js';
import { createManagement } from '../features/management/management.js';

export function createPacoGOApp({ supabaseLib = window.supabase, session = null } = {}) {
  const db = createSupabaseClient(supabaseLib);
  const auth = createAuthState(session);
  const lessons = createLessonService(db);
  const canManage = () => auth.isParent;

  return Object.freeze({
    db,
    auth,
    state: appState,
    lessons,
    management: createManagement({ auth, lessonService: lessons }),
    photos: createPhotoStorageService(db, { canManage }),
    mapLessons: mapLessonRecords
  });
}

// Not mounted automatically: V4.78 remains the visual/behavioral reference until parity checks pass.
