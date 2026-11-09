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
2. **Approve and reconcile the complete Stage C lineage envelope.** The owner-approved logical names are `decision_snapshot_id`, `c6_evaluation_id` and `c7_decision_id` (G5-S3). The owner-approved record boundary requires C6 and C7 to be distinct immutable records with separate ordered atomic writes inside O7's existing decision-evaluation boundary. Reconcile exact references and provenance consistently through C6/C7/C8/C9; physical identity namespaces and uniqueness scopes remain open.

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

The following items remain **open G5 reconciliation work**. Earlier findings in this section are superseded where later owner decisions or source-reconciled clarifications below explicitly resolve them.

**Resolved by recorded owner decisions / authoritative source contracts:**

1. **Logical identity field names — RESOLVED (G5-S3).** The official names are `decision_snapshot_id`, `c6_evaluation_id` and `c7_decision_id`. O8's generic `evaluation_id` denotes the C6 identity and is not a second identity. Physical formats, namespaces and uniqueness scopes remain open.
2. **C7 HOLD vocabulary — RESOLVED (G5-S4).** The only hold candidate is `HOLD_FOR_MORE_EVIDENCE`; unqualified `HOLD` in explanatory flow prose is shorthand, not another action or serialized result.
3. **Existing adapter ownership — RESOLVED to non-canonical status (G5-S5).** Both C6→C7 adapters and the C8/C9 bridge remain unchanged non-canonical prototype/test paths. No canonical adapter or runtime route has been selected. G5 owns the logical envelope; G7 owns consumer compatibility and any later migration/deprecation plan.
4. **C6/C7 record and atomic-write boundary — OWNER-APPROVED (2026-11-08).** C6 and C7 are separate immutable records and separate ordered atomic writes inside O7's existing decision-evaluation boundary. C7 consumes the exact committed C6 result; C7 failure does not rewrite or rerun C6. The three top-level O7 boundaries remain unchanged.

**G5 reconciliation findings and remaining open items (after the 2026-11-09 C8 owner decision):**

5. **C8 history read/write boundary — OWNER-APPROVED 2026-11-09 (RESOLVED).** C8 is a derived, descriptive, non-authoritative read projection over committed C6/C7 records. `c8_item_id` is removed as an authoritative domain identity; C8 has no independent durable history identity, write unit, idempotency key, replay/conflict lifecycle or fourth O7 top-level boundary. Its logical source lineage is the exact six-part branch identity plus `decision_snapshot_id`, `c6_evaluation_id` and `c7_decision_id`. Append-only historical meaning is inherited from immutable C6/C7 source records. Reprojection must not duplicate or mutate source decisions. Option B may be considered later only as a G8 physical optimization; any materialized model must be rebuildable and non-authoritative. A technical row handle is projection-local, not a domain identity. Physical materialization, canonical equality/serialization, storage and refresh remain open under G8/G9.
6. **C3/O6 provenance scope.** The operational boundary is source-determined: PacoGO is the single operational assessor; no human coder, second assessor or adjudication workflow belongs in learner runtime. C3 v0.2 explicitly withdraws its former human-coder model for learner-runtime architecture. C8/C9 coder/round/adjudication references may only describe genuinely applicable historical/external provenance; they must not imply an operational human assessment workflow. The exact historical/external compatibility treatment must be reconciled with G6/G7 and frozen O6 v0.3.
7. **Protocol-version and rejection crosswalk.** Reconcile C6 v0.1, C7 v0.2, C8 v0.2 and C9 v0.2 as one proposed contract set, including version provenance and stage-attributed missing/mismatch/invalid/legacy outcomes. C8 permits rejection or quarantine from canonical summaries; C9 rejects structurally invalid canonical chains and allows historical validation only under the original legacy contract. The exact shared disposition, especially quarantine versus branch rejection and compatibility boundaries, remains open. C8/C9 remain proposals, not implementation approval.
8. **O6 target-assessment input alignment and cross-stage examples.** O6 v0.3 remains frozen. G5 must align C8/C9's assessment references/version fields to that exact source contract and approve positive, negative, missing and mismatch examples without inventing assessment labels or reopening O6.
9. **Legacy/scalar disposition.** Complete the G6/G7 compatibility inventory. Historical records missing canonical branch/snapshot lineage remain explicitly legacy/unscoped; no reconstruction from current registry, task, timestamp or session.

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

### G6-A — task-instance / response-episode cardinality review (2026-11-09)

Created `PacoGO_G6_Task_Instance_Response_Episode_Cardinality_Review_v0.1.md` after Full Regression #3406 verified the review-document commit `c6cf99a7e3b275e5ccc4125a1958755637e5de02` GREEN.

The review recommends, but does not approve, the following minimum logical cardinality:

- A task instance represents a **started** concrete administration; a preview/unopened task creates no task instance, response episode or observation.
- One started task instance corresponds to exactly one response episode (1:1), with both identities created together at administration start.
- One response episode maps to exactly one immutable raw observation.
- One observation may have zero or more separately identified target assessments; each assessment refers to exactly one observation and one existing evidence target.
- A response episode may have zero or more events; event source order remains authoritative.
- Reusable task definition/version and task model/version remain distinct references; no parent relationship or physical foreign-key structure is selected.

**Disposition:** G6-A is a source-derived recommendation awaiting explicit owner disposition. It does not close the task-instance/episode cardinality item, approve a physical relationship, select identity namespaces, or authorize runtime/schema/test changes. G6 remains OPEN; G9 remains OPEN; G12 remains NOT AUTHORIZED. The review deliberately leaves identity namespace/uniqueness, canonical serialization/equality, durable state/recovery, physical persistence and learner-facing vocabulary to their owning decisions.

Next G6 work after owner disposition: G6-B identity namespace and uniqueness-scope review, followed by the remaining C3/O6 provenance and interruption-restoration reconciliation. Do not treat the recommendation as approved merely because the review or its regression passed.

## 5. G9 — decisions owned by G9 after G5/G6 inputs are approved

**Current status: OPEN.**

| G9 question | Dependency/owner | Current disposition |
|---|---|---|
| Stage A observation identity scope | G6 | Blocked on G6 namespace approval |
| Stage A complete immutable field envelope | G6 + O6 v0.3 | Use field inventory as candidate; finalize after lifecycle/provenance approval |
| Stage B assessment identity scope | G6 | Blocked on G6 namespace approval |
| Stage B assessment payload/provenance envelope | O6 v0.3 + G5/G6 | Preserve O6 v0.3; reconcile exact field/version envelope |
| Stage C final C6/C7 field names, identity uniqueness scopes and complete immutable payload envelopes | G5/G6/G9 | Logical distinction and ordered atomic-write boundary are owner-approved; final naming/namespace and payload details remain open |
| C8 history projection and physical read-model behavior | G5/G8/G9 | G5 logical boundary resolved: derived, non-authoritative projection; no authoritative `c8_item_id` or C8 write/idempotency unit. G8/G9 physical materialization, projection-local handles, equality/serialization and refresh remain open |
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

## G5-S5 — C6→C7 adapter ownership and prototype-path audit

**Status: owner decision approved 2026-11-08; existing paths remain non-canonical prototypes.**

### Existing source paths inspected

1. `pacogo-engine/c6-c7-adapter.js` exports `validateC6SafetyBoundary` and `createC7InputFromC6`. It selects `c6Result.mastery_state_by_claim[options.claim_id]`, requires caller-supplied C7 context, and checks the supplied current development against the selected C6 result.
2. `pacogo-engine/c7-from-c6.js` exports `validateC6ResultForC7` and `buildC7InputFromC6`. It also selects `c6_result.mastery_state_by_claim[claim_id]`, but derives current development from the selected C6 result. It separately validates ordering/alternative states before building the C7 input.
3. Both paths enforce the existing C6 safety flags and construct the same general claim/development-keyed C7 input shape. They are distinct modules with overlapping adapter responsibility and different function/input contracts.
4. The maintained tests for each adapter exercise the corresponding path. `c6-c7-vertical-slice.test.js` and `c8-c9-real-vertical-slice.test.js` exercise `buildC7InputFromC6` from `c7-from-c6.js`. This proves test-fixture usage, not production runtime ownership.
5. `pacogo-engine/c8-c9-adapter.js` is a separate downstream bridge. It accepts either a claim-keyed C6 result plus claim ID or an already normalized claim result, then checks claim/development alignment and maps the C7 `candidate_action` to C8's `next_action`. It does not establish canonical six-part branch/snapshot/C6/C7 identity lineage.

### Contract gap established

The current C6 engine result exposes `mastery_state_by_claim` and safety flags, but no immutable `decision_snapshot_id`, `c6_evaluation_id` or complete six-part branch envelope. The current C7 engine output similarly contains claim/development, candidate action, reason, gate, supporting evidence and safety flags, but no `c7_decision_id` or exact upstream lineage references.

Therefore neither existing C6→C7 adapter can be designated the canonical Stage C adapter merely because its tests pass. Both are claim-keyed prototype paths, consistent with the explicit non-canonical warning in C7 v0.2 §9. The downstream C8/C9 adapter is also a prototype bridge, not a canonical lineage adapter.

### Ownership boundary and recommendation

- **G5 owns** the logical C6→C7 input/output envelope and exact lineage requirements, under the already approved Stage C record boundary and official names `decision_snapshot_id`, `c6_evaluation_id`, `c7_decision_id`.
- **G7 owns** consumer compatibility, inventory of existing call paths, and any explicit deprecation/transition plan. G7 must not choose a logical contract by implementation convenience.
- **G12 remains the only narrow implementation-authorization gate.**

**Owner decision approved 2026-11-08:** retain both existing C6→C7 adapters and the downstream C8/C9 bridge explicitly as non-canonical prototype/test paths. No existing path is designated as the canonical Stage C adapter. The canonical adapter must be defined from the reconciled full Stage C lineage envelope after G5/G7 reconciliation. Do not delete, merge, refactor or route runtime traffic based on this decision. No code or tests were changed; no runtime, curriculum, registry, learner state, schema, database, SQL/RPC/RLS or Supabase was changed. The existing adapters were inspected read-only.

**Decision effect:** adapter ownership is resolved only to the extent that all three existing paths remain non-canonical. G5 still owns the logical adapter envelope; G7 still owns consumer compatibility and migration/deprecation planning. This decision does not select a canonical adapter, change runtime routing, or authorize implementation.


## G5 follow-up — protocol/rejection and O6 provenance crosswalk audit (2026-11-09)

Audit: `PacoGO_G5_C6_C7_C8_C9_Protocol_Rejection_Crosswalk_Audit_v0.1.md`.

The source-by-source review confirms:
- O6 v0.3 is the frozen, owner-approved operational assessment contract; its applicability, execution and result layers must remain distinct.
- C6 v0.1 has five mastery outcomes; missing/unassessable evidence is not the same as structural lineage rejection.
- C7 v0.2 has six candidate actions; `HOLD_FOR_MORE_EVIDENCE` is the sole hold candidate. Structural identity failure must not be converted into that pedagogical action.
- C8 v0.2's rejection/quarantine and duplicate/replay wording must be read subject to the owner-approved derived projection boundary. C8 cannot create durable quarantine, a C8 conflict lifecycle or independent identity.
- C9 v0.2 is a structural validator that reports per-branch, stage-attributed errors; it does not repair or mutate records.
- C3 v0.2 and the earlier C3 reconciliation retain withdrawn human-coder assumptions and are not approved operational codebooks. New learner-runtime assessment provenance must align to O6's O6/C3 contract version, target-rule version and assessment-engine version; human coder/adjudication references are historical/external only where genuinely present.
**Historical status note (pre-disposition):** The following source-audit summary originally listed the bounded crosswalk questions as awaiting owner review. That status was accurate before the delegated owner disposition recorded in audit §9; it is superseded for those specific questions by the resolution below. It must not be read as the current status.

- The initial source audit identified C6 M1/M2 use of O6 alignment/relation and the non-scored adequacy profile as requiring an explicit disposition. The subsequent disposition resolves the interpretation without introducing an O6 profile score or automatic M1/M2 mapping.

At the time of the initial audit, G5 was OPEN for owner review of stage-attributed rejection/C8 diagnostics, operational provenance terminology, C6 M1/M2 consumption, examples and legacy/scalar compatibility. **Those bounded logical crosswalk questions are now RESOLVED** by the owner-authorized disposition recorded in audit §9 and summarized in the follow-up section below. This does not close every G5 deliverable or authorize runtime work. G6/G9 remain OPEN; G12 remains NOT AUTHORIZED. The disposition is documentation-only and does not change frozen O6 v0.3, runtime, tests, schema, persistence or Supabase.

## G5 follow-up — owner-approved logical crosswalk disposition (2026-11-09)

Source decision: §9 of `PacoGO_G5_C6_C7_C8_C9_Protocol_Rejection_Crosswalk_Audit_v0.1.md`. Full Regression #3401 / run ID `42612779144` is GREEN on exact audit-decision commit `a207ed82b49d1ee456590bfd7b8d11dc8e77148e`.

The owner delegated the bounded logical decisions to the project assistant. The resulting conservative disposition is:

- **Stage ownership:** each producer validates its own record; C6 owns mastery inference, C7 owns pedagogical candidate action, C8 is a non-authoritative projection containing only structurally eligible source chains, and C9 reports cross-stage structural diagnostics with stage/record attribution. Structural failures are never converted into mastery outcomes or C7 hold actions. C8 has no durable quarantine, rejection ledger, independent identity or idempotency lifecycle.
- **Operational provenance:** new target assessments retain the O6/C3 assessment-contract version, target-rule version and assessment-engine version, plus exact O6-required task, registry, scoring and source provenance. Human coder/adjudication metadata is historical/external only when actually present and relevant. C3 proposal v0.2 is not silently promoted to canonical operational codebook.
- **C6 M1/M2:** M1 is an explicit claim-specific relevance judgement informed by target mapping, task alignment, response relation and completed target rule; no single label automatically passes it. M2 inspects O6's non-scored adequacy dimensions contextually; no composite score or universal threshold is introduced. Unavailable necessary inputs remain unassessable under C6's existing outcome order. The seven gates are unchanged.
- **Examples:** positive, negative, missing, task-misalignment, structural-lineage mismatch and late/legacy examples in audit §6 are approved as logical illustrations, not executable fixtures.
- **Legacy/scalar:** historical payloads and scalar/array shapes remain unchanged and are interpreted only under their original version. No inferred/backfilled provenance, coercion, automatic array conversion or mixed legacy/canonical validation. Any future adapter needs a separate explicit design and approval.

**G5 status:** LOGICAL CROSSWALK RESOLVED for this bounded scope. This does not mean runtime-ready protocol revisions or executable acceptance tests are approved. The versioned C6/C7/C8/C9 proposals are not silently rewritten by this decision.

**Dependencies remain:** G6 and G9 OPEN for identity, lifecycle, canonical equality, serialization, retry/concurrency and recovery. O6 v0.3 remains frozen. C8 Option A remains controlling. G12 remains NOT AUTHORIZED. No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed. No implementation authorization is implied.

