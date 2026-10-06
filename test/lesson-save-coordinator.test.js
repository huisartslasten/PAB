import test from 'node:test';
import assert from 'node:assert/strict';
import { executeLessonSaveCore } from '../src/features/lessons/lesson-save-coordinator.js';

function baseDeps(overrides = {}) {
  const calls = [];
  return {
    calls,
    validate: input => {
      calls.push('validate');
      return { valid: true, errorMessage: '' };
    },
    collectItems: async () => {
      calls.push('collect');
      return [{ question: 'Vraag', answer: 'Antwoord' }];
    },
    writeLesson: async payload => {
      calls.push('write');
      return { lesson: { id: 42, ...payload.lesson }, items: payload.items };
    },
    reloadLessons: async () => {
      calls.push('reload');
      return [{ id: 42, student: 'Zyon', subject: 'Nederlands', title: 'Les' }];
    },
    resolvePostPersistence: input => {
      calls.push('resolve');
      return {
        currentSubject: input.subject,
        currentLesson: null,
        savedLesson: input.lessons[0],
        testCalendarAction: input.testDate ? 'upsert' : 'remove',
        successMessage: input.testDate ? 'Les opgeslagen en toetsdatum toegevoegd.' : 'Les opgeslagen.'
      };
    },
    syncTestCalendar: async input => {
      calls.push(`calendar:${input.action}`);
    },
    ...overrides
  };
}

test('keeps V4.78 save ordering for the successful non-dictation path', async () => {
  const deps = baseDeps();
  const result = await executeLessonSaveCore({
    ...deps,
    draft: { student: 'Zyon', subject: 'Nederlands', title: 'Les', type: 'words', testDate: '' }
  });

  assert.equal(result.ok, true);
  assert.deepEqual(deps.calls, ['collect', 'validate', 'write', 'reload', 'resolve', 'calendar:remove']);
});

test('runs dictation checking before persistence and continues after a warning', async () => {
  const deps = baseDeps({
    runDictationCheck: async () => {
      deps.calls.push('dictation-check');
      return { warning: 'AI-waarschuwing' };
    },
    onWarning: async warning => {
      deps.calls.push(`warning:${warning}`);
    }
  });

  const result = await executeLessonSaveCore({
    ...deps,
    draft: { student: 'Zyon', subject: 'Nederlands', title: 'Dictee', type: 'dictation', testDate: '2026-10-10' }
  });

  assert.equal(result.ok, true);
  assert.equal(result.warning, 'AI-waarschuwing');
  assert.deepEqual(deps.calls, ['collect', 'validate', 'dictation-check', 'warning:AI-waarschuwing', 'write', 'reload', 'resolve', 'calendar:upsert']);
});

test('dictation checker failure is non-blocking', async () => {
  const deps = baseDeps({
    runDictationCheck: async () => {
      deps.calls.push('dictation-check');
      throw new Error('spellcheck unavailable');
    },
    onWarning: async warning => {
      deps.calls.push(`warning:${warning}`);
    }
  });

  const result = await executeLessonSaveCore({
    ...deps,
    draft: { student: 'Zyon', subject: 'Nederlands', title: 'Dictee', type: 'dictation' }
  });

  assert.equal(result.ok, true);
  assert.equal(result.warning, 'spellcheck unavailable');
  assert.ok(deps.calls.includes('write'));
});

test('validation failure stops before dictation and persistence', async () => {
  const deps = baseDeps({
    validate: () => {
      deps.calls.push('validate');
      return { valid: false, errorMessage: 'Vul het vak, de lestitel en minstens één item in.' };
    },
    runDictationCheck: async () => {
      deps.calls.push('dictation-check');
      return { warning: '' };
    }
  });

  const result = await executeLessonSaveCore({
    ...deps,
    draft: { student: 'Zyon', subject: '', title: 'Dictee', type: 'dictation' }
  });

  assert.equal(result.ok, false);
  assert.equal(result.stage, 'validation');
  assert.equal(deps.calls.includes('dictation-check'), false);
  assert.equal(deps.calls.includes('write'), false);
});

test('persistence failure stops before reload and calendar sync', async () => {
  const deps = baseDeps({
    writeLesson: async () => {
      deps.calls.push('write');
      throw new Error('database failure');
    },
    onWriteError: async () => {
      deps.calls.push('write-error');
    }
  });

  const result = await executeLessonSaveCore({
    ...deps,
    draft: { student: 'Zyon', subject: 'Nederlands', title: 'Les', type: 'words' }
  });

  assert.equal(result.ok, false);
  assert.equal(result.stage, 'persistence');
  assert.deepEqual(deps.calls, ['collect', 'validate', 'write', 'write-error']);
});
