# PacoGO — G9 Logical Idempotency Contract Candidate v0.1

**Status:** concrete logical contract candidate for owner review. Not approved for implementation. No physical persistence or security design.

## 1. Purpose

Translate owner-approved O7 and O8, O6 v0.3, C2 and the G6 identity boundary into a testable logical contract for the three staged idempotency boundaries.

This document intentionally does not define database tables, physical keys, SQL/RPC, RLS, transaction technology, locking, queues, outbox, serializer implementation or deployed Supabase behavior. Those belong to the later persistence/security gates.

## 2. Invariants that are already approved

The following are source requirements, not new proposals:

1. Raw-observation ingestion, target-assessment evaluation/recording and decision evaluation are three separate idempotency boundaries (O7).
2. Same identity plus same canonical immutable payload is replay; same identity plus different payload is an integrity conflict and must be rejected (O7).
3. Correction/reassessment creates a new linked/versioned identity and does not overwrite raw observations or prior decision history (O7/O6).
4. A changed eligible evidence set or protocol creates a new snapshot/evaluation (O7).
5. Each stage commits atomically within its own write unit and exposes durable, inspectable state for retry/recovery (O7).
6. C6 evaluates one frozen snapshot for one complete six-part branch and emits branch identity, snapshot ID, evaluation ID, protocol/version provenance, gate trace and exact observation/assessment references (O8).
7. C7 consumes one validated C6 result and preserves its exact branch, snapshot and evaluation identity; it does not recompute mastery or infer missing identity (O8).
8. One response episode creates one immutable raw observation; one observation may have multiple target-specific assessments; each target assessment references exactly one observation and one existing target (O6).
9. G6 defines one distinct logical identity per target-assessment instance, bound to exactly one observation and one target. Correction/reassessment is a new linked identity.

## 3. Stage contract candidate

### Stage A — raw-observation ingestion

**Logical object:** one immutable raw observation for one response episode.

**Candidate idempotency identity:** the G6 logical `observation_id`, scoped to the applicable learner/source namespace. G6 must confirm the exact namespace and uniqueness scope before G9 can be frozen. Do not substitute a task catalogue ID or an interaction-event ID for the observation identity.

**Logical payload content:**
- the observation identity and its learner/task-instance/response-episode provenance;
- exact task-definition/task-model/registry and presented-interface versions/configuration references where captured;
- ordered source interaction events and their event identities;
- captured response/output and objective performance facts where defined;
- actual administration/support-condition facts and relevant support events;
- event time, capture/source provenance and collection-availability facts;
- explicit missingness/technical-failure facts where applicable.

C2 requires raw interaction and observation records to preserve what happened without developmental interpretation. O6 prohibits embedding assessment conclusions or developmental inference in the raw observation.

**Replay/conflict:** same observation identity and equal canonical raw-observation payload → replay; same identity and different canonical payload → integrity conflict; original observation remains unchanged.

**Correction:** do not edit the raw observation. A corrected interpretation belongs to a separately identified derived/assessment record with source linkage. A genuinely new administration/response episode receives a new observation identity under G6.

### Stage B — target-assessment evaluation and recording

**Logical object:** one immutable target-specific assessment.

**Candidate idempotency identity:** G6 logical `assessment_id`. The record must refer to exactly one `observation_id` and exactly one existing `evidence_target_id`. The assessment identity is not replaced by the observation/target pair.

**Logical payload content (O6 v0.3 §7):**
- assessment identity, exact observation and target references;
- applicable task-instance, task-definition, task-model and curriculum-registry versions;
- applicability and execution state for each evaluated dimension, including reasons where no result is emitted;
- each completed dimension result with source/rationale references;
- relevant support-event references and target-specific independence rationale;
- scoring-rule version where performance is scored;
- O6/C3 contract version, target-rule version and assessment-engine version;
- event time and assessment-availability time;
- prior-assessment identity and correction/reassessment reason when applicable.

**Replay/conflict:** same assessment identity and equal canonical assessment payload → replay; same identity and different canonical payload → integrity conflict; preserve the original assessment.

**Correction/reassessment:** create a new assessment identity, link the prior assessment and preserve the reason. Never mutate the prior assessment. A second target from the same observation is a separate assessment identity, not a second observation.

### Stage C — decision evaluation

**Logical object:** one C6 evaluation for one frozen snapshot and one complete six-part branch, followed by a C7 decision that consumes that exact validated C6 result.

**Approved identity envelope:** O8 requires the C6 result to carry the complete six-part branch identity, `snapshot_id`, `evaluation_id`, protocol/version provenance, gate trace and exact observation/assessment references. C7 must preserve the exact branch, snapshot and evaluation identity.

**Candidate payload content:**
- complete six-part branch identity;
- snapshot identity and frozen snapshot provenance/cutoff;
- evaluation identity;
- exact eligible observation and target-assessment references;
- C6 protocol and relevant rule/engine versions;
- all required gate outcomes and their reasons/trace;
- C7 action-policy version and decision trace when recording the C7 result;
- exact C6 input/result reference consumed by C7.

**Critical unresolved identity decision:** O8 identifies the C6 evaluation with `evaluation_id`, but does not explicitly define whether C7 decision evaluation has its own separate idempotency identity or is recorded under the same evaluation identity with a distinct stage discriminator. G9 must not silently choose. Owner/architecture decision is required before the Stage C idempotency key can be frozen.

**Replay/conflict:** same approved Stage C identity and same canonical payload → replay; same identity and different payload → integrity conflict; preserve the original decision history. A changed eligible evidence set or protocol produces a new snapshot/evaluation identity, not an overwrite.

## 4. Canonical equality candidate

The following is proposed as the minimum semantic rule; details remain open:

- Compare the complete versioned logical payload for the relevant stage, not a hand-picked subset and not only whether related rows exist.
- Identity fields and provenance/version fields that define the record are part of the immutable payload or its explicitly versioned identity envelope.
- Transport/delivery metadata is excluded only when the contract explicitly classifies it as non-semantic.
- Preserve source order wherever the source contract defines order as meaningful (notably interaction events). Do not sort event streams by timestamp.
- Never normalize, coerce or discard values merely to make two payloads compare equal.
- Equality must be deterministic for a fixed payload-contract version.

**Not yet decided:** absent versus explicit null; number representation; Unicode/string normalization; object-key ordering; whether each collection is ordered or set-like; timestamp precision/time-zone input validation; payload-contract version migration/compatibility; canonical serialization format or digest. These decisions must be made before a canonical equality implementation or test oracle is written.

## 5. Stage state and failure contract candidate

O7 requires durable, inspectable stage state, but does not approve status names. The following are conceptual states to assess, not an adopted enum:

- not yet accepted;
- accepted/in progress;
- committed;
- retryable/uncertain outcome;
- rejected integrity conflict;
- terminal invalid input.

The logical contract must make it possible to determine whether a stage committed when a caller loses the response. Retrying a committed stage must return the prior logical result without duplicating history. Retrying an uncertain stage must first resolve whether the original write committed. A failed stage must not leave a partial result within that stage.

**Not yet decided:** exact state vocabulary, allowed transitions, timeout behavior, retention of failure records, retry policy/backoff, maximum attempts, recovery worker ownership, concurrent-request response semantics and how an in-progress operation is claimed/resolved.

## 6. Atomicity and dependency rules

- Stage A commits the raw observation as one logical atomic unit.
- Stage B commits one target assessment as one logical atomic unit. Multiple target assessments from one observation remain separate records and separate Stage B identities.
- Stage C commits one C6 evaluation/decision-stage unit according to the still-open Stage C identity decision.
- The three stages are not one transaction. A committed Stage A may exist while Stage B has not yet run; committed assessments may exist before a C6/C7 decision.
- A downstream stage may consume only complete, valid, committed upstream records with exact identity/provenance links.
- Failure in a later stage does not roll back or mutate a previously committed upstream stage.
- A correction is new linked history, not an overwrite or a replay.

## 7. Required conformance tests once details are approved

| Test | Expected logical result |
|---|---|
| Same Stage A identity, same complete payload | Replay; one observation history item |
| Same Stage A identity, altered captured response/event/provenance | Conflict; original preserved |
| Same Stage B identity, same complete payload | Replay; one assessment history item |
| Same Stage B identity, altered dimension result/rule version/source reference | Conflict; original preserved |
| Same observation, two distinct targets and assessment identities | Two assessments; one observation |
| Same Stage B identity reused for a different target | Conflict |
| Correction with new assessment identity and prior link | New immutable assessment; prior preserved |
| Same Stage C identity and same frozen branch/snapshot/protocol/trace payload | Replay |
| Same Stage C identity with changed eligible evidence or protocol | Conflict; new snapshot/evaluation required |
| Same snapshot with a later-arriving eligible assessment | New evaluation/snapshot; prior evaluation unchanged |
| Failure before a stage commit | No partial result within that stage |
| Response lost after commit, then retry | Resolve committed result; no duplicate |
| Two concurrent same-identity/same-payload requests | One logical commit; other resolves as replay |
| Two concurrent same-identity/different-payload requests | One immutable original; other resolves as conflict |
| Stage B committed, Stage C unavailable/fails | Stage B remains committed; Stage C safely retryable |
| C7 receives missing/mismatched C6 branch/snapshot/evaluation identity | Reject; do not infer or reconstruct identity |

Tests for null/absence, ordering, normalization, status transitions, timeouts and retry races must wait for explicit decisions; the expected behavior must not be guessed in tests.

## 8. Explicit open decisions required to freeze G9

1. Confirm Stage A identity namespace and uniqueness scope under G6.
2. Approve the exact canonical logical field set for Stage A, including task/interface configuration and timing provenance.
3. Approve absent/null, scalar normalization, collection-order and timestamp equality rules.
4. Confirm Stage B's exact G6 assessment identity namespace and whether assessment-rule/engine version changes always require a new assessment identity (the current candidate assumes a new linked assessment when the assessment itself is rerun under changed rules).
5. Decide whether Stage C has one identity per C6 evaluation and a distinct C7 decision-stage identity, or a shared evaluation identity plus an explicit stage discriminator.
6. Define the canonical payload envelope for the frozen C6 snapshot and its gate trace, and what constitutes a new snapshot versus a replay.
7. Approve durable stage-state vocabulary and valid transitions.
8. Define uncertain-commit recovery and retry behavior.
9. Define same-identity concurrency and in-progress duplicate behavior.
10. Define timeout semantics without inventing automatic terminal transitions.
11. Reconcile the logical contract with G8/G10 security/persistence constraints before physical design.

## 9. Gate status and exclusions

- G6 logical event and target-assessment identity fixture coverage exists, but full lifecycle approval remains open.
- G9 is not closed by this candidate. The open decisions above remain open until explicitly decided and tested.
- G3-037/038 remain blocked until canonical payload equality/conflict and durable stage semantics are approved and testable.
- G3-039 logical lineage remains tested; durable append-only recording remains open.
- No production runtime/evaluator, schema, database, SQL/RPC/RLS, Supabase or learner data changed.
- O6 v0.3 remains frozen. O7/O8 are not silently amended by this candidate.
- Branch: `refactor/professional-v1`. LIVE `main` untouched.
