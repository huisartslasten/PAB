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
2. **Approve and reconcile the complete Stage C lineage envelope.** The owner has approved distinct immutable snapshot, C6 evaluation and C7 decision records/identities, with C7 referencing the exact committed C6 evaluation. Reconcile the final field names and exact references consistently through C6/C7/C8/C9; field naming and physical identity namespaces remain open.
3. **Stage C idempotency/atomicity boundary — OWNER-APPROVED 2026-11-08.** O7's three top-level idempotency boundaries remain unchanged: raw-observation ingestion, target-assessment evaluation/recording and decision evaluation. Within O7's existing decision-evaluation boundary, C6 and C7 are distinct, ordered, immutable logical records with separate identities and separate atomic commits. C6 must be durably committed before C7 may be committed. C7 references the exact committed C6 result and the same branch/snapshot lineage. If C7 fails, the C6 record remains committed; C7 may be retried against that exact C6 result without rewriting or recomputing C6. This does not create a fourth O7 boundary or combine the C6 and C7 writes into one indivisible transaction.
4. **Reconcile target-assessment input and version provenance with O6 v0.3.** O6 v0.3 remains the frozen logical basis. Do not silently reopen or rewrite it; record any genuine cross-protocol mismatch as a specific gap requiring owner disposition.
5. **Approve cross-stage positive, negative, missing and mismatch examples/test vectors.** Existing examples in matrix §7.12 are illustrative, not implementation fixtures.
6. **Confirm consistent negative permissions and legacy boundaries.** C6/C7/C8/C9 must not infer missing identity, repair mismatched lineage, pool branches or expand one another's authority.
7. **Confirm legacy/scalar disposition with G6/G7.** Missing historical provenance remains legacy/unknown; no reconstruction from current registry, task, timestamp or session.

### G5 owner decision — Stage C C6/C7 boundary (2026-11-08)

The owner approved the following logical boundary:

- Keep O7's three top-level idempotency boundaries unchanged.
- Treat the immutable decision snapshot, C6 evaluation and C7 decision as distinct logical records with distinct identities.
- C6's evaluation record is immutable and is committed atomically as its own write.
- C7's decision record is immutable and has its own identity. It may be committed only after the exact C6 evaluation it consumes has been committed.
- C7 must preserve the exact six-part branch identity and snapshot/evaluation lineage from C6; it may not recompute mastery or reconstruct missing identity.
- If C7 fails or is unavailable, the committed C6 evaluation remains intact. A later C7 retry consumes that exact C6 evaluation and does not rewrite or rerun C6.
- C6 and C7 are separate ordered atomic writes **within O7's existing decision-evaluation boundary**. They are not two additional top-level O7 idempotency boundaries, and they are not one shared indivisible write unit.

This decision settles the logical Stage C record/write-unit boundary. It does **not** select physical IDs, field names, database keys/tables, transaction technology, serialization/hash formats, retry mechanics, locking, or persistence implementation. Those remain assigned to the relevant G5/G9/G8/G10 decisions.

### G5 cross-protocol reconciliation findings — read-only audit (2026-11-08)

The current C6/C7/C8/C9 documents share the following source-supported requirements:

- **C6:** seven existing mastery gates and five existing outcomes; the immutable evaluation record carries the complete six-part branch, exact snapshot, exact consumed observation/target-assessment references, C6 version provenance and gate trace.
- **C7:** consumes the exact committed C6 result; preserves the same six-part branch and snapshot/evaluation lineage; keeps prerequisite and next-development ordering separate; records its own decision identity, candidate set, decision trace and action-policy provenance.
- **C8:** consumes committed C6/C7 outputs descriptively. Its history item carries the exact six-part branch, `decision_snapshot_id`, `c6_evaluation_id`, `c7_decision_id`, exact C6/C7 outputs and version/provenance references.
- **C9:** validates the same six-part branch and exact snapshot → C6 → C7 → C8 lineage, rejects mismatches and does not repair missing identity.

The following are **genuine G5 reconciliation items**, not owner-approved decisions. Preserve them as open until the source contracts are reconciled:

1. **Identity field naming:** O8/C6 uses `evaluation_id`; C8/C9 and the G9 crosswalk use `c6_evaluation_id`. C8/C9 use `c7_decision_id`, while the C7 protocol currently describes its own identity generically. Final logical field names and uniqueness scopes must be consistent; physical ID formats remain downstream.
2. **C7 HOLD vocabulary:** the candidate-action list defines `HOLD_FOR_MORE_EVIDENCE`, while parts of the C7 decision flow use the shorter `HOLD`. C8 stores the exact C7 `next_action`. Determine whether `HOLD` is explanatory shorthand or an actual distinct result; do not silently normalize it.
3. **C7 adapter envelope and ownership:** the first vertical-slice example still shows `mastery_state_by_claim`. The C7 protocol now explicitly qualifies this as a non-canonical claim-keyed prototype, because it lacks the complete six-part branch/snapshot/evaluation identity. G5/G7 must reconcile the canonical adapter contract and existing duplicate adapter paths without selecting a runtime path by inference.
4. **C8 history write/read boundary:** C8 is defined as a descriptive projection of committed C6/C7 history, but its proposal also defines a stable `c8_item_id`, append-only history items and replay/conflict behavior. Clarify whether C8 is a derived read projection of Stage C or a separately persisted history record/write unit. Do not assume a fourth top-level O7 idempotency boundary or choose physical storage by convenience.
5. **C3 provenance scope:** C8/C9 mention coder, coding-round or adjudication provenance “where relevant”. The owner-approved O1/O6 direction keeps PacoGO as the single operational assessor and excludes human coder/adjudication workflows from the learner runtime. Reconcile those fields as historical/external provenance where genuinely applicable, or otherwise remove the ambiguity; do not introduce a second-assessor learner workflow.
6. **Version and rejection crosswalk:** approve the C6/C7/C8/C9 protocol versions as one set and ensure missing, mismatched, legacy and invalid-state outcomes are consistent. C8/C9 v0.2 remain proposals, not implementation approval.

These findings do not change C6 mastery gates, C7 action policy, C8 descriptive-only authority, C9 structural-only authority or O6 v0.3. They do not authorize runtime, tests, schema, SQL/RPC/RLS or Supabase changes.

### G5 items not blocking internal single-branch lineage

O9/G4 learner-facing cross-branch presentation remains separate. It is required before that optional product presentation is designed/shipped, but the matrix explicitly says it is not required to approve the internal single-branch C6→C9 lineage.

## 4. G6 — exact remaining work

**Current status: OPEN.** Logical identity anchors and fixture coverage exist, but the lifecycle proposal's own §7 acceptance criteria are not all closed.

### Determined or owner-approved anchors

- Task definition/version, task model/version, administered task instance, response episode, interaction event and raw observation are distinct logical concepts.
- One separately administered response episode maps to exactly one immutable raw observation.
- **Ordinary answer edits, revisions and retries remain events in the same response episode**; they do not create a new attempt or observation.
- **Explicit restart after completion is a new administration** with a new task instance, response episode and observation; the completed episode and its history remain preserved.
- **A started abandoned episode preserves its captured event/history and immutable raw observation; abandonment alone never fabricates a score or evidence result.**
- **A temporary interruption may resume the same task instance and response episode only if the exact same administration state is restored.** For this logical contract, that means the same task content/version, presentation/representation, response mode, support condition and recorded progress/event history. If exact restoration is unavailable, the old episode must not be resumed as though unchanged.
- **A material change to task content, presentation/representation, response mode or support condition is a new administration** with a new task instance, response episode and observation. For the confirmed Tussentoets/Toets flow, content-help ends the independent episode as incomplete; supported practice is a separate administration. Neutral interface clarification that supplies no target reasoning is not itself a material support-condition change.
- **Elapsed time alone never terminates an episode.** Timeout termination is permitted only under an explicit, versioned task/session policy that defines the timeout and its consequence. Without such a policy, there is no automatic timeout termination.
- Each interaction event belongs to exactly one parent episode; the source event order is preserved independently of timestamps.
- Each target-specific assessment has its own logical identity and refers to exactly one immutable observation and one existing evidence target. Multiple target assessments can reference the same observation; corrections/reassessments are separately identified linked history.

The lifecycle rules above were explicitly approved by the owner on 2026-11-08. They are logical contract decisions only: they do not select physical ID formats, storage keys, snapshot/hash formats, timeout durations or implementation mechanics.

### G6 decisions still required

1. **Policy-specific timeout configuration:** before any task/session uses a timeout, its versioned policy must define duration and consequence. No universal duration or implicit default is approved.
2. **Completion and learner-facing lifecycle vocabulary:** reconcile completion, abandonment, interruption, resume, restart and policy-triggered timeout labels/transitions with C3/O6; do not introduce assessment labels or learner-facing claims that O6 does not support.
3. **Final identity namespace/uniqueness scope:** approve observation, event and target-assessment identity scopes. No physical ID format, database key or deterministic serializer is implied.
4. **Final C3/O6 reconciliation:** confirm the complete administration and target-assessment provenance envelope against frozen O6 v0.3. Do not invent assessment labels for missing/no-response/incomplete episodes.
5. **Task-instance/episode cardinality:** finalize the proposed minimum cardinality and transition rules against the complete G6 acceptance criteria; do not infer a physical relationship from the logical proposal.
6. **Operational interruption verification:** specify how the runtime can establish that the exact administration state was restored, without prematurely choosing a physical snapshot or hash mechanism.

G6 event-order and target-assessment fixture tests are useful evidence, but do not by themselves close the remaining owner approval or persistence behavior.

## 5. G9 — decisions owned by G9 after G5/G6 inputs are approved

**Current status: OPEN.**

| G9 question | Dependency/owner | Current disposition |
|---|---|---|
| Stage A observation identity scope | G6 | Blocked on G6 namespace approval |
| Stage A complete immutable field envelope | G6 + O6 v0.3 | Use field inventory as candidate; finalize after lifecycle/provenance approval |
| Stage B assessment identity scope | G6 | Blocked on G6 namespace approval |
| Stage B assessment payload/provenance envelope | O6 v0.3 + G5/G6 | Preserve O6 v0.3; reconcile exact field/version envelope |
| Stage C final C6/C7 field names, identity uniqueness scopes and complete immutable payload envelopes | G5/G6/G9 | Logical distinction and ordered atomic-write boundary are owner-approved; final naming/namespace and payload details remain open |
| C8 history-item identity and derived-read-model versus separately persisted-record boundary | G5/G8/G9 | Logical descriptive-only role is defined; record/write-unit and persistence relationship to Stage C remain unresolved |
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

1. **G5:** complete the C6–C9 crosswalk around the owner-approved Stage C boundary; finalize field names and exact references/provenance, reconcile protocol versions and approve the cross-stage examples/negative permissions.
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

## G5-S3 — Official logical Stage C identity field names

**Owner decision: approved 2026-11-08.** The official logical field names are:

- `decision_snapshot_id` — identity/reference for the immutable decision snapshot;
- `c6_evaluation_id` — identity/reference for the immutable C6 mastery evaluation;
- `c7_decision_id` — identity/reference for the immutable C7 next-action decision.

O8's `evaluation_id` is the generic historical/source term for the C6 evaluation identity; it is not a second identity and must be interpreted as `c6_evaluation_id` in the reconciled cross-stage logical contract. C7's own decision identity is distinct and is named `c7_decision_id`.

This approval standardizes **logical field names only**. It does not decide physical ID formats, generation, namespaces or uniqueness scopes, database columns/keys/tables, serialization, hashing, storage, transactions, retry/concurrency mechanics or persistence APIs. Those remain assigned to their existing G6/G9/G8/G10 gates.

This decision resolves only G5's logical field-naming item. It does not close G5, G6 or G9; does not alter the approved Stage C record/write boundary; and does not authorize runtime, tests, schema, SQL/RPC/RLS, database or Supabase changes. G12 remains NOT AUTHORIZED.

## G5-S4 — C7 HOLD vocabulary: source-reconciled clarification

**Finding: source-derived; no separate owner policy decision is required for the current C7 v0.2 contract.**

The active C7 v0.2 candidate-action list (§3) defines exactly six candidate actions. Its only hold action is `HOLD_FOR_MORE_EVIDENCE`. The unqualified word `HOLD` appears in §6's explanatory decision-flow sketches; it is not defined there as a separate candidate action, decision-result enum, or persisted status.

This interpretation is corroborated by the existing C7 v0.2 validation matrix and maintained engine contract:
- `PacoGO_C7_Decision_Test_Matrix_v0.1.json` (matrix version 0.2) expresses each hold scenario as `expected.candidate_action = HOLD_FOR_MORE_EVIDENCE`;
- `pacogo-engine/c7-contracts.js` defines `HOLD_FOR_MORE_EVIDENCE` as the only hold candidate;
- `pacogo-engine/c7-next-action-decision.js` emits that candidate for insufficient evidence, unusable/unassessed mastery, unsupported/uncertain ordering and unauthorized next actions;
- maintained C7 tests assert the exact candidate value; they do not define or accept a separate `HOLD` candidate;
- C8 v0.2 stores the exact C7 output in `next_action`, without reinterpretation.

**Reconciled meaning:** in C7 v0.2 explanatory flow prose, `HOLD` is shorthand for selecting the explicit candidate action `HOLD_FOR_MORE_EVIDENCE`. It is not a seventh action, separate terminal status, or alternative serialized value. The decision reason and gate continue to explain why that candidate was selected. When a C7 output is recorded or passed downstream, the exact candidate value `HOLD_FOR_MORE_EVIDENCE` is preserved.

This clarification does not change the action policy, candidate set, gate behavior, decision reasons, C6 mastery outcomes, C8 descriptive authority or C9 validation authority. It does not authorize runtime/test changes, schema, SQL/RPC/RLS, persistence or Supabase work. Existing engine and test artifacts were inspected read-only; no code or tests were changed.

**G5 effect:** the HOLD vocabulary ambiguity is resolved at the logical contract level by the active protocol, validation matrix and maintained engine/test evidence. G5 remains OPEN for its other reconciliation deliverables. G6/G9 remain OPEN; G12 remains NOT AUTHORIZED.
