# PacoGO — G9 Logical Stage Contract: Source-Determined Requirements v0.1

**Status:** source-derived contract baseline for owner review. Not a frozen G9 contract and not implementation authorization.  
**Branch:** `refactor/professional-v1`  
**Scope:** logical identity, replay/conflict outcomes, immutability, stage boundaries and dependencies already determined by O7/O8, O5, O6 v0.3, C2, G6 fixtures/proposals and the C8/C9 crosswalk.  
**Explicit exclusions:** canonical serialization, physical keys/schema, API/RPC, SQL/RLS, Supabase, locking, queues/outbox, retry scheduling and runtime implementation.

## 1. Purpose and decision rule

This document consolidates only requirements already supported by the source contracts. It does not convert a candidate or fixture into owner approval. Where sources do not determine an exact behavior, the item remains OPEN and must not be encoded in production logic or tests as if decided.

O7 is authoritative for the staged idempotency outcomes:
- same stage identity plus same canonical immutable payload is a replay;
- same stage identity plus different canonical immutable payload is an integrity conflict and must be rejected;
- corrections/reassessments are new linked/versioned identities, not overwrites;
- a changed eligible evidence set or applicable protocol produces a new snapshot/evaluation;
- each stage has its own atomic write unit and durable, inspectable state for retry/recovery;
- the complete observation-to-decision chain is not one transaction.

## 2. Cross-stage invariants

1. The three O7 boundaries remain distinct: raw-observation ingestion; target-assessment evaluation/recording; decision evaluation.
2. Identity is evaluated within its approved namespace. G6 has not yet approved the complete Stage A/B namespace and uniqueness scope; this document therefore does not define a physical or global key.
3. The immutable payload is the complete semantic content defined by the relevant versioned logical contract, not a selected subset and not a proxy such as “related rows exist”.
4. Replay does not create a second logical history item or mutate the original.
5. Integrity conflict rejects the attempted reuse and preserves the original immutable record.
6. Correction or reassessment creates a new linked identity and preserves prior history.
7. Downstream stages consume complete upstream records through exact identity/provenance references. They do not reconstruct missing identity from partial fields.
8. Event source order is preserved where defined by G6/O5/O6; timestamps do not silently reorder interaction events.
9. Event time and assessment-availability time remain separate facts. O5's UTC instant and half-open event-time interval semantics remain applicable.
10. Missing/no-response/technical-failure lifecycle facts are not converted into fabricated incorrect responses or assessment results.

## 3. Stage A — raw-observation ingestion

**Logical record:** one immutable raw observation for one separately administered response episode.

**Identity:** G6 logical `observation_id`. The exact namespace and uniqueness scope remain OPEN under G6.

**Determined content boundary:**
- one response episode maps to one raw observation;
- preserve the task-instance and response-episode provenance and pseudonymous learner linkage;
- preserve the actual administered task/presentation and material deviations, where captured;
- preserve raw response/output and modality, where present;
- preserve interaction events with stable identity within exactly one parent episode and source/episode order;
- preserve planned and actual support/administration conditions as distinct facts; request, offer and delivery are not interchangeable;
- preserve explicit lifecycle, missingness, interruption/abandonment and technical-failure facts where applicable;
- preserve relevant source/capture provenance and event-time facts;
- do not place assessment conclusions, developmental inference, mastery or next-action conclusions in the raw observation.

**O7 outcomes:**
- same approved observation identity + same canonical immutable raw-observation payload → replay;
- same identity + different canonical immutable payload → reject as integrity conflict;
- do not overwrite or “correct” the raw observation.

**Lifecycle boundaries already established:** ordinary edits/retries within one administration remain events in that episode; an explicit new administration/restart is a new episode/observation; a material support-condition change under the owner-approved support rule creates a new task instance, response episode and observation. Interruption/resume and timeout completion rules remain OPEN under G6.

## 4. Stage B — target-assessment evaluation and recording

**Logical record:** one immutable target-specific assessment.

**Identity:** G6 logical `assessment_id`. Each assessment references exactly one immutable `observation_id` and exactly one existing `evidence_target_id`. Multiple targets may be assessed from one observation, using distinct assessment identities.

**Determined content boundary (O6 v0.3 §7):**
- assessment identity and exact observation/target references;
- applicable task and curriculum provenance/version references;
- applicability and execution state per assessed dimension, with reasons where no result is emitted;
- results only for applicable dimensions whose assessment execution completed;
- source/rationale references;
- relevant support-event references and target-specific independence rationale where applicable;
- scoring-rule version where scoring is applied;
- applicable O6/C3 contract, target-rule and assessment-engine versions;
- event time and assessment-availability time as separate facts;
- prior-assessment link and correction/reassessment reason when applicable.

**O7 outcomes:**
- same approved assessment identity + same canonical immutable assessment payload → replay;
- same identity + different canonical immutable payload → reject as integrity conflict;
- preserve the original assessment.

**Correction/reassessment:** a real reassessment under a changed rule/contract/engine uses a new linked assessment identity; prior assessment remains unchanged. Reusing one assessment identity for a different target is invalid.

**Still OPEN:** final G6 owner approval and complete lifecycle reconciliation; exact namespace/uniqueness scope; exact version compatibility/equality envelope. Do not infer these from fixture coverage alone.

## 5. Stage C — decision evaluation

**Logical flow:** immutable decision snapshot → C6 evaluation → C7 decision consuming the exact C6 result.

**Determined by O5/O7/O8 and the C8/C9 crosswalk:**
- a snapshot is an immutable input, distinct from the C6 evaluation;
- the snapshot is tied to one complete six-part branch identity;
- event-time membership uses the approved UTC half-open interval, with a separate assessment-availability cutoff;
- preserve exact eligible observation and target-assessment references, exclusions and relevant protocol/registry provenance;
- C6 evaluates the frozen snapshot and retains its own evaluation identity, protocol/version provenance, gate trace and exact outcome;
- C7 consumes one validated C6 result and preserves the exact branch, snapshot and C6 evaluation identity; it must not recompute mastery or infer missing identity;
- the source-aligned C8/C9 model uses a distinct C7 decision identity that references the C6 evaluation identity.

**Replay/conflict baseline:** O7's same-identity/same-payload replay and same-identity/different-payload conflict outcomes apply to decision evaluation. A changed eligible evidence set or applicable protocol requires a new snapshot/evaluation; prior history remains unchanged.

**G5 dependency — OPEN:** G5 must approve the final C6/C7 cross-stage identity and lineage envelope, including final naming and the exact Stage C idempotency unit boundaries. This document does not decide whether C6 evaluation and C7 decision are persisted as one or separate atomic write units. Do not write conformance tests for that unresolved atomicity detail.

## 6. Atomicity and recovery: what is and is not determined

**Determined by O7:**
- each of the three idempotency stages has an atomic write unit;
- no stage may expose a partially committed logical result;
- each stage exposes durable, inspectable state sufficient to support retry/recovery;
- a committed upstream stage is not rolled back or mutated because a downstream stage fails;
- the whole three-stage chain is not one transaction.

**Not determined by O7 and therefore OPEN:**
- state names, state machine and transition rules;
- how a caller resolves a lost response or uncertain commit;
- retry eligibility, timing, backoff, limits or ownership;
- concurrency arbitration and in-progress duplicate behavior;
- operation timeout semantics and recovery;
- retention of failed/diagnostic records;
- transaction, locking, outbox, queue or recovery-worker mechanism.

The G6 learner-administration timeout is a separate policy from a G9 persistence-operation timeout. Elapsed time alone must not be used to invent a learner episode terminal state or a persistence result.

## 7. Canonical equality: determined constraints versus OPEN choices

**Determined constraints:**
- equality applies to the complete semantic immutable payload for the relevant stage and its applicable contract version;
- identity and provenance/version facts that define the record cannot be silently ignored;
- preserve source-defined event order;
- preserve O5 UTC instant and interval semantics;
- preserve distinctions among absent response, explicit no-response, interruption, abandonment, technical failure and completed performance;
- do not normalize/coerce/drop information merely to force equality.

**OPEN choices requiring explicit contract decisions before implementation or equality tests:**
- absent versus explicit null;
- numeric representation and scalar coercion;
- Unicode/string normalization;
- object/property ordering where relevant to the chosen canonical representation;
- per-field collection ordering versus set semantics (except source event order, already determined);
- timestamp precision and accepted input representation;
- contract-version compatibility/migration behavior;
- transport metadata inclusion/exclusion;
- canonical serialization format or digest.

No serializer, hash, JSON canonicalization profile or equality test oracle is selected here.

## 8. Conformance assertions that are safe to specify now

The following are logical assertions supported by the current sources and existing G6 fixture coverage:
1. one administered response episode maps to one immutable raw observation;
2. each interaction event belongs to exactly one parent response episode;
3. source event order is preserved independently of timestamp order;
4. one target assessment references exactly one observation and one existing target;
5. one observation can support multiple distinct target assessments;
6. correction/reassessment uses a new linked assessment identity and preserves the prior assessment;
7. Stage A/B same-identity replay and conflict are the required O7 outcomes, but executable payload-equality tests await G6 identity approval and G9 canonical-equality decisions;
8. a changed eligible evidence set/protocol requires a new immutable snapshot/evaluation;
9. C7 must consume the exact C6 evaluation identity and preserve its branch/snapshot lineage;
10. a downstream failure does not authorize mutation/rollback of an already committed upstream stage;
11. no stage may expose a partial logical commit.

The list does **not** authorize tests that assume null/absence behavior, normalization, arbitrary collection order, timestamp precision, status transitions, retry races or Stage C atomic write-unit details.

## 9. Dependency and gate status

| Gate | Required contribution | Current status |
|---|---|---|
| G5 | Final C6/C7 identity and lineage approval for Stage C | OPEN |
| G6 | Final observation/assessment identity namespace and lifecycle envelope | OPEN |
| G9 | Canonical equality details, durable stage states, retry/concurrency/recovery contract | OPEN |
| G8/G10 | Physical persistence and security design after logical contract | OPEN / downstream |
| G12 | Explicit implementation authorization | REQUIRED before implementation |

G3-037/038 remain BLOCKED on approved G6 identity and G9 replay/conflict semantics. G3-039 logical lineage is fixture-tested; durable recording remains open.

## 10. Non-goals and safety boundary

No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data are changed by this artifact. O6 v0.3 remains frozen. This artifact does not assert anything about deployed Supabase state. It does not close G5/G6/G9 or authorize implementation.

**Next concrete step:** resolve the G5 Stage C identity/atomicity envelope and the remaining G6 identity/lifecycle decisions, then decide the G9 canonical-equality and durable-recovery semantics from those approved contracts. Only after those decisions should conformance tests for the newly decided behavior be authored.
