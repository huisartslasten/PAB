import { MASTERY_STATES } from './c6-mastery-decision.js';
import { validateNextActionDecisionInput } from './c7-next-action-decision.js';

const VALID_ORDERING_STATES = new Set(['SUPPORTED', 'NOT_SUPPORTED', 'UNCERTAIN', 'NOT_ASSESSED']);
const VALID_ALTERNATIVE_STATES = new Set(['CONTROLLED', 'UNRESOLVED', 'NOT_ASSESSED']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateC6ResultForC7(c6Result, claimId) {
  assert(c6Result && typeof c6Result === 'object', 'C7 requires a C6 result object.');
  assert(c6Result.mastery_state_by_claim && typeof c6Result.mastery_state_by_claim === 'object', 'C7 requires C6 mastery_state_by_claim.');
  assert(typeof claimId === 'string' && claimId.length > 0, 'C7 adapter requires claim_id.');

  const masteryResult = c6Result.mastery_state_by_claim[claimId];
  assert(masteryResult && typeof masteryResult === 'object', `C7 requires a C6 result for claim ${claimId}.`);
  assert(Object.values(MASTERY_STATES).includes(masteryResult.mastery_state), `Invalid C6 mastery state for C7: ${masteryResult.mastery_state}`);
  assert(typeof masteryResult.development_id === 'string' && masteryResult.development_id.length > 0, `C6 result ${claimId} requires development_id.`);
  assert(Number.isInteger(masteryResult.evidence_count) && masteryResult.evidence_count >= 0, `C6 result ${claimId} requires non-negative evidence_count.`);

  return masteryResult;
}

function buildC7InputFromC6({
  c6_result,
  claim_id,
  evidence_state,
  ordering_state,
  alternative_state,
  prerequisite_state,
  supporting_evidence_ids,
  action_policy
}) {
  const masteryResult = validateC6ResultForC7(c6_result, claim_id);

  const input = {
    claim_id,
    current_development_id: masteryResult.development_id,
    mastery_state: masteryResult.mastery_state,
    evidence_state,
    ordering_state,
    alternative_state,
    prerequisite_state,
    supporting_evidence_ids: [...supporting_evidence_ids],
    action_policy: { ...action_policy }
  };

  validateNextActionDecisionInput(input);
  return input;
}

function validateC7OrderingAndAlternativeInputs({ ordering_state, alternative_state }) {
  assert(VALID_ORDERING_STATES.has(ordering_state), `Invalid C7 ordering_state: ${ordering_state}`);
  assert(VALID_ALTERNATIVE_STATES.has(alternative_state), `Invalid C7 alternative_state: ${alternative_state}`);
  return true;
}

export {
  validateC6ResultForC7,
  validateC7OrderingAndAlternativeInputs,
  buildC7InputFromC6
};
