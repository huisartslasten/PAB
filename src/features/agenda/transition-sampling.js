export function buildTransitionOffsets(stepSeconds = 0.5) {
  const step = Math.max(0.1, Number(stepSeconds) || 0.5);
  return Object.freeze([-2 * step, -step, 0, step, 2 * step]);
}

export function clampFrameTime(time, duration) {
  const end = Math.max(0, Number(duration) || 0);
  return Math.max(0, Math.min(end, Number(time) || 0));
}

export function buildTransitionFrameTimes(center, duration, stepSeconds = 0.5) {
  return [...new Set(buildTransitionOffsets(stepSeconds)
    .map(offset => clampFrameTime(Number(center) + offset, duration)))].sort((a, b) => a - b);
}
