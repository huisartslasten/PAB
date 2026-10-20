import { createSupabaseClient } from '../services/supabase-client.js';
import { createAuthSessionService } from '../services/auth-session-service.js';
import { createLessonService } from '../services/lesson-service.js';
import { createFeedbackService } from '../services/feedback-service.js';
import { createAnswerGradingService } from '../services/answer-grading-service.js';
import { createLessonAudioService } from '../services/lesson-audio-service.js';
import { createMasteryService } from '../services/mastery-service.js';
import { createCreatorService } from '../services/creator-service.js';
import { createTestHistoryService } from '../services/test-history-service.js';
import { createGameResultService } from '../services/game-result-service.js';
import { createLessonOrderService } from '../services/lesson-order-service.js';
import { createAuthState } from '../core/auth.js';
import { appState, setLessons } from '../core/state.js';
import { getViewContext } from '../core/view-context.js';
import { mapLessonRecords } from '../features/lessons/lesson-mapper.js';
import { createPhotoStorageService } from '../features/photo-lessons/photo-storage-service.js';
import { createLearningContentService } from '../features/lessons/learning-content-service.js';
import { createLearningTopicService } from '../services/learning-topic-service.js';
import { createLearningTopicMediaService } from '../services/learning-topic-media-service.js';
import { createManagement } from '../features/management/management.js';
import { createAgendaReadService } from '../features/agenda/read-service.js';

export function createPacoGOApp({ supabaseLib = window.supabase, session = null, storage = globalThis.localStorage } = {}) {
  const db = createSupabaseClient(supabaseLib);
  const authSession = createAuthSessionService(db);
  const auth = createAuthState(session);
  const canManage = () => auth.isParent;
  const canCreate = () => auth.isCreator;
  const learningTopics = createLearningTopicService(db, { canManage });
  const lessons = createLessonService(db, { learningTopics });
  const feedback = createFeedbackService(db);
  const grading = createAnswerGradingService(db);
  const audio = createLessonAudioService(db);
  const mastery = createMasteryService({ storage });
  const lessonOrder = createLessonOrderService({ db, storage });
  const agenda = createAgendaReadService({ storage, lessons: () => appState.lessons, currentStudent: () => getViewContext().student });
  const testHistory = createTestHistoryService(db);
  const gameResults = createGameResultService(db);
  const photos = createPhotoStorageService(db, { canManage });
  const learningTopicMedia = createLearningTopicMediaService(db, { canManage });
  const learningContent = createLearningContentService(db, { media: learningTopicMedia, canManage, topics: learningTopics });

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
    db, auth, authSession, initializeSession, state: appState, lessons, lessonOrder, loadLessons,
    feedback, grading, audio, mastery, agenda, testHistory, gameResults,
    creator: createCreatorService(db, { canCreate }),
    management: createManagement({ auth, lessonService: lessons, feedbackService: feedback, lessonOrder, loadLessons }),
    photos, learningTopics, learningTopicMedia, learningContent, mapLessons: mapLessonRecords
  });
}
