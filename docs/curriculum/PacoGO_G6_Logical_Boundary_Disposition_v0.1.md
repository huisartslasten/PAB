# PacoGO — G6 Logical Boundary Disposition v0.1

**Status:** approved logical disposition under owner-delegated judgement; G6 remains OPEN; no runtime authorization  
**Date:** 2026-11-09  
**Branch:** `refactor/professional-v1`  
**Authority:** The owner explicitly delegated the bounded choice to proceed using the project's best judgement after the candidate recommendations were presented. This record makes the conservative, source-aligned logical decisions below. It does not infer permission for G12 implementation.

## 1. Decision purpose

Three source-led G6 reviews and a field-level code matrix established the current repository behavior and the minimum logical contract needed to distinguish reusable curriculum objects from actual learner administrations and their evidence:

- `PacoGO_G6_Task_Instance_Response_Episode_Cardinality_Review_v0.1.md`
- `PacoGO_G6_Identity_Namespace_Uniqueness_Scope_Review_v0.1.md`
- `PacoGO_G6_Learning_Interface_Presentation_Provenance_Review_v0.1.md`
- `PacoGO_G6_Field_Level_Contract_to_Code_Matrix_v0.1.md`

The disposition chooses the minimum coherent logical boundary needed to prepare a safe first FR2 implementation. It deliberately does not settle physical, persistence or G9 mechanics.

## 2. Approved G6-A — administration and observation cardinality

1. A task instance represents one **started concrete administration**, not a catalogue task, preview or unopened task card.
2. When the administration starts, PacoGO creates exactly one task-instance identity and exactly one response-episode identity together. Their logical cardinality is **1:1**.
3. Each response episode maps to exactly one immutable raw observation. Cardinality is **1:1**.
4. A preview or unopened task creates none of these administration identities.
5. A started incomplete or abandoned episode is still represented by its one immutable raw observation and captured history. No answer, score or evidence result is fabricated by abandonment or non-response.
6. Ordinary answer edits, revisions and retries remain events in the same response episode. Explicit restart after completion creates a new task instance, response episode and observation.
7. A response episode has zero or more interaction events. Source event order is authoritative; timestamps do not reorder events.
8. One raw observation may have zero or more target-specific assessments. Each assessment has its own identity and references exactly one observation and one existing evidence target. A correction/reassessment is a new linked assessment; prior assessment and raw observation remain immutable.

**Rationale:** this preserves the distinction between authored task, actual administration, response process, raw observation and assessment. It prevents a preview from being counted as learner evidence and prevents one response from being multiplied into several independent observations when several targets are assessed.

## 3. Approved G6-B — logical identity namespaces and uniqueness

The following identities are distinct and must not be substituted for one another:

- reusable task definition and its immutable version;
- reusable task model and its immutable version;
- concrete task instance;
- response episode;
- interaction event;
- immutable raw observation;
- target-specific assessment.

Logical uniqueness boundaries:

- Task definition IDs and task model IDs belong to their respective entity namespaces. An immutable reusable revision is identified by its own (ID, version) pair. No parent relationship between task definition and task model is implied.
- Task-instance, response-episode, raw-observation and target-assessment identities are each unique within their respective PacoGO operational identity domains. This is a logical boundary only; it does not define tenants, deployment environments or physical key/index design.
- Event identity is unique within its parent response episode. The qualified logical event reference is (response-episode ID, event ID). The current source/consumer contract does not require a globally unique standalone event ID.
- A target-assessment identity is distinct from observation ID and evidence-target ID. Reassessment/correction always creates a new linked assessment identity.
- C2 learner/study/session/wave identifiers remain contextual provenance and do not replace the G6 object identities.
- No domain identity is derived from timestamp, answer content, event type, learner identity or array position.

## 4. Approved Learning Interface / presentation provenance boundary

1. A reusable Learning Interface has its own ID and immutable version. It is not the task definition or task model.
2. The effective task-specific interface configuration used for an administration is retained as actual administration provenance. A separate globally unique configuration ID is not required unless a demonstrated consumer need emerges.
3. Renderer identity/version, where versioned, is distinct from Learning Interface identity/version.
4. Materially relevant rendered representation/layout, accessibility/language presentation settings and material presentation deviations are retained as administration provenance anchored to the started task instance.
5. The raw observation retains a stable path to the actual administration provenance. Interaction state and event history remain in the response-episode layer, not in reusable interface identity/configuration.
6. The logical model permits multiple Learning Interface provenance entries where a composed task genuinely uses multiple interfaces. It does not force every task to use an interface or impose a universal one-interface-per-task cardinality.
7. Transient CSS/DOM/rendering details are not required unless they materially affect the learner's experience, interpretation or evidence.

**Adaptive instruction boundary:** instructional-method profile, its source/provenance and its known/unknown/uncertain status remain separate from curriculum objective and Learning Interface identity. This disposition does not permit PacoGO to infer a school's teaching method from learner interaction alone or to claim alignment when the method is unknown.

## 5. Explicitly not decided

This record does not decide:

- UUID/ULID or other physical ID formats, random/deterministic generation or key-generation library;
- canonical serialization, absent/null rules, normalization, hashes or content-derived identity;
- physical primary/foreign keys, unique indexes, schema, tables, transactions or persistence;
- idempotency-key encoding, replay/conflict mechanics, retry/backoff, concurrency, uncertain commit or recovery;
- physical interruption snapshots, storage or hashing;
- target-assessment labels, C3 scoring rules, mastery criteria or next-action rules;
- timeout duration or a universal timeout default;
- learner-facing lifecycle vocabulary or any new assessment label;
- runtime, tests, registry, learner state, database, SQL/RPC/RLS or Supabase changes.

Frozen O6 v0.3 remains unchanged. The G5-approved operational provenance boundary remains controlling; this record does not promote a draft C3 proposal into an approved operational codebook.

## 6. Remaining G6 work

G6 remains OPEN for:

1. A versioned timeout policy with explicit duration and consequence before timeout is used by any task/session.
2. Reconciliation of completion, incomplete, abandonment, interruption/resume, restart and policy-triggered timeout vocabulary/transitions with frozen O6 v0.3. No assessment label may be invented for missing/no-response/incomplete episodes.
3. Operational verification of exact interruption restoration: same task content/version, presentation/representation, response mode, support condition and recorded progress/event history. Physical snapshot/hash/storage implementation remains deferred.
4. Final field-level reconciliation of the administration and target-assessment provenance envelope against frozen O6 v0.3 and the current operational C3 contract.
5. Interface-specific renderer-versioning thresholds and the exact boundary between material presentation facts and transient rendering noise, as needed by real evidence/reproducibility requirements.

The approved logical boundaries in §§2–4 are not reopened by these remaining items.

## 7. G9, G12 and FR2 consequences

- G9 may use the approved G6 identity/cardinality/provenance decisions as logical inputs. G9 remains OPEN for canonical payload equality/serialization, replay/conflict, durable stage-state, retry/concurrency and recovery.
- G8/G10 remain responsible for physical persistence/security; G11 for conformance tests after semantics are approved.
- The first implementation target remains the existing FR2/Fraction path, preserving all five existing technical demonstrations. They are synthetic integration fixtures, not learner evidence.
- The shared interaction contract has eight direct controller consumers. Before changing it, inspect consumer/test compatibility and choose either a backwards-compatible extension or a deliberate FR2 adapter. Do not patch only the symptom in Fraction.
- **G12 remains NOT AUTHORIZED.** A separate, narrow G12 authorization is required before any runtime implementation.

## 8. Verification boundary

This is a documentation-only logical disposition. It changes no runtime code, tests, curriculum registry, learner state, schema, persistence, database, SQL/RPC/RLS, Supabase or learner data. It does not claim empirical validation.
