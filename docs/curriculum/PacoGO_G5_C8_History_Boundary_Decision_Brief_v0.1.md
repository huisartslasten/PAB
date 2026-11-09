# PacoGO G5 — C8 History Boundary Decision Brief v0.1

**Status:** OWNER-APPROVED logical decision (2026-11-09); documentation only; no implementation authorization  
**Date:** 2026-11-09  
**Branch:** `refactor/professional-v1`  
**Scope:** logical boundary of C8 history items relative to immutable C6/C7 decision records and O7's existing decision-evaluation boundary.  
**Not in scope:** physical storage, database schema, SQL/RPC/RLS, Supabase, read-query implementation, caching technology, canonical serialization, runtime implementation or G12 authorization.

## 1. Decision required

C8 v0.2 defines a descriptive temporal learner-model layer over committed C6/C7 outputs. It also specifies a stable `c8_item_id`, append-only history items and replay/conflict behavior.

The owner must decide which logical meaning applies:

1. C8 is a **derived read projection** of immutable C6/C7 history.
2. C8 is a **materialized but rebuildable read model** whose contents are derived from immutable C6/C7 history.
3. C8 creates a **separately persisted authoritative history record** with its own identity and write/replay/conflict lifecycle.

**Owner decision (2026-11-09): Option A approved.** C8 is a derived, descriptive, non-authoritative read projection over committed C6/C7 records. `c8_item_id` is removed as an authoritative domain identity. The existing O7 top-level boundaries remain three; no fourth top-level boundary is created.

## 2. Source-derived constraints

### C8 v0.2

C8:
- consumes committed C6 evaluations and their exact C7 decisions;
- preserves the complete six-part branch identity and exact snapshot/C6/C7 lineage;
- retains exact C6 mastery and C7 next-action outputs without reinterpretation;
- is descriptive only and does not create mastery, select actions, infer development order or mutate runtime learner state;
- describes each history item as one committed decision evaluation;
- defines `c8_item_id` as a stable unique history-item identity;
- says a new snapshot/evaluation creates a new historical item and prior history is not rewritten;
- specifies replay/conflict behavior for the same snapshot/evaluation identity.

### C6/C7 and O7

The owner-approved Stage C boundary establishes:
- the snapshot, C6 evaluation and C7 decision are distinct immutable logical records;
- C6 and C7 are separate ordered atomic writes within O7's existing decision-evaluation boundary;
- C7 may commit only after the exact C6 evaluation it consumes is committed;
- a C7 failure leaves the committed C6 evaluation unchanged and permits a retry against that exact C6 result;
- this does not create another top-level O7 boundary or combine C6/C7 into one indivisible write.

### C9 v0.2

C9 validates the exact branch and snapshot → C6 → C7 → C8 lineage. It is a structural validator, returns per-branch validation results, and must not repair missing identity, mutate history or create a mastery/action result.

## 3. Options and consequences

### Option A — Derived read projection (OWNER-APPROVED)

**Logical meaning**
- C8 is a read-only projection calculated from committed C6/C7 records and their immutable source references.
- Each displayed history item represents an exact committed C6/C7 decision pair on one exact branch.
- Append-only history is inherited from the immutability of the source records; C8 does not write another authoritative history item.

**Identity and replay**
- The authoritative identities remain `decision_snapshot_id`, `c6_evaluation_id` and `c7_decision_id`.
- C8 does not introduce a new durable `c8_item_id` or independent idempotency key.
- Replay/conflict is resolved at the authoritative C6/C7 record boundaries. C8 must not duplicate or reinterpret those outcomes.
- A projection-local row handle, if later needed for a read implementation, is not a domain identity and must not become a new idempotency boundary.

**Failure/recovery**
- A failed or stale projection can be recomputed from committed immutable source records.
- No C8 write failure can make an already committed C6/C7 decision disappear or become uncommitted.
- C9 validates the derived representation against the exact source lineage.

**Advantages**
- No duplicate authoritative history.
- No additional write/transaction/recovery contract.
- Strong alignment with C8's descriptive-only authority and the existing O7 decision-evaluation boundary.

**Trade-offs**
- Read-time projection may require query optimization.
- If later materialization is needed for performance, G8 must specify a rebuildable non-authoritative read model without changing logical authority.

### Option B — Materialized, rebuildable read model

**Logical meaning**
- C8's history is physically materialized for efficient reads, but remains derived and non-authoritative.
- The source of truth remains immutable C6/C7 records.

**Identity and replay**
- A materialized row may have a projection-local key, but it is not an independent decision identity.
- Rebuild/replay must not create duplicate logical history or alter upstream records.
- Projection freshness and rebuild behavior belong to G8/G9 physical/read-model design.

**Failure/recovery**
- The materialized model may be stale or incomplete after a projection failure.
- It must be reconstructible from committed C6/C7 records.
- C9 must be able to validate its lineage and detect missing/extra/mismatched projection items.

**Advantages**
- Efficient temporal history queries while retaining derived authority.
- Avoids a second independent decision-history source of truth.

**Trade-offs**
- Requires G8 to design refresh, consistency, rebuild and staleness detection.
- Must not accidentally evolve into a separately authoritative C8 write path.

### Option C — Separately persisted authoritative C8 history record

**Logical meaning**
- Each C8 history item is an independently committed immutable record after the relevant C6/C7 records.
- C8 has a distinct write unit and durable history identity.

**Identity and replay**
- `c8_item_id` becomes a real durable identity.
- Same identity/same payload replay and same identity/different payload conflict must be specified for C8 itself.
- The relationship between the C8 identity and exact upstream snapshot/C6/C7 identities must be fully defined.

**Failure/recovery**
- C8 failure after C7 commit leaves C6/C7 committed and C8 missing/pending.
- A C8 retry/recovery lifecycle is required.
- C9 must distinguish missing C8 projection from invalid C6/C7 decisions.
- Atomicity, ordering, retry, conflict and recovery semantics must be added to the Stage C contract.

**Advantages**
- Durable, independently addressable C8 history records.
- May support a separately governed history lifecycle if a genuine product requirement exists.

**Trade-offs / risks**
- Adds a new authoritative write and another place where history can be incomplete or inconsistent.
- Duplicates references already present in C6/C7 and creates a synchronization/recovery burden.
- Risks treating a descriptive projection as a separate learner-state authority.
- Requires explicit owner approval and G5/G9/G8/G10 reconciliation before any implementation.
- It must not be silently described as a fourth top-level O7 boundary.

## 4. Recommendation

**Owner decision — APPROVED 2026-11-09: Option A.** Treat C8 as a descriptive, non-authoritative read projection over committed C6/C7 records. Option B may be considered later only as a G8 physical optimization if a demonstrated need exists; any materialized view/cache must remain rebuildable and non-authoritative. Option C is not selected.

Under this recommendation:
- C8 does not own an independent durable history-item identity.
- The C8 v0.2 `c8_item_id` is removed from the authoritative logical contract. It is not a domain identity, independent idempotency key or C8 write key. A future technical row handle, if required for materialization, must be projection-local and non-authoritative.
- Logical source lineage is the exact six-part branch identity plus `decision_snapshot_id`, `c6_evaluation_id` and `c7_decision_id`. This does not define canonical serialization, a hash, physical key or namespace; those remain G9/G8 concerns.
- C8 replay/conflict behavior is inherited from C6/C7; C8 does not create a new idempotency/write boundary.
- C8 history remains one-branch and descriptive. It does not create mastery, next action, learner-state mutation or automatic advancement.
- C9 validates that the C8 projection faithfully represents the exact committed source lineage.

This is an explicit owner decision on the logical C8 boundary, grounded in the current source contracts. It does not settle physical materialization, canonical equality/serialization, storage, query implementation or security.

## 5. Decision effect and remaining questions

The owner has approved Option A and removal of `c8_item_id` as an authoritative domain identity. No further owner choice is required for the logical C8 read/write boundary.

Remaining technical work: G5 must reconcile C8/C9 protocol wording and examples; G9 must align stage-attributed rejection/legacy disposition without inventing a C8 write/idempotency contract; G8 may later assess whether a rebuildable non-authoritative materialized read model is warranted. Physical storage, projection refresh, query optimization, canonical serialization and security remain open in their assigned gates.

## 6. Gate and permission status

- G5: OPEN for remaining protocol-version/rejection crosswalk, provenance alignment, examples and legacy compatibility. The C8 history read/write boundary is RESOLVED.
- G6: OPEN.
- G9: OPEN; canonical equality, physical identity namespace, durable state/recovery and concurrency remain separate decisions.
- G8/G10: downstream physical persistence/read-model/security design.
- G12: **NOT AUTHORIZED**.

This brief authorizes no runtime, tests, registry, learner-state, schema, database, SQL/RPC/RLS, Supabase or learner-data changes.
