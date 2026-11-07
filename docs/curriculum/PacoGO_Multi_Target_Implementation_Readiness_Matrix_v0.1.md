# PacoGO — Multi-Target Implementation Readiness Matrix v0.1

Status: architecture-readiness planning artifact / implementation NOT authorized
Date: 2026-11-06
Branch: `refactor/professional-v1`
Basis:
- `PacoGO_Multi_Target_Owner_Architecture_Decisions_v0.1.md`
- `PacoGO_Integrated_Multi_Target_Decision_Contract_v0.2.md` (proposal; not approved)
- `PacoGO_Multi_Target_Decision_Review_v0.1.md`
- C3 v0.2 codebook reconciliation proposal
- Scope and Time-Window Lifecycle Contract v0.1
- C6 v0.1, C7 v0.2, C8 v0.2 and C9 v0.2 protocol documents
- current runtime, persistence and learner-state findings recorded in the current handoff

This matrix translates the accepted logical architecture baseline into explicit gates. It is a planning and governance artifact, not approval to implement code, change curriculum definitions, alter tests, or modify persistence.

## 1. Current authorization boundary

### Accepted logical directions

O1–O4 and O7–O8 are accepted only at the logical level:

- one immutable raw observation per separately administered response episode;
- zero or more target-specific assessments linked to that observation;
- PacoGO is the single operational assessor; no human coder, second assessor or adjudication workflow is part of learner runtime;
- branch-specific decisions and history are authoritative; skill summaries are derived;
- the six explicit branch identity fields remain authoritative;
- historical scalar records remain unchanged and may be exposed through a read-only legacy adapter;
- raw observation, PacoGO target assessment and decision evaluation have separate idempotency boundaries;
- C6 evaluates a frozen snapshot for one exact branch; C7 consumes that exact result.

### Still open owner decisions

- **O5 — Scope/time-window lifecycle:** minimum reversible logical policy approved; detailed ownership/permissions, overlap presentation and retention/deletion remain open.
- **O6 — Canonical C3 assessment and measurement vocabulary:** not approved.
- **O9 — Learner-facing cross-branch projection:** not finalized.

### Not authorized

No runtime, test, registry, catalogue, task-model, SQL/RPC/RLS, Supabase, learner-state or learner-data implementation is authorized by this matrix. B1-L08 remains blocked. Existing curriculum meanings, C1–C9 scientific meanings, mastery criteria and legacy areas remain unchanged.

## 2. Gate matrix

The role labels below identify accountable functions, not named individuals. The project owner must explicitly appoint a scientific/protocol reviewer and product reviewer where those roles are not otherwise assigned.

| ID | Gate / required decision | Accountable owner | Required artifact or evidence | Dependencies | Exit condition / implementation authorization |
|---|---|---|---|---|---|
| G0 | Baseline and repository integrity | Engineering owner | Current handoff; branch/HEAD verification; Full Regression result on exact tree/commit; clean working tree | None; mandatory before every build block | Exact branch head is `refactor/professional-v1`; Full Regression green; `main` untouched. Red means STOP and root-cause isolation. |
| G1 | O5 scope and time-window policy | Project owner + scientific/protocol reviewer | Versioned scope/window policy. Minimum logical policy is approved: explicit scope; explicitly configured, versioned start/end window; event-time membership; separate assessment-availability cutoff per snapshot; immutable snapshots; UTC instants. Detailed permissions/ownership, overlap presentation and retention/deletion remain open. | Owner Architecture Decisions O5; approved minimum policy in handoff section 67; C6–C9 contracts | Core logical policy is approved. G1 closes only after remaining governance/privacy details are resolved before affected persistence or product presentation is implemented. |
| G2 | O6 C3 assessment and measurement model | Scientific owner/reviewer | Approved, versioned PacoGO assessment contract: target alignment, response relation, raw process/missingness/NO_RESPONSE, evidence status, objective performance versus quality, quality construct/anchors, assistance and independence rules, contradiction, unknown/insufficient-data behavior, assessment provenance and schema versioning | C3 v0.2 proposal (to be reconciled); consolidated observation/event reconciliation; owner-confirmed support-condition contract; O1 cardinality | PacoGO's single-assessor role is explicit; operational rules, labels and anchors are versioned; unresolved categories/scales and schema conflicts are resolved. No human coder or second-assessor workflow is required or introduced. |
| G3 | C3 operational assessment-rule verification | Scientific/protocol owner + engineering owner | Versioned rule/decision specification with positive, negative, boundary, missing-data and unknown cases; deterministic test vectors where applicable; explicit provenance and no-inference constraints | G2; task support-condition contract; C3 dimensions and measurement rules fixed | PacoGO's assessment behavior is testable against approved rules; unsupported cases remain unknown/insufficient rather than guessed. This is software/measurement-rule verification, not human inter-rater reliability. Empirical validity remains under G13. |
| G4 | O9 learner-facing cross-branch product policy | Product owner + project owner | Product decision record and reviewed learner/parent presentation prototypes covering audience, permissions, wording, visual hierarchy, contradictory/insufficient/not-assessed/legacy states and lineage visibility | O2/O3 branch semantics; C8 v0.2 proposal; G1/G2; privacy review | Product explicitly accepts descriptive-only projection constraints. No pooled evidence, cross-branch mastery/action recomputation, unsupported transfer/retention claims or automatic advancement. |
| G5 | C6–C9 contract reconciliation | Scientific/protocol owner + architecture owner | One reconciled, versioned contract set and crosswalk: C6 seven-gate inputs/outputs and branch identity; C7 exact C6 handoff; C8 branch history and descriptive projection; C9 structural validation; snapshot/version lineage and negative permissions | Approved minimum O5 policy; G2/O6 for target-assessment inputs; accepted O1–O4/O7–O8. O9 is required for learner-facing cross-branch presentation, not for the internal single-branch lineage contract. | Every stage agrees on six-part identity, immutable snapshot/evaluation references, cardinality, eligibility, legacy boundary and error/rejection behavior. No protocol silently expands another's authority. |
| G6 | Task definition / attempt / observation identity | Curriculum + interaction architecture owner | Canonical identity and provenance contract distinguishing versioned task definition, task/interface model, administered task instance/attempt, immutable raw observation and within-attempt interaction events | O1/O4/O7; G2; existing interaction-contract and task-model audit | A stable task definition ID is never reused as an attempt ID; one separately administered response episode maps to one immutable observation; retries/events are classified by an explicit administration lifecycle. |
| G7 | Runtime consumer and legacy compatibility inventory | Engineering owner | Audited inventory of browser pages, controllers, registry/prototype, services, learner-state/history, reports, exports and external consumers; each classified as canonical read/write, legacy read, derived projection or prohibited write | O2/O4; G5/G6; current scalar-path findings | Every scalar consumer and write path has an explicit migration/adapter disposition. Ambiguous multi-target or multi-branch records cannot be collapsed. Historical provenance is not fabricated. |
| G8 | Persistence and read-model design | Data/architecture owner | Physical logical-to-relational mapping for observation, target assessment, assessment-version provenance, snapshot, branch identity, evaluation, branch history and derived projections; keys, constraints, indexes, versioning, query/read paths and retention | G1, G2, G5, G6, G7 | Design demonstrates one raw observation with multiple assessments without duplicated observations; exact six-field branch uniqueness; append-only history; queryable lineage; no skill-level row substituting for branch authority. |
| G9 | Staged writes, idempotency, concurrency and recovery | Engineering + data/security owners | Stage-by-stage lifecycle and state machine for observation ingestion, PacoGO assessment evaluation/recording and decision evaluation; canonical payload identity; conflict semantics; atomic units; retries, outbox/recovery, locking/CAS and failure-injection tests | O7; G2, G5, G8 | Same identity/same immutable payload is replay; same identity/different payload is rejected; corrections are linked new records; changed snapshots create new evaluations; partial writes cannot survive within a stage. |
| G10 | Security, privacy and child-data governance | Security/privacy owner + project owner | Threat/data-flow review, role/guardian ownership matrix, RLS and RPC authorization design, direct-write denial, transaction-local capability cleanup, audit access, data minimization, retention/deletion, export and incident handling | G1, G2, G7, G8, G9; applicable product audience in G4 | Explicit approval that all new paths preserve learner/guardian boundaries and child-data obligations. No Supabase change until a real approved persistence/runtime contract requires it. |
| G11 | Contract and migration verification suite | Engineering + scientific/protocol owners | Contract tests for cardinality, shared-observation counting, branch isolation, six-field mismatch, conflicting replay, delayed assessment availability, immutable snapshots, legacy adapter, concurrency/retry, security/RLS and negative permissions; migration/backfill dry-run if needed | G1–G10; approved physical design | Tests assert approved contracts, not implementation convenience. Independent review confirms tests are not weakened to obtain green. Migration is reversible or has a documented safe recovery path. |
| G12 | Narrow implementation authorization | Project owner + engineering owner + scientific/protocol owner | Signed gate review referencing all completed artifacts, exact implementation slice, explicit exclusions, baseline commit and regression result | G0–G11 | Only a bounded, complete pure-contract vertical slice is authorized. Runtime/persistence work is separately authorized only when its own design and security gates are complete. |
| G13 | Empirical validation and product-claim authorization | Scientific validation lead + project owner | Scientific Validation plan and, eventually, `PacoGO_Validation_Data_Specification_v0.1.md`, with claims, hypotheses, sampling, independent measures, reliability/validity, discrimination, transfer, longitudinal design, mastery/action/interface validation, confounders, child-data ethics, analysis criteria and replication plan | G1–G5 and explicit intended product claims; may proceed as a research-design stream in parallel with engineering design | Required before PacoGO presents unvalidated inferences as scientifically established or makes corresponding product claims. A structurally green software regression does not satisfy this gate. |

## 3. Gate ordering and parallel work

The following ordering is mandatory:

1. G0 is a continuous gate before and after every build block.
2. G1, G2 and G4 are owner decisions and must be closed before the integrated contract can be finalized.
3. G3 follows the approved C3 construct and measurement decisions in G2.
4. G5 reconciles the C6–C9 contracts after the relevant O5/O6 decisions are known; it must preserve the already accepted O1–O4/O7–O8 directions.
5. G6 and G7 can be prepared in parallel with G1–G5, but their final contracts must be reconciled with the approved C3 and branch contracts.
6. G8–G10 depend on the approved logical contracts and consumer inventory. Physical persistence design must not lead the scientific contract.
7. G11 verifies the complete approved design before implementation.
8. G12 is the explicit authorization checkpoint. Passing individual gates does not silently authorize implementation.
9. G13 is a separate empirical-validation/claims gate. It is not replaced by code tests or architecture review.

## 4. First implementation slice — not yet selected

No implementation slice is selected or authorized now.

After G0–G11 are closed, the architecture owner should propose the smallest complete pure-contract slice. It should demonstrate, without persistence side effects:

- distinct task-definition and task-instance identities;
- one immutable raw observation;
- multiple target assessments linked to that same observation;
- exact six-field branch partitioning;
- no inflation of independent observation counts;
- frozen snapshot identity and exact C6-to-C7 handoff;
- rejection of ambiguous legacy scalar projection.

The slice must not change curriculum mappings, task catalogue entries, mastery thresholds, C6 gate meanings, C7 action policy, learner data or Supabase. A separate decision is required before any persistence implementation.

## 5. Current blockers and next concrete action

Open blockers:

- G1 / O5: minimum logical policy approved; detailed governance/privacy details remain open.
- G2 / O6: C3 assessment and measurement approval.
- G4 / O9: learner-facing cross-branch product policy.
- G5: C6–C9 reconciliation and versioned handoff.
- G6–G11: identity, consumer, persistence, security, recovery and test design.

**Next concrete action:** continue the G5 crosswalk from the six-part identity and immutable snapshot envelope. The preliminary crosswalk in Section 7 is not a gate closure: O6 still blocks final assessment-input semantics. Continue G6/G7 read-only inventories in parallel. O9 is needed before any learner-facing cross-branch projection is designed or shipped.

B1-L08 remains blocked until the approved contract supports its target-specific evidence end to end. Existing B1-L01–L07 remain unchanged.

## 6. Explicit non-claims

- This matrix does not establish that PacoGO is scientifically validated.
- A green Full Regression verifies the tested software contracts on a specific tree; it does not validate learning claims, C3 reliability, mastery decisions, next-action quality, transfer or retention.
- A completed design gate is not itself implementation approval unless G12 records the explicit authorization.
- No Supabase migration is presumed necessary. It is justified only by an approved persistence/runtime contract change.
- No undocumented owner, scientific reviewer or product reviewer approval is implied by this matrix.


## 7. G5 preliminary C6–C9 contract crosswalk — 2026-11-07

**Status: preliminary reconciliation only; G5 remains OPEN and implementation is NOT authorized.**

The source-by-source comparison of C6 v0.1, C7 v0.2, C8 v0.2, C9 v0.2 and the Operational Assessment Contract establishes the following cross-stage requirements and gaps.

### 7.1 Canonical branch identity

The same six explicit fields must be carried unchanged by every canonical stage:

1. `learner_key`
2. `curriculum_registry_version_id`
3. `claim_id`
4. `development_id`
5. `scope_id`
6. `time_window_id`

C8 v0.2 and C9 v0.2 explicitly require this identity. The current C6 v0.1 protocol describes claim/development/scope/time-bounded mastery but does not define the complete six-field serialized input/output envelope. C7 v0.2 consumes a C6 result but does not itself define the complete six-field identity envelope. The runtime adapter currently selects `mastery_state_by_claim[claim_id]`; this is not branch-safe when more than one branch shares a claim.

**Required reconciliation:** C6 output and C7 input/output must carry and validate all six fields. Claim ID may remain a domain field, but it cannot be the unique branch key.

### 7.2 Immutable decision snapshot and exact handoff

The canonical lineage must be:

```text
one six-part branch
  → one immutable decision_snapshot_id
  → one C6 evaluation_id
  → one C7 decision_id referencing that exact C6 evaluation
  → one C8 history item referencing snapshot + C6 + C7
  → one C9 validation result for that exact chain
```

C8 v0.2 and C9 v0.2 explicitly describe the snapshot and downstream references. The C6 v0.1 and C7 v0.2 protocols do not yet define the complete shared snapshot envelope or the exact identifier/reference constraints at every handoff.

The snapshot envelope must preserve, at minimum:
- six-part branch identity;
- scope definition ID/version;
- time-window definition ID/version;
- event-time start/end with start-inclusive/end-exclusive semantics;
- assessment-availability cutoff;
- exact eligible raw observation IDs;
- exact eligible target-assessment record IDs and their applicable contract/schema versions;
- exclusions with explicit reasons;
- registry, C3, C6 and C7 protocol/version provenance as applicable.

O5 supplies the approved minimum time-window semantics. O6 still determines the target-assessment vocabulary and the exact assessment-version fields; this crosswalk does not invent them.

### 7.3 Stage responsibilities and non-overlapping authority

| Stage | Owns | Must not do |
|---|---|---|
| C6 | Evaluate its seven existing gates for exactly one frozen branch snapshot; return exact gate trace and branch/snapshot lineage | Re-key by claim alone; infer missing branch fields; mutate curriculum or learner state |
| C7 | Consume one validated C6 evaluation; preserve its branch and snapshot lineage; select only among explicitly supplied candidate actions under existing C7 policy | Recompute mastery; substitute a different C6 result; infer ordering or mutate runtime state |
| C8 | Preserve exact C6/C7 decisions as append-only descriptive history for one branch; optionally expose a separately typed descriptive cross-branch projection | Pool evidence; recompute mastery/action; erase branch identity or imply transfer/progress |
| C9 | Validate structural identity, references, versions, eligibility and negative permissions for each branch independently | Repair data; infer missing lineage; create mastery/action; claim scientific validity |

### 7.4 O5 integration

The approved minimum O5 policy is applied consistently:
- scope is explicit and selected from existing curriculum definitions;
- each window has an explicitly configured, versioned start and end;
- event-time membership uses a half-open interval;
- event time and assessment-availability time remain distinct;
- each immutable snapshot records its assessment-availability cutoff;
- late-arriving information may enter only a new snapshot/evaluation;
- timestamps are canonical UTC instants;
- no universal window duration, automatic rolling window, grace period or finalization state machine is assumed.

The exact scope/window definition references and snapshot cutoff must be identical at the C6, C7, C8 and C9 lineage boundaries.

### 7.5 Compatibility and unresolved items

- C6/C7 v0.1/v0.2 documents remain candidate protocols; C8/C9 v0.2 remain proposals not approved for implementation.
- Existing C6–C9 code is not made compliant by this document. In particular, the claim-keyed C6 result map and claim-only C7 lookup remain known runtime gaps.
- O6/G2 remains open, so the exact C3 target-assessment payload and its canonical version/provenance fields cannot yet be finalized.
- O9/G4 remains open for the optional learner-facing cross-branch projection. The internal single-branch branch/snapshot lineage can be specified independently; no learner-facing comparison design is approved here.
- G6/G7 identity and consumer compatibility work remains necessary before any runtime adapter transition.
- No canonical branch hash/serialization is selected. The six inspectable fields remain authoritative.
- No physical schema, persistence API, Supabase change, runtime fan-out or test modification is authorized.

### 7.6 G5 exit criteria

G5 can close only after:
1. C6 and C7 contracts explicitly carry the six-part branch identity and exact snapshot/evaluation lineage;
2. C8/C9 fields and references are reconciled to the same canonical envelope;
3. O6 supplies the approved target-assessment input/version semantics;
4. legacy and mismatch/rejection behavior is consistent across all four stages;
5. negative permissions are explicit and consistent;
6. all cross-stage contract examples and test vectors are agreed.

A preliminary crosswalk is not implementation authorization and does not close G5.
