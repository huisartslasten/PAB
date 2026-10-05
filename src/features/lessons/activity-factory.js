import { createPracticeSession } from './practice-engine.js';
import { createTestSession } from './test-engine.js';
import { createQuestionSession } from './question-engine.js';

export function createLessonActivity(type, items = []) {
  if (type === 'words' || type === 'dictation') return createPracticeSession(items);
  if (type === 'test') return createTestSession(items);
  if (type === 'questions') return createQuestionSession(items);
  throw new Error(`Onbekend les-activiteitstype: ${type}`);
}
