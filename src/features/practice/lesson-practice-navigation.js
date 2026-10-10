const PRACTICE_PAGE = 'oefenen.html';
const LESSON_SCROLL_KEY = 'pacoGO:lesson-practice:return-scroll';
const LESSON_SCROLL_CLEANUP = '__pacoGOLessonPracticeScrollCleanup';

function saveLessonScrollPosition(windowRef = window) {
  try {
    windowRef.sessionStorage.setItem(LESSON_SCROLL_KEY, String(windowRef.scrollY || 0));
  } catch (error) {
    console.warn('Could not save LESSON scroll position:', error);
  }
}

function restoreLessonScrollPosition({ windowRef = window, documentRef = document } = {}) {
  let savedPosition = null;
  try {
    const raw = windowRef.sessionStorage.getItem(LESSON_SCROLL_KEY);
    if (raw !== null) savedPosition = Number(raw);
  } catch (error) {
    console.warn('Could not read LESSON scroll position:', error);
  }

  if (!Number.isFinite(savedPosition) || savedPosition <= 0) return false;

  let attempts = 0;
  const startedAt = Date.now();
  const restore = () => {
    attempts += 1;
    const maxScroll = Math.max(0, documentRef.documentElement.scrollHeight - windowRef.innerHeight);
    const target = Math.min(savedPosition, maxScroll);
    windowRef.scrollTo(0, target);

    const contentReady = maxScroll >= savedPosition;
    const timedOut = Date.now() - startedAt >= 2000;
    if (contentReady || timedOut || attempts >= 60) {
      try {
        windowRef.sessionStorage.removeItem(LESSON_SCROLL_KEY);
      } catch (error) {
        console.warn('Could not clear LESSON scroll position:', error);
      }
      return;
    }

    windowRef.requestAnimationFrame(restore);
  };

  windowRef.requestAnimationFrame(restore);
  return true;
}

export function installLessonPracticeScrollMemory({
  windowRef = window,
  documentRef = document
} = {}) {
  const previousCleanup = windowRef[LESSON_SCROLL_CLEANUP];
  if (typeof previousCleanup === 'function') previousCleanup();

  const handlePageShow = () => restoreLessonScrollPosition({ windowRef, documentRef });
  windowRef.addEventListener('pageshow', handlePageShow);
  handlePageShow();

  const cleanup = () => {
    windowRef.removeEventListener('pageshow', handlePageShow);
    if (windowRef[LESSON_SCROLL_CLEANUP] === cleanup) delete windowRef[LESSON_SCROLL_CLEANUP];
  };

  windowRef[LESSON_SCROLL_CLEANUP] = cleanup;
  return cleanup;
}

export function createLessonPracticeTarget({ lesson, baseUrl }) {
  if (!lesson?.id) throw new Error('A lesson is required to open practice.');
  const target = new URL(PRACTICE_PAGE, baseUrl);
  target.searchParams.set('lesson_id', String(lesson.id));
  target.searchParams.set('student', String(lesson.student || 'Zyon'));
  target.searchParams.set('subject', String(lesson.subject || 'Deze les'));
  target.searchParams.set('title', String(lesson.title || 'Oefenen'));
  target.searchParams.set('items', String((lesson.lesson_items || []).length));
  return target;
}

export function connectLessonPracticeChoice({
  lesson,
  documentRef = document,
  locationRef = window.location,
  windowRef = window
} = {}) {
  const choiceGrid = documentRef.getElementById('choiceGrid');
  if (!choiceGrid || !lesson) return false;

  const practiceChoice = [...choiceGrid.querySelectorAll('button.choice')]
    .find(button => button.querySelector('h3')?.textContent.trim() === 'Oefenen');
  if (!practiceChoice) return false;

  practiceChoice.onclick = () => {
    saveLessonScrollPosition(windowRef);
    const target = createLessonPracticeTarget({ lesson, baseUrl: locationRef.href });
    locationRef.href = target.toString();
  };

  return true;
}

export function installLessonPracticeIntegration({
  getCurrentLesson,
  documentRef = document,
  locationRef = window.location,
  windowRef = window
} = {}) {
  const choiceGrid = documentRef.getElementById('choiceGrid');
  if (!choiceGrid || typeof getCurrentLesson !== 'function') return () => {};

  const connect = () => connectLessonPracticeChoice({
    lesson: getCurrentLesson(),
    documentRef,
    locationRef,
    windowRef
  });

  const observer = new MutationObserver(connect);
  observer.observe(choiceGrid, { childList: true, subtree: true });
  connect();

  return () => observer.disconnect();
}

export function setReadableTestVersion(version, documentRef = document) {
  const badge = documentRef.querySelector('.version-badge');
  if (badge) badge.textContent = `PacoGO TEST ${version}`;
}
