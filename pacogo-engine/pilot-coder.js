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
  const codedQuality = Number(coding.quality);
  const evidenceStatus = coding.evidence_status;

  // The pilot codebook distinguishes observed evidence from absent or
  // indeterminate evidence. The generic engine represents that distinction
  // through evidence=true/false, so only PRESENT coding contributes quality.
  const engineQuality = evidenceStatus === 'PRESENT' ? codedQuality : 0;

  const normalized = {
    ...raw,
    quality: engineQuality,
    coded_quality: codedQuality,
    contradiction: Boolean(coding.contradiction),
    independent: coding.independence === 'INDEPENDENT',
    variation_key: raw.context.variation_key,
    relevant: coding.evidence_target_match === 'MATCH',
    evidence_status: evidenceStatus,
    evidence_target_match: coding.evidence_target_match,
    alternative_explanations: coding.alternative_explanations || []
  };

  if (!Number.isFinite(codedQuality) || codedQuality < 0 || codedQuality > 1) {
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
