import { prepareAgendaReviewCandidates } from './review.js';

export function createAgendaReviewController({ student, source = 'AI agenda-import', now } = {}) {
  function prepare(results = []) {
    return prepareAgendaReviewCandidates(results, { student, source, now });
  }

  function validate(items = []) {
    return (Array.isArray(items) ? items : []).filter(item => item?.date && item?.title);
  }

  function commit(items = [], save = async () => {}) {
    const valid = validate(items);
    return save(valid);
  }

  return Object.freeze({ prepare, validate, commit });
}
