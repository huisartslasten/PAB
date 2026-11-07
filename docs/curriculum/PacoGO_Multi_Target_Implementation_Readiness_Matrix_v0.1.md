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

**Next concrete action:** complete the direct/indirect consumer inventory and assign each consumer a read/write/derived/legacy disposition. Then reconcile the examples in Section 7.12 with the C6–C9 protocol owners. O6 still blocks final C3 assessment-input semantics; O9 is needed before learner-facing cross-branch projection is designed or shipped.

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


### 7.7 C6 → C7 minimum handoff envelope

**Status: logical contract crosswalk; canonical serialization and runtime implementation remain unapproved.**

The C6 result and C7 input must be bound to one exact evaluation of one immutable snapshot. The minimum logical envelope is:

| Element | C6 evaluation must provide | C7 must do |
|---|---|---|
| Branch identity | All six canonical fields: `learner_key`, `curriculum_registry_version_id`, `claim_id`, `development_id`, `scope_id`, `time_window_id` | Preserve all six values unchanged in its input trace and decision output |
| Snapshot reference | Exact `decision_snapshot_id` evaluated by C6 | Reference that same snapshot; never select a replacement or newer snapshot |
| Evaluation reference | Unique `c6_evaluation_id` | Reference that exact evaluation as the sole source of mastery state |
| Mastery result | Exactly one of the five C6 outcomes: `MASTERED`, `NOT YET MASTERED`, `INSUFFICIENT EVIDENCE`, `CONTRADICTORY`, `NOT ASSESSED` | Consume unchanged; never reconstruct it from scores, gates or observations |
| Gate trace | Results and explicit reasons for the seven existing C6 gates, with C6 protocol provenance | Preserve the evaluation reference and trace provenance; do not reinterpret or rerun C6 |
| Snapshot provenance | Scope/window definition references and versions, event-time bounds, availability cutoff, eligible source references and exclusions from the frozen snapshot | Retain the same snapshot lineage; do not widen eligibility or add late-arriving material |
| Protocol provenance | C6 protocol version and applicable registry provenance | Record the C6 version used and the C7 protocol/action-policy versions used for its own decision |

The six identity fields and snapshot/evaluation references are required logical fields, not a decision to use a particular JSON shape, database key, branch hash or physical schema. The exact C3 target-assessment vocabulary and assessment-version fields remain governed by O6 and are deliberately not specified here.

C7 also requires its own explicit inputs, separate from the C6 result:
- `prerequisite_ordering_state`;
- `next_development_ordering_state`;
- the explicitly available candidate-action set;
- the applicable C7 action-policy version.

These ordering states are passed as separate information. C6 does not derive them, and neither state may be silently substituted for the other.

### 7.8 C6 → C7 rejection rules

The handoff is rejected as invalid or unavailable for decision when any of the following applies:

| Condition | Required disposition |
|---|---|
| Any of the six branch identity fields is absent | Reject; do not infer it from claim, task, learner session or another record |
| Any branch identity field differs between snapshot, C6 evaluation and C7 request | Reject the handoff; do not merge or repair identities |
| Snapshot ID differs between the C6 evaluation and C7 request | Reject; C7 must not consume an evaluation from another snapshot |
| Scope/window definition reference, version, event-time boundary or availability cutoff does not match the referenced frozen snapshot | Reject the lineage as inconsistent |
| C6 evaluation reference is missing, ambiguous or does not resolve to exactly one evaluation | Reject; do not choose the latest or first matching result |
| C6 evaluation is not linked to the exact referenced snapshot and six-part branch | Reject; claim equality is not sufficient |
| C6 mastery outcome is absent or outside the five defined C6 outcomes | Reject as an invalid C6 result; C7 must not reconstruct a replacement |
| Required C6 gate trace or protocol provenance is absent | Reject as an incomplete handoff; do not infer gate results |
| A claim-keyed lookup returns more than one possible branch result, or cannot prove the full six-field identity and snapshot | Reject; claim-only selection is not a valid branch resolver |
| A newer or late-arriving assessment exists after the snapshot cutoff | Exclude it from this evaluation; it may be considered only through a new immutable snapshot and new C6 evaluation |
| C7 ordering state or candidate-action set is missing/ambiguous | Apply the existing C7 uncertainty/hold boundary; do not invent ordering or candidate actions |
| A proposed C7 action is not in the explicitly supplied candidate set or violates an existing C7 gate | Do not emit that action; use only a permitted candidate or the existing hold outcome |

A rejected handoff is not a learner failure and does not change mastery. It is a decision-chain integrity failure or an unavailable decision input. It must remain inspectable and must not be silently converted to `NOT YET MASTERED`, `CONTRADICTORY` or another learner-state outcome.

### 7.9 C6/C7 decision trace boundary

For each accepted C7 decision, the trace must make it possible to follow:

`six-part branch → decision_snapshot_id → c6_evaluation_id → decision_id`

The C7 decision must retain the exact C6 evaluation reference, the unchanged branch identity, the snapshot reference, the C6 mastery outcome, the two separate ordering inputs, the candidate set, the selected candidate/hold outcome, the applicable C7 gates and the protocol/policy versions. This is a logical trace requirement, not a physical field-name or schema approval.

C7 remains a candidate-action selector only. It does not mutate learner state, write mastery, promote the registry, or authorize automatic progression.


### 7.10 C8 history and C9 validation crosswalk

**Status: source reconciliation; C8/C9 remain proposals requiring owner review.**

C8 consumes committed decisions. It does not create or repair them. A canonical C8 history item must preserve, without reinterpretation:

- a unique history-item identity;
- the exact six-part branch identity;
- the immutable `decision_snapshot_id`;
- the exact `c6_evaluation_id` and `c7_decision_id`;
- the validated evaluation timestamp;
- the snapshot event-time boundaries and assessment-availability cutoff;
- the unique source-observation references and exact target-assessment record/version references admitted by that snapshot;
- the exact C6 mastery outcome and exact C7 action/hold outcome;
- the applicable registry, assessment, C6, C7 and C8 contract/version provenance;
- explicit status/reason references for exclusions, corrections or supersession where applicable.

C8 ordering is based on validated evaluation time, with a stable identity tie-breaker; caller array order is not authoritative. A new snapshot/evaluation creates a new history item. It never rewrites an earlier item. A canonical branch history contains one exact six-part identity only. Empty history may be represented as `NOT ASSESSED` without implying evidence of absence.

The exact C3 assessment-state vocabulary and assessment-version fields remain unresolved under O6. C8 may preserve those source references and versions but must not invent or normalize their categories. C8's optional cross-branch projection is a separate descriptive product and remains blocked by O9; it cannot pool evidence or create a combined mastery/action result.

C9 validates each supplied branch independently. Its minimum structural checks must cover:

1. all six identity fields are present, resolvable and identical across snapshot, C6, C7 and C8;
2. the registry version resolves the claim/development/target relationship;
3. each included target-assessment record points to the exact source observation and is eligible under the snapshot's scope, event-time interval and availability cutoff;
4. the frozen snapshot lists exact eligible observations and target-assessment records/versions, with explicit exclusions;
5. C6 references the exact snapshot and branch;
6. C7 references the exact C6 evaluation and preserves its branch;
7. C8 references that same snapshot/C6/C7 chain and contains no foreign branch item;
8. shared observations retain one source identity and are not duplicated to satisfy target cardinality;
9. legacy/unscoped records remain outside canonical branch validation unless a separately approved adapter supplies traceable provenance;
10. no stage silently repairs missing or conflicting lineage.

C9 output must be traceable per full six-field branch, with explicit checks, source references and stage-attributed errors. A multi-branch request returns independent per-branch validation results and may report shared observation references; it must never return pooled mastery or next-action state. C9 validates structure and permissions only, not scientific validity or educational outcomes.

### 7.11 Cross-stage disposition and remaining G5 closure

The combined C6→C7→C8→C9 lineage is now logically aligned around:

`six-part branch → immutable snapshot → exact C6 evaluation → exact C7 decision → one-branch C8 history item → per-branch C9 structural result`

Still required before G5 can close:
- reconcile and approve the C6/C7/C8/C9 candidate protocol versions as one consistent contract set;
- resolve O6 target-assessment inputs and version/provenance semantics;
- agree cross-stage positive, negative, missing and mismatch examples/test vectors;
- finish the legacy/scalar compatibility disposition with G6/G7;
- confirm all negative permissions and references consistently across the four stages.

O9 remains necessary only for learner-facing cross-branch presentation, not for this internal single-branch lineage. No C8 cross-branch projection is approved by this crosswalk.


### 7.12 Cross-stage G5 contract examples — illustrative, not implementation fixtures

These examples use symbolic IDs only. They demonstrate the agreed lineage and existing C6/C7 distinctions; they do not define a JSON payload, database schema, C3 assessment vocabulary or new decision policy.

Let one branch be:

`B = (learner=L1, registry=R1, claim=C1, development=D1, scope=S1, window=W1)`

#### Positive example P1 — one coherent branch

1. Snapshot `SN1` declares exactly branch `B`, the approved scope/window definition versions, event-time interval, availability cutoff, eligible raw-observation IDs, eligible target-assessment record/version references and explicit exclusions.
2. C6 evaluation `E1` references exactly `SN1` and `B`, records the existing seven-gate trace and returns one existing C6 outcome.
3. C7 decision `D7-1` references exactly `E1`, `SN1` and `B`; carries `prerequisite_ordering_state` and `next_development_ordering_state` separately; and chooses only from the explicit candidate set under the named C7 action-policy version.
4. Example permitted route: when C6 is `MASTERED`, prerequisite ordering is `SUPPORTED`, next-development ordering is `SUPPORTED`, and the explicit policy/candidate set permit it, C7 may select `ASSESS_NEXT_DEVELOPMENT` or `PRACTICE_NEXT_DEVELOPMENT`. The selected action is the policy result, not a universal default.
5. C8 item `H1` references exactly `SN1`, `E1`, `D7-1` and `B`, preserving the exact outcomes, timestamp and provenance. It appends; it does not rewrite older history.
6. C9 validates the same chain and returns one structural result for `B`.

Expected disposition: **valid single-branch lineage**, assuming all referenced records resolve and all existing gates pass.

#### Positive example P2 — prerequisite uncertainty is isolated

For the same branch, C6 is `MASTERED`; `prerequisite_ordering_state=NOT_ASSESSED`; `next_development_ordering_state=UNCERTAIN`. If `ASSESS_PREREQUISITE_DEVELOPMENT` is explicitly available and permitted by the applicable C7 policy, that candidate may be selected. The uncertainty about next-development ordering is not substituted for prerequisite ordering and does not by itself invalidate the prerequisite candidate.

Expected disposition: **candidate-specific C7 evaluation**, not a generic merged ordering state.

#### Negative examples

| ID | Deliberate defect | Required result |
|---|---|---|
| N1 | Snapshot is `B`, but C6 evaluation changes only `time_window_id` to `W2` | Reject branch lineage; do not repair or select by claim ID |
| N2 | Two C6 results share `claim_id=C1` but belong to different scopes/windows; C7 receives only the claim key | Reject as ambiguous; no “latest” or first-match selection |
| N3 | C7 references `E1` but supplies another snapshot or branch identity | Reject C7 handoff |
| N4 | C6 returns `INSUFFICIENT EVIDENCE`, while C7 proposes a next-development action | Do not advance; apply the existing C7 HOLD boundary |
| N5 | C7 ordering fields are collapsed into one `ordering_state` | Reject the input contract; the two domains must remain separate |
| N6 | C8 item references `SN1/E1` but a different C7 decision ID | Reject history lineage; do not create a corrected synthetic item |
| N7 | C9 receives a four-field legacy record and current registry/window values are available | Keep it legacy/unscoped; do not infer missing canonical identity |
| N8 | Assessment becomes available after `SN1` cutoff | Exclude it from `SN1/E1`; a later snapshot/evaluation is required to include it |
| N9 | Same raw observation is copied into two raw-observation IDs to represent two targets | Reject duplicate raw cardinality; preserve one source observation with separate target-assessment references |
| N10 | C8 collection contains an item from another six-part branch | Reject the mixed single-branch history; do not pool states |

#### Missing-input examples

- Missing any one of the six branch fields: canonical branch is incomplete; reject canonical evaluation.
- Missing snapshot ID or its immutable eligibility/cutoff envelope: C6 cannot be treated as an evaluation of a canonical frozen snapshot.
- Missing or ambiguous C6 evaluation ID: C7 cannot choose a C6 result.
- Missing C6 gate trace/protocol provenance: reject the incomplete handoff.
- Missing either C7 ordering domain: apply the existing C7 uncertainty/hold boundary; do not infer it from the other field.
- Missing explicit candidate set or action-policy version: C7 cannot emit a candidate action.
- Missing exact C6/C7 references in C8: no canonical history item.
- Missing source/provenance references in C9: return structural failure with stage attribution; do not repair.

O6-specific target-assessment states and version fields remain intentionally symbolic. These examples do not close O6 or authorize test/runtime changes.

### 7.13 Legacy/scalar compatibility disposition — proposed boundary

The source contracts and current runtime inventory support a strict separation between historical/legacy state and canonical six-part branches:

1. Existing claim-keyed C6 maps, four-field C8/C9 records, skill-scoped evidence/state and lesson/item local mastery remain readable only under their original contract and ownership boundaries.
2. A legacy record may expose only fields actually present. Missing registry, scope/window, snapshot, evaluation or decision provenance remains explicitly unknown/legacy.
3. No field is inferred from the current registry, current scope/window policy, current task metadata, timestamps, learner session or a matching claim.
4. Legacy values cannot overwrite canonical C6/C7/C8 state, satisfy canonical branch validation, or be pooled with canonical evidence.
5. A future compatibility adapter, if approved, must be explicit, versioned, traceable and non-destructive. It may preserve/read legacy history but cannot promote it to a canonical branch without separately traceable source provenance and a new approved snapshot/evaluation.
6. Existing persisted B1–B5 skill-scoped flows and the current Supabase RPC remain unchanged until a separate migration/compatibility design is approved.
7. The local lesson/item `mastery-service` remains a separate progress mechanism; it is not an alias for C6 mastery.

This is a proposed compatibility boundary, not selection of a canonical adapter, migration, backfill, persistence schema or implementation plan. G7 remains OPEN until every direct and indirect consumer has been enumerated and assigned an owner/read/write/derived/legacy disposition.


### 7.6 G5 exit criteria

G5 can close only after:
1. C6 and C7 contracts explicitly carry the six-part branch identity and exact snapshot/evaluation lineage;
2. C8/C9 fields and references are reconciled to the same canonical envelope;
3. O6 supplies the approved target-assessment input/version semantics;
4. legacy and mismatch/rejection behavior is consistent across all four stages;
5. negative permissions are explicit and consistent;
6. all cross-stage contract examples and test vectors are agreed.

A preliminary crosswalk is not implementation authorization and does not close G5.

## 8. G6/G7 read-only runtime inventory — 2026-11-07

**Status: initial source inventory; G6 and G7 remain OPEN. No runtime change is authorized.**

The following files were inspected on the current branch. This inventory records observed behavior, not a target design or permission to patch individual modules.

| Area | Current source | Verified current behavior | Contract gap / disposition |
|---|---|---|---|
| Task definition and attempt identity | `pacogo-engine/interaction-contract.js` | `createTaskInstance` sets `task_instance_id` equal to `taskId`; the stable catalogue task ID is therefore reused as the instance ID. | G6 remains open: task definition/version and each administered attempt need distinct identities and an explicit lifecycle. Do not change the ID format until replay/retry and consumer compatibility are reconciled. |
| Raw observation identity/cardinality | `pacogo-engine/interaction-contract.js` | Observation ID is derived from task-instance ID plus observed timestamp; `task_id` is populated from the task-instance ID; only `evidence_target_ids[0]` is projected into scalar `evidence_target_id`. | G6/G8 gap: one raw episode and target-specific assessments are not yet represented by the complete canonical contract. Preserve the raw episode once; do not fan out by duplicating observations or silently selecting a primary target. |
| Browser task binding | `pacogo-engine/browser-vertical-slice.js`, `browser-vertical-slice.test.js` | The runtime resolves a task and checks that observation `skill_id` matches the task's `skill_id`, then delegates to `registry.runSkillCycle`. | This is a useful task-to-skill guard, not full task/attempt/target/claim/development/registry/branch validation. |
| C6 result model | `pacogo-engine/c6-mastery-decision.js`, `c6-mastery-decision.test.js` | C6 validates seven gates and returns five mastery outcomes, but stores results in `mastery_state_by_claim`. The result includes claim, development, scope and time-window fields, gate states, coverage and evidence count. | G5/G7 gap: no learner key, registry-version identity, snapshot ID or evaluation ID; claim is the result-map key. The existing seven gates and five outcomes remain unchanged. |
| C6→C7 adapter paths | `pacogo-engine/c6-c7-adapter.js`, `pacogo-engine/c7-from-c6.js` and their tests | Two separate adapter implementations select C6 results by `claim_id`, check safety flags and pass the mastery result plus separate prerequisite/next ordering inputs. Their validation details differ; neither carries the full six-field branch or exact snapshot/evaluation lineage. | G5/G7 gap: duplicate adapter paths have no approved canonical ownership/disposition. Do not patch one path in isolation or change tests to bless a new envelope before G5/G6/G7 contracts are complete. |
| C7 decision output | `pacogo-engine/c7-next-action-decision.js` and tests | C7 emits candidate action, reason, gate, claim/development and supporting evidence IDs with negative permission flags. | Output does not carry the exact C6 evaluation ID, snapshot ID or six-field identity. C7 remains a candidate-action selector; no runtime state mutation is authorized. |
| C8 adapter/history | `pacogo-engine/c8-c9-adapter.js`, `c8-student-model.js` and tests | Adapter can normalize a claim-keyed C6 result, checks claim/development alignment with C7, creates an observation ID from a timestamp, and derives a simplified evidence state from evidence count. C8 parent/history identity is learner, claim, development and scope; temporal order uses observed time. | G5/G7 gap: no registry version, time-window identity, immutable snapshot, exact C6 evaluation or exact C7 decision reference. The evidence-state shortcut is not an approved O6 assessment rule. C8 is not yet the canonical six-part append-only decision history. |
| C9 validator | `pacogo-engine/c9-vertical-validation.js`, `c8-c9-adapter.js` and tests | Validator checks a structural vertical slice using learner, claim, development and scope; it checks basic task/evidence links and C6/C7/C8 state agreement. | G5/G7 gap: it does not validate registry-version/time-window identity, snapshot eligibility/cutoff or exact C6→C7→C8 references. Its current passing tests establish only the narrower four-field prototype contract. |
| Skill-centric legacy engine | `pacogo-engine/prototype.js`, `curriculum-registry.js`, `longitudinal-state.js` | Browser execution delegates to a skill-level cycle using configured relevance/quality/contradiction rules, a mastery rule and skill-level next-task selection. | This is a separate older execution path, not the C6–C9 branch engine. Do not silently treat its skill-level state as canonical branch mastery or next action. |
| Evidence store | `pacogo-engine/student-evidence-store.js` | In-memory append/list records are keyed by learner, curriculum registry version and skill. | No six-part branch partition, snapshot, target-assessment record or immutable decision history is represented. |
| Separate local mastery service | `src/services/mastery-service.js`, `test/mastery-service.test.js` | Local-storage streak state is keyed by learner, lesson and item; three consecutive correct answers set its local `mastered` flag. | This is a separate lesson/item progress mechanism, not C6 mastery. Its consumers and coexistence/compatibility boundary must be inventoried before any learner-state migration. |


### 8.3 Application consumer map — focused page/service inspection

The following application paths were inspected in addition to the engine modules:

| Consumer | Observed path | Current ownership classification | Compatibility consequence |
|---|---|---|---|
| A1 Number Line and B1 Addition browser demonstrations | `curriculum-a1-numberline.html`, `curriculum-b1-addition.html` | Browser page → shared browser vertical-slice guard → skill-centric curriculum registry cycle | These pages do not call the C6–C9 modules. Their current execution is a prototype/skill cycle, not canonical six-part branch execution. |
| FR2 Fraction browser demonstrations | `curriculum-fr2-fraction-equivalence.html`, `curriculum-fr2-fractions.html`, `curriculum-fr2-representation-transfer.html`, `curriculum-fr2-surface-countertask.html`, `curriculum-fr2-language-reduced-transfer.html` | Same browser vertical-slice → skill-centric registry path | These are technical interface/evidence demonstrations. They do not call the C6–C9 modules or establish a canonical branch history. |
| Additional B1/B-family demonstrations | `curriculum-b1-memorization-countertask.html`, `curriculum-b1-prompted-independent.html`, `curriculum-b1-strategy-variation.html`, `curriculum-b1-symbolic-addition.html` | Browser vertical-slice → skill-centric registry path | Preserve as existing demonstrations; no silent migration to the new branch contract. |
| Persisted learner curriculum pages | `curriculum-b1-learner.html`, `curriculum-b2-learner.html`, `curriculum-b3-learner.html`, `curriculum-b4-learner.html`, `curriculum-b5-learner.html` | Load and persist through `app.learnerCurriculum` using learner + registry-version + skill scope | These are active skill-scoped persistence consumers. Any future compatibility plan must preserve their existing read/write behavior until an explicit migration is approved. |
| Learner curriculum service | `src/services/learner-curriculum-service.js` | Supabase read/write service for `student_evidence` and `student_longitudinal_state`; persistence RPC is `persist_curriculum_learning_cycle` | Existing persistence is keyed by learner, registry version and skill. Its payload contains development/claim/target/task and observation/assessment data but not the six-part snapshot/evaluation lineage. Do not change its schema or RPC as part of this inventory. |
| App bootstrap | `src/app/bootstrap.js` | Constructs and exposes both `learnerCurriculum` and a separate local `mastery` service | Service exposure is confirmed. Direct call sites for the local `mastery` service have not yet been exhaustively enumerated. |
| Clock demonstrations | `curriculum-clock-controller-interface.html`, `curriculum-clock-interface.html` | Separate reusable interface/controller demonstrations | They are not connected to the registered C6–C9 branch chain and remain interface prototypes. |

### 8.4 Consumer disposition and limits of this inspection

- The inspected A1/B1/FR2 browser pages use the skill-centric runtime and do not import the C6→C7 or C8→C9 adapters.
- The inspected persisted B1/B2/B3/B4/B5 learner pages read and write through the skill-scoped learner curriculum service. They are not yet six-part branch consumers.
- The current Supabase persistence service is an existing compatibility boundary, not permission to add a migration or replace its RPC.
- The separate local `mastery` service is constructed by app bootstrap; its complete call-site inventory remains open.
- This is a focused inventory of the named curriculum pages and service paths, not a complete repository-wide import graph. Other routes, dynamic imports and indirect consumers still need checking before G7 can close.
- Do not delete legacy skills or learner routes, silently redirect them, or reinterpret their skill-level state as canonical C6 mastery.


### 8.1 Test coverage observed

The inspected tests currently verify:
- C6's seven-gate classification and five outcome states;
- C6 safety flags;
- claim-keyed C6→C7 selection, development alignment and separate ordering inputs;
- C7 candidate-action gates and negative permissions;
- C8 preservation of simplified mastery/action values;
- C9 consistency across the current four identity fields.

They do **not** yet verify:
- six-field branch isolation;
- registry-version and time-window mismatch rejection;
- exact immutable snapshot/evaluation linkage;
- C7 reference to the exact C6 evaluation;
- C8 history reference to exact snapshot/C6/C7 IDs;
- delayed assessment availability and frozen-snapshot immutability;
- task-definition versus administered-attempt identity;
- target fan-out without duplicating the raw observation;
- compatibility across all consumers of the two C6→C7 adapter paths.

These are inventory gaps, not instructions to add tests before the upstream contracts are approved.

### 8.2 G6/G7 disposition

- G6 remains OPEN: exact task-definition, administered-attempt, event, raw-observation, retry/replay and provenance contracts are not yet complete.
- G7 remains OPEN: the two C6→C7 adapters, C8/C9 adapter, skill-centric browser/runtime path, evidence store and separate local mastery service need a consumer-by-consumer ownership and compatibility disposition.
- No adapter is designated canonical yet.
- No scalar compatibility adapter, backfill, registry mapping change, schema change, learner-state migration or Supabase work is authorized.
- This is an initial inventory of the inspected sources, not a claim that every application consumer has been enumerated.
