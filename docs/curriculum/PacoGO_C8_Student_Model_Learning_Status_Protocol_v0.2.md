# PacoGO C8 — Student Model / Learning Status Protocol v0.2

Status: versioned design proposal / owner review required / NOT approved for implementation  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Design baseline: Full Regression #3035 / run ID `42242645809` GREEN on `a98c46458d1d14ee55ae73b8dd977abe5ad86953`

## 1. Purpose

C8 defines the temporal learner-model layer between exact C6 mastery evaluations, exact C7 next-action decisions and later learner-facing orchestration.

This v0.2 proposal reconciles C8 with:
- the six-part C6–C9 decision-branch identity;
- immutable scope and time-window definitions;
- staged raw-observation, target-assessment/coding and decision-evaluation lifecycles;
- frozen evidence/assessment snapshots;
- multi-target observations that may legitimately feed separate decision branches.

C8 remains descriptive. It does not create mastery, infer developmental order, select actions, or turn cross-window comparisons into a new mastery result.

This document supersedes v0.1 as the proposed forward contract; v0.1 remains historical. It does not authorize implementation, persistence, schema, registry, SQL, RPC, RLS or Supabase changes.

## 2. Position in the chain

`curriculum → skill → development → claim → task → learner performance → raw observation → target assessment/coding → frozen decision snapshot → C6 mastery → C7 next action → C8 temporal learner model → C9 structural validation`

C8 consumes committed C6/C7 outputs and their provenance. It is not a replacement for C6 or C7.

## 3. Normative principles

1. Every canonical C8 branch is identified by all six branch fields in Section 4.
2. C8 consumes only explicit, validated C6 evaluations and their exact C7 decisions.
3. Each C8 branch history contains decisions from one exact branch identity; no identity field may vary within it.
4. Every history item references an immutable decision snapshot and the exact assessment/coding versions used by that snapshot.
5. Later coding, adjudication or evidence capture never rewrites an earlier snapshot, C6 result, C7 result or C8 item.
6. A new snapshot for the same branch is a new historical item, not an update to a previous decision.
7. A changed scope or time window creates a different branch identity.
8. A shared raw observation may be referenced by multiple target assessments and multiple branch histories, but remains one source observation.
9. Missing, contradictory, insufficient, not-assessed and legacy/unknown states remain explicit; C8 does not normalize them into a hidden conclusion.
10. C8 reports descriptive temporal information only. It does not make empirical, causal, mastery-validity or developmental-order claims.
11. C8 does not mutate runtime learner state, promote registry entries, or select a new action.

## 4. Canonical branch identity

A canonical C8 branch requires this complete tuple:

- `learner_key`
- `curriculum_registry_version_id`
- `claim_id`
- `development_id`
- `scope_id`
- `time_window_id`

All six values are required, non-empty and resolvable to the exact immutable/versioned definitions used by the evaluation.

A derived `decision_branch_id` may be supplied as a convenience only when produced by the separately approved canonical serialization contract. The six inspectable fields remain mandatory; a hash is never a substitute.

Task, task-instance, attempt, observation, target-assessment, coder, coding-round, adjudication and source-event IDs are provenance references, not branch identity.

### 4.1 Branch consistency

A branch history rejects any item whose six-part identity differs from the parent branch. It must not:
- select a “primary” target or branch;
- infer a missing scope/window from a task, skill, date or current session;
- merge records by claim ID alone;
- treat skill identity as a substitute for claim/development identity;
- silently migrate legacy skill-level records into canonical branches.

Historical records missing one or more branch fields remain explicitly legacy/unscoped and outside canonical branch summaries until separately justified provenance or a new, explicitly linked assessment exists. C8 must not fabricate missing identity.

## 5. C8 input contract

A canonical C8 branch input contains:

### 5.1 Branch definition
- all six branch identity fields;
- exact registry version reference;
- immutable scope definition ID/version;
- immutable time-window definition ID/version;
- C8 contract version.

### 5.2 Decision history items

Each item represents one committed decision evaluation and contains:

- `c8_item_id` — stable unique history-item identity;
- `decision_branch` — exact six-part identity;
- `decision_snapshot_id` — immutable snapshot identity;
- `c6_evaluation_id` — exact C6 evaluation consumed;
- `c7_decision_id` — exact C7 decision linked to that C6 evaluation;
- `evaluated_at` — validated decision timestamp;
- `event_time_start` and `event_time_end` — snapshot event-time boundaries;
- `assessment_available_cutoff` — latest assessment/coding availability admitted to the snapshot;
- `source_observation_ids[]` — unique raw observations contributing to this branch snapshot;
- `target_assessment_record_ids[]` — exact target-specific assessment/coding records and versions;
- `mastery_state` — exact C6 output, preserved without reinterpretation;
- `next_action` — exact C7 output, preserved without reinterpretation;
- `evidence_state` and explicit insufficiency/contradiction indicators;
- registry, C3 codebook/schema, C6 and C7 protocol/implementation version references;
- provenance/status for exclusions, corrections, supersession or adjudication where relevant.

The item is a reference-bearing history record, not a copy of raw evidence or a newly inferred learner state.

### 5.3 Lifecycle status

C8 preserves the lifecycle status supplied by the authoritative scope/window and snapshot lifecycle. Proposed labels such as OPEN, CLOSED and FINALIZED are not interpreted as mastery states or evidence-sufficiency outcomes.

A C8 implementation must not invent lifecycle transitions.

## 6. Temporal ordering and snapshot semantics

- Decision items are ordered by validated `evaluated_at`, with a deterministic tie-breaker using stable item/evaluation identity.
- Caller array order is never authoritative.
- Event timestamps determine observation eligibility under the approved time-window definition; assessment/coding timestamps determine whether a record was available by the snapshot cutoff.
- The latest C8 item is the latest committed decision item in the exact branch history, not necessarily the observation with the latest event timestamp.
- A later coding batch or adjudication can contribute only to a later immutable snapshot/evaluation.
- A replay of the same snapshot/evaluation is idempotent; a conflicting payload under the same identity is rejected.
- C8 retains superseded or invalidated decisions as auditable history with explicit status; it does not erase or rewrite them.

## 7. Single-branch temporal summary

C8 may return a descriptive summary for exactly one six-part branch:

- `decision_branch` — all six identity fields;
- `history_item_count`;
- `first_evaluated_at`;
- `last_evaluated_at`;
- `latest_c6_evaluation_id`;
- `latest_c7_decision_id`;
- `latest_decision_snapshot_id`;
- `current_mastery_state` — exact latest C6 state, not a new inference;
- `current_next_action` — exact latest C7 action, not a new decision;
- `mastery_state_counts`;
- `evidence_state_counts`;
- `contradictory_item_count`;
- `insufficient_evidence_item_count`;
- `not_assessed_item_count`;
- `distinct_observed_mastery_states`;
- `temporal_coverage` — descriptive evaluated-time and event-time coverage, with units and boundaries explicit;
- `source_observation_ids` and `target_assessment_record_ids` needed to audit the summary.

Empty canonical history is valid and returns `NOT_ASSESSED` for the summary's current state, with no implied evidence of absence.

The summary must not label a learner as improving, declining, ready, behind, advanced or mastered beyond the exact latest C6 state. Counts and spans are descriptive, not evidence of trend or causation.

## 8. Higher-level cross-branch descriptive projection

C8 may optionally expose a separate higher-level history projection across related branches, for example across successive operational time windows.

This is not a canonical branch history and must be typed/named distinctly from the single-branch summary.

A cross-branch projection may group records only while retaining, for every included item:
- its full six-part branch identity;
- scope and time-window definition versions;
- exact snapshot, C6 evaluation and C7 decision IDs;
- source observation and target-assessment references;
- event-time and assessment-availability boundaries;
- lifecycle and supersession status.

The projection may report descriptive comparisons such as the sequence of separately evaluated states across windows. It must not:
- pool observations or target assessments across branches;
- recompute coverage, stability or mastery across windows;
- create a combined/current mastery state;
- select or merge next actions;
- treat overlapping windows as independent replications;
- infer developmental progress, causal change or durable learning;
- erase differences in scope, registry version or time-window definition.

If registry version, claim or development differs, the projection must make that difference explicit and may not imply a continuous same-construct history without an independently specified mapping. A scope change is also visible and cannot inherit the prior branch's mastery as if the evidence universe were unchanged.

## 9. Required invariants and rejection conditions

A canonical C8 evaluation rejects or quarantines from canonical summaries:

1. missing or unresolved branch identity fields;
2. mismatch in any of the six fields between parent, item, C6, C7 or snapshot;
3. missing snapshot, C6 evaluation or C7 decision reference;
4. C7 decision that does not consume the exact C6 branch/evaluation;
5. target assessment not linked to a supplied raw observation;
6. assessment/coding record unavailable at the snapshot cutoff;
7. observation outside the approved scope or event-time window;
8. duplicate item/evaluation identity with conflicting payload;
9. non-unique observation or assessment references where uniqueness is required;
10. caller-supplied order that conflicts with validated timestamps;
11. attempt to pool distinct branch histories into one mastery result;
12. attempt to assign legacy/unscoped history to a canonical branch without provenance.

C8 does not repair inconsistent input. It returns explicit validation failures so the cause can be isolated.

## 10. Boundaries and permissions

C8 must not:
- create or modify C6 mastery decisions;
- override a C6 state;
- create or modify C7 next-action decisions;
- infer developmental ordering or prerequisites;
- infer learning gains, retention, transfer or causal effects;
- automatically advance a learner;
- mutate runtime learner state;
- promote curriculum registry candidates;
- rewrite raw observations, target assessments, coder records or frozen snapshots;
- reinterpret operational decision windows as scientific measurement waves.

Any later product orchestration or scientific longitudinal analysis consuming C8 must have its own explicit contract, validation and permissions.

## 11. Required contract tests before implementation

At minimum:

1. All six branch identity fields are required and preserved exactly.
2. Any mismatch in learner, registry version, claim, development, scope or time window is rejected.
3. Two histories differing only by time-window ID remain separate.
4. Two histories differing only by scope ID remain separate.
5. A shared raw observation may be referenced in two valid branches without being duplicated or counted as two observations.
6. One branch history cannot contain two different snapshot scope/window versions.
7. C8 item references the exact snapshot, C6 evaluation and C7 decision.
8. C7/C6 branch and evaluation mismatch is rejected.
9. Late coding is excluded from an earlier cutoff and may appear only in a later snapshot.
10. A later snapshot does not mutate an earlier history item or decision.
11. Same snapshot replay is idempotent; same identity/different payload is rejected.
12. Latest item is determined by validated evaluation timestamp and stable tie-breaker, not array order.
13. Empty history returns NOT_ASSESSED without inventing evidence.
14. Contradictory, insufficient, not-assessed and legacy/unscoped records remain explicit.
15. Cross-window descriptive projection retains all source branch identities.
16. Cross-branch projection never pools evidence or returns a new mastery/next-action decision.
17. Overlapping windows are not labelled independent replications.
18. Operational time windows are not represented as scientific measurement waves by default.
19. No runtime state write, automatic advancement or registry promotion is enabled.

## 12. Compatibility and migration boundary

C8 v0.1 records only learner, claim, development and scope at the parent level and lacks registry-version/time-window identity and frozen snapshot linkage. It is not silently upgraded.

A compatibility adapter may read v0.1 histories as legacy records, preserving their original payload and contract version. It may expose only the fields actually present and must mark missing branch dimensions and snapshot provenance as unknown/legacy. It must not:
- infer registry version from current registry;
- infer time window from timestamps or current policy;
- assign a scope/window retrospectively;
- convert a legacy summary into a canonical six-part branch;
- use legacy values to overwrite canonical branch state.

Any deliberate re-assessment of historical source evidence under a newly approved scope/window requires a new explicit snapshot/evaluation with traceable provenance; it is not a migration of the old C8 record.

## 13. Status and approval gate

C8 v0.2 is a proposed contract reconciliation, not an approved production/runtime specification.

Owner review is still required for the Scope and Time-Window Lifecycle Contract and the unresolved C3 codebook v0.2 decisions. Exact canonical branch-ID serialization, persistence/read-model design, legacy consumer behavior and the integrated C3/C6–C9 contract remain open.

No code, tests, task catalogue, registry, learner state, SQL, schema, RPC, RLS, Supabase or learner data changes are authorized by this document.

Before implementation:
1. approve the scope/window owner decisions and lifecycle;
2. approve the C3 target-assessment/coder provenance boundary;
3. reconcile this contract with C6/C7 exact snapshot identity and the integrated multi-target contract;
4. settle canonical branch-ID serialization and legacy projection semantics;
5. complete the physical persistence/read-model and atomicity design;
6. check Full Regression on the exact branch head before any implementation step.

## G5-S3 — Official logical Stage C identity field names

**Owner decision: approved 2026-11-08.** The official logical field names are:

- `decision_snapshot_id` — identity/reference for the immutable decision snapshot;
- `c6_evaluation_id` — identity/reference for the immutable C6 mastery evaluation;
- `c7_decision_id` — identity/reference for the immutable C7 next-action decision.

O8's `evaluation_id` is the generic historical/source term for the C6 evaluation identity; it is not a second identity and must be interpreted as `c6_evaluation_id` in the reconciled cross-stage logical contract. C7's own decision identity is distinct and is named `c7_decision_id`.

This approval standardizes **logical field names only**. It does not decide physical ID formats, generation, namespaces or uniqueness scopes, database columns/keys/tables, serialization, hashing, storage, transactions, retry/concurrency mechanics or persistence APIs. Those remain assigned to their existing G6/G9/G8/G10 gates.

This decision resolves only G5's logical field-naming item. It does not close G5, G6 or G9; does not alter the approved Stage C record/write boundary; and does not authorize runtime, tests, schema, SQL/RPC/RLS, database or Supabase changes. G12 remains NOT AUTHORIZED.
