import assert from 'node:assert/strict';
import dataset from '../docs/curriculum/PacoGO_Pilot_SyntheticDataset_v0.1.json' with { type: 'json' };
import { normalizePilotDataset } from './pilot-coder.js';

const observations = normalizePilotDataset(dataset);
assert.equal(observations.length, 9);

for (const observation of observations) {
  assert.equal(typeof observation.quality, 'number');
  assert.ok(observation.quality >= 0 && observation.quality <= 1);
  assert.equal(typeof observation.coded_quality, 'number');
  assert.ok(observation.coded_quality >= 0 && observation.coded_quality <= 1);
  assert.equal(typeof observation.contradiction, 'boolean');
  assert.equal(typeof observation.independent, 'boolean');
  assert.equal(typeof observation.relevant, 'boolean');
  assert.equal(typeof observation.variation_key, 'string');
  assert.ok(['PRESENT', 'ABSENT', 'INDETERMINATE', 'NOT_CODED'].includes(observation.evidence_status));
  assert.ok(['MATCH', 'MISMATCH', 'UNCLEAR', 'NOT_CODED'].includes(observation.evidence_target_match));
}

const contradiction = observations.find((item) => item.observation_id === 'SYN-B1-003');
assert.equal(contradiction.contradiction, true);
assert.equal(contradiction.independent, true);
assert.equal(contradiction.relevant, true);
assert.equal(contradiction.quality, 0);
assert.equal(contradiction.coded_quality, 1);

const prompted = observations.find((item) => item.observation_id === 'SYN-B1-001');
assert.equal(prompted.independent, false);
assert.equal(prompted.quality, 0.5);
assert.equal(prompted.alternative_explanations[0], 'prompting');

const indeterminate = observations.find((item) => item.observation_id === 'SYN-A1-003');
assert.equal(indeterminate.evidence_status, 'INDETERMINATE');
assert.equal(indeterminate.quality, 0);
assert.equal(indeterminate.coded_quality, 0.5);

console.log('PacoGO pilot coding adapter fixtures passed.');
