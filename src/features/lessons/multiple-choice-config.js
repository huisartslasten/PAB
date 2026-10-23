// Multiple Choice configuration helpers are intentionally isolated from editor rendering.
// The lesson editor remains the presentation owner; this module owns the reusable
// question-level configuration, inheritance and option-policy rules.

const DEFAULT_OPTION_COUNT = 4;
const MIN_OPTION_COUNT = 2;
const MAX_OPTION_COUNT = 8;

export function normalizeMultipleChoiceConfig(config = {}) {
  const enabled = Boolean(config.enabled);
  const rawCount = Number(config.optionCount ?? config.option_count ?? DEFAULT_OPTION_COUNT);
  const optionCount = Number.isFinite(rawCount)
    ? Math.min(MAX_OPTION_COUNT, Math.max(MIN_OPTION_COUNT, Math.round(rawCount)))
    : DEFAULT_OPTION_COUNT;

  return Object.freeze({ enabled, optionCount });
}

export function inheritMultipleChoiceConfig(previous = {}) {
  return normalizeMultipleChoiceConfig(previous);
}

export function validateMultipleChoiceOptions({ options = [], correctOption = '' } = {}) {
  const normalizedOptions = Array.isArray(options)
    ? options.map(value => String(value ?? '').trim()).filter(Boolean)
    : [];
  const correct = String(correctOption ?? '').trim();
  const errors = [];

  if (normalizedOptions.length < MIN_OPTION_COUNT) errors.push('Vul minstens twee antwoordopties in.');
  if (!correct) errors.push('Kies een correct antwoord.');
  if (correct && !normalizedOptions.includes(correct)) errors.push('Het correcte antwoord moet tussen de antwoordopties staan.');
  if (new Set(normalizedOptions).size !== normalizedOptions.length) errors.push('Elke antwoordoptie moet uniek zijn.');

  return Object.freeze({
    valid: errors.length === 0,
    errors,
    options: normalizedOptions,
    correctOption: correct
  });
}

export const MULTIPLE_CHOICE_LIMITS = Object.freeze({
  defaultOptionCount: DEFAULT_OPTION_COUNT,
  minOptionCount: MIN_OPTION_COUNT,
  maxOptionCount: MAX_OPTION_COUNT
});
