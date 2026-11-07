> **CORRECTION REQUIRED — DO NOT IMPLEMENT CODER PROVENANCE OR LATE HUMAN CODING.** This lifecycle candidate incorrectly includes coder IDs, coding rounds and adjudication as if they were part of learner evidence processing. PacoGO is the single operational assessor; no human coder stage exists in learner runtime. Replace these references with PacoGO assessment-version provenance and assessment-availability timing. Event time and assessment-availability cutoff may remain distinct concepts, but late human coding is not a learner-pipeline lifecycle event.

# PacoGO — Scope and Time-Window Lifecycle Contract v0.1

Status: design proposal / owner review required / NOT approved for implementation  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Starting commit: `663d434804ba113cb0f3a4e46d2d96ba4da3d365`  
Full Regression #3033: GREEN on the exact starting commit

## 1. Purpose

This contract defines the lifecycle and identity requirements for the `scope_id` and `time_window_id` consumed by C6 mastery decisions and carried through C7, C8 and C9.

The purpose is to prevent evidence from different decision questions or temporal cohorts from being silently pooled, while allowing the system to compare successive decision snapshots without rewriting history.

This is a design proposal. It does not authorize runtime implementation, schema changes, database migrations, Supabase changes, registry changes, or changes to C6 mastery gates and C7 action policy.

## 2. Current protocol facts and gap

### C6
C6 defines mastery as claim-, development-, scope- and time-bound. It requires scope and coverage requirements to be explicit inputs and stability to be evaluated within a predefined temporal scope. It does not define who creates or versions a scope/window, how observations enter or leave a window, or how a window closes.

### C7
C7 consumes scope and time-window context and must preserve the C6 decision context. It must not invent missing ordering information or recompute mastery.

### C8
C8 currently requires learner, claim, development and scope identity, and orders supplied observations by timestamp. It does not include `curriculum_registry_version_id` or `time_window_id` in its parent record. This is insufficient for the proposed six-part decision branch identity unless C8 is explicitly versioned and reconciled.

### C9
C9 checks identity continuity through C8 but its current protocol lists learner/claim/development/scope consistency without the full registry-version/time-window tuple. It must be updated before multi-branch implementation.

### Scientific validation
The Validation Data Specification requires repeated measurement occasions, explicit timing, exposure history, missingness/attrition handling and pre-specified longitudinal analysis. A runtime time window must not be mistaken for a scientifically justified longitudinal study design.

## 3. Definitions

### 3.1 Scope

A **decision scope** is a versioned specification of the evidence universe and decision question for one claim/development branch.

It defines, as applicable:
- the claim/development context to which evidence may contribute;
- eligible evidence targets and target-specific assessment versions;
- eligible task/variation dimensions and exclusions;
- required coverage dimensions supplied to C6;
- relevant support/assistance and evidence-quality eligibility rules by reference to approved C3/C6 contracts;
- the intended decision purpose and known limitations.

A scope is not:
- a learner level;
- a task instance;
- a browser session;
- a UI page or Learning Interface;
- an arbitrary grouping of whatever evidence happens to be available;
- a hidden mastery threshold.

Scope does not redefine curriculum meanings, claim ownership, target mappings, development ordering or C6 gates.

### 3.2 Time window

A **decision time window** is a versioned temporal boundary that determines which observation/assessment events are eligible for one bounded C6 decision snapshot.

It defines:
- temporal start and end boundaries;
- the timestamp field and clock authority used;
- boundary inclusivity;
- the applicable time zone or UTC normalization rule;
- event eligibility and late-arrival policy;
- lifecycle status and closure/reopening rules.

A time window is not automatically:
- the last N days;
- the current school term;
- the time since the learner's last login;
- the duration of one browser session;
- a fixed number of task attempts.

Any of those may be used only if a separately approved scope/window policy explicitly defines it.

## 4. Identity and versioning

### 4.1 Six-part decision branch

The canonical branch identity remains:

1. learner key;
2. curriculum registry version ID;
3. claim ID;
4. development ID;
5. scope ID;
6. time-window ID.

All six values are required and must resolve to active, immutable, versioned definitions at decision evaluation time.

Task ID, task-instance ID, task-attempt ID, observation ID, evidence-target assessment ID, coder ID, coding-round ID and source-event ID are provenance references. They are not branch identity fields.

### 4.2 Immutable definitions

A scope definition and a time-window definition are immutable once referenced by a committed decision evaluation.

If the meaning or configuration changes, create a new version/new identifier. Do not mutate the definition behind an existing ID.

A branch ID is therefore tied to the exact scope and time-window versions, not merely to human-readable labels such as "practice" or "last month".

### 4.3 Scope compatibility

Every target assessment included in a decision snapshot must be eligible under the referenced scope definition. Eligibility must be determined explicitly and auditable; it must not be inferred solely from the task's primary claim or skill.

A scope may include several evidence targets only when each target has a valid registry-resolved claim/development ownership and the decision branch remains singular for one claim/development. Evidence for another claim/development is evaluated in its own branch.

### 4.4 Time-window compatibility

An observation's event timestamp determines temporal eligibility under the window definition. Coding/assessment timestamps are separately retained and must not silently replace the time of the learner event.

The decision snapshot must record both:
- observation event-time eligibility;
- assessment availability/cut-off used to freeze the evidence set.

This prevents an assessment entered later from appearing as if it had been available to an earlier decision.

## 5. Lifecycle

### 5.1 Definition and activation

A scope/window definition is authored and approved before it is used for a mastery decision. It must have:
- stable ID and version;
- owner/approval provenance;
- effective status;
- definition timestamp;
- explicit references to the relevant C3/C6 contract versions;
- documented inclusion/exclusion and boundary rules.

The engine validates references and eligibility. It does not author a scope or infer a time window from current data.

### 5.2 Observation ingestion

A raw observation is persisted once with immutable event-time provenance.

At ingestion, the system may record candidate scope/window associations only if the relevant policy explicitly allows them. Such associations are not evidence of mastery and do not imply that a decision has been evaluated.

The raw observation must remain available for later approved assessments and decision snapshots, subject to privacy, retention and deletion policies.

### 5.3 Target assessment and coding

Target-specific C3 assessments and coder records may arrive after observation ingestion.

Each assessment records:
- source observation ID;
- target and registry-resolved claim/development;
- codebook/schema version;
- coder and coding-round provenance where applicable;
- assessment creation time;
- status and adjudication lineage.

A late assessment may be eligible for a later decision snapshot but must not be retroactively represented as available to a previously frozen snapshot.

### 5.4 Decision snapshot

A C6 evaluation consumes a frozen snapshot containing:
- the complete six-part branch identity;
- scope definition version;
- time-window definition version;
- event-time range;
- assessment availability cut-off;
- exact eligible observation IDs;
- exact target-assessment/coding record IDs and versions;
- C3 codebook/schema version;
- C6 protocol/implementation version;
- registry version;
- explicit exclusion reasons for otherwise associated records.

The snapshot is immutable. A changed evidence set, late assessment, changed coding/adjudication, changed scope or changed window produces a new snapshot and a new evaluation record. It never rewrites the old decision.

### 5.5 Window closure

A window may be marked:
- `OPEN`: new eligible observations and assessments may be considered in future snapshots;
- `CLOSED`: the event-time interval is closed to new observations under the defined policy, but late coding of already captured observations may still be accepted for a later snapshot if the policy permits;
- `FINALIZED`: no additional records are accepted into this decision cohort; a new evaluation requires an explicitly versioned successor/research protocol.

These lifecycle labels are proposed, not yet approved. A closed window does not itself imply mastery, sufficient evidence or a final C6 result.

### 5.6 Late-arriving records and corrections

The protocol owner must distinguish:
- late observation ingestion (event occurred in the window but arrived after closure);
- late target assessment/coding (observation exists, assessment arrives later);
- correction of a technical capture error;
- legitimate recoding under a new codebook version.

No historical raw observation or coder record is silently overwritten. Corrections are append-only and linked to the superseded/invalidated record with reason and actor provenance. Whether a closed window can accept late observations is a policy choice; default recommendation is no, unless a documented grace period is part of the window definition. Late coding of already ingested observations may be allowed until finalization, but only in a new snapshot.

## 6. Overlap and succession

### 6.1 Overlapping windows

Overlapping windows are technically possible but create correlated evidence sets. They must not be treated as independent replications or independent mastery confirmations.

Default recommendation: do not create overlapping operational windows for the same claim/development/scope unless the research or product question requires overlap and the analysis plan explicitly accounts for dependence.

### 6.2 Successive windows

A new time window creates a new six-part branch identity. It does not overwrite the prior branch.

C8 may provide a longitudinal view across successive branches only through an explicitly specified learner/development history projection that retains each source branch identity and its exact C6/C7 snapshot. It must not merge the evidence pools and then recompute a single mastery state across windows.

### 6.3 Scope changes

A changed scope creates a new scope ID/version and therefore a new branch identity. A new scope cannot inherit the old branch's mastery result as if the evidence universe were unchanged.

Prior evidence may be re-evaluated under the new scope only by creating a new immutable decision snapshot that states which old observations/assessments are eligible under the new definition.

## 7. C6–C9 contract consequences

### 7.1 C6
C6 must receive explicit scope and time-window definitions, not only opaque IDs. It validates that all supplied evidence belongs to the branch and snapshot. It returns the same six-part identity with each gate result and decision trace.

C6 must not:
- create or extend windows;
- select a scope based on available evidence;
- include late assessments in an earlier frozen snapshot;
- pool evidence across branch identities;
- treat window closure as evidence sufficiency.

The seven existing C6 gates and their decision order remain unchanged.

### 7.2 C7
C7 consumes the exact C6 branch identity and snapshot reference. Its decision trace preserves both scope and time-window IDs. It cannot blend next actions across branches. Any cross-branch orchestration is a later layer and must not alter the underlying branch decisions.

### 7.3 C8
C8 requires a versioned contract update before implementation. Recommended parent identity:
- learner ID/key;
- curriculum registry version ID;
- claim ID;
- development ID;
- scope ID;
- time-window ID.

Each temporal observation/decision item references:
- C6 evaluation ID and exact snapshot ID;
- C7 decision ID;
- source branch identity;
- observed/evaluated timestamps;
- supporting evidence/assessment IDs.

C8 may summarize one branch's temporal decision history. To compare successive windows, a separate higher-level longitudinal projection groups related branches by learner/registry/claim/development and explicitly lists the scope/window identities. It does not erase them or produce new mastery.

This is a proposed extension beyond C8 v0.1 and requires a new C8 contract version.

### 7.4 C9
C9 validates the full six-part branch identity from target assessment through C6/C7/C8. A branch is structurally invalid if any component is missing or differs across the linked records.

C9 may validate several branches that reference one raw observation, but each branch is checked independently. Shared observation identity does not make the branch identities interchangeable.

C9 remains a structural validator and does not establish empirical validity.

## 8. Operational versus scientific time

The operational C6 window is a decision boundary. It is not automatically a valid measurement occasion for scientific research.

Scientific validation must separately pre-specify:
- measurement waves and their spacing;
- sample eligibility;
- exposure/intervention history;
- external measures and timing;
- late/missing data rules;
- analysis of overlapping or repeated measures;
- confounders and attrition.

A rolling product window must not be substituted for a research wave without a justified study design.

## 9. Privacy and data minimization

Scope/window definitions and snapshots must retain only the identifiers and timing data necessary for the stated decision/research purpose.

Do not add demographic, behavioural or sensitive variables to a scope merely because they may be useful later. Child-data governance, retention, access and deletion policies remain mandatory and apply to raw observations, coding records, snapshots and derived branch state.

## 10. Required contract tests before implementation

At minimum:

1. Missing scope or time-window identity is rejected for a canonical C6 branch.
2. A scope/window ID resolving to a different immutable version is rejected.
3. Target assessments outside the scope are excluded with an explicit reason.
4. Evidence from another claim/development cannot enter the branch.
5. Event time, not coder-entry time, determines event-window eligibility.
6. Assessment availability cut-off prevents later coding from leaking into an earlier snapshot.
7. A late assessment creates a new snapshot/evaluation and does not rewrite a prior trace.
8. Same snapshot/evaluation replay is idempotent; conflicting payload under the same ID is rejected.
9. Closing/finalizing a window does not itself create a mastery outcome.
10. A changed scope or window creates a new branch identity.
11. Overlapping windows do not inflate independence or masquerade as independent replications.
12. Successive windows remain separately traceable in C8.
13. C8 cannot summarize a mixed set as one branch when scope/window identities differ.
14. C9 rejects any mismatch in the six-part branch identity.
15. Historical single-target records remain readable without fabricated scope/window provenance; they are explicitly marked legacy/unscoped and cannot be silently upgraded to canonical branches.

## 11. Decisions requiring owner approval

The following cannot be safely settled by technical inference:

1. Who is authorized to define and approve operational scopes and windows?
2. Are operational windows fixed, rolling, event-defined, or selected per decision purpose?
3. Which timestamp is authoritative for event time, and what time-zone normalization applies?
4. Are late-arriving observations ever accepted after closure? If so, what grace period and audit status?
5. Until when may late C3 coding/adjudication be included in a new snapshot?
6. Are overlapping windows prohibited by default, or allowed for specified use cases?
7. Which scope dimensions are mandatory per C6 claim/development, and which are supplied by the registry versus a separate decision protocol?
8. How should C8 present successive windows to a learner-facing/product layer without implying new mastery?
9. What retention and deletion rules apply to closed/finalized snapshots and linked child-data records?

## 12. Recommended defaults pending approval

For review, not implementation:
- immutable, versioned scope and time-window definitions;
- no inferred rolling windows;
- event timestamp determines temporal membership;
- a separate assessment-availability cut-off freezes each decision snapshot;
- no late observation after closure by default;
- late coding of an already captured observation may enter only a later snapshot until finalization;
- changed scope/window creates a new branch;
- overlapping windows are discouraged unless explicitly justified;
- C8 preserves separate branches and offers only a descriptive higher-level comparison;
- legacy records lacking provenance remain legacy/unscoped.

## 13. Non-goals and implementation gate

This proposal does not set a universal window duration, coverage threshold, stability threshold, sample size, mastery rule, C7 action policy or scientific validation criterion.

It does not authorize runtime, test, registry, catalogue, database, SQL, RPC, RLS or Supabase changes.

Before implementation:
1. approve the owner decisions in Section 11;
2. reconcile C8 and C9 into versioned contract updates;
3. update the integrated multi-target decision contract to include staged observation/coding/decision snapshots and full branch identity;
4. approve the C3 codebook/schema decisions separately;
5. complete exact compatibility and persistence design;
6. only then run the pre-build Full Regression gate and consider a pure runtime contract slice.
