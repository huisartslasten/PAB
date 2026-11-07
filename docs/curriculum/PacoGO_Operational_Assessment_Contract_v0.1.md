# PacoGO — Operational Assessment Contract v0.1

Status: consolidated logical contract proposal; owner-confirmed learner-mode policy incorporated; unresolved C3 assessment rules and physical persistence remain unapproved
Date: 2026-11-06
Branch: `refactor/professional-v1`
Starting commit: `123127a3dd034d760d3d90876fde81a0ff8c3c70`
Starting Full Regression: #3081 / run ID `42318137979` — GREEN on the exact starting commit

## 1. Purpose and boundary

This document consolidates the valid learner-runtime parts of the existing observation, support, assessment and multi-target proposals into one operational assessment contract for PacoGO.

It distinguishes:
- what the learner was asked to do;
- what actually happened during the attempt;
- what PacoGO can assess from the captured information;
- what the curriculum decision engine may infer from that assessment.

This is a logical contract, not an implementation authorization. It does not approve new C3 labels, a numeric evidence-quality scale, physical database design, schema migration, RPC changes, Supabase changes, registry changes or changes to C1–C9 meanings and mastery rules.

PacoGO is the single operational assessor in the learner product. Its assessment behavior must be versioned, explicit and inspectable.

## 2. Source reconciliation and authority

The following source disposition applies to this contract.

| Source | Disposition in this contract |
|---|---|
| `PacoGO_Multi_Target_Owner_Architecture_Decisions_v0.1.md` | Logical authority for O1–O4 and O7–O8. O5, O6 and O9 remain open. |
| `PacoGO_Multi_Target_Implementation_Readiness_Matrix_v0.1.md` | Governs the implementation gates. G2/G3 and G5–G11 are not closed by this document's creation. |
| `PacoGO_Integrated_Multi_Target_Decision_Contract_v0.2.md` | Superseded for learner-runtime lifecycle details. Retain only the raw-observation/target-assessment separation, six-part branch identity, snapshot lineage and no-double-counting invariants where restated here. |
| `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md` | Superseded as an operational codebook. Retain conceptual distinctions only where they are restated here. Its candidate labels and unresolved scale choices are not approved by reference. |
| `PacoGO_C3_Consolidated_Observation_Event_Coding_Contract_Reconciliation_v0.1.md` | Historical reconciliation input. Retain the distinction between raw response facts, ordered events, assessment and downstream inference. Do not carry forward its obsolete assessment workflow. |
| `PacoGO_Scope_and_Time_Window_Lifecycle_Contract_v0.1.md` | Correction required before use. Event time and assessment-availability time remain distinct concepts; its unapproved lifecycle defaults are not adopted here. |
| `PacoGO_Task_Support_Conditions_and_Independence_Contract_v0.1.md` and `PacoGO_Task_Support_Condition_C3_Addendum_v0.1.md` | Source of the owner-confirmed learner modes and help-request interaction policy. Candidate assessment labels remain unapproved. |
| Historical coding manuals, synthetic packets, reliability layer and adjudication material | Archived inputs only. They do not define learner-runtime components or production gates. |

Where an older candidate conflicts with the owner-confirmed learner-mode policy or this contract, the owner-confirmed policy and this contract take precedence. No historical record is silently translated into a new vocabulary.

## 3. Fixed invariants

1. Existing SLO skills, developments, claims, evidence targets, task models, curriculum meanings and C1–C9 meanings remain unchanged.
2. One separately administered learner attempt is one learner episode. Events and retries within that attempt do not become extra independent attempts.
3. One raw observation is stored once. Multiple target assessments may reference it; they never duplicate the learner episode.
4. A task's target list describes intended opportunities. It does not prove that every target was actually elicited or demonstrated.
5. Objective correctness, target evidence, assistance exposure, independence, contradiction and mastery are distinct concepts.
6. A correct answer may be a useful performance fact for an applicable target. Correctness alone does not determine evidence quality, independence, contradiction, developmental status or mastery.
7. A missing or insufficient observation must not be converted into a negative learner result or a positive evidence claim.
8. C6 mastery remains governed by its existing gates and branch context. No single response or assessment attempt automatically awards mastery.
9. C7 consumes the exact applicable C6 result. C8 remains descriptive history. C9 remains structural validation.
10. Existing guardian ownership, RLS, direct-write denial, transaction-local write capability, rollback and other security boundaries remain unchanged.

## 4. Logical learner evidence lifecycle

### 4.1 Versioned task definition

A task definition describes the planned administration. It must identify, directly or by immutable references:
- stable task-definition identity and version;
- curriculum registry version;
- skill, task model and applicable curriculum context;
- intended evidence-target opportunities;
- response format and task-specific scoring rule/version, where applicable;
- planned support condition;
- actual task content, representation and relevant interface configuration.

A task-definition ID is not an attempt ID. Changing the task's meaning, scoring rule or material presentation configuration requires a new task-definition version.

### 4.2 Administered attempt

Each administration receives a unique attempt identity, distinct from the stable task-definition ID.

The attempt records:
- learner and task-definition references;
- learner-facing mode;
- start and end lifecycle;
- what was actually presented;
- ordered learner and system interaction events;
- whether the attempt completed, was abandoned or was ended as incomplete;
- references to any resulting raw observation.

A repeated administration is a new attempt, even when it uses the same task definition and numbers.

The exact ID format, retry/replay identity and persistence representation remain part of the G6/G8/G9 design gates.

### 4.3 Immutable raw observation

A raw observation preserves what happened; it does not contain a pre-decided mastery result.

Where present, it retains:
- unique observation and attempt references;
- learner and exact task-definition/version references;
- actual presented item, options, representation, instructions and response modality;
- raw learner response and ordered response attempts;
- objective performance facts produced by the task's versioned scoring rule;
- ordered interaction events, including help requests and support actually delivered;
- timestamps and their provenance;
- collection failures, unavailable process data and other technical limitations;
- source and collector provenance.

The raw observation is immutable. A correction to captured data must be linked and versioned; it must not silently overwrite the original episode.

An attempt ended before a scorable response still requires an inspectable incomplete-attempt record and its events. It must not be represented as an incorrect answer. Whether that record is physically represented as an observation with no response or as a linked attempt record is a schema decision that remains open.

### 4.4 PacoGO target-specific assessment

PacoGO assesses captured information against the existing curriculum contract.

Logical cardinality:
- one raw observation may have zero, one or multiple target-specific assessments;
- each target-specific assessment references exactly one raw observation and one evidence target;
- the target's claim and development are resolved through the exact curriculum registry version;
- a target assessment does not create another raw observation or independent attempt.

PacoGO must assess only targets for which the actual task instance and response provide a defensible basis. An intended target opportunity that was not elicited remains unassessed; it is not automatically positive or negative evidence.

Each assessment must preserve:
- source observation and attempt identity;
- exact evidence target and registry-resolved claim/development;
- assessment-contract and assessment-implementation version;
- assessment availability timestamp;
- the assessment result and any required rationale/provenance under the approved C3 rules.

The exact physical record, assessment identity, correction lifecycle and field vocabulary remain open. No schema or database change is approved here.

## 5. Assessment dimensions that must remain separate

The following questions must not be collapsed into one score or inferred from one another.

### 5.1 Task-instance alignment

Did the task as actually presented provide a defensible opportunity to observe the specified target?

This concerns the administered task, not whether the learner succeeded. A task mismatch is not a learner failure.

### 5.2 Response-to-target relation

How does the learner's actual response or process relate to the specified target?

A response may be correct for the presented item without demonstrating the intended target. The relation must be assessed against the target definition, not inferred from correctness alone.

### 5.3 Objective performance

What can be scored directly from the response under the task's explicit, versioned scoring rule?

Keep the raw response and scoring-rule provenance. Do not convert this performance fact automatically into an evidence-quality value or mastery result.

### 5.4 Process availability

Was the process information needed for a particular assessment actually collected and available?

Distinguish information that was not requested, not collected, unavailable because of a technical failure, or not applicable under the task. Do not interpret missing process as proof that a learner did not use a strategy.

### 5.5 Target-specific evidence judgement

Does the available response/process demonstrate the evidence required by this particular target under an approved assessment rule?

This judgement is target-specific. It is not the same as task alignment, response relation or objective correctness. Exact result categories and decision anchors remain open under O6.

### 5.6 Assistance exposure and independence

Preserve planned support condition, learner help request and support actually delivered as separate facts.

Any independence interpretation is target-specific and must use observed assistance events and the target's stated independence requirement. A task label alone does not prove independent performance. A help request alone does not prove that help was delivered. Incomplete event capture cannot support a positive independence claim.

Exact operational labels and boundaries for assistance effects remain open. Do not infer them from a hint count, a prompt-level default or correctness.

### 5.7 Contradiction

Contradiction is a target-specific conflict between observed material and a particular interpretation. It is not synonymous with an incorrect answer, missing process data, assistance or task mismatch.

A contradiction judgement requires an identified target and the actual material that conflicts with the interpretation. Exact states and anchors remain open under O6.

### 5.8 Evidence quality

No numeric evidence-quality scale is approved. Correctness must not be copied into a field called `quality` and treated as a validated quality construct. Do not average or compare numeric quality values until the construct, anchors and measurement properties have been explicitly defined.

## 6. Owner-confirmed learner modes and support policy

### Oefenen

- Help is permitted.
- The learner may ask for explanation, a hint or an example.
- Help-seeking is a normal learning action, not a failure.
- A help request and support actually delivered are recorded separately.
- Preserve the learner's response and the ordered event history.
- Do not assess the learner against an independence condition that was not part of the task.

### Tussentoets

- An independent assessment over a smaller, explicitly defined part of an existing learning objective/scope.
- The learner is told before starting that content help is unavailable during the attempt.
- A content-help request immediately ends the attempt.
- Record the attempt as ended/incomplete and record the help request. Do not record the request as an incorrect answer or failed learner result.
- Return the learner to oefenen. Any subsequent practice is a separate attempt.

### Toets

- An independent assessment over a broader part of an existing learning objective/scope.
- The same advance communication and no-content-help rule apply.
- A content-help request immediately ends the attempt as incomplete, not incorrect, and the learner returns to a separate oefenen attempt.

### Neutral interface clarification

Clarification about operating the interface or entering an answer is distinct from content help. It must not provide target reasoning. The exact event taxonomy and boundary examples must be specified before the independent-assessment interaction is implemented.

Tussentoets and toets are assessment formats, not new skills, developments, claims, evidence targets or mastery rules. Their scope is selected from existing curriculum definitions.

## 7. Decision-chain boundary

The logical chain is:

```text
versioned task definition
    → administered attempt
    → immutable raw observation
    → PacoGO target-specific assessment(s)
    → registry-resolved claim/development
    → eligible evidence snapshot for one six-part branch
    → C6 evaluation
    → exact C7 next action
    → C8 descriptive learner history
    → C9 structural validation
```

The six-part branch identity remains:
1. learner key;
2. curriculum registry-version ID;
3. claim ID;
4. development ID;
5. scope ID;
6. time-window ID.

Evidence from different branches must not be pooled into one mastery result. One observation may be referenced by more than one branch, but it remains one source episode.

Event time and assessment-availability time are distinct. Their operational authority, window construction, closure, late-arrival and retention rules are not approved by this document. O5 remains open.

## 8. Verified current-runtime gaps

The current branch was inspected at the starting commit. These are code findings, not proposed behavior:

1. `createTaskInstance` currently sets `task_instance_id` equal to the stable catalogue `task_id`. Task definition and administered attempt are therefore conflated.
2. `createObservation` derives its ID from task-instance ID plus timestamp and copies only `evidence_target_ids[0]` into scalar `evidence_target_id`.
3. The browser vertical-slice runtime checks that observation skill matches task skill, but does not validate the complete task/target/claim/development/registry relationship.
4. The current registry/prototype path assesses one scalar target and produces one skill-level development/mastery/next-action cycle.
5. The Addition controller currently sets `quality` from answer correctness and hardcodes `relevant: true` and `contradiction: false`. The prototype then treats `relevant && quality > 0` as evidence. This makes correctness act as a proxy for a broader evidence judgement.
6. The Addition controller records `independence_status: UNKNOWN` and does not claim independence. The current support controller records practice help-request and support-delivery events, but it does not implement the tussentoets/toets attempt-ending lifecycle.
7. The current learner persistence path remains scalar/skill-scoped. It does not implement target fan-out or the full six-part C6–C9 branch model.

These gaps must be solved at their underlying contract boundaries. Do not work around them by duplicating observations, assigning multiple targets to one scalar field, changing mastery thresholds or adding a new Supabase project.

## 9. Explicitly unresolved decisions

The following remain open and must not be guessed:

- O5: scope/time-window authority, construction, timestamp/time-zone policy, closure, late arrivals, overlap, C8 presentation and retention.
- O6: final target-alignment and response-relation rules; raw collection and no-response interpretation; target-evidence result states; objective scoring versus evidence judgement; assistance relevance and independence rules; contradiction rules; unknown/insufficient-data behavior; assessment versioning and canonical schema vocabulary.
- G5: complete C6–C9 contract reconciliation against the six-part identity and exact snapshot/evaluation handoff.
- G6: task-definition, attempt, event, observation and replay identities.
- G7: consumer-by-consumer runtime and history compatibility.
- G8–G11: physical persistence/read model, staged writes, idempotency, concurrency, recovery, privacy/security and contract verification.
- O9: learner-facing descriptive presentation across branches.

No quality scale, assessment category set, numeric threshold or physical schema is selected here.

## 10. Implementation boundary and next sequence

This contract does not authorize multi-target runtime fan-out, B1-L08, C6–C9 integration, learner-state redesign, schema changes or Supabase work.

Before those changes:
1. Review this consolidated contract against the owner-confirmed product policy and the existing C1–C9 contracts.
2. Resolve the specific O5/O6/O9 decisions that affect the intended implementation slice.
3. Complete G5–G11 contract and compatibility work to the extent required by that slice.
4. Obtain explicit narrow implementation authorization under G12.
5. Check Full Regression on the exact branch head before implementation, then run focused tests and Full Regression on the resulting commit.

A bounded learner-interface or task-presentation change may proceed separately only when it preserves raw facts and does not make unsupported assessment, mastery or learner-state claims.

## 11. Non-claims

This contract does not establish that:
- the current browser learner cycle implements the full C1–C9 chain;
- current numeric quality values are scientifically meaningful;
- multi-target assessment or six-part branch fan-out is implemented;
- the current practice route implements tussentoets/toets;
- PacoGO is empirically validated;
- software regression demonstrates learning, mastery, transfer or next-action validity.
