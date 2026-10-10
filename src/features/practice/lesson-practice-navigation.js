const PRACTICE_PAGE = 'oefenen.html';
const PRACTICE_RETURN_SCROLL_KEY = 'pacoGO:lesson-practice:return-scroll';

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

function rememberLessonScrollPosition(windowRef = window) {
  try {
    windowRef.sessionStorage.setItem(PRACTICE_RETURN_SCROLL_KEY, String(windowRef.scrollY || 0));
  } catch (error) {
    console.warn('Could not remember lesson scroll position:', error);
  }
}

export function restoreLessonScrollPosition({ windowRef = window, documentRef = document } = {}) {
  let savedPosition = null;
  try {
    const raw = windowRef.sessionStorage.getItem(PRACTICE_RETURN_SCROLL_KEY);
    if (raw !== null) {
      savedPosition = Number(raw);
      windowRef.sessionStorage.removeItem(PRACTICE_RETURN_SCROLL_KEY);
    }
  } catch (error) {
    console.warn('Could not read lesson scroll position:', error);
  }

  if (!Number.isFinite(savedPosition) || savedPosition <= 0) return false;

  let attempts = 0;
  const restore = () => {
    attempts += 1;
    const maxScroll = Math.max(0, documentRef.documentElement.scrollHeight - windowRef.innerHeight);
    const target = Math.min(savedPosition, maxScroll);
    windowRef.scrollTo(0, target);

    if (attempts < 10 && maxScroll < savedPosition) {
      windowRef.requestAnimationFrame(restore);
    }
  };

  windowRef.requestAnimationFrame(restore);
  return true;
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
    rememberLessonScrollPosition(windowRef);
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
