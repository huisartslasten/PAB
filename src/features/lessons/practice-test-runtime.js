import { createTestSession } from './test-engine.js';
import { createPracticeEvaluationRuntimeEntry } from './practice-evaluation-runtime-entry.js';
import { createPlayerResult } from './player-result.js';

export function createPracticeTestRuntime({
  lesson = null,
  db = null,
  gradeAnswer = null,
  shuffle = null,
  clock = () => new Date().toISOString()
} = {}) {
  if (!lesson || typeof lesson !== 'object') throw new Error('A lesson is required.');

  const evaluator = createPracticeEvaluationRuntimeEntry({ db, gradeAnswer });
  let session = null;

  function start() {
    session = createTestSession(lesson.lesson_items || [], {
      type: lesson.type || 'words',
      startedAt: clock(),
      evaluateAnswer: evaluator.evaluate,
      aiCheckAnswers: lesson.ai_check_answers !== false,
      ...(shuffle ? { shuffle } : {})
    });
    return session;
  }

  async function submit(answer) {
    if (!session) throw new Error('No active practice-test session.');
    return session.submit(answer);
  }

  function result() {
    if (!session) throw new Error('No active practice-test session.');
    return createPlayerResult({
      lesson,
      type: lesson.type || 'words',
      mode: 'practice-test',
      answers: session.answers,
      startedAt: session.startedAt,
      finishedAt: clock()
    });
  }

  return Object.freeze({
    start,
    submit,
    result,
    get session() { return session; }
  });
}
