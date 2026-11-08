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


### 8.3 Application consumer map — verified runtime call paths

The following application paths were inspected in addition to the engine modules:

| Consumer | Observed path | Current ownership classification | Compatibility consequence |
|---|---|---|---|
| A1 Number Line and B1 Addition browser demonstrations | `curriculum-a1-numberline.html`, `curriculum-b1-addition.html` | Browser page → shared browser vertical-slice guard → skill-centric curriculum registry cycle | These pages do not call the C6–C9 modules. Their current execution is a prototype/skill cycle, not canonical six-part branch execution. |
| FR2 Fraction browser demonstrations | `curriculum-fr2-fraction-equivalence.html`, `curriculum-fr2-fractions.html`, `curriculum-fr2-representation-transfer.html`, `curriculum-fr2-surface-countertask.html`, `curriculum-fr2-language-reduced-transfer.html` | Same browser vertical-slice → skill-centric registry path | These are technical interface/evidence demonstrations. They do not call the C6–C9 modules or establish a canonical branch history. |
| Additional B1/B-family demonstrations | `curriculum-b1-memorization-countertask.html`, `curriculum-b1-prompted-independent.html`, `curriculum-b1-strategy-variation.html`, `curriculum-b1-symbolic-addition.html` | Browser vertical-slice → skill-centric registry path | Preserve as existing demonstrations; no silent migration to the new branch contract. |
| Persisted learner curriculum pages | `curriculum-b1-learner.html`, `curriculum-b2-learner.html`, `curriculum-b3-learner.html`, `curriculum-b4-learner.html`, `curriculum-b5-learner.html` | Direct read/write consumers of `app.learnerCurriculum`: learner list/profile, registry version lookup, history load and learning-cycle persistence | These are active skill-scoped persistence consumers. Preserve existing behavior until a separately approved compatibility/migration design exists. |
| Learner curriculum service | `src/services/learner-curriculum-service.js` | Supabase reads from `learner_profiles`, `curriculum_registry_versions`, `student_evidence` and `student_longitudinal_state`; profile creation and learning-cycle persistence use existing RPCs | Persistence remains keyed by learner + registry version + skill. The payload contains development/claim/target/task and observation/assessment data, but not six-part snapshot/evaluation lineage. No schema or RPC change is authorized. |
| Local lesson/item mastery — active practice route | `src/features/practice/lesson-practice-runtime.js` → `createPracticePresentation` → `createPracticeRuntimeEntry` → `mastery.record`; service: `src/services/mastery-service.js` | Canonical localStorage write/read path for practice mode. `app.mastery` is passed into the presentation; each answered item calls `record(student, lessonId, itemId, correct)`. State is keyed by learner + lesson + item and stores a correct-answer streak and local `mastered` flag. | This is active lesson/item progress, separate from C6. It carries no registry version, development, claim, scope, time window, snapshot or C6 evaluation identity. It must not be reinterpreted as canonical curriculum mastery. |
| Shared practice orchestration | `src/features/lessons/practice-presentation.js`, `practice-runtime-entry.js` | Presentation forwards the optional service. Runtime entry imports `createMasteryService`, uses the injected service when supplied, otherwise constructs a localStorage-backed fallback. In mastery session mode with a learner and current item, it records each result. | The fallback is a second possible construction path. Current app practice route injects the bootstrap service; no additional in-repo active mastery-mode caller was found in the scanned source tree. Keep construction and ownership explicit in any later migration. |
| Toets and Oefentoets routes | `src/features/lessons/test-runtime.js`, `src/features/practice/practice-test-runtime.js` → shared practice presentation/runtime entry | Both set `practiceMode: 'assessment'`, which selects `single-pass`. They do not inject `app.mastery`; the runtime entry may construct its fallback service, but its `sessionMode === 'mastery'` guard prevents local streak writes. | These routes share presentation code but are not current local mastery writers. Preserve the distinction between practice and assessment behavior. |
| App bootstrap/runtime | `src/app/bootstrap.js`, `src/app/runtime.js`, `src/app/routes.js` | Bootstrap constructs/exposes `learnerCurriculum` and `mastery`; runtime passes the app object into registered route factories. The actual local mastery consumer is the lesson-practice route above. | Bootstrap exposure alone is not evidence of use; the indirect route is now traced. |
| Legacy wordtrainer seam | `src/features/wordtrainer/index.js` | Accepts an injected `recordResult` callback; contains no direct import or reference to `mastery-service`. No in-`src` caller linking this callback to the local mastery service was found. | Keep as an unresolved legacy callback boundary; do not assume it reads or writes the local mastery keyspace. |
| Clock demonstrations | `curriculum-clock-controller-interface.html`, `curriculum-clock-interface.html` | Separate reusable interface/controller demonstrations | They are not connected to the registered C6–C9 branch chain and remain interface prototypes. |

### 8.4 Consumer disposition and limits of this inspection

- A read-only scan covered all 351 JavaScript files under `src/` on commit `06f591ab8c227bdbe2ff1a0d7eb7fb5e0d903fe8`. The local mastery references resolve to bootstrap construction/exposure, the shared practice runtime entry, and the lesson-practice route that injects the service. No other direct local-service consumer was found in `src/`.
- The active local mastery write path is now traced end to end: learner practice page → presentation → runtime entry → `mastery.record` → localStorage. The assessment routes share the runtime but select `single-pass`, so the mastery-write guard is not entered.
- The five B1–B5 learner pages are direct read/write consumers of `app.learnerCurriculum`; their current service boundary remains learner + registry version + skill. They are not six-part branch consumers.
- The existing Supabase persistence service and RPC remain compatibility boundaries. No migration, schema change, RPC change or backfill is authorized.
- The legacy wordtrainer accepts a generic `recordResult` callback but has no direct local mastery-service import; the callback's external/legacy wiring is not established by this `src/` scan.
- This is a complete static scan of the current `src/` JavaScript tree plus the named root curriculum pages and inspected engine modules, not proof about external scripts, runtime-generated code or consumers outside the repository. G7 remains OPEN until those boundaries and each consumer's final ownership/compatibility disposition are reconciled.
- Do not delete legacy skills or learner routes, silently redirect them, or reinterpret skill-level or lesson/item state as canonical C6 mastery.


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


### 8.5 Non-`src/` consumer scan and callback disposition — 2026-11-07

Read-only inspection was extended to the repository's root-level HTML entrypoints and the relevant `pacogo-engine` modules. This supplements, but does not replace, the 351-file `src/` scan in Section 8.3.

| Consumer / seam | Verified source behavior | Disposition |
|---|---|---|
| A1, B1 and FR2 browser demonstrations | The root pages expose `cycle.mastery` from the skill-centric `curriculum-registry.js` / `prototype.js` cycle. | Separate prototype/skill-cycle result. It is not `app.mastery`, not localStorage lesson/item mastery, and not the canonical C6 mastery decision. |
| Additional B1 demonstration pages | The memorization-countertask, prompted-independent, strategy-variation and symbolic-addition pages also expose `cycle.mastery`. | Same skill-centric prototype boundary; no local mastery-service call was found. |
| B1–B5 learner pages | The five root learner pages call `app.learnerCurriculum` for learner profiles, history reads, registry-version lookup and learning-cycle persistence. | Existing learner + registry-version + skill persistence route. No six-part branch identity is implied; preserve the existing Supabase/RPC contract. |
| Other root-level HTML entrypoints | The repository's root HTML entrypoints were scanned for `mastery`, `learnerCurriculum`, `recordResult`, `studentEvidence` and related curriculum-runtime references. No additional direct call to the local mastery service or learner-curriculum service was found. | No additional direct non-`src/` consumer identified in the scanned HTML entrypoints. This does not establish absence of dynamically loaded or external consumers. |
| Skill-centric engine modules | `prototype.js` defines skill-cycle mastery inference; `curriculum-registry.js` invokes `runSkillCycle` and returns `cycle.mastery`; `longitudinal-state.js` consumes that skill-cycle result. | A distinct legacy/prototype engine path. Do not alias its result to C6–C9 or to the local lesson/item service. |
| In-memory evidence store | `student-evidence-store.js` maintains its own in-memory evidence records. | Separate evidence-store mechanism; no equivalence with localStorage mastery or Supabase learner history is established. |
| C6/C7 and C8/C9 adapter modules | The inspected adapters consume C6/C7-shaped inputs and emit downstream decision/history structures; they do not import or call the local `mastery-service`. | Keep as separate engine contract paths. Their canonical ownership and complete consumer disposition remain open under G5/G7; do not select or patch an adapter by inference. |
| Wordtrainer `recordResult` callback | `src/features/wordtrainer/index.js` accepts an optional callback and invokes it after evaluation when supplied. No in-repository caller wiring it to `app.mastery` or `learnerCurriculum` was found in the `src/` scan or root HTML scan. | Destination remains UNKNOWN / unresolved legacy seam. Do not assume it writes local mastery, curriculum evidence or learner history. External/dynamic wiring is not proven absent. |

**Scan boundary:** this establishes the observed repository call paths described above. It does not prove the absence of external consumers, runtime-generated imports, deployment-side scripts or integrations not represented in the inspected repository tree.

**G7 disposition:** the known in-repository direct consumers now have explicit ownership classifications. G7 remains OPEN until the remaining adapter/history/report/export consumers and any external/dynamic callback wiring have an explicit disposition, and until the G5/G6 contracts they depend on are reconciled. No adapter, migration or canonical write path is approved by this inventory.

## 8.6 Adapter, history, report and export consumer disposition — 2026-11-07

A focused read-only inspection of the adapter modules, their direct test imports, the pilot analysis/export modules, and the existing test-history service establishes the following distinctions:

| Path | Verified consumer/use | Ownership and compatibility disposition |
|---|---|---|
| `c6-c7-adapter.js` | Directly imported by `c6-c7-adapter.test.js`; no learner-page or application-runtime import was identified in the inspected paths. | Contract/test path only in the inspected surface. It is not an active learner write path. Do not designate it canonical by presence alone. |
| `c7-from-c6.js` | Imported by `c7-from-c6.test.js`, `c6-c7-vertical-slice.test.js` and `c8-c9-real-vertical-slice.test.js`. | Test-driven prototype adapter path. Its duplicate relationship to `c6-c7-adapter.js` remains unresolved under G5/G6; neither adapter is selected as canonical. |
| `c8-c9-adapter.js` | Imported by its adapter/vertical-slice tests; it normalizes C6/C7-shaped inputs into the simplified C8 history and C9 validation path. | Prototype validation/history bridge, not an identified persisted learner-history route. Its four-field identity and timestamp-derived observation remain insufficient for canonical branch history. |
| `curriculum-registry.js`, `prototype.js`, `longitudinal-state.js` | The registry calls the skill-centric prototype cycle and derives a longitudinal state/decision trace. The previously inventoried A1/B1/FR2 and B-family demonstrations expose this separate cycle result. | Legacy/prototype skill-centric route. Keep distinct from local lesson/item mastery, Supabase learner curriculum history and canonical C6–C9 decisions. No automatic promotion or migration. |
| `student-evidence-store.js` | In-memory append/list helper keyed by learner, registry version and skill; no persistent write or canonical branch identity. No active learner-page consumer was identified in the inspected paths. | Isolated in-memory prototype store. Not a substitute for Supabase learner history or canonical append-only branch history. |
| `pilot-analysis-report.js` and `empirical-pilot-analysis-pipeline.js` | The analysis pipeline calls the report builder to create a descriptive-only report. The pipeline's identified direct invocation is its Node test; no learner-facing route was identified in the inspected application paths. | Research/analysis output, not an operational learner progress or mastery consumer. Its explicit no-mastery/no-promotion boundaries remain in force. |
| `empirical-pilot-execution.js` and `pilot-execution-package.js` | Build validated pilot execution snapshots/packages/exports; their identified direct invocations are tests. | Research execution/export utilities, separate from learner runtime persistence. Exported data must retain its synthetic/empirical provenance and must not be treated as learner-state writes. |
| `src/services/test-history-service.js` and `src/features/test-history/*` | The test-history route reads `test_attempts` and associated answers for display. | Separate assessment-attempt history. It is not curriculum evidence, longitudinal C8 history or C6 mastery. Its existing contract remains unchanged. |
| External or dynamically supplied consumers | Repository inspection cannot establish whether deployment-side scripts, browser extensions, external integrations or runtime-generated callback wiring exist outside the checked-out source. The Wordtrainer `recordResult` destination remains unverified. | Explicitly UNKNOWN / not approved. Do not infer a destination or migrate/write through it. Any such integration must be disclosed and separately mapped before G7 can close. |

### G7 disposition after focused inspection

The inspected in-repository surfaces now distinguish:
- active local lesson/item mastery writes through the practice runtime;
- active Supabase skill-scoped learner curriculum reads/writes on B1–B5 learner pages;
- skill-centric browser prototype cycle results;
- in-memory evidence storage;
- C6–C9 adapter/validation test paths;
- research-only analysis and execution/export utilities;
- separate test-attempt history reads.

This narrows the remaining G7 gap, but does **not** close it. The external/dynamic callback boundary is still unknown, and the adapter/history/report/export inventory has not been proven against every possible deployment-side or runtime-generated consumer. G7 remains OPEN. G5 and G6 remain OPEN; no canonical adapter, migration, persistence change or runtime write path is authorized.

No runtime code, tests, curriculum registry/catalogue, database schema, SQL/RPC/RLS, Supabase or learner data changed.

## 8.7 G5 proposed-envelope to executable-contract crosswalk — 2026-11-07

This is a read-only field/lineage comparison of the current C6–C9 executable modules against the proposed six-part snapshot/history contracts in C7 v0.2, C8 v0.2 and C9 v0.2. It identifies mismatches; it does not select a new payload or authorize implementation.

| Contract element | Current executable shape | Proposed forward contract | Classification |
|---|---|---|---|
| Learner identity | C6/C7 carry no learner identity. C8/C9 use `learner_id`. | Canonical branch uses `learner_key`. | Missing upstream; naming/identity mismatch downstream. |
| Registry identity | No registry-version identity in current C6/C7/C8/C9 decision envelope. | `curriculum_registry_version_id` is a required branch field and exact registry reference. | Missing. |
| Claim | C6 returns `mastery_state_by_claim`; C7 selects by `claim_id`; C8/C9 carry `claim_id`. | Claim is one of six explicit branch fields, never a unique branch key by itself. | Present but unsafe shape: claim-keyed selection is ambiguous across scopes/windows/registries. |
| Development | C6 returns `development_id`; C7 uses `current_development_id`; C8/C9 use `development_id`. | One explicit `development_id` in the six-part branch, identical at every stage. | Concept present; naming and propagation differ. |
| Scope | C6 returns `scope_id`; C7 input/output omits it; C8/C9 use it. | Required six-part branch field preserved through C6, C7, C8 and C9. | Missing at C7 handoff. |
| Time window | C6 accepts/returns `time_window_id`; C7/C8/C9 executable envelopes omit it. | Required six-part branch field with immutable versioned definition. | Present only at C6; not propagated. |
| Snapshot | Current C6–C9 executable path has no immutable decision-snapshot identity or eligibility/cutoff envelope. | Exact `decision_snapshot_id`, eligible observation/assessment references, event-time interval and assessment-availability cutoff. | Missing. |
| C6 evaluation | C6 returns a claim-keyed result map with gate states, coverage and evidence count; no stable evaluation ID or exact snapshot reference. | C6 evaluation has stable identity, exact branch/snapshot, protocol/version provenance and gate trace. | Missing lineage and identity. |
| C7 decision | C7 returns claim/development, action, reason, gate and evidence references; no stable decision ID or exact C6 evaluation/snapshot reference. | C7 preserves the exact six-part branch, snapshot and C6 evaluation identity. | Missing lineage and identity. |
| C8 history item | Adapter builds `observation_id = OBS-${observed_at}`; C8 history uses four-field parent identity and timestamp ordering. | Stable `c8_item_id`, exact branch, snapshot, C6 evaluation and C7 decision references; deterministic evaluation-time ordering. | Shape and semantic mismatch. |
| Source evidence lineage | C6 receives evidence IDs/count; current C8/C9 prototype does not preserve exact raw-observation plus target-assessment record/version sets in a frozen snapshot. | Separate immutable raw-observation IDs and versioned target-assessment/coding references, without duplicating shared observations. | Missing snapshot-level provenance; O6 semantics still unresolved. |
| Evidence state | C8 adapter derives `SUFFICIENT` when C6 evidence count is greater than zero, otherwise `NOT_ASSESSED`. | Evidence/assessment status must be explicit and traceable to the approved C3/O6 contract and snapshot. | Semantically unresolved shortcut; do not treat count>0 as approved sufficiency. |
| C9 validation | Current validator checks learner/claim/development/scope identity and basic task/evidence/C6/C7/C8 consistency. | C9 v0.2 requires exact six-field identity, registry resolution, assessment provenance, snapshot eligibility and C6→C7→C8 lineage. | Material contract gap. |

### Crosswalk conclusions

1. The current C7 logic and C7 v0.2 protocol agree that prerequisite ordering and next-development ordering are separate, action-specific gates. The existing P2 example is consistent with the executable decision path when prerequisite assessment is explicitly authorized.
2. C6 v0.1 remains a candidate protocol. The executable C6 output is claim-keyed and does not yet implement the approved O8 snapshot envelope.
3. C7 v0.2 is a candidate protocol; the executable adapters do not preserve the proposed branch/snapshot/evaluation lineage.
4. C8/C9 v0.2 are owner-review proposals. Their six-part identity and immutable lineage are not present in the current four-field executable prototype.
5. O6 remains open. The exact target-assessment states, coding semantics and version provenance required by a frozen snapshot cannot be finalized from the current executable shortcut.

**Disposition:** G5 remains OPEN. G6 remains OPEN because task-definition, task-instance, attempt, event and observation identities still require a reconciled lifecycle contract. G7 remains OPEN for the external/dynamic consumer boundary recorded in Section 8.6. No runtime, tests, registry, schema, SQL/RPC/RLS, Supabase or learner data changed. No implementation is authorized.

## 8.8 G6 task, attempt, event and observation identity crosswalk — 2026-11-07

This is a read-only comparison of the current browser interaction path, the existing persistence boundary and the C2/C3/multi-target candidate contracts. It records mismatches without choosing a new identity hierarchy.

| Identity layer | Current executable/persistence behavior | Candidate contract expectation | Classification |
|---|---|---|---|
| Task definition | Controllers receive a registry task with `task_id`, `task_model_id` and other task fields. `task_definition_version` is hardcoded to `0.1`; no distinct task-definition ID is carried by the interaction contract. | C3 distinguishes versioned task definition ID/version from the administered instance and its actual presented content. | Definition identity/version is incomplete and partly hardcoded. |
| Task instance | `createTaskInstance` sets `task_instance_id = taskId`. The stable task ID is reused as the instance ID. | C2/C3 require an identifiable administered task instance, with actual presentation/provenance. | Definition and administration are conflated. |
| Task/instance linkage | `createObservation` writes `task_id = taskInstance.task_instance_id`; the original task-definition ID is not separately retained in that field. | The multi-target contract keeps `task_id`, task model and parent attempt identity distinct. | Identity field is overloaded. |
| Attempt / response episode | Controllers set `performance.attempts = 1` and prevent a second submission. No separate `task_attempt_id` is generated. | The multi-target contract proposes one stable task-attempt identity for one learner interaction episode. C3 describes ordered attempts/events within an episode and a separately started supported episode as distinct. | Missing attempt identity; relationship between task instance and attempt episode still needs one reconciled definition. |
| Interaction event | Event ID is composed from task-instance ID, event type and timestamp. | C3 expects ordered events with timestamp/order, actor/source, event type and idempotent provenance. | Timestamp-composed identity; stable event/idempotency semantics and ordering contract are not fully specified. |
| Raw observation | Observation ID is composed from task-instance ID and observed timestamp. No attempt ID is included. | C2/C3 require one immutable raw response episode with stable observation identity and provenance. | Timestamp-derived identity; cannot distinguish separate attempts under the current conflated instance identity. |
| Target cardinality | Task instance retains `evidence_target_ids[]`, but `createObservation` writes only the first target to scalar `evidence_target_id`. | Multi-target contract requires one raw attempt/observation linked to multiple target-specific evidence assessments. | Multi-target relationship is lost at the observation boundary. |
| Browser validation | `runTaskObservation` verifies only that observation `skill_id` matches the task's skill. | Task/attempt/observation lineage must validate task definition, instance, target set and curriculum ownership, not skill alone. | Partial identity validation. |
| Pilot execution path | `empirical-pilot-execution.js` separately carries `task_id` and `task_instance_id`, plus learner/study/session/wave/registry and administration time. Its raw observation requires both IDs but has no explicit `task_attempt_id`. | Must reconcile with the learner-runtime task/attempt/observation hierarchy rather than assume the research export shape is the runtime contract. | More explicit but separate research path; not the canonical runtime solution. |
| Supabase persistence boundary | `student_evidence` has scalar `task_instance_id`, `task_model_id`, `evidence_target_id` and `source_event_id`; the service maps `observation.task_id` into the `task_instance_id` column. The full observation is also stored as JSONB. | Candidate model distinguishes definition, administered instance, attempt, raw observation and target-specific assessments. | Existing scalar compatibility boundary; G8 must inspect constraints/consumers before any persistence design. No schema change is authorized. |

### G6 conclusions and unresolved decisions

1. Do not treat a stable catalogue `task_id` as a unique administered task-instance ID.
2. Reconcile the C2 `task_instance_id`, C3 response-episode unit and multi-target `task_attempt_id` into one explicit hierarchy. Do not infer whether a retry or support transition is a new attempt or a new observation; the C3 lifecycle rules must decide this.
3. Define stable, ordered event identity and source-event/idempotency identity separately from timestamps.
4. Define one immutable raw-observation identity per approved response-episode unit.
5. Preserve the exact declared target set on the raw task attempt and link each target assessment to the same source observation; do not collapse to the first scalar target.
6. Align the separate pilot execution model with the approved logical hierarchy without treating its current fields as an approved learner-runtime API.
7. Keep existing Supabase rows and RPC unchanged until the logical contract is approved and G8 has completed the physical compatibility review.

**Disposition:** G6 remains OPEN. The current code has an identifiable task/instance conflation, no explicit attempt identity and a scalar target projection. These are contract findings, not authorization to patch the interaction contract or alter tests. No runtime, tests, schema, SQL/RPC/RLS, Supabase or learner data changed.

## 8.9 G6 candidate identity hierarchy and unresolved lifecycle — 2026-11-07

The C2, C3 and multi-target task/evidence documents support the following **candidate logical layers**. This table is a reconciliation aid, not an approved runtime contract. It deliberately leaves episode/attempt cardinality unresolved where the candidate documents use different terminology.

| Layer | Candidate responsibility | Required distinction | Remaining decision |
|---|---|---|---|
| Task definition | Stable task identity and immutable definition version: intended content, task model, target opportunities and planned conditions. | A definition is reusable; it is not a learner administration. | Canonical naming between `task_id` and `task_definition_id`; exact definition/version ownership. |
| Task model | Curriculum-level model of the task and its intended evidence opportunities. | `task_model_id` is not a task definition, task instance or attempt ID. | Exact binding/version relationship between model, definition and registry. |
| Task instance | One concrete administration/presentation, including what was actually shown and deviations from the planned definition. | Must not reuse the stable task-definition ID as its unique instance ID. | Whether a changed support/presentation phase remains the same instance or creates a new administration. |
| Response episode / task attempt | A learner interaction episode associated with an administration; carries the response and its ordered interaction history. | Must be distinguishable from both the reusable definition and the administration. | C3 describes ordered attempts within one response episode; the multi-target contract uses `task_attempt_id` for one episode. The canonical term and cardinality must be explicitly approved. |
| Interaction event | One event within an episode: presentation, response/edit, help request/offer/delivery/dismissal, retry, completion or abandonment as applicable. | An event is not automatically a new observation. Event order and event time are distinct. | Stable event ID, sequence/order, actor/source and idempotency key semantics. |
| Raw observation | Immutable record of the response episode and its source provenance. | It is not a target assessment, inference or decision. | Confirm the one-to-one or other explicit cardinality with the approved response-episode identity. |
| Target-specific assessment | A separate assessment of one observation against one evidence target. | One observation may link to multiple target assessments; this must not duplicate the raw observation or inflate independent-attempt counts. | O6 must approve assessment semantics, status vocabulary and version provenance. |
| Inference / decision | Derived interpretation and C6/C7 result with exact source references. | Never overwrite the raw response or target assessment; retain exact version and lineage. | Reconcile with G5 six-part branch, snapshot, evaluation and decision identities. |

### Lifecycle constraints supported by the candidate documents

- A click, edit, retry or help request is an event within the response episode unless the approved lifecycle explicitly starts a new episode.
- C3's candidate reconciliation distinguishes help requested, support offered, support delivered, support declined/dismissed, an independent attempt ending/being abandoned and a separate supported attempt starting.
- C3 states that an independent episode followed by supported practice must be preserved separately; the supported episode must not overwrite or merge with the independent one.
- The multi-target contract requires one parent attempt/observation to be persisted once, even when it produces multiple target-specific evidence assessments.
- Each target assessment must resolve its own evidence target to the correct claim/development under the registry. It must not inherit a task's primary claim by default.
- Raw observation identity, source-event/idempotency identity and target-assessment identity are different identities and must not be substituted for one another.

### Unresolved lifecycle decisions

1. Does `task_attempt_id` name the complete response episode (as in the multi-target contract), or an individual attempt nested inside the C3 response episode?
2. When a learner retries without a support-condition change, is this another ordered attempt inside the same episode or a new episode?
3. When independent work ends and supported practice starts, does the new episode reuse the same task instance or create a new task instance because the actual presented condition changes?
4. What exact event marks episode completion, abandonment, timeout or interruption, and how is a resumed episode distinguished from a replay?
5. Is each raw observation exactly one response episode, and what stable source-event key makes persistence replay idempotent?
6. How are multiple target assessments attached to one raw observation while preserving target-specific claim/development ownership and independent-observation counts?

D9 support-condition and attempt-boundary decisions remain open in the C3 reconciliation. No retry, support, timeout or resume behavior is selected here.

**Disposition:** this is a candidate identity hierarchy for owner/protocol reconciliation only. G6 remains OPEN. No runtime, tests, schema, SQL/RPC/RLS, Supabase or learner data changed; no implementation is authorized.

## 8.10 G6 lifecycle reconciliation against explicit product decisions — 2026-11-07

This section refines Section 8.9 using the owner-confirmed task-support policy, C3 v0.2 observation unit, multi-target task/evidence contract and approved logical decisions O1/O7. It separates what is already determined from what remains a genuine contract/product decision. It does not approve a runtime schema.

### A. Determined by existing contracts and product decisions

| Question | Reconciled interpretation | Source basis |
|---|---|---|
| What is a task definition? | A reusable, versioned definition of intended content, task model, target opportunities and planned support condition. It is not a learner administration. | C3 v0.2 §3.1; task-support addendum §5. |
| What is a task instance? | One concrete administration/presentation. It must preserve what was actually presented and any departure from the versioned definition. It is distinct from the reusable task definition. | C3 v0.2 §3.1. |
| What does `task_attempt_id` identify? | Align it with the complete learner response episode, not with an individual click/edit/retry. The multi-target contract explicitly defines one task attempt as one learner interaction episode; C3 v0.2 defines the raw observation around that episode and its ordered attempts/events. | Multi-target task/evidence contract §3; C3 v0.2 §3.1. |
| Does a retry automatically create a new observation? | No. A click, edit or retry remains within the current response episode unless a defined lifecycle transition starts a separately administered episode. Internal attempt/retry detail remains ordered within the episode. | C3 v0.2 §3.1. |
| What happens when content help is requested during a tussentoets or toets? | The independent attempt ends immediately and is recorded as ended/incomplete, not as learner failure or an incorrect answer. The help request is a separate event from any support actually delivered. The learner returns to supported practice in a distinct attempt; that practice must not be merged with the ended assessment. | Owner-confirmed product decision in Task Support Condition Addendum §1 and Task Support Conditions Contract §12. |
| What is one raw observation? | One separately administered response episode produces one immutable raw observation. One observation may have zero, one or multiple target-specific assessments. | Approved O1; C3 v0.2 §3; owner architecture decisions O1. |
| How are multiple target assessments represented logically? | Each assessment refers to exactly one raw observation and one evidence target, with claim/development resolved from the registry. One raw observation is not duplicated and multiple target assessments do not inflate independent-observation counts. | Approved O1; multi-target task/evidence contract §§3, 6. |
| What is the idempotency principle? | Raw-observation ingestion, target-assessment evaluation/recording and decision evaluation are separate idempotency boundaries. Same identity plus same canonical immutable payload is a replay; same identity plus a different payload is an integrity conflict. | Approved O7. |

### B. Decisions that remain open

| Open point | Why it remains open | Required resolution |
|---|---|---|
| Does the supported-practice continuation reuse the independent task instance ID? | The product decision requires a distinct attempt/observation, while C3 distinguishes separately administered task instances. The documents do not explicitly settle whether the changed support condition always creates a new task instance. | Confirm that a new supported-practice presentation is a new task instance, or define the precise permitted reuse case. Recommended default for review: create a new task instance when the administered support condition changes. |
| Ordinary-practice restart after completion/abandonment | C3 says separately administered task instances receive separate observations, but the product lifecycle does not fully define when an interrupted or abandoned practice session is resumed versus restarted. | Define explicit end/restart/resume transitions; do not infer them from elapsed time alone. |
| Timeout, interruption and resume | Test help-request termination is explicit; generic timeout/interruption/resume behavior is not. | Define whether a resume continues the same response episode or begins a new one, including the evidence cutoff. |
| Event identity and ordering | C3 requires ordered events and O7 establishes idempotency behavior, but no canonical event ID, monotonic sequence/order field or source-event key format is approved. Timestamp alone is not the complete ordering contract. | Specify stable event identity, per-episode ordering, event-time semantics and source-event idempotency identity. |
| Observation and attempt ID generation | The logical cardinality is determined, but the canonical ID format, generation boundary and collision handling are not. | Define stable opaque IDs and replay behavior in the versioned logical contract before implementation. |
| Target-assessment identity/version | O1 determines the logical relation; O6 remains open on assessment states, rules and version provenance. | Complete O6 before specifying the final assessment record and its versioned identity. |
| Neutral interface clarification versus content help | The product distinction is required, but the operational classification boundary is not fully anchored. | Specify examples/rules for interface-only clarification versus target-relevant assistance. |
| PROMPTED versus DEPENDENT and other C3 states | O6 is explicitly open; no final operational codebook or evidence-status vocabulary is approved. | Resolve in O6. Do not infer codes from correctness or a help-request event alone. |

### C. Consolidated candidate hierarchy

The best-supported logical hierarchy is now:

`versioned task definition → task model/target opportunities → administered task instance → response episode (task_attempt_id) → ordered interaction events and internal retries → immutable raw observation → zero or more target-specific PacoGO assessments → branch-specific C6/C7 inference and decisions`

A new independent-to-supported transition creates a distinct response episode and raw observation. Whether it also always creates a new task-instance identity is the remaining narrow product decision noted above. The event stream records both the help request and any actual support delivery separately.

### G6 disposition

The earlier six questions in Section 8.9 are now narrowed:
- Response-episode identity, retry-as-event, raw-observation cardinality and multi-target assessment cardinality are determined by the existing candidate/approved logical contracts.
- Support-condition transition semantics are partly determined by the owner-confirmed product decision.
- New task-instance identity on that transition, generic interruption/resume, stable event/ID serialization and final target-assessment semantics remain open.

G6 remains OPEN pending these remaining decisions and their versioned contract reconciliation. This section does not authorize runtime implementation, test changes, registry changes, schema/SQL/RPC/RLS changes, Supabase work or learner-data changes.


## 8.11 G6 task / attempt / observation lifecycle proposal — 2026-11-07

**Proposal:** `docs/curriculum/PacoGO_Task_Observation_Identity_Lifecycle_Proposal_v0.1.md`.

The proposal now gives a concrete, reviewable candidate contract for:
- distinct versioned task definition, task model, administered task instance, response episode (`task_attempt_id`), interaction event and immutable observation identities;
- one task instance → one response episode → one raw observation under the proposed minimum lifecycle;
- retries as ordered events within the same episode;
- new task instance + episode + observation when support condition changes (recommended default, awaiting explicit owner approval);
- same-state interruption/resume as the same episode; changed/reissued presentation as a new administration;
- explicit timeout policy only; no implicit timeout inferred from elapsed time;
- stable event identity, per-episode monotonic sequence, separate event/ingestion times, and O7 replay/conflict behavior;
- preservation of incomplete/no-response episodes without selecting an O6 assessment label.

**Gate disposition:** this materially narrows G6, but G6 remains OPEN. The final identity/lifecycle contract must be reconciled with the approved C3/O6 model because G6 explicitly depends on G2. The proposal does not resolve O6 target-assessment vocabulary, status labels or assessment-version provenance. It does not close G2, G5 or G7–G12 and does not authorize implementation.

No runtime, tests, registry, catalogue, database, SQL/RPC/RLS, Supabase or learner data changed.


## 8.12 G2/O6 operational assessment contract v0.2 — 2026-11-07

**Proposal:** `docs/curriculum/PacoGO_Operational_Assessment_Contract_v0.2.md`.

This version recasts O6 as PacoGO's operational, target-specific assessment contract. It explicitly keeps raw observations, assessment results and downstream curriculum inference separate. It proposes:

- separate task-instance alignment and response-to-target relation;
- objective task performance separate from target evidence status;
- per-stream process/capture availability separate from interpretation;
- target evidence states `PRESENT`, `ABSENT`, `INDETERMINATE`, `NOT_ASSESSED`, `NOT_APPLICABLE`, with strict non-negative treatment of missingness/no-response;
- target-specific independence states `INDEPENDENT`, `PROMPTED`, `DEPENDENT`, `UNKNOWN`, `NOT_REQUIRED`, based on actual delivered support and target requirements;
- target-specific contradiction with evidence reference and rationale;
- no generic numeric quality score; a structured capture/scoring/interpretability profile is proposed to support the existing C6 M2 quality gate without changing its meaning;
- exact assessment-rule/engine/registry provenance and linked reassessment;
- synthetic boundary cases for positive, negative, mixed, missing, no-response, misaligned and assisted observations.

**Important boundary:** this is a review proposal, not an approved codebook. G2/O6 remains OPEN until the categories, operational anchors, M2 profile and target-specific rules are explicitly approved. G3 must then define and verify the operational rule behavior. G5 must reconcile the C3 output profile with C6–C9. G6's identity/lifecycle proposal must be reconciled with the approved O6 contract. No implementation is authorized.

The prior C3 candidate documents that assumed a human coding workflow remain historical inputs only; this proposal does not introduce a parallel learner-runtime assessment path.

No runtime, tests, registry, catalogue, database, SQL/RPC/RLS, Supabase or learner data changed.


## 8.13 O6 operational assessment reconciliation review — 2026-11-07

**Review:** `docs/curriculum/PacoGO_O6_Operational_Assessment_Reconciliation_Review_v0.1.md`.

The review identifies and proposes resolutions for the remaining logical ambiguities in O6 v0.2:

1. Separate applicability, assessment execution state and dimension result; an absent rule or technical failure is not a learner evidence state.
2. Restrict `PARTIALLY_ALIGNED` to explicitly decomposed target components; a misaligned task cannot produce target-level `ABSENT`.
3. Keep response relation distinct from evidence status; no response is not relation `NONE`.
4. Distinguish no response (`NOT_OBSERVED`) from an existing but unscorable response (`NOT_SCORABLE`), while preserving the raw `NO_RESPONSE` event.
5. Apply strict preconditions to `ABSENT`; incomplete capture, no response or misalignment default to uncertainty/not-assessed as appropriate.
6. Explicitly distinguish C3 target-specific assistance/independence from C6 M5 independence across an eligible evidence set.
7. Give `PROMPTED` versus `DEPENDENT` a target-specific behavioral decision sequence.
8. Keep C3 contradiction observation-local and C6 M7 evidence-set-level.
9. Reconcile the M2 adequacy profile with C6 M1/M2 without duplication, scoring or changing existing gate meaning.
10. Pre-specify and minimise captured context variables; preserve O5 event-time/availability-cutoff provenance.

**Gate status:** these are recommendations, not owner approvals. G2/O6 remains OPEN. G3 must turn approved rules into deterministic contract tests. G5 must define the exact C3-to-C6–C9 handoff. G6 must be reconciled after O6 approval. No runtime or persistence implementation is authorized.

No runtime, tests, registry, catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.


## 8.14 O6 domain anchor examples for A1, B1 and FR2 — 2026-11-07

**Examples:** `docs/curriculum/PacoGO_O6_Domain_Anchor_Examples_v0.1.md`.

The examples apply the proposed O6 distinctions to existing curriculum/task meanings without changing any skill, development, claim, evidence-target or task-model mapping. They are hypothetical rule-test vectors, not learner data, approved codebook anchors or empirical validation.

The cross-domain examples make the following boundaries concrete:

- Separate raw response/event facts, target applicability, assessment execution, C3 target result and downstream inference.
- Do not infer a target merely because a task displays a representation or lists a target opportunity.
- Assess multi-target responses separately while retaining one raw observation and avoiding inflated independent-observation counts.
- Separate objective performance from evidence status; preserve mixed responses, unscorable responses and no-response distinctly.
- Require genuine task opportunities for strategy, checking, transfer, robustness and representation-change targets.
- Treat explanations as evidence only when their mathematical content meets the target criterion; the presence or length of text is not evidence.
- Evaluate support against the specific target operation supplied; a help request alone is not delivered support, and the same cue may affect different targets differently.
- Keep C3 target-specific assistance/independence separate from C6 M5 evidence-set independence, and C3 observation-local contradiction separate from C6 M7 evidence-set contradiction.
- Preserve unresolved B1 ET7 mapping; no task-model or registry change is implied.

**Gate disposition:** the examples sharpen the review but do not approve O6. G2/O6 remains OPEN pending explicit approval of the operational vocabulary, applicability/execution/result model, target-specific anchors, strict ABSENT conditions, support/independence rules, M2 adequacy profile and provenance. G3 follows approval; G5 and G6 remain dependent on the finalized O6 output contract. No implementation is authorized.

Full Regression #3133 / run ID `42403744862`: **GREEN** on exact commit `ff07b3e9eb477ebcff44dec16b052c50c0d9d73f`; workflow completed successfully, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification.

No runtime, tests, registry, catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.


## 8.15 O6 decision brief v0.1 — 2026-11-07

**Decision brief:** `docs/curriculum/PacoGO_O6_Decision_Brief_v0.1.md`.

The brief consolidates O6 v0.2, reconciliation review R1–R13 and the A1/B1/FR2 domain-anchor examples into one approval-ready recommendation. It explicitly separates settled logical architecture from recommended O6 rules and the remaining owner approvals.

Key recommendations:
- separate applicability (`APPLICABLE` / `NOT_APPLICABLE`), rule execution (`NOT_RUN` / `COMPLETED` / `BLOCKED` / `ERROR`) and dimension result;
- keep alignment, response relation, objective performance, per-stream capture availability, target evidence, target-specific independence and contradiction as distinct dimensions;
- use `NOT_OBSERVED` for no response and `NOT_SCORABLE` for an existing unscorable response; default no-response evidence to `INDETERMINATE`;
- restrict `ABSENT` to validly elicited, sufficiently captured and inspectable target material;
- classify `PROMPTED` versus `DEPENDENT` by what delivered support did to the specific target operation;
- keep C3 contradiction observation-local and separate from C6 M7;
- use a structured, non-scored M2 adequacy profile and reconcile M1/M2 boundaries in G5;
- pre-specify/minimise context capture and preserve O5 event-time/availability and immutable reassessment provenance.

**Verification:** Full Regression #3135 / run ID `42418832606`: **GREEN** on exact decision-brief commit `84ecb723ed38654417c76850eebe5446adbfbdd3`; all workflow steps passed, including browser regression and clean-working-tree verification.

**Gate status:** this is a recommendation package, not approval. G2/O6 remains OPEN. G3, G5 and G6 remain separate follow-on gates. No implementation is authorized.


## 8.16 G3 candidate operational assessment verification specification — 2026-11-07

**Specification:** `docs/curriculum/PacoGO_G3_Operational_Assessment_Rule_Verification_Specification_v0.1.md`.

The project owner authorized continued work using O6 Decision Brief v0.1 as the working baseline. This is permission to develop the deterministic verification specification; it is not a final freeze of the versioned O6 contract and does not authorize runtime or persistence implementation.

The G3 specification translates the O6 candidate rules into 40 deterministic logical vectors covering:
- applicability, rule execution and result separation;
- task-instance alignment versus response relation;
- objective performance, process capture, no-response and strict ABSENT preconditions;
- support requests versus delivered support and target-specific independence;
- Tussentoets/Toets content-help termination, incomplete status and separate supported continuation;
- observation-local contradiction;
- one observation with multiple target assessments;
- provenance, replay/conflict, reassessment and O5 availability cutoff;
- A1, B1 and FR2 domain anchors, including preservation of unresolved B1 ET7 mapping;
- the structured non-scored C6 M2 adequacy profile without changing C6 gate meanings.

**Gate disposition:** G2/O6 remains OPEN until the exact versioned contract is frozen. G3 remains OPEN until G2 is frozen, the vectors are converted into executable contract tests, and the exact implementation commit passes Full Regression. G5/G6 remain separate dependent gates. No runtime, tests, registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.


## 8.17 O6 consolidated operational assessment contract v0.3 — 2026-11-07

**Contract:** `docs/curriculum/PacoGO_Operational_Assessment_Contract_v0.3.md`.

This version consolidates the O6 v0.2 proposal, decision brief, reconciliation review, A1/B1/FR2 domain anchors, owner-confirmed support-condition policy and G3 candidate vectors into one logical working contract.

It makes the following distinctions explicit and normative within the proposal: applicability versus execution versus result; task-instance alignment versus response relation; objective performance versus target evidence; per-stream process availability; strict preconditions for ABSENT; NO_RESPONSE → NOT_OBSERVED + INDETERMINATE by default; planned support versus help request versus delivered support versus target-specific independence; immediate incomplete termination of Tussentoets/Toets on content-help request with separate supported continuation; observation-local contradiction; non-scored C6 M2 adequacy profile; immutable observation/assessment history and O5 availability-cutoff lineage.

It preserves existing A1/B1/FR2 target meanings, B1 ET7 unresolved mapping, C6 mastery gates and C7 authority. It does not authorize runtime or persistence work.

**Gate disposition:** G2/O6 remains OPEN until the owner accepts this exact v0.3 as the approved versioned contract and required governance review is complete. G3 remains OPEN pending G2 freeze and executable contract tests. G5 and G6 remain separate dependent gates. No runtime, tests, registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.


Full Regression #3142 / run ID `42422816647`: **GREEN** on exact contract/matrix/handoff commit `cecc708bcae805eb3a28bb80bb6c7d3f680f77d4`; all workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification. This verifies O6 contract v0.3, matrix Section 8.17 and handoff Section 88 as committed in that SHA.


## 8.18 G3 ↔ O6 v0.3 traceability and gap review — 2026-11-07

**Review:** `docs/curriculum/PacoGO_G3_O6_v0.3_Traceability_and_Gap_Review_v0.1.md`.

All 40 candidate G3 vectors and the A1/B1/FR2 domain anchors are mapped to O6 v0.3. Directly specified cases are distinguished from cases dependent on task/target anchors, G6/G9 identity semantics, O5 snapshot cutoffs or G5 C6 M1/M2 mapping. The review explicitly blocks guesses where those contracts are not frozen.

**Gate disposition:** G2/O6 remains OPEN pending acceptance of exact v0.3. G3 remains OPEN pending G2 freeze and executable contract tests. G5/G6/G9 and O5 dependencies remain separate. No runtime, executable tests, registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.


## 8.19 G2/O6 owner approval and logical contract freeze — 2026-11-07

**Decision:** The project owner approved the exact contents of `PacoGO_Operational_Assessment_Contract_v0.3.md` by directing continuation after the explicit approval checkpoint. The approval is limited to the logical O6 assessment contract.

**Gate status:**
- G2/O6: **CLOSED — logical contract v0.3 approved and frozen**.
- G3: OPEN — implement executable deterministic contract tests for the 40 candidate vectors against the frozen O6 v0.3 contract.
- G5, G6/G9 and O5 dependencies remain separate; their semantics must not be guessed or silently absorbed into G3.
- This approval does not authorize runtime, learner-state, registry, task-catalogue, database, SQL/RPC/RLS, Supabase or persistence changes. Explicit G12 authorization and applicable downstream gates remain required.

**Next build:** G3 contract-test implementation only. Test cases must distinguish directly specified O6 behavior from dependency-bound cases. Where an expected result depends on an unresolved G5/G6/G9/O5 contract, assert the approved boundary or blocked/unknown behavior; do not invent missing semantics.

No learner data or runtime behavior changed in this decision record.


## 8.20 First executable G3 contract-conformance suite — 2026-11-07

**Test file:** `pacogo-engine/operational-assessment-contract.test.js`.

Added a test-only normalized logical record representation and conformance assertions for O6 v0.3. The suite covers G3-001–036, A1/B1/FR2 preservation examples and the structured non-scored M2 profile. G3-037–039 remain blocked on G6/G9 identity/payload semantics; G3-040 remains blocked on O5 snapshot-cutoff semantics.

**Scope limitation:** this is not a production assessor and does not infer judgments from learner responses. The normalized fixture shape is test-only, not a persisted schema or API. No runtime, learner state, registry, task catalogue, database, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Full Regression #3154 / run ID `42424440906`: **GREEN** on exact test commit `4ae2420753e9a10bcfc094b695d3b42d20792264`. Curriculum-engine regression, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification passed.

**Gate status:** G2/O6 CLOSED. G3 OPEN pending deeper executable coverage and subsequent implementation-specific verification. G5, G6/G9, O5 and G12 remain separate gates.


## 8.21 G3 conformance-suite strengthening and Full Regression #3159 — 2026-11-07

**Test changes:** Strengthened `pacogo-engine/operational-assessment-contract.test.js` with cross-dimension O6 invariants, independent-attempt policy assertions and structured M2 adequacy-profile checks. Added negative cases to reject prohibited shortcuts and incomplete/aggregate M2 profiles.

**Regression investigation:** Full Regression #3158 / run ID `42424698111` was RED on `337369086e9e7f189251dcfadae4cf3f480160c5`. Three tests exposed a defect in the test fixture factory: partial overrides shallow-replaced nested defaults, removing unrelated default dimensions. The fixture factory was corrected to merge the nested `task_instance`, `dimensions`, `criterion`, `support` and `process` defaults. This was a test-fixture construction defect, not a production engine defect; no tests were disabled or weakened.

**Verified result:** Full Regression #3159 / run ID `42424761647`: **GREEN** on exact commit `0b1c2ad17daa1ed432cd2c191d570b407b2c6e2f`. The browser job completed successfully:
- Playwright ran 59 browser tests using one worker.
- **59 passed**; no browser test failures.
- Startup diagnostics: `no browser errors observed`.
- The subsequent clean-working-tree check passed.
The complete workflow also passed curriculum-engine regression, architecture-boundary tests, Double or Nothing runtime regression, maintained Node regression and maintained Vitest regression.

**Scope:** Test-only conformance harness and fixture correction. No production assessor, learner-facing runtime, registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN; this suite is still a test-only normalized logical-record harness, not a production assessor. G3-037–039 remain dependent on G6/G9; G3-040 remains dependent on O5. G5 and G12 remain separate gates. No runtime or persistence authorization is implied.

**Next step:** Continue strengthening genuine vector-level positive and negative assertions against the frozen O6 v0.3 contract. Do not invent unresolved G5/G6/G9/O5 semantics and do not start production implementation before applicable gates and explicit authorization.



## 8.22 G3-008 — partial alignment must reference a pre-defined target component

**Contract basis:** O6 v0.3 §5.1 permits `PARTIALLY_ALIGNED` only when the target contract explicitly defines separable components and the assessment names the component actually elicited. G3 traceability requires a named pre-defined component; full-target alignment must not be inferred.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` now represents the target contract's `separable_component_ids` explicitly. The conformance assertion rejects partial alignment unless the instance's named `component_id` is present in that pre-defined list. The G3-008 test now exercises:
- accepted partial alignment for a component declared by the target contract;
- rejection when the instance names a component absent from the target contract;
- rejection when the instance does not name the elicited component.

The negative cases call the shared `assertAssessment` conformance assertion; they no longer simulate rejection with a test-local conditional.

**Scope:** Test-only normalized logical-record harness. No production assessor, learner runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Implementation commit `1f6b41e4c1126ed18eceff623a453424e49f6c99`. Full Regression #3165 / run ID `42425645992`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks all passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with the next directly specified vector and strengthen its positive and negative cases through the shared conformance assertion. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.23 G3-009 — NONE requires an existing, inspectable response

**Contract basis:** O6 v0.3 §5.2 defines `NONE` only for an existing inspectable response that is unrelated to the target. No response is not `NONE`.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` now tests the shared `assertAssessment` boundary with:
- a present, inspectable response accepted as eligible for `NONE`;
- `NO_RESPONSE` rejected for `NONE`;
- a present but uninspectable response rejected for `NONE`.

The accepted example keeps target evidence `INDETERMINATE`; the test does not infer `ABSENT` or any learner result merely from response relation.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Implementation commit `d482e8c78188e5e04f9fceeca7e66e110af12cda`. Full Regression #3168 / run ID `42425888671`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with the next directly specified vector and strengthen its positive and negative cases through the shared conformance assertion. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.24 G3-010 — uncertain response relation must not be guessed

**Contract basis:** O6 v0.3 §5.2 defines `INDETERMINATE` when available information does not support a defensible response-to-target relation. G3-010 requires an uncertain captured response to remain `INDETERMINATE`, not guessed as `DIRECT` or `NONE`.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` now includes an explicit test-fixture condition `relation_basis_sufficient: false`. The shared `assertAssessment` conformance assertion requires relation `INDETERMINATE` under that condition. G3-010 verifies the valid indeterminate case and rejects all four overclaims: `DIRECT`, `PARTIAL`, `INDIRECT` and `NONE`. This fixture condition is test-only and does not establish a persisted field or API.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Implementation commit `fd0eb7c78b175967a6546c5ad3ef1f87b8aa0fbd`. Full Regression #3171 / run ID `42426099815`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with the next directly specified vector and strengthen its positive and negative cases through the shared conformance assertion. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.25 G3-011 — objective performance and target evidence remain independent

**Contract basis:** O6 v0.3 §§5.3 and 5.5 distinguish objective task performance under the task scoring rule from target-specific evidence under the target criterion. G3-011 requires `CORRECT` performance when the objective scoring rule is met, while target evidence is assessed independently and must not be auto-set to `PRESENT`.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` adds a test-only `objective_scoring_result` fixture value and a shared assertion that the performance result preserves it. G3-011 verifies:
- objective `CORRECT` with target evidence `INDETERMINATE` is accepted when the target criterion cannot be concluded;
- `PRESENT` is rejected when the target criterion is not met;
- a performance result that disagrees with the fixture's objective scoring result is rejected.

The fixture value is test-only; it does not define a production API or persisted field.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Implementation commit `ff375c40e7859575d7e3e9307224fba981344b22`. Full Regression #3174 / run ID `42426297601`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-012, preserving objective performance, target evidence and contradiction as distinct outputs. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.26 G3-012 — incorrect performance does not imply contradiction

**Contract basis:** O6 v0.3 §§5.3 and 5.7 separate objective performance from observation-local contradiction. G3-012 requires `INCORRECT` when the objective scoring rule is not met, while explicitly prohibiting automatic contradiction `PRESENT`.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` ties the fixture's objective scoring result to performance. The positive case accepts `INCORRECT` with target evidence and contradiction both `INDETERMINATE` when neither is independently established. The negative case rejects contradiction `PRESENT` when no specific contradiction source material is supplied.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Implementation commit `3d2d1baa55f82707935cd384f02adfdbff7099c3`. Full Regression #3178 / run ID `42426573789`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-013, checking component-level scoring and provenance without flattening mixed performance. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.27 G3-013 — mixed performance retains component-level provenance

**Contract basis:** O6 v0.3 §5.3 permits `MIXED` where the response contains separable correct and incorrect components and prohibits flattening target-relevant distinctions into a boolean or generic percentage.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` adds a test-only G3-013 component-mapping assertion. The positive fixture preserves distinct component identifiers and their `CORRECT`/`INCORRECT` outcomes under objective `MIXED`. Negative cases reject a flattened single component, duplicate component identifiers and loss of the incorrect component. The fixture exercises the `MIXED` path without redefining all task-specific scoring schemes.

**Regression investigation:** Full Regression #3182 / run ID `42426785582` was RED on implementation commit `6107e6b2eb146e8a857714b7d57b59feda6272a2`. The only failing test was G3-013: the minimum-component assertion correctly failed for the flattened negative fixture, but its diagnostic message did not match the expected `/at least 2/` pattern. The assertion condition was already correct. The message was clarified without weakening or changing the condition.

**Verified result:** Correction commit `3684aa7d5a00b0ed937f9d107a2d82bf6e1e71c9`. Full Regression #3184 / run ID `42426831166`: **GREEN** on that exact correction commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-014, preserving `NO_RESPONSE` as `NOT_OBSERVED` and target evidence as `INDETERMINATE` by default. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.28 G3-014 — no-response outcomes remain non-negative and indeterminate

**Contract basis:** O6 v0.3 §§5.2–5.5 preserve `NO_RESPONSE` as a raw response/administration event. The default performance is `NOT_OBSERVED`, relation is `INDETERMINATE`, and target evidence is `INDETERMINATE`.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` now verifies the complete valid result combination and rejects three prohibited outcomes through the shared `assertAssessment` assertion: performance `INCORRECT`, relation `NONE`, and target evidence `ABSENT`.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Implementation commit `c87f8e93e7ce6bad94ff1f6b87ca02805937ca78`. Full Regression #3188 / run ID `42427054170`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-015, distinguishing an existing but unscorable response from no response and incorrect performance. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.29 G3-015 — existing unscorable response is not incorrect

**Contract basis:** O6 v0.3 §5.3 distinguishes `NOT_SCORABLE` from `INCORRECT`. An existing response that the approved scoring rule cannot interpret is `NOT_SCORABLE`; target evidence remains `INDETERMINATE` unless another inspectable target-specific component supports a result.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` adds the test-only fixture condition `scoring_rule_interpretable: false`. The shared `assertAssessment` requires `NOT_SCORABLE` when a response exists but the scoring rule cannot interpret it. G3-015 accepts `NOT_SCORABLE` with evidence `INDETERMINATE` and rejects conversion to `INCORRECT`.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Implementation commit `669be29b0bc31854664fdf1e68b4dff3538199d9`. Full Regression #3192 / run ID `42427295240`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-016, keeping per-stream collection availability distinct and preventing missing required streams from supporting `ABSENT`. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.30 G3-016 — required process-stream availability is recorded per stream

**Contract basis:** O6 v0.3 §5.4 requires availability to be recorded separately for every required stream and prohibits collapsing distinct streams into one overall flag. G3-016 requires a missing stream to remain `NOT_COLLECTED` and affected target evidence to remain `INDETERMINATE`, not `ABSENT`.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` adds a test-only per-stream fixture collection and assertion. The positive case preserves one `AVAILABLE` stream and a separate `NOT_COLLECTED` required stream. Negative cases reject aggregate-only availability without per-stream records and reject target evidence `ABSENT` while a required stream is uncollected.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Implementation commit `f387b72ea179b1d583fd79bab94708df631e115f`. Full Regression #3196 / run ID `42427522460`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-017, keeping technical capture failure distinct from `NOT_COLLECTED` and preventing it from supporting `ABSENT` or `INCORRECT`. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.31 G3-017 — technical capture failure blocks affected assessment

**Contract basis:** G3-017 and O6 v0.3 §§5.3–5.5 distinguish a technical capture failure from learner performance. A required stream with `TECHNICAL_FAILURE` blocks the affected assessment rule; it cannot support `ABSENT` or `INCORRECT`, and affected target evidence remains `INDETERMINATE`.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` strengthens the G3-017 fixture with an explicitly identified required stream marked `TECHNICAL_FAILURE`. The test requires the affected performance rule to be `BLOCKED` with no learner performance result, while target evidence remains `INDETERMINATE`. Negative cases reject an `INCORRECT` result and target evidence `ABSENT` for the same failed capture condition.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Pre-build Full Regression #3199 / run ID `42427646099`: GREEN on exact baseline commit `ef7da3458c865067646cb739f69139705907c667`. Implementation commit `eefa0c9e5dfe0f954f78c9760665fb32e14ea65b`. Full Regression #3200 / run ID `42427783561`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-018, validating every strict precondition before allowing target evidence `ABSENT`. Do not infer semantics owned by G5, G6/G9 or O5.



## 8.32 G3-018 — every strict precondition is required before ABSENT

**Contract basis:** O6 v0.3 §5.5 permits target evidence `ABSENT` only when the task is validly aligned, the criterion and required material were defined in advance, all required material was captured and is inspectable, the applicable target rule completed, and the criterion was not met.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` routes the valid `ABSENT` case and eight negative cases through the shared `assertAssessment` conformance assertion. The negative cases separately remove valid alignment, pre-defined criterion, pre-defined material, complete capture, inspectability, complete required streams, unmet criterion, or completed rule execution.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Pre-build Full Regression #3202 / run ID `42427882277`: GREEN on exact baseline commit `073e353c549f7330e9865a592f23b223ac59ea45`. Implementation commit `f91513784da49a48212f426f190724ca3fcc282c`. Full Regression #3203 / run ID `42428008931`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-019, requiring `PRESENT` to satisfy its positive target criterion and all applicable capture/inspectability preconditions. Do not infer mastery or transfer from `PRESENT` alone.



## 8.33 G3-019 — PRESENT requires pre-specified positive target evidence

**Contract basis:** O6 v0.3 §§1, 5.5 and 9 separate target-specific evidence assessment from downstream inference. `PRESENT` requires valid target elicitation, a pre-defined criterion and required material, the criterion being met, and inspectable material. It does not establish mastery, transfer or next action.

**Test change:** The shared `assertAssessment` now enforces the pre-defined criterion/material conditions for `PRESENT`. G3-019 covers one valid positive case and six negative cases: misalignment, criterion not pre-defined, required material not pre-defined, criterion not met, required material not inspectable, and target rule not completed.

**Scope:** Test-only conformance work against frozen O6 v0.3. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Pre-build Full Regression #3206 / run ID `42428186877`: GREEN on exact baseline commit `5945d521d4dbf8c774cfc705e080965c7f6da156`. Final test implementation commit `67c77d2b824b9ec0b3304db0e80c499ab63c8330`. Full Regression #3208 / run ID `42428302970`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-020, distinguishing a help request from support actually delivered and not classifying the learner as PROMPTED or DEPENDENT when no support was delivered.



## 8.34 G3-020 — help request is not delivered support

**Contract basis:** O6 v0.3 §1 records a help request separately from support actually delivered. A request without delivery is not a basis for classifying independence as `PROMPTED` or `DEPENDENT`.

**Test change:** `pacogo-engine/operational-assessment-contract.test.js` accepts a request event with `delivered: false` and independence `NOT_REQUIRED` in the fixture. Negative cases pass `PROMPTED` and `DEPENDENT` through the shared `assertAssessment` assertion and verify both are rejected without delivered support.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Pre-build Full Regression #3211 / run ID `42428410315`: GREEN on exact baseline commit `1b8c43e93ee21aa3ed428e1259fa862260080ead`. Implementation commit `2fa2689a401d30135375845d57dd9cfe0d1aa336`. Full Regression #3212 / run ID `42428510380`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-021, distinguishing neutral interface clarification from target-relevant mathematical/content support.



## 8.35 G3-021 — neutral interface clarification is not target-relevant support

**Contract basis:** O6 v0.3 §1 distinguishes neutral interface clarification (answer entry/submission only) from mathematical/content support. Neutral clarification must not supply target reasoning or be treated as target-relevant assistance.

**Test change:** The shared `assertAssessment` requires the test fixture's `interface_clarification` support kind to be actually delivered, not target-relevant, and not to supply the required operation/reasoning. The positive case records delivered neutral clarification with independence `NOT_REQUIRED`; negative cases reject target-relevant classification and supplied target reasoning.

**Scope:** Test-only normalized logical-record harness. No production support delivery, assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Pre-build Full Regression #3215 / run ID `42428623106`: GREEN on exact baseline commit `4deef55ebc67cb67412a25f36f6b5ca02a515a0e`. Implementation commit `11f2881f92f885ae4110e7551a0bdaae710aa058`. Full Regression #3216 / run ID `42428731369`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-022, requiring actual completed event capture and absence of delivered target-relevant support before classifying independence as `INDEPENDENT`. Do not infer independence from the planned task condition alone.



## 8.36 G3-022 — actual independence requires complete capture and no delivered target support

**Contract basis:** O6 v0.3 §5.6 defines `INDEPENDENT` by actual episode evidence: no target-relevant assistance was delivered and event capture is sufficiently complete to support that conclusion. A planned independent condition alone is insufficient.

**Test change:** G3-022 now has an explicit positive case with complete required event capture and no delivered support. Negative cases pass incomplete capture and delivered target-relevant assistance through the shared `assertAssessment` assertion and reject `INDEPENDENT`.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Pre-build Full Regression #3219 / run ID `42428855949`: GREEN on exact baseline commit `f96379871016013fa17e68b121ad6a3df3d059e7`. Implementation commit `c134cc15fff565095e9f7db137d14bb7b93a9ec8`. Full Regression #3220 / run ID `42428971731`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-023, distinguishing a target-relevant cue that leaves the required operation to the learner (`PROMPTED`) from assistance that supplies the operation (`DEPENDENT`).



## 8.37 G3-023 — PROMPTED leaves the required operation to the learner

**Contract basis:** O6 v0.3 §5.6 defines `PROMPTED` as delivered target-relevant support that influences the response while leaving the required target operation/reasoning/strategy to the learner.

**Test change:** G3-023 now covers the valid delivered target-relevant cue with `supplied_required_operation: false`. Negative cases pass support not delivered, support not target-relevant, and support that supplies the required operation through the shared `assertAssessment` assertion; all are rejected as `PROMPTED`.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Pre-build Full Regression #3223 / run ID `42429090347`: GREEN on exact baseline commit `c847b6b412a4ed0e749be07d20c605a3bfb3716e`. Implementation commit `9bb43290e834ff8b19b27eb16e21f41ee17576aa`. Full Regression #3224 / run ID `42429183898`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-024, requiring delivered target-relevant support to supply, select, perform, materially narrow or complete a required target operation before classifying the affected target as `DEPENDENT`.



## 8.38 G3-024 — DEPENDENT requires delivered operation-supplying support

**Contract basis:** O6 v0.3 §5.6 defines `DEPENDENT` only when delivered target-relevant support discloses, selects, performs, materially narrows or completes a required target operation/reasoning/strategy.

**Test change:** G3-024 now verifies the positive delivered/target-relevant/operation-supplying combination. It preserves objective performance `CORRECT` while independence is `DEPENDENT`. Negative cases reject support not delivered, support not target-relevant, and support that does not supply the required operation.

**Scope:** Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

**Verification:** Pre-build Full Regression #3227 / run ID `42429291175`: GREEN on exact baseline commit `51c3632ca3ec99b66e43a6f4c4bbd53865a28015`. Implementation commit `73148881908de05538de42f62d791daccd350b00`. Full Regression #3228 / run ID `42429410466`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

**Gate status:** G2/O6 remains CLOSED. G3 remains OPEN. G5, G6/G9 and O5 dependencies remain unchanged; G3-037–039 and G3-040 remain blocked as specified. No implementation authorization is implied.

**Next step:** Continue with G3-025, preserving `UNKNOWN` when support delivery/content or event provenance is incomplete; do not default to `INDEPENDENT`.
