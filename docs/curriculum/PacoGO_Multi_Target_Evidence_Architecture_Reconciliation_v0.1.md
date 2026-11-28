# PacoGO — Multi-target Evidence Architecture Reconciliation v0.1

Status: design reconciliation / candidate; not approved for runtime or persistence implementation  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Verified starting point: Full Regression #3026 / run ID `42218253663`, GREEN on `e0a4309f6ff92568df8051d8c4d00b050ba96bd7`

## 1. Purpose

Reconcile the multi-target task-attempt proposal with the existing C1–C9 contracts, C3 measurement proposals, and the scientific validation data specification. The immediate use case is B1-L06 / B1.TM2, whose ET1 and ET2 targets belong to different claims and developments.

This document is design-only. It does not approve a canonical C3 codebook, runtime changes, registry changes, catalogue changes, learner-state changes, database schema changes, Supabase changes, mastery thresholds, or next-action policy.

## 2. Governing source contracts

The reconciliation is constrained by:

- **C1:** claims are validated at claim level; task evidence must be evaluated against the claim it is intended to inform. A multi-target task does not itself validate either claim.
- **C2:** task instance, raw interaction/observation, evidence assessment, inference and decision are separate data layers. Raw observations remain immutable and traceable.
- **C3:** target-specific coding and provenance are required. Task alignment, response-to-target relation, evidence status, objective performance, process availability, assistance exposure, independence and contradiction are distinct dimensions. The v0.2 codebook proposal remains unapproved.
- **C4:** task opportunities and discriminating task/model comparisons must retain their specified claim/development meaning. A task target list is not proof that every target was elicited or demonstrated.
- **C5:** no developmental ordering, prerequisite or causal claim may be inferred merely because evidence from one task is attributed to multiple developments.
- **C6:** mastery is claim-, development-, scope- and time-bounded, and depends on seven explicit gates.
- **C7:** next-action decisions consume explicit C6 outcomes and action-specific ordering states; they do not reconstruct mastery or infer missing ordering.
- **C8:** each temporal learner record has consistent learner, claim, development and scope identity. C8 describes supplied C6/C7 history; it does not create a new mastery or action decision.
- **C9:** vertical-chain validation checks structural continuity and rejects inconsistent chains; it does not repair them or establish scientific validity.
- **Validation Data Specification:** raw product interaction, curriculum-engine evidence and research-validation data have distinct purposes. Independent measures and research provenance must not be replaced by PacoGO's own outputs.

## 3. Reconciled record model

### 3.1 One administered task attempt / raw observation

One administered task-instance response episode is the immutable source record. It owns:
- stable task-attempt / observation identity and idempotency identity;
- task definition/version, task model and registry version;
- primary instructional/routing context;
- actual presentation, instructions, options and task variation;
- complete raw learner response, preserving raw and normalized forms;
- ordered interaction and assistance events;
- technical/data-quality and process-availability information;
- links to any target-specific assessments derived from this observation.

A retry, edit, selection change or help event within the same administered episode remains an event in that episode unless the task protocol explicitly defines a new administration. A separately administered task instance is a separate observation.

### 3.2 Target-specific assessment units

A target-specific assessment is a derived, versioned assessment linked to the single raw observation. Each assessment must identify:
- source observation/task-attempt ID;
- evidence-target ID;
- registry-resolved owning claim and development;
- response path / event references that support the assessment;
- objective performance and scoring-rule provenance, where applicable;
- target-specific C3 coding dimensions and codebook/coder provenance, when coded;
- target-specific uncertainty, contradiction and rationale, where assessed.

The registry is authoritative for target → claim → development attribution. The task's primary claim/development is routing context only; it must never overwrite the target's actual owner.

A task model's target list is a set of possible evidence opportunities. It does not automatically create a target assessment or imply that the target evidence is present. A target assessment is created only when the task/response relationship can be justified under the applicable contract.

### 3.3 Do not flatten

For B1.TM2:
- ET1 and ET2 remain separate target assessments;
- the total response and equation-selection response remain separate raw facts;
- correct-total / wrong-equation and wrong-total / correct-equation remain distinguishable;
- neither target is assigned to the other's claim/development;
- no combined correctness value substitutes for target-level facts.

## 4. C6–C9 implications

### 4.1 C6: separate mastery contexts

Target assessments may be linked to one source observation, but C6 must be evaluated in the appropriate claim/development/scope/time context. ET1 evidence owned by C1/D1 and ET2 evidence owned by C2/D2 must not be pooled into one cross-claim or cross-development mastery assessment.

A single task attempt can contribute relevant target-specific evidence to more than one separately scoped evidence pool only when each target assessment is valid for that pool. It cannot satisfy all seven C6 gates by itself merely because it contains multiple target assessments.

Coverage is evaluated per claim/development/scope against the explicitly supplied coverage requirements. Target coverage requires relevant and adequate target-specific evidence, not merely presence of a target ID in the task definition.

### 4.2 C6 independence and repeated signals

The source attempt ID is the unit used to prevent duplicate counting after target assessments are expanded. Two target assessments from one attempt are never two independent attempts.

However, distinct attempt IDs do not automatically establish independence. The C6 independence gate must consume the target-specific independence judgement and actual assistance/event provenance under an approved C3 codebook and applicable task-support policy. Repeated or dependent signals must not be treated as independent solely because they have different database IDs.

Variation and stability are also assessed within their explicit C6 scope and rules; target expansion must not inflate their counts.

### 4.3 Contradiction remains target-specific

A contradiction or counterevidence assessment is attached to the target/claim interpretation it challenges and links back to the source observation. An incorrect answer, task mismatch, missing process or help event is not automatically a contradiction. C3's approved definitions and evidence status are prerequisites.

### 4.4 C7: no cross-development action blending

C7 consumes the C6 outcome and explicit ordering states for the relevant decision context. A multi-target task does not itself authorize progression, prerequisite inference or a combined next action. A target assessment owned by another development may inform that development's own evidence history, but it does not change the primary task routing context or bypass C6/C7 gates.

### 4.5 C8: separate temporal records

C8's learner/claim/development/scope identity remains singular and internally consistent. Where one observation yields target assessments for two different developments, those assessments may be referenced by separate C8 development records through their own C6/C7 decision histories. Do not create one C8 record containing mixed claim/development identity.

### 4.6 C9: validate linked branches without identity collapse

C9 should validate each claim/development vertical slice using the target assessment that belongs to that slice. Shared source-observation identity is permitted and should remain traceable. C9 must not require the task's primary claim to equal every target assessment's owning claim; it must instead verify:
- task/registry target opportunity is valid;
- target assessment references the source observation;
- target, claim and development resolve consistently through the registry;
- each C6/C7/C8 branch uses one coherent claim/development/scope identity;
- no target assessment is counted as a second raw observation.

This is a proposed validation interpretation, not an authorization to alter C9 runtime or tests.

## 5. C1/C3 and scientific-validation boundary

Machine-scored facts such as a selected option or numeric total may be objectively scored under an explicit task scoring rule. That is not the same as a completed C3 evidence assessment.

Until the C3 v0.2 reconciliation is explicitly approved and a canonical codebook/schema is authored:
- do not label machine correctness as C3 quality, relevance, evidence status, independence or contradiction;
- do not choose between conflicting quality scales or historical vocabularies;
- do not translate historical coded values mechanically;
- preserve raw process and assistance events separately;
- retain coder, codebook, coding-round and adjudication provenance when human coding is later performed.

A structurally valid target assessment does not validate the underlying claim. C1 claim validation and the independent/external measures in the Validation Data Specification remain separate research requirements.

## 6. Persistence and compatibility gate

The current persistence candidate of one row per task attempt with nested target assessments in JSONB is plausible but not yet selected. The scalar `evidence_target_id` column cannot represent all target ownerships in a multi-target attempt.

Before selecting persistence architecture, inspect and specify:
- every consumer of the scalar target/claim/development columns;
- constraints, indexes, RPC validation, views and history-loading behavior;
- whether the scalar field is a primary-target index, nullable for multi-target attempts, or superseded by a normalized child relation;
- target-assessment identity and versioning;
- idempotency/replay semantics for the one source attempt;
- legacy single-target row read compatibility;
- how one attempt fans out into separate C6/C7/C8 contexts without duplicate independent counts;
- retention and auditability of raw observations and derived assessments.

Do not create duplicate rows sharing one source-event identity where the existing unique constraint prevents it. Do not change Supabase or any schema until this decision is explicit and the full consumer path is inspected.

## 7. Required contract tests before runtime implementation

At minimum, a future implementation must prove:

1. Registry resolution assigns every target to its own claim/development.
2. The task target opportunity set is exact and valid, without assuming every opportunity is assessed.
3. One immutable raw observation preserves complete responses and ordered events.
4. Each justified target assessment references the correct response/event path.
5. Mixed target outcomes remain distinguishable.
6. One source attempt remains one raw observation after assessment expansion.
7. C6 evidence pools remain separate by claim/development/scope.
8. Coverage is target-specific and uses only relevant/adequate assessments.
9. Independence does not increase through target expansion and is not inferred from distinct IDs alone.
10. Variation, stability and contradiction are not inflated or flattened by expansion.
11. C7 actions remain tied to their C6 context and explicit ordering policy.
12. C8 records retain singular learner/claim/development/scope identity.
13. C9 validates each linked vertical branch without collapsing target ownership.
14. Legacy single-target histories remain readable and semantically unchanged.
15. Replay/idempotency does not duplicate the source attempt or its derived assessments.

## 8. Open gates and implementation decision

The architecture-level separation is now clear, but implementation is still blocked by unresolved source contracts:

1. C3 v0.2 is not approved. The canonical codebook vocabulary, quality anchors, assistance/independence boundaries, contradiction states and coding cardinality remain open.
2. The singular-versus-array observation/schema conflict is unresolved. A canonical versioned schema and migration/compatibility plan are required before persistence changes.
3. Scalar database column semantics and all consumers have not yet been fully reconciled for multi-target attempts.
4. Existing runtime mastery/inference semantics must be mapped against the claim/development-scoped fan-out described here, without silently changing thresholds.
5. The C7/C8/C9 contracts and runtime validators must be tested against a shared source observation feeding separate target-specific branches.

**Decision:** accept the conceptual distinction between one raw task attempt and multiple target-specific assessments as the required architecture direction. Do not yet approve runtime or persistence implementation. Continue with a focused contract reconciliation of C3/schema cardinality and C6–C9 fan-out semantics before B1-L06 is added to the learner catalogue or browser runtime.

## 9. Non-goals

This document does not implement B1-L06, change curriculum meaning or mappings, authorize a new registry version, set mastery thresholds, select next-action policy, establish empirical validity, approve the C3 codebook, or authorize Supabase changes.
