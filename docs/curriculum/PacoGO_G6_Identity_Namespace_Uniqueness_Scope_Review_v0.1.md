# PacoGO — G6-B Identity Namespace and Uniqueness-Scope Review v0.1

Status: **source-derived design review and recommended logical boundaries; NOT owner-approved; no gate closure or implementation authorization**  
Date: 2026-11-09  
Branch: `refactor/professional-v1`  
Verified baseline before this documentation step: Full Regression #3408 GREEN on `e219221fdc2c24f4166285ce12279f95eb4416d3`.

## 1. Purpose and boundary

This review addresses the next G6 question after the G6-A cardinality review: what each logical identity names, where uniqueness must hold, and which identities must remain distinct.

It is based on the current G6 identity/lifecycle proposal, C2 Student Data Model v0.1, O6 Operational Assessment Contract v0.3, the G6/G7 read-only identity audit, the multi-target task/evidence contract and the existing candidate observation schemas.

This document is a logical design review only. It does not select UUIDs, random-ID libraries, database primary keys, composite hashes, canonical serialization, physical unique constraints, storage tables, idempotency transport keys or persistence behavior. Those are implementation/persistence/G9 matters and remain gated.

G6-A cardinality is still awaiting explicit owner disposition. Therefore the cardinality assumptions used below are conditional on the G6-A recommendation being accepted; they do not silently approve it.

## 2. Governing distinctions

The source contracts require separate identities for reusable authored objects, concrete administrations, response episodes, events, raw observations and target-specific assessments. They also require one raw observation to remain one response episode even when it receives multiple target assessments.

The following distinctions must be preserved:

- **Logical identity** names one domain object or versioned record.
- **Version identity** identifies the immutable version of a reusable definition/model.
- **Relationship** connects distinct identities; it does not make them interchangeable.
- **Event order** is the order within the source response episode, not a timestamp-derived identity.
- **Idempotency/replay** is an operation outcome governed by O7/G9, not a new meaning for an existing domain ID.
- **Physical key** is a storage realization, not the logical contract itself.

An identity must not encode curriculum meaning, learner result, timestamp, task content or mutable state. Do not infer identity from a task label, answer value, timestamp, event type or array position.

## 3. Identity inventory and recommended uniqueness scopes

The table distinguishes what is already supported by the source contracts from the recommended scope that still requires owner disposition.

| Logical identity | What it identifies | Source-supported relationship | Recommended logical uniqueness scope (candidate) |
|---|---|---|---|
| `task_definition_id` | Reusable authored task definition | Distinct from every learner administration; exact definition version is required in provenance | Unique within the task-definition identity namespace. Revisions retain the same logical definition identity and receive a distinct version identity. |
| task-definition version | One immutable revision of a task definition | The exact version used must be traceable | Unique only within its parent `task_definition_id`; identify the immutable definition by the pair (definition ID, version). |
| `task_model_id` | Reusable interaction/evidence opportunity model | Distinct from task definition and from actual target assessment | Unique within the task-model identity namespace. |
| task-model version | One immutable revision of a task model | Exact task-model version must be traceable | Unique only within its parent `task_model_id`; identify the immutable model by the pair (model ID, version). |
| `task_instance_id` | One concrete started administration/presentation | Must not be reused as the catalogue task/definition ID; records what was actually presented | Unique across started administrations within the PacoGO operational identity domain. A new administration receives a new identity, even when the same reusable task is repeated. |
| `task_attempt_id` / response-episode ID | One learner response episode | Belongs to exactly one task instance; ordinary edits/retries stay within the episode | Unique across response episodes within the PacoGO operational identity domain. Under G6-A candidate cardinality, one started task instance has one episode. |
| `event_id` | One immutable interaction event | Each event belongs to exactly one response episode | Candidate: unique within its parent response episode; the qualified logical reference is (task_attempt_id, event_id). If an external consumer needs a standalone event reference, its wider scope must be separately specified. |
| event source order | Position of an event in its episode | Source/episode order is authoritative; timestamps must not reorder events | Unique ordering position within an episode if a sequence representation is used. A numeric sequence field is not selected as mandatory by this review. |
| `observation_id` | One immutable raw observation | Exactly one raw observation per separately administered response episode | Unique across raw observations within the PacoGO observation identity domain. It remains distinct from the episode ID even though the relationship is one-to-one. |
| target-assessment identity | One target-specific PacoGO assessment instance | Exactly one observation and exactly one existing evidence target; correction/reassessment receives a new linked identity | Unique across target-assessment records within the assessment identity domain. Never reuse one assessment identity for a correction or a different target. |
| superseded/prior assessment reference | The assessment being corrected or reassessed | New assessment links to the prior assessment with reason/provenance; old record remains immutable | Reference must resolve within the target-assessment identity domain; it is a relationship, not a second identity for the new record. |

**Important qualification:** “PacoGO operational identity domain” is a logical scope proposal, not a decision about tenant partitioning, environment separation, database indexes or global UUID generation. Those physical boundaries remain unselected.

## 4. Versioned reusable objects versus per-administration records

The current G6 proposal distinguishes:

1. reusable task definition + exact version;
2. reusable task model + exact version;
3. task instance (the actual administration);
4. response episode;
5. ordered events;
6. immutable raw observation;
7. target-specific assessment record(s).

The G6/G7 read-only audit found that current runtime code reuses the catalogue `task_id` as `task_instance_id`, derives `observation_id` from task-instance ID plus timestamp, and reduces a task's target array to its first target in the observation path. These are observed implementation defects, not identity rules to preserve.

A repeated use of the same task definition/model is a new administration, not a new task definition. A new definition/model revision is a new version, not a learner administration. The actual task instance must retain the exact versions and actual presentation/deviation provenance required by O6.

No parent/child relationship between task definition and task model is selected. They remain separate reusable references unless a separate approved curriculum/task-authoring contract determines otherwise.

## 5. Event identity and order

The current proposal supports a stable event identity within its parent response episode and authoritative source order within that episode. It does not require a particular event ID format or numeric sequence storage.

Candidate rules for owner review:

- An event is never identified only by timestamp, event type or its position in an array.
- An event reference is interpreted in its parent episode context; the candidate qualified identity is (task_attempt_id, event_id).
- If a sequence value is represented, it is episode-local and expresses source order. It must not be used as a cross-episode identity.
- Timestamps preserve temporal provenance; they do not replace event order and do not create event identity.
- A corrected event is a new linked/versioned event record; the original event remains inspectable.
- A source event ID, event ID and a persistence idempotency key must not be treated as synonyms without an explicit G9 contract.

Whether the event identity itself must be globally unique, rather than unique within its parent episode, remains an explicit owner decision if downstream consumers require stand-alone event addressing.

## 6. Observation and target-assessment identity

O6 v0.3 and the G6 proposal require one immutable raw observation per response episode and zero or more target-specific assessments for that observation.

The identity boundary must therefore preserve:

- one observation identity for the raw response episode, regardless of how many targets are assessed;
- one separate assessment identity per target-specific assessment record;
- exactly one observation reference and exactly one existing evidence-target reference on each assessment;
- distinct assessment identities for correction/reassessment, with prior-assessment linkage, reason and provenance;
- immutable raw observation and prior assessment history.

A task model's target opportunity list does not create assessment identities and does not prove every target was elicited. Multiple assessments from one observation do not become multiple independent observations or attempts.

The logical identity of an assessment must not be derived solely from (observation_id, evidence_target_id), because O6/G6 permit separately identified historical corrections/reassessments for the same observation/target. G9 still owns canonical payload equality, replay/conflict behavior and durable idempotency.

## 7. Context identifiers outside G6 ownership

C2 also names learner, study, session and wave identities. They are provenance/context dimensions, not substitutes for the G6 identities above.

- `learner_id` is stable and pseudonymous across the relevant longitudinal study context.
- `study_id`, `session_id` and `wave_id` identify study/session context.
- Direct identity data remains outside the curriculum evidence dataset.

This review does not redefine those C2 identifiers, their privacy model or their persistence. A task/episode/observation identity must not contain a learner's name or other direct personal identifier.

## 8. Learning Interface identity remains a separate open question

The G6/G7 read-only audit found that the current observation contract does not consistently retain a canonical Learning Interface identity/version or exact presented-configuration reference.

That is a provenance gap to resolve, but this review does **not** silently equate a Learning Interface with a task model or invent an interface ID namespace. The pedagogical instrument, task model, task definition and actual rendered configuration may be related but are not interchangeable concepts.

A separate source-led decision must determine the minimum interface/configuration provenance required to reproduce what was presented, while preserving the Learning Interface System's separation between pedagogical/function configuration, interaction/state and visual/rendering layers. No runtime or schema change follows from identifying this gap.

## 9. Cross-gate boundaries

| Concern | Owning workstream | G6-B disposition |
|---|---|---|
| Logical names and relationships for task/episode/event/observation/assessment | G6 | Review and candidate recommendations here |
| G6-A one-started-instance ↔ one-response-episode cardinality | G6-A | Owner disposition still pending |
| C3/O6 target-assessment provenance and correction lineage | G2/O6 + G6 | Preserve O6 v0.3; reconcile, do not rewrite its vocabulary |
| Canonical immutable payload fields, serialization and equality | G9 | Not selected |
| Same identity/same payload replay; same identity/different payload conflict | O7/G9 | Logical outcome is source-defined; operational mechanism remains G9 |
| Stage idempotency boundaries for observation ingestion, target assessment and decision evaluation | O7/G9 | Do not reuse domain IDs as stage IDs by assumption |
| Decision snapshot, C6 evaluation and C7 decision identities | G5/O7 | Keep distinct; not G6 identities |
| Physical keys, unique indexes, foreign keys, tables, retention, transaction/outbox and recovery | G8/G10 | Not selected |
| Conformance tests | G11 | Must follow approved contracts; no test changes authorized here |
| Runtime implementation | G12 | NOT AUTHORIZED |

## 10. Explicit decisions still required

Before G6 can close, owner review must determine:

1. Whether the candidate uniqueness scopes in §3 are accepted, especially the operational identity domain boundary.
2. Whether event identity is episode-local with a qualified (episode ID, event ID) reference, or must also be independently unique across the operational domain.
3. Whether task definition/model versions are represented as separate version fields or as opaque versioned-object references; the logical pair remains required either way.
4. Whether the Learning Interface/configuration provenance gap needs an explicit G6 identity/reference or is owned by a separate Learning Interface contract.
5. How the identity inventory reconciles with all C2/O6 provenance fields and the existing fixture contracts without introducing a physical schema.
6. Explicit owner disposition of G6-A cardinality; G6-B does not assume it has been approved.

ID format, UUID/random generator, timestamp/content hash derivation, canonical serializer, database constraints, physical keys, idempotency-key encoding and persistence design are deliberately not decision questions for this G6 logical review.

## 11. Recommendation

The recommended logical baseline is:

- use distinct typed identities for task definition, task model, task instance, response episode, event, raw observation and target assessment;
- use (definition ID, version) and (model ID, version) to identify immutable reusable revisions;
- require new task-instance, response-episode and observation identities for each new administration;
- keep event identity episode-qualified unless a real consumer requirement demonstrates the need for a wider event namespace;
- keep observation and target-assessment identities distinct, with a new linked assessment identity for correction/reassessment;
- keep C2 learner/study/session/wave context identifiers separate from G6 object identities;
- never derive domain identity from timestamps, content, event type, learner identity or array position;
- defer physical realization and replay mechanics to G8/G9/G10 after logical approval.

This is a recommendation for owner disposition, not an approved contract. G6 remains OPEN, G9 remains OPEN and G12 remains NOT AUTHORIZED.

## 12. Verification boundary

This document is documentation-only. It changes no runtime, tests, curriculum registry, task catalogue, learner state, data schema, database, SQL/RPC/RLS, Supabase or learner data. It does not authorize implementation or empirical learner-data collection.
