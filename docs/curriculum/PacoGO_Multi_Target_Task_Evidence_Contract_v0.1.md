# PacoGO — Multi-target Task Evidence Contract v0.1

Status: architecture design proposal; not implemented  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Baseline: Full Regression #3024 / run ID `42216716227`, GREEN on `a97c299b3b7c441aefaefe8c35570defbc71aaeb`

## 1. Purpose

Define the evidence contract required when one learner task intentionally elicits more than one evidence target, potentially belonging to different claims or developments. This is required before implementing B1-L06 (representation mapping).

The design preserves raw task responses and prevents one task attempt from being counted as multiple independent attempts merely because it yields multiple target-specific evidence facts.

This is a design proposal only. It does not modify runtime, registry, learner catalogue, persistence, Supabase, mastery thresholds or next-action rules.

## 2. Confirmed current contract and defect

Inspection of the current branch established:

1. `createTaskInstance()` stores one scalar `claim_id` and one scalar `development_id`, alongside an array of evidence-target IDs.
2. `createObservation()` exposes only `evidence_target_id: taskInstance.evidence_target_ids[0]`.
3. `curriculum-registry.js` assesses relevance using that one scalar target ID and calculates one scalar quality value for the whole observation.
4. `prototype.js` stores one assessed evidence item per observation. Development inference attributes it to the observation's scalar `development_id`; mastery coverage reads one scalar `evidence_target_id`.
5. The B1 catalogue test currently assumes every target on a task belongs to the task's single `claim_id`.
6. In registry v0.4, B1.TM2 deliberately maps to `[B1.ET1, B1.ET2]`. ET1 belongs to B1.C1 / B1.D1, while ET2 belongs to B1.C2 / B1.D2. Therefore a TM2 task cannot truthfully represent both targets with the current single-claim observation contract.
7. `learner-curriculum-service.js` passes the complete observation object into the `observation` JSONB field. That preserves nested raw response data without lossy field selection. However, the top-level evidence row and current inference path still represent only one target and one quality assessment.

**Conclusion:** raw response persistence can preserve both learner responses, but the current evidence/inference contract cannot assess and attribute both target facts correctly. This is an engine contract gap, not a UI limitation. Do not implement B1-L06 by flattening the responses into one correctness value or by assigning ET1 to C2.

## 3. Required distinction: task attempt vs target evidence

The model must distinguish two related but non-identical concepts.

### A. Task attempt (one learner interaction episode)

One task attempt owns:
- task ID and task-definition version;
- task-model ID;
- primary skill/development/claim context for task routing;
- all task-level presentation details;
- the complete ordered interaction event stream;
- the raw learner response object;
- one stable task-attempt identity and source-event/idempotency identity;
- global support/prompt provenance for that attempt.

A task attempt is persisted once, even when it elicits several evidence targets.

### B. Target evidence (one assessable fact within that attempt)

Each target evidence item owns:
- evidence-target ID;
- claim ID and development ID resolved from the curriculum registry, not copied from the task's primary claim;
- the task-model ID and parent task-attempt ID;
- an explicit response path or event set supporting this target;
- target-specific correctness/quality/relevance/contradiction;
- target-specific coding status, with UNKNOWN retained where the process was not observed;
- the same task variation and support provenance, unless the task contract explicitly defines target-specific exposure.

For B1-L06:
- ET1 is assessed from the learner's submitted total relative to the visible quantity groups and is attributed to C1/D1.
- ET2 is assessed from the selected symbolic equation relative to the displayed groups and is attributed to C2/D2.
- Both facts remain linked to the same task attempt.
- A correct total with a wrong equation is a mixed response. A correct equation with a wrong total is also a mixed response.

The target evidence array must match the task model's exact declared target set. No extra or missing target may be silently inferred.

## 4. Proposed raw observation shape

The following is illustrative schema, not a final runtime API:

```js
{
  task_attempt_id: "stable-attempt-id",
  task_id: "B1-L06",
  task_model_id: "B1.TM2",
  skill_id: "B1",
  primary_development_id: "B1.D2",
  primary_claim_id: "B1.C2",
  evidence_target_ids: ["B1.ET1", "B1.ET2"],
  response: {
    type: "representation_mapping_with_total",
    addends: [6, 4],
    options: [
      { id: "option-a", addends: [6, 4], total: 10 },
      { id: "option-b", addends: [6, 3], total: 9 },
      { id: "option-c", addends: [6, 4], total: 11 }
    ],
    selected_option_id: "option-a",
    submitted_total_raw: "10",
    submitted_total: 10
  },
  target_evidence: [
    {
      evidence_target_id: "B1.ET1",
      response_path: "response.submitted_total",
      correctness: true,
      quality: 1
    },
    {
      evidence_target_id: "B1.ET2",
      response_path: "response.selected_option_id",
      correctness: true,
      quality: 1
    }
  ],
  interaction_events: []
}
```

Requirements:
- Preserve raw input separately from normalized value.
- Preserve every option and its mathematical content, not only labels.
- Preserve selected option ID and selection-change events.
- Target-specific correctness must be independently calculated.
- The example's option content is illustrative only; task authoring must validate exactly one mathematically correct option and prevent equivalent distractors.
- Do not store only a combined `correct` boolean as a substitute for target-specific facts.
- Independence remains UNKNOWN unless actual support conditions and events justify a code. This task is practice-only and makes no independence claim.

## 5. Registry-driven target attribution

The curriculum registry must be the source of target attribution.

For each target in the task model:
1. resolve the evidence target by ID;
2. resolve its owning claim;
3. resolve that claim's development;
4. validate that the target, claim and development belong to the task's skill;
5. create a target evidence unit with those resolved identifiers.

The task's primary claim/development remains useful for task routing and primary instructional intent, but must not overwrite target ownership. Cross-claim task models are valid only when their target-level attribution is explicit.

Catalogue validation must therefore:
- continue requiring exact equality between the task's target IDs and its task model's target IDs;
- validate each target against its own registry claim/development;
- stop requiring every target in a multi-target task model to belong to the task's single primary claim;
- reject target IDs that do not belong to the skill or task model.

Do not change the B1 registry mapping merely to satisfy the current validator.

## 6. Inference semantics

The engine must assess target evidence independently while retaining task-attempt identity.

Proposed normalized evidence unit:
- `task_attempt_id` (shared by all target units from one task);
- `evidence_target_id`;
- registry-resolved `claim_id` and `development_id`;
- target-specific `quality`, `relevant`, and `contradiction`;
- variation and support provenance;
- reference to the raw task observation.

The engine must not count two target units from one task attempt as two independent observations. At minimum:
- target coverage counts distinct target IDs with relevant evidence;
- independent-observation counts use distinct task-attempt IDs, not expanded target-unit count;
- variation counts use distinct eligible task attempts/variation keys according to the existing mastery contract;
- development support is attributed to the development owning the target;
- contradictions remain target-specific and traceable to the parent attempt.

These rules affect current inference semantics and must be reconciled against C1-C9 contracts and existing tests before implementation. Do not silently reinterpret current mastery thresholds.

The existing task model TM2 contains ET1 and ET2 from different claims/developments. A single B1-L06 attempt can therefore inform both C1 and C2, but it must not be treated as two independent learner attempts.

## 7. Persistence compatibility

The existing `student_evidence.observation` JSONB field preserves nested raw response structures. The existing persistence service passes the full observation object through, so the raw multi-response payload can be preserved without adding a new column.

A compatible candidate is:
- one persisted row per task attempt;
- the full raw task observation, including `target_evidence`, in JSONB;
- a target-assessment map in the existing `evidence_assessment` JSONB field;
- no duplicate rows sharing the same source-event ID;
- history loading expands the stored task attempt into target-level inference units;
- legacy rows with one scalar `evidence_target_id` remain readable through a compatibility adapter.

However, the current scalar `evidence_target_id` column cannot fully describe a multi-target task attempt. Before adopting this candidate, decide whether it remains a primary-target index only, becomes nullable for multi-target episodes, or is replaced by a normalized child table in a later explicit persistence migration. Inspect database constraints, RPC validation, indexes, views and all consumers before selecting. No Supabase DDL/DML is authorized by this document.

## 8. Automated contract tests required

Before implementing B1-L06, tests must prove:

1. A task model with multiple targets across claims/developments resolves each target to the correct registry claim/development.
2. Exact task-model target-set equality is enforced.
3. One task attempt preserves the complete raw response and ordered interaction events.
4. Each target receives its own correctness/quality assessment.
5. Mixed responses remain distinguishable and are not flattened.
6. One task attempt does not count as two independent observations.
7. Coverage records both target IDs only when each target's own evidence is relevant and adequate.
8. Development support is attributed to the target's owning development.
9. Persistence/read-back preserves the raw task observation and target-assessment map.
10. Legacy single-target observations continue to load and infer identically.
11. Existing B1-L01–L05, A1, B2, B3, B5, FR2 and the full regression remain unchanged unless a separate root-contract correction is designed and verified.

## 9. Non-goals and gates

This proposal does not:
- implement B1-L06;
- change any registry target, claim, development or task model;
- change mastery thresholds or next-action priorities;
- resolve ET7 or assessment-mode support rules;
- claim empirical validity;
- change the registry version pointer;
- modify Supabase schema, RPCs, RLS or learner data.

Before runtime implementation:
1. reconcile target-level inference with C1-C9 and the validation-data specification;
2. settle task-attempt vs target-evidence counting semantics;
3. settle the persistence representation and scalar-column compatibility;
4. specify replay/idempotency and legacy-history behavior;
5. then implement the smallest vertical slice with contract, engine, service, browser and Full Regression coverage.

## 10. Decision

**Stop before implementing B1-L06 on the current single-target evidence engine.** The response JSON can be preserved, but the current inference and attribution model cannot truthfully represent TM2's two target-specific facts across C1/D1 and C2/D2. Design and test the underlying multi-target evidence contract first.
