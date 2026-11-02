import { MASTERY_STATES, evaluateC6MasteryAssessments } from './c6-mastery-decision.js';
import { VALID_MASTERY_STATES, validateNextActionDecisionInput } from './c7-next-action-decision.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateC6SafetyBoundary(c6Result) {
  assert(c6Result && typeof c6Result === 'object', 'C6 result must be an object.');
  assert(c6Result.registry_promotion_allowed === false, 'C6 → C7 requires registry_promotion_allowed=false.');
  assert(c6Result.runtime_mastery_write_allowed === false, 'C6 → C7 requires runtime_mastery_write_allowed=false.');
  assert(c6Result.developmental_ordering_inference_allowed === false, 'C6 → C7 requires developmental_ordering_inference_allowed=false.');
  assert(c6Result.automatic_next_action_allowed === false, 'C6 → C7 requires automatic_next_action_allowed=false.');
  assert(c6Result.mastery_state_by_claim && typeof c6Result.mastery_state_by_claim === 'object', 'C6 result requires mastery_state_by_claim.');
  return true;
}

function createC7InputFromC6(c6Result, options) {
  validateC6SafetyBoundary(c6Result);
  assert(options && typeof options === 'object', 'C6 → C7 adapter requires explicit C7 context.');
  assert(typeof options.claim_id === 'string' && options.claim_id.length > 0, 'C6 → C7 requires claim_id.');
  assert(typeof options.current_development_id === 'string' && options.current_development_id.length > 0, 'C6 → C7 requires current_development_id.');
  assert(typeof options.evidence_state === 'string', 'C6 → C7 requires explicit evidence_state.');
  assert(typeof options.ordering_state === 'string', 'C6 → C7 requires explicit ordering_state.');
  assert(typeof options.alternative_state === 'string', 'C6 → C7 requires explicit alternative_state.');
  assert(typeof options.prerequisite_state === 'string', 'C6 → C7 requires explicit prerequisite_state.');
  assert(Array.isArray(options.supporting_evidence_ids), 'C6 → C7 requires supporting_evidence_ids.');
  assert(options.action_policy && typeof options.action_policy === 'object', 'C6 → C7 requires explicit action_policy.');

  const masteryResult = c6Result.mastery_state_by_claim[options.claim_id];
  assert(masteryResult && typeof masteryResult === 'object', `C6 result does not contain claim ${options.claim_id}.`);
  assert(masteryResult.development_id === options.current_development_id, `C6 development does not match C7 current_development_id for ${options.claim_id}.`);
  assert(VALID_MASTERY_STATES.has(masteryResult.mastery_state), `Invalid C6 mastery state for ${options.claim_id}: ${masteryResult.mastery_state}`);

  const c7Input = {
    claim_id: options.claim_id,
    current_development_id: options.current_development_id,
    mastery_state: masteryResult.mastery_state,
    evidence_state: options.evidence_state,
    ordering_state: options.ordering_state,
    alternative_state: options.alternative_state,
    prerequisite_state: options.prerequisite_state,
    supporting_evidence_ids: [...options.supporting_evidence_ids],
    action_policy: { ...options.action_policy }
  };

  validateNextActionDecisionInput(c7Input);
  return c7Input;
}

function buildC6ResultForTesting(assessment) {
  return evaluateC6MasteryAssessments([assessment]);
}

export {
  validateC6SafetyBoundary,
  createC7InputFromC6,
  buildC6ResultForTesting
};
