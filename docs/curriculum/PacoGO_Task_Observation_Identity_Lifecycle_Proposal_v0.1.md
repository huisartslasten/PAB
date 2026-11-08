# PacoGO — Task / Attempt / Observation Identity and Lifecycle Proposal v0.1

Status: **candidate logical contract; support-condition identity boundary owner-approved; remaining lifecycle decisions open; implementation NOT authorized**  
Date: 2026-11-07  
Branch: `refactor/professional-v1`

## 1. Purpose and boundary

This proposal narrows G6 to the identity and lifecycle relationship between a reusable task definition, a task model, one concrete administration, one learner response episode, its interaction events and one immutable raw observation.

It reconciles the currently determined meaning in C2, C3 v0.2, the multi-target task/evidence contract, owner decisions O1/O7 and the confirmed independent-assessment support policy. It does **not** approve final C3 target-assessment vocabulary or rules (G2/O6), physical schema, persistence, runtime APIs or implementation.

## 2. Proposed logical hierarchy

```text
versioned task definition
  └─ task model + declared target opportunities
       └─ administered task instance
            └─ response episode (task_attempt_id)
                 ├─ ordered interaction events / internal retries
                 └─ one immutable raw observation
                      └─ zero or more target-specific PacoGO assessments
```

Identity meanings:

| Identity | Meaning | Cardinality / invariant |
|---|---|---|
| `task_definition_id + version` | Reusable authored task definition and its exact version | Never identifies a learner attempt |
| `task_model_id + version` | Reusable interaction/evidence opportunity model | Does not itself prove a target was elicited |
| `task_instance_id` | One concrete administration/presentation, including the actual content, representation, response mode and support condition | One task instance may have at most one response episode in this minimum proposal; a new administration receives a new ID |
| `task_attempt_id` | One complete learner response episode | One episode belongs to exactly one task instance |
| `event_id` | One immutable interaction event | Unique event identity; event belongs to exactly one response episode |
| `event_sequence` | Order of events within one response episode | Monotonically increasing; authoritative order is not inferred from timestamps |
| `observation_id` | One immutable raw observation for the response episode | Exactly one observation per separately administered response episode; one-to-one with `task_attempt_id` |
| target-assessment identity | One stable logical identity for one PacoGO assessment instance of exactly one existing target against exactly one immutable observation | Assessment identity is distinct in meaning from observation and target identity; the same observation/target may have multiple historical assessments only as separately identified, linked versions. O6 v0.3 defines provenance/lineage; G9 defines canonical payload and replay/conflict mechanics. No physical key or ID format is prescribed |

The task instance captures what was actually administered, not merely what the task definition intended. Any material difference from the definition is recorded as an administration deviation rather than silently rewritten into the definition.

## 3. Administration and episode lifecycle

| Situation | Proposed identity/lifecycle behavior | Status |
|---|---|---|
| Learner starts a task presentation | Create a new task-instance ID and response-episode ID; reserve the linked observation identity | Logical consequence of one separately administered episode → one observation |
| Click, edit, answer revision or ordinary retry | Append an event in the same episode; do not create a new observation | Determined by C3 v0.2 §3.1 |
| Learner completes the task | Record the completion event and freeze the one immutable observation for the episode | Raw completion event and immutable observation are determined by C2/O6; lifecycle label remains separate from O6 result vocabulary |
| Learner explicitly restarts after completion | Treat the restart as a new administration: create a new task instance, response episode and observation; retain the completed episode | Logical consequence of separate administration identity; covered by G6-004 fixture test |
| Learner abandons after starting | Preserve the abandonment event, all captured events and one immutable observation for the started episode; do not invent a score or evidence result | C2 missingness/abandonment and O6 raw-event requirements determine preservation; lifecycle wording remains product-owned |
| Temporary interruption with exact same presentation and support condition | Candidate: resume the same task instance and episode only when the same administration state is restored; append interruption/resume events | Candidate recommendation; explicit resume/recovery policy still requires product/protocol approval |
| Resume cannot restore the same administration state, or content/representation/response mode changes | Do not splice a materially different presentation into the old episode; create a new task instance, response episode and observation | Logical consequence when a new administration is presented; exact recovery UX remains open |
| Timeout | Do not infer a terminal timeout from elapsed time alone. A timeout may end an episode only when an explicit, versioned task/session policy defines the duration and consequence. Preserve the timeout event and resulting raw observation. | Product/protocol decision required before implementation |
| Content-help request during Tussentoets/Toets | End the independent episode immediately as ended/incomplete; record the request separately from any support delivered; create a new task instance, response episode and observation for the supported-practice continuation | Owner-approved logical identity boundary (2026-11-08); no physical ID/schema defined |
| Neutral interface clarification | Does not automatically end the independent episode, provided it does not supply target reasoning | Product distinction is required; operational anchors remain open under O6 |

### Why a support-condition change gets a new task instance

A task instance is the concrete administration, including the actual support condition and presentation. Independent performance and supported practice are materially different administration conditions. Reusing one task-instance ID would make one identity refer to two different administrations and weaken provenance. Therefore the approved logical rule is: **a material change in support condition creates a new task instance, a new response episode and a new immutable observation**. The independent episode remains immutable and incomplete; supported practice is separately recorded. This was explicitly approved by the owner on 2026-11-08 (instruction: “ga door”) after review of the proposed boundary.

A neutral interface clarification that supplies no target reasoning does not itself change the support condition and does not create a new administration identity. The rule distinguishes a material change in the actual support condition from a navigation/answer-entry clarification.

## 4. Event identity, ordering and replay

### 4.1 Source-derived logical requirements

The following are determined by the existing C2/C3/O6/O7 boundaries:

- Each interaction event belongs to exactly one response episode; the episode's raw observation preserves the ordered event stream.
- Clicks, edits, answer revisions and ordinary retries remain events in the same episode unless a separately administered task instance is created.
- Event order is preserved as source/episode order. Event timestamps are provenance; they must not be used to silently reorder the event stream.
- Event time and assessment-availability time are separate logical facts under O5/O6.
- Raw events and observations are immutable. A later correction must not rewrite the original response/event history.

### 4.2 G6 logical identity boundary

Recommended logical contract, without prescribing a physical schema or transport:

- Each event has a stable logical identity within its parent response episode.
- An event identity cannot refer to two different events in the same episode.
- Each event is linked to exactly one parent response episode.
- The ordered event stream is authoritative. A numeric sequence field is one possible representation, not a required logical field; no causal order is inferred from wall-clock timestamps.
- A corrected event is represented as a new linked/versioned event; the original event remains inspectable.

### 4.3 G6 target-assessment identity boundary

- Every target-specific assessment has its own stable logical identity; it is not identified solely by the observation/target pair.
- Each assessment identity refers to exactly one immutable observation and exactly one existing evidence target, consistent with O6 v0.3.
- Multiple historical assessments for the same observation/target are permitted only as separately identified, linked correction/reassessment versions with reason and provenance.
- A new rule/contract/engine assessment is not an in-place mutation of the prior assessment. It receives a new assessment identity and preserves the prior link.
- The identity remains opaque at the logical level. No UUID format, database key, composite hash or deterministic serializer is selected here.

**Fixture verification:** G6-007 verifies that one immutable observation may have separate assessment identities for distinct targets; each assessment record must carry exactly one non-empty assessment identity, observation identity and target identity; and one assessment identity cannot be reused for multiple assessment records. This is logical contract coverage only. It does not define a key format, canonical payload, storage uniqueness constraint or replay implementation. The boundary remains subject to final G6 owner approval and C3/O6 reconciliation.

### 4.3 G9 replay and payload boundary

O7 determines the logical outcome:
- same identity + same canonical immutable payload is an idempotent replay;
- same identity + different payload is an integrity conflict and must be rejected.

G9 must still define canonical payload fields/serialization/equality, event idempotency-key scope and durable retry/concurrency/recovery behavior. UUID format, database key, wire encoding, numeric sequence storage, transaction/outbox implementation and physical persistence are not defined by G6.



## 5. Observation creation and immutability

- Allocate one stable `observation_id` for each response episode. It may be reserved at episode creation and committed when the episode is finalized; the ID must not change on replay.
- The raw observation contains the exact task-definition/model versions, task-instance presentation, support condition, response modality, raw response, ordered events/retries, captured support request/delivery events and technical collection provenance.
- A terminal incomplete episode still produces one immutable observation, including when no scorable response was submitted. Whether it is coded `NO_RESPONSE`, missing, unknown or another assessment state is an O6 decision and must not be guessed here.
- One observation may receive zero, one or multiple target-specific assessments. A task model's target opportunities do not automatically create assessments.
- Assessment records must never duplicate the raw observation or inflate the count of independent response episodes.
- Corrections/reassessments are linked new records under the approved versioned assessment contract; raw observation history is preserved.

## 6. Decisions deliberately not made here

The following remain outside this proposal:

1. Final target-alignment, response-relation, evidence-status, quality, assistance/independence and contradiction vocabularies and deterministic assessment rules — G2/O6.
2. O6 v0.3 §7 defines logical target-assessment provenance and correction lineage. G6 defines one stable logical identity per assessment instance, bound to exactly one observation and one target. G9 defines canonical immutable payload and replay/conflict mechanics.
3. Operational examples distinguishing neutral UI clarification from target-relevant content help — G2/O6 plus product review.
4. Physical tables, columns, constraints, RLS, RPCs, migrations, transaction/outbox design and retention — G8–G10.
5. Learner-facing status wording and timeout durations — product decision; no hidden universal timeout is introduced.
6. Event transport format, storage format and concrete ID-generation library — implementation design after logical approval.

## 7. G6 acceptance criteria

G6 can close only when the owner-approved, versioned logical contract explicitly confirms:

- task definition/version, task model/version, task instance, response episode, event and observation are distinct identities;
- one task instance has one response episode under the selected minimum lifecycle;
- one separately administered response episode maps to exactly one immutable raw observation;
- retries remain within an episode unless a specified transition creates a new administration;
- a material support-condition change creates a new task instance, response episode and immutable observation; neutral interface clarification that supplies no target reasoning does not itself change that condition;
- completion, abandonment, interruption, resume, restart and timeout transitions are explicit;
- event identity, within-episode order, event time and replay/conflict semantics are explicit;
- incomplete/no-response episodes are preserved without guessing an O6 assessment label;
- the contract is reconciled with the finally approved C3/O6 model.

G6 remains OPEN. C2/O6 now determine preservation of completion/abandonment events and immutable raw observations; G6-003–005 fixture tests cover same-episode retries, a new administration after explicit restart, and preservation of a started abandoned episode. The owner-approved material support-condition boundary is covered by G6-001/002. Still open: exact interruption/resume restoration policy, timeout duration/consequence, learner-facing lifecycle wording, complete event ordering/identity semantics and final C3/O6 reconciliation. O6 v0.3 §7 is authoritative for logical assessment provenance and linked correction/reassessment requirements; G6/G9 must still define the exact assessment identity and replay/conflict envelope. O7's exact canonical-payload representation, stage status/retry/concurrency/recovery design and physical identity realization remain separate G9/G8/G10 work. This partial G6 progress does not close G2/O6, G5 or G7–G12 and does not authorize implementation.

## 8. Source basis

- C2 task/interaction/observation/inference separation.
- C3 v0.2 §3.1: one administered task-instance response episode, with ordered attempts/events; retries are not automatically new observations.
- Multi-Target Task Evidence Contract v0.1 §§3 and 6: one task attempt is one learner interaction episode; one attempt may support multiple target-specific evidence items.
- Owner Architecture Decisions O1 and O7: one immutable observation with zero or more target assessments; separate idempotency boundaries and replay/conflict semantics.
- Task Support Conditions and Independence Contract v0.1 §§1, 3 and 5: independent help request ends the assessment attempt; subsequent supported practice is a separate attempt; request and delivered support are distinct.
- Multi-Target Implementation Readiness Matrix v0.1 §§2 and 8.10: G6 depends on G2/O6 and remains a design gate.

No runtime, tests, curriculum registry, learner catalogue, database, SQL/RPC/RLS, Supabase or learner data changed.
