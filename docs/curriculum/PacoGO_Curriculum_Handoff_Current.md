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

**Adaptive instruction is a core product and architecture requirement.** Schools and teachers may use different instructional methods, representations, terminology, notation and solution procedures for the same curriculum objective. PacoGO must not assume one universal school method or impose an unverified alternative that may conflict with the learner's classroom instruction.

The instructional layer must therefore be adaptable to the method actually used by the learner, with method information grounded in confirmed sources such as parent/teacher input or supplied school materials. Learner interaction may provide clues but must not, by itself, be treated as proof of the school's method. Method profiles need provenance and an explicit uncertainty/unknown state. When the method is unknown or uncertain, PacoGO must not claim alignment or invent a school-specific procedure; it should use a carefully chosen conceptual/visual explanation that does not falsely present itself as the classroom method, or seek confirmation where the choice materially affects instruction.

Keep these concerns distinct:
- **Curriculum:** what the learner is expected to learn; existing SLO-based skills and goals remain unchanged.
- **Instructional method:** how the school/teacher teaches the content, including method-specific steps, terminology and notation.
- **Learning Interface:** the reusable pedagogical instrument through which PacoGO presents, practises and captures interaction/evidence; it may support multiple instructional approaches without duplicating the whole interface.

The future Adaptive Instruction Layer selects and configures the appropriate explanation, examples, representations, notation and feedback while preserving the same curriculum objective and evidence boundaries. This requirement applies across Learning Interfaces (including Fraction, Clock, Number Line, Measurement and Ratio), not only to fractions. It must be designed before method-specific teaching/feedback is implemented in an interface. This is a product/architecture requirement, not permission to change existing skills, SLO mappings, claims, evidence targets or mastery criteria.

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
- `curriculum-fr2-fractions.html` — FR2-T02;
- `curriculum-fr2-representation-transfer.html` — FR2-T03;
- `curriculum-fr2-surface-countertask.html` — FR2-T04;
- `curriculum-fr2-language-reduced-transfer.html` — FR2-T05.

All seven browser slices route their observation submission through `runTaskObservation`; page code cannot accidentally submit evidence under a different task skill after resolving a task.

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

## 9. Current Learning Interface work and next step

### Clock

The Clock Learning Interface is technically complete as a reusable browser prototype. It supports:
- analog source → digital time entry;
- digital source → analog hand setting;
- matching representations in both directions;
- task-specific interaction/evidence recording;
- accessible descriptions that communicate the 12-hour ambiguity without replacing the established accessible names.

Clock remains a reusable interface prototype, not a registered curriculum skill. Its identifiers and browser demonstrations are synthetic fixtures, not real learner evidence or scientific validation.

### Fraction — reusable interface implemented

Design document: `docs/curriculum/PacoGO_Fraction_Learning_Interface_Design_v0.1.md`.

The Fraction interface is implemented as one reusable instrument shared by FR2-T01–T05. It includes:
- renderer-independent interface contract and configuration;
- `area_model` and `symbolic_fraction` renderers;
- separate `targetRepresentation` and `optionRepresentation` settings for mixed-representation tasks;
- `bar` and `grid` area-model target layouts;
- shared option-selection and learner-justification state;
- bridge to the existing Fraction evidence controller;
- task-bound observation submission through `runTaskObservation({ taskId, observation })`.

Task coverage:
- FR2-T01: area-model target and area-model options;
- FR2-T02: symbolic target and symbolic options;
- FR2-T03: area-model target and symbolic options for representation transfer;
- FR2-T04: grid area-model target and symbolic options for a changed visual surface;
- FR2-T05: area-model target and symbolic options for language-reduced visual transfer.

The task-oriented representation label is stored separately by the controller for the observation. It is not passed as a visual renderer setting. The fix for this boundary is commit `cd235ae7364c828dfa15dec9725fa3cee4747567`.

Implementation components:
- `pacogo-engine/fraction-learning-interface-contract.js`;
- `pacogo-engine/fraction-learning-interface-renderers.js`;
- `pacogo-engine/fraction-learning-interface.js`;
- `pacogo-engine/fraction-interface-controller-bridge.js`;
- `pacogo-engine/fraction-learning-interface.css`;
- `pacogo-engine/fraction-learning-interface.test.js`;
- integrated pages `curriculum-fr2-fraction-equivalence.html` (FR2-T01), `curriculum-fr2-fractions.html` (FR2-T02), `curriculum-fr2-representation-transfer.html` (FR2-T03), `curriculum-fr2-surface-countertask.html` (FR2-T04) and `curriculum-fr2-language-reduced-transfer.html` (FR2-T05).

The architecture separates pedagogical/function configuration, interaction/state, and visual/rendering. FR2 task IDs, evidence IDs and curriculum execution remain outside the reusable interface. The required-justification behavior is derived from the task contract, not hardcoded in the interface.

The browser regression verifies that submission is blocked when required explanation is absent, that the learner's raw explanation is preserved in the observation, and that successful interaction does not automatically award mastery. The existing controller/runtime and curriculum decision boundaries remain authoritative.

Important scientific/evidence boundary retained:
- FR2-T01/T02 currently map to FR2.ET1 (recognition) while requesting justification. This remains an open curriculum/evidence alignment question. Preserve raw explanation data, but do not silently map it to FR2.ET3 or infer explanatory mastery.
- Correct selection and explanation quality remain separate. Do not automatically score free-text explanations or infer misconceptions from them.

Do not alter curriculum mastery rules or add a Supabase migration without a genuine persistence/runtime requirement. Do not add more Clock variants or invent a Clock curriculum skill.

## 9A. FR2 task/evidence alignment audit and next step

Audit document: `docs/curriculum/PacoGO_FR2_Task_Evidence_Alignment_Audit_v0.1.md`.

The audit reviewed FR2-T01–T05 against the registry, pilot task set, C3 coding specification, C4 discriminating task set and current Fraction controller path. It found unresolved task-model/evidence-target mismatches (notably TM2/ET3–ET4 and TM5/ET2–ET6), an incomplete language-reduced condition for T05, and a boundary in the synthetic demo where the controller emits provisional evidence-assessment fields directly from correctness.

Keep the five pages as synthetic technical demonstrations only. Do not use their generated observations as independently coded pilot evidence. Do not change FR2 registry mappings, C3 coding rules, mastery logic or Supabase as part of this audit.

**Specification created:** `docs/curriculum/PacoGO_FR2_Task_Evidence_Alignment_Specification_v0.1.md`. It proposes an immutable raw observation with separate target-specific C3 assessments; one response remains one observation even when assessed against multiple targets. It identifies the Pilot_DataSchema v0.2 singular-field versus Empirical_Observation_Schema v0.1 array-field mismatch. It proposes T01/T02 remain recognition tasks unless deliberately redesigned for ET2; T03 must not claim ET4 stability without a linked contrast; T04 needs a genuine surface-cue countertask for ET2/ET6; T05 needs an operationalised language condition and matched comparison. ET6 is treated as contradiction/counterevidence, not positive mastery evidence. These are candidate design decisions requiring review, not approved mapping or schema changes.

**Next concrete step:** review/approve or revise the v0.1 specification. Do not change registry mappings, task pages, runtime, coding rules or Supabase until the contract is approved.

## 9B. FR2 Task–Evidence Alignment Specification

Specification: `docs/curriculum/PacoGO_FR2_Task_Evidence_Alignment_Specification_v0.1.md`.

Created as candidate design-only work after Full Regression #2884 was verified GREEN on baseline commit `3e9b9158f8042eca678deb7c550b997a0c46f1bf`.

Key proposed boundaries:
- one administered task-instance response episode = one immutable raw observation, including ordered attempts/events; separately administered bundle instances get separate observations linked by a contrast-set/bundle identifier;
- raw process availability is separate from C3 coded evidence status;
- separate target-specific C3 assessment records, with coder/codebook provenance;
- one observation assessed against multiple targets is still one observation and is not multiple independent evidence;
- task-model target lists are opportunities, not automatic target assessments;
- resolve the singular target/coding fields in Pilot_DataSchema v0.2 against the array target linkage in Empirical_Observation_Schema v0.1 before creating a new canonical schema version;
- a second source-level inconsistency was found: C3 specification v0.1, Evidence Coding Manual v0.1 and Pilot_DataSchema v0.2 differ in target-match categories, evidence/process status, quality scale and independence granularity. These must be reconciled in a versioned canonical codebook/schema; do not silently select or translate categories;
- T01/T02 explanations remain raw supplementary process data unless the task is deliberately redesigned for ET2/ET3;
- T03 cannot claim ET4 stability without a linked contrast across representation conditions;
- T04 needs a true surface-cue countertask to elicit ET2 and potentially ET6;
- T05 needs an operationalised language manipulation and matched comparison;
- ET6 is contradiction/counterevidence, not positive mastery evidence;
- current browser tasks remain synthetic; no real learner data, registry, runtime, coding-rule or Supabase changes are authorised by this specification.

**Current gate:** reconcile the C3 codebook vocabulary/scales and observation unit, then review and approve/revise the specification before implementation. The specification and this handoff update require Full Regression verification.

## 10. Latest regression state

Latest independently verified Full Regression at the start of the FR2 alignment specification work:
- Commit: `3e9b9158f8042eca678deb7c550b997a0c46f1bf`
- Branch: `refactor/professional-v1`
- Full Regression run: #2884 / ID `41770424879`
- Status: **GREEN** (all 15 workflow steps succeeded, including curriculum engine, architecture boundaries, maintained Node/Vitest regression, browser regression and clean working tree).

The specification and this handoff update are newer documentation changes. Their exact final commit and Full Regression result must replace this baseline entry after the next regression completes.

FR2-T03–T05 integration and regression correction:
- Implementation commit: `91e6c21e64888fdde4b427ea4b008be2fd13ed50` added the mixed-representation configuration, grid target layout and three FR2 task pages.
- Full Regression #2881 / ID `41767508513` was **RED**: 49 tests passed; the three new T03–T05 browser tests failed because task-oriented representation labels were incorrectly passed into the interface's visual representation field.
- Root-cause correction: `cd235ae7364c828dfa15dec9725fa3cee4747567` separates `controllerRepresentation` from visual interface configuration in all three pages. The controller continues to preserve the task-oriented representation in the observation.
- Full Regression #2882 verified the correction: all 52 browser tests passed and the working tree was clean.

Fraction implementation:
- Initial implementation: `48c1bb1e01b8ab95c55b40c3d9259c9840a32059`.
- Regression #2876 / ID `41765452365` was **RED**. The failure exposed a page heading contract mismatch; inspection also found the FR2-T02 browser test did not exercise the required explanation contract.
- Root-cause corrections: `02b32891997ace53c2bce04f621725fbf22799d2` and `45a3cb74c5288cc15d061dd0430189a713daf249` restored the established page heading and derived the explanation requirement from task data.
- Test correction: `3b7f69163778c231368885c658a16bc55a0aa394` updates the browser test to exercise the real interface selector, verify missing explanations are rejected, submit an actual explanation, and verify raw explanation preservation and no automatic mastery.
- The corrected implementation and browser test passed Full Regression #2879 and browser proof #630.

Earlier Clock accessibility implementation:
- `1d48c526583eeff133fd36abb1ccbc419c802189` — supplementary Clock descriptions and browser assertions; dedicated browser proof #629 / ID `41764521463` was **GREEN**.
- The full regression for the subsequent branch head is recorded above.

Earlier failed run:
- Commit: `96581da09090aaf1925a7710767d52a1fd3dfa1a`
- Full Regression run: #2868 / ID `41719356966`
- Status: **RED**.

Restoration commit:
- `abd0eaa5588c84293f403dd98c5aea6c3393a137` — restored the three Clock interface files to the last green baseline while preserving the existing browser tests.

## 11. Supabase

No Supabase schema/runtime change is required for the current browser vertical-slice and Clock Learning Interface work. Change Supabase only for a real persistence/runtime contract requirement.

## 12. Strategy

**Build the brain → prove the vertical chain → build reusable Learning Interfaces/controllers → connect multiple curriculum cases through the same engine → empirically validate with real learners → then build the larger Deluxe world.**

## 14. Adaptive instruction — future expansion requirement (2026-11-04)

The product owner confirmed the strategic direction:

**PacoGO must be architecturally prepared for future school-method-aware instruction, but this is not a prerequisite for the first operational learning version. The immediate priority is to complete the existing curriculum and learner-learning flow so Zyon can start using PacoGO.**

Keep the following principles in the architecture from the beginning:
- separate the fixed curriculum objective from the instructional method and from the reusable Learning Interface;
- do not hardwire one universal school method into the curriculum engine or an interface;
- keep Learning Interfaces reusable and configurable so future method-specific explanations, examples, representations, notation and feedback can be added without rebuilding the interfaces;
- keep pedagogical/function behavior, interaction/state/evidence behavior and visual/rendering behavior separated;
- preserve the existing curriculum, SLO, skill, development, claim, evidence and mastery contracts.

**Scope now:** architecture awareness and clean boundaries only. Do not build the Adaptive Instruction Layer, detailed Method Profile model, source/provenance subsystem, selection rules or method-specific interface integration as part of the immediate curriculum work. Do not let this become a separate blocking project.

**Deferred future work:** when the core curriculum and initial learner experience are ready, return to:
1. confirm which school method/edition applies to a learner and topic;
2. design a proportionate method profile and source/provenance handling;
3. define confirmed/provisional/unknown/conflicting behavior;
4. define how method-specific instruction configures reusable Learning Interfaces;
5. test generality with more than one school method.
The existing workbook evidence for De wereld in getallen, Version 4 (2009), Group 8, Minimum 8b is useful as a future first case, but does not establish the complete teacher instruction method. Do not claim classroom alignment until adequately confirmed.

When method information is unknown or uncertain, PacoGO may still provide correct, bounded conceptual/visual explanation, but must not claim that it matches the school's method or invent a school-specific procedure.

This is a future product/architecture requirement, not permission to change curriculum content, SLO mapping, skills, developments, claims, evidence targets, mastery criteria, learner-state contracts or Supabase. No implementation is authorized by this handoff entry.

## 15. Immediate product priority — get Zyon learning

The immediate delivery priority is to finish the existing curriculum and the minimum complete learner-facing flow so Zyon can begin using PacoGO. Do not expand the scope into a separate adaptive-instruction project.

Prioritise the existing roadmap in this order:
1. complete/review the current curriculum and its existing evidence/decision contracts without redesigning the defined curriculum;
2. complete the learner-state and next-action flow needed for a usable learning cycle;
3. deliver the necessary reusable Learning Interfaces and browser learning flow;
4. provide clear, correct explanations, with visual explanation especially important for mathematics;
5. keep architecture boundaries ready for future Adaptive Instruction, but defer its detailed design and implementation.

An imperfect or not-yet-school-method-specific explanation is acceptable for the first operational version if it is mathematically correct, understandable and honest about not necessarily matching the classroom method. The explanation can be improved later without changing the curriculum engine.

**Next concrete step after this handoff update:** resume the existing curriculum/evidence work already identified in Section 13: review the C3 Canonical Codebook Reconciliation Proposal as an evidence/measurement contract only. Preserve the curriculum boundary; ask the product owner before any decision that would affect curriculum meaning or SLO alignment.

## 13. Current C3 reconciliation proposal and curriculum boundary (2026-11-04)

**Curriculum content is a fixed project boundary for this work.** Existing skills are based on the SLO core goals and intermediate goals. Do not recreate, rewrite, restructure, replace or independently reinterpret the curriculum, skills, developments, learning progression, SLO alignment or mastery criteria. The current work concerns the technical/scientific handling of observations and evidence for the already-defined curriculum; it is not a curriculum redesign.

If a proposed evidence/codebook/runtime change appears to require changing a skill, development, SLO mapping, learning progression, claim meaning or mastery criterion, stop and ask the product owner before proceeding. Do not resolve such questions by making an independent design choice.

**C3 reconciliation proposal:** `docs/curriculum/PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.1.md`.

- This is a design-only proposal to reconcile inconsistent terminology across the current C3 specification, Evidence Coding Manual and Pilot_DataSchema.
- It distinguishes task-to-target alignment from response-to-target relation; raw process availability/missingness from coded evidence status and coding workflow readiness; correctness from evidence interpretation; and assistance events from target-specific independence judgement.
- It proposes explicit contradiction states and separate, traceable target-specific assessments linked to an immutable task-instance response episode.
- It does not select a final quality scale, reliability statistic or universal threshold. Those require a defined measurement design and empirical feasibility work.
- The proposal is not an approved canonical codebook and does not authorize runtime, registry, task mapping, curriculum, mastery, learner-state, schema or Supabase changes.
- The FR2 T01–T05 observations remain synthetic technical demonstrations. The proposal does not validate PacoGO or establish learner mastery.

**Next concrete step:** review the C3 reconciliation proposal as a measurement/evidence contract only. Any unresolved question that touches curriculum meaning or SLO alignment must be brought to the product owner before any design decision or implementation. Only after explicit approval of the evidence contract may a canonical codebook/schema implementation be considered.

**Latest verified baseline before this handoff update:**
- Branch: `refactor/professional-v1`
- Commit: `bed45c993cc1a0f8423c1891b61fcc4726836f2e`
- Full Regression run: #2891 / ID `41819730230`
- Status: **GREEN** — GitHub Actions reports `completed / success` for this exact commit.
- This handoff update is a new commit and requires its own Full Regression.
