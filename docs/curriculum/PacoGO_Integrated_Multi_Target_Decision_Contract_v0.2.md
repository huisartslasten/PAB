# PacoGO — Integrated Multi-Target Decision Contract v0.2

Status: integrated architecture proposal / candidate / owner review required / NOT approved for implementation  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Verified starting Full Regression: #3040 / run ID `42243391852` GREEN on exact commit `5c4dd08a4b1788dabcff38a9d6f1a1fb9f75915d`

## 1. Purpose and status

This document integrates the multi-target observation model with C3 target-specific assessment/coding, C6 mastery, C7 next-action, C8 temporal learner modelling, C9 structural validation, and the scope/time-window snapshot lifecycle.

It is a logical architecture contract proposal. It is not an implementation authorization and does not approve a schema, runtime API, persistence model, registry change, curriculum mapping, mastery threshold, SQL/RPC/RLS change or Supabase migration.

It supersedes v0.1 as the proposed forward integrated contract. The v0.1 document remains historical and preserves its verified implementation observations at commit `59383d44022b926ae885daef7c6d7d74bb79272e`. Those observations must not be represented as a fresh audit of the current branch head.

## 2. Fixed boundaries

The following remain invariant:

- Existing SLO curriculum meanings, skills, developments, claims, evidence-target meanings, task-model mappings, development ordering and mastery criteria are unchanged.
- One separately administered task-instance response episode is one immutable raw observation.
- A raw observation may be linked to multiple separately justified target-specific assessments.
- A target assessment, coder round or adjudication record is not an independent learner observation.
- Evidence from different decision branches is never pooled into one C6 mastery decision.
- C6's seven gates and their decision order remain unchanged.
- C7 consumes one exact C6 branch result; it does not recompute mastery.
- C8 is a descriptive temporal projection of exact C6/C7 history; it does not create mastery or next actions.
- C9 is a structural chain-integrity validator; it does not establish scientific validity.
- Structurally coherent design is not empirical validation.
- Runtime learner state, skill summaries and product orchestration cannot silently become authoritative substitutes for branch-specific decisions.
- Guardian ownership, direct-write denial, transaction-local write capability, atomic rollback and all existing RLS/security boundaries must be preserved in any future persistence design.
- LIVE `main` is not part of this work.

## 3. Canonical entities and lifecycle

The architecture has three separately governed stages. They must not be collapsed into one mutable "evidence" object.

### 3.1 Stage A — immutable raw observation ingestion

One administered task instance produces one raw observation, containing:

- immutable observation ID and source-event identity;
- learner key;
- task-instance ID and exact task-definition version;
- skill ID and curriculum-registry-version ID;
- actual presented task/representation/response configuration;
- raw response facts, response modality and objective performance facts;
- ordered interaction, retry and assistance events within that administration;
- learner event timestamp, capture/availability timestamps and clock provenance;
- scoring-rule version where an objective score is present;
- technical/data-quality events and source/collector provenance.

The raw observation does not own a primary claim, development or evidence target if the administration has multiple target opportunities. It remains a single source record regardless of later assessment count.

A click, edit, retry or help request within one administration is an event in that observation, not automatically a new observation. A separately administered later attempt is a new observation according to the task lifecycle.

Observation ingestion is immutable and idempotent at its own boundary. A replay with the same source identity and same immutable payload returns the existing observation. The same source identity with a different payload is an integrity conflict and must be rejected.

### 3.2 Stage B — target-specific C3 assessment and coding

A target assessment is a versioned assessment record linked to exactly:
- one source observation;
- one evidence target;
- one applicable registry-resolved claim/development pair;
- one codebook/schema version and assessment protocol.

Logical cardinality:
- one observation → zero, one or many target assessments;
- one target assessment → exactly one observation and one evidence target;
- one observation + one target may have multiple coder/round records;
- an adjudicated resolution is a separate linked record, not destructive replacement.

A target assessment may record task-instance alignment, response-to-target relation, target-specific evidence status, relevant process interpretation, support/assistance and independence judgement, contradiction judgement, rationale, coder/round provenance, availability timestamp, review/adjudication and supersession links.

The vocabulary, category definitions, quality scales, coder instructions and adjudication policy remain controlled by the separate C3 codebook approval. This integrated contract does not invent or approve unresolved C3 categories.

A target opportunity in a task definition is not an assessment and does not become positive or negative evidence merely because it was listed. Unassessed opportunities remain explicit.

**Cardinality invariant:** three target assessments derived from one observation remain one raw observation. They do not become three independent attempts, three independent observations or three temporally separated measurements.

C3 assessment/coding is append-only. A correction or recoding creates a linked new record with actor, time, reason, codebook version and supersession/adjudication provenance. It does not rewrite the raw observation or prior coding history.

Assessment/coding ingestion is idempotent at its own boundary. Same assessment identity and same payload is a replay; same identity with conflicting payload is rejected.

### 3.3 Stage C — frozen decision snapshot and evaluation

C6 evaluates a frozen decision snapshot for one exact branch. The snapshot contains:
- complete six-part branch identity;
- immutable scope ID/version and time-window ID/version;
- event-time interval, boundary inclusivity and timestamp authority;
- assessment-availability cutoff;
- exact eligible unique raw observation IDs;
- exact eligible target-assessment IDs and versions;
- exact codebook/schema and C3 protocol versions;
- exact registry and C6 protocol/implementation versions;
- explicit exclusions and reasons for associated but ineligible records;
- stable snapshot ID and canonical payload/provenance identity.

Two clocks must remain distinct:
1. learner event time determines temporal membership in the defined time window;
2. assessment/coding availability time determines whether the assessment was available by the snapshot cutoff.

Late coding of an already captured observation may enter a later snapshot only if the approved lifecycle allows it. It cannot be inserted retroactively into a prior frozen snapshot. Late observation ingestion after closure follows the separately approved policy; the recommended default is rejection unless the window definition includes a documented grace period.

A changed eligible record set, coding/adjudication version, scope, window or relevant protocol creates a new snapshot and a new evaluation. It never rewrites a prior snapshot, C6 result, C7 decision or C8 history item.

Decision evaluation is idempotent at its own boundary. Same snapshot/evaluation identity and same canonical payload returns the existing result; same identity with a different payload is rejected.

## 4. Task definition, task instance and raw observation

A versioned task definition specifies potential evidence opportunities, not evidence actually elicited. It includes task model/version, skill and registry context, target opportunities, intended representation/response configuration and planned support condition.

Each target opportunity resolves under the exact registry version to its own evidence target, claim and development. A task definition may not require one primary claim/development where the target set spans branches.

An administered task instance records the exact definition version, what was actually presented and departures from plan. The task-instance ID identifies the administration, not a mastery branch.

The browser/task boundary must validate the administered instance against the resolved task definition, including learner, registry, task-model, skill and target-opportunity provenance. Skill-ID equality alone is insufficient. The raw observation must be validated against the exact task-instance ID and the allowed opportunity set. Provisional scalar fields must not be mistaken for approved C3 assessment or C6 mastery.

## 5. Canonical six-part decision-branch identity

Every canonical C6 result and downstream C7/C8/C9 record belongs to exactly one branch identified by all six fields:

```text
learner_key
curriculum_registry_version_id
claim_id
development_id
scope_id
time_window_id
```

All six fields are required, non-empty, resolvable and inspectable. The exact registry version must validate the skill, evidence target, claim and development relationships.

The branch identity deliberately excludes task ID, task-instance ID, observation ID, evidence-target assessment ID, coder ID, coding-round ID and source-event ID. Those are provenance references.

A derived `decision_branch_id` may be used only after a separate canonical serialization contract is approved. The six fields remain authoritative and must never be replaced by a hash. The serialization contract must specify:
- tuple field order and names;
- UTF-8 and Unicode normalization;
- null/empty rejection and escaping;
- canonical serialization format/version;
- hash algorithm and domain/version prefix;
- test vectors and collision/error handling;
- compatibility policy for a future serialization version.

Until then, branch comparisons use all six explicit fields. No component may invent its own hash or serialization.

Different scope or time-window IDs create different branches even when learner, registry, claim and development match. A changed registry version, claim or development also creates a distinct branch. Skill-level identity is routing context, not a replacement for branch identity.

## 6. Scope and time-window lifecycle

Scope and time-window definitions are immutable, versioned definitions once referenced by a committed decision. Their owner, approval authority, activation, closure, finalization, late-arrival rules and retention remain subject to owner approval in `PacoGO_Scope_and_Time_Window_Lifecycle_Contract_v0.1.md`.

A scope defines the evidence universe and decision question for a claim/development branch, including eligible targets, task/variation dimensions, exclusions and references to approved C3/C6 rules. It is not a learner level, task, session, interface or hidden mastery threshold.

A time window defines temporal boundaries, timestamp authority, timezone normalization, boundary semantics, late-arrival policy and lifecycle. It is not implicitly "last N days", a school term, login interval or attempt count.

Recommended defaults, pending approval:
- no inferred rolling windows;
- event timestamp determines event-window membership;
- assessment-availability cutoff freezes each decision snapshot;
- no late observation after closure unless a defined grace period is approved;
- late coding of an already captured observation may enter only a later snapshot until finalization;
- changed scope/window creates a new branch;
- overlapping windows are discouraged and never treated as independent replications;
- operational decision windows are not scientific measurement waves.

Window labels such as OPEN, CLOSED and FINALIZED are lifecycle statuses, not mastery or evidence-sufficiency states.

## 7. C3 → C6 fan-out

The logical fan-out is:

1. retain one immutable raw observation;
2. obtain zero or more separately justified target-specific C3 assessments linked to it;
3. resolve each target's claim/development under the exact registry version;
4. determine scope and event-time eligibility for each target assessment;
5. group eligible assessments by the complete six-part branch identity;
6. freeze a snapshot for each branch;
7. evaluate C6 once per branch snapshot.

A single observation may therefore appear by the same immutable observation ID in multiple branch snapshots. It is never copied to simulate target cardinality.

C6 receives both:
- `source_observation_ids[]`: unique raw learner episodes contributing to that branch;
- `target_assessment_ids[]`: exact target-specific assessments supporting that branch.

Coverage, stability, variation and independence use the units and eligibility rules defined by the approved C3/C6 protocols. Target-assessment rows and coder rounds must not inflate independent-observation counts. Distinct observation IDs alone do not prove independence; actual support/assistance and protocol context remain relevant.

An observation may support separate target branches, but the same target assessment cannot be borrowed across branches or assigned a different claim/development than the exact registry mapping.

## 8. C6 mastery contract

C6's seven gates, their definitions and their decision order remain unchanged.

The current claim-keyed output is insufficient where more than one branch shares a claim ID. The proposed output is a collection of branch results; each result carries:
- all six branch identity fields;
- snapshot ID;
- C6 evaluation ID and protocol/implementation version;
- exact mastery state and gate trace;
- coverage and evidence state;
- unique source observation IDs;
- target-assessment IDs/versions;
- explicit counts and eligibility basis;
- safety/negative permissions.

No branch may overwrite another because it shares a claim ID. The legacy `mastery_state_by_claim` shape may be exposed only through an explicit adapter that rejects ambiguous multiple-branch input. A scalar projection is allowed only where exactly one fully identified branch exists and all context is validated.

C6 must not create scope/windows, select them from available evidence, admit late coding into an earlier snapshot, pool branches or interpret closure as evidence sufficiency.

## 9. C6 → C7 exact-branch handoff

C7 consumes exactly one validated C6 branch result, including its snapshot and evaluation IDs. It must compare all six identity fields, not select by claim ID alone.

C7 preserves the exact C6 state, gate trace, evidence references, scope/window, learner/registry identity and ordering/alternative-explanation context. It must not recompute mastery or infer missing identity fields. Its decision trace identifies the exact C6 evaluation and snapshot consumed.

Any missing or mismatched identity/snapshot/evaluation reference is rejected, not repaired or guessed. Existing C7 candidate actions, action-specific ordering gates and safety permissions remain unchanged.

## 10. C7 → C8 temporal learner model

C8 v0.2 is the canonical forward contract for temporal history. Each single-branch history requires the full six-part identity. Each history item references one immutable snapshot, exact C6 evaluation and exact C7 decision, plus source observation and target-assessment provenance.

C8:
- keeps branch histories separate;
- orders committed items by validated evaluation time and deterministic stable tie-breaker;
- preserves event-time interval and assessment-availability cutoff separately;
- retains contradictory, insufficient, not-assessed, superseded and legacy states explicitly;
- exposes the exact latest C6 mastery and C7 action without recomputation;
- allows a separate typed higher-level descriptive projection across branches only if it retains every source identity and snapshot lineage.

A cross-branch projection cannot pool evidence, recompute coverage/stability/mastery, select or merge actions, or claim progress, causality, retention, transfer or durable learning. Overlapping windows are not independent replications. Legacy v0.1 records remain legacy/unscoped where provenance is missing; no registry, window or snapshot identity may be inferred.

## 11. C8 → C9 structural validation

C9 v0.2 validates each canonical branch independently through:
- registry/skill/development/claim/target mapping;
- task definition and administered task-instance provenance;
- one immutable raw observation;
- target-specific assessment and coder/adjudication lineage;
- immutable scope/window definitions;
- frozen snapshot and exact eligibility/cutoff;
- exact C6 evaluation;
- exact C7 handoff;
- C8 single-branch history.

C9 validates all six identity fields at every applicable stage, snapshot linkage, versions, shared-observation references, exclusion reasons and legacy boundaries. One raw observation may be shared across branch validations but must retain one source ID and payload identity. A target assessment is never counted as another raw observation.

A multi-branch validation request returns per-branch structural results and a shared-source reference map. It never returns pooled mastery or next-action results. Legacy chains may be checked under their historical contract but cannot be labelled canonical v0.2 branches.

C9 does not prove claim truth, developmental order, coding reliability/validity, task discrimination, mastery validity, action optimality, transfer, retention or causal effects.

## 12. Logical persistence and idempotency boundaries

Persistence is not approved by this document. The logical model requires three independent idempotency boundaries:

### 12.1 Observation ingestion
Identity: learner + source event/administration identity, with immutable payload comparison. Same identity/same payload replays; same identity/different payload rejects.

### 12.2 Assessment/coding ingestion
Identity: target assessment and coding-round identity under its source observation and target. Same identity/same payload replays; conflicting payload rejects. New coding/adjudication is append-only and separately linked.

### 12.3 Decision evaluation
Identity: exact decision snapshot/branch/evaluation contract identity. Same snapshot/evaluation payload replays; conflicting payload rejects. A changed assessment set or version requires a new snapshot/evaluation.

These boundaries must not be collapsed into one source-event duplicate check. A single source event may yield one observation, multiple target assessments and multiple branch-specific decision traces.

The logical transaction for an administration must guarantee no partial branch persistence if the approved atomicity model requires all-or-nothing behavior. Whether the entire observation/assessment/decision sequence is one transaction or staged transactions with durable states and compensating/retry semantics is OPEN; it must be designed explicitly rather than assumed.

## 13. Persistence and read-model decisions

### 13.1 C3 assessment storage

Recommended direction for owner review: normalized target-assessment and coder/provenance relations, with immutable raw observation as parent. This better enforces target cardinality, foreign keys, coder rounds, adjudication history and queryability. Raw observation payload may remain JSONB.

This is a recommendation, not approval. The final physical design depends on the approved C3 codebook, coder workflow, privacy/access patterns, retention and research-data needs. Do not choose JSONB merely because the current service already accepts JSONB; do not create normalized relations before the C3 contract is approved.

### 13.2 Branch state and history

Authoritative state must be keyed by the complete six-part branch identity, or by a validated surrogate that retains all six fields. Decision history is append-only. A skill-level state is a derived projection only and cannot replace or overwrite branch states.

Recommended direction: branch-keyed state projection plus append-only decision/evaluation history. Physical tables, uniqueness, concurrency, locking and atomicity remain OPEN pending service/query and security inventory.

### 13.3 Legacy scalar fields and adapters

Historical scalar claim/development/target values remain unchanged and readable. New zero- or multi-target observations must not select a primary target. Scalar projections may be populated only when exactly one target/branch is unambiguous and the consuming contract permits it; otherwise the projection is absent/NULL/explicitly unavailable.

Every existing consumer of scalar values must be inventoried. A legacy adapter must preserve original row IDs, payloads, schema/codebook versions and known values; mark missing provenance as legacy/unknown; and never infer branch identity from current registry, task, skill, timestamp or session.

### 13.4 Decision trace and branch identity

One source event may yield multiple branch-specific traces. Logical trace identity must therefore distinguish branch identity as well as source event and learner. A claim-only or source-event-only uniqueness key is insufficient for canonical multi-branch history.

Canonical branch-ID serialization, persistence surrogate and migration compatibility remain OPEN until a separately approved identity specification exists.

## 14. Security, privacy and governance

Any future persistence implementation must preserve:
- authenticated guardian membership checks for the learner;
- direct client table-write denial;
- transaction-local write capability with cleanup on success/failure;
- atomic rollback or an explicitly approved equivalent staged protocol;
- no broader RLS or new direct write privileges;
- child-data minimization, retention, access and deletion policies across observations, assessments, coder records, snapshots, branch state and traces.

No new demographic, behavioural or sensitive variables may be added merely for possible future usefulness. Access to raw responses and coder/adjudication material must be purpose-limited.

## 15. Legacy compatibility

Historical single-target evidence remains immutable and readable. A legacy projection may expose it as a legacy target-assessment view only while preserving original IDs, payload and contract versions. It must not invent coder identity, coding rounds, adjudication, target coverage or independence.

Historical skill-level C6/C7/C8 state remains under its original contract. Where scope/window/registry/snapshot provenance is absent, records remain legacy/unscoped and cannot be silently assigned to a canonical six-part branch.

No historical raw observation is duplicated to simulate multi-target fan-out. Any deliberate recoding/reassessment requires a new linked assessment and a new explicitly identified snapshot/evaluation.

## 16. Required invariants

1. One administration → one immutable raw observation.
2. One observation → zero or more separately justified target assessments.
3. One target assessment → exactly one source observation and one target.
4. Coder rounds/adjudications do not create new learner observations.
5. One observation may feed multiple branches without being copied.
6. Every canonical branch has all six identity fields.
7. Scope/window definitions are immutable once referenced by a decision.
8. Event-time eligibility and assessment-availability cutoff are distinct.
9. Each C6 evaluation consumes one immutable branch snapshot.
10. C6 output cannot collide by claim ID alone.
11. C7 consumes the exact C6 branch, snapshot and evaluation.
12. One C8 canonical history contains one branch identity only.
13. C8 cross-branch projections remain descriptive and never pool evidence.
14. C9 validates branches independently and preserves shared observation identity.
15. Late coding or correction never rewrites earlier snapshots or decisions.
16. Observation, assessment and decision idempotency boundaries are distinct.
17. Identity mismatch or conflicting replay payload is rejected, never silently repaired.
18. Legacy records are preserved without fabricated provenance.
19. Skill-level state is derived, never authoritative for branch decisions.
20. No automatic mastery write, learner advancement or registry promotion is introduced.

## 17. Required contract tests before implementation

The implementation test plan must include at least:

1. Single-target administration yields one raw observation and one target assessment.
2. Multi-target administration yields one raw observation and multiple target assessments.
3. Two target assessments mapping to different claim/development branches create separate snapshots and C6 evaluations.
4. Shared source observation ID does not inflate independent-observation count.
5. Multiple coder rounds for one target/observation do not inflate observation count.
6. Target opportunity without assessment does not become evidence.
7. Task instance/observation with wrong learner, registry, task model or opportunity set is rejected.
8. Any mismatch in the six branch fields is rejected at C6/C7/C8/C9 boundaries.
9. Two branches with same claim but different development/scope/window do not overwrite.
10. Scope/window immutable version mismatch is rejected.
11. Event time, not coder-entry time, determines temporal eligibility.
12. Assessment availability cutoff excludes late coding from an earlier snapshot.
13. New coding creates a later snapshot/evaluation without changing prior records.
14. C6 branch result references exact snapshot and unique observation/assessment IDs.
15. C7 rejects mismatched C6 branch, snapshot or evaluation.
16. C8 rejects mixed branch histories and preserves exact C6/C7 lineage.
17. C8 descriptive cross-branch projection retains all source identities and creates no mastery/action.
18. C9 validates multiple branches independently with shared source observation.
19. Legacy v0.1 records remain legacy/unscoped and are not promoted.
20. Observation same-payload replay is idempotent; different-payload replay rejects.
21. Assessment same-payload replay is idempotent; conflicting replay rejects.
22. Decision same-snapshot replay is idempotent; conflicting payload rejects.
23. A failure in an approved atomic write unit leaves no partial writes.
24. Branch-state history is append-only; skill summary cannot overwrite branch state.
25. Guardian isolation, direct-write denial, write-context cleanup and rollback remain intact.
26. No runtime write, automatic advancement, registry promotion or evidence pooling is enabled.

Tests must prove the contract. They must not be weakened or rewritten merely to make an implementation pass.

## 18. Open decisions requiring owner approval

| ID | Decision | Current recommendation | Evidence/approval needed |
|---|---|---|---|
| O1 | C3 assessment/coder storage | Normalized target-assessment and coder/provenance relations; raw observation remains parent | Approved C3 codebook, coder workflow, query and research-data access patterns |
| O2 | Physical branch-state/read model | Branch-keyed state projection plus append-only decision history | Full service/query/export inventory, concurrency and atomicity design |
| O3 | Canonical branch-ID serialization | Versioned canonical tuple encoding + SHA-256 surrogate, retaining six fields | Formal serialization spec, test vectors, compatibility and collision handling |
| O4 | Legacy projection API | Read-only adapter; scalar projection only if exactly one target/branch is unambiguous | Complete inventory of browser, service, reporting, export and persistence consumers |
| O5 | Scope/window ownership and lifecycle | Immutable versioned definitions; event time + separate availability cutoff | Owner decisions on authority, windows, timezone, closure, grace periods, overlap and retention |
| O6 | C3 codebook vocabulary and assessment lifecycle | Separate approval; append-only coder rounds/adjudication | Explicit C3 scientific/codebook review and approval of its unresolved decisions |
| O7 | Idempotency and atomicity | Separate observation, assessment and decision boundaries | Canonical payload comparison, staged/atomic transaction design and failure tests |
| O8 | C6/C7 snapshot envelope | Exact snapshot and evaluation references carried end-to-end | Reconcile C6/C7 versioned contract and adapters |
| O9 | Legacy/cross-branch learner-facing projection | Preserve branch distinctions; descriptive-only projection | Product wording, permissions and consumer contract review |

No recommendation in this table is approved merely by appearing here.

## 19. Implementation gate and staged sequence

No implementation is authorized until:
1. owner decisions for scope/window and C3 are resolved or explicitly staged with bounded approved contracts;
2. C6/C7 snapshot envelope and exact branch identity are reconciled;
3. canonical branch-ID serialization is approved;
4. complete legacy consumer and persistence/read-model inventory is complete;
5. C3 assessment/coder provenance and storage semantics are approved;
6. idempotency, transaction atomicity, security and privacy design are approved;
7. the integrated contract is approved by the owner;
8. Full Regression is green on the exact current branch head immediately before implementation.

After approval, build in coherent stages:
1. pure versioned identity/snapshot contracts and read-only adapters;
2. observation/task-instance validation and immutable ingestion boundary;
3. target-specific C3 assessment/coder provenance and fan-out;
4. C6 branch result collection with non-colliding identity;
5. exact-snapshot C7 handoff;
6. C8 branch history and descriptive projections;
7. C9 per-branch structural validation;
8. only then approved persistence/read-model/RPC work, if required.

After each coherent stage, run Full Regression on the exact commit. If red, stop, isolate the exact cause, classify it as code/test/architecture/data-schema/CI-environment, design the underlying correction, then implement. Never patch symptoms or weaken tests.

No curriculum registry, task catalogue, mastery threshold, historical learner data, Supabase schema, SQL, RPC, RLS, learner runtime state or LIVE `main` change is authorized by this candidate.
