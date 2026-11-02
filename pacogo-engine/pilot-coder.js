function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function normalizePilotObservation(raw) {
  assertObject(raw, 'observation');
  assertObject(raw.coding, 'observation.coding');
  assertObject(raw.performance, 'observation.performance');
  assertObject(raw.context, 'observation.context');

  const coding = raw.coding;
  const normalized = {
    ...raw,
    quality: Number(coding.quality),
    contradiction: Boolean(coding.contradiction),
    independent: coding.independence === 'INDEPENDENT',
    variation_key: raw.context.variation_key,
    relevant: coding.evidence_target_match === 'MATCH',
    evidence_status: coding.evidence_status,
    evidence_target_match: coding.evidence_target_match,
    alternative_explanations: coding.alternative_explanations || []
  };

  if (!Number.isFinite(normalized.quality) || normalized.quality < 0 || normalized.quality > 1) {
    throw new TypeError(`invalid coding quality for ${raw.observation_id}`);
  }

  return normalized;
}

function normalizePilotDataset(dataset) {
  assertObject(dataset, 'dataset');
  if (!Array.isArray(dataset.observations)) throw new TypeError('dataset.observations must be an array');
  return dataset.observations.map(normalizePilotObservation);
}

export { normalizePilotObservation, normalizePilotDataset };
