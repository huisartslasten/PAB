const LESSONS_PAGE = 'lessons.html';

function getStudentFromCard(card) {
  return card?.querySelector?.('.student-name')?.textContent?.trim() || '';
}

function navigateToLessons(target, student, subject = '') {
  if (!student) return;
  const url = new URL(LESSONS_PAGE, target.location.href);
  url.searchParams.set('student', student);
  if (subject) url.searchParams.set('subject', subject);
  target.location.assign(url.toString());
}

export function installStudentEntryRuntime({ documentRef, target = globalThis } = {}) {
  if (!documentRef || typeof documentRef.addEventListener !== 'function') {
    throw new Error('A document reference is required for the student entry runtime.');
  }
  if (!target?.location) {
    throw new Error('A runtime target with location is required.');
  }

  const onClick = event => {
    const studentCard = event.target?.closest?.('#studentChooser .student-card');
    if (studentCard) {
      const student = getStudentFromCard(studentCard);
      if (student) {
        event.preventDefault();
        event.stopImmediatePropagation();
        navigateToLessons(target, student);
        return;
      }
    }

    const lessonsButton = event.target?.closest?.('#studentDashboard .side-item');
    if (lessonsButton && /Mijn lessen/i.test(lessonsButton.textContent || '')) {
      const student = target.currentStudent || documentRef.querySelector('#sidebarGreeting')?.textContent?.replace(/^Hoi\s+/i, '').replace(/\s*!.*$/, '').trim();
      if (student) {
        event.preventDefault();
        event.stopImmediatePropagation();
        navigateToLessons(target, student);
      }
    }
  };

  documentRef.addEventListener('click', onClick, true);
  return () => documentRef.removeEventListener('click', onClick, true);
}
