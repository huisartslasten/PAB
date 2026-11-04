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

The most recent Clock accessibility change attempted to add an etmaal-half label but replaced the existing accessible labels. That change caused Full Regression #2868 to fail. The change was reverted as one coherent three-file restoration commit. Existing browser tests were preserved unchanged. The established accessible labels are restored:
- large clock: `Analoge klok: 08:35`;
- small clock option: `Analoge tijd 08:35`.

No Supabase change was required for the browser-runtime and Clock Learning Interface work.

## 9. Current next engineering step

The last attempted etmaal-half indicator must be redesigned without replacing existing accessible names. The intended design is an additional description (for example, via `aria-describedby`) that supplements the existing labels. Before implementation, inspect the exact restored DOM and browser-test contracts, then design the description lifecycle for both the large clock and mini clock options. Keep the existing accessible labels byte-for-byte intact and do not weaken or rewrite existing browser tests.

The next build step is permitted only from a green Full Regression baseline. Do not add more Clock variants until the etmaal-description contract is correctly implemented and verified.

Then assess whether the same interface/controller separation generalises to another Learning Interface. Do not add page-specific curriculum execution logic.

Do not invent a Clock curriculum skill, add scientific claims or freeze construct-specific mastery rules from synthetic browser data.

## 10. Latest regression state

Latest independently verified Full Regression:
- Commit: `abd0eaa5588c84293f403dd98c5aea6c3393a137`
- Branch: `refactor/professional-v1`
- Full Regression run: #2869 / ID `41763003507`
- Status: **GREEN** (all 15 steps succeeded: dependency vulnerability check, Agenda/practice ownership boundaries, curriculum engine, architecture, Node, Vitest, Chromium browser regression and clean working tree).

Previous failed run:
- Commit: `96581da09090aaf1925a7710767d52a1fd3dfa1a`
- Full Regression run: #2868 / ID `41719356966`
- Status: **RED**.

Restoration commit:
- `abd0eaa5588c84293f403dd98c5aea6c3393a137` — restored the three Clock interface files to the last green baseline while preserving the existing browser tests.

## 11. Supabase

No Supabase schema/runtime change is required for the current browser vertical-slice and Clock Learning Interface work. Change Supabase only for a real persistence/runtime contract requirement.

## 12. Strategy

**Build the brain → prove the vertical chain → build reusable Learning Interfaces/controllers → connect multiple curriculum cases through the same engine → empirically validate with real learners → then build the larger Deluxe world.**
