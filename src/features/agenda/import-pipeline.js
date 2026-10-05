import { prepareAgendaReviewCandidates } from './review.js';

export function calculateAgendaFrameTimes(duration, targetFrames = 30) {
  const total = Number(duration);
  const count = Math.max(1, Math.min(Number(targetFrames) || 30, Math.floor(total * 2) || 1));
  if (!Number.isFinite(total) || total <= 0) return [0];
  if (count === 1) return [0];
  const step = total / (count - 1);
  return Array.from({ length: count }, (_, index) => Math.min(total, index * step));
}

export function createAgendaImportPipeline({ analyzeFrame, refineTransition, student, source = 'AI agenda-import', now } = {}) {
  if (typeof analyzeFrame !== 'function') throw new Error('createAgendaImportPipeline requires analyzeFrame');

  async function analyzeFrames(frames = []) {
    const results = [];
    for (const frame of Array.isArray(frames) ? frames : []) {
      const result = await analyzeFrame(frame);
      if (result) results.push(result);
    }
    return results;
  }

  async function refineTransitions(results = [], frames = []) {
    if (typeof refineTransition !== 'function') return results;
    const refined = [...results];
    for (const result of results) {
      if (!result?.transition) continue;
      const extra = await refineTransition(result, frames);
      if (Array.isArray(extra)) refined.push(...extra);
    }
    return refined;
  }

  function toReviewCandidates(results = []) {
    return prepareAgendaReviewCandidates(results, { student, source, now });
  }

  async function run({ frames = [] } = {}) {
    const initial = await analyzeFrames(frames);
    const refined = await refineTransitions(initial, frames);
    return {
      frameResults: refined,
      candidates: toReviewCandidates(refined)
    };
  }

  return Object.freeze({ analyzeFrames, refineTransitions, toReviewCandidates, run });
}
