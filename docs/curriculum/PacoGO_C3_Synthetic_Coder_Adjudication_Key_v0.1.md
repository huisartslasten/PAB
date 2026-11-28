> **ARCHIVED SYNTHETIC ADJUDICATION KEY — NOT PART OF LEARNER RUNTIME.** The human-coder/adjudication workflow that this key assumes has been withdrawn. Do not use it as an operational learner-assessment artifact or implementation requirement.

# PacoGO C3 — Synthetic Coder Adjudication Key v0.1

Status: Restricted companion to the blinded synthetic coder packet / candidate adjudication guidance / not an approved canonical codebook
Branch: `refactor/professional-v1`

## 1. Handling restriction

**Do not distribute this file to coders before their independent coding records have been submitted and locked.**

This key is for the coordinator/adjudicator after independent coding. It gives expected conceptual boundaries from the synthetic anchor exercise and proposal v0.2. It is not a universal answer key and must not be used to force agreement where the case description does not justify a unique category.

Preserve all original independent coder records. Adjudication is a new linked record; never overwrite the initial coding.

## 2. Governing adjudication rules

1. Keep task-instance alignment, response-to-target relation, evidence status, objective performance, process availability, assistance exposure, independence and contradiction separate.
2. Make every evidence/independence/contradiction judgement target-specific.
3. One response episode remains one raw observation even if it receives multiple target-specific assessments.
4. Correctness does not automatically establish evidence quality, independence, contradiction or mastery.
5. Missing process material is not evidence that the process was absent.
6. A task mismatch is not learner failure.
7. `NO_RESPONSE` is a raw event, not automatically `ABSENT`.
8. Do not infer unobserved causes, intentions or knowledge states.
9. If the supplied facts do not resolve a category boundary, retain `INDETERMINATE` or document the unresolved distinction. Do not invent a threshold.

## 3. Case-by-case adjudication guidance

### Case A — selection and coherent explanation

**Recognition target**
- Task-instance alignment: `ALIGNED`.
- Response-to-target relation: `DIRECT`.
- Evidence status: `PRESENT`, because the expected selection demonstrates the specified recognition evidence.
- Objective performance: `CORRECT`.
- Raw process availability: `COLLECTED`.
- Assistance: none recorded.
- Independence: `INDEPENDENT`.
- Contradiction: `ABSENT`, on the stated material.

**Reasoning target**
- Task-instance alignment: `ALIGNED`.
- Response-to-target relation: `DIRECT`.
- Evidence status: `PRESENT`, because the captured explanation is coherent with the required reasoning.
- Objective performance: `CORRECT` for the described response under the case's stated expected answer.
- Raw process availability: `COLLECTED`.
- Assistance: none recorded.
- Independence: `INDEPENDENT`.
- Contradiction: `ABSENT`, on the stated material.

Adjudication note: these are two target-specific assessments of one response episode, not two independent observations.

### Case B — expected selection, incompatible reasoning

**Recognition target**
- Task-instance alignment: `ALIGNED`.
- Response-to-target relation: `DIRECT`.
- Evidence status: `PRESENT` may be supported by the expected selection.
- Objective performance: `CORRECT` for the selection.
- Raw process availability: `COLLECTED`.
- Assistance: none recorded.
- Independence: `INDEPENDENT`.
- Contradiction: do not automatically transfer the reasoning conflict to the recognition target. Normally `ABSENT` on the stated recognition interpretation, unless the recognition target itself requires the conflicting process.

**Reasoning target**
- Task-instance alignment: `ALIGNED`.
- Response-to-target relation: `DIRECT`, because the task elicited the reasoning explanation.
- Evidence status: the required reasoning is not demonstrated by the incompatible explanation. Whether this is `ABSENT` or `INDETERMINATE` depends on whether the available explanation is sufficiently complete and the approved protocol permits a defensible negative judgement. The synthetic description signals a conflict but does not fully define a completeness threshold; record this as an anchor boundary if coders disagree.
- Objective performance: the selection is correct; the reasoning target's evidence is not established by that selection alone.
- Raw process availability: `COLLECTED`.
- Assistance: none recorded.
- Independence: `INDEPENDENT`.
- Contradiction: `PRESENT` for the reasoning target if the explanation materially conflicts with the target-required reasoning; record the exact conflict and rationale.

Adjudication note: the same explanation can be irrelevant to recognition but material to reasoning. Do not collapse the target assessments.

### Case C — misaligned task, incorrect item response

- Task-instance alignment: `MISALIGNED`.
- Response-to-target relation: `NONE` for the intended target, unless a separate defensible relation is demonstrated.
- Objective performance: `INCORRECT` as a description of the answer to the presented item.
- Raw process availability: `COLLECTED` for the answer.
- Evidence status for the intended target: normally `NOT_APPLICABLE` or `NOT_ASSESSED` under the approved task/target protocol, not `ABSENT` merely because the answer was wrong. The exact choice between these labels requires a final operational definition; the proposal treats `NOT_ASSESSED` as an alignment candidate and `NOT_APPLICABLE` as an evidence-status state.
- Contradiction: do not infer `PRESENT` from the wrong answer.

Adjudication note: this case deliberately exposes a label-boundary issue between alignment `NOT_ASSESSED` and evidence status `NOT_APPLICABLE`. Preserve it for anchor revision rather than pretending it is already resolved.

### Case D — correct answer after strategy-supplying prompt

- Task-instance alignment: normally `ALIGNED`, with actual administration condition recorded.
- Response-to-target relation: `DIRECT`.
- Objective performance: `CORRECT`.
- Raw process availability: `COLLECTED` for the prompt event; the case says no further process explanation is available.
- Assistance exposure: the prompt supplies the target strategy; record it as a target-relevant assistance event.
- Independence: not `INDEPENDENT`. The candidate judgement is `DEPENDENT` if the prompt supplies the target strategy, but the final `PROMPTED`/`DEPENDENT` boundary remains open and must be tested with explicit anchors. If the coder cannot apply a pre-approved boundary, `UNKNOWN` plus rationale is preferable to an invented rule.
- Evidence status: may be `PRESENT` for performance after assistance depending on the target definition; it does not establish independent performance.
- Contradiction: assistance alone does not make contradiction `PRESENT`.

Adjudication note: keep performance/evidence and independence separate.

### Case E — correct selection, reasoning process not collected

**Recognition target**
- Task-instance alignment: `ALIGNED`.
- Response-to-target relation: `DIRECT`.
- Evidence status: `PRESENT` may be supported for recognition.
- Objective performance: `CORRECT`.
- Raw process availability: the selection was collected; the explanation/process for reasoning was `NOT_COLLECTED`.
- Assistance: none recorded.
- Independence: `INDEPENDENT` only insofar as no assistance is recorded and the target's independence condition is satisfied; do not infer beyond the record.
- Contradiction: no contradiction is established by missing process.

**Reasoning target**
- Task-instance alignment: the task may not provide a defensible observable opportunity for reasoning if that target requires inspectable process. If the task was otherwise intended to elicit it, distinguish task design from failure to collect the process.
- Response-to-target relation: likely `INDETERMINATE` or `NONE` depending on whether the selection itself has any defensible relation to the reasoning target. Do not equate a correct selection with reasoning evidence.
- Evidence status: `INDETERMINATE` because required process material was not collected; `NOT_APPLICABLE` only if the task was not designed as an evidence opportunity for that target.
- Objective performance: selection is `CORRECT`; reasoning performance is `NOT_OBSERVED` / `NOT_SCORABLE` as applicable.
- Raw process availability: `NOT_COLLECTED` for explanation/process.
- Assistance: none recorded.
- Independence: `UNKNOWN` if the record is insufficient to make the target-specific judgement; otherwise explain the basis.
- Contradiction: `NOT_APPLICABLE` or `NOT_CODED` as appropriate; missing process is not contradictory evidence.

Adjudication note: separate what was captured from what was not captured.

### Case F — no response, cause unknown

- Raw response event: `NO_RESPONSE`.
- Objective performance: `NOT_OBSERVED`, unless a pre-specified protocol explicitly makes the non-response scorable.
- Raw process/collection: the absence of a response is observed; do not invent a missingness cause.
- Task-instance alignment: may be `ALIGNED` if the task was suitable, but the case may not establish all administration conditions; use `UNCLEAR` if necessary.
- Response-to-target relation: `INDETERMINATE` or `NONE` depending on the approved definition; no response does not establish a substantive relation.
- Evidence status: normally `INDETERMINATE` because the reason for non-response is unknown. `ABSENT` only if a pre-specified protocol justifies that interpretation under the actual administered conditions.
- Independence: `UNKNOWN` if no basis exists to judge it.
- Contradiction: no contradiction is established merely by non-response.

Adjudication note: do not infer refusal, lack of knowledge, disengagement, misunderstanding or technical failure without observations.

## 4. Expected disagreement points to preserve

The following are not to be artificially resolved in this exercise:

- Case B: when an incompatible explanation supports `ABSENT` versus `INDETERMINATE` evidence status, depending on completeness and protocol.
- Case C: exact operational boundary between alignment `NOT_ASSESSED` and evidence status `NOT_APPLICABLE`.
- Case D: exact `PROMPTED` versus `DEPENDENT` boundary when a prompt supplies the strategy.
- Case E: whether the selection has any response-to-target relation to a reasoning target when process is missing.
- Case F: whether task alignment can be judged confidently when the response is absent and administration metadata is limited.

These are useful findings about the candidate anchors, not coder failures by default.

## 5. Adjudication record

For each disagreement, record:
- case ID and target;
- original coder IDs and unmodified codes;
- exact dimension in disagreement;
- supporting case details cited by each coder;
- whether the disagreement is due to missing information, ambiguous wording, category overlap, or different interpretation;
- resolution, if a defensible resolution exists;
- rationale and any new anchor wording;
- unresolved status where no defensible resolution exists;
- adjudicator ID, date and version.

Do not overwrite independent records. The adjudicated record is a separate linked record.

## 6. What this key does not establish

This key is a provisional conceptual guide derived from the synthetic anchor exercise and proposal v0.2. It does not establish:
- an approved canonical codebook;
- empirical coder reliability;
- a final quality scale or reliability coefficient/threshold;
- construct validity, mastery validity or next-action validity;
- scientific validation of PacoGO.

A small synthetic coding exercise can test clarity and feasibility only. Human coder agreement on these cases is not evidence that PacoGO's learning or mastery claims are valid.
