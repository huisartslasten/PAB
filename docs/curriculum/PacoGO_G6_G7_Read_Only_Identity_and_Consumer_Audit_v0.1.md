# PacoGO — G6/G7 Read-Only Identity and Consumer Audit v0.1

Status: verified implementation inventory / design findings only / no implementation authorization
Date: 2026-11-06
Branch: `refactor/professional-v1`
Audited exact branch HEAD: `6ec1b879d80d8635902508e891b35f24f33c4b23`
Full Regression #3062: GREEN on that exact commit

## 1. Purpose and boundary

This audit completes the read-only engineering work permitted for:
- **G6:** task-definition, task-instance/attempt and raw-observation identity;
- **G7:** current browser/runtime, service, decision-engine and persistence consumers.

The audit reads source files, learner entry points, tests and committed SQL migrations. It does not change code, tests, registry, catalogue, task models, SQL/RPC/RLS, Supabase or learner data. It does not establish the state of any deployed Supabase database. A committed migration describes intended schema history, not proof that it has been applied to a particular environment.

The accepted owner decisions O1–O4 and O7–O8 remain logical architecture directions only. O5, O6 and O9 remain open. This audit does not close those decisions or authorize B1-L08.

## 2. G6 — observed task and observation identity

### 2.1 Shared interaction contract

The common implementation is `pacogo-engine/interaction-contract.js`.

`createTaskInstance()` accepts:
- `taskId`;
- `taskModelId`;
- `skillId`;
- one scalar `developmentId` and `claimId`;
- an array `evidenceTargetIds`;
- `taskDefinitionVersion`.

It returns `task_instance_id: taskId`. It does not create a distinct administration/attempt identifier. The supplied `taskId` is therefore reused as the task-instance ID. In the learner catalogues, `task_id` is the stable catalogue task identity. The current code conflates that stable definition identity with the administered instance identity.

The object does retain `task_model_id`, a hard-coded/provided `task_definition_version`, scalar claim/development ownership and the target array. It does not retain a separate immutable task-definition snapshot/ID, administration ID, attempt sequence, or Learning Interface model/version identity.

### 2.2 Raw observation creation

`createObservation()` currently:
- derives `observation_id` as `obs:<task_instance_id>:<observed_at>`;
- writes `task_id` using the task-instance ID;
- copies the scalar task claim/development;
- writes only `evidence_target_ids[0]` to scalar `evidence_target_id`;
- stores response, correctness, performance, context, provenance and interaction events.

Consequences:
1. The observation does not have a separate, stable reference to a versioned task definition and a unique administered attempt.
2. The target array retained on the task instance is reduced to its first target at observation creation. Additional declared targets are not represented as separately assessable target records.
3. The task's scalar claim/development are treated as observation ownership even when a future task may declare targets that resolve to different claims/developments.
4. Timestamp-derived observation identity is not a substitute for an explicit administration identity and canonical replay identity.
5. `Object.freeze` is applied to the outer observation object, while nested response/performance/context/provenance/event payload objects are cloned but not recursively frozen. The runtime object is therefore only shallowly frozen.

### 2.3 Interaction event and source-event identity

`createInteractionEvent()` derives event identity from:
`<task_instance_id>:<event_type>:<timestamp>`.

The addition and other inspected controllers use the last interaction event's ID as `provenance.source_event_id`. In the addition controller this is normally the `addition_submitted` event. This means persistence idempotency is keyed by a derived interaction-event ID, not a separately modelled administration/observation identity.

The inspected controllers record one submission per controller instance and commonly set `performance.attempts` to 1. The current identity contract does not define how a repeated administration of the same stable catalogue task receives a new task-instance ID, how retries inside one administration differ from a new administration, or how a corrected/replayed observation is identified.

### 2.4 Controller coverage

The following controller families use the shared interaction contract:
- addition;
- B5 combined-operations;
- number line;
- subtraction;
- multiplication;
- division;
- fraction equivalence;
- representation match;
- clock.

They pass the catalogue/task `task_id` as the task-instance ID. The inspected implementations pass a hard-coded task-definition version (mostly `0.1`; B5 uses `0.3`) rather than resolving one canonical immutable task-definition version object. Some pages additionally place a catalogue version in provenance, but that does not change the common identity semantics.

### 2.5 Learning Interface identity

The addition page builds an Addition Learning Interface model from the task data and separately creates an addition controller. The observation records the task model ID, representation and page/catalogue provenance, but not a canonical Learning Interface ID/version or a versioned interface configuration snapshot.

Other interfaces (number line, fraction, quantity representation, clock and division representation) have their own models/renderers/controllers. The inspected browser wiring shows the pedagogical/rendering modules are distinct files, but the observation identity contract does not yet provide one consistent interface identity/version and exact presented-configuration reference across them.

### 2.6 Current B1 catalogue nuance

The current B1 learner catalogue v0.2 declares B1-L01 through B1-L07. Each of those seven entries currently has exactly one evidence target. B1-L06 and B1-L07 are both TM3/ET3 entries. Therefore the first-target reduction is a latent contract defect for a future multi-target task; the present seven B1 catalogue entries do not themselves exercise multi-target fan-out.

The controller is reusable over task data: the B1 learner page loads catalogue tasks and passes each task to the same addition controller/interface model. The arithmetic values are catalogue data, not separate controller implementations for each sum. This audit does not change those tasks or their IDs. B1-L08 remains blocked pending the approved multi-target evidence contract.

### 2.7 G6 disposition

**G6 is not ready to close.** The source audit establishes the exact identity conflation and missing provenance fields. Before implementation, the canonical contract must separately define:
- versioned task definition and its immutable content/version identity;
- task model and Learning Interface identity/version/configuration;
- unique administered task instance/attempt identity;
- within-attempt interaction event identity and retry semantics;
- one immutable raw observation identity and source namespace;
- event time, capture time and assessment-availability time provenance;
- the rule distinguishing a retry within one administration from a new administration;
- canonical payload comparison and correction/replay lineage.

Do not fix this by merely generating a random UUID in `createTaskInstance`. The underlying lifecycle and idempotency identities must first be specified consistently with O1/O6/O7 and the persistence design.

## 3. G7 — current runtime and decision consumers

### 3.1 Legacy skill-centric browser decision path

The current browser vertical slice is:
`browser-vertical-slice.js → curriculum-registry.js → prototype.js`.

- Browser pages call `runtime.runTaskObservation()`.
- `browser-vertical-slice.js` resolves the task from the catalogue and calls `registry.runSkillCycle()`.
- `curriculum-registry.js` creates one evidence rule against the skill's target list but reads one scalar `observation.evidence_target_id`; it then invokes `runCycle()`.
- `prototype.js` performs one scalar evidence assessment, development inference, skill-level mastery calculation and next-action selection.
- The next-action function chooses a task model based on missing evidence targets in a skill-level state.

This is a real, callable browser/runtime path. It is not a complete C6–C9 branch pipeline. It uses scalar target/claim/development fields and one skill-level state.

### 3.2 Separate C6–C9 modules

The repository also contains separate C6, C7, C8 and C9 modules and tests. Their existence does not mean the browser path above calls them.

Verified implementation gaps:
- C6 output is `mastery_state_by_claim`, created with `Object.fromEntries` keyed only by `claim_id`. Multiple results for the same claim can overwrite one another even when development/scope/window differ.
- The C6 result includes development, scope and time-window fields, but the map key is claim-only; the current C6 validator does not require learner or registry identity or frozen snapshot/evaluation IDs.
- The C6→C7 adapters select a C6 result by claim ID. C7 receives other context as separate supplied fields; the handoff does not carry and validate the full six-part branch identity plus exact snapshot/evaluation provenance.
- The current C8 implementation validates a four-part identity: learner, claim, development and scope. It does not require registry-version or time-window identity.
- The current C9 implementation validates the same four-part identity and a structural vertical slice. It does not validate the full six-part branch identity or the complete frozen snapshot/evaluation lineage proposed in the v0.2 design documents.
- The C8/C9 adapter creates a synthetic observation ID from the timestamp and derives a simple evidence state from whether the C6 evidence count is greater than zero. It is not a persisted, target-assessment-based branch history adapter.

The C6→C7 and C6→C7→C8→C9 vertical-slice tests exercise these modules with constructed test inputs. The reviewed learner HTML entry points do not import or invoke these C6–C9 adapters as part of the browser learner cycle. The browser cycle therefore remains the legacy skill-centric path while the separate C6–C9 modules are an isolated protocol/test path.

### 3.3 Browser entry-point classification

The following direct curriculum entry points were found in the branch tree and reviewed for engine calls:

| Entry point group | Runtime behavior | Learner-curriculum persistence |
|---|---|---|
| A1 number line | Registry + browser vertical slice + number-line controller/interface | No calls to learner-curriculum load/persist found in this page |
| B1 main learner | Addition controller/interface + registry + browser vertical slice | Yes: profile, history load and learning-cycle persistence |
| B1 experimental/variant pages | Addition controller + registry + browser vertical slice | No learner-curriculum persistence calls found in these pages |
| B2 learner | Registry + browser vertical slice + number-line/subtraction controllers | Yes |
| B3 learner | Registry + browser vertical slice + quantity representation/multiplication controller | Yes |
| B4 learner | Registry + browser vertical slice + division representation/controller | Yes |
| B5 learner | Registry + browser vertical slice + B5 controller | Yes |
| FR2 fraction pages | Registry + browser vertical slice + fraction controller/interface bridge | No learner-curriculum persistence calls found in these pages |
| Clock interface/controller demos | Clock interface/controller/bridge | No registry skill-cycle or learner-curriculum persistence path found in the demo pages |

The B1–B5 learner pages load historical evidence/state, run the skill-centric cycle in the browser, then call the same `persistLearningCycle()` service. The B1–B5 persisted learner pages are therefore direct consumers of the current scalar persistence contract. A1, FR2 and experimental pages are useful runtime/interface consumers but are not currently persisted through that service in the reviewed page code.

### 3.4 Service wiring and other product services

`src/app/bootstrap.js` exposes `learnerCurriculum` via `createLearnerCurriculumService()`. It also exposes separate services such as `mastery`, `testHistory` and `practiceResults`.

These are distinct contracts:
- `learnerCurriculum` is the evidence / skill-state / decision-trace service used by the B1–B5 persisted curriculum pages.
- `mastery-service.js` is a separate local-storage streak service. It is not the C6 scientific mastery decision protocol.
- `test-history-service.js` and practice-result services belong to the existing test/practice product history. They are not C8's branch-specific temporal learner model.

These legacy/product services must not be silently merged into the new multi-target branch state. Their own consumers and product behavior remain outside this audit's implementation scope.

## 4. G7 — current persistence and read-model contract

### 4.1 Service behavior

`src/services/learner-curriculum-service.js`:
- reads `student_evidence` by learner key, registry version and skill;
- reads one `student_longitudinal_state` row by learner key, registry version and skill;
- maps each stored evidence row to one prior evidence item with one scalar `evidence_target_id` and one `evidence_assessment`;
- persists one scalar observation/assessment payload through `persist_curriculum_learning_cycle`.

No separate target-assessment/coder-round/adjudication read or write API is present in this service.

### 4.2 Committed schema shape

The committed migrations define:
- `student_evidence`: one row with scalar development, claim, evidence-target, task-model and task-instance columns plus JSONB performance, observation and evidence assessment; unique `(student_key, source_event_id)`.
- `student_longitudinal_state`: one row per `(student_key, curriculum_registry_version_id, skill_id)`; this is skill-level state, not six-part branch state.
- `curriculum_decision_trace`: one trace with learner, registry version, skill, observation IDs and JSONB inference/decision; a later migration adds a unique `(student_key, source_event_id)` index.

The current persistence model therefore cannot represent multiple target-assessment records for one observation as independently queryable canonical records, cannot persist a six-part branch state/history as authoritative records, and constrains one source event to one decision trace.

### 4.3 RPC lifecycle and idempotency

The current `persist_curriculum_learning_cycle` RPC is one atomic stage that:
1. inserts one student-evidence row;
2. upserts one skill-level longitudinal-state row;
3. inserts one decision trace.

Its idempotency key is learner + source event. On a duplicate key it checks that evidence, state and trace rows exist, then returns `duplicate: true`. It does not compare the existing raw observation/assessment/decision payload against a canonical immutable payload. Thus the same key with a different payload is not currently distinguished as an integrity conflict.

This is an implementation finding, not an instruction to patch the RPC. The owner-approved staged lifecycle in O7 requires separate observation, coding/assessment and decision boundaries; its exact physical design remains gated.

### 4.4 Security boundary to preserve

The committed learner-ownership migrations establish guardian-to-learner ownership, RLS-scoped reads and a narrowly scoped authenticated write path. The later migration switches the learning-cycle RPC to `SECURITY INVOKER`, with transaction-local write capability and guardian checks; a subsequent migration clears that capability on error as well as success.

Any future persistence design must preserve the exact ownership, RLS, direct-write denial, capability cleanup and atomic rollback guarantees. The audit does not inspect or assert deployed database state. No Supabase changes are proposed here.

## 5. Consolidated findings and gate disposition

| Gate | Finding | Disposition |
|---|---|---|
| G6 — task/attempt/observation identity | Stable task ID is reused as task-instance ID; no canonical administration ID; observation target collapses to first target; version/provenance is incomplete/inconsistent | **OPEN** — define lifecycle and identity contract before code |
| G7 — runtime consumers | B1–B5 learner pages use skill-centric registry/prototype cycle; A1/FR2 and B1 variants are separate in-memory consumers; C6–C9 modules are not wired into that browser cycle | **INVENTORY BASELINE RECORDED** — consumer-by-consumer compatibility/rollout still requires architecture approval |
| G7 — persistence consumers | B1–B5 use scalar learner-curriculum service and one atomic scalar RPC; one evidence row, one skill state and one trace per source event | **INVENTORY BASELINE RECORDED** — physical redesign remains gated |
| G7 — legacy/product services | Local-storage mastery streak and test/practice histories are separate from C6/C8 | **OUT OF SCOPE** for this multi-target change; preserve and classify if future integration is proposed |

## 6. What this audit does not authorize

- No new task-instance UUID patch.
- No observation schema or C3 codebook selection.
- No multi-target evidence fan-out.
- No C6/C7/C8/C9 runtime integration.
- No scalar consumer adapter implementation.
- No B1-L08 catalogue entry or learner UI.
- No registry, curriculum, task model, mastery rule or test change.
- No SQL/RPC/RLS/Supabase migration or learner-data rewrite.

## 7. Next concrete work

1. Close G1/O5 and G2/O6 with explicit owner/scientific decisions; obtain G4/O9 product decision.
2. Reconcile C6–C9 contracts (G5) against the full six-part identity, frozen snapshots and the current code findings.
3. Use this G6/G7 inventory as the input to the canonical task/attempt/observation contract and consumer-by-consumer legacy compatibility plan.
4. Only then design persistence/read models, staged idempotency/recovery and security (G8–G10).
5. Close contract tests (G11) and obtain explicit G12 authorization before any implementation.

The next implementation step is not a patch to the current controller. The current identity and decision paths have multiple linked contract mismatches; they must be resolved as one coherent design before changing runtime code.
