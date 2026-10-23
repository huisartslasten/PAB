// Multiple Choice configuration helpers are intentionally isolated from editor rendering.
// The lesson editor remains the presentation owner; this module owns the reusable
// question-level configuration and inheritance rules.

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

export const MULTIPLE_CHOICE_LIMITS = Object.freeze({
  defaultOptionCount: DEFAULT_OPTION_COUNT,
  minOptionCount: MIN_OPTION_COUNT,
  maxOptionCount: MAX_OPTION_COUNT
});
