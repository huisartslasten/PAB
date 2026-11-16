# PacoGO — G9 Logical Payload Field Inventory v0.1

**Status:** source-derived field inventory; design artifact only; not implementation authorization  
**Branch:** `refactor/professional-v1`  
**Basis:** O1/O2/O3/O7/O8; C2 v0.1; O5 minimum policy; O6 v0.3; G6 identity lifecycle proposal; C6/C7 protocols; C8/C9 v0.2 crosswalk.  
**Scope:** logical content groups and applicability. This is not a serialized payload, API schema, database schema or canonicalization specification.

## 1. Classification rules

- **Required:** the logical record must preserve the fact/reference for the relevant stage.
- **Conditional:** required only when the corresponding event, dimension, scoring rule, support exposure, correction or approved context exists/applies. Absence must not be fabricated.
- **Not part of canonical content by default:** the source contracts do not require it as semantic learner/evaluation content. It may be added only by an explicit versioned contract.
- **Unresolved:** the source establishes the category but not its complete field envelope or exact equality representation. G9 must not guess.

The words “required” and “conditional” describe logical information, not a physical non-null database constraint. O5/O6/G6 semantics take precedence over any future implementation convenience.

## 2. Stage A — raw-observation ingestion

**Logical object:** one immutable raw observation for one separately administered response episode. One observation may later support multiple target assessments. Those assessments do not duplicate the observation or multiply independent response episodes.

**Idempotency identity:** G6 logical `observation_id`. The exact namespace and uniqueness scope remain open under G6/G9.

| Field group | Classification | Source-derived content and boundary |
|---|---|---|
| Observation identity | Required | Stable `observation_id`; remains unchanged on replay. Do not substitute task-definition, task-model, task-instance or event identity. |
| Administration provenance | Required | Distinct task-instance and response-episode references; the episode maps to exactly one immutable observation. Exact complete G6 lifecycle envelope remains open. |
| Learner reference | Required | Pseudonymous learner reference sufficient for operational provenance. C2 requires stable pseudonymous learner identity for longitudinal linkage; personally identifying/contact/account data stay outside the curriculum evidence record. Exact alignment with the six-part branch `learner_key` is a G6/G7 consumer-contract detail. |
| Task and curriculum provenance | Required where applicable | Exact registry version and applicable task-definition/task-model versions; task instance must resolve to the actual administered task. A task catalogue/model association alone does not prove the actual administration elicited a target. |
| Actual presentation | Conditional by task | Actual item/content, options, representation, wording, language, instructions and response mode as presented, including material administration deviations. Preserve the actual instance, not merely the planned template. |
| Raw response/output | Conditional on response | Learner response/output and modality, including ordered revisions/attempt events where captured. No response is represented through explicit lifecycle/missingness facts; it is not synthesized as an incorrect answer. |
| Interaction events | Conditional on captured events | Each event has stable identity within exactly one parent response episode. Preserve source/episode order; timestamps must not reorder the stream. Include observable click/edit/answer revision, help request, support offer/delivery/dismissal, interruption, completion, attempt-end and abandonment events when they occurred and were captured. |
| Administration/support condition | Required | Planned support condition communicated before the attempt and actual administration deviations. Preserve request, offer and actual delivery as separate facts. A request alone is not delivered support. |
| Support content provenance | Conditional on support event | Actual delivered support content or stable prompt identifier, source and event time where available. Preserve what was delivered; do not infer delivery from a request or offer. |
| Objective performance facts | Conditional on explicit task scoring | Objective score/result and exact task-specific scoring-rule version where defined. This is a raw task-performance fact, not a target-assessment conclusion or mastery inference. |
| Lifecycle and missingness | Required when relevant | Explicit administration/response status and missingness facts, including not administered, technical failure, no response, abandonment, observation unavailable or protocol skip as applicable. A started abandoned episode is preserved. Do not map lifecycle state to an O6 target result by assumption. |
| Capture/collection provenance | Required for collected streams; conditional per stream | Source, event time and collection/availability facts for required streams; technical failures and observable collection limitations. Keep event time distinct from later assessment-availability time. |
| Context variables | Conditional | Only variables pre-specified as relevant to the task/target or approved research purpose, with source, collection time and provenance. Minimise child data. |
| Derived interpretation | Excluded | No target assessment, evidence-status judgement, independence conclusion, mastery, developmental inference, next action or causal explanation in the raw observation. |
| Direct identifiers / unrelated metadata | Not part by default | No name, contact details, account credentials, unrelated profile attributes, inferred traits/diagnoses/motivation or unapproved context. Transport/request metadata is not canonical content unless a versioned contract explicitly makes it semantically relevant. |

**Stage A unresolved:** final G6 lifecycle field envelope; observation-ID namespace/uniqueness scope; exact required/conditional status of task-presentation subfields across task types; canonical representation of missingness; and general absent/null, scalar, collection and timestamp-equality rules. Event source order and O5 UTC/event-time semantics are already determined and must be preserved.

## 3. Stage B — target-assessment evaluation and recording

**Logical object:** one immutable assessment of one existing evidence target from one immutable observation.

**Idempotency identity:** G6 logical `assessment_id`; exact namespace/uniqueness scope remains open. The identity is not merely the observation/target pair.

| Field group | Classification | Source-derived content and boundary |
|---|---|---|
| Assessment identity | Required | Stable identity for this target-assessment instance. A different target assessment or actual reassessment receives a distinct identity. |
| Source observation | Required | Exactly one immutable `observation_id`. Do not copy/duplicate the raw observation as another observation. |
| Evidence target | Required | Exactly one existing `evidence_target_id`; must resolve under the applicable registry version. No target may be invented or inferred from a task model's opportunity list. |
| Task/registry provenance | Required where applicable | Exact task-instance, task-definition, task-model and curriculum-registry versions as applicable to the assessment. |
| Applicability per dimension | Required for every evaluated dimension | Explicit applicability state and reason when a dimension is not applicable. A missing/unapproved rule is not evidence of non-applicability. |
| Execution per dimension | Required for every evaluated dimension | Explicit rule execution state and reason when no result is emitted (e.g. not run, blocked or error, using the approved O6 vocabulary). |
| Dimension results | Conditional | Each completed dimension result and source/rationale reference. Emit a learner-result value only when the dimension is applicable and its rule completed. Preserve separate dimensions; do not flatten them into one score. |
| Support-event references | Conditional | References to relevant request/offer/delivery/dismissal events from the source observation. Request and delivered support remain distinct. |
| Target-specific independence rationale | Conditional | Rationale and references where the target requires an independence judgement. It must be based on actual delivered support and sufficient event capture; planned condition alone is not proof. |
| Scoring-rule version | Conditional | Exact task scoring-rule version where objective performance is scored. |
| Contract/rule/engine provenance | Required | O6/C3 contract version, target-rule version and assessment-engine version. |
| Event and availability times | Required | Assessment event time and assessment-availability time as separate facts; preserve O5 snapshot cutoff semantics. |
| Source references | Required | Source observation/event references needed to inspect and reproduce the assessment rationale. |
| Correction/reassessment lineage | Conditional | Prior assessment identity and explicit correction/reassessment reason when this record corrects or reassesses an earlier assessment. New identity; prior assessment remains immutable. |
| New derived learner state | Excluded | No direct mutation or embedding of C6 mastery, C7 action, curriculum promotion or learner-state updates in the target assessment record. |

**Stage B determined by O6 v0.3 §7:** the logical provenance groups above, one observation plus one target per assessment, stable assessment identity under G6/G9, and linked correction/reassessment history.  
**Stage B unresolved:** assessment-ID namespace/uniqueness scope; exact canonical equality treatment for each field type; and the rule-version compatibility semantics for a replay versus a genuinely new assessment execution. A changed version label alone is not permission to overwrite a prior assessment.

## 4. Stage C — frozen snapshot, C6 evaluation and C7 decision

Stage C must preserve the source lineage as distinct logical records. Do not treat the snapshot, C6 evaluation and C7 decision as interchangeable identities.

### 4.1 Frozen decision snapshot

| Field group | Classification | Source-derived content and boundary |
|---|---|---|
| Branch identity | Required | All six inspectable fields: `learner_key`, `curriculum_registry_version_id`, `claim_id`, `development_id`, `scope_id`, `time_window_id`. Equality compares all six; no claim-only key or locally invented hash. |
| Snapshot identity | Required | Stable immutable decision-snapshot identity, officially named `decision_snapshot_id` by owner decision G5-S3. |
| Scope/window provenance | Required | Exact scope and time-window definition IDs/versions. |
| Event-time interval | Required | Configured start-inclusive/end-exclusive interval, represented as UTC instants. |
| Assessment-availability cutoff | Required | Snapshot-specific cutoff distinct from event time. |
| Eligible raw observations | Required | Exact eligible raw-observation IDs included in this frozen snapshot. |
| Eligible target assessments | Required | Exact eligible target-assessment record IDs and applicable contract/schema/rule versions. Multiple target assessments may point to one observation. |
| Exclusions | Required | Excluded candidate records and explicit exclusion reasons, where candidates were considered. |
| Protocol provenance | Required | Registry and applicable O5/O6/C6/C7 protocol/version references needed to explain snapshot eligibility and evaluation. |

### 4.2 C6 evaluation record

| Field group | Classification | Source-derived content and boundary |
|---|---|---|
| C6 evaluation identity | Required | Official logical name `c6_evaluation_id` (G5-S3). O8's generic `evaluation_id` denotes this same C6 identity, not a second identity. Physical format/namespace/uniqueness remain open. |
| Snapshot reference | Required | Exact immutable snapshot identity consumed; never substitute a newer snapshot. |
| Branch identity | Required | Same complete six-part identity as snapshot; all six values preserved unchanged. |
| Source evidence references | Required | Exact observation and target-assessment references consumed from the snapshot. |
| C6 protocol provenance | Required | C6 protocol/version and applicable rule/model provenance. |
| Seven-gate trace | Required | Existing M1–M7 gate states and explicit reasons/trace; no gate meaning is changed by G9. |
| Mastery outcome | Required | Exactly the existing C6 outcome consumed downstream; do not reconstruct it from scores or evidence count. |

### 4.3 C7 decision record

| Field group | Classification | Source-derived content and boundary |
|---|---|---|
| C7 decision identity | Required | Official logical name `c7_decision_id` (G5-S3), distinct from `c6_evaluation_id`. Physical format/namespace/uniqueness remain open. |
| Exact C6 reference | Required | One exact `c6_evaluation_id` / O8 `evaluation_id` consumed by C7. |
| Snapshot and branch | Required | Exact snapshot reference and unchanged six-part branch identity inherited from the consumed C6 result. |
| C6 mastery outcome | Required | Exact outcome consumed unchanged; C7 must not recompute mastery. |
| Ordering inputs | Required | `prerequisite_ordering_state` and `next_development_ordering_state` remain separate; do not merge them into a generic ordering state. |
| Candidate action set | Required | Explicit candidates available in this curriculum context. |
| Decision result | Required | Selected candidate action or the exact hold candidate `HOLD_FOR_MORE_EVIDENCE`, with applicable C7 gates and reasons/trace. Unqualified `HOLD` is explanatory shorthand only (G5-S4). |
| C7 policy provenance | Required | Exact C7 action-policy/protocol version used. |
| Negative permissions | Required | C7 remains a candidate-action selector; it must not mutate mastery, learner state, curriculum registry or runtime instructions. |
| Cross-branch projection | Excluded from canonical branch decision | Any descriptive cross-branch projection is a separately typed downstream C8 concern under G4/O9; it is not folded into a single-branch C7 decision. |

**Stage C source reconciliation:** G5-S3 has approved the logical names `decision_snapshot_id`, `c6_evaluation_id` and `c7_decision_id`; O8's `evaluation_id` is the same C6 evaluation identity. C6/C7 remain distinct immutable records and separate ordered atomic writes within O7's existing decision-evaluation boundary. C7 consumes the exact committed C6 record. **C8 history boundary — OWNER-APPROVED 2026-11-09:** C8 is a derived, descriptive, non-authoritative read projection over committed C6/C7 records. `c8_item_id` is removed as an authoritative domain identity; no independent C8 write/idempotency/replay-conflict boundary exists. Logical projection lineage uses the exact six-part branch identity and approved snapshot/C6/C7 identities. Append-only history is inherited from immutable C6/C7 records. Any future materialization must be rebuildable and non-authoritative; physical handles, storage, refresh and canonical equality remain open under G8/G9. G5 remains OPEN for O6 input/provenance alignment, protocol-version/rejection crosswalk, examples and legacy compatibility. Physical identity namespaces/uniqueness and G9 equality/recovery semantics remain open.

## 5. Cross-stage canonical equality boundaries

The source contracts determine what facts must be preserved, but they do not yet define a general-purpose canonical serialization/equality algorithm.

| Concern | Determined | Still unresolved |
|---|---|---|
| Identity + payload outcome | Same identity/same canonical immutable payload = replay; same identity/different payload = integrity conflict (O7). | Concrete canonical comparison algorithm and identity namespaces. |
| Event ordering | Source/episode order is authoritative; timestamps do not reorder events (G6). | Serialization of event collection and representation of absent/empty event collections. |
| Time | Event time and assessment-availability time are separate; O5 uses UTC instants and a half-open interval. | Precision/truncation policy, input normalization and exact equality representation. |
| Collections | Event sequence order is meaningful. | For every other collection, whether order is meaningful or set-like must be declared by its owning contract; no blanket sorting. |
| Missingness | Distinct missingness/lifecycle states must be preserved; missingness is not incorrect/zero/failure by default (C2/O6). | Absent property versus explicit null versus explicit unknown, field by field. |
| Scalar/string values | Source meaning must be preserved; no coercion to force equality. | Numeric representation, Unicode/string normalization and object-key canonicalization. |
| Version changes | Assessment/protocol versions are provenance; changed eligible evidence/protocol creates a new snapshot/evaluation (O7/O8). | Version compatibility and exact criteria for a new assessment versus a new decision evaluation. |
| Transport metadata | No source contract makes request IDs, delivery attempts or network headers learner evidence. | Explicitly classify any operational metadata before including/excluding it from a durable stage envelope. |

No tests should assert unresolved equality semantics. Do not invent null rules, sorting, timestamp precision or normalization.

## 6. Gaps and dependencies

1. **G6:** final observation field envelope; observation/assessment identity namespace; interruption/resume policy; timeout duration/consequence; final C3/O6 lifecycle reconciliation.
2. **G5:** final naming and exact C6/C7/C8/C9 lineage envelope, including distinct C6 evaluation and C7 decision identities.
3. **G9:** stage-specific canonical equality contract; durable state vocabulary/transitions; uncertain-commit resolution; retry and same-identity concurrency semantics.
4. **G8/G10:** physical key/constraint design, stage transaction mechanics, security/RLS/authorization, retention and recovery implementation.
5. **G12:** explicit narrow implementation authorization after all applicable gates; no gate completion silently authorizes implementation.

## 7. Explicit exclusions

This inventory does not:
- prescribe database tables, columns, constraints, indexes, SQL/RPC/RLS or Supabase changes;
- choose UUIDs, hashes, composite keys, serializers, queues, outboxes, locks or retry libraries;
- authorize production runtime, learner-state, registry, task catalogue or learner-data changes;
- change O6 v0.3, O7/O8, C6 mastery gates, C7 action policy or curriculum mappings;
- establish empirical reliability, validity, transfer, mastery validity or product efficacy.

## 8. Current gate disposition

- G2/O6 v0.3: CLOSED at logical-contract level; frozen.
- G5: OPEN.
- G6: OPEN.
- G9: OPEN; this inventory is a source-derived field map, not a frozen contract.
- G8/G10: physical persistence/security gates remain separate.
- G3-037/038: BLOCKED pending approved identity scope, canonical payload equality/conflict and durable stage semantics.
- G3-039: logical correction lineage fixture-tested; durable append-only recording remains open.

No runtime, tests, registry, learner-state, physical schema, SQL/RPC/RLS, Supabase or learner data changed.
