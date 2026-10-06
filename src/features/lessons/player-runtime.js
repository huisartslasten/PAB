// First runtime adapter for the V4.78 lesson-player test completion flow.
// The adapter owns orchestration only: completion -> persistence payload -> result model.
// It does not render UI and does not choose navigation destinations.

import { createPlayerCompletion } from './player-completion.js';
import { createPlayerCompletionPackage } from './player-completion-package.js';
import { createPlayerPersistence } from './player-persistence.js';

export function createPlayerRuntime({ db } = {}) {
  const persistence = createPlayerPersistence(db);

  async function completeTest({
    lesson = null,
    student = null,
    answers = [],
    startedAt = null,
    finishedAt = null
  } = {}) {
    const completion = createPlayerCompletion({
      lesson: lesson ? { ...lesson, student: student ?? lesson.student } : null,
      session: { startedAt },
      answers,
      finishedAt
    });

    // V4.78 does not create an empty test-history attempt.
    if (!completion.answers.length) {
      return Object.freeze({ completion, package: null, persisted: null });
    }

    const pkg = createPlayerCompletionPackage(completion);
    const persisted = await persistence.saveTestResult({
      attempt: pkg.attempt,
      answers: pkg.answerRows
    });

    return Object.freeze({ completion, package: pkg, persisted });
  }

  return Object.freeze({ completeTest });
}
