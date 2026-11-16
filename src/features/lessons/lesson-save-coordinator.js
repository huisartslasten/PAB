// Final pre-runtime V4.78 save-flow coordinator.
// This composes already-proven save boundaries without touching DOM, auth,
// localStorage, rendering, navigation, or application state.

import {
  buildDictationSpellcheckEntries,
  buildDictationWarning,
  DICTATION_SPELLCHECK_UNAVAILABLE_MESSAGE
} from './dictation-spellcheck.js';

export async function executeLessonSaveCore({
  draft = {},
  validate,
  collectItems,
  runDictationCheck,
  writeLesson,
  reloadLessons,
  resolvePostPersistence,
  syncTestCalendar,
  onWarning,
  onWriteError
} = {}) {
  if (typeof validate !== 'function') throw new Error('A lesson save validator is required.');
  if (typeof collectItems !== 'function') throw new Error('A lesson item collector is required.');
  if (typeof writeLesson !== 'function') throw new Error('A lesson write function is required.');
  if (typeof reloadLessons !== 'function') throw new Error('A lesson reload function is required.');
  if (typeof resolvePostPersistence !== 'function') throw new Error('A post-persistence resolver is required.');
  if (typeof syncTestCalendar !== 'function') throw new Error('A test-calendar sync function is required.');

  const items = await collectItems(draft);
  const validation = validate({
    student: draft.student,
    subject: draft.subject,
    title: draft.title,
    items
  });

  if (!validation?.valid) {
    return Object.freeze({ ok: false, stage: 'validation', validation, items });
  }

  let warning = '';
  if (draft.type === 'dictation' && typeof runDictationCheck === 'function') {
    try {
      const result = await runDictationCheck({
        entries: buildDictationSpellcheckEntries(items.map(item => ({ word: item.answer }))),
        subject: String(draft.subject || '')
      });
      warning = buildDictationWarning(result);
      if (warning && typeof onWarning === 'function') await onWarning(warning);
    } catch {
      warning = DICTATION_SPELLCHECK_UNAVAILABLE_MESSAGE;
      if (typeof onWarning === 'function') await onWarning(warning);
    }
  }

  let written;
  try {
    written = await writeLesson({
      id: draft.lessonId ?? null,
      lesson: draft.lesson || draft,
      items
    });
  } catch (error) {
    if (typeof onWriteError === 'function') await onWriteError(error);
    return Object.freeze({ ok: false, stage: 'persistence', error, warning, items });
  }

  const reloadedLessons = await reloadLessons();
  const savedLessonId = written?.lesson?.id ?? written?.lessonId ?? draft.lessonId;
  const outcome = resolvePostPersistence({
    lessons: reloadedLessons,
    lessonId: savedLessonId,
    subject: draft.subject || draft.lesson?.subject || '',
    testDate: draft.testDate || ''
  });

  if (outcome?.testCalendarAction === 'upsert' || outcome?.testCalendarAction === 'remove') {
    await syncTestCalendar({
      action: outcome.testCalendarAction,
      lesson: outcome.savedLesson,
      lessonId: savedLessonId,
      student: draft.student || draft.lesson?.student,
      testDate: draft.testDate || ''
    });
  }

  return Object.freeze({ ok: true, stage: 'complete', items, written, outcome, warning });
}
