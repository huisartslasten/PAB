import { getLessonChoices, getLessonChoiceTarget } from './lesson-choice.js';

export function createLessonChoiceFlow({ open = () => {} } = {}) {
  function choose(lesson, choice) {
    const target = getLessonChoiceTarget(lesson, choice);
    if (!target) return null;
    open(target);
    return target;
  }

  return Object.freeze({ getChoices: getLessonChoices, choose });
}
