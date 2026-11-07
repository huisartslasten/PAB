# PacoGO — Task / Attempt / Observation Identity and Lifecycle Proposal v0.1

Status: **candidate logical contract; owner/protocol approval required; implementation NOT authorized**  
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
| target-assessment identity | PacoGO's versioned assessment of one target against one observation | Zero or more per observation; exact identity/version is governed by G2/O6, not this proposal |

The task instance captures what was actually administered, not merely what the task definition intended. Any material difference from the definition is recorded as an administration deviation rather than silently rewritten into the definition.

## 3. Administration and episode lifecycle

| Situation | Proposed identity/lifecycle behavior | Status |
|---|---|---|
| Learner starts a task presentation | Create a new task-instance ID and response-episode ID; reserve the linked observation identity | Logical consequence of one separately administered episode → one observation |
| Click, edit, answer revision or ordinary retry | Append an event in the same episode; do not create a new observation | Determined by C3 v0.2 §3.1 |
| Learner completes the task | Close the episode; freeze one immutable observation | Proposed lifecycle default; terminal status vocabulary remains subject to O6 |
| Learner explicitly restarts after completion | Create a new task instance, new episode and new observation; retain the earlier record | Recommended default: a new administration is a new episode |
| Learner abandons after starting | Close as incomplete when the abandonment is explicit or the product ends the administration; preserve captured events and one observation | Proposed default; exact learner UI and status labels require product/protocol approval |
| Temporary interruption with exact same presentation and support condition | Keep the same task instance and episode resumable; append interruption/resume events; preserve event order | Recommended default, not yet approved |
| Resume cannot restore the same administration state, or content/representation/response mode/support condition changes | Do not splice the new presentation into the old episode; create a new task instance and episode | Recommended default |
| Timeout | Do not infer a terminal timeout from elapsed time alone. A timeout may end an episode only when an explicit, versioned task/session policy defines the duration and consequence. Record the timeout event and preserve the resulting incomplete observation. | Product/protocol decision required before implementation |
| Content-help request during Tussentoets/Toets | End the independent episode immediately as ended/incomplete; record the request separately from any support delivered; create a new task instance and supported-practice episode for the continuation | Required by owner-confirmed support policy; new task-instance ID is the recommended identity consequence |
| Neutral interface clarification | Does not automatically end the independent episode, provided it does not supply target reasoning | Product distinction is required; operational anchors remain open under O6 |

### Why a support-condition change gets a new task instance

A task instance is the concrete administration, including the actual support condition and presentation. Independent performance and supported practice are materially different administration conditions. Reusing one task-instance ID would make one identity refer to two different administrations and weaken provenance. Therefore the recommended rule is: **a change in support condition creates a new task instance and a new response episode/observation**. The independent episode remains immutable and incomplete; supported practice is separately recorded.

This recommendation follows the meaning of task instance and the owner-confirmed separate-attempt rule, but the explicit task-instance-ID decision still requires owner approval.

## 4. Event identity, ordering and replay

Recommended minimum logical event contract:

- Each event receives an opaque, stable `event_id` at event creation.
- Each event carries a per-episode monotonically increasing `event_sequence`; sequence, not wall-clock time, determines causal order within the episode.
- Event time is stored separately as an event-time instant. Arrival/ingestion time is also separate where needed; neither replaces sequence.
- A source-generated idempotency key remains stable when the same event is resent. Scope it to the response episode unless the source system guarantees global uniqueness.
- Same event identity/key plus the same canonical immutable payload is a replay. The same identity/key with a different payload is an integrity conflict and is rejected, consistent with O7.
- Missing sequence, duplicate sequence with different events, or an event whose parent episode does not match is an integrity error; do not sort by timestamp to repair it.
- An event correction is a new linked/versioned record; the original event and observation are not overwritten.

Opaque IDs should be generated once at the logical creation boundary and persisted unchanged across retries. UUID-style random identifiers are a candidate implementation, not a required public format. Collision handling is uniqueness enforcement plus explicit conflict; never silently reuse an existing ID.

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
2. Exact target-assessment identity and assessment-version provenance — G2/O6.
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
- support-condition changes create a new task instance and response episode, or an explicitly bounded exception is documented;
- completion, abandonment, interruption, resume, restart and timeout transitions are explicit;
- event identity, within-episode order, event time and replay/conflict semantics are explicit;
- incomplete/no-response episodes are preserved without guessing an O6 assessment label;
- the contract is reconciled with the finally approved C3/O6 model.

Until then G6 remains OPEN. Even after G6 closes, this does not close G2/O6, G5 or G7–G12 and does not authorize implementation.

## 8. Source basis

- C2 task/interaction/observation/inference separation.
- C3 v0.2 §3.1: one administered task-instance response episode, with ordered attempts/events; retries are not automatically new observations.
- Multi-Target Task Evidence Contract v0.1 §§3 and 6: one task attempt is one learner interaction episode; one attempt may support multiple target-specific evidence items.
- Owner Architecture Decisions O1 and O7: one immutable observation with zero or more target assessments; separate idempotency boundaries and replay/conflict semantics.
- Task Support Conditions and Independence Contract v0.1 §§1, 3 and 5: independent help request ends the assessment attempt; subsequent supported practice is a separate attempt; request and delivered support are distinct.
- Multi-Target Implementation Readiness Matrix v0.1 §§2 and 8.10: G6 depends on G2/O6 and remains a design gate.

No runtime, tests, curriculum registry, learner catalogue, database, SQL/RPC/RLS, Supabase or learner data changed.
