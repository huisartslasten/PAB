# PacoGO C9 — Vertical Learning Chain Validation Protocol v0.2

Status: versioned design proposal / owner review required / NOT approved for implementation  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Design baseline: Full Regression #3035 / run ID `42242645809` GREEN on `a98c46458d1d14ee55ae73b8dd977abe5ad86953`

## 1. Purpose

C9 validates that each supplied PacoGO decision branch is structurally coherent and auditable from curriculum/registry context through raw observation, target-specific assessment/coding, frozen decision snapshot, C6 mastery, C7 next action and C8 temporal history.

C9 is a chain-integrity gate. It is not a learning algorithm, evidence coder, mastery classifier, next-action selector or empirical validation study.

This v0.2 proposal reconciles C9 with:
- multi-target observations and target-specific assessment cardinality;
- the full six-part decision-branch identity;
- versioned scope and time-window definitions;
- staged ingestion, assessment/coding and decision evaluation;
- immutable evidence snapshots;
- C8's single-branch histories and optional descriptive cross-branch projections.

It supersedes v0.1 as the proposed forward contract; v0.1 remains historical. It does not authorize implementation or persistence/schema/Supabase changes.

## 2. Validation scope

For each branch, C9 checks:

`curriculum registry → skill → development → claim → task → learner performance → raw observation → target assessment/coding → frozen decision snapshot → C6 mastery → C7 next action → C8 temporal branch history`

One task attempt may yield one raw observation and several target-specific assessments. The same raw observation may therefore be referenced by more than one branch. C9 validates each branch independently and preserves the shared source link; it never collapses branch identities.

## 3. Structural validity versus scientific validity

C9 can establish:
- required records and references are present;
- registry, target and branch relationships are structurally consistent;
- source-observation and assessment provenance is traceable;
- snapshot eligibility and version references are coherent;
- C6/C7/C8 records refer to the same exact branch and decision lineage;
- explicit safety/permission boundaries are preserved.

C9 does not establish:
- truth or validity of a curriculum claim;
- correctness of developmental ordering or prerequisite relationships;
- empirical reliability or validity of evidence coding;
- task discrimination or measurement quality;
- correctness or permanence of mastery;
- educational optimality of a next action;
- transfer, retention, causal effect or developmental progress;
- suitability for registry promotion.

Scientific validation requires separate empirical data, independent measures, analysis and governance.

## 4. Canonical six-part decision branch

Every canonical branch validated by C9 must contain all six fields:

1. `learner_key`;
2. `curriculum_registry_version_id`;
3. `claim_id`;
4. `development_id`;
5. `scope_id`;
6. `time_window_id`.

All six fields must be non-empty, resolvable and identical across every record that claims membership in that branch.

A derived `decision_branch_id` may be checked when supplied, but the six inspectable fields remain authoritative. Canonical serialization/versioning is governed by a separate approved identity contract; C9 must not invent its own serialization.

Task, task-instance, attempt, observation, target-assessment, coder, coding-round, adjudication, snapshot, evaluation and decision IDs are provenance references, not branch identity fields.

### 4.1 Legacy records

Historical records that lack one or more fields remain explicitly legacy/unscoped. C9 may validate their internal historical consistency under their original contract version, but must not mark them as a canonical six-part branch or manufacture missing provenance.

A mixed chain containing legacy and canonical records is rejected for canonical validation unless a separately approved, explicit adapter supplies traceable provenance without rewriting the original records.

## 5. Required input graph

A canonical C9 branch input includes:

### 5.1 Curriculum and registry
- exact curriculum registry version;
- skill, development and claim definitions;
- target-to-claim/development mapping under that registry version;
- task definition and task-to-skill/registry binding;
- contract/version references needed to interpret the records.

### 5.2 Raw observation
- immutable raw observation ID and source-event identity;
- learner and registry/skill context;
- task/task-instance/attempt provenance;
- learner event timestamp and capture provenance;
- original payload reference and schema version.

### 5.3 Target assessment/coding
For every assessment included in the branch:
- target-assessment record ID/version;
- source observation ID;
- evidence target ID;
- registry-resolved claim/development;
- C3 codebook/schema version;
- coder, round, adjudication and supersession provenance where applicable;
- assessment status and creation/availability timestamp.

C9 validates references and provenance presence; it does not decide whether a coding judgement is scientifically correct.

### 5.4 Scope, time window and frozen snapshot
- immutable scope ID/version and definition reference;
- immutable time-window ID/version and definition reference;
- full six-part branch identity;
- decision snapshot ID;
- event-time interval and boundary semantics;
- assessment-availability cutoff;
- exact eligible observation IDs;
- exact eligible target-assessment/coding record IDs and versions;
- explicit exclusion references/reasons for associated but ineligible records;
- C3, C6 and registry version references.

### 5.5 C6, C7 and C8
- C6 evaluation ID and exact branch result;
- C7 decision ID, exact C6 evaluation reference and exact branch identity;
- C8 contract version and single-branch history containing the exact snapshot/C6/C7 lineage;
- if a cross-branch projection is supplied, its distinct projection type and complete list of source branch identities.

## 6. Identity and lineage validation

C9 must verify all of the following for each branch:

1. The six branch fields are present and identical in the snapshot, C6 result, C7 decision and C8 parent/history item.
2. Registry version resolves the supplied skill, claim, development and evidence-target mapping.
3. The claim/development pair is valid under the exact registry version and scope.
4. Every target assessment belongs to the supplied raw observation and resolves to the branch's claim/development under that registry version.
5. Every source observation belongs to the learner and task/skill context permitted by the branch and registry.
6. A target assessment is never counted as a separate raw observation.
7. Shared raw observations across branches retain the same observation ID and immutable payload identity.
8. The scope definition version matches the snapshot and all included assessments satisfy its eligibility rules.
9. The time-window definition version and event-time boundaries match the snapshot.
10. Observation event time, not coder-entry time, determines event-window eligibility.
11. Assessment availability cutoff is enforced; a later coding/adjudication record cannot appear in an earlier frozen snapshot.
12. Every included target assessment and coding version is explicitly listed in the snapshot.
13. Excluded associated records carry explicit exclusion reasons; exclusion does not silently disappear.
14. C6 references the exact snapshot and returns the same six-part identity.
15. C7 consumes the exact C6 evaluation/branch and preserves all six identity fields.
16. C8 history item references the exact snapshot, C6 evaluation and C7 decision.
17. C8 single-branch history contains no item from another scope/window/registry/claim/development/learner branch.
18. C8 latest state is a faithful projection of the latest committed C6/C7 item in that branch; it is not a newly computed decision.
19. Any cross-branch descriptive projection retains each source branch identity and does not claim a merged mastery state.
20. No stage silently repairs missing or conflicting identity/provenance.

## 7. Multi-target and shared-observation rules

C9 must support one raw observation referenced by multiple target assessments and multiple decision branches, provided each assessment has a valid target/registry relationship.

It must enforce:
- one administration → one raw observation;
- each target assessment references exactly one source observation and one target under one coding version/provenance record;
- multiple coder records for one target/observation do not create additional learner observations;
- one shared source observation may be referenced in multiple branch snapshots;
- each branch has its own assessment eligibility and C6/C7/C8 lineage;
- source observation identity is not duplicated to satisfy a one-target legacy interface;
- no branch may borrow another branch's mastery or next-action result.

A task's primary claim/development field cannot be used as a substitute for target-specific ownership when its targets legitimately span branches.

## 8. Snapshot and lifecycle validation

C9 validates the snapshot as an immutable boundary, not as a mutable query over current data.

For each snapshot, it checks:
- scope/window definition versions and approval references;
- event-time interval and inclusivity;
- assessment availability cutoff;
- exact eligible source observation IDs;
- exact eligible target-assessment/coding record IDs and versions;
- exact C3, C6 and registry versions;
- explicit exclusion reasons;
- stable snapshot identity and replay consistency.

A later assessment, recoding, adjudication or correction must produce a new snapshot/evaluation when included. It cannot alter the old snapshot or historical C6/C7/C8 records.

Window lifecycle labels (for example OPEN, CLOSED, FINALIZED) are validated only against the approved lifecycle contract. Closure/finalization does not itself prove sufficient evidence or mastery.

## 9. Multiple branches and higher-level projections

C9 accepts a collection of branches as a validation request only if each branch is validated independently.

A collection-level result may report:
- number of branches checked;
- per-branch validation result;
- shared source observation references;
- explicit branch identity differences;
- structural errors grouped by branch and provenance stage.

It must not produce a combined C6 state, combined C7 action or pooled C8 mastery history.

A C8 higher-level cross-branch descriptive projection may be checked for structural preservation of source identities, but C9 does not validate its empirical interpretation or permit it to create a new mastery result.

## 10. Output contract

C9 returns:
- validator contract/version;
- validation timestamp and input package identity;
- per-branch result keyed by the supplied full identity (not claim ID alone);
- explicit checks with pass/fail and referenced record IDs;
- explicit error codes/stage attribution for mismatches;
- shared-observation reference map without duplicate observation cardinality;
- legacy/unscoped status where applicable;
- explicit permissions/negative permissions.

A failure must identify the exact stage and record relationship. C9 does not repair data, select a target, infer a missing branch or silently drop an invalid item.

### 10.1 Required negative permissions

The validator output explicitly confirms that validation does not authorize:
- empirical validity claims;
- developmental-ordering or prerequisite inference;
- mastery creation or override;
- next-action selection or override;
- automatic learner advancement;
- runtime learner-state mutation;
- curriculum registry promotion;
- evidence pooling across branches;
- rewriting historical observations, assessments, snapshots or decisions.

## 11. Required rejection conditions

A canonical branch is structurally invalid when:
1. any of the six identity fields is missing, unresolved or mismatched;
2. registry version does not resolve the supplied skill/claim/development/target mapping;
3. target assessment points to a missing or different source observation;
4. assessment target does not resolve to the branch claim/development;
5. scope or time-window definition version differs from the snapshot;
6. observation event time is outside the approved window;
7. assessment availability is later than the snapshot cutoff;
8. snapshot omits eligible records or includes ineligible records without explicit policy/reason;
9. C6 evaluation references another snapshot or branch;
10. C7 consumes another C6 evaluation or changes branch identity;
11. C8 item references another snapshot/C6/C7 lineage;
12. a C8 single-branch history contains mixed branch identities;
13. the same observation is duplicated as multiple raw observations to represent target cardinality;
14. duplicate IDs carry conflicting immutable payloads;
15. a cross-branch projection drops source identities or returns pooled mastery/action;
16. legacy/unscoped provenance is silently upgraded;
17. any component attempts silent repair or unsupported permission escalation.

## 12. Required contract tests before implementation

At minimum:

1. A fully identified single-target branch validates.
2. One observation with two valid target assessments validates as two isolated branches with one shared observation ID.
3. Shared observation ID does not inflate raw observation or independence counts.
4. Mismatched learner identity is rejected.
5. Mismatched registry version is rejected.
6. Mismatched claim or development is rejected.
7. Mismatched scope or time window is rejected.
8. Missing scope/window version or snapshot ID is rejected.
9. Assessment outside scope is rejected or explicitly excluded according to the approved contract.
10. Event time, not coder timestamp, determines window eligibility.
11. Late coding after snapshot cutoff cannot enter the old snapshot.
12. New coding creates a new snapshot/evaluation without changing old history.
13. C6 snapshot/branch mismatch is rejected.
14. C7 exact-C6 evaluation mismatch is rejected.
15. C8 exact snapshot/C6/C7 lineage mismatch is rejected.
16. Mixed identities in one C8 branch history are rejected.
17. A multi-branch validation collection reports per-branch results without pooling.
18. Cross-branch descriptive projection preserves all source identities and cannot create mastery.
19. Historical legacy chain is marked legacy/unscoped and is not promoted to canonical status.
20. Duplicate immutable IDs with conflicting payloads are rejected.
21. Validation failure identifies the exact stage and source references.
22. No runtime write, automatic advancement or registry promotion permission is granted.

## 13. Compatibility and migration boundary

C9 v0.1 did not require registry-version/time-window identity or frozen snapshot linkage at every stage. It remains a historical validator contract.

A compatibility validator may validate old records under v0.1 rules and label the result with the historical contract version. It must not report a v0.1 chain as a canonical v0.2 six-part branch.

A canonical v0.2 validation requires full identity and snapshot lineage. Missing historical data remains missing; it is not filled from current registry state, current scope policy, task metadata or inferred timestamps.

## 14. Status and approval gate

C9 v0.2 is a proposed structural-validation contract, not an approved production/runtime specification.

Owner review is required for scope/window lifecycle decisions and C3 target-assessment/coder provenance. The integrated multi-target contract, C6/C7 exact snapshot linkage, branch-ID serialization and legacy compatibility must be reconciled before implementation.

No code, tests, task catalogue, registry, learner state, SQL, schema, RPC, RLS, Supabase or learner data changes are authorized.

Before implementation:
1. approve scope/window ownership and lifecycle;
2. approve the C3 target-assessment and coder-provenance boundary;
3. reconcile C6/C7 snapshot and branch identity contracts;
4. approve canonical branch-ID serialization and legacy compatibility;
5. complete physical persistence/read-model and atomicity design;
6. run Full Regression on the exact branch head before implementation.
