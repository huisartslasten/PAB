const OBJECTIVE_STATUSES = Object.freeze(['active', 'planned', 'retired']);

const INITIAL_OBJECTIVES = Object.freeze([
  Object.freeze({
    id: 'FR-0001',
    domain: 'Breuken',
    slo_group: 6,
    slo_source: 'SLO 2017',
    slo_component: 'Getalbegrip',
    objective: 'Breuken op een getallenlijn plaatsen',
    status: 'active',
    exercise_ids: Object.freeze([])
  })
]);

function validateObjective(objective, seenIds) {
  if (!objective || typeof objective !== 'object') throw new TypeError('Curriculum objective must be an object.');
  if (!/^FR-\d{4}$/.test(objective.id || '')) throw new Error('Curriculum objective ID must use the FR-0000 format.');
  if (seenIds.has(objective.id)) throw new Error(`Duplicate curriculum objective ID: ${objective.id}`);
  seenIds.add(objective.id);
  for (const field of ['domain', 'slo_source', 'slo_component', 'objective']) {
    if (!String(objective[field] || '').trim()) throw new Error(`Curriculum objective requires ${field}.`);
  }
  if (!Number.isInteger(objective.slo_group) || objective.slo_group < 1 || objective.slo_group > 8) {
    throw new Error('Curriculum objective SLO group must be an integer from 1 to 8.');
  }
  if (!OBJECTIVE_STATUSES.includes(objective.status)) throw new Error('Curriculum objective status is invalid.');
  if (!Array.isArray(objective.exercise_ids) || objective.exercise_ids.some(id => typeof id !== 'string' || !id.trim())) {
    throw new Error('Curriculum objective exercise_ids must be an array of non-empty IDs.');
  }
}

export function createVerticalLearningLinesRegistry({ objectives = INITIAL_OBJECTIVES } = {}) {
  if (!Array.isArray(objectives)) throw new TypeError('Curriculum objectives must be an array.');
  const seenIds = new Set();
  objectives.forEach(objective => validateObjective(objective, seenIds));
  const records = objectives.map(objective => Object.freeze({
    ...objective,
    exercise_ids: Object.freeze([...objective.exercise_ids])
  }));
  const byId = new Map(records.map(objective => [objective.id, objective]));

  return Object.freeze({
    schema_version: '1.0.0',
    listObjectives: ({ domain } = {}) => records
      .filter(objective => !domain || objective.domain === domain)
      .slice()
      .sort((a, b) => a.slo_group - b.slo_group || a.id.localeCompare(b.id, 'nl')),
    getObjective: id => byId.get(id) || null,
    listDomains: () => [...new Set(records.map(objective => objective.domain))].sort((a, b) => a.localeCompare(b, 'nl'))
  });
}

export const verticalLearningLinesRegistry = createVerticalLearningLinesRegistry();
