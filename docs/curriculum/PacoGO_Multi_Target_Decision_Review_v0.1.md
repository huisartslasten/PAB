# PacoGO — Multi-Target Decision Review v0.1

Status: design review / recommendations for owner decision / NOT approved for implementation  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Reviewed contract: `PacoGO_Integrated_Multi_Target_Decision_Contract_v0.1.md`  
Review baseline: `ac01f16538639537d0a91940c936c224fc4965b1`, Full Regression #3031 GREEN on this exact commit

## 1. Purpose and boundary

This review evaluates the seven open decisions (O1–O7) in the integrated multi-target contract against the current C3 v0.2 proposal, the consolidated C3 observation/event reconciliation, the C3 descriptive reliability layer, the C6–C9 protocols, the validation-data specification and the inspected runtime/persistence consumers.

It makes design recommendations where the evidence is sufficient and identifies decisions that still require explicit product/scientific-owner approval.

This document does not approve the C3 codebook, change curriculum meanings or mastery rules, authorize runtime implementation, change tests, alter registry/task mappings, or authorize database/Supabase migrations.

## 2. Important correction: separate observation ingestion from later coding

The integrated contract's single-event atomicity language is too coarse if interpreted as requiring all C3 assessments to exist when the learner response is first persisted.

The C3 design explicitly allows:
- independent coder records;
- multiple coding rounds;
- disagreements retained before adjudication;
- later adjudication as a linked resolution;
- recoding under a new codebook version without overwriting earlier records.

Therefore the system must distinguish three lifecycle stages:

1. **Observation ingestion:** persist one immutable raw administration/response episode once.
2. **Assessment/coding:** append one or more versioned target-specific assessments and coder-round records later. These records refer to the same observation and never duplicate it.
3. **Decision evaluation:** evaluate a frozen, explicitly identified assessment snapshot/version. C6–C9 must record exactly which assessment records and codebook version they consumed.

A task can be completed before human coding is complete. Until the required assessments are ready, the decision status remains not assessed or insufficient evidence according to the approved protocol; the system must not invent provisional C3 values.

Atomicity applies within each write unit:
- observation ingestion is atomic and idempotent;
- one submitted assessment batch is atomic and idempotent;
- one decision evaluation and its affected branch-state/trace updates are atomic;
- a failure in one target branch of a single decision batch must not leave a partial set of branch decisions.

This staged lifecycle replaces any interpretation that observation, all future coder rounds, adjudication and all C6–C9 decisions must be one database transaction.

## 3. O1 — Canonical C3 assessment storage

**Recommendation: normalized target-assessment and coding-provenance relations; retain the raw observation as one parent record.**

Suggested logical separation:
- raw observation parent: immutable response episode, raw event stream and administration provenance;
- target-assessment record: one observation × evidence target × assessment/codebook version;
- coder-round record: one coder's immutable assessment of that target/observation in a named round;
- adjudication/resolution record: linked decision that references the coder records it resolves;
- assessment-set/snapshot record: explicit frozen set of assessments eligible for a particular inference run.

JSONB remains appropriate for the raw response payload and flexible instrument-specific event detail. It should not be the only canonical store for coder identity, rounds, adjudication lineage and target-level referential integrity.

Rationale:
- C3 v0.2 requires independent records to remain immutable.
- Multiple targets, multiple coders and later adjudication are first-class cardinalities.
- Relational constraints make target/observation/coder/version relationships queryable and enforceable.
- A JSONB-only design could encode the same tree, but would make per-target integrity, coder workflow, adjudication queries and audit constraints materially harder.

This is a recommendation for the canonical assessment store, not authorization to create tables. Before implementation, the exact normalized relations and retention/access rules must be designed against the approved C3 codebook and child-data governance.

## 4. O2 — Physical branch-state persistence

**Recommendation: normalized branch identity plus append-only decision history; any current-state row is a derived projection.**

The six-part branch tuple remains the logical identity:
- learner key;
- curriculum registry version;
- claim;
- development;
- scope;
- time window.

Suggested logical model:
- branch identity record with a uniqueness constraint over the six fields;
- append-only decision-evaluation/trace records, each tied to a branch and frozen assessment snapshot;
- optional current-branch projection keyed by branch identity and carrying the latest accepted decision revision;
- skill-level summary derived from branch projections, never authoritative.

Concurrency requirements:
- branch updates must use an explicit revision/compare-and-swap or equivalent serialization mechanism;
- two evaluations against the same prior branch revision must not silently overwrite each other;
- the winning/current projection must be traceable to its immutable decision record;
- historical branch decisions remain available even when the current projection advances.

C8 temporal history should be reconstructable from explicit C6/C7 decision snapshots. Do not make a mutable skill-level row the only historical source.

This resolves the logical direction of O2. Exact physical tables, locking strategy and query shape remain subject to service/read-path design.

## 5. O3 — Deterministic branch-ID serialization

**Recommendation: versioned canonical tuple encoding; retain the six original fields; use a cryptographic digest only as a compact surrogate.**

Candidate canonical input:

`pacogo-decision-branch:v1` followed by a canonical JSON array of the six UTF-8 string identifiers in the fixed tuple order.

Requirements:
- all six identifiers must be non-empty strings;
- tuple order is fixed and documented;
- serialization is deterministic and independent of object key order or whitespace;
- no locale-sensitive sorting or implicit case-folding;
- identifiers are not trimmed or rewritten during identity generation; registry validation rejects malformed IDs upstream;
- the version prefix makes future serialization changes explicit;
- `decision_branch_id` may be SHA-256 of the canonical bytes, encoded as lowercase hexadecimal or base64url;
- persist and expose all six source fields alongside the digest;
- verify equality using the original tuple, not digest alone, at trust boundaries.

Do not use task, target, observation or source-event IDs in the branch identity. They are evidence provenance, not decision-context identity.

This is a recommended deterministic contract. The exact byte-level canonicalization test vectors should be authored before implementation.

## 6. O4 — Legacy projection API

**Recommendation: read-only compatibility adapter; never fabricate a primary target for multi-target records.**

Rules:
- historical scalar records remain byte/meaning-preserving and retain their original schema/codebook provenance;
- legacy rows may be exposed as a virtual single-target assessment view, explicitly marked as legacy-projected;
- new single-target records may expose scalar target/claim/development fields only when registry resolution proves exactly one target assessment;
- zero-target or multi-target records expose NULL scalar projections;
- no "first target", "primary target" or task-primary claim may be substituted for target ownership;
- legacy C6/C7/C8 states without scope/time-window provenance remain legacy/unscoped and cannot be silently upgraded to a complete six-part branch;
- writes through the legacy adapter are prohibited; all new writes use the versioned canonical contract.

Before adopting this API, every scalar consumer must be classified as: legacy read, canonical read, derived summary, or prohibited write. The consumer inventory already performed identifies major runtime and persistence consumers, but the final API review must also cover exports, reporting and any external integrations.

## 7. O5 — Scope and time-window lifecycle

**Status: not safely resolvable from the current protocols; requires a separate explicit protocol decision.**

C6 says scope and stability window are explicit inputs and must be predefined. It does not define their lifecycle. C8 currently requires learner/claim/development/scope but has no time-window identity. The integrated six-part branch therefore extends beyond the current C8 contract and must be reconciled explicitly.

Recommended semantic separation:
- **scope** defines the evidence universe relevant to a particular mastery question: eligible target/variation dimensions, coverage requirements and exclusions;
- **time window** defines the bounded temporal cohort of observations eligible for that decision snapshot.

The protocol owner must decide:
- who creates and versions a scope/window;
- whether windows are fixed, rolling or event-defined;
- start/end inclusivity and timestamp authority/time zone;
- whether windows may overlap;
- how late-arriving observations and coder assessments are handled;
- when a window closes and whether it can be reopened;
- whether a changed scope/window creates a new branch (recommended: yes);
- how C8 compares successive windows without merging their identities.

Do not infer a window from "last N days", browser session, task attempt count or current date unless a separately approved policy explicitly defines it. Do not let C6 silently create a scope/window from whichever observations happen to be present.

**Gate:** author a small Scope and Time-Window Lifecycle Contract and update C6–C9 contracts consistently before runtime work.

## 8. O6 — C3 codebook and target-assessment vocabulary

**Status: owner decision required; no vocabulary is approved by this review.**

The C3 v0.2 proposal correctly separates task-instance alignment, response-to-target relation, evidence status, objective performance, process availability, assistance exposure, independence, contradiction and coding workflow/readiness.

The following must remain open until the scientific/product owner explicitly reviews the v0.2 Section 13 decisions:
- final labels and anchors for alignment and response relation;
- missingness and no-response interpretation;
- evidence-status boundaries;
- construct and anchors for evidence quality, including scale and measurement level;
- assistance event vocabulary and PROMPTED versus DEPENDENT boundary;
- contradiction states and rationale;
- target-assessment cardinality and coder/adjudication provenance;
- coder assignment, duplicate-coding sample and reliability analysis;
- canonical schema versioning and historical compatibility.

The synthetic anchor exercise is a conceptual usability exercise only. It does not establish coder reliability, quality-scale calibration or construct validity. The two-coder pairing in the current descriptive reliability layer is a current reporting limitation, not a scientific requirement that all studies use exactly two coders.

No machine-scored correctness field or provisional controller field may be promoted to a C3 quality/relevance/independence/contradiction judgement by inference.

## 9. O7 — Idempotency and atomicity across lifecycle stages

**Recommendation: use separate idempotency boundaries for observation ingestion, assessment batches and decision evaluations.**

### 9.1 Observation ingestion
- unique identity: learner + source event (and the approved source namespace if event IDs are not globally unique);
- same key + same canonical immutable payload → return the existing observation;
- same key + different immutable payload → reject as an integrity conflict;
- raw observation and its source-event mapping commit atomically.

### 9.2 Assessment batch
- each coding submission has its own immutable assessment-batch ID;
- same batch ID + same canonical assessment payload → idempotent replay;
- same batch ID + different payload → reject;
- coder rounds/adjudications are new linked records, not mutation of an earlier batch;
- batch writes are atomic across all included target assessments and coder records;
- later legitimate coding is appended as a new batch and does not conflict with the already-ingested raw observation.

### 9.3 Decision evaluation
- each evaluation references one immutable observation set and one frozen assessment snapshot/version;
- each affected branch result records the exact C6/C7 contract versions, registry version, branch tuple, assessment snapshot and source IDs;
- same evaluation ID + same payload → idempotent replay;
- same evaluation ID + different payload → reject;
- all branch traces and current-branch projection updates in one evaluation batch commit atomically;
- a changed assessment snapshot creates a new evaluation revision; it must not rewrite the prior decision trace.

This model preserves event-level replay safety without preventing delayed human coding. The existing guardian-ownership and transaction-local write-capability controls remain mandatory for all write paths.

## 10. Consolidated O1–O7 disposition

| Decision | Review disposition | Approval still needed |
|---|---|---|
| O1 storage | Recommend normalized target assessments/coder provenance; raw observation remains JSONB parent | Yes: exact relation and governance design |
| O2 branch state | Recommend branch-keyed state projection plus append-only decision history | Yes: exact persistence/concurrency/read model |
| O3 branch ID | Recommend versioned canonical tuple + SHA-256 surrogate; retain six fields | Approve serialization and test vectors |
| O4 legacy API | Recommend read-only adapter; scalar projection only when exactly one target | Approve full consumer classification |
| O5 scope/window | Unresolved; separate lifecycle contract required | Yes: scientific protocol owner |
| O6 C3 codebook | Unresolved; v0.2 Section 13 owner decisions required | Yes: scientific/product owner |
| O7 replay | Recommend staged idempotency for observation, coding batches and decision evaluations | Approve transaction/API contract |

## 11. Required next step

Do not implement yet.

The next design task is to author the Scope and Time-Window Lifecycle Contract, because O5 affects the meaning of the six-part branch key and the C6/C7/C8/C9 handoff. In parallel, the product/scientific owner must review the explicit C3 v0.2 decisions listed in Section 8.

After that:
1. freeze the C3 assessment vocabulary sufficiently to specify normalized relations;
2. freeze the observation/coding/decision lifecycle and idempotency envelopes;
3. finalize the six-part branch serialization and branch-state read model;
4. reconcile C6–C9 contract versions, especially adding time-window identity to C8;
5. update the integrated multi-target contract to v0.2;
6. only then reconsider a pure, non-persistent runtime contract stage.

## 12. Safety and implementation boundary

No code, tests, task catalogue, registry, curriculum content, database schema, SQL migration, RPC, RLS, Supabase project, learner data or LIVE `main` was changed or authorized by this review.

B1-L06 remains unimplemented. Existing mastery thresholds, C6 seven gates, C7 candidate actions and C1–C9 meanings remain unchanged.
