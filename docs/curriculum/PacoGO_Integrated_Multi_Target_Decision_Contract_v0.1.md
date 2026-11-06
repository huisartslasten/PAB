# PacoGO — Integrated Multi-Target Decision Contract v0.1

Status: Integrated architecture proposal / candidate / NOT approved for implementation  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Verified design baseline: `59383d44022b926ae885daef7c6d7d74bb79272e`  
Full Regression: #3028 / run ID `42221996232` GREEN on that exact baseline

## 1. Purpose and decision boundary

This document reconciles the existing C3 observation/coding model with C6 mastery, C7 next-action, C8 temporal learner modelling, C9 vertical-chain validation, and the current browser/runtime/persistence consumers.

It defines a proposed logical contract for one task attempt that can produce multiple target-specific assessments and multiple context-isolated decision branches.

This is a design proposal. It does not authorize implementation, schema changes, registry changes, runtime changes, learner-state changes, migrations or Supabase operations.

Fixed boundaries:

- Existing curriculum meanings, skills, developments, claims, evidence-target meanings, task-model mappings, development ordering and mastery criteria are unchanged.
- One separately administered task attempt is one immutable raw observation.
- A raw observation may be linked to multiple separately justified target-specific assessments.
- A target assessment is not an independent observation.
- Evidence from different claim/development branches must not be pooled into one mastery decision.
- C6–C9 remain distinct scientific/technical components. This proposal connects them; it does not replace their decision logic.
- A structurally coherent chain is not empirical validation.

## 2. Verified implementation facts at the baseline

The following facts were inspected at commit `59383d44022b926ae885daef7c6d7d74bb79272e`.

### 2.1 Task and observation contract

`pacogo-engine/interaction-contract.js`:

- `createTaskInstance()` requires one `claimId` and one `developmentId`.
- It accepts an array of `evidenceTargetIds`.
- `createObservation()` copies the task's single claim/development and only `evidence_target_ids[0]` into scalar observation fields.
- The remaining target IDs are not represented as target-specific assessment records.

### 2.2 Registry and prototype

`pacogo-engine/curriculum-registry.js` calls `runCycle()` once for a skill.

- Relevance is evaluated against one scalar `item.evidence_target_id`.
- Development inference groups evidence by `development_id`.
- Mastery and next-action are calculated once for the skill cycle.
- Longitudinal state and decision trace are produced once for the skill cycle.

`pacogo-engine/prototype.js`:

- Evidence assessment is one assessment object per observation.
- Development inference assigns evidence using the observation's one `development_id`.
- Mastery coverage counts distinct scalar `evidence_target_id` values.
- Independent evidence counts evidence items, so duplicating one observation into target rows could inflate counts unless source-observation cardinality is explicitly respected.

### 2.3 C6 and C7

`pacogo-engine/c6-mastery-decision.js` requires claim, development, scope and time-window fields on each assessment, but returns `mastery_state_by_claim`, keyed only by `claim_id`. Two branches for the same claim can overwrite one another.

C6 currently does not require learner or registry identity in the assessment payload. Those identities must be carried by an enclosing execution context or added to the versioned branch envelope; they must not be inferred from claim IDs.

The C7 adapter selects one C6 result by claim ID and checks development alignment. C7 inputs do not consistently carry the full C6 context. C7 must receive the exact selected branch, not merely a matching claim.

### 2.4 C8 and C9

C8 currently validates learner, claim, development and scope, but not registry version or time-window identity.

C9 validates the same four identities across its vertical slice. It checks the latest C6/C7 values against C8, but it does not validate a complete six-part branch identity or a shared raw observation linked to multiple target assessments.

### 2.5 Learner service and persistence

`src/services/learner-curriculum-service.js`:

- Loads evidence and one longitudinal-state row by learner + registry version + skill.
- Writes one evidence object, one skill-level state object and one decision trace per source event.
- Passes the raw observation JSONB intact, but also projects scalar claim/development/target fields.

Current persistence schema/RPC:

- `student_evidence` has scalar `development_id`, `claim_id`, `evidence_target_id` columns and a JSONB raw observation plus JSONB evidence assessment.
- A unique index enforces one evidence row per learner + source event.
- `student_longitudinal_state` is unique by learner + registry version + skill, not by claim/development/scope/window.
- `curriculum_decision_trace` has one source-event uniqueness constraint per learner, not one trace per source event and decision branch.
- `persist_curriculum_learning_cycle` atomically writes one evidence row, one skill state and one decision trace.

Therefore JSONB preservation alone does not make the current inference, state or persistence path multi-target capable.

### 2.6 Browser and controller path

`pacogo-engine/browser-vertical-slice.js` is the actual browser bridge:

- `runTaskObservation()` resolves the task by task ID and checks only that observation.skill_id equals task.skill_id.
- It does not currently validate observation task-instance identity, task-model identity, target-opportunity set, claim/development ownership or registry-version context against the resolved task.
- It then delegates to `registry.runSkillCycle()`, which executes the skill-level prototype path.

`pacogo-engine/addition-controller.js`:

- builds its task instance with one task.development_id and one task.claim_id plus an evidence-target array;
- emits a raw observation through `createObservation()`;
- the interaction contract currently projects only the first target ID;
- the returned learner observation adds provisional scalar coding fields (`quality`, `relevant`, `contradiction`, `independent`, `independence_status`). Those provisional fields must not be mistaken for an approved target-specific C3 assessment or C6 mastery result.

The browser boundary therefore needs a future task-instance/registry validation contract, not merely an array-valued observation field.

### 2.7 Existing test coverage boundary

The current tests establish single-target and single-branch behavior:

- `interaction-contract.test.js` explicitly asserts the scalar first target;
- `curriculum-registry.test.js` exercises scalar evidence targets and skill-level state;
- `prototype.test.js` exercises one observation assessment and skill-level mastery;
- C6 tests exercise one branch per claim;
- C7 adapter tests select a C6 result by claim;
- the real C6→C7→C8→C9 vertical-slice test exercises one branch.

These tests are valid for the existing contract. They do not prove multi-target fan-out, branch isolation or shared-observation cardinality. They must be supplemented by the scenarios in section 13; they must not be weakened to accommodate an implementation.

### 2.8 Persistence security boundary

The learner-ownership migration and subsequent write-context migration add guardian checks and a transaction-local write capability around the existing learning-cycle RPC. Any future multi-branch persistence design must preserve those controls:

- authenticated guardian membership remains checked for the learner;
- direct client table writes remain denied;
- write capability remains transaction-local and is cleared after success or failure;
- atomic rollback remains required;
- the multi-branch extension must not broaden RLS or grant new direct write privileges.

The existing SQL integration test covers guardian isolation, replay idempotency, direct-write denial and atomic rollback for the current one-row/one-state/one-trace transaction. It does not yet cover multi-branch writes or conflicting replay payloads.

## 3. Canonical logical entities and cardinality

The following is the proposed logical model. It intentionally separates immutable learner data from revisable scientific coding and derived decisions.

### 3.1 Versioned task definition

A task definition specifies potential evidence opportunities, not evidence that was actually elicited.

It contains, at minimum:

- task model ID and task-definition version;
- skill and registry-version context;
- ordered or otherwise explicitly defined target opportunities;
- the actual intended task/representation/response configuration;
- planned support condition.

A target opportunity resolves through the exact registry version to its own evidence target, claim and development. The task definition must not assert that every listed target will be demonstrated.

### 3.2 Administered task instance

One task instance represents one actual administration. It records the exact task-definition version and what was actually presented, including any departure from the planned definition.

A task instance may have multiple target opportunities. It must not require one primary claim/development as the identity of the whole attempt when its target set spans multiple claims or developments.

The task-instance ID identifies the administration, not a mastery branch.

### 3.3 Raw response episode / observation

**Canonical unit: one separately administered task-instance response episode.**

One observation stores the raw response episode once, including ordered attempts and interaction events that belong to that administration.

The raw observation owns:

- immutable observation ID;
- task-instance ID and exact task-definition version;
- learner key;
- skill ID and exact curriculum-registry-version ID;
- raw response facts and response modality;
- objective performance facts plus scoring-rule version, where applicable;
- ordered interaction and assistance events;
- raw context, collection availability and technical/data-quality events;
- timestamps and source/collector provenance.

The raw observation does not own one canonical claim, development or evidence target when its task spans multiple targets. Those identities belong to target-specific assessments and are resolved through the registry.

A separately administered attempt is a separate observation. A click, edit, retry or help request inside one administration is an event, not automatically a new observation. A later supported-practice attempt after an independent attempt is a distinct administration/observation where the task lifecycle defines it as such.

### 3.4 Target-specific C3 assessment

A target assessment is a separate, versioned coding/assessment record linked to one raw observation and one evidence target.

Logical cardinality:

- one observation → zero, one or many target assessments;
- one target assessment → exactly one source observation and exactly one evidence target;
- one observation + one target may have multiple coder/round records;
- an adjudicated resolution is a separate linked record, not destructive replacement.

Each target assessment resolves and records its own:

- evidence-target ID;
- claim ID;
- development ID;
- task-instance alignment judgement;
- response-to-target relation;
- target-specific evidence status;
- target-specific process interpretation where applicable;
- target-specific independence judgement referencing actual assistance events;
- contradiction judgement and rationale;
- codebook version, coder, coding round, timestamp and provenance;
- review/adjudication/supersession links.

C3 vocabulary and quality scales remain governed by the separate codebook approval process. This document does not select unresolved coding categories or quality levels.

**Cardinality invariant:** three target assessments derived from one observation remain one raw observation. They do not count as three independent attempts, three independent observations or three temporally separated measurements.

## 4. Canonical decision-branch identity

### 4.1 Six-part branch key

Every C6 mastery decision and every downstream C7/C8/C9 branch must be identified by the complete tuple:

```text
learner_key
curriculum_registry_version_id
claim_id
development_id
scope_id
time_window_id
```

All six fields are required and non-empty. The tuple is the canonical branch identity. A deterministic `decision_branch_id` may be derived from a canonical serialization of the tuple, but the original six fields must remain present and inspectable. A hash alone is not sufficient provenance.

The branch key deliberately excludes:

- task ID;
- task-instance ID;
- observation ID;
- evidence-target ID;
- source-event ID.

Those identify source material or assessment relationships, not the decision context itself.

### 4.2 Why both claim and development are required

A task can assess targets belonging to different claims and developments. The target registry mapping determines the owning claim/development for each target assessment.

C6 must not pool evidence across claims or developments merely because they came from one task attempt, one skill or one browser session.

### 4.3 Scope and time window

Scope and time window are explicit branch dimensions, not descriptive metadata.

Two assessments with the same learner, registry, claim and development but different scopes or time windows are different branches. They must not overwrite or be silently merged.

A later time window may be compared with an earlier one by an explicitly specified longitudinal analysis, but that comparison does not make the two branch records identical.

### 4.4 Skill identity

The skill ID remains part of task/registry routing and persistence partitioning. The six-part tuple is the minimum C6–C9 decision identity. The registry must validate that the branch's claim/development belongs to the supplied skill under the exact registry version.

## 5. C3 → C6 fan-out contract

### 5.1 One-to-many routing

The pipeline must:

1. persist/retain one immutable raw observation;
2. obtain the set of separately justified C3 target assessments linked to it;
3. resolve each target's claim/development using the exact registry version;
4. group assessed evidence by the complete six-part decision-branch key;
5. create one C6 assessment input per branch;
6. ensure each C6 assessment refers to source observation IDs and target-assessment IDs, not duplicated synthetic observation IDs.

A target listed as an opportunity but not assessed does not become positive or negative evidence by default.

### 5.2 Independent-observation counting

C6 coverage, stability, variation and independence must operate on their own pre-specified units and scopes.

At minimum:

- distinct target assessments are not distinct observations;
- multiple coder records for one target/observation are not multiple learner observations;
- multiple targets from one observation cannot increase independent-observation count;
- repeated attempts inside one administration do not increase observation count unless the approved task protocol defines a new separately administered episode;
- distinct observation IDs alone do not prove independence; C3 assistance/independence judgements and the relevant study protocol remain necessary.

Where a mastery rule requires independent observations, it must count distinct eligible source-observation IDs after target-specific eligibility and independence assessment, not the number of target-assessment rows.

### 5.3 Evidence references

A C6 branch input must retain both:

- `source_observation_ids[]`: unique raw learner episodes contributing to this branch;
- `target_assessment_ids[]`: the target-specific assessments supporting the branch.

A source observation may appear in more than one branch when it legitimately assesses different targets. It remains the same source ID in each branch.

## 6. C6 contract changes required

C6's existing seven gates and mastery classification order remain unchanged by this proposal.

The output representation must change from a map keyed only by claim ID to a collection of branch results, each carrying the complete six-part identity.

Candidate v2 shape:

```text
{
  contract_version,
  mastery_assessments: [
    {
      decision_branch: {
        learner_key,
        curriculum_registry_version_id,
        claim_id,
        development_id,
        scope_id,
        time_window_id,
        decision_branch_id
      },
      mastery_state,
      gate_states,
      coverage,
      source_observation_ids,
      target_assessment_ids,
      evidence_count
    }
  ],
  safety_permissions: {
    registry_promotion_allowed: false,
    runtime_mastery_write_allowed: false,
    developmental_ordering_inference_allowed: false,
    automatic_next_action_allowed: false
  }
}
```

The exact serialization remains subject to schema review, but these semantics are required.

Legacy compatibility:

- The existing `mastery_state_by_claim` shape may be exposed only by an explicit legacy adapter.
- The adapter must reject ambiguous input where more than one branch exists for the same claim.
- It must never silently overwrite one branch with another.
- A one-branch legacy result may be projected only when all context is present and validated.

## 7. C6 → C7 exact-branch handoff

C7 consumes exactly one validated C6 branch result.

The adapter must require the complete branch tuple on both sides and compare every field. It must not select by claim ID alone.

C7 must preserve:

- learner and registry context;
- claim and development;
- scope and time window;
- C6 mastery state and gate trace;
- evidence and source-observation references;
- separate prerequisite-ordering and next-development-ordering states;
- alternative-explanation state;
- explicit action policy.

C7 must not recompute mastery or infer missing branch fields. Existing C7 candidate actions, action-specific ordering gates and safety permissions remain unchanged.

A C7 trace must identify the exact C6 branch result it consumed. If any identity field differs or is absent, reject the handoff; do not repair or guess.

## 8. C7 → C8 temporal branch history

C8 must maintain separate temporal histories by the same six-part branch identity.

Each C8 history:

- contains only observations/decision snapshots belonging to that exact branch;
- preserves source observation IDs and target-assessment references;
- retains the exact C6 mastery and C7 candidate action for each timestamp;
- orders records by validated timestamp, not caller array order;
- preserves contradictory, insufficient and not-assessed states;
- does not derive new mastery, prerequisite, ordering or next-action decisions.

The C8 current state is the latest supplied C6/C7 result within that exact branch and time window. A new scope or time window creates a separate history, not an overwrite.

An observation may contribute to more than one C8 branch through its separate target assessments. Each history points back to the same immutable observation ID.

## 9. C8 → C9 vertical validation

C9 validates each branch as a distinct vertical slice while allowing source-observation sharing across branches.

For each branch, C9 must verify:

- all six branch-identity fields are present and consistent across C6, C7 and C8;
- claim/development/target references resolve under the exact registry version;
- every target assessment references a supplied source observation;
- the source observation belongs to the same learner, registry and skill context;
- no target assessment is counted as a separate raw observation;
- C6 source-observation and target-assessment references are traceable;
- C7 consumes the exact C6 branch result;
- C8's latest state matches that branch's C6/C7 results;
- no unsupported registry promotion or runtime mutation is enabled.

C9 must not require a task to have one primary claim/development when its target set legitimately spans multiple branches.

C9 remains a structural chain-integrity validator. It does not prove developmental validity, mastery validity or educational optimality.

## 10. Persistence and idempotency contract

### 10.1 Logical transaction cardinality

One source event/task attempt must be persisted atomically as:

- one raw observation record;
- zero or more target-specific assessment records/references, as available at the approved operational stage;
- zero or more branch-specific C6/C7 decision traces, one per evaluated branch;
- one current state update per affected branch.

The raw observation is inserted once, regardless of the number of target assessments or decision branches.

### 10.2 Existing scalar columns

The current `student_evidence` scalar fields `claim_id`, `development_id` and `evidence_target_id` cannot truthfully identify a multi-target observation.

Candidate compatibility rule:

- retain scalar values for historical records exactly as stored;
- for new single-target observations, scalar projections may be populated when unambiguous;
- for zero- or multi-target observations, scalar target/claim/development projections must be NULL rather than selecting a primary target;
- the complete target-specific assessments must be stored/retrieved through the approved versioned representation.

This rule is a proposal only. Every SQL constraint, RPC consumer, service, query, dashboard and export that assumes non-null scalar values must be inventoried before approval.

### 10.3 JSONB versus normalized assessment relation

The current operational table already stores raw observation and evidence-assessment JSONB and the service preserves the full observation object. This is useful compatibility infrastructure, but it does not settle the canonical storage design.

Trade-off:

- A JSONB assessment collection can support an initial operational read/write envelope with fewer schema objects, but coder rounds, foreign-key integrity, per-target queries and adjudication history are harder to constrain and index.
- A normalized child relation provides explicit observation-to-target cardinality, coder/round/adjudication provenance, referential integrity and queryability, but requires a real schema/RPC/read-model change.

The canonical research/coding store decision remains OPEN. Do not select JSONB solely because the current service already accepts JSONB. Do not create a normalized relation until the C3 coder/round/adjudication requirements and data-access contract are approved.

### 10.4 Branch-specific learner state

The current unique key `(student_key, curriculum_registry_version_id, skill_id)` permits only one state row per skill and can overwrite distinct claim/development/scope/window states.

The logical state key must include the complete six-part decision-branch identity (with skill validated as registry context). A skill-level summary may exist as a derived read model, but it cannot replace branch state or become the authoritative store.

The physical implementation (normalized branch-state rows versus another explicitly concurrency-safe representation) remains open pending the complete read/write consumer design.

### 10.5 Decision-trace idempotency

The current unique `(student_key, source_event_id)` trace constraint permits only one trace per source event. Multi-branch execution requires a trace identity that distinguishes the decision branch.

Candidate logical uniqueness:

```text
(student_key, source_event_id, decision_branch_id)
```

One source event may therefore have one raw observation and multiple branch-specific traces, without duplicating the observation.

### 10.6 Replay safety

Replaying the same source event must be idempotent.

- Same learner + source event + same immutable observation and same branch/assessment set → return the existing committed result.
- Same learner + source event but different raw observation payload or conflicting branch set → reject as an integrity conflict; do not silently return the earlier result or partially append new branches.
- All observation, assessment, branch-state and decision-trace writes for one event must be atomic.
- A failure in any branch must roll back the whole event transaction unless a separately designed resumable protocol explicitly guarantees equivalent atomic semantics.

The current RPC's event-level duplicate check must be extended or replaced to enforce these conditions before multi-branch writes are enabled.

## 11. Legacy compatibility

Historical single-target evidence remains immutable and readable.

A compatibility read adapter may expose a historical scalar record as one legacy target-assessment view, but it must:

- retain the original row ID and source-event ID;
- retain the original schema/codebook version;
- preserve historical scalar values and coding vocabulary;
- mark that the assessment is legacy-projected;
- not invent coder identity, coding rounds, adjudication, target coverage or independence;
- not convert historical values to proposed C3 categories without a separate linked recoding record.

New multi-target observations must never be backfilled by duplicating historical raw observation rows.

Legacy C6/C7/C8 state and traces remain identifiable under their original skill-level contracts. They must not be silently assigned to a six-part branch where scope/time/claim/development provenance is absent. A read adapter may label the missing branch dimensions as unknown/legacy, but must not manufacture them.

## 12. Required contract invariants

1. One administration → one immutable raw observation.
2. One observation → zero or more separately justified target assessments.
3. One target assessment → one observation + one target + one coding version/provenance record.
4. One observation may feed multiple decision branches without being copied.
5. One C6 result → exactly one complete six-part branch identity.
6. One C7 result → exactly one matching C6 branch.
7. One C8 history → one complete branch identity.
8. One C9 validation → one branch; shared source observations are allowed.
9. Target-assessment count never substitutes for independent-observation count.
10. Claim/development/scope/time-window boundaries are never collapsed.
11. Skill-level summary state is derived and cannot overwrite branch state.
12. Legacy data is preserved without destructive recoding or invented provenance.
13. One source-event replay cannot create duplicate observations, assessments, states or traces.
14. Identity mismatch is rejected, never silently repaired.
15. No automatic mastery write, learner advancement or registry promotion is introduced by this contract.

## 13. Required verification scenarios before implementation

The future implementation test design must include, at minimum:

1. One observation with one target produces one target assessment and one branch.
2. One observation with ET1 → C1/D1 and ET2 → C2/D2 produces one observation, two assessments and two isolated C6 branches.
3. Both branches may reference the same observation ID without treating it as two independent observations.
4. Two targets mapping to the same claim/development but different scopes remain separate branches.
5. Two assessments for the same claim/development/scope but different time windows remain separate branches.
6. Two branches with the same claim ID cannot overwrite one another in C6 output.
7. C7 rejects a C6 result with mismatched learner, registry, development, scope or time window.
8. C8 retains two branch histories from one shared observation without merging them.
9. C9 validates each branch and preserves the common source observation reference.
10. Legacy scalar records remain readable with exact original values.
11. A legacy result lacking scope/time-window provenance is not silently promoted to a fully identified branch.
12. Replaying the same event and same payload is idempotent.
13. Replaying the same event with a different payload or branch set fails atomically.
14. A branch failure leaves no partial observation/assessment/state/trace writes.
15. Skill-level summaries are derived from branch states and cannot become authoritative replacements.

Tests must prove the contract; they must not be weakened or rewritten merely to make an implementation pass.

## 14. Open decisions before approval

| ID | Decision | Why still open | Required evidence |
|---|---|---|---|
| O1 | Canonical C3 assessment storage: JSONB or normalized relation | Coder/round/adjudication and query requirements are not fully frozen | Approved C3 codebook, coder workflow and research-data access patterns |
| O2 | Physical branch-state persistence model | Existing skill-level row is insufficient; concurrency and read patterns need design | Full service/query inventory and atomic multi-branch transaction design |
| O3 | Exact deterministic branch-ID serialization | Tuple is fixed conceptually; canonical serialization/versioning needs specification | Collision-safe canonical encoding and compatibility tests |
| O4 | Legacy projection API | Scalar compatibility affects all existing consumers | Complete current-branch consumer inventory |
| O5 | Exact scope/time-window lifecycle | Must align with C6, C7, C8 and scientific validation protocols | Approved scope/window definitions and transition rules |
| O6 | C3 codebook and target-assessment vocabulary | Existing C3 proposal remains unapproved | Explicit scientific/codebook approval |
| O7 | Atomic RPC payload and replay-conflict comparison | Current RPC is one-evidence/one-state/one-trace | Transaction contract, payload canonicalization and failure tests |

## 15. Implementation gate and next step

No implementation is authorized until:

1. this logical contract is reviewed and approved or revised;
2. O1–O7 are resolved or explicitly scoped into separate approved stages;
3. the complete consumer inventory is finished, including browser runtime, task catalogue, registry, C6–C9 adapters, learner service, SQL constraints/RPC, read paths and exports;
4. the C3 codebook boundary is approved sufficiently to identify what a target assessment contains;
5. the pre-build Full Regression is checked on the exact current branch head.

After approval, implementation should be staged:

1. introduce versioned logical contracts and pure adapters without persistence writes;
2. prove C3 observation-to-target fan-out and source-observation cardinality;
3. implement C6 branch collection and non-colliding identity;
4. implement exact-branch C7 handoff;
5. implement branch-keyed C8 histories and C9 validation;
6. only then implement the approved atomic persistence/read-model change, if required;
7. run Full Regression after each coherent implementation stage.

Stop immediately on a red regression, isolate the exact root cause, and design the underlying correction before changing code or tests.

No curriculum registry, task mapping, mastery threshold, historical data, Supabase schema, RLS or LIVE `main` change is authorized by this candidate.
