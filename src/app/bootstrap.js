import { createSupabaseClient } from '../services/supabase-client.js';
import { createAuthSessionService } from '../services/auth-session-service.js';
import { createLessonService } from '../services/lesson-service.js';
import { createFeedbackService } from '../services/feedback-service.js';
import { createAuthState } from '../core/auth.js';
import { appState } from '../core/state.js';
import { mapLessonRecords } from '../features/lessons/lesson-mapper.js';
import { createPhotoStorageService } from '../features/photo-lessons/photo-storage-service.js';
import { createManagement } from '../features/management/management.js';

export function createPacoGOApp({ supabaseLib = window.supabase, session = null } = {}) {
  const db = createSupabaseClient(supabaseLib);
  const authSession = createAuthSessionService(db);
  const auth = createAuthState(session);
  const lessons = createLessonService(db);
  const feedback = createFeedbackService(db);
  const canManage = () => auth.isParent;

  return Object.freeze({
    db,
    auth,
    authSession,
    state: appState,
    lessons,
    feedback,
    management: createManagement({ auth, lessonService: lessons, feedbackService: feedback }),
    photos: createPhotoStorageService(db, { canManage }),
    mapLessons: mapLessonRecords
  });
}

// The professional runtime composes all domain/data boundaries here.
// Page modules remain responsible only for presentation and interaction.
