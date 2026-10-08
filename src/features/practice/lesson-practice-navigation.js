const PRACTICE_PAGE = 'oefenen.html';

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
  locationRef = window.location
} = {}) {
  const choiceGrid = documentRef.getElementById('choiceGrid');
  if (!choiceGrid || !lesson) return false;

  const practiceChoice = [...choiceGrid.querySelectorAll('button.choice')]
    .find(button => button.querySelector('h3')?.textContent.trim() === 'Oefenen');
  if (!practiceChoice) return false;

  practiceChoice.onclick = () => {
    const target = createLessonPracticeTarget({ lesson, baseUrl: locationRef.href });
    locationRef.href = target.toString();
  };

  return true;
}

export function setReadableTestVersion(version, documentRef = document) {
  const badge = documentRef.querySelector('.version-badge');
  if (badge) badge.textContent = `PacoGO TEST ${version}`;
}
