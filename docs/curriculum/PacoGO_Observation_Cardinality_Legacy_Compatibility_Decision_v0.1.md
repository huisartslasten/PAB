# PacoGO — Observation Cardinality & Legacy Compatibility Decision v0.1

Status: proposed contract decision / design-only / not approved for implementation  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Verified starting point: Full Regression #3027 / run ID `42219020009`, GREEN on `1ab93d17c0afbc782b10641c36e38824ac201578`

## 1. Purpose

Resolve the next design gate from handoff section 43: define the logical cardinality between one administered task attempt, its raw observation and zero or more target-specific assessments; define a non-destructive read strategy for existing single-target history; and identify the current runtime/persistence blockers.

This is a proposed contract decision. It does not approve C3 codebook v0.2, a production schema, runtime implementation, a migration, Supabase changes, new mastery thresholds or curriculum changes.

## 2. Findings from exact-branch inspection

Inspected on `refactor/professional-v1` after Full Regression #3027:

- `PacoGO_C2_Student_Data_Model_v0.1.md`
- `PacoGO_Empirical_Observation_Schema_v0.1.json`
- `PacoGO_Pilot_DataSchema_v0.2.json`
- `PacoGO_C3_Consolidated_Observation_Event_Coding_Contract_Reconciliation_v0.1.md`
- `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md`
- `PacoGO_Validation_Data_Specification_v0.1.md`
- `interaction-contract.js`, `curriculum-registry.js`, `prototype.js`
- `learner-curriculum-service.js`
- evidence, learner-state and decision-trace migrations, including the current `persist_curriculum_learning_cycle` RPC definition.

### 2.1 Confirmed current contracts

1. C2 defines separate task-instance, raw observation, evidence assessment, inference and decision layers. Raw observation is immutable.
2. The empirical observation schema allows one or more `evidence_target_ids`, but Pilot_DataSchema v0.2 has one scalar `evidence_target_id` and one embedded `coding_record`.
3. C3 reconciliation requires one raw response episode to be capable of linking to multiple separately justified target assessments, while retaining coder/round/adjudication provenance. The C3 v0.2 codebook remains unapproved.
4. `createTaskInstance()` stores one primary claim/development plus an array of target IDs. `createObservation()` emits only the first target ID as `evidence_target_id`.
5. `curriculum-registry.js` and `prototype.js` assess one scalar target and emit one evidence assessment for the whole observation. Development inference and coverage then use that scalar evidence item.
6. `learner-curriculum-service.js` stores the full observation and assessment JSON objects, but also writes scalar claim/development/target columns. History loading reconstructs one scalar evidence item; it does not expand target-specific assessments.
7. `student_evidence` has one row per source event enforced by a unique index on `(student_key, source_event_id)`. Its claim/development/target columns are nullable. The RPC atomically inserts one evidence row, upserts one longitudinal-state row per learner/registry/skill and inserts one decision trace per source event.
8. The current longitudinal-state row is skill-scoped, and the current engine cycle returns one development/mastery/next-action result. It does not yet implement separate C6/C7/C8 branches per claim/development/scope.

These findings mean that nested JSONB can preserve the raw response, but storage alone does not solve target attribution, inference fan-out, C6 independence counting or separate C8 histories.

## 3. Proposed canonical logical cardinality

Adopt the following logical cardinality as the design direction:

```
Task definition (versioned opportunity specification)
             1
             |
             *
Administered task instance / attempt
             1
             |
             1
Immutable raw observation episode
             1
             |
             0..*
Target-specific assessment records
             |
             0..*
Coder / round / adjudication records
```

### 3.1 Task definition

The task definition specifies planned target opportunities and task content. It does not prove which targets were actually elicited or demonstrated in a particular administration.

### 3.2 Administered attempt and raw observation

One separately administered task-instance response episode is one raw observation. It contains the actual presented content, raw response, ordered events, support/assistance events, collection availability, technical quality and exact version provenance.

Retries, edits, selection changes and help events remain events inside the same episode unless the task protocol explicitly starts a new administration. A separately administered attempt receives a new observation identity.

The raw observation is stored once and is never duplicated to create target assessments.

### 3.3 Target-specific assessment

A target assessment is a separately identified, versioned interpretation of one observation against one evidence target. It references:
- the source observation ID;
- the evidence-target ID;
- registry-resolved claim and development;
- the relevant response/event path;
- scoring-rule version for objective scoring, where applicable;
- C3 codebook, coder, coding round and adjudication provenance when applicable;
- target-specific status, uncertainty and rationale as defined by the approved C3 contract.

Zero assessments is valid when no target relationship can be justified. One observation may have several assessments, but they are not separate observations and do not automatically establish independent evidence.

## 4. Persistence recommendation — logical model first

### 4.1 Preferred initial storage shape to evaluate

For the existing product persistence boundary, the least disruptive candidate is:

- one `student_evidence` row per administered task attempt / source event;
- immutable raw observation retained in the existing `observation` JSONB object;
- a versioned array of target-specific assessment envelopes retained under the existing `evidence_assessment` JSONB object;
- one stable `source_event_id` for the attempt, preserving the current idempotency key;
- no duplicate `student_evidence` rows for each target.

Illustrative shape only (not an approved wire schema):

```json
{
  "schema_version": "candidate",
  "assessment_cardinality": "zero_or_many",
  "target_assessments": [
    {
      "target_assessment_id": "stable-assessment-id",
      "evidence_target_id": "B1.ET1",
      "claim_id": "B1.C1",
      "development_id": "B1.D1",
      "response_refs": ["equation-selection"],
      "assessment_version": "candidate"
    },
    {
      "target_assessment_id": "stable-assessment-id",
      "evidence_target_id": "B1.ET2",
      "claim_id": "B1.C2",
      "development_id": "B1.D2",
      "response_refs": ["total-entry"],
      "assessment_version": "candidate"
    }
  ]
}
```

The example deliberately omits C3 quality, independence, contradiction and evidence-status values because the canonical codebook is not approved. Objective performance facts may be linked to each target only through an explicit, versioned scoring contract.

### 4.2 Scalar compatibility columns

For new records:
- If exactly one target assessment exists, legacy scalar target/claim/development columns may be populated only when they unambiguously describe that one target and are consistent with registry resolution.
- If zero or multiple target assessments exist, the scalar target/claim/development columns should be null rather than falsely representing the whole observation as belonging to one target.
- Task-level routing context remains in the raw observation/task metadata; it must not be substituted into target ownership columns.

This is a proposed compatibility rule. It must be checked against every database consumer and reporting query before implementation.

### 4.3 Why not duplicate one row per target

Rejected:
- one student_evidence row per target assessment, all sharing the same source event ID.

Reason:
- the current unique index intentionally permits only one evidence row per learner/source event;
- duplicating the source response would inflate observation counts and could falsely inflate independence, stability or variation;
- the duplicated rows could drift in raw response, timestamps or provenance;
- it would blur the distinction between source observation and derived target assessment.

### 4.4 JSONB array versus normalized child table

The JSONB array is a plausible first product persistence envelope because the existing service and RPC already accept full JSON objects and one row per source event. It is not automatically the best canonical research store.

A normalized child relation may be preferable for research coding because coder × target × round × adjudication records require independent provenance, queryability and immutable revisions. The product runtime store and research coding store may therefore need separate projections with shared stable observation IDs.

Decision: retain the logical one-to-many model; do not yet choose JSONB-only versus normalized child table as the final canonical research schema. The product JSONB envelope is the leading compatibility candidate, subject to query/consumer and governance review.

## 5. Legacy single-target read compatibility

Historical records must not be rewritten or recoded as part of compatibility.

A future read adapter should apply these rules:

1. If a record contains a versioned `target_assessments[]`, read those target assessments and retain the one parent observation identity.
2. If a record has only the historical scalar `evidence_target_id` and no target-assessment array, expose a virtual legacy target-assessment view for that one target, linked to the original evidence row and original observation.
3. Mark that virtual view with its original schema/assessment provenance. Do not invent coder, codebook, quality, independence or contradiction information that is absent.
4. Preserve the original scalar fields and historical assessment object exactly. Do not mechanically translate old `MATCH/MISMATCH/UNCLEAR`, numeric quality or boolean contradiction into C3 v0.2 candidate vocabulary.
5. A legacy record with no target ID remains unassigned/unknown; do not infer its target from a current task definition or registry mapping without contemporaneous provenance.
6. New target assessments must have stable IDs and explicit source-observation references. Replays must not create duplicate source attempts or duplicate derived assessments.

The adapter is a read interpretation only; it does not mutate persisted rows.

## 6. Engine projection and counting invariants

The future engine may construct target-specific evidence views for assessment/inference, but each view must retain the same `source_observation_id`.

Required invariants:

- Raw observation count is the count of distinct source observation IDs.
- Target assessment count is the count of target-specific assessment IDs.
- C6 evidence pools are partitioned by learner, claim, development, scope and time context.
- A target assessment can enter only the C6 pool resolved for its own target.
- Coverage counts only relevant/adequate target assessments under approved criteria, not task target declarations.
- Independence counts distinct qualifying source attempts under target-specific C3 judgement; multiple assessments from one attempt cannot increase the count.
- Different attempt IDs alone do not prove independence.
- Stability and variation must use the specified task/attempt units and cannot be inflated by assessment expansion.
- Contradiction is target-specific and must retain the exact source material and rationale.
- C7 consumes the appropriate C6 branch and explicit ordering states; it does not combine branches.
- C8 maintains separate coherent learner/claim/development/scope histories.
- C9 validates each branch and preserves links to the shared source observation.

## 7. Current runtime and persistence blockers

The current implementation cannot safely accept B1-L06 merely by placing two target objects in JSONB:

1. The interaction contract exposes one target ID on each observation.
2. The registry rule assesses one scalar target.
3. The engine emits one assessment, one development inference, one mastery result and one next action.
4. The prior-evidence adapter returns one scalar evidence item.
5. The state table and runtime state currently operate at learner/registry/skill granularity, while C6–C8 require claim/development/scope-specific decision histories.
6. The persistence RPC writes one evidence row, one skill-level state and one trace per source event. This is compatible with a single source observation, but the current payload and engine cannot yet express multiple target-specific branches correctly.
7. The C3 codebook and observation schema remain candidate/unapproved; objective scoring must not be silently promoted to C3 evidence quality or mastery evidence.

Therefore no runtime or persistence implementation is approved by this document.

## 8. Required decision gates before implementation

1. Explicitly approve the logical one-observation-to-zero-or-many-target-assessments cardinality.
2. Approve C3 target-specific assessment dimensions and coder/adjudication cardinality, or define a clearly separate machine-scored operational assessment contract that does not claim C3 coding.
3. Complete a consumer inventory for scalar `evidence_target_id`, `claim_id`, `development_id`, skill-level state, decision trace and all history readers.
4. Decide the canonical product storage envelope and whether scientific coding requires a normalized child relation.
5. Define C6 branch identity and how multiple claim/development/scope states are represented in the learner-state contract.
6. Define C7/C8/C9 fan-out and audit invariants in executable contract terms.
7. Define idempotent replay semantics for source observation and each derived target assessment.
8. Produce a non-destructive historical read adapter specification and tests.
9. Only then design implementation; run Full Regression before and after any code change.

## 9. Decision

**Accepted as proposed logical contract direction:** one administered attempt produces one immutable raw observation and zero or more separately versioned target-specific assessments.

**Rejected:** duplicating source evidence rows per target; treating task target lists as completed assessments; using the task's primary claim/development to overwrite target ownership; counting target assessments as independent observations.

**Not yet decided:** JSONB-only versus normalized target-assessment storage for the canonical research dataset; exact scalar-column compatibility at write time; C3 coding fields; C6–C9 runtime/state representation.

B1-L06 remains design-only. No runtime, tests, catalogue, registry, Supabase, database schema, learner state or data changed.

## 10. Non-goals

This document does not approve C3 codebook v0.2, change curriculum meaning, implement multi-target inference, set mastery thresholds, select next-action policy, claim empirical validity, or authorize Supabase changes.
