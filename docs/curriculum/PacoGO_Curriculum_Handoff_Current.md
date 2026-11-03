# PacoGO Curriculum — Current Handoff

> **HANDOFF IS THE CROSS-CHAT SOURCE OF TRUTH.** Every new chat working on PacoGO Curriculum must read this file first.

## 1. Current position

PacoGO is a learning/curriculum platform. The curriculum engine is the scientific decision layer; learner-facing Learning Interfaces are built on top of it.

Working branch: `refactor/professional-v1`  
`main` / LIVE must not be touched.

## 2. Engineering workflow

Before every build step: Full Regression → green means build → red means stop and isolate the exact root cause → classify cause → design the proper underlying solution → implement → Full Regression again. Never guess or symptom-patch. Tests are changed only when demonstrably incorrect or when an intentional contract change has been correctly designed.

Always report the exact commit tested and the actual regression result.

## 3. Scientific curriculum engine

C1–C9 are complete.

Core chain:
`curriculum → skill → development → claim → task → learner performance → evidence → evidence assessment → inference → mastery → next action → learner state → validation`

- C1: claim-centred validation design; feasibility, discriminating and longitudinal phases separated.
- C2: learner/context → task instance → interaction/observation → evidence assessment → inference → decision.
- C3: evidence coding includes target match, performance, process, quality, contradiction, prompting/independence, alternatives and reliability.
- C4: discriminating tasks and readiness gates; 19 tasks over 10 developments, model families M0–M4.
- C5: developmental ordering distinguished from sequence, temporal precedence, prediction, prerequisite and causality; alternatives, invariance, longitudinal design and model comparison explicit.
- C6: mastery is claim/development/scope/time bounded; seven gates; no automatic promotion.
- C7: prerequisite ordering and next-development ordering remain separate.
- C8: observed evidence, inference, mastery and decision remain distinct over time.
- C9: validates the complete vertical chain and explicit claim selection at multi-claim boundaries.

## 4. Curriculum cases

A1 — Getallen representeren en verbinden is the construction/reference case.

B1 — Optellen and FR2 — Breukequivalentie herkennen en gebruiken remain candidate generalisation cases. Registry presence is not empirical promotion.

The current curriculum registry contains A1, B1 and FR2. Clock is not currently a registered curriculum skill, development or task model.

## 5. Scientific validation — completed design baseline

Completed:
- validation data specification;
- scientific validation protocol;
- W2 repeated-measurement protocol and analysis contract;
- construct-specific validation design;
- A1 study protocol;
- A1 preregistration-readiness specification;
- A1 population/instrument selection gate.

The scientific protocol remains a design baseline, not evidence that PacoGO is scientifically validated. PacoGO remains scientifically grounded, designed and empirically testable, but not empirically validated.

## 6. W2 / C5 boundary

W2 is design-only longitudinal readiness infrastructure. Developmental ordering, prerequisite inference, causal inference, mastery classification, registry promotion and mastery-rule changes remain explicitly blocked.

## 7. Learning Interface System

Build reusable pedagogical instruments, not one traditional lesson per skill.

Conceptual chain:
`skill → development → required interaction forms → Learning Interface(s) → task/evidence`

Interfaces must separate pedagogical/function state from visual/rendering state and remain ready for future PacoGO Deluxe / Upper Tier integration.

The interface runtime contract must preserve:
`interaction → observable event → evidence target → coding dimension → validation dataset field`.

## 8. Current engineering implementation

A1 Number Line, B1 Addition and FR2 Fraction Equivalence demonstrate the same browser vertical-slice bridge:
`browser interaction → interaction controller → observation → shared browser runtime → curriculum registry → learner-state/decision flow`.

Reusable engine components:
- `pacogo-engine/addition-controller.js` — reusable B1 quantity-addition interaction controller;
- `pacogo-engine/addition-controller.test.js` — B1 evidence/interaction contract test;
- `pacogo-engine/fraction-equivalence-controller.js` — reusable FR2 equivalence interaction controller;
- `pacogo-engine/fraction-equivalence-controller.test.js` — FR2 evidence/interaction contract test;
- `pacogo-engine/browser-vertical-slice.js` — shared browser-to-registry runtime for task resolution and observation submission;
- `pacogo-engine/browser-vertical-slice.test.js` — runtime delegation, task lookup, duplicate-task, task/skill binding and input-contract tests.

The browser runtime exposes `runTaskObservation({ taskId, observation, ... })`. The runtime resolves the task and rejects an observation whose `skill_id` does not match that task. Page code remains responsible for presentation and interaction wiring, while curriculum task identity and registry execution remain centralized.

Browser vertical slices using the shared runtime/task-bound contract:
- `curriculum-a1-numberline.html` — A1-T01;
- `curriculum-b1-addition.html` — B1-T01;
- `curriculum-fr2-fraction-equivalence.html` — FR2-T01;
- `curriculum-fr2-fractions.html` — FR2-T02.

All four browser slices route their observation submission through `runTaskObservation`; page code cannot accidentally submit evidence under a different task skill after resolving a task.

FR2 controller lifecycle explicitly prevents duplicate submission after an observation has been emitted.

### Clock Learning Interface

Clock is a reusable Learning Interface prototype, not a registered curriculum skill. The `CLOCK-*` task IDs and `CLOCK` skill/claim/evidence identifiers in its browser demonstration are synthetic fixture identifiers only. They are not curriculum registry entries, learner evidence from real students, or scientific validation. Do not promote them into the curriculum registry without a separately defined curriculum skill, development, claim, task model and evidence targets.

Technical components:
- `pacogo-engine/clock-task-contract.js` — defines and validates distinct clock task forms;
- `pacogo-engine/clock-controller.js` — records task-specific clock responses and evidence;
- `pacogo-engine/clock-analog-input.js` — maps pointer angles to hour/minute values, including hour-boundary behavior;
- `pacogo-engine/clock-learning-interface.js` and `pacogo-engine/clock-learning-interface.css` — reusable analog/digital clock presentation and response interaction;
- `pacogo-engine/clock-interface-controller-bridge.js` — routes time-entry, hand-setting and representation-choice responses to their controller boundaries;
- `curriculum-clock-controller-interface.html` — browser vertical-slice demonstration.

Three pedagogically distinct task contracts are now explicit:

1. `read_analog_time`: analog clock as source; learner enters a digital time. The controller accepts a digital response and records `read_time`.
2. `set_analog_clock`: digital time as source; learner manipulates the analog clock hands. The controller accepts an analog response and records `set_time`.
3. `match_representations`: the source may be an analog clock or a digital time; the learner selects an equivalent representation from options. The task contract requires at least two options, unique option IDs and exactly one option equivalent to the target time. It derives the option representation as the opposite of the source representation. The controller records source representation, response type, option representation, selected option ID and selected time.

The matching interface works in both directions: analog source → digital-time options, and digital source → analog-clock options. Analog options are rendered as mini clock faces; the source answer is not revealed. Both correct and incorrect selections are recorded as distinct observations. The controller now persists the option representation in the observation instead of leaving it implicit. The interface/controller boundary keeps the three response types separate: digital time entry, analog clock manipulation and representation choice.

The two conversion directions are also tested end to end:
- analog source → digital answer;
- digital source → analog hand setting.

The analog hour-hand calculation uses hour-mark boundaries rather than rounding to the nearest hour. These browser interactions are technical integration tests only; they do not validate learning, developmental ordering or mastery claims.

No Supabase change was required for the browser-runtime and Clock Learning Interface work.

## 9. Current next engineering step

Continue Clock Learning Interface development only where a distinct pedagogical interaction is specified. Both matching directions now share one validated contract. Next, review the pedagogical progression and task parameters (e.g. time precision, hour-cycle conventions and representations) before implementing more variants. Keep reading, setting and matching separate; do not infer developmental ordering from these synthetic demonstrations.

Then assess whether the same interface/controller separation generalises to another Learning Interface. Do not add page-specific curriculum execution logic.

Do not invent a Clock curriculum skill, add scientific claims or freeze construct-specific mastery rules from synthetic browser data.

## 10. Latest regression state

Latest independently verified Full Regression:
- Commit: `7be8e1da515794f8e4e98d2d2c6542be980afa54`
- Branch: `refactor/professional-v1`
- Full Regression run: #2861 / ID `41703153983`
- Status: **GREEN** (curriculum engine, architecture, Node, Vitest, browser regression and working-tree checks all succeeded).

Recent Clock milestone commits:
- `2c6f8ff99e7b21bdc8235efd2b0ff39b5c7f7a77` — correct analog hour-hand boundary calculation;
- `15fcb0c1695845d5bbf46fc857da31a1ca5b8805` — Clock browser vertical slice and separated stylesheet;
- `89f57cde009c5cb3bfd401ce94aeca4d75bacf65` — bridge follows the interface's current response representation;
- `e00464383354d814285ee04f3f6689f45cf52922` — browser regression covers digital time setting;
- `7fb1206b36bb91e6fa89e3c2f119d42b4884ebf1` — source and response representations are separated by task mode;
- `899feba93ec5fc3ddb7b3023c3bda8787c5dff56` — distinct pedagogical task contracts;
- `d028f17c51356fb3eb703bcec14926ddd7a79ea8` — controller response/evidence tied to task type;
- `9600a2df56aa7dd061748617f79c0cb75732446c` — visual matching task and end-to-end browser coverage;
- `cfdf3338ac0800716e5ffa4b8e61ddb476123599` — bidirectional source/option representations in the matching interface;
- `7be8e1da515794f8e4e98d2d2c6542be980afa54` — controller persists the matching option representation in evidence.

## 11. Supabase

No Supabase schema/runtime change is required for the current browser vertical-slice and Clock Learning Interface work. Change Supabase only for a real persistence/runtime contract requirement.

## 12. Strategy

**Build the brain → prove the vertical chain → build reusable Learning Interfaces/controllers → connect multiple curriculum cases through the same engine → empirically validate with real learners → then build the larger Deluxe world.**
