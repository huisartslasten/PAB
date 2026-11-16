const RELIABILITY_STATUS = new Set([
  'NOT_ASSESSED',
  'ASSESSMENT_PENDING',
  'ACCEPTABLE_FOR_PILOT_CODING',
  'UNRELIABLE_FOR_INFERENCE'
]);

const MEASUREMENT_GATE_STATE = Object.freeze({
  READY_FOR_C4: 'READY_FOR_C4',
  BLOCKED_BY_CODING_RELIABILITY: 'BLOCKED_BY_CODING_RELIABILITY',
  REVISE_PROTOCOL: 'REVISE_PROTOCOL'
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function evaluateC4Readiness({ pilotResult, reliabilityByClaim }) {
  assert(pilotResult && typeof pilotResult === 'object', 'pilotResult must be an object.');
  assert(pilotResult.c4_readiness_state_by_claim && typeof pilotResult.c4_readiness_state_by_claim === 'object', 'pilotResult must contain c4_readiness_state_by_claim.');
  assert(reliabilityByClaim && typeof reliabilityByClaim === 'object', 'reliabilityByClaim must be an object.');

  const readiness = {};
  for (const [claimId, pilotGate] of Object.entries(pilotResult.c4_readiness_state_by_claim)) {
    const reliability = reliabilityByClaim[claimId];
    assert(reliability && typeof reliability === 'object', `Missing coding-reliability review for ${claimId}.`);
    assert(RELIABILITY_STATUS.has(reliability.status), `Invalid coding-reliability status for ${claimId}: ${reliability.status}`);

    let state = MEASUREMENT_GATE_STATE.READY_FOR_C4;
    if (!pilotGate.c4_ready || pilotGate.independent_code_count < 1) {
      state = MEASUREMENT_GATE_STATE.REVISE_PROTOCOL;
    } else if (reliability.status !== 'ACCEPTABLE_FOR_PILOT_CODING') {
      state = MEASUREMENT_GATE_STATE.BLOCKED_BY_CODING_RELIABILITY;
    }

    readiness[claimId] = {
      measurement_gate_state: state,
      pilot_c4_ready: pilotGate.c4_ready,
      independent_code_count: pilotGate.independent_code_count,
      coding_reliability_status: reliability.status,
      double_coded_pair_count: reliability.double_coded_pair_count ?? null,
      agreement_rate: reliability.agreement_rate ?? null,
      unpaired_group_count: reliability.unpaired_group_count ?? null,
      c4_decision_state: 'NOT_TESTED'
    };
  }

  return {
    readiness_by_claim: readiness,
    all_claims_ready_for_c4: Object.values(readiness).every(item => item.measurement_gate_state === MEASUREMENT_GATE_STATE.READY_FOR_C4),
    developmental_conclusion_allowed: false,
    registry_promotion_allowed: false,
    mastery_rule_change_allowed: false,
    developmental_ordering_inference_allowed: false
  };
}

export { evaluateC4Readiness, MEASUREMENT_GATE_STATE, RELIABILITY_STATUS };
