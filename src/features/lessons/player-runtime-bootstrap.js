import { createPlayerRuntimeEntry } from './player-runtime-entry.js';
import { createPlayerScreenBoundary } from './player-screen-boundary.js';
import { createPlayerTestView } from './player-test-view.js';
import { createPlayerResultRenderer } from './player-result-renderer.js';

export function createProfessionalPlayerBridge({
  getLesson,
  getStudent,
  db,
  persistence = null,
  documentRef = globalThis.document,
  hideAll,
  showLessonChoice,
  goBack,
  clearActivity,
  escapeHtml,
  speakAiText,
  stopAiAudio = () => {},
  gradeAnswer,
  shuffle
} = {}) {
  if (typeof getLesson !== 'function') throw new Error('A lesson provider is required.');
  if (typeof getStudent !== 'function') throw new Error('A student provider is required.');
  if (typeof hideAll !== 'function') throw new Error('A screen hide function is required.');
  if (typeof clearActivity !== 'function') throw new Error('An activity cleanup function is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');
  if (typeof speakAiText !== 'function') throw new Error('A speech function is required.');
  if (typeof gradeAnswer !== 'function') throw new Error('An answer grader is required.');

  let entry = null;
  let activeLesson = null;

  const screen = createPlayerScreenBoundary({ documentRef, hideAll });
  const testView = createPlayerTestView({
    documentRef,
    escapeHtml,
    speakTest: () => {
      const session = entry?.runtime?.session;
      const item = session?.currentItem();
      if (!item) return Promise.resolve();
      return speakAiText(item.answer, 'testVoiceStatus');
    }
  });
  const resultRenderer = createPlayerResultRenderer({ documentRef, escapeHtml });

  function buildEntry() {
    activeLesson = getLesson();
    if (!activeLesson || typeof activeLesson !== 'object') throw new Error('No active lesson is available.');

    entry = createPlayerRuntimeEntry({
      lesson: activeLesson,
      student: getStudent(),
      db,
      persistence,
      prepareTestView: ({ type }) => screen.showTest({ type }),
      renderTest: payload => testView.render(payload),
      renderResult: async payload => {
        screen.showResult();
        resultRenderer.render(payload);
      },
      cancelSpeech: () => window.speechSynthesis?.cancel(),
      stopAiAudio,
      clearActivity,
      showLessonChoice,
      goBack,
      gradeAnswer,
      shuffle,
      documentRef
    });

    return entry;
  }

  function startTest(type) {
    return buildEntry().startTest({ type });
  }

  async function submitTest(options = {}) {
    if (!entry) buildEntry();
    return entry.submitTest(options);
  }

  async function speakTest() {
    const session = entry?.runtime?.session;
    const item = session?.currentItem();
    if (!item) return;
    await speakAiText(item.answer, 'testVoiceStatus');
  }

  return Object.freeze({
    startTest,
    submitTest,
    speakTest,
    get entry() { return entry; },
    get lesson() { return activeLesson; }
  });
}
