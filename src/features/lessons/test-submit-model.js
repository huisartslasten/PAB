export function submitTestAnswer({
  activity = null,
  item = null,
  value = '',
  correct = false,
  feedback = ''
} = {}) {
  if (!activity || typeof activity !== 'object') throw new Error('A test activity is required.');
  if (!item || typeof item !== 'object') throw new Error('A test item is required.');

  const items = Array.isArray(activity.items) ? activity.items : [];
  const index = Number(activity.index) || 0;
  const answers = Array.isArray(activity.answers) ? activity.answers.slice() : [];

  answers.push({
    item,
    value: String(value ?? ''),
    correct: correct === true,
    feedback: String(feedback ?? '')
  });

  const nextIndex = index + 1;
  return Object.freeze({
    index: nextIndex,
    answers,
    done: nextIndex >= items.length,
    total: items.length
  });
}
