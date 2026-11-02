# PacoGO C2 — Empirical Student Data Model v0.1

Status: Candidate / design-only / [O]

## 1. Purpose

C2 defines the minimum auditable data structure needed to connect repeated learner observations to curriculum claims while keeping observation, evidence assessment and inference separate.

## 2. Data layers

### Layer 1 — Learner/context

Contains a pseudonymous learner identifier and study-relevant context:

- learner_id (pseudonymous);
- study_id;
- wave/session identifier;
- age/grade when relevant to the study;
- language/context variables defined by the protocol;
- relevant instruction/exposure metadata;
- accessibility/accommodation metadata when relevant.

Identity data must remain outside the curriculum evidence dataset.

### Layer 2 — Task instance

Stores:

- task_instance_id;
- registry_version;
- skill_id;
- development_id;
- claim_id;
- evidence_target_ids;
- task_model_id;
- task variation metadata;
- prompt/instruction version;
- representation/context metadata;
- planned role: defining/discriminating/variation/transfer/repeated.

### Layer 3 — Interaction/observation

Stores what actually happened, without developmental interpretation:

- interaction events;
- response/output;
- correctness where objectively defined;
- response time where valid and pre-specified;
- selected representation(s);
- strategy/process indicators where observable;
- explanation/justification where collected;
- hints/prompts/interventions;
- completion/abandonment;
- technical quality flags.

### Layer 4 — Evidence assessment

Stores an explicit assessment of how the observation bears on an evidence target:

- evidence_id;
- target_id;
- relevance;
- quality;
- contradiction flag;
- coding method;
- coder/version;
- confidence or ambiguity flag;
- rationale.

### Layer 5 — Inference

Stores model-based interpretation separately:

- inference_id;
- evidence_ids;
- candidate development;
- alternative explanations considered;
- inference state;
- uncertainty;
- model/protocol version.

### Layer 6 — Decision

Stores the curriculum-engine decision separately from the empirical record:

- decision_id;
- inference_id;
- mastery state if applicable;
- next action;
- decision rule version;
- reason;
- timestamp.

## 3. Provenance requirements

Every observation that can enter empirical analysis must be traceable to:

`learner → study/wave → task instance → registry version → claim → evidence target → observation`

Every inference must be traceable further to its evidence records and the protocol/model version used.

## 4. Immutable raw observation principle

Raw interaction and observation records are never overwritten by later interpretation. Corrections create a new coded/derived record with provenance to the original observation.

This prevents later curriculum assumptions from rewriting the empirical source data.

## 5. Missingness

Missing data must distinguish at minimum:

- not administered;
- technical failure;
- learner did not respond;
- learner abandoned;
- observation unavailable;
- intentionally skipped by protocol.

Missingness must not silently become incorrect, zero, failure or no evidence.

## 6. Instruction/exposure separation

Instruction received before or between observations is a separate variable. A later performance change cannot be interpreted as spontaneous developmental ordering if it may reflect targeted instruction.

## 7. Longitudinal identity

Repeated waves must use a stable pseudonymous learner identifier while keeping personally identifying information outside the research dataset.

The data model supports repeated measures but does not itself establish temporal ordering, prediction, prerequisite status or causality.

## 8. Privacy boundary

The empirical dataset should contain the minimum data necessary for the research question. Identity, contact information and operational account data remain outside the curriculum evidence tables.

No personally identifying information is required for C1-C5 analytical logic.

## 9. C2 quality gate

A dataset is analytically ready only when:

- provenance is complete;
- registry version is known;
- task/claim/evidence-target links resolve;
- raw observations are preserved;
- missingness is coded explicitly;
- exposure metadata required by the protocol is available;
- derived evidence/inference records can be reproduced from the source observations.

C2 is a data-model specification, not evidence that the model is empirically sufficient.
