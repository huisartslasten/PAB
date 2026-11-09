# PacoGO G5 — C6/C7/C8/C9 Protocol and Rejection Crosswalk Audit v0.1

**Status:** source-derived reconciliation audit; draft for owner review; not a frozen cross-stage contract and not implementation authorization.  
**Date:** 2026-11-09  
**Branch:** `refactor/professional-v1`  
**Purpose:** reconcile the current protocol versions, stage-specific rejection/validation responsibilities, O6/C3 assessment provenance, examples and legacy boundaries after the owner-approved C8 projection decision.

## 1. Authority and source set

This audit reads the following branch documents without changing them:

| Source | Current status in source | Role in this audit |
|---|---|---|
| C6 Mastery Decision Protocol v0.1 | Candidate protocol; includes owner-approved Stage C record/identity amendments | Mastery gates, outcomes and C6 record boundary |
| C7 Next-Action Decision Protocol v0.2 | Candidate protocol; includes owner-approved Stage C record/identity amendments and source-reconciled HOLD clarification | Candidate actions, gates and exact C6 consumption |
| C8 Student Model / Learning Status Protocol v0.2 | Design proposal; not approved for implementation | Descriptive branch history, projection inputs and legacy behavior; superseded where it conflicts with the approved C8 logical boundary |
| C9 Vertical Learning Chain Validation Protocol v0.2 | Design proposal; not approved for implementation | Structural validation, stage attribution and historical validation |
| Operational Assessment Contract v0.3 (O6) | Owner-approved, frozen logical contract; G2 closed | Operational assessment dimensions, status layers and required provenance |
| C3 Canonical Codebook Reconciliation Proposal v0.2 | Candidate proposal explicitly superseded for learner-runtime human-coder assumptions | Historical vocabulary conflicts and proposed measurement distinctions only |
| C3 Consolidated Observation/Event/Coding Reconciliation v0.1 | Candidate reconciliation, explicitly superseded for learner-runtime human-coder assumptions | Historical schema/vocabulary conflict inventory only |
| G5/G6/G9 dependency map and G9 source-determined contract | Source-derived working documents | Gate ownership and downstream dependencies |

**Authority rule:** O6 v0.3 is frozen and must not be silently rewritten by this audit. C6/C7/C8/C9 remain versioned candidate protocols except for the explicitly approved logical owner decisions already recorded in the repository. C3 v0.2 is not an approved learner-runtime codebook. A green regression verifies software against its tests; it does not approve these scientific contracts or validate learning claims.

## 2. Decisions already fixed and not reopened

1. The three top-level O7 idempotency boundaries remain raw-observation ingestion, target-assessment evaluation/recording and decision evaluation.
2. Within the existing decision-evaluation boundary, the immutable snapshot, C6 evaluation and C7 decision are distinct logical records. C6 and C7 are separate ordered atomic writes; C7 consumes the exact committed C6 result.
3. Official logical identities are `decision_snapshot_id`, `c6_evaluation_id` and `c7_decision_id`. O8's generic `evaluation_id` means the C6 evaluation identity.
4. C7's only hold candidate is `HOLD_FOR_MORE_EVIDENCE`; explanatory `HOLD` is shorthand, not a second serialized value.
5. Existing C6→C7 adapters and the C8/C9 bridge remain non-canonical prototype/test paths.
6. C8 is an approved derived, descriptive, non-authoritative read projection over committed C6/C7 records. `c8_item_id` is not an authoritative domain identity. C8 has no independent write, idempotency or replay/conflict lifecycle. No fourth O7 top-level boundary exists.
7. PacoGO is the single operational assessor. Human coder rounds, double-coding, adjudication and inter-rater reliability are not learner-runtime workflow requirements. Historical/external coder provenance may be retained only where it genuinely exists and is relevant.
8. G12 remains NOT AUTHORIZED. No runtime, test, registry, learner-state, schema, database, SQL/RPC/RLS, Supabase or learner-data change is authorized by this audit.

## 3. Cross-stage protocol crosswalk

| Stage | Source-determined input / responsibility | Output or status | What it must not do |
|---|---|---|---|
| Raw observation / O7 Stage A | One immutable response episode; raw response, actual administration, ordered events, collection availability and source provenance | Immutable observation with G6 identity/lifecycle; O7 replay/conflict applies at this stage | Infer target assessment, mastery or action; turn missing capture into an incorrect response |
| O6 / O7 Stage B | One raw observation assessed against one existing evidence target; PacoGO applies the approved O6 v0.3 rules | Target-specific assessment with applicability, execution and result kept distinct; exact O6/C3, target-rule and assessment-engine provenance | Reinterpret raw facts as mastery; treat missing/blocked/error as negative learner evidence; invent target mappings |
| Snapshot / O7 Stage C | Exact six-part branch, immutable scope/window versions, event-time membership and assessment-availability cutoff | Immutable `decision_snapshot_id` and exact eligible/excluded source references | Admit late assessment into an earlier snapshot; reconstruct missing identity or provenance |
| C6 | Exact immutable snapshot and its eligible assessment/evidence inputs | Existing C6 outcome and seven-gate trace, with `c6_evaluation_id` | Create mastery from missing/unknown evidence; auto-promote registry or mutate learner state |
| C7 | Exact committed C6 result, same branch/snapshot lineage, explicit ordering states and action policy | One candidate action and decision trace with `c7_decision_id` | Recompute C6; infer missing ordering; convert structural identity failure into a pedagogical action |
| C8 | Exact committed C6/C7 pair and source lineage | Derived descriptive read projection; projection output only | Write an authoritative history record; create `c8_item_id`; create its own replay/conflict state; mutate or reinterpret C6/C7 |
| C9 | Supplied versioned chain and exact source references | Per-branch structural validation result, explicit error code and stage attribution | Repair data, fill missing provenance, select a target, create mastery/action, mutate source history |

### 3.1 C6 missingness is not structural rejection

C6 v0.1 distinguishes five mastery outcomes: `MASTERED`, `NOT YET MASTERED`, `INSUFFICIENT EVIDENCE`, `CONTRADICTORY` and `NOT ASSESSED`. Its decision order places no assessment at `NOT ASSESSED`; unresolved contradiction at `CONTRADICTORY`; and an unassessable necessary gate/inference at `INSUFFICIENT EVIDENCE`.

These are C6 inference outcomes, not substitutes for O6 execution states or C9 structural validation errors. The current C6 protocol does not define a complete structural error-code vocabulary. This audit does not invent one.

### 3.2 C7 HOLD is not a structural rejection code

C7 v0.2 has six candidate actions; its only hold candidate is `HOLD_FOR_MORE_EVIDENCE`. The explanatory flow's `HOLD` is shorthand. It is appropriate for decision-policy situations such as insufficient evidence, unusable mastery or unresolved alternatives under the applicable policy.

A broken identity reference, wrong snapshot, missing required source record or conflicting immutable payload is not itself a learner-facing next action. It must be surfaced as a structural/input validation failure at the owning record/validation boundary; C7 must not hide it by returning `HOLD_FOR_MORE_EVIDENCE`.

## 4. Rejection and failure attribution crosswalk

The current documents use “reject”, “quarantine”, “exclude”, “invalid” and “validation failure” for different situations. They must not be collapsed into one generic status.

| Condition | Owning boundary / correct interpretation | Downstream behavior supported by sources | Still open |
|---|---|---|---|
| Missing raw response or process stream | O6 collection/availability and response lifecycle, not automatically a failed learner result | Preserve `NOT_COLLECTED`, `TECHNICAL_FAILURE`, `UNKNOWN`, `NOT_OBSERVED` or other applicable source state; O6 says these do not become `ABSENT` by default | Exact Stage A lifecycle/identity details remain G6 |
| O6 rule unavailable, not run, blocked or errored | O6 dimension applicability/execution layer | Preserve `NOT_APPLICABLE`, `NOT_RUN`, `BLOCKED`, `ERROR` and reasons; do not emit a learner result unless applicable execution completed | Cross-protocol treatment of these states in C6 input eligibility needs explicit examples |
| Task is `MISALIGNED` or `UNCLEAR` | Valid O6 task-instance assessment result, not automatically malformed data | Preserve the assessment and its rationale; do not infer target evidence from correctness | Exact C6 M1/M2 use of alignment/relation remains open |
| Target assessment references a missing/different observation or target does not resolve to branch | Stage B reference integrity / C9 chain validation | C9 reports the exact assessment/observation/branch relationship and stage attribution; no repair | Exact error-code vocabulary and whether C8 projection also emits a local validation result |
| Assessment is after snapshot availability cutoff or observation outside event window | Snapshot eligibility boundary (O5/O7), not a global deletion/rejection of the assessment | Exclude from that immutable snapshot with explicit reason; a later snapshot may include eligible late assessment | Shared rejection/exclusion vocabulary across C8/C9 needs approval |
| C6 references wrong snapshot/branch | C6 input/Stage C lineage validation; C9 detects the chain mismatch | Do not calculate or accept a canonical C6 result on reconstructed identity; C9 identifies the mismatched reference | C6 protocol's own structural error vocabulary is not specified |
| C7 consumes wrong C6 evaluation or changes branch | C7 exact-input/Stage C lineage boundary; C9 detects the chain mismatch | Do not reinterpret as a hold action; preserve committed C6 unchanged; C9 attributes the mismatch | Exact pre-C7 validation boundary and error vocabulary need specification |
| C8 source lineage is incomplete/mismatched | C8 projection eligibility and C9 structural validation | Do not include it as a valid canonical branch projection; return explicit validation information; do not repair | Whether C8 emits a projection-local diagnostic versus relying solely on C9 must be specified |
| Duplicate identity with different immutable payload | The O7 stage that owns that identity (Stage A, B or C); for Stage C, snapshot/C6/C7 identities remain distinct within the existing decision-evaluation boundary | Reject same-identity/different-payload at the owning stage; C9 may report the conflict if supplied records contain it | G9 still owns canonical equality, exact namespaces, retry/concurrency and recovery |
| Duplicate C8 history item / C8 replay conflict | No independent C8 identity or write boundary exists after the owner decision | C8 must not create a C8 conflict lifecycle. Repeated projection is derived from source records; authoritative replay/conflict belongs to C6/C7/O7 source identities | Exact projection deduplication and read equality remain open physical/read-model details under G8/G9 |
| Legacy/unscoped history | Historical compatibility boundary, not canonical branch identity | Preserve original version/payload; label legacy/unscoped; do not infer missing fields; C9 may validate under original historical contract but not call it canonical v0.2 | Exact supported reader/adapter behavior and retained consumer presentation remain open |

### 4.1 C8 “quarantine” clarification required

C8 v0.2 §9 says a canonical evaluation “rejects or quarantines from canonical summaries” invalid items. After the approved Option A decision, C8 is a derived read projection, not a durable record writer. Therefore “quarantine” cannot mean a new C8 write, durable quarantine record, mutation of source records or independent C8 status lifecycle.

**Source-compatible interpretation proposed for owner review:** invalid or unresolved source chains are not represented as valid canonical projection items; the projection/validator returns an explicit diagnostic with source references and reason. The authoritative records remain unchanged. C9 reports the complete vertical-chain structural result and stage attribution. Whether the projection itself or only C9 owns the emitted diagnostic is still open.

### 4.2 Duplicate/conflict clarification required

C8 v0.2 §9's duplicate item/evaluation identity conflict language and §6's C8 replay behavior are superseded where they imply a separate C8 identity or write lifecycle. O7's replay/conflict rule remains applicable to each actual authoritative stage identity. C9's duplicate-ID/conflicting-payload check is a validator finding, not a new write authority. G9 must determine canonical payload equality and concurrency behavior for the actual O7 stages; no C8 idempotency contract is to be added.

## 5. O6/C3 assessment provenance reconciliation

### 5.1 Frozen O6 v0.3 requirements

O6 v0.3 §7 requires every target-specific assessment to preserve, as applicable:

- exactly one immutable `observation_id` and exactly one existing `evidence_target_id`;
- exact task-instance, task-definition, task-model and curriculum registry versions;
- applicability and execution state for every evaluated dimension, including reason when no result is emitted;
- each completed dimension result and source/rationale reference;
- support-event references and target-specific independence rationale where applicable;
- task scoring-rule version where performance is scored;
- O6/C3 contract version and target-rule version;
- assessment-engine version;
- event time and assessment-availability time;
- source observation/event references;
- stable assessment identity under the separate G6/G9 identity contract;
- prior-assessment identity and correction/reassessment reason where applicable.

O6's dimension result vocabularies apply only when the dimension is applicable and its rule completed. Missing/unavailable rule is not `NOT_APPLICABLE`; `NOT_RUN`, `BLOCKED` and `ERROR` are execution states, not learner-result labels.

### 5.2 C8/C9 terminology gap

C8 v0.2 currently refers to C3 codebook/schema version, coder/coding-round/adjudication provenance and supersession/adjudication status. C9 v0.2 requires C3 codebook/schema version and lists coder, round and adjudication provenance “where applicable”.

C3 v0.2 explicitly begins by withdrawing its human-coder model from learner-runtime architecture and says PacoGO is the single operational assessor. It remains a candidate proposal and is not an approved replacement O6 codebook.

**Proposed operational alignment, subject to G5 review:**
- retain the O6-required version tuple: O6/C3 contract version, target-rule version, assessment-engine version, plus exact task/scoring/registry versions where applicable;
- treat “C3 codebook/schema version” in C8/C9 as unresolved legacy terminology until a canonical operational C3 version artifact is explicitly approved; do not silently call C3 proposal v0.2 canonical;
- do not require `coder_id`, `coding_round`, independent human coder records or adjudication for new PacoGO learner-runtime assessments;
- retain historical/external coder/adjudication provenance only when it actually exists in source records and is relevant to interpreting that historical record;
- preserve correction/reassessment as a new linked target-assessment identity with prior record and reason, consistent with O6; do not call that an adjudication unless the source actually is one.

### 5.3 C6 M1/M2 relationship remains unresolved

C6 defines M1 as evidence relevance to the claim and M2 as technical/content reliability/quality. O6 v0.3 §5.8 supplies a structured, inspectable, non-scored adequacy profile (capture integrity, response interpretability, scoring validity, administration fidelity and source/provenance integrity). O6 explicitly says task alignment and response relation remain separate and that their exact relationship to C6 M1/M2 is settled in G5; the profile itself does not pass or fail M2.

Therefore:
- do not create a numeric or ordinal O6 quality score;
- do not make `ALIGNED` or `DIRECT` alone equivalent to M1 pass;
- do not make a single O6 profile field or composite automatically pass/fail M2;
- G5 must specify how C6 consumes the O6 profile while preserving C6's existing M1/M2 meanings and the seven-gate decision order.

## 6. Positive, negative, missing and mismatch examples

These are logical examples to expose boundaries, not executable fixtures or approved scoring rules.

### Example P — positive, aligned target evidence

- Actual task instance is `ALIGNED`; response relation is `DIRECT`.
- The applicable O6 target rule completes and the pre-specified target criterion is met: target evidence `PRESENT`.
- Objective performance may be `CORRECT`, but correctness is not what makes target evidence present.
- The assessment carries exact O6/C3, target-rule and assessment-engine provenance.
- C6 still evaluates all seven gates, including coverage, stability, independence, variation and contradiction control. One positive assessment does not automatically produce `MASTERED`.
- C7 consumes only the exact committed C6 result; it does not recompute mastery.

### Example N — negative evidence under a valid elicitation

- Actual task instance is `ALIGNED`; required material is fully available; applicable target rule completes.
- The inspected response/process fails the pre-specified target criterion: target evidence may be `ABSENT` under O6's strict preconditions.
- Objective `INCORRECT` alone is insufficient to assign `ABSENT`; the target criterion and required material must support it.
- C6 may produce `NOT YET MASTERED` only when sufficient information exists to make a decision and an explicitly assessed gate fails. If necessary information is not assessable, use the applicable insufficient/not-assessed outcome instead.

### Example M — missing capture or unavailable rule

- Required process stream is `NOT_COLLECTED`, `TECHNICAL_FAILURE` or `UNKNOWN`, or an applicable rule is `NOT_RUN`/`BLOCKED`/`ERROR`.
- Do not emit `ABSENT` merely because information is missing; do not invent a learner-result value.
- Preserve reason and source provenance. The exact C6 outcome depends on whether a usable assessment exists and whether a necessary gate/inference can be assessed; do not hardcode a blanket mapping.
- If C7's decision-policy inputs are insufficient/unusable, its explicit hold candidate is `HOLD_FOR_MORE_EVIDENCE`, not a separate `HOLD` status.

### Example X — mismatch: distinguish pedagogical misalignment from structural identity mismatch

**X1: task-instance misalignment**
- The task/administration does not provide a defensible opportunity for the target: O6 result `MISALIGNED` or `UNCLEAR`.
- This is a valid assessment finding about the task opportunity, not proof of learner failure and not necessarily a malformed record.
- Do not infer target absence or mastery failure from correctness alone.

**X2: structural lineage mismatch**
- An assessment references a different/missing observation, a C6 record references another snapshot, or C7 consumes a different C6 evaluation.
- This is a structural reference/lineage failure. C9 reports exact stage and record relationship; no stage repairs it and C7 must not mask it as a learner-facing hold action.
- A C8 projection must not represent the broken chain as a valid canonical history item.

### Example L — late assessment and historical legacy

- An assessment becomes available after the snapshot's cutoff: it is excluded from that immutable snapshot with an explicit reason, not retroactively inserted; a later snapshot may include it.
- A legacy record missing branch fields remains legacy/unscoped. Do not infer registry, scope or time-window identity from current registry or timestamps. Preserve its original contract/schema/codebook version.
- C9 may validate a fully historical chain under its original contract version, but it must not report it as a canonical six-part v0.2 chain. A mixed legacy/canonical chain is not canonical absent an explicitly approved adapter with traceable provenance.

## 7. Version and legacy compatibility findings

1. C6 v0.1 and C7 v0.2 are the active source versions referenced by the current handoff; their Stage C identity/write-boundary amendments are owner-approved, but the complete integrated cross-stage contract is not yet frozen.
2. C8 v0.2 and C9 v0.2 remain design proposals requiring review. Their references to C8 durable item identity, C8 replay/conflict and coder workflow must be reconciled against later owner decisions and frozen O6.
3. C8 v0.1 may be read only as historical legacy data, preserving its original payload/version and exposing only fields actually present. It must not be upgraded to a canonical six-part branch.
4. C9 v0.1 may be validated under its historical rules and labelled with that historical validator version; it is not a canonical v0.2 validation.
5. Historical C3 vocabularies such as `MATCH/MISMATCH/UNCLEAR`, numeric quality values, prompt levels and boolean contradiction must retain their original codebook/schema version. C3 v0.2 says not to mechanically translate them into candidate vocabularies.
6. The singular `evidence_target_id` plus embedded `coding_record` in Pilot_DataSchema v0.2 conflicts with the array/separate assessment boundary in Empirical_Observation_Schema v0.1. O6 v0.3 requires one observation linked to one target per assessment, while allowing multiple separate target assessments per observation. The canonical wire/schema and non-destructive historical read strategy remain unresolved; no schema or migration is authorized here.
7. Missing historical support condition, target, version, assessment or branch provenance remains unknown/legacy unless contemporaneous source evidence establishes it. No backfill from current policy, current registry, task name or timestamps.

## 8. Remaining G5 decisions and next sequence

| Item | Status after this audit | Required next action |
|---|---|---|
| C8 logical read/write boundary | RESOLVED by owner | Preserve Option A; no C8 write/idempotency contract |
| Protocol version set and shared rejection crosswalk | OPEN | Owner review of stage attribution and the C8 diagnostic interpretation in §4.1 |
| C3/O6 provenance vocabulary | OPEN | Confirm operational version tuple and historical-only coder/adjudication references |
| C6 M1/M2 consumption of O6 profile | OPEN | Define logical interpretation without new scores or changed mastery gates |
| Positive/negative/missing/mismatch examples | Drafted here; NOT approved as fixtures | Review examples and approve/revise before deriving any test vectors |
| Legacy/scalar compatibility | OPEN | Approve supported historical reader/adapter boundaries; no coercion or destructive migration |
| G6 identity/lifecycle | OPEN | Continue separately under G6; do not infer from this audit |
| G9 equality/retry/concurrency/recovery | OPEN | Continue only after G5/G6 logical contracts; no C8-specific idempotency |

**Next concrete step:** owner review the bounded G5 choices in this table, starting with (1) stage-attributed rejection and C8 projection diagnostics, (2) O6 operational provenance versus historical coder provenance, and (3) C6 M1/M2 consumption of the O6 profile. After those are settled, complete the positive/negative/missing/mismatch examples and legacy/scalar compatibility disposition. Do not change the frozen O6 v0.3, curriculum mappings, C6 gates, C7 action policy, runtime, tests, schemas, database or Supabase. G12 remains NOT AUTHORIZED.
