# PacoGO G6 — Field-level contract-to-code traceability matrix v0.1

**Status:** read-only source audit; findings and candidate implications only.  
**Branch:** `refactor/professional-v1`.  
**Scope:** existing interaction contract and direct controller consumers, with FR2/Fraction as the first implementation target.  
**Not an implementation authorization:** G6 remains open; G9 remains open; G12 is not authorized.

## 1. Purpose

This document continues the G6 contract-to-repository translation. It answers a practical question: which logical administration, event and observation concepts already exist in the code, where are they created, and which gaps must be resolved before changing runtime behavior?

This is not a new parallel curriculum specification. It maps the existing logical contract questions to concrete files and tests in the repository.

## 2. Shared contract: actual behavior

Source: `pacogo-engine/interaction-contract.js`.

| Logical field/concept | Current implementation | Traceability finding |
|---|---|---|
| Task definition identity | `taskId` is passed as `task_id` input | The input is the reusable catalogue task identifier in current controller calls. |
| Task instance identity | `task_instance_id: taskId` | No distinct concrete-instance identity is generated. In current calls it equals the task catalogue ID. |
| Task model identity | `task_model_id: taskModelId` | Separate field is preserved. |
| Task-definition version | `task_definition_version`, default `0.1` | Version is present, but every inspected controller supplies literal `0.1`; source/version resolution is not demonstrated. |
| Skill/development/claim | copied from task input | Separate curriculum references are retained. |
| Evidence targets | input array copied to task instance | The array is retained on the task instance. |
| Response episode identity | no field or constructor | No separately named response-episode identity is visible in this shared contract. |
| Interaction event identity | `taskInstanceId:eventType:at` | Derived from task-instance value, event type and timestamp; no independent event identity or sequence counter. |
| Event association | `task_instance_id` | Event is associated with the task-instance field; no response-episode association exists. |
| Raw observation identity | `obs:<task_instance_id>:<observed_at>` | Derived from task-instance field and observed timestamp. |
| Observation-to-task linkage | `task_id` receives `taskInstance.task_instance_id` | The output field called `task_id` currently receives the task-instance field, not a separately preserved catalogue task ID. |
| Observation evidence target | `evidence_target_id: evidence_target_ids[0]` | Only the first target is emitted in the observation shape, even though task instance stores an array. |
| Raw interaction process | `interaction_events` copied into observation | Ordered event array is retained in memory in the constructed observation. |
| Observation immutability | top-level object frozen | Nested response/context/performance objects are cloned but not recursively frozen by this function. |

## 3. Direct controller consumer matrix

All files below import the shared `createTaskInstance`, `createInteractionEvent` and `createObservation` functions.

| Controller | Task-instance creation | Event creation | Observation creation | Task definition version |
|---|---|---|---|---|
| `fraction-equivalence-controller.js` | constructor; passes `task.task_id` | local `record`; event IDs use task-instance field | on submit | literal `0.1` |
| `addition-controller.js` | constructor; passes `task.task_id` | local `record`, plus support controller events | on submit | literal `0.1` |
| `clock-controller.js` | constructor; passes `task.task_id` | local `record` | on submit | literal `0.1` |
| `number-line-controller.js` | constructor; passes `task.task_id` | local event recorder | on submit | literal `0.1` |
| `division-controller.js` | constructor; passes `task.task_id` | local `record` | on submit | literal `0.1` |
| `multiplication-controller.js` | constructor; passes `task.task_id` | local `record` | on submit | literal `0.1` |
| `representation-match-controller.js` | constructor; passes `task.task_id` | local event recorder | on submit | literal `0.1` |
| `subtraction-controller.js` | constructor; passes `task.task_id` | local `record` | on submit | literal `0.1` |

**Cross-cutting consequence:** changing the meaning or required inputs of the shared interaction contract affects eight controller families, not only FR2. A first FR2 implementation therefore needs either a backwards-compatible shared-contract extension or an explicitly isolated adapter boundary. That choice must be based on consumer and test review, not guessed.

## 4. Fraction lifecycle as currently implemented

Sources:
- `pacogo-engine/fraction-equivalence-controller.js`
- `pacogo-engine/fraction-interface-controller-bridge.js`
- `pacogo-engine/fraction-learning-interface-contract.js`
- `pacogo-engine/fraction-learning-interface.js`
- `pacogo-engine/fraction-learning-interface-renderers.js`

Observed sequence:

1. Controller construction creates a task instance immediately, before any explicit administration-start API is called.
2. Controller records `task_presented` during construction.
3. Option selection and explanation changes are recorded as interaction events.
4. Bridge submission checks selection and required explanation, calls controller submit, then locks the interface.
5. Controller computes correctness and creates one observation at submission.
6. The observation includes a single `evidence_target_id`, the response, performance/context/provenance and interaction events.
7. The browser vertical-slice runtime resolves the catalogue task and checks that observation `skill_id` matches the task's `skill_id`, then delegates to the registry.

The inspected path does not expose a separately named response episode, a distinct task-instance ID, or an explicit persisted effective Learning Interface configuration/renderer provenance envelope in the observation.

## 5. Runtime and browser boundary

Source: `pacogo-engine/browser-vertical-slice.js`.

- Browser task definitions are indexed by catalogue `task_id`.
- `runTaskObservation` resolves that task and validates the observation's skill against the task's skill.
- It does not currently validate a distinct task-instance ID, response-episode ID, task-model ID, task-definition version, evidence-target membership, interface configuration provenance or renderer provenance.
- The generic `runObservation` path checks student, skill and observed timestamp, then calls the registry.

This is a bounded observation of the current runtime guard; it is not a recommendation to add every validation to this layer. Ownership must remain with the appropriate contract/stage.

## 6. Existing test coverage and uncovered assertions

Relevant tests:
- `pacogo-engine/interaction-contract.test.js`
- `pacogo-engine/fraction-equivalence-controller.test.js`
- `pacogo-engine/browser-vertical-slice.test.js`
- `pacogo-engine/addition-controller.test.js`
- `pacogo-engine/clock-controller.test.js`

Tests establish:
- task/skill/development/claim/evidence-target values are copied into observations;
- interaction events are retained with payloads;
- FR2 blocks duplicate submission on one controller instance;
- browser runtime resolves a catalogue task and rejects skill mismatch;
- Addition and Clock preserve their task-specific response and event contracts.

The inspected tests do not establish:
- two separate administrations of the same catalogue task receive distinct task-instance identities;
- response episodes are separately identified and linked;
- event identity remains unique when event type and timestamp collide;
- observation identity remains unique across repeated administrations;
- task catalogue identity and task-instance identity are separately preserved;
- multiple evidence-target assessments can be represented without duplicating the raw observation;
- exact effective Learning Interface configuration and renderer version can be recovered from an observation.

Absence of these assertions is a coverage finding, not proof that every possible execution currently collides or loses data.

## 7. FR2-first implementation implications

The following items appear to be the minimum logical questions that must be resolved for an FR2 administration to have unambiguous identity and provenance:

1. Preserve the catalogue task ID as a reusable task-definition reference, separately from a concrete task-instance identity.
2. Define the point at which an administration actually starts; controller construction and task presentation should not silently stand in for a separately specified start boundary unless that is the approved contract.
3. Decide whether one started task instance maps 1:1 to one response episode, and define the association of ordered events and the resulting immutable raw observation.
4. Preserve the reusable task-model reference and task-definition version as distinct from task-instance identity.
5. Preserve the effective Fraction Learning Interface identity/version and the effective task-specific configuration needed to interpret the interaction; separately identify renderer/version and only materially relevant presentation settings.
6. Preserve one raw observation independently of any number of target-specific assessments; do not turn the task's target list into multiple raw observations or assume every target was assessed.
7. Ensure any extension remains compatible with the other seven controller consumers, or isolate the first FR2 path behind a deliberate adapter.

These are implementation-readiness questions, not approval of the current G6 candidate recommendations. The G6-A, G6-B and Learning Interface provenance reviews remain subject to owner disposition.

## 8. Explicitly deferred

This audit does not decide:
- UUID/ULID or any other physical ID format;
- random versus deterministic ID generation;
- canonical JSON/serialization or content hashes;
- persistence schema, database constraints, idempotency keys or concurrency control;
- interruption recovery/snapshot persistence;
- C3 target-assessment semantics or mastery rules;
- registry, learner-state or Supabase changes.

Those belong to their owning logical gates and must not be inferred from the code audit.

## 9. Recommended next step

Prepare a short, bounded G6 reconciliation note that puts only the implementation-blocking choices in front of the owner. In parallel, keep FR2 learning design focused on a learner-facing sequence that can be used as soon as the runtime contract is approved. Once the required logical decisions are explicit, request G12 authorization for a minimal FR2/Fraction runtime slice. Do not expand into unrelated controllers or persistence unless the approved shared contract genuinely requires it.

## 10. Verification

This document is documentation-only. It does not change runtime code, tests, curriculum registry, learner state, schemas, persistence, SQL/RPC/RLS, Supabase or learner data.

The commit containing this document must pass Full Regression on its exact SHA. No implementation authorization is implied by this review.


## Subsequent logical disposition — 2026-11-09

This read-only matrix remains the source audit of current code. Its original statement that G6 candidate recommendations were awaiting owner disposition is superseded by the later controlling record `PacoGO_G6_Logical_Boundary_Disposition_v0.1.md`.

The matrix's implementation findings remain unchanged. The approved logical requirements are now explicit, but the code still does not implement distinct concrete task-instance/response-episode identities or the full interface/presentation provenance envelope. This does not itself authorize a patch. The first implementation target remains FR2, with a backwards-compatible extension or deliberate adapter chosen only after review of all eight shared-contract consumers. G12 remains NOT AUTHORIZED.
