// Final pre-runtime V4.78 save-flow coordinator.
// This composes already-proven save boundaries without touching DOM, auth,
// localStorage, rendering, navigation, or application state.

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
        entries: items.map((item, index) => ({ row: index + 1, word: String(item.answer || '').trim() })).filter(x => x.word),
        subject: String(draft.subject || '')
      });
      if (result?.warning) warning = result.warning;
      if (warning && typeof onWarning === 'function') await onWarning(warning);
    } catch (error) {
      warning = error?.message || 'AI-spellingscontrole niet beschikbaar. De les wordt toch opgeslagen; de ouder blijft verantwoordelijk.';
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
  const outcome = resolvePostPersistence({
    lessons: reloadedLessons,
    lessonId: written?.lesson?.id ?? written?.lessonId ?? draft.lessonId,
    subject: draft.subject || draft.lesson?.subject || '',
    testDate: draft.testDate || ''
  });

  if (outcome?.testCalendarAction === 'upsert' || outcome?.testCalendarAction === 'remove') {
    await syncTestCalendar({
      action: outcome.testCalendarAction,
      lesson: outcome.savedLesson,
      lessonId: written?.lesson?.id ?? written?.lessonId ?? draft.lessonId,
      student: draft.student || draft.lesson?.student,
      testDate: draft.testDate || ''
    });
  }

  return Object.freeze({ ok: true, stage: 'complete', items, written, outcome, warning });
}
