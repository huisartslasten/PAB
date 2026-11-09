# PacoGO — Owner Architecture Decision Record: Multi-Target Decision Chain v0.1

Status: owner-directed architecture baseline; logical decisions recorded; implementation remains gated  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Decision basis: owner instruction to proceed with the reviewed recommendations while keeping O5, O6 and O9 explicitly open  
Starting baseline: commit `8ec132ed609ec9563ec2f1ea663982a4a708279c`; Full Regression #3057 GREEN on that exact commit

## 1. Purpose and scope

This record converts the reviewed recommendations into a bounded architecture baseline. It does not approve the integrated multi-target proposal for implementation and does not approve a physical database schema, runtime API, curriculum change, C3 codebook, learner-facing wording or Supabase migration.

The owner has authorized proceeding with the recommended logical direction for O1–O4 and O7–O8. O5, O6 and O9 remain explicit open owner/scientific/product decisions. Where a decision has a logical direction but physical details remain unknown, this record approves only the logical direction.

The existing curriculum meanings, SLO mappings, skills, developments, claims, evidence targets, task-model mappings, C1–C9 scientific meanings and mastery criteria remain unchanged. Existing/legacy Skills, lessons, learner profiles, assessment history, games and unrelated Supabase components remain outside scope. LIVE `main` must not be touched.

## 2. Approved logical architecture decisions

### O1 — Target-assessment storage and PacoGO assessment ownership

**Decision:** the canonical logical model is a normalized target-specific assessment relation linked to one immutable raw learner observation. PacoGO is the single operational assessor in the learner product and evaluates recorded evidence under the approved, versioned curriculum/C3 contracts. No second human assessor, human coder rounds, adjudication workflow or parallel rating process is part of the learner runtime.

Invariants:
- One separately administered response episode produces one immutable raw observation.
- One raw observation may have zero, one or multiple target-specific assessments.
- Each target assessment refers to exactly one observation and one evidence target, with registry-resolved claim/development ownership.
- A target opportunity in a task definition is not itself an assessment.
- Assessment logic/version and its result provenance must remain distinguishable from the raw learner response.
- A later correction or reassessment must not overwrite the raw observation or silently rewrite prior decision history; the exact versioned correction lifecycle remains to be specified.

**Not approved here:** physical table names, columns, foreign keys, indexes, retention, RLS, RPCs, migration strategy, final C3 vocabulary or the implementation of assessment logic. These require the approved C3 assessment contract, data/security inventory and persistence design. No Supabase change is authorized.

### O2 — Branch state and decision history

**Decision:** branch-specific decisions are authoritative. A canonical branch state is keyed by the complete six-part decision identity. Decision/evaluation history is append-only. A skill-level state or product summary is a derived projection only and cannot overwrite or substitute for branch decisions.

The authoritative identity fields are:
1. learner key;
2. curriculum registry version ID;
3. claim ID;
4. development ID;
5. scope ID;
6. time-window ID.

**Not approved here:** physical state/history tables, uniqueness constraints, concurrency/locking, materialized views, service API or exact transaction layout. These require the full service, query, export, security and persistence inventory.

### O3 — Canonical branch identity and serialization

**Decision:** the six explicit identity fields remain authoritative and inspectable. Branch equality is determined by comparing all six fields. No component may invent a local hash, tuple encoding or claim-only key.

A derived branch ID/hash is deferred. It may be introduced only after a separate serialization contract defines canonical field order, encoding/normalization, null rejection, versioning, hash/domain prefix, test vectors, collision/error handling and compatibility. A hash must never replace the six source fields.

### O4 — Legacy compatibility

**Decision:** historical scalar records remain unchanged and readable under their original contract. The forward architecture may provide a read-only legacy adapter. Missing registry, scope, window, target, assessment-version or snapshot provenance remains explicitly legacy/unknown; it must never be reconstructed from current registry, task, skill, timestamp or session.

A scalar projection is allowed only when exactly one target/branch is unambiguous and the consumer contract permits it. Ambiguous multi-target or multi-branch input must not be collapsed into a scalar.

**Not approved here:** adapter API, exact field mapping and consumer-by-consumer rollout. These require a complete inventory of browser, service, reporting, export and persistence consumers.

### O7 — Idempotency and staged atomicity

**Decision:** raw-observation ingestion, PacoGO target-assessment evaluation/recording and decision evaluation are separate idempotency boundaries.

For each boundary:
- same identity + same canonical immutable payload is an idempotent replay;
- same identity + different payload is an integrity conflict and must be rejected;
- a correction or reassessment receives a new linked/versioned identity and does not overwrite the raw observation or prior decision history;
- a changed eligible evidence set or protocol creates a new snapshot/evaluation, not an overwrite.

The lifecycle is staged rather than one transaction spanning the entire learner-observation-to-decision timeline. Each stage must commit atomically within its own write unit and expose a durable, inspectable state for retry/recovery. Assessment evaluation and C6/C7 may occur at distinct times, but there is no human coding stage in the learner evidence pipeline. A failure must not leave partial writes inside the affected stage. The exact stage status model, outbox/retry mechanism, transaction boundaries, locking and failure recovery must be specified and tested before persistence implementation.

Existing guardian ownership, RLS, direct-write denial, transaction-local capability cleanup and rollback/security guarantees must remain intact.

### O8 — C6/C7 snapshot envelope

**Decision:** C6 evaluates one frozen snapshot for exactly one six-part branch. Its result carries the complete branch identity, snapshot ID, evaluation ID, protocol/version provenance, gate trace and exact observation/assessment references.

C7 consumes exactly one validated C6 branch result and preserves the exact branch, snapshot and evaluation identity. It does not recompute mastery or infer missing identity. Missing or mismatched identity/snapshot/evaluation references are rejected.

C8 remains a descriptive projection of exact C6/C7 history. C9 remains a structural chain validator, not a scientific-validity validator. The existing C6 seven gates and C7 action policy are not changed by this record.

### G5-S2 — Stage C C6/C7 record and atomic-write boundary

**Owner decision (2026-11-08):** preserve O7's three top-level idempotency boundaries unchanged:
1. raw-observation ingestion;
2. PacoGO target-assessment evaluation/recording;
3. decision evaluation.

Within O7's existing decision-evaluation boundary, the immutable decision snapshot, C6 evaluation and C7 decision are distinct logical records with distinct identities. C6 and C7 are committed as separate ordered atomic writes:

- The C6 evaluation record is immutable and must be durably committed before a C7 decision consuming it can be committed.
- The C7 decision record has its own identity and references the exact committed C6 evaluation, including the same six-part branch and snapshot lineage.
- C7 does not recompute mastery, replace the C6 result or infer/reconstruct missing identity.
- If C7 fails or is unavailable, the committed C6 evaluation remains unchanged. C7 may later be retried against that exact C6 evaluation without rewriting or rerunning C6.
- These are two record-level atomic writes inside the existing O7 decision-evaluation boundary. They do not create additional top-level O7 idempotency boundaries, and they are not one shared indivisible C6/C7 write unit.

**Not approved:** physical identity formats/namespaces, field naming, keys/tables, serialization or hashing, transaction technology/layout, retry/backoff, concurrency/locking, outbox/workers, persistence APIs or schema. These remain subject to G6/G9 and downstream G8/G10 design and approval.

### G6-S1 — Material support-condition change creates a new administration identity

**Owner decision (2026-11-08):** a material change in the actual support condition creates a new task instance, a new learner response episode and a new immutable raw observation.

This makes the identity boundary explicit:
- The independent Tussentoets/Toets episode ends as incomplete when the learner requests content help, as already required by the owner-confirmed support policy.
- The supported-practice continuation is a separate task instance, response episode and observation.
- The independent episode and all captured pre-request events remain preserved and are not merged with the supported continuation.
- A neutral interface clarification that supplies no target reasoning does not itself change the support condition and does not create a new administration identity.
- Ordinary retries/revisions within the same actual administration remain events in the same response episode; they do not create new observations merely because an answer was edited or retried.

**Boundary:** this is a logical identity decision only. It does not define physical ID formats, storage keys, database schema, runtime APIs, transaction boundaries, event transport or persistence. It does not settle all G6 lifecycle transitions (completion, restart, abandonment, interruption/resume and timeout), which remain explicit reconciliation work. G6 remains OPEN until the full owner-approved logical lifecycle is reconciled with O6/C3.


## 3. Explicitly open decisions

### O5 — Scope and time-window ownership/lifecycle

**CORE POLICY APPROVED — configurable and reversible; secondary lifecycle/privacy details remain open.**

Owner direction: use the simplest workable policy now, while ensuring it can be changed later without rewriting historical learner data or changing curriculum meaning.

Approved minimum policy:
- Scope is selected explicitly from existing curriculum definitions. PacoGO does not invent a scope or derive one from a practice session.
- A time window is an explicitly configured start/end interval. No automatic rolling window, session-derived window or hidden default duration is introduced.
- Window definitions are versioned. A policy change creates a new definition/version; it does not rewrite prior definitions or frozen snapshots.
- Membership is determined by the task/observation event time, using a half-open interval: start inclusive, end exclusive.
- Event time and assessment-availability time remain separate. Each evaluation snapshot records its own availability cutoff.
- A snapshot is immutable. New or late-arriving eligible information may be included only in a newly created snapshot/evaluation; prior results remain inspectable and unchanged.
- No arbitrary grace period, finalization state machine, overlap prohibition or universal window duration is introduced in this minimum policy. These can be added through a later versioned decision if actual product needs require them.
- Canonical timestamps are stored as UTC instants; any learner-facing timezone is presentation configuration and does not change event ordering or window membership.
- Operational windows are not scientific measurement waves.

Still open: detailed authority/permissions for creating scope/window definitions, overlap presentation, retention/deletion and any later finalization or grace-period policy. These details do not block a pure contract implementation of the approved minimum policy, but they remain required before affected persistence/privacy behavior is implemented.

### O6 — Canonical C3 codebook and measurement decisions

**OPEN — no codebook approval recorded.**

The C3 v0.2 proposal remains a candidate. The following remain unresolved: final task-alignment and response-relation labels/anchors; raw collection/missingness and NO_RESPONSE treatment; evidence-status boundaries; quality construct and scale; PROMPTED versus DEPENDENT anchors; contradiction states/rationale; deterministic/operational C3 assessment rules, including unknown and insufficient-data behavior; assessment-version provenance; and canonical observation/assessment schema versioning. PacoGO remains the single operational assessor; human coder/adjudication workflows are not learner-runtime requirements. Any future research comparison of PacoGO outputs with independent measures belongs to the separate Scientific Validation stream, not to production learner assessment.

No quality scale is selected. In particular, the proposed five-level and three-level numeric scales must not be silently reconciled. Synthetic examples are not independent coder reliability evidence. No C3 category may be inferred by the runtime from correctness or assistance events without an approved coding rule.

### O9 — Learner-facing cross-branch projection

**OPEN — product decision not finalized.**

The architectural constraint is fixed: learner-facing presentation may provide an understandable descriptive summary, but it must preserve the underlying branch distinctions and source lineage. It may not pool evidence, recompute mastery across claims/developments/windows, merge next actions, imply transfer/retention/durable learning without evidence, or create an automatic advancement.

Exact learner-facing language, visual hierarchy, audience/permissions and treatment of contradictory/insufficient/not-assessed states require product review.

## 4. Required architecture lifecycle

The forward logical chain is:

```text
Versioned task definition
    ↓
Administered task instance
    ↓
One immutable raw observation
    ↓
Zero or more target-specific C3 assessments
    ↓
Registry-resolved claim/development per assessment
    ↓
Scope + event-time eligibility + availability cutoff
    ↓
Frozen snapshot per six-part branch
    ↓
C6 evaluation per branch
    ↓
C7 decision consuming exact C6 result
    ↓
C8 descriptive branch history
    ↓
C9 structural validation per branch
```

A single observation may be referenced by more than one branch, but it is never duplicated to manufacture independent observations. Multiple target assessments do not increase the count of raw learner episodes.

## 5. Implementation gates that remain closed

No runtime, test, registry, catalogue, database, SQL/RPC/RLS, Supabase or learner-data change is authorized by this record.

Before implementation, complete:
1. O5 scope/window owner decisions;
2. O6 C3 codebook and measurement approval;
3. O9 learner-facing projection decision;
4. C6/C7/C8/C9 versioned contract reconciliation against the six-part identity and snapshot envelope;
5. complete legacy consumer and persistence/read-model inventory;
6. task-definition/task-instance/observation identity and provenance contract;
7. staged transaction, idempotency, retry, concurrency, security and privacy design;
8. physical persistence design based on approved contracts;
9. contract tests for cardinality, branch isolation, shared-observation counting, conflicting replay, late coding, snapshots, legacy compatibility and security.

Only after those gates are closed may a small pure-contract implementation slice be considered. Full Regression must be green on the exact branch head before each build step and again on each resulting commit. If red, stop and isolate the root cause; do not patch symptoms or weaken tests.

## 6. Next concrete step

Create one consolidated implementation-readiness matrix from this record and the existing candidate contracts. It must identify each remaining gate, its owner, required evidence/artifact, dependencies and the exact point at which implementation becomes authorized. Do not start the B1-L08 multi-target task or persistence/runtime fan-out while these gates remain open.

## 7. Verification

This decision record is documentation-only. It does not claim implementation or post-change Full Regression success. The resulting handoff update and this record must be verified by Full Regression on the exact resulting commit.
