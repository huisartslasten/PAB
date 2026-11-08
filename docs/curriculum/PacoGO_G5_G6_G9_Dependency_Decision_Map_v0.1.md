# PacoGO — G5/G6 to G9 Dependency and Decision Map v0.1

**Status:** source-derived dependency map for owner review; not a gate closure or implementation authorization.  
**Branch:** `refactor/professional-v1`  
**Purpose:** distinguish G5 decisions, G6 decisions, G9 decisions and downstream physical/authorization gates so G9 is not repeatedly reopened for questions owned elsewhere.

## 1. Source baseline reviewed

This map was prepared from the current branch versions of:
- `PacoGO_Multi_Target_Implementation_Readiness_Matrix_v0.1.md`, especially G5/G6 gate definitions, §§7.6, 7.11–7.13 and §§8.62–8.70;
- `PacoGO_Multi_Target_Owner_Architecture_Decisions_v0.1.md`, especially O7/O8 and the G6 support-condition boundary;
- `PacoGO_Task_Observation_Identity_Lifecycle_Proposal_v0.1.md`, especially §§4–7;
- C6 v0.1, C7 v0.2, C8 v0.2 and C9 v0.2;
- `PacoGO_G9_Source_Reconciliation_v0.1.md`;
- `PacoGO_G9_Logical_Payload_Field_Inventory_v0.1.md`;
- `PacoGO_G9_Logical_Stage_Contract_Source_Determined_v0.1.md).

This is a reconciliation of the repository sources, not a new owner decision. Where sources use candidate/proposal language, this map preserves that status.

## 2. Gate ownership at a glance

| Gate | Owns | Must deliver before G9 can freeze/implement |
|---|---|---|
| G5 | C6→C7→C8→C9 logical contract reconciliation | One approved, versioned cross-stage contract and lineage envelope, including exact Stage C record/identity/write-unit boundaries |
| G6 | Task definition→task model→task instance→response episode→events→raw observation and target-assessment identity lifecycle | Owner-approved logical identity/provenance and complete lifecycle contract, reconciled with the frozen O6 v0.3 boundaries |
| G9 | Three-stage idempotency, canonical payload equality, stage-local state/recovery/retry/concurrency | Logical contract for replay/conflict and durable stage behavior, using the approved G5/G6 inputs |
| G8/G10 | Physical persistence/read-model and security/privacy | Approved physical and security design after logical G5/G6/G9 contracts |
| G12 | Narrow implementation authorization | Explicit approval of one bounded implementation slice, exact baseline and exclusions |

## 3. G5 — exact remaining work

**Current status: OPEN.** The readiness matrix §7.11 says the combined lineage is logically aligned around six-part branch → immutable snapshot → exact C6 evaluation → exact C7 decision → one-branch C8 history → per-branch C9 validation. That preliminary alignment is not G5 closure.

### G5 deliverables still required

1. **Reconcile and approve protocol versions as one contract set.** C6 v0.1 and C7 v0.2 are candidate protocols; C8/C9 v0.2 carry more explicit branch/snapshot lineage. The four documents must agree on required inputs, outputs, references, error/rejection behavior and version provenance.
2. **Approve the complete Stage C lineage envelope.** Distinguish immutable snapshot identity, C6 `evaluation_id`, and the separate C7 decision identity that references the exact C6 evaluation. Resolve final names and exact references consistently through C6/C7/C8/C9.
3. **Decide Stage C idempotency/atomicity unit boundaries.** O7 establishes separate idempotency boundaries for raw observation, target assessment and decision evaluation, and requires stage-local atomicity. It does not specify whether C6 and C7 are one or separate atomic write units. G5 must settle the logical C6/C7 boundary before G9 can define Stage C replay/recovery.
4. **Reconcile target-assessment input and version provenance with O6 v0.3.** O6 v0.3 remains the frozen logical basis. Do not silently reopen or rewrite it; record any genuine cross-protocol mismatch as a specific gap requiring owner disposition.
5. **Approve cross-stage positive, negative, missing and mismatch examples/test vectors.** Existing examples in matrix §7.12 are illustrative, not implementation fixtures.
6. **Confirm consistent negative permissions and legacy boundaries.** C6/C7/C8/C9 must not infer missing identity, repair mismatched lineage, pool branches or expand one another's authority.
7. **Confirm legacy/scalar disposition with G6/G7.** Missing historical provenance remains legacy/unknown; no reconstruction from current registry, task, timestamp or session.

### G5 items not blocking internal single-branch lineage

O9/G4 learner-facing cross-branch presentation remains separate. It is required before that optional product presentation is designed/shipped, but the matrix explicitly says it is not required to approve the internal single-branch C6→C9 lineage.

## 4. G6 — exact remaining work

**Current status: OPEN.** Logical identity anchors and fixture coverage exist, but the lifecycle proposal's own §7 acceptance criteria are not all closed.

### Determined or owner-approved anchors

- Task definition/version, task model/version, administered task instance, response episode, interaction event and raw observation are distinct logical concepts.
- One separately administered response episode maps to exactly one immutable raw observation.
- Ordinary edits/revisions/retries remain events within the same response episode.
- Explicit restart after completion is a new administration with a new task instance, response episode and observation; the prior episode remains preserved.
- A started abandoned episode preserves its abandonment event and captured history; no score/evidence result is invented from abandonment alone.
- A material support-condition change creates a new task instance, response episode and immutable observation. For the confirmed Tussentoets/Toets flow, content-help ends the independent attempt as incomplete; supported practice is a separate administration.
- Neutral interface clarification supplying no target reasoning does not itself change the support condition.
- Each interaction event belongs to exactly one parent episode, has stable identity within that episode, and the source event order is preserved independently of timestamps.
- Each target-specific assessment has its own logical identity and refers to exactly one immutable observation and one existing evidence target. Multiple target assessments can reference the same observation; corrections/reassessments are separately identified linked history.

### G6 decisions still required

1. **Interruption/resume:** approve the exact restoration condition under which the same response episode may resume. The current proposal's “resume only if the exact same administration state is restored” is explicitly a candidate, not final approval.
2. **Timeout:** approve whether/when an explicit versioned task/session policy can terminate an episode and its consequence. Elapsed time alone is not a terminal event.
3. **Completion and lifecycle state model:** reconcile completion, abandonment, interruption, resume, restart and timeout transitions with C3/O6, including learner-facing lifecycle wording where needed.
4. **Final identity namespace/uniqueness scope:** approve the observation and target-assessment identity scope. No physical ID format, database key or deterministic serializer is implied.
5. **Final C3/O6 reconciliation:** confirm the complete administration and target-assessment provenance envelope against the frozen O6 v0.3 logical requirements. Do not invent assessment labels for missing/no-response/incomplete episodes.
6. **Task-instance/episode relationship:** explicitly approve the minimum lifecycle cardinality and transition rules in the G6 acceptance criteria.

G6 event-order and target-assessment fixture tests are useful evidence, but do not by themselves close the owner approval or persistence behavior.

## 5. G9 — decisions owned by G9 after G5/G6 inputs are approved

**Current status: OPEN.**

| G9 question | Dependency/owner | Current disposition |
|---|---|---|
| Stage A observation identity scope | G6 | Blocked on G6 namespace approval |
| Stage A complete immutable field envelope | G6 + O6 v0.3 | Use field inventory as candidate; finalize after lifecycle/provenance approval |
| Stage B assessment identity scope | G6 | Blocked on G6 namespace approval |
| Stage B assessment payload/provenance envelope | O6 v0.3 + G5/G6 | Preserve O6 v0.3; reconcile exact field/version envelope |
| Stage C snapshot/C6/C7 identities and write-unit boundary | G5 | Blocked on G5 approval |
| Absent vs explicit null | G9 | Genuine G9 contract decision; not specified by current sources |
| Scalar/number/string normalization | G9 | Genuine G9 contract decision; not specified by current sources |
| Collection ordering/set semantics by field | G9, respecting G6 event order | Genuine G9 contract decision; event source order itself is already fixed |
| Timestamp precision/input canonicalization | G9, respecting O5 | Genuine G9 decision; UTC instant and half-open interval semantics already fixed |
| Contract-version compatibility/equality | G9 after G5/G6 envelope | Genuine G9 decision; no silent cross-version equality |
| Durable stage-state vocabulary/transitions | G9, constrained by O7 | Genuine G9 decision; O7 requires inspectable durable state but names no states |
| Uncertain-commit resolution | G9 | Genuine G9 decision |
| Retry policy and same-identity concurrency behavior | G9 | Genuine G9 decision |
| Persistence-operation timeout/recovery | G9, then G8/G10 | Separate from learner-administration timeout owned by G6 |
| Physical keys, transactions, locking, outbox/worker | G8/G10 | Downstream physical design; not part of this logical map |

## 6. Correct sequencing

1. **G5:** complete the C6–C9 crosswalk, settle the Stage C logical identity and atomic write-unit boundary, and approve the cross-stage examples.
2. **G6:** approve the remaining administration lifecycle and identity namespace, reconciled with O6 v0.3.
3. **G9:** freeze the complete stage payload envelopes; then decide the unresolved canonical equality rules and durable stage-state/recovery semantics.
4. **G8/G10:** design physical persistence and security/privacy around the approved logical contracts.
5. **G11:** author conformance/failure-injection tests only for approved semantics; do not guess open behavior.
6. **G12:** obtain explicit narrow implementation authorization before any runtime/persistence implementation.

G5 and G6 work can proceed in parallel where their inputs do not conflict, but G9 cannot claim a frozen complete contract until both relevant dependency outputs are approved. G8/G10 must not be used to decide unresolved logical semantics by implementation convenience.

## 7. Explicit non-decisions

This map does not:
- close G5, G6 or G9;
- select an ID format, key namespace, canonical serializer, hash or physical schema;
- select absent/null, normalization, collection ordering or timestamp precision rules;
- select state names, retry/backoff, concurrency, locking or uncertain-commit mechanics;
- reopen frozen O6 v0.3 or change its assessment semantics;
- authorize runtime, SQL/RPC/RLS, database or Supabase changes;
- authorize implementation under G12.

No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed in producing this map.
