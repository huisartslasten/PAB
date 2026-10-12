import { createPlayerRuntimeEntry } from './player-runtime-entry.js';
import { createPlayerScreenBoundary } from './player-screen-boundary.js';
import { createPlayerTestView } from './player-test-view.js';
import { createPlayerResultRenderer } from './player-result-renderer.js';

export function createProfessionalPlayerBridge({
  getLesson,
  getStudent,
  db,
  gradeAnswer = null,
  persistence = null,
  audioService,
  documentRef = globalThis.document,
  hideAll,
  showLessonChoice,
  goBack,
  clearActivity,
  escapeHtml,
  shuffle
} = {}) {
  if (typeof getLesson !== 'function') throw new Error('A lesson provider is required.');
  if (typeof getStudent !== 'function') throw new Error('A student provider is required.');
  if (typeof hideAll !== 'function') throw new Error('A screen hide function is required.');
  if (typeof clearActivity !== 'function') throw new Error('A lesson cleanup function is required.');
  if (typeof escapeHtml !== 'function') throw new Error('An escapeHtml function is required.');
  if (!audioService || typeof audioService.speak !== 'function' || typeof audioService.stop !== 'function') throw new Error('A lesson audio service is required.');

  let entry = null;
  let activeLesson = null;

  const screen = createPlayerScreenBoundary({ documentRef, hideAll });
  const speakCurrentItem = () => {
    const session = entry?.runtime?.session;
    const item = session?.currentItem();
    if (!item) return Promise.resolve();
    return audioService.speak(item.answer, {
      onStatus: status => {
        const node = documentRef?.getElementById?.('testVoiceStatus');
        if (node) node.textContent = status;
      }
    });
  };
  const testView = createPlayerTestView({
    documentRef,
    escapeHtml,
    speakTest: speakCurrentItem
  });
  const resultRenderer = createPlayerResultRenderer({ documentRef, escapeHtml });

  function buildEntry() {
    activeLesson = getLesson();
    if (!activeLesson || typeof activeLesson !== 'object') throw new Error('No active lesson is available.');

    entry = createPlayerRuntimeEntry({
      lesson: activeLesson,
      student: getStudent(),
      db,
      gradeAnswer,
      persistence,
      prepareTestView: ({ type }) => screen.showTest({ type }),
      renderTest: payload => testView.render(payload),
      renderResult: async payload => {
        screen.showResult();
        resultRenderer.render(payload);
      },
      cancelSpeech: () => {},
      stopAiAudio: () => audioService.stop(),
      clearActivity,
      showLessonChoice,
      goBack,
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
    await speakCurrentItem();
  }

  return Object.freeze({
    startTest,
    submitTest,
    speakTest,
    get entry() { return entry; },
    get lesson() { return activeLesson; }
  });
}
