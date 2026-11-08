# PacoGO — G9 Staged Idempotency Requirements Review v0.1

**Status:** source-derived requirements review; not a final G9 implementation contract; no implementation authorization.

## 1. Purpose and boundaries

This review isolates the logical requirements for G9 from the G6 identity model and the G8/G10 physical persistence/security design.

It is based on:
- Owner Architecture Decisions v0.1, O7 — Idempotency and staged atomicity.
- Operational Assessment Contract v0.3 §7 and §9.
- G6/G7 Read-Only Identity and Consumer Audit v0.1 §§4.2–4.4.
- Learner Ownership and Persistence Contract v0.1.
- G6 Task/Observation Identity Lifecycle Proposal v0.1, especially §§4–6.

This review does not select tables, columns, database keys, RPC boundaries, SQL, transaction/outbox technology, locking mechanism, queue, serializer library or deployed migration plan. Those belong to the applicable persistence/security gates. It does not authorize changes to Supabase or the learner runtime.

## 2. Owner-approved O7 requirements

O7 establishes three separate idempotency boundaries:

1. Raw-observation ingestion.
2. PacoGO target-assessment evaluation and recording.
3. Decision evaluation.

For each boundary, the logical outcomes are:

| Existing identity | Incoming immutable content | Required outcome |
|---|---|---|
| Same | Same canonical immutable payload | Idempotent replay; do not create duplicate history |
| Same | Different canonical immutable payload | Integrity conflict; reject and preserve the original |
| New linked/versioned identity | Corrected or reassessed content | Append a new linked version; do not overwrite the prior record |

A changed eligible evidence set or protocol produces a new snapshot/evaluation, not an overwrite.

Each stage must:
- commit atomically within its own write unit;
- expose a durable, inspectable state that supports retry and recovery;
- avoid partial writes inside the affected stage on failure.

The complete learner-observation-to-decision timeline is not one transaction. Assessment evaluation and C6/C7 may occur at distinct times.

## 3. G9 logical responsibilities

### 3.1 Canonical immutable payload contract

G9 must define, separately for each idempotency boundary:
- the exact logical fields included in the immutable payload;
- the treatment of required, optional, absent and null values;
- whether collection order is semantically meaningful for each field;
- normalization rules, if any, and the rule version under which they apply;
- which provenance/version fields are immutable parts of the payload;
- which delivery/transport metadata is not part of the logical payload;
- how payload-contract version changes affect replay comparison.

No implementation may compare only a subset of fields and call it canonical equality. No field normalization may be invented from database convenience.

### 3.2 Identity and idempotency scope

G6 defines the logical identity of the object being processed. G9 must define the idempotency boundary and scope that identity uses for each stage.

The identity for raw-observation ingestion, target-assessment recording and decision evaluation must not be conflated. A target-specific assessment has its own logical identity under G6; a reassessment is a new linked identity. A changed snapshot/evaluation is new history.

G9 must specify what makes a retry the same operation, including how the same logical identity is carried across repeated delivery. It must not substitute a source event ID for every stage identity without an explicit contract decision.

### 3.3 Stage state and recovery

O7 requires durable, inspectable stage state, but does not define a status vocabulary or state machine. G9 must determine:
- which stage states are necessary and what each means;
- which transitions are valid;
- how a caller distinguishes not-started, in-progress, committed, retryable failure and terminal conflict/error;
- how a retry discovers whether a prior attempt committed;
- how recovery resumes without duplicating a completed stage;
- how a permanently invalid payload is distinguished from a transient failure.

These are open design questions, not pre-approved status labels.

### 3.4 Atomicity and failure behavior

For each stage, G9 must identify:
- the logical write unit that either commits fully or leaves no partial stage result;
- the durable evidence of successful commit;
- the behavior when a response is lost after commit;
- the behavior when failure occurs before commit;
- the behavior when failure occurs during a multi-record stage;
- how downstream stages discover and consume only valid committed upstream results.

O7 requires stage-local atomicity, not a single transaction spanning all three stages.

### 3.5 Retry, concurrency and conflict handling

G9 must specify:
- concurrent submissions carrying the same identity and same payload;
- concurrent submissions carrying the same identity and different payloads;
- the winner/loser response and durable result in a race;
- whether a retry can safely run while the original request is still in progress;
- how an integrity conflict is retained and surfaced without mutating the original;
- how linked correction/reassessment is distinguished from a replay.

No silent last-write-wins behavior is compatible with O7's integrity-conflict requirement.

## 4. Current implementation finding — audit only

The G6/G7 read-only audit records that the current `persist_curriculum_learning_cycle` RPC performs one atomic operation that:
1. inserts one student-evidence row;
2. upserts one skill-level longitudinal-state row;
3. inserts one decision trace.

Its current idempotency key is learner + source event. On duplicate key, it checks that the evidence, state and trace rows exist and returns `duplicate: true`; it does not compare the existing raw observation/assessment/decision content against a canonical immutable payload.

Therefore the audited current behavior does not distinguish same-key/same-payload replay from same-key/different-payload conflict, and its single combined write is not the three separate O7 idempotency boundaries.

This is a recorded architecture gap, not an instruction to patch the RPC. The audit describes committed repository migrations and source; it does not assert the live state of a deployed Supabase environment.

## 5. Security and persistence constraints

The existing Learner Ownership and Persistence Contract records guardian-to-learner ownership, RLS-scoped reads, append-only evidence/decision history for normal clients, a narrowly scoped authenticated write path, `SECURITY INVOKER` RPC behavior, transaction-local capability cleanup and atomic rollback guarantees.

Any later G8/G10 physical design must preserve these controls. This G9 requirements review does not redesign them and does not authorize:
- table/column/index/constraint changes;
- RPC or function changes;
- RLS or privilege changes;
- migrations or learner-data rewrites;
- Supabase environment changes.

## 6. G9 acceptance questions

G9 cannot close until the following are explicitly specified and testable:

1. Canonical immutable payload field set for each of the three stages.
2. Canonical equality rules, including null/absence, collection order, normalization and contract version.
3. Identity/idempotency scope for each stage, aligned with G6.
4. Same-identity/same-payload replay behavior.
5. Same-identity/different-payload conflict behavior and preservation of the original.
6. Durable stage state and valid transitions.
7. Stage-local atomic commit and failure semantics.
8. Lost-response retry and recovery after an uncertain commit.
9. Concurrent same-identity/same-payload requests.
10. Concurrent same-identity/different-payload requests.
11. Correction/reassessment as a new linked identity, not replay or overwrite.
12. Snapshot/evaluation versioning when eligible evidence or protocol changes.
13. Contract tests covering positive, negative, concurrency and recovery cases.
14. Compatibility with the existing ownership/RLS/security contract, to be designed under G8/G10.

A G9 design must not use tests to choose undocumented canonicalization behavior. Any unresolved case remains blocked/unknown rather than silently accepted.

## 7. Gate disposition

- **G6:** logical event identity/order and target-assessment identity boundaries now have fixture coverage; interruption/resume, timeout and final lifecycle approval remain open.
- **G9:** requirements are extracted here; detailed canonical payload, stage state, retry/concurrency and recovery contract remains OPEN.
- **G8/G10:** physical persistence and security design remain separate and are not addressed here.
- **G3-037/038:** remain blocked until G9 defines canonical payload equality/conflict and idempotent stage recording in addition to the G6 identity boundary.
- **G3-039:** logical correction/reassessment lineage is tested; durable append-only recording remains dependent on G9.
- **G12:** no implementation authorization is implied.

No runtime, production assessor, database, SQL/RPC/RLS, Supabase or learner data changed.
