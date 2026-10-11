import { createSupabaseClient } from '../services/supabase-client.js';
import { createAuthSessionService } from '../services/auth-session-service.js';
import { createLessonService } from '../services/lesson-service.js';
import { createFeedbackService } from '../services/feedback-service.js';
import { createAnswerGradingService } from '../services/answer-grading-service.js';
import { createLessonAudioService } from '../services/lesson-audio-service.js';
import { createMasteryService } from '../services/mastery-service.js';
import { createAuthState } from '../core/auth.js';
import { appState, setLessons } from '../core/state.js';
import { mapLessonRecords } from '../features/lessons/lesson-mapper.js';
import { createPhotoStorageService } from '../features/photo-lessons/photo-storage-service.js';
import { createManagement } from '../features/management/management.js';
import { createAgendaReadService } from '../features/agenda/read-service.js';
import { createTestHistoryReadService } from '../features/test-history/test-history-read-service.js';

export function createPacoGOApp({ supabaseLib = window.supabase, session = null, storage = globalThis.localStorage } = {}) {
  const db = createSupabaseClient(supabaseLib);
  const authSession = createAuthSessionService(db);
  const auth = createAuthState(session);
  const lessons = createLessonService(db);
  const feedback = createFeedbackService(db);
  const grading = createAnswerGradingService(db);
  const audio = createLessonAudioService(db);
  const mastery = createMasteryService({ storage });
  const agenda = createAgendaReadService({ storage, lessons: () => appState.lessons, currentStudent: () => appState.currentStudent });
  const testHistory = createTestHistoryReadService(db);
  const canManage = () => auth.isParent;

  async function initializeSession() {
    if (auth.session) return auth.session;
    const currentSession = await authSession.getCurrentSession();
    auth.setSession(currentSession);
    return currentSession;
  }

  async function loadLessons() {
    const records = await lessons.listAll();
    setLessons(records);
    return records;
  }

  return Object.freeze({
    db,
    auth,
    authSession,
    initializeSession,
    state: appState,
    lessons,
    loadLessons,
    feedback,
    grading,
    audio,
    mastery,
    agenda,
    testHistory,
    management: createManagement({ auth, lessonService: lessons, feedbackService: feedback, loadLessons }),
    photos: createPhotoStorageService(db, { canManage }),
    mapLessons: mapLessonRecords
  });
}

// The professional runtime composes all domain/data boundaries here.
// Page modules remain responsible only for presentation and interaction.
