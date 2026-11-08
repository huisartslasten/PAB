# PacoGO — G9 Source Reconciliation v0.1

**Status:** source-reconciliation review; design-only; no implementation authorization  
**Branch:** `refactor/professional-v1`  
**Baseline checked:** `41a305716d91046528934e84f991fc04b59616c3` — Full Regression #3352 / run ID `42504176404`: GREEN on the exact commit.

## 1. Purpose

This review checks the eleven open items in `PacoGO_G9_Logical_Idempotency_Contract_Candidate_v0.1.md` against the existing owner decisions and logical source contracts. It separates:

1. requirements already determined by source contracts;
2. specification details that remain open inside G6/G9;
3. dependencies on other gates;
4. physical implementation choices that must remain deferred.

It does not select a serializer, physical key, table, transaction technology, lock, queue, retry library or deployed Supabase behavior.

## 2. Source authority used

- `PacoGO_Multi_Target_Owner_Architecture_Decisions_v0.1.md`: owner-approved logical O1–O4 and O7–O8; O7 staged idempotency and O8 C6/C7 lineage.
- `PacoGO_Task_Observation_Identity_Lifecycle_Proposal_v0.1.md`: G6 logical observation, event and target-assessment identity boundaries; explicitly still OPEN for complete lifecycle approval.
- `PacoGO_Operational_Assessment_Contract_v0.3.md`: owner-approved O6 logical assessment record and correction provenance, especially §§2, 7 and 9.
- `PacoGO_C6_Mastery_Decision_Protocol_v0.1.md` and `PacoGO_C7_Next_Action_Decision_Protocol_v0.2.md`: C6/C7 responsibilities and exact handoff constraints.
- `PacoGO_C8_Student_Model_Learning_Status_Protocol_v0.2.md` and `PacoGO_C9_Vertical_Learning_Chain_Validation_Protocol_v0.2.md`: proposed downstream references to exact C6 evaluation and distinct C7 decision identities; these remain within G5 reconciliation, not final approval.
- `PacoGO_Multi_Target_Implementation_Readiness_Matrix_v0.1.md` §7: preliminary C6–C9 crosswalk and explicit note that G5 remains OPEN.
- `PacoGO_G6_G7_Read_Only_Identity_and_Consumer_Audit_v0.1.md` and `PacoGO_Learner_Ownership_and_Persistence_Contract_v0.1.md`: current implementation audit and security/persistence constraints.

## 3. Requirements already determined

### 3.1 O7 stage outcomes and atomicity

These are approved logical requirements, not proposals:

- Three separate idempotency boundaries: raw-observation ingestion; PacoGO target-assessment evaluation/recording; decision evaluation.
- Same stage identity plus same canonical immutable payload is a replay and must not create duplicate history.
- Same stage identity plus different canonical immutable payload is an integrity conflict and must be rejected; the original remains unchanged.
- Correction/reassessment uses a new linked/versioned identity and does not overwrite the source observation or prior assessment/decision history.
- A changed eligible evidence set or protocol produces a new snapshot/evaluation.
- Each stage commits atomically within its own write unit and exposes durable, inspectable state for retry/recovery.
- The full observation-to-decision chain is not one transaction.

O7 determines the logical outcomes and stage separation. It does **not** determine the canonical byte representation, stage status vocabulary, recovery mechanism, locking or physical transaction layout.

### 3.2 Stage A — observation identity and event ordering

Determined by C2/G6/O1/O7:

- One separately administered response episode maps to one immutable raw observation.
- A stable logical `observation_id` identifies that observation and remains stable on replay.
- One observation may have zero or more target-specific assessments; target opportunities do not automatically create assessments.
- Raw observation contains facts about what was presented and what happened, without assessment or developmental inference.
- Interaction events belong to one response episode; event identity is unique within that parent episode.
- The source/episode event order is authoritative. Timestamps do not silently reorder the event stream.
- Event time and assessment-availability time remain distinct.

**Still open:** exact observation-ID namespace/uniqueness scope and the final complete canonical raw-observation field envelope. G6 lifecycle approval remains open; G9 cannot fill those gaps by guessing.

### 3.3 Stage B — target-assessment identity and provenance

Determined by O1/O6/G6:

- Each target-specific assessment has its own stable logical `assessment_id`.
- Each assessment refers to exactly one immutable observation and exactly one existing evidence target.
- Multiple target assessments may refer to the same observation without creating additional observations.
- The observation/target pair alone is not the assessment identity.
- A correction or reassessment creates a new linked assessment identity; the prior assessment is preserved.
- G6's proposal explicitly states that a new rule/contract/engine assessment is not an in-place mutation and receives a new linked identity.
- O6 v0.3 §7 determines the logical provenance: task/registry versions, dimension applicability/execution/results, source/rationale and support references, rule/contract/engine versions, event and availability times, and prior-assessment link/reason where applicable.

**Still open:** exact assessment-ID namespace/uniqueness scope. A changed version number by itself must not be treated as an automatic reassessment unless a new assessment is actually performed; the resulting new assessment must have a new identity.

### 3.4 Stage C — C6 evaluation versus C7 decision

Determined at the logical lineage level:

- C6 evaluates one frozen snapshot for one complete six-part branch and emits its own `evaluation_id`, protocol/version provenance, gate trace and exact observation/assessment references (O8).
- C7 consumes exactly one validated C6 result and preserves its exact six-part branch, snapshot and C6 evaluation identity; it does not recompute mastery or infer missing identity (O8).
- The C8 v0.2 and C9 v0.2 logical proposals refer separately to a `c6_evaluation_id` and a `c7_decision_id`; the readiness matrix §7.2/§7.9 crosswalk likewise models a distinct C7 decision identity that references the exact C6 evaluation.

**G5 qualification:** C8/C9 v0.2 and the matrix crosswalk are still subject to final G5 reconciliation. Therefore this is the source-aligned candidate direction, not a claim that G5 is closed. G9 must model the Stage C decision record separately from the C6 evaluation record, while preserving the exact C6 reference. It must not reuse the C6 `evaluation_id` as though it were itself the C7 decision identity. Final approval of the precise C7 identity envelope belongs to G5.

### 3.5 Snapshot envelope

The logical snapshot lineage is substantially source-defined:

- Complete six-part branch identity: learner, registry version, claim, development, scope and time window.
- Explicit scope and time-window definition versions.
- Event-time interval with start inclusive/end exclusive.
- Assessment-availability cutoff distinct from event time.
- Exact eligible raw-observation references.
- Exact eligible target-assessment references and applicable contract/schema versions.
- Explicit exclusions and reasons.
- Registry and applicable assessment/C6/C7 protocol provenance.
- C6 gate trace and exact source references; C7 preserves the exact C6 branch/snapshot/evaluation identity.

O5 determines UTC instants, half-open event-time membership, separate availability cutoff and immutable snapshots. O7 determines that changed eligible evidence or protocol creates a new snapshot/evaluation. The detailed snapshot envelope is set out in the readiness matrix §7.2.

**Still open:** the G9 canonical equality envelope must define which of these fields are immutable semantic payload for each stage and how a contract-version change is compared. This is a G9 specification task, not an invitation to change O5/O8.

## 4. Eleven candidate open decisions — disposition

| Candidate item | Source reconciliation | Disposition |
|---|---|---|
| 1. Stage A identity namespace and uniqueness scope | G6 determines one stable observation identity per response episode, but no global/tenant/learner namespace or physical uniqueness scope. | **OPEN — G6/G9 logical scope.** Do not invent a key scope. |
| 2. Exact Stage A canonical field set | C2/G6/O6 determine the raw-fact categories and separation from assessment; G6 lifecycle proposal is not finally closed and does not provide a final canonical serialized envelope. | **PARTLY DETERMINED; OPEN — G6/G9.** Reconcile exact fields and applicability before equality tests. |
| 3. Absent/null, scalar normalization, collection order and timestamp equality | Event stream source order is determined; O5 determines UTC instants and event-time/availability separation. No general null, scalar, string, collection or timestamp-precision canonicalization rule is approved. | **PARTLY DETERMINED; OPEN — G9.** Preserve source order; do not invent other normalization. |
| 4. Stage B identity scope and changed-rule behavior | Stable assessment identity, one observation + one target, and new linked identity for an actual reassessment under changed rule/contract/engine are specified by G6/O6. Namespace/uniqueness scope is not. | **PARTLY DETERMINED; OPEN — G6/G9 scope.** The new-identity rule is source-derived; key scope is not. |
| 5. Stage C C6/C7 identity | O8 defines C6 `evaluation_id` and exact C7 consumption; C8/C9 v0.2 and matrix §7.9 specify a distinct C7 decision ID referencing that evaluation. G5 is still preliminary. | **SOURCE-ALIGNED CANDIDATE; G5 APPROVAL REQUIRED.** Keep C6 evaluation and C7 decision as distinct logical records/identities. |
| 6. Frozen snapshot/evaluation payload | O5/O7/O8 and matrix §7.2 define the branch, window, cutoff, evidence references, exclusions and protocol lineage at the logical level. | **PARTLY DETERMINED; OPEN — G5/G9.** Source fields are known; canonical equality/version comparison still needs specification. |
| 7. Durable stage-state vocabulary and transitions | O7 requires durable, inspectable state; it explicitly leaves status model/recovery mechanics to later specification. | **OPEN — G9.** No status enum or transition may be assumed. |
| 8. Uncertain-commit recovery and retry | O7 requires retry/recovery and logical replay without duplicate history. It does not define how an uncertain write is resolved. | **PARTLY DETERMINED; OPEN — G9.** Retry must resolve prior commit; mechanism and state transitions remain open. |
| 9. Same-identity concurrency | O7 determines the final logical replay/conflict outcomes and stage-local atomicity. It does not define in-progress duplicate responses, winner/loser protocol or concurrency mechanism. | **PARTLY DETERMINED; OPEN — G9/G8.** No last-write-wins; exact race handling remains open. |
| 10. Timeout semantics | G6 explicitly leaves learner administration timeout policy open; O7 does not define persistence-operation timeout behavior. These are separate concerns. | **OPEN — G6 for learner lifecycle; G9 for operation recovery.** No elapsed-time auto-termination or invented terminal state. |
| 11. G8/G10 security/persistence reconciliation | Existing learner ownership/RLS/security contract must be preserved; O7 requires stage-local atomicity. Physical design belongs to G8/G10. | **DEPENDENCY, NOT A NEW O7 OWNER CHOICE.** Reconcile before physical persistence design or implementation. |

## 5. What can be concluded now

1. The logical three-stage model and replay/conflict outcomes are already owner-approved; they do not need to be re-decided.
2. G6/O6 already determine the cardinality and provenance boundaries for observations and target assessments. G9 must consume them, not redefine them.
3. Event source ordering and O5 timestamp semantics are determined. General canonicalization is not.
4. The Stage C candidate should distinguish the C6 `evaluation_id` from the C7 `decision_id`, with C7 referencing the exact C6 result. This follows the current C8/C9 logical proposal and G5 crosswalk, pending G5 approval.
5. Remaining work is chiefly a precise G9 logical equality/state/recovery contract plus the G6 namespace/lifecycle dependencies. It is not permission to design or patch the existing RPC.

## 6. Required next work

1. Reconcile the G9 candidate's Stage C section with the C8/C9 crosswalk: separate C6 evaluation identity from C7 decision identity and record G5 approval as a dependency.
2. Draft field-by-field canonical payload inventories for Stages A, B and C from the source contracts. Mark required/conditional/optional fields without deciding serialization or normalization.
3. Keep the explicitly open canonicalization decisions open; do not write conformance tests for unresolved null/normalization/order/precision behavior.
4. Keep G6 namespace, interruption/resume, timeout and final lifecycle approval visible as dependencies.
5. Only after the logical contract is approved should G8/G10 design physical keys, atomic write units, recovery/concurrency mechanics and security integration.
6. No runtime, tests, schema, database, SQL/RPC/RLS, Supabase or learner data changes are authorized by this review.

## 7. Gate status

- G2/O6 v0.3: CLOSED at the logical-contract level; frozen.
- G5: OPEN; C6/C7/C8/C9 exact lineage reconciliation still required.
- G6: OPEN; event/assessment identity fixture coverage exists, but namespace/lifecycle and final owner approval remain open.
- G9: OPEN; this review narrows the unresolved decisions but does not close the gate.
- G8/G10: separate physical persistence/security gates; no implementation authorization.
- G3-037/038: remain BLOCKED pending approved identity scope, canonical payload equality/conflict and durable stage semantics.
- G3-039: logical correction lineage is fixture-tested; durable append-only recording remains open.

No runtime, test, registry, learner-state, physical schema, SQL/RPC/RLS, Supabase or learner data changed.
