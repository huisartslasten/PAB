const LESSONS_PAGE = 'lessons.html';
const LEGACY_PAGE = 'index.html';

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

function navigateToLegacyStudentView(target, student, view) {
  if (!student || !view) return;
  const url = new URL(LEGACY_PAGE, target.location.href);
  url.searchParams.set('student', student);
  url.searchParams.set('view', view);
  target.location.assign(url.toString());
}

function waitForFunction(target, name, timeout = 5000) {
  return new Promise(resolve => {
    const startedAt = Date.now();
    const check = () => {
      if (typeof target[name] === 'function') {
        resolve(target[name]);
        return;
      }
      if (Date.now() - startedAt >= timeout) {
        resolve(null);
        return;
      }
      target.setTimeout(check, 50);
    };
    check();
  });
}

function installLegacyStudentViewEntry({ documentRef, target }) {
  const params = new URLSearchParams(target.location.search);
  const student = params.get('student')?.trim() || '';
  const view = params.get('view')?.trim() || '';
  if (!student || !view || !['agenda', 'tests'].includes(view)) return () => {};

  const openRequestedView = async () => {
    if (typeof target.selectStudent === 'function') {
      target.selectStudent(student);
    }

    if (view === 'agenda') {
      const showAgenda = await waitForFunction(target, 'showAgenda');
      if (showAgenda) showAgenda();
      return;
    }

    const showTestHistory = await waitForFunction(target, 'showTestHistoryRuntime');
    if (showTestHistory) await showTestHistory(student);
  };

  const run = () => { void openRequestedView(); };
  if (documentRef.readyState === 'loading') {
    documentRef.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    target.setTimeout(run, 0);
  }

  return () => documentRef.removeEventListener('DOMContentLoaded', run);
}

export function installStudentEntryRuntime({ documentRef, target = globalThis } = {}) {
  if (!documentRef || typeof documentRef.addEventListener !== 'function') {
    throw new Error('A document reference is required for the student entry runtime.');
  }
  if (!target?.location) {
    throw new Error('A runtime target with location is required.');
  }

  const cleanupLegacyEntry = installLegacyStudentViewEntry({ documentRef, target });

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
  return () => {
    cleanupLegacyEntry();
    documentRef.removeEventListener('click', onClick, true);
  };
}
