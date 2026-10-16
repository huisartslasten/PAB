import test from 'node:test';
import assert from 'node:assert/strict';

import {
  executeLessonSaveRuntimeEntry,
  executeLessonSubvakUpdate,
  installLessonSaveRuntimeEntry
} from '../src/features/lessons/lesson-save-runtime-entry.js';

function createLessonService() {
  const calls = [];
  return {
    calls,
    async createLessonWithItems({ lesson, items }) {
      calls.push(['createLessonWithItems', { lesson, items }]);
      return { lesson: { ...lesson, id: 17 }, items };
    },
    async updateLesson(id, payload) {
      calls.push(['updateLesson', id, payload]);
      return { id, ...payload };
    },
    async replaceLessonItems(id, items) {
      calls.push(['replaceLessonItems', id, items]);
      return items;
    }
  };
}

function createValidRuntime(overrides = {}) {
  const errorElement = { textContent: '', classList: { remove() {} } };
  return {
    document: { getElementById() { return errorElement; } },
    currentSubject: 'Rekenen',
    currentLesson: null,
    currentSession: null,
    PARENT_IDS: new Set(),
    lessons: [],
    lessonService: createLessonService(),
    currentStudent: null,
    normalizeSubvakKey: value => String(value ?? '').trim().toLowerCase(),
    renderTestCalendar() {},
    refreshPageSidebars() {},
    showMessage() {},
    showHome() {},
    loadLessons: async () => {},
    checkDictationSpelling: async () => {},
    upsertTestDate() {},
    removeTestDate() {},
    ...overrides
  };
}

test('runtime entry replaces window.saveLesson and returns the legacy function', () => {
  const legacySaveLesson = async () => 'legacy';
  const previousWindow = globalThis.window;
  globalThis.window = { saveLesson: legacySaveLesson };
  try {
    const returnedLegacy = installLessonSaveRuntimeEntry(createValidRuntime());
    assert.strictEqual(returnedLegacy, legacySaveLesson);
    assert.notStrictEqual(globalThis.window.saveLesson, legacySaveLesson);
    assert.equal(globalThis.window.saveLesson.name, 'saveLessonRuntimeEntry');
    assert.equal(typeof globalThis.window.pacoGOUpdateLessonSubvak, 'function');
  } finally {
    globalThis.window = previousWindow;
  }
});

test('runtime entry installation preserves the legacy function for rollback', () => {
  const legacySaveLesson = function legacySaveLesson() {};
  const previousWindow = globalThis.window;
  globalThis.window = { saveLesson: legacySaveLesson };
  try {
    const returnedLegacy = installLessonSaveRuntimeEntry(createValidRuntime());
    assert.strictEqual(returnedLegacy, legacySaveLesson);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('runtime entry installation rejects an incomplete bridge before replacing window.saveLesson', () => {
  const legacySaveLesson = function legacySaveLesson() {};
  const previousWindow = globalThis.window;
  globalThis.window = { saveLesson: legacySaveLesson };
  try {
    assert.throws(
      () => installLessonSaveRuntimeEntry({ document: {} }),
      /Missing V4\.78 runtime bridge dependency: document/
    );
    assert.strictEqual(globalThis.window.saveLesson, legacySaveLesson);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('runtime entry stops at authorization before reading or preparing an unauthorized save', async () => {
  const calls = [];
  const runtime = createValidRuntime({
    currentSession: { user: { id: 'not-a-parent' } },
    PARENT_IDS: new Set(['parent-1']),
    showMessage(message, type) { calls.push(['message', message, type]); },
    showHome() { calls.push(['home']); },
    document: {
      getElementById(id) { calls.push(['getElementById', id]); return { value: '', checked: false, classList: { remove() {} } }; },
      querySelector() { calls.push(['querySelector']); return null; }
    },
    loadLessons: async () => calls.push(['loadLessons']),
    renderTestCalendar: () => calls.push(['renderTestCalendar']),
    refreshPageSidebars: () => calls.push(['refreshPageSidebars'])
  });

  const result = await executeLessonSaveRuntimeEntry(runtime);
  assert.deepEqual(result, { ok: false, stage: 'authorization' });
  assert.deepEqual(calls, [
    ['message', 'Alleen ouders kunnen lessen wijzigen. Log eerst in.', 'error'],
    ['home']
  ]);
});

test('authorized runtime validates before any lesson service write or post-persistence effect', async () => {
  const calls = [];
  const lessonService = new Proxy({}, { get() { throw new Error('Lesson service must not be touched before validation.'); } });
  const runtime = createValidRuntime({
    lessonService,
    currentSession: { user: { id: 'parent-1' } },
    PARENT_IDS: new Set(['parent-1']),
    currentStudent: 'Zyon',
    document: {
      getElementById(id) {
        calls.push(['getElementById', id]);
        const values = {
          lessonSubject: { value: 'Rekenen' }, lessonName: { value: 'Optellen' }, lessonExplanation: { value: '' },
          lessonType: { value: 'words' }, lessonSubvak: { value: '' }, lessonAiCheckAnswers: { checked: false },
          lessonAiInstruction: { value: '' }, lessonTestDate: { value: '' }, editorError: { textContent: '', classList: { remove() {} } }
        };
        return values[id] || { value: '', checked: false, classList: { remove() {} } };
      },
      querySelector(selector) { calls.push(['querySelector', selector]); if (selector === 'input[name=lessonStudent]:checked') return { value: 'Zyon' }; return null; },
      querySelectorAll(selector) { calls.push(['querySelectorAll', selector]); return []; }
    },
    loadLessons: async () => calls.push(['loadLessons']),
    renderTestCalendar: () => calls.push(['renderTestCalendar']),
    refreshPageSidebars: () => calls.push(['refreshPageSidebars']),
    showMessage(message, type) { calls.push(['message', message, type]); }
  });

  const result = await executeLessonSaveRuntimeEntry(runtime);
  assert.deepEqual(result, {
    ok: false,
    stage: 'validation',
    validation: { valid: false, errorMessage: 'Vul het vak, de lestitel en minstens één item in.' },
    items: []
  });
  assert.ok(calls.some(call => call[0] === 'querySelector'));
  assert.ok(calls.some(call => call[0] === 'getElementById' && call[1] === 'lessonSubject'));
  assert.ok(!calls.some(call => call[0] === 'loadLessons'));
  assert.ok(!calls.some(call => call[0] === 'renderTestCalendar'));
  assert.ok(!calls.some(call => call[0] === 'refreshPageSidebars'));
  assert.ok(!calls.some(call => call[0] === 'message'));
});

test('runtime entry rejects direct module execution without the explicit V4.78 bridge', async () => {
  await assert.rejects(() => executeLessonSaveRuntimeEntry(), /V4\.78 lesson save runtime bridge is required/);
});

test('runtime subvak update authorizes before delegating to the canonical lesson service', async () => {
  const calls = [];
  const lessonService = {
    async updateLesson(id, payload) {
      calls.push(['updateLesson', id, payload]);
      return { id, subvak: payload.subvak };
    },
    async createLessonWithItems() {},
    async replaceLessonItems() {}
  };
  const runtime = createValidRuntime({
    lessonService,
    currentSession: { user: { id: 'parent-1' } },
    PARENT_IDS: new Set(['parent-1']),
    loadLessons: async () => calls.push(['loadLessons']),
    refreshPageSidebars: async () => calls.push(['refreshPageSidebars'])
  });

  const result = await executeLessonSubvakUpdate(runtime, 17, '  Themawoorden  ');
  assert.deepEqual(result, { id: 17, subvak: 'Themawoorden' });
  assert.deepEqual(calls, [
    ['updateLesson', 17, { subvak: 'Themawoorden' }],
    ['loadLessons'],
    ['refreshPageSidebars']
  ]);
});
