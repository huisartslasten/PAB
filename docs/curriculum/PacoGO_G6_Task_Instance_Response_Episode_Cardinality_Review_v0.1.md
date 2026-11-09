# PacoGO — G6 Task Instance / Response Episode Cardinality Review v0.1

**Status:** source-derived design review and recommended minimum logical contract; NOT owner-approved; no gate closure or implementation authorization  
**Date:** 2026-11-09  
**Branch:** `refactor/professional-v1`  
**Scope:** G6-A only — cardinality and object boundary for task instance, response episode and raw observation. This document does not decide identity namespaces, physical keys, serialization, persistence or runtime behavior.

## 1. Purpose

G6 must distinguish a reusable task from one concrete administration, the learner's response episode and the immutable raw observation produced by that episode.

The existing read-only audit found that the current interaction implementation reuses catalogue `task_id` as `task_instance_id`, does not create a separate administration/attempt identity, and derives `observation_id` partly from a timestamp. Those are implementation findings, not instructions to patch the current code. The logical object and cardinality contract must be settled first.

This review narrows the first G6 decision without reopening frozen O6 v0.3 or deciding G9 payload equality/recovery.

## 2. Source-derived constraints

The following constraints are already supported by the current project contracts:

1. A task definition and task model are reusable/versioned curriculum or interaction descriptions; neither identifies a learner's concrete administration.
2. A task instance represents one concrete administration, including what was actually presented and the material administration conditions.
3. One separately administered response episode produces exactly one immutable raw observation.
4. One raw observation may support zero, one or multiple target-specific assessments.
5. Each target-specific assessment refers to exactly one observation and exactly one existing evidence target.
6. A task model's declared target opportunities do not automatically create target assessments.
7. Ordinary edits, answer revisions and retries within the same administration remain events in the same response episode.
8. Explicit restart after completion, material administration/support change, or inability to restore the exact interrupted administration state requires a new administration and response episode.
9. A started abandoned episode preserves its captured history and raw observation; abandonment does not fabricate a score or evidence result.
10. Interaction event order is the source/episode order; timestamps do not silently reorder it.

Sources: C2; frozen O6 v0.3 §§2–3, 7 and 9; owner decision record O1/O7 and G6-S1; `PacoGO_Task_Observation_Identity_Lifecycle_Proposal_v0.1.md` §§2–5 and 7; `PacoGO_G6_G7_Read_Only_Identity_and_Consumer_Audit_v0.1.md` §§2.1–2.7.

## 3. Recommended minimum cardinality

### 3.1 Reusable definitions versus administered instances

- `task_definition_id + version` identifies a reusable authored task definition and its exact version.
- `task_model_id + version` identifies a reusable task/evidence opportunity model and its exact version.
- These are distinct logical identities. This review does not assert that one is the parent of the other or prescribe their physical relationship.
- A catalogue task, preview, or unopened task card is not a task instance.
- A `task_instance_id` is created only when the learner's concrete administration starts. It identifies that one administration, not the reusable catalogue entry.

The task instance must retain references to the exact applicable definition/model versions and the actual presentation/administration facts. A material deviation is recorded as an actual administration fact; it must not silently rewrite the reusable definition.

### 3.2 Task instance and response episode — proposed 1:1

**Recommendation: one started task instance corresponds to exactly one response episode, and one response episode belongs to exactly one task instance (1:1).**

Operational boundary:
- Create the task-instance identity and response-episode identity together when the administration starts.
- Do not create a task instance for a preview or an administration that never starts.
- Do not attach a second response episode to an existing task instance.
- A restart after completion is a new administration and therefore creates a new task instance and a new response episode.
- A temporary interruption resumes the same pair only when the exact administration state is restored under the already approved G6 lifecycle rule.
- If exact restoration is not possible, the old episode remains preserved and further learner response requires a new task instance/episode pair.

This selects the cleanest interpretation of the existing proposal's “at most one response episode per task instance” rule together with its lifecycle instruction to create both identities when the learner starts. It removes the otherwise unnecessary zero-episode task-instance state by defining the task instance as a started administration.

### 3.3 Response episode and raw observation — 1:1

**Required logical cardinality: one response episode maps to exactly one immutable raw observation.**

- The observation is not a task definition, task model, task instance or event.
- The observation records raw facts about the concrete episode; it contains no target-assessment conclusion, mastery inference or next-action decision.
- The observation identity is stable for that episode and does not change on replay.
- A completed, incomplete or abandoned started episode is preserved. No response, interruption, abandonment or technical failure must not be converted into an invented incorrect answer or assessment result.
- This review does not decide the precise moment an observation identity is reserved or when its immutable record becomes durably available. That lifecycle/write detail belongs to G6/G9 and downstream persistence design.

### 3.4 Observation and target assessments — 1 to many, including zero

One immutable observation may have zero, one or multiple target-specific assessments.

- Zero assessments is valid when no target can yet be defensibly assessed or assessment has not been performed.
- Each assessment has its own stable logical assessment identity, exactly one observation reference and exactly one existing evidence-target reference.
- Multiple target assessments from one observation do not create multiple observations or independent response episodes.
- Reassessment/correction is a separately identified, linked assessment; it does not mutate the prior assessment or raw observation.
- The task model's target-opportunity list is not an instruction to fan out assessments automatically.

### 3.5 Events within an episode — zero to many

A response episode may contain zero or more captured interaction events. Each event belongs to exactly one response episode and has a stable logical identity within that parent episode. The source event order is authoritative; no physical sequence representation is selected here.

## 4. Cardinality summary

| Relationship | Recommended logical cardinality | Meaning |
|---|---:|---|
| Reusable task definition → task instances | 1 to many over time | Reuse does not make instances identical |
| Reusable task model → task instances | 1 to many where applicable | Model is provenance/opportunity context, not an administration |
| Task instance ↔ response episode | 1 to 1 for every started administration | Both identities are created together at start |
| Response episode ↔ raw observation | 1 to 1 | Exactly one immutable observation per started episode |
| Response episode → interaction events | 1 to 0..many | Captured event stream belongs to one episode |
| Raw observation → target assessments | 1 to 0..many | Target-specific assessments do not multiply observations |
| Target assessment → raw observation | many to exactly 1 | Every assessment references one observation |
| Target assessment → evidence target | many to exactly 1 | Every assessment assesses one existing target |

The definition/model-to-instance rows express reuse and provenance only; they do not establish a required database foreign-key shape or a one-to-one relationship between definition and model.

## 5. Lifecycle examples

| Situation | Identity result |
|---|---|
| Learner opens a task preview but does not start | No task instance, response episode or observation |
| Learner starts a task | Create one task instance + one response episode |
| Learner edits/retries an answer during that administration | Same instance and episode; append event(s) |
| Learner completes the administration | Preserve/finalize the episode and its one immutable observation |
| Learner abandons after starting | Preserve the episode and one immutable observation; do not invent a result |
| Learner explicitly restarts after completion | New task instance + new response episode + new observation |
| Independent Tussentoets/Toets content-help request | End the independent episode as incomplete; supported practice is a separate instance/episode/observation |
| Neutral answer-entry/navigation clarification with no target reasoning | Same instance and episode |
| Exact interruption state can be restored | Resume the same instance and episode |
| Exact interruption state cannot be restored | Preserve old episode; create a new instance/episode before further learner response |
| Material task/presentation/representation/response-mode/support change | New instance and episode; preserve the prior episode |

Timeout remains governed by the existing G6 rule: elapsed time alone does not terminate an episode. A timeout may be used only under an explicit, versioned task/session policy with a defined consequence.

## 6. Boundaries deliberately left open

This review does not decide:

1. Observation, event or assessment identity namespace and uniqueness scope.
2. Concrete ID formats, generation, database keys, composite identities or hashes.
3. Canonical payload fields/serialization/equality, absent versus null, normalization, collection semantics or timestamp precision.
4. Durable stage-state vocabulary, uncertain-commit recovery, retries, concurrency or operation timeouts.
5. The physical moment of observation reservation/finalization and transaction layout.
6. Physical schema, SQL/RPC/RLS, Supabase, retention or security implementation.
7. Learner-facing lifecycle wording or any O6 assessment label for incomplete/no-response episodes.
8. A physical relationship between task definition and task model.
9. Runtime changes or test changes.

These remain with G6/G9/G8/G10/G11 as applicable. G12 remains the only implementation-authorization gate.

## 7. Decision requested

The bounded G6-A recommendation for owner disposition is:

> A task instance represents a started concrete administration. At start, PacoGO creates exactly one task-instance identity and exactly one response-episode identity. Each belongs to the other exclusively (1:1). Each response episode maps to exactly one immutable raw observation. An observation may have zero or more separately identified target assessments. A task preview that never starts creates none of these administration identities.

If this recommendation is accepted, G6 can treat task-instance/episode cardinality as determined and proceed to the separate namespace and full lifecycle reconciliation. If it is not accepted, the alternative cardinality and its lifecycle consequences must be specified explicitly before G6/G9 proceed.

## 8. Gate status and verification boundary

- G6-A: **recommended candidate prepared; owner disposition pending**.
- G6 overall: **OPEN**.
- G9: **OPEN**, dependent on approved G6 identity/lifecycle inputs.
- G5 bounded logical crosswalk: **RESOLVED**; other G5 status is not reopened here.
- G8/G10/G11: downstream or separately gated.
- G12: **NOT AUTHORIZED**.

This is a design-only document. It changes no runtime, tests, curriculum registry, task catalogue, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data. It does not authorize implementation.
