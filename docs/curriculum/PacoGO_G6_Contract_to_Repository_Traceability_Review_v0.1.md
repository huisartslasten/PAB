# PacoGO — G6 Contract-to-Repository Traceability Review v0.1

**Status:** read-only implementation mapping; candidate findings, not an approved implementation plan  
**Date:** 2026-11-09  
**Branch:** `refactor/professional-v1`  
**Baseline Full Regression:** #3412 GREEN on `bc5c7db00955465495dbaed50b7a4d364aa79c54`  
**Scope:** translate the current G6 candidate contracts and Learning Interface provenance review into the existing repository structure. No code changes are made by this review.

## 1. Why this document exists

The curriculum design documents are not a parallel product or a replacement for the repository. They define and reconcile the logical contracts that the code must implement. This review is the bridge: it names the existing implementation, identifies what already corresponds to the candidate contracts, and isolates the unresolved gaps before any implementation work is proposed.

This review deliberately distinguishes:
- **implemented:** directly visible in current source;
- **partially represented:** some required information or behavior exists, but the candidate contract is not fully represented;
- **not represented in the inspected path:** no source evidence found in the inspected implementation;
- **not decided:** the candidate contract is not yet owner-approved, so no code change should be inferred.

A source-code observation is not a defect by itself. It becomes an implementation requirement only after the relevant logical contract is approved.

## 2. Existing repository components

| Concern | Existing source | What it currently does |
|---|---|---|
| Generic Learning Interface state separation | `pacogo-engine/learning-interface-contract.js` | Carries `interface_id`, `version`, pedagogical state, interaction state and visual state; update function merges state patches |
| Fraction interface configuration | `pacogo-engine/fraction-learning-interface-contract.js` | Validates Fraction task presentation settings and returns a config with `interfaceId: fraction`, version `0.1`, target/options, representation choices, layout, response-process requirement and labels |
| Fraction presentation | `pacogo-engine/fraction-learning-interface.js`, `fraction-learning-interface-renderers.js`, `fraction-learning-interface.css` | Renders target and options, captures selected option and optional explanation, and locks after submission |
| Fraction/controller boundary | `pacogo-engine/fraction-interface-controller-bridge.js` | Sends selected-option and explanation interactions to the controller and enforces one submission |
| Fraction task/evidence observation | `pacogo-engine/fraction-equivalence-controller.js` | Creates a task instance, records events, constructs an observation, and carries response/performance/context/provenance fields |
| Browser-to-curriculum runtime | `pacogo-engine/browser-vertical-slice.js` | Resolves task by catalogue task ID, checks observation skill binding, and passes the observation to the curriculum registry |
| Clock task and interface | `pacogo-engine/clock-task-contract.js`, `clock-learning-interface.js`, `clock-controller.js`, `clock-interface-controller-bridge.js` | Separates clock task forms and response modes; emits interaction events and bridges them to the controller |
| Addition task/interface | `pacogo-engine/addition-learning-interface-contract.js`, `addition-learning-interface.js`, `addition-controller.js` | Validates addition representations and mapping tasks; captures mapping/answer and optional support interactions |

The current implementation is therefore substantial. The gap is not “there is no Learning Interface architecture”; the gap is whether the current contracts preserve all of the administration and presentation provenance now being considered in G6.

## 3. Mapping: G6-A task instance / response episode / observation

### Already present

- The Fraction controller calls `createTaskInstance` when its controller is created.
- It records `task_presented`, selection and submission events.
- It creates an observation from the task instance and event history.
- The browser vertical-slice runtime resolves the catalogue task and checks its `skill_id` against the submitted observation.

### Candidate-contract mismatch to resolve before implementation

The G6-A review proposes that a task instance represents a started administration and is paired 1:1 with a response episode, with one immutable raw observation per episode. In the inspected Fraction path:
- the controller creates the task instance at controller construction, not through a clearly exposed explicit “administration started” boundary;
- no separately named response-episode identity is visible in the inspected controller call path;
- the observation is assembled at submission and its lifecycle is not the same thing as a durable, independently identified episode record;
- the catalogue `task_id` is passed into `createTaskInstance`, so the current contract must be inspected and reconciled to ensure it is not being used as the unique administration identity.

These are exact source observations, not instructions to edit the current functions. The G6-A owner decision must settle the logical lifecycle first. G9/G8/G10 then determine replay, durable stage and persistence behavior.

## 4. Mapping: G6-B logical identity namespaces

The current Fraction path passes:
- catalogue task ID and task model ID;
- skill, development, claim and evidence target IDs;
- a task-definition version literal;
- task-instance identity created by the interaction contract;
- event IDs created by the interaction contract;
- observation ID created by the interaction contract.

The G6-B candidate additionally distinguishes reusable task definition and version, reusable task model and version, task instance, response episode, event, raw observation and target assessment.

The inspected path does not yet demonstrate the complete candidate inventory:
- no distinct response-episode identity is visible;
- no separate target-assessment identity is created in the inspected controller;
- task-definition version is supplied as a literal `0.1` in the Fraction controller;
- the actual scope/uniqueness guarantees of `createTaskInstance`, `createInteractionEvent` and `createObservation` require a direct audit of `interaction-contract.js` before any code-level conclusion about uniqueness is made.

Do not infer that an existing helper is incorrect without that direct audit. G6-B remains a candidate until owner disposition.

## 5. Mapping: Learning Interface and presentation provenance

### Fraction

The Fraction config already provides a reusable interface identifier/version and captures important effective task-specific values:
- target fraction and options;
- general, target and option representation;
- target layout;
- response-process requirement;
- labels.

The controller separately receives task, target fraction, options, representation and optional provenance. It records a `task_presented` event with target fraction, option count and a representation value.

Partially represented / not demonstrated by this path:
- an explicit immutable reference or snapshot of the exact effective interface configuration used;
- renderer identity/version actually used;
- a clear separation in observation provenance between reusable interface definition, task-specific configuration and renderer/presentation;
- proof that all material configuration values are recoverable from the observation without relying on current defaults or source code.

The existing `provenance` argument is extensible, but extensibility alone does not establish a stable semantic contract or completeness.

### Generic contract

`learning-interface-contract.js` separates pedagogical, interaction and visual state, which aligns with the product architecture principle. It is a runtime state object, however, not yet a complete administration provenance record. It does not itself establish how a particular task instance captures the effective configuration and renderer that were used.

### Clock and Addition

Clock's task contract distinguishes pedagogical action, source representation, response representation, interaction type and evidence meaning. The interface emits event payloads containing mode and representation context. Addition distinguishes representation mapping and total-only interactions. These are useful task/interface contracts, but the inspected sources do not establish a uniform cross-interface provenance envelope for task instance, interface version, effective configuration and renderer version.

## 6. Proposed repository translation sequence (not authorized implementation)

The source-to-code sequence should be:

1. **Finish logical G6 reconciliation and owner disposition.** Resolve G6-A cardinality, G6-B identity scope, and Learning Interface/configuration/presentation provenance boundaries. Do not implement candidate recommendations as if already approved.
2. **Audit the shared interaction contract directly.** Inspect `pacogo-engine/interaction-contract.js` and every consumer. Verify actual identity creation, uniqueness, immutability, event ordering and observation lifecycle against the approved logical contract.
3. **Produce a field-level contract-to-code matrix.** For each approved logical field, identify its current source, current consumer, whether it is already captured, and the exact gap. Include Fraction, Clock, Addition and A1/B1/FR2 browser vertical slices.
4. **Design the minimal shared contract change.** Only after the gaps are verified, decide whether a shared interaction-contract extension, interface-provenance envelope, or separate adapter is the smallest correct architecture. Keep task definition, task model, Learning Interface, renderer and configuration identities distinct.
5. **Review downstream gates.** Resolve G9 canonical payload/replay and G8/G10 persistence implications before implementation. G11 tests must derive from approved contracts, not be weakened to accommodate an implementation.
6. **Ask for explicit implementation authorization (G12).** No runtime, test, schema, learner-state, registry or Supabase changes before this authorization.
7. **Implement one coherent vertical slice.** Prefer an existing FR2/Fraction path because it is already integrated and is the practical priority; preserve the existing five FR2 demonstrations and do not treat synthetic observations as learner evidence.
8. **Run Full Regression on the exact implementation commit.** If red, stop and isolate the cause before any further change.

## 7. Decisions that must not be smuggled into code

- G6-A 1:1 task-instance/response-episode recommendation is not approved.
- G6-B identity namespace recommendations are not approved.
- Learning Interface provenance recommendations in the companion review are not approved.
- No physical ID format, UUID/ULID, content hash, canonical serialization or database key is selected.
- No new C3 assessment vocabulary or mastery rule is selected.
- No curriculum registry mapping is changed.
- No Adaptive Instruction Layer method-selection behavior is implemented by this review.
- No runtime implementation is authorized; G12 remains NOT AUTHORIZED.

## 8. Current practical direction

The repository already contains reusable Learning Interface implementations and the A1/B1/FR2 vertical-slice chain. The next useful engineering artifact is not another abstract interface concept. It is the approved, field-level mapping between G6's logical contracts and the shared interaction/observation code, followed by a minimal, reviewable implementation plan.

The FR2 Fraction interface remains the best first implementation candidate after approval because it is already used by five technical demonstrations and directly supports the immediate fractions-learning priority. That is a sequencing recommendation only; it does not authorize runtime changes or claim that the demonstrations are validated learning interventions.

## 9. Verification boundary

Documentation-only. No source code, tests, curriculum registry, task catalogue, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed. The existing Full Regression #3412 was GREEN on the parent commit before this review was added. This document's own commit requires a fresh Full Regression.
