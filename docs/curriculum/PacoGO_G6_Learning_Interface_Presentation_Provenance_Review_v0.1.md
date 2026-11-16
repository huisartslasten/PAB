# PacoGO — G6 Learning Interface / Presentation Provenance Review v0.1

**Status:** source-derived design review and candidate recommendations; NOT owner-approved; no gate closure or implementation authorization  
**Date:** 2026-11-09  
**Branch:** `refactor/professional-v1`  
**Scope:** G6 logical provenance for the Learning Interface and the actual presentation used in one task administration. This review does not decide physical schema, canonical serialization, payload equality, persistence or runtime behavior.

## 1. Purpose

The G6 identity reviews distinguish reusable task definitions/models from a concrete task administration, response episode, events, raw observation and target-specific assessments. A separate source audit identified a provenance gap: current observations do not consistently identify the Learning Interface, its version, or the exact configuration and rendered presentation the learner encountered.

This review determines what must be distinguishable in the logical record so that PacoGO can later explain and, where technically possible, reproduce the learning interaction without confusing:
- the curriculum task and evidence opportunity;
- the reusable pedagogical instrument;
- the task-specific configuration supplied to that instrument;
- the renderer and actual visual presentation;
- the learner's changing interaction state and captured response.

It is a provenance review, not a proposal to make every visual property a new domain identity.

## 2. Source-derived architecture constraints

The following are supported by current project sources:

1. The Learning Interface System separates pedagogical/function configuration, interaction/state and visual/rendering.
2. Learning Interfaces are reusable pedagogical instruments. One interface may support multiple tasks; task identity, curriculum mapping and evidence assessment remain outside the interface.
3. A renderer may be replaced without changing the mathematical meaning or task identity.
4. The Fraction interface configuration includes task-dependent values and presentation choices, including target/option representations, target layout, response-process requirement and labels. The reusable interface itself has `interfaceId: "fraction"` and version `0.1`.
5. The generic Learning Interface contract has an interface ID and version and separates pedagogical, interaction and visual state, but it does not define a durable provenance identity for a particular configured/presented instance.
6. The Clock interface accepts task-dependent mode, source representation, target time, initial time and options, while the task contract separately defines pedagogical action and response/evidence meaning.
7. The current shared task-instance/observation contract does not consistently retain a canonical Learning Interface identity/version or an exact presented-configuration reference.
8. G6-A's candidate requires a task instance to represent the actual concrete administration, including actual presentation and material administration conditions. G6-B's candidate treats task definition and task model as separate reusable identities.
9. G9 owns canonical payload serialization/equality and replay/conflict behavior. G8/G10 own physical persistence realization. G12 implementation remains unauthorized.

Sources: G6/G7 Read-Only Identity and Consumer Audit v0.1 §§2.1–2.5; G6-A Cardinality Review v0.1 §§3.1–3.3; G6-B Identity Namespace Review v0.1 §§2, 8–10; Fraction Learning Interface Design v0.1 §§1, 3, 5 and 8; `learning-interface-contract.js`; `fraction-learning-interface-contract.js`; `clock-task-contract.js`; `clock-learning-interface.js`.

## 3. Logical concepts that must not be conflated

### 3.1 Reusable Learning Interface definition

A reusable Learning Interface has a logical identity and immutable version, for example the current Fraction interface identifier/version. This identifies the reusable pedagogical instrument and its interface contract, not a learner's administration.

Candidate logical reference:
- `learning_interface_id`
- `learning_interface_version`

This identity is distinct from:
- `task_definition_id + version`;
- `task_model_id + version`;
- `task_instance_id`;
- a renderer identity/version;
- a task-specific configuration.

A Learning Interface must not be equated with a task model. A task model describes task/evidence opportunities; a Learning Interface supplies a reusable pedagogical instrument.

### 3.2 Task-specific interface configuration

A task-specific configuration supplies the parameters with which the reusable interface is used. Examples from the Fraction interface include target/option representation, target layout, response-process requirement and labels. Clock has its own mode, source representation, target and option configuration.

The configuration is not itself a new reusable Learning Interface definition. Nor should every ordinary configuration value be assigned a globally unique domain ID without a demonstrated consumer need.

Candidate recommendation:
- preserve an immutable logical snapshot/reference to the effective configuration used when the task administration starts;
- retain the configuration's relationship to the exact task definition/model versions;
- record material deviations or changes as administration facts, not as silent edits to the reusable interface or task definition;
- if the same configuration is later reused, reuse the logical definition/configuration reference where appropriate; do not infer identity from its content hash at G6.

Whether this snapshot needs its own opaque identity, or can be carried as part of the task-instance presentation provenance, remains an owner decision. G9 must define canonical serialization and payload equality before content-derived identity or hashing is considered.

### 3.3 Renderer identity and rendered presentation

A renderer is a replaceable visual implementation. The same pedagogical task may be rendered in different representations or visual layouts; changing the renderer must not silently change the curriculum objective, task identity or evidence target.

For reproducibility and auditability, the administration provenance should identify:
- the renderer/renderer version actually used, where that renderer is versioned;
- the effective visual configuration that materially affects what the learner saw;
- the selected representation/layout and relevant accessibility/language presentation settings;
- any material presentation deviation from the intended configuration.

The renderer reference is not a substitute for the Learning Interface identity. The Learning Interface identity is not a substitute for the actual rendered configuration.

This review does not require recording ephemeral CSS values, viewport dimensions, animation frame state, every DOM attribute or other transient rendering details unless a later evidence/reproducibility requirement demonstrates that they materially affect the learning interaction.

### 3.4 Interaction state and learner response

The learner's changing interaction state (selection, entered answer, explanation, pointer movement, retries, lock/submission state) belongs to the response episode's ordered events and raw observation, under the existing G6 lifecycle boundary.

Do not copy the full changing interaction state into a static interface-definition identity or configuration identity. Preserve the event/response history in its own logical layer.

## 4. Candidate provenance structure

The recommended conceptual structure is:

```text
versioned task definition ─┐
versioned task model ───────┼─> started task instance
                            │      ├─ actual administration facts
versioned Learning Interface ──────┤
task-specific interface configuration ─┤
renderer/version + effective visual configuration ─┘
                                   │
                                   └─> response episode
                                         ├─ ordered interaction events
                                         └─ one immutable raw observation
                                               └─ zero or more target assessments
```

This is a logical provenance graph, not a prescribed table layout or mandatory parent/child foreign-key structure.

At minimum, the task instance/raw observation provenance must allow a consumer to resolve:
1. which task definition and task model versions applied;
2. which Learning Interface definition/version was used, if any;
3. which effective task-specific interface configuration was used;
4. which renderer/version and materially relevant visual configuration were actually used;
5. what material administration/support deviations occurred;
6. which response episode and raw observation contain the learner's actual interaction.

The interface/configuration references should be captured as part of the actual started administration. A preview or unopened task still creates no task-instance/response-episode/observation identities under the G6-A candidate.

## 5. Candidate minimum rules

1. A Learning Interface definition/version is a reusable logical identity, separate from task definition/model identities.
2. A task-specific interface configuration is a distinct concept from the reusable interface definition. It must be recoverable as the effective configuration used for that administration.
3. Renderer identity/version is distinct from Learning Interface identity/version.
4. The actual rendered representation/layout and material presentation settings must be preserved as administration provenance when they can change the learner's experience or interpretation.
5. The task instance is the logical anchor for the actual administration provenance. The raw observation must retain a stable path to that provenance; it must not rely on the current page code or current default configuration to reconstruct what was presented.
6. Interaction events and learner response remain in the response-episode/observation layer, not in the reusable interface definition.
7. A material change to content, representation, response mode or support condition follows the existing G6 lifecycle rule: preserve the prior episode and start a new task instance/response episode/observation.
8. A visual implementation replacement that does not change the pedagogical meaning or actual task administration need not automatically create a new task instance. Whether it requires a new renderer version/provenance reference is a versioning decision for the interface/rendering contract.
9. No identity is derived from a timestamp, learner identifier, array position or unapproved content hash.
10. This review does not define physical IDs, key formats, canonical serialization, snapshot byte representation, persistence or replay mechanics.

## 6. Cardinality and ownership questions still open

The current sources establish reusable interfaces and task-specific configuration, but do not settle every cardinality/ownership detail. These must remain explicit:

- Can one task instance use multiple Learning Interfaces in a composed interaction, or is one interface the minimum/maximum for the current learner flow?
- Can a task-specific configuration be shared across task definitions/models, or is it always scoped to one task administration?
- Is the effective configuration snapshot owned by G6 as administration provenance, by the Learning Interface contract, or split between them?
- Does every renderer require an independently versioned identity, or only renderers whose version can materially affect interpretation/evidence?
- Which visual settings are material enough to retain for reproducibility, and which are presentation-only noise?
- What is the required fallback when a historical interface/renderer version is no longer executable?
- How should adaptive instructional-method profiles and their provenance/uncertainty be represented alongside, but not confused with, the task's pedagogical configuration? The handoff's Adaptive Instruction Layer requirements remain controlling; this review does not redefine them.

The sources do not justify silently selecting answers to these questions.

## 7. Cross-gate boundaries

| Concern | Owning workstream | This review |
|---|---|---|
| Logical task definition/model/instance/episode/event/observation identities | G6 | Preserve existing candidate boundaries |
| Learning Interface/configuration/presentation provenance meaning | G6 + Learning Interface contract | Candidate minimum defined here |
| Instructional-method profile, source provenance and uncertainty | Adaptive Instruction Layer / product architecture | Preserve handoff requirements; no new method decision |
| C3 target-assessment vocabulary and deterministic assessment rules | G2/O6 | Not selected |
| Canonical snapshot fields, serialization, equality, replay/conflict and durable retry | G9 | Not selected |
| Physical keys, tables, constraints, persistence, recovery and security | G8/G10 | Not selected |
| Conformance tests | G11 | No test changes authorized |
| Runtime implementation | G12 | NOT AUTHORIZED |

## 8. Recommendation and owner disposition required

Recommended direction:

- introduce a distinct reusable Learning Interface identity/version in the logical provenance inventory;
- preserve the effective task-specific configuration as immutable administration provenance;
- preserve renderer/version and materially relevant visual presentation settings separately from the pedagogical interface identity;
- anchor all actual presentation provenance to the started task instance and retain a stable path from the raw observation;
- keep learner interaction state and response history in the response episode/observation;
- leave exact cardinality, snapshot ownership, renderer versioning threshold and material-visuality criteria as explicit owner decisions until source/consumer reconciliation is complete.

This is a candidate recommendation, not an approved contract. G6 remains OPEN; G9 remains OPEN; G12 remains NOT AUTHORIZED. G6-A and G6-B remain separate candidate recommendations pending owner disposition.

## 9. Verification boundary

This document is documentation-only. It changes no runtime, tests, curriculum registry, task catalogue, learner state, data schema, database, SQL/RPC/RLS, Supabase or learner data. It does not authorize implementation, empirical learner-data collection or a new Learning Interface runtime.


## Owner-delegated disposition — 2026-11-09

The bounded Learning Interface provenance recommendation has received a logical disposition under the owner's instruction to proceed using best judgement. See `PacoGO_G6_Logical_Boundary_Disposition_v0.1.md`, the controlling decision record.

Approved logical boundaries:
- A reusable Learning Interface is identified by its own ID and immutable version, distinct from task definition and task model identities.
- The effective task-specific interface configuration is captured as actual administration provenance; a separate globally unique configuration ID is not required unless a real consumer later demonstrates that need.
- Renderer identity/version, where versioned, is distinct from Learning Interface identity/version.
- Materially relevant rendered representation/layout, accessibility/language presentation settings and material presentation deviations are captured with the started task instance.
- The raw observation retains a stable path to the actual administration provenance. Interaction state/events remain in the response-episode layer.
- The model permits multiple interface provenance entries where a composed task genuinely uses more than one interface; this does not force every task to use an interface or establish a universal one-interface-per-task rule.

Exact renderer versioning thresholds and the boundary between material presentation facts and transient rendering noise remain subject to the actual interface/evidence requirements. G6 remains OPEN for lifecycle, timeout, interruption restoration and final O6/C3 envelope reconciliation. G9 remains OPEN; G12 remains NOT AUTHORIZED.
