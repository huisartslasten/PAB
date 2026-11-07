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
- C3: PacoGO is the single operational assessor. The C3 contract specifies versioned target-specific assessment of learner evidence; human coder rounds, adjudication and inter-rater reliability are not learner-runtime components. Assessment dimensions and rules remain subject to scientific/technical specification.
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

> **Historical candidate section — coder-specific details are superseded by sections 63–64.** Preserve raw observation/target-assessment distinctions only where consistent with PacoGO as the single operational assessor.

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

**Next concrete step:** follow the Zyon-first delivery plan in Section 17. The C3 evidence/codebook work is not the immediate delivery priority.

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

**Synthetic C3 anchor exercise completed:** `docs/curriculum/PacoGO_C3_Synthetic_Codebook_Anchor_Exercise_v0.1.md` (commit `7d70780bab042748222986b6c249bdfddf2dbc32`). The six synthetic cases were used for a conceptual review of codebook boundaries, not for empirical coder-reliability testing.

Findings to carry into the reconciliation:
- Keep task-to-target alignment distinct from the response-to-target relation.
- Separate raw process availability/missingness, coded evidence status and coding workflow state; values such as `NOT_COLLECTED`, `TECHNICAL_FAILURE` and `NO_RESPONSE` describe different raw situations and must not be collapsed into evidence absence.
- Keep correctness, evidence quality, independence and contradiction as distinct judgements. A correct answer does not automatically establish reasoning quality or mastery.
- Record assistance as observed events before deriving any target-specific independence judgement.
- Contradiction is target-specific; incorrectness, missing process, prompting or task mismatch do not automatically constitute contradiction.
- Define non-response handling in advance; a no-response event is not automatically evidence absence.
- Preserve one immutable raw response observation, with separate traceable target-specific assessments where needed.

The exercise does **not** establish inter-rater agreement, coder reliability, quality-scale calibration, construct validity, mastery validity or next-action validity. Do not choose a final quality scale, reliability coefficient or threshold from these synthetic cases.

**Next concrete step:** prepare a blinded coder packet and a separate adjudication key from proposal v0.2. Coders must receive the packet without the key and code independently before any discussion. Record disagreements and revise anchors transparently. This synthetic exercise can assess usability/feasibility only; it is not empirical learner validation. Do not change runtime, curriculum mappings, mastery rules, schemas or Supabase.

**C3 reconciliation proposal revised to v0.2:** `docs/curriculum/PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md` (commit `dff0733b5cce3e2d971e8bb11b6437a533e9cf3d`). The v0.1 proposal remains historical. Version 0.2 incorporates the six-case synthetic anchor exercise and makes the evidence/measurement boundaries more explicit:
- task-instance alignment and response-to-target relation are separate candidate dimensions;
- raw process collection/availability, target-specific evidence status and coding workflow/readiness are separate;
- `NO_RESPONSE` is a raw event, not automatically evidence absence;
- objective correctness, evidence status, quality, independence and contradiction remain distinct;
- assistance is recorded as observed events before a target-specific independence judgement;
- contradiction is target-specific and requires traceable rationale;
- one immutable response observation may have separate target-specific assessments; coder records and adjudication remain versioned and traceable;
- the quality scale, final category anchors, reliability coefficient/threshold, coder design and canonical schema/cardinality remain unresolved.

**Approval boundary:** v0.2 is a candidate design proposal only, not an approved canonical codebook. No curriculum/SLO/skill/development/claim/evidence-target/mastery meaning, registry, task mapping, runtime, learner-state, schema, persistence or Supabase change is authorized. The singular-versus-array schema conflict remains open. Synthetic FR2/browser cases remain technical fixtures, not empirical learner data or validation.

**Historical next step — deferred:** the blinded coder packet and adjudication key were prepared, but the exercise is paused pending review against the initial product decision in Section 17. Do not ask coders to complete the existing packet as-is.

**Latest verified baseline before this handoff update:**
- Branch: `refactor/professional-v1`
- Commit: `dff0733b5cce3e2d971e8bb11b6437a533e9cf3d`
- Full Regression run: #2895 / ID `41838914744`
- Status: **GREEN** — GitHub Actions reports `completed / success` for this exact commit; all 15 workflow steps succeeded, including browser regression and clean-working-tree verification.
- This handoff update is a new commit and requires its own Full Regression.

## 16. C3 blinded synthetic coding exercise materials (2026-11-04)

Two companion documents have been added as design/feasibility materials:

- `docs/curriculum/PacoGO_C3_Blinded_Synthetic_Coder_Packet_v0.1.md` — commit `3eb0f7e2a1e7b9b5ee4d0f6e33d96c1d22c998d1`. Contains six synthetic cases, candidate coding dimensions/labels, a coding-record template and an independent lock protocol. It intentionally contains no suggested answers.
- `docs/curriculum/PacoGO_C3_Synthetic_Coder_Adjudication_Key_v0.1.md` — commit `9dd3c86f29d57121144010565612802793c32d8a`. Restricted companion for the coordinator/adjudicator. Do not distribute to coders until their independent coding records have been submitted and locked.

**Handling and next step:**
1. Give coders only the blinded packet, never the adjudication key.
2. Have each coder code all six cases independently, using only the supplied case facts.
3. Preserve and lock each original coder record before any discussion.
4. Compare disagreements by dimension and target. Keep unresolved boundaries unresolved; do not force agreement or invent thresholds.
5. Create separate, linked adjudication records. Never overwrite original coding.
6. Use findings only to assess clarity, category overlap and feasibility, then revise candidate anchors transparently.

This is a small synthetic feasibility exercise only. It does not establish human-coder reliability, empirical learner validity, construct validity, mastery validity or next-action validity. The proposal v0.2 remains unapproved; no canonical codebook, curriculum, registry, task mapping, runtime, learner-state, schema, persistence or Supabase change is authorized.

**Latest verified Full Regression:**
- Branch: `refactor/professional-v1`
- Commit: `9dd3c86f29d57121144010565612802793c32d8a`
- Full Regression run: #2898 / ID `41850579247`
- Status: **GREEN** — GitHub Actions reports `completed / success`; all 18 job steps succeeded, including curriculum engine, architecture boundaries, maintained Node/Vitest regression, browser regression and clean-working-tree verification.
- The preceding run #2897 (ID `41850531446`) was superseded by #2898 on the newer branch head; #2898 is the authoritative result for the adjudication-key commit.

**Next concrete step:** after the handoff update passes its own Full Regression, conduct the independent human coding exercise using the blinded packet, then adjudicate disagreements with the restricted key. Do not implement the canonical codebook/schema or change runtime/Supabase until the evidence contract has been explicitly reviewed and approved.


## 17. Zyon-first delivery plan and initial learner interaction policy (2026-11-04)

The product owner confirmed that the immediate goal is to make PacoGO usable so Zyon can begin strengthening his mathematics. Zyon is currently halfway through group 6. The practical priority is to help him recover and strengthen the relevant arithmetic skills, not to extend design/research work unnecessarily.

### Product decisions for the initial operational version

- The already fully developed SLO curriculum remains the source of truth. Do not redo, rewrite, restructure or reinterpret the existing SLO goals, skills, developments, claims, evidence targets or mastery criteria.
- For the initial learner experience, learners are **not required to explain or justify every answer**. PacoGO should accept ordinary answer/performance evidence from relevant tasks.
- Evidence should accumulate across multiple relevant tasks and variants. Repeated successful performance can contribute stronger evidence over time; one correct answer must not automatically award mastery. Existing mastery criteria and decision contracts remain authoritative and must not be replaced with an invented shortcut.
- If a learner repeatedly has difficulty, PacoGO should be able to offer targeted teaching support, preferably visual and step-by-step for mathematics, followed by another opportunity to practise/apply. The exact trigger and support-selection logic are not yet specified; do not invent these or silently change mastery criteria.
- Keep assessment and teaching support distinct: performance evidence informs assessment/mastery under the existing contracts; instructional support responds to observed difficulty. Optional explanations or additional process evidence may be added later where useful, but are not a general learner requirement.
- Preserve architectural room for future school-method-aware instruction and multiple ways of presenting/explaining a skill. This is a later enhancement, not a blocker for the first usable version. For now, provide mathematically correct, understandable explanations without claiming they match a particular school's method unless confirmed.

### Immediate work sequence

1. **Inventory existing skills and implementation.** Inspect the current SLO-based curriculum/registry and related task definitions. Produce a grounded overview of which existing skills are complete, partial or not yet implemented; which Learning Interfaces/tasks already support them; and what is missing for a learner to use them. This is an inventory, not a curriculum redesign.
2. **Complete the remaining skills.** Work through the existing SLO skills and their already-defined contracts. Prioritise the skills needed for Zyon's current learning needs where the existing curriculum allows; do not invent a new skill sequence or alter mastery criteria.
3. **Reuse and complete Learning Interfaces.** Prefer existing reusable interfaces (including Number Line, Addition and Fraction) and add only the genuinely missing interaction/presentation needed by the existing skills.
4. **Complete the minimum learner learning cycle.** A learner must be able to receive a skill/task, respond, have performance recorded and processed under the existing contracts, see progress and receive a suitable next task/action.
5. **Add initial explanatory support.** Provide clear, mathematically correct explanations, visual and stepwise where appropriate, especially when the learner is having difficulty. Keep the trigger logic explicit and do not let explanations become mandatory response fields.
6. **Test with Zyon and improve.** Validate that he can start, practise, understand the support and continue. Use observed practical gaps to prioritise improvements.

### Deferred work and C3 packet status

- Pause the independent human-coder exercise for now. The existing synthetic packet includes learner-explanation scenarios and must be reviewed/revised before it is used; do not ask the product owner or other coders to complete it as-is.
- C3 reconciliation, canonical codebook/schema decisions, extended coder reliability work and scientific validation remain future work unless a genuine immediate runtime requirement makes a specific bounded part necessary.
- Detailed Adaptive Instruction Layer, school-method profiles/provenance and method-specific interface configuration remain deferred.
- Do not make Supabase changes unless an actual persistence/runtime contract change requires them.

### Engineering status at this handoff update

- Working branch: `refactor/professional-v1`; `main` is LIVE and must not be touched.
- Latest verified branch head before this handoff update: `9d1e2dff26b369961caa620dcc074ed867f2eb59`.
- Full Regression run #2908 / ID `41952047708` on that exact commit: **GREEN** (`completed / success`); all 19 workflow steps succeeded, including curriculum engine tests, maintained Node/Vitest tests, browser regression and clean-working-tree verification.
- The implementation is a browser demonstration with session-only evidence; it does not persist learner history. No Supabase changes were made.
- This handoff update is a new repository commit and must receive its own Full Regression. Replace this baseline with the exact handoff-update commit and its actual run result after verification.


## 18. B1 learner-delivery audit — separation of pilot tasks and learner practice

The B1 audit was performed against the current registry, pilot task set, addition controller, shared browser runtime and five existing B1 demonstration pages.

### Verified findings

- The current registry defines B1.D1–D4 and B1.TM1–TM6, with the existing claims and evidence targets B1.ET1–ET8.
- The C1–C3 Pilot Task Set is explicitly `design_only` and its tasks are measurement-development fixtures, not an operational learner task catalogue. All five B1 pilot tasks currently set `response_process_required: true`.
- The five B1 browser pages are synthetic demonstrations using synthetic student keys. They do not constitute a complete learner-facing B1 flow or persistent learner history.
- Pilot task coverage currently uses only B1.TM1 and B1.TM2. It does not provide tasks for registry task models B1.TM3–TM6 (direct execution, strategic choice/checking, robustness under variation, and transfer).
- Several demonstration-page labels/prompts do not align cleanly with their pilot task mapping. In particular, the strategy-variation page is mapped to B1.ET2/TM2 rather than the registry's B1.ET4/TM4; it therefore must not be treated as evidence that the strategic-choice task model is implemented.
- The current addition controller requires a strategy selection for every submission. Some pages additionally require a written explanation. This conflicts with the approved initial learner policy that ordinary answers must be accepted and explanations must not be mandatory for every answer.
- The legacy B1 prototype document describes seven task models, while the current registry defines six. The registry remains the active technical contract; do not silently add or restore a seventh task model.
- The browser vertical-slice runtime delegates to the curriculum registry, but the inspected student evidence store is in-memory only. The current B1 pages do not demonstrate persistent learner history or a complete learner-state experience.

### Architecture decision

Keep the C1–C3 Pilot Task Set unchanged as a design-only measurement fixture. Do not weaken its process requirements or repurpose it as the learner's everyday practice list.

Create a separate operational learner task catalogue that references the existing B1 registry task models and evidence targets without changing curriculum definitions, claims, evidence-target meanings, mastery criteria or the pilot measurement set. In the operational learner flow:
- a learner can submit an ordinary answer without a written explanation;
- strategy/process capture is optional except where a specific task is intentionally designed to observe that process;
- missing process remains unknown and must not be inferred from correctness;
- instructional support and practice remain distinct from evidence assessment and mastery;
- tasks use existing registry IDs and task-model boundaries.

This separation is an implementation boundary for the Zyon-first learner experience. It does not approve changes to C3 coding rules, evidence schema, registry mappings or Supabase.

### Next concrete step

Build the first operational B1 learner task catalogue and reusable Addition learning flow, beginning with the already-defined B1.D1–D2 task models and preserving the ability to add B1.D3–D4 tasks against the existing registry contracts. Then verify the complete browser learner cycle before expanding to the next skill.

No code or Supabase changes are included in this audit/handoff update.


## 19. First operational B1 Addition learner route

Implementation commit: `c53c694958df9bd4b9384c1a4991506aa772e9a0`.

A separate operational learner-practice path now exists alongside the unchanged C1-C3 Pilot Task Set:
- `docs/curriculum/PacoGO_B1_Learner_Task_Catalogue_v0.1.json` is the operational practice catalogue. It references only existing B1 registry contracts.
- `curriculum-b1-learner.html` is the first learner-facing browser route.
- `pacogo-engine/addition-learning-interface-contract.js` provides a renderer-independent task/view model.
- `pacogo-engine/addition-learning-interface.js` renders quantity groups and symbolic addition without owning curriculum or evidence decisions.
- `pacogo-engine/addition-controller.js` accepts direct answers when and only when the operational task explicitly sets `response_process_required: false`. Process-required tasks retain the existing strategy-selection requirement; absent process data remains null rather than being inferred from correctness.

Initial coverage:
- B1.D1 via B1.TM1 / B1.ET1: combine represented quantities.
- B1.D2 via B1.TM3 / B1.ET3: execute symbolic addition, with two task variants.
- The catalogue intentionally does not use B1.TM2 because its registry contract targets both ET1 and ET2 while the current observation contract exposes one singular evidence-target field. Do not manufacture multiple independent observations from one answer or change the C3/schema boundary to work around this. TM2 remains open for a separately designed contract-aligned task.

The learner page accepts an ordinary numeric answer without a strategy choice or written explanation. It processes the response through the existing browser runtime and registry. The current route is a session-only demonstration: evidence is accumulated in memory for that page session and is not persisted after closing/reloading. No Supabase or curriculum registry changes were made. The task sequence is an initial practice sequence, not yet a fully adaptive next-action selector.

**Focused verification completed:** catalogue-to-registry alignment and the full browser learner route are covered by `pacogo-engine/addition-learner-catalogue.test.js` and `test/browser/curriculum-b1-learner.browser.test.js`. Full Regression #2908 / ID `41952047708` is **GREEN** on commit `9d1e2dff26b369961caa620dcc074ed867f2eb59`. The earlier #2907 failure was caused by an incorrect registry-version value in the new catalogue; the catalogue metadata was corrected without changing tests or curriculum contracts.

**Next concrete step:** define the learner ownership and row-access contract before connecting the learner route to persistent storage. Only after that contract is reviewed should a TEST-only persistence service and synthetic Supabase smoke test be implemented. Keep B1.D3–D4, TM2 multi-target alignment, adaptive support triggers and LIVE Supabase out of scope until their contracts are explicitly designed.


## 20. Learner persistence and privacy gate

A read-only inspection was performed against the connected **PacoGO TEST** Supabase project after the operational B1 browser route passed regression.

### Verified TEST database state

- The curriculum registry and learner persistence migrations are applied in TEST.
- `public.curriculum_registry_versions` contains the candidate registry `pacogo-curriculum` version `0.2.0-seed`, sourced from `docs/curriculum/PacoGO_Curriculum_Registry_v0.2.json`.
- The current row counts are zero for `student_evidence`, `student_longitudinal_state` and `curriculum_decision_trace`.
- The existing evidence table stores one singular `evidence_target_id`. The initial B1 learner tasks deliberately use single-target task models B1.TM1 and B1.TM3. Do not use B1.TM2 until its multi-target contract is reconciled; do not manufacture multiple independent evidence records from one answer.
- The current learner route does not call Supabase. Its evidence is session-only in memory. Therefore no Supabase smoke/write test was needed for the current implementation; the inspection was read-only and no database records were created.

### Privacy/authorization blocker

The current TEST RLS policies on these learner tables grant all authenticated users unrestricted row-level SELECT/INSERT access, and unrestricted SELECT/INSERT/UPDATE access to longitudinal state where applicable (`USING true` / `WITH CHECK true`). They do not scope records to a parent/owner or to a learner relationship. The application currently has a local student roster and parent-session allowlist, but no database-backed learner ownership mapping that RLS can enforce.

**Decision:** do not connect real learner activity to these tables yet. Before persistence, define a stable pseudonymous learner key and an explicit owner/membership relation, then design row-level policies so an authenticated user can access only learners they are authorized to manage. Do not use child display names as evidence identifiers. This is a privacy/runtime contract decision, not permission to patch existing security warnings. No RLS, migration, auth, TEST or LIVE database changes were made.

Supabase security advisors also reported pre-existing warnings for exposed SECURITY DEFINER RPC execution and disabled leaked-password protection. These were observed only and left unchanged; they are not silently included in this learner-persistence change.

### Next step

Prepare and review the learner ownership/persistence contract before implementing any database writes. Once approved, implement against **TEST only**, use synthetic/pseudonymous test identities, verify the full registry → observation/evidence → longitudinal state → decision trace chain, and remove all synthetic records after the smoke test. Do not use real learner data in engineering tests and do not modify LIVE.

**Latest verified Full Regression before this handoff update:** branch `refactor/professional-v1`, commit `9d1e2dff26b369961caa620dcc074ed867f2eb59`, run #2908 / ID `41952047708`, **GREEN**. This handoff update requires its own Full Regression.


## 21. Learner ownership contract

Design candidate created: docs/curriculum/PacoGO_Learner_Ownership_and_Persistence_Contract_v0.1.md. No database or application changes have been made. The proposal uses opaque learner UUIDs, explicit guardian membership and database-enforced row access. Existing broad TEST access policies remain a blocker. Any implementation must be reviewed, tested on the development branch, and applied to PacoGO TEST only. LIVE is out of scope.

Latest verified baseline before the contract document: commit 06c3f93bba20fd0117d328c42a44be231c18ec18, Full Regression #2909 / 41952400604, GREEN. The contract and handoff commits require their own Full Regression.

Next step: review the contract, then re-inspect TEST and implement the membership schema and access tests. No real learner records in engineering tests.

## 22. Canonical SLO skills and retirement of legacy Skills module

The product owner clarified the intended skills architecture:

- The **new SLO-based curriculum skills remain** and become the sole canonical skills structure in PacoGO. They must follow the complete SLO developmental line, not only the learner's current school level or a short practice range.
- The existing legacy Skills module and its legacy Skill Editor are obsolete and are to be retired. They must not remain as a parallel way to define, edit, assign or track skills.
- The legacy exercise presentation built around a continuously decreasing countdown clock is no longer the default interaction model. Time pressure is an optional future practice/challenge mode, not a defining property of a skill, a required learner condition, or a mastery criterion.
- A curriculum skill describes the learning objective and its developmental progression. The engine's developments, claims, tasks, evidence and mastery contracts remain authoritative. Learning Interfaces and task variants provide multiple pedagogical and interaction forms for the same skill/development.
- Do not remove the new curriculum skills, registry, task contracts, or Learning Interface work when retiring the legacy module.

### Legacy data and migration boundary

A read-only inspection of PacoGO TEST found 13 enabled `public.skill_definitions`, 37 `public.skill_assignments` (28 enabled), and 3 assignments whose `skill_id` has no matching definition. The current legacy UI/runtime includes `skills.html`, `skill-create.html`, `skill-editor.html` and management runtimes. These data are not to be deleted blindly: first identify any useful source content, determine whether any legacy assignments/results are still referenced by active learner journeys, and map only what is semantically compatible to the SLO registry. Preserve historical records where deletion would lose useful history. No Supabase writes or schema changes were made during this inspection.

### Retirement sequence

1. Inventory all legacy skill routes, navigation links, runtime entry points, database readers/writers, assignments and dependent reporting/game flows.
2. Establish the replacement learner route and the SLO-skill developmental-line coverage needed before removing learner-facing access.
3. Remove legacy skill creation/editing and parallel assignment pathways from the application; retain or migrate data only under an explicit compatibility plan.
4. Verify that timer behavior is optional and isolated to a task/practice mode; it must not affect evidence assessment or mastery unless an existing approved task contract explicitly defines a timed condition.
5. Remove legacy schema/data only after dependency and historical-data checks, with TEST-only migration and regression verification. Never modify LIVE as part of this work.

**Next concrete step:** continue the canonical SLO learner experience and build a complete legacy-module dependency inventory before any deletion. Keep this as a product/architecture decision; no legacy routes, skill data, Supabase schema or learner records have been deleted or changed yet.

**Latest verified engineering baseline:** branch `refactor/professional-v1`, commit `8f29b5c54d9332e2500827c877144296f16d019f`, Full Regression #2911 / ID `41952974495`, **GREEN**. The handoff update documenting this decision requires its own Full Regression.

## 23. Learner ownership and persistence implemented in TEST

This section supersedes the earlier "no database changes" status in Sections 20–21. The ownership/persistence contract is now implemented in the repository and applied to **PacoGO TEST only**. LIVE was not modified.

### Implemented architecture

- `public.learner_profiles` stores a display label separately from the opaque UUID-string `learner_key). The curriculum engine continues to receive `student_key` as a string.
- `public.learner_guardians` ties a learner to an authenticated `auth.users` account. Profile creation creates the initial owner membership atomically. Client-side membership insertion/update/deletion is closed. Additional guardians require a separately designed invitation flow.
- Existing `student_evidence`, `student_longitudinal_state` and `curriculum_decision_trace` now reference learner profiles. Migration preflight stops rather than guessing if any old key lacks a profile. At migration time all three tables had zero rows.
- RLS read access is scoped to linked guardians. Evidence and decision traces are append-only to normal clients. Longitudinal state is readable by linked guardians and can be written only through the atomic learning-cycle operation.
- `public.persist_curriculum_learning_cycle` is SECURITY INVOKER. It validates current guardian membership and writes evidence, longitudinal state and decision trace atomically with idempotency by `source_event_id`. A transaction-local write context allows the function's RLS-protected writes and is explicitly cleared on both success and error. Direct writes outside that operation are denied.
- Narrow SECURITY DEFINER helper/trigger functions are placed in the non-exposed `private` schema. The public persistence RPC is not SECURITY DEFINER.
- Normal clients have no DELETE privilege for learner profiles or learner history. Retention, correction and deletion flows must be designed before production use.

### Repository migrations

- `supabase/migrations/20261105024754_add_learner_ownership_and_rls.sql`
- `supabase/migrations/20261105030000_switch_learning_cycle_to_invoker.sql`
- `supabase/migrations/20261105040000_clear_learning_cycle_capability_on_error.sql`
- `supabase/migrations/20261105030001_factor_learner_write_context_policy.sql`

Applied TEST migration history:

- `20261105024754` — `add_learner_ownership_and_rls`
- `20261105025422` — `switch_learning_cycle_to_invoker`
- `20261105025725` — `clear_learning_cycle_capability_on_error`
- `20261105030018` — `factor_learner_write_context_policy`

### Verification

- SQL integration test: `supabase/tests/learner_ownership_rls.test.sql`.
- Two synthetic parent accounts and two synthetic learners were used.
- Verified: both parents can read only their own learner/data; cross-guardian persistence is denied; direct membership self-enrollment is denied; direct table writes and learner-key reassignment are denied; anonymous table privileges are absent; duplicate event replay is idempotent; a failed learning-cycle write leaves no partial evidence/state/trace.
- All fixtures ran inside a transaction and were rolled back. Post-test counts are zero for synthetic auth users, learner profiles, guardian memberships, evidence, longitudinal state and decision traces.
- Security Advisor no longer reports the new public persistence RPC as SECURITY DEFINER. Remaining SECURITY DEFINER warnings relate to pre-existing game-access/test-history functions; leaked-password protection remains a pre-existing Auth warning and was not changed here.
- The four new write-context RLS performance warnings were removed by factoring the request-constant predicate into a private helper. Remaining advisor findings are pre-existing.

### Remaining work and gates

1. Build the authenticated application adapter that provisions profiles through `create_learner_profile`, uses opaque learner keys instead of display names for evidence, and calls `persist_curriculum_learning_cycle`. The current browser learner route is still session-only and is not yet connected to Supabase.
2. Test the adapter and full learner cycle using synthetic accounts before any real learner data is used.
3. Design additional-guardian invitations, account recovery, correction, deletion and retention before production.
4. Continue completing the existing SLO skills along their full developmental lines and retire the legacy Skills/Skill Editor only after dependency and data-history checks. The old countdown clock is not the default skill interaction; time pressure remains an optional task mode.
5. Keep the new SLO registry, skill/development/claim/task contracts and Learning Interfaces. Do not remove them as part of legacy-module retirement.

### Engineering baseline before this handoff update

- Branch: `refactor/professional-v1`
- Commit: `bf08558b4ec02ce1b5f787008db3cfe0ae4ca0c3`
- Full Regression #2932 / ID `41958684853`: **GREEN**.
- The contract document update and this handoff update are repository changes and require their own Full Regression.
- `main` remains LIVE and untouched.


## 24. Authenticated B1 learner route connected to learner persistence

This section supersedes Section 23's first remaining-work item and the earlier statement that the B1 browser learner route was not connected to persistence. The database ownership contract remains as documented in Section 23; no additional database migration was needed for this application step.

### Implemented in the repository

- Added `src/services/learner-curriculum-service.js` as the application service boundary for learner profiles, registry-version lookup, history restoration and atomic learning-cycle persistence. Exposed it through `createPacoGOApp` in `src/app/bootstrap.js`.
- The B1 learner route now requires a logged-in PacoGO parent session. If no parent session is present, it sends the user to `auth.html?returnTo=curriculum-b1-learner.html`. The auth page accepts only this fixed return destination; arbitrary redirect URLs are not accepted.
- The parent can list profiles visible through database RLS and create a learner profile through `create_learner_profile`. The database creates the authenticated owner membership atomically. The route does not import or convert the old display-name-based static roster; a parent must deliberately create each profile.
- The engine receives the opaque UUID learner key, never the display name. On selection, the route loads the learner's B1 evidence and longitudinal state, reconstructs the assessed evidence records expected by the curriculum engine, and resumes the learning cycle.
- Each submitted answer runs through the existing B1 curriculum engine and is saved through `persist_curriculum_learning_cycle`. Evidence, longitudinal state and decision trace remain one atomic database operation. A failed network/save attempt can be retried with the same source event ID, relying on the existing idempotency contract.
- Direct-answer practice remains unchanged: the learner can enter an answer without explaining a strategy. No countdown timer or new mastery rule was added.

### Verification

- Added service tests in `test/learner-curriculum-service.test.js` for profile listing/provisioning, exact registry-version lookup, evidence/state restoration, RPC payload mapping, and rejection of display names or mismatched learner/skill identities.
- Updated `test/browser/curriculum-b1-learner.browser.test.js` to exercise parent authentication, learner profile creation/selection, all three B1 practice tasks, atomic persistence, and retry after a simulated save failure. Browser tests use a synthetic Supabase client; they do not create real learner data.
- Read-only inspection of PacoGO TEST confirmed curriculum registry `pacogo-curriculum@0.2.0-seed` exists with status `candidate` (registry row `89f1de87-2a2c-413b-a635-490fdef2c6e3`). The learner profile count remains zero. No new database writes or migrations were applied in this application step.
- Full Regression #2937 / run ID `41960343382`, exact commit `2238de47355bbbed4817252603c070242236ca17`: **GREEN**, including the full browser regression. A first browser run exposed an incomplete test Supabase mock; after completing the mock, a selector ambiguity in the test was corrected to scope the assertion to the visible exercise card. No application behavior was weakened to make tests pass.

### Boundaries and next steps

1. The B1 browser route is now connected in the repository, but no real parent has yet created a learner profile and no real learner activity has been persisted. Do not create real learner records as part of an engineering smoke test.
2. The existing B1 catalogue remains a three-task operational practice slice, not a claim that the full SLO developmental line or grade-six recovery curriculum is complete. Continue expanding canonical SLO skills and their full developmental lines without changing approved claims or mastery criteria.
3. Continue the legacy Skills/Skill Editor dependency and history inventory before removing any legacy route or data. The new SLO skills, registry and Learning Interface work remain canonical.
4. Multi-guardian invitations, account recovery, correction, deletion and retention remain open before production. No client deletion pathway has been added.
5. Keep all work on `refactor/professional-v1`. `main` remains LIVE and untouched.

### Latest verified engineering baseline before this handoff update

- Branch: `refactor/professional-v1`
- Commit: `2238de47355bbbed4817252603c070242236ca17`
- Full Regression #2937 / ID `41960343382`: **GREEN**.
- This handoff and the corresponding learner-persistence contract update require their own Full Regression.
- LIVE remains untouched.


## 25. B2 Aftrekken — complete candidate skill and learner practice route

This section supersedes Section 24's statement that the B1 route is the only authenticated learner route and its next-step priority of building the application adapter. The application adapter is now shared by B1 and B2. The learner ownership/RLS contract in Section 23 remains unchanged.

### Curriculum model

- Added `B2 Aftrekken` to `docs/curriculum/PacoGO_Curriculum_Registry_v0.3.json`.
- B2 contains seven candidate developments, seven claims, fourteen evidence targets and seven task models. The model preserves three distinct meanings: wegemen/rest bepalen, verschil bepalen and aanvullen tot een doelwaarde.
- The remaining candidate developments cover representeren, structureren, grotere gehele en decimale getallen, and flexibel/controlerend aftrekken.
- The developmental order is explicitly a candidate hypothesis, not an empirically proven fixed sequence. B1 and B2 have a strong inverse relationship and can develop in parallel; B2 does not impose full B1 mastery as a prerequisite. B5 remains a separate integrative skill, not a final B2 development.
- Strategies and algorithms are task approaches, not separate skills. Most practice items accept a direct answer. Strategy selection/checking is requested only in selected structural and flexible-control tasks.
- The B2 catalogue is an operational practice candidate, not the C1–C3 pilot measurement set. Registry mastery parameters remain prototype-only; the B2 learner route does not display a mastery verdict.

### Learner route and Learning Interface

- Added `curriculum-b2-learner.html`, using the existing authenticated learner service and ownership/RLS contract.
- The route covers fourteen practice tasks across all seven B2 developments. It uses the existing reusable Number Line interface for take-away, difference, complement and relation tasks; symbolic direct-answer input is used for other tasks.
- Added `pacogo-engine/subtraction-controller.js` and tests for answer capture, optional strategy selection, required checks and retention of incorrect attempts as observations.
- B1 and B2 routes now both use registry `0.3.0-candidate`; the B1 catalogue/page and its browser test were moved to this same registry version. The routes link to one another.
- Browser regression verifies the B2 parent/profile flow, all fourteen tasks, strategy/check selection, and persistence of fourteen synthetic learning cycles. It uses a synthetic Supabase test double and creates no real learner data.

### Supabase TEST registry registration

- Added registry version `pacogo-curriculum@0.3.0-candidate` to PacoGO TEST only.
- TEST row ID: `f7feaed6-f46f-445b-838c-c1f3dad9d749`.
- It supersedes `0.2.0-seed` (row `89f1de87-2a2c-413b-a635-490fdef2c6e3`).
- Source: `docs/curriculum/PacoGO_Curriculum_Registry_v0.3.json`.
- SHA-256 of the exact source file: `4ba39fed03b5d8e82c0f3c08f01354301e0e66c82e899fe0a0e9e5ed0866926a`.
- The TEST config was read back and confirmed to contain four skills including B2. No schema migration was required.
- Learner profiles, guardian links, evidence, longitudinal state and decision traces remain at zero rows. No real learner data has been created. LIVE was not touched.

### Verification

- Full Regression #2944 / run ID `41962659190`, exact commit `7734ea3c92011d982c21d00d55ba8b672df8a5a2`: **GREEN**, including browser regression.
- The preceding red runs were isolated to stale test fixtures/selectors: the B1 registry test still imported v0.2, and the B2 browser test used a non-exact button-name selector. The fixtures were aligned to v0.3 and the submit selector made exact. No application behavior or curriculum contract was weakened.
- Branch: `refactor/professional-v1`. `main` remains LIVE and untouched.

### Current curriculum implementation status and next step

- The SLO mapping remains the source of truth and contains the full mapped skill set. The executable registry currently contains four skill models: A1, B1, B2 and FR2. Do not redo the SLO mapping; continue implementing the remaining mapped skills.
- B1 has a three-task operational practice slice. B2 now has a fourteen-task practice catalogue. These are usable vertical slices, not empirically validated curricula or proof that every mastery claim is valid.
- Next concrete curriculum build: B3 Vermenigvuldigen, using its existing SLO scope and full candidate developmental line. Preserve the distinction between multiplication's equal-groups/array/repeated-addition meanings, structural relations and flexible strategy use; do not turn strategies into separate skills.
- Before any parent-facing mastery display, implement and validate the C6 mastery protocol and its explicit coverage/scope requirements. Current runtime mastery parameters remain prototype-only.
- Continue the legacy Skills/Skill Editor dependency and history inventory before retiring legacy routes or data.
- Multi-guardian invitations, account recovery, correction, deletion and retention remain open before production.


## 26. B3 Vermenigvuldigen and Quantity Representation interface

This section supersedes Section 25's next-step priority of building B3 and its statement that the executable registry contains four skills. B3 is now implemented as a candidate skill model and authenticated practice route. The SLO mapping remains the source of truth; it is not being redone.

### Curriculum model

- Added `B3 Vermenigvuldigen` to `docs/curriculum/PacoGO_Curriculum_Registry_v0.4.json`.
- B3 contains seven candidate developments, seven claims, fourteen evidence targets and seven task models.
- The developmental line covers: equal quantities, equal groups and arrays, multiplicative relationships, structuring products, larger whole numbers, decimal numbers/representations, and flexible/controlled multiplication.
- Repeated addition is an early representation of equal groups, not the full definition or endpoint of multiplication.
- Multiplicative structure, factors and product remain central. Tables/product fluency, doubling, halving, decomposition and compensation are knowledge/strategies within B3, not separate skills.
- B3 and B4 are distinct skills with a strong inverse relationship; neither is encoded as a rigid prerequisite for the other. B1 supports the additive-to-multiplicative transition. B5 remains a separate integrative skill.
- Development order remains a candidate hypothesis, not an empirically established linear sequence. Registry mastery parameters remain prototype-only.

### Quantity Representation Learning Interface

- Added the reusable Quantity Representation interface for equal groups and rectangular arrays.
- The architecture separates the pure pedagogical/function model (`quantity-representation-model.js`), visual renderer (`quantity-representation-renderer.js`) and stable composition entry point (`quantity-representation-interface.js`).
- The first implementation is display-only: groups/arrays are rendered accessibly, while B3's controller owns answer/strategy/check events and observation construction. The interface does not score, choose evidence targets or infer mastery.
- Added `docs/curriculum/PacoGO_Quantity_Representation_Interface_Design_v0.1.md`. Future manipulation must add a separate interaction/state layer; it must not entangle pedagogical configuration with rendering. The separation supports future Deluxe renderer replacement.

### Learner route

- Added `curriculum-b3-learner.html` with parent authentication, profile selection/creation, prior-state loading and atomic persistence through the existing learner service.
- Fourteen practice tasks cover all seven B3 developments. The first six use equal-group or array visuals; later tasks use direct numeric answers. Strategy selection is required only for structural/flexible tasks, and checking is required only for the final flexible tasks. No countdown timer was added.
- Added `pacogo-engine/multiplication-controller.js` and controller tests.
- B1, B2 and B3 learner routes now all use registry `0.4.0-candidate`, link to the other active practice routes, and share the same authenticated learner persistence contract.
- Browser regression covers the B3 profile flow, all fourteen tasks, visual group/array counts, strategy/check capture and persistence of fourteen synthetic learning cycles. It uses a test double and creates no real learner data.

### Supabase TEST registration

- Added `pacogo-curriculum@0.4.0-candidate` to PacoGO TEST only.
- Row ID: `f4b7b7e1-8d28-45de-9a6b-3c51f9d2a4e7`.
- Supersedes `0.3.0-candidate` (row `f7feaed6-f46f-445b-838c-c1f3dad9d749`).
- Source: `docs/curriculum/PacoGO_Curriculum_Registry_v0.4.json`.
- SHA-256 of exact source file: `7aaea07eb7d9d0b6b895f46ca1b99c4b8229505556d7313f023cad8994ce5132`.
- TEST read-back confirms five skill models and B3 presence. No schema migration was required.
- Learner profiles, guardian links, evidence, longitudinal state and decision traces remain at zero rows. No real learner data has been created. LIVE was not touched.

### Verification

- Full Regression #2947 / run ID `41963789534`, exact route commit `de69ddfaca4f12924fc8ebce64b70b5aef5654e4`: **GREEN**, including B3 browser regression.
- Full Regression #2948 / run ID `41964073687`, exact interface-separation commit `995ae42b15c401902f2466a468a1d34162ca7522`: **GREEN**, including Node, Vitest, architecture and browser regression.
- Branch: `refactor/professional-v1`. `main` remains LIVE and unchanged at `9ddb18aaafec265f2239bb68b05723468c5607f9`.

### Current implementation and next step

- The complete SLO mapping remains the source of truth. The executable registry currently contains five skill models: A1, B1, B2, B3 and FR2. Continue implementing the remaining mapped skills; do not repeat the SLO mapping.
- B1 has a three-task operational practice slice; B2 and B3 each have fourteen-task operational practice catalogues. These are candidate practice implementations, not empirical validation or a complete grade-six recovery curriculum.
- Next concrete curriculum build: **B4 Delen**, preserving its full developmental line and its strong inverse relationship with B3 without creating a rigid prerequisite.
- B5 remains the separate integrative skill for combining and structuring operations.
- Before any parent-facing mastery display, implement and validate the C6 mastery protocol and explicit coverage/scope requirements. Current runtime mastery parameters remain prototype-only.
- Continue the legacy Skills/Skill Editor dependency and history inventory before retiring legacy routes or data.
- Multi-guardian invitations, account recovery, correction, deletion and retention remain open before production.

## 27. B4 Delen and Division Representation interface

This section supersedes Section 26's next-step priority of building B4. B4 is now implemented as a candidate curriculum model and authenticated learner practice route. B3 and B4 remain separate skills with a strong inverse relationship; neither is a rigid prerequisite for the other.

### Curriculum model and practice catalogue

- Added B4 to `docs/curriculum/PacoGO_Curriculum_Registry_v0.5.json`.
- B4 contains seven candidate developments, seven claims, fourteen evidence targets and seven task models.
- The candidate developmental line covers equal sharing, grouping, division representations, the inverse multiplication relationship, quotient and remainder, larger/decimal values, and flexible/checkable division.
- Added fourteen practice tasks, two per development. Most accept a direct numeric answer; quotient-and-remainder tasks capture the two values separately. Strategy selection and checking are required only where the task contract explicitly requests them.
- The order is a candidate developmental hypothesis, not an empirically established fixed sequence. B3 supports B4 through the inverse relationship but is not a rigid prerequisite. B5 remains a separate integrative skill.
- Candidate mastery parameters remain prototype-only. The B4 practice route does not display a mastery verdict.

### Division Representation Learning Interface

- Added a reusable pedagogical model and renderer for two distinct division meanings:
  - equal sharing: the number of groups is known and the amount per group is unknown;
  - grouping: the amount per group is known and the number of groups is unknown.
- Components are separated into `division-representation-model.js`, `division-representation-renderer.js` and the stable composition entry point `division-representation-interface.js`.
- Added `division-controller.js` to capture numeric answers, quotient/remainder, optional strategy and check choices, and incorrect attempts as observations. It does not decide mastery.
- The visual model does not reveal the unknown answer. It is a display-oriented first implementation; richer learner manipulation belongs in a separate interaction/state layer.

### Learner route and navigation

- Added `curriculum-b4-learner.html` with parent authentication, profile selection/creation, prior-state loading and atomic persistence through the shared learner service.
- The route uses registry `0.5.0-candidate` and the fourteen-task B4 catalogue. It records fourteen synthetic task cycles in browser regression; tests use a Supabase test double and create no real learner records.
- B3 continues to use registry `0.4.0-candidate`; its route links to B4 so the learner can move between the related skills. B4 links back to B3.
- No countdown timer was added. The B4 route accepts direct answers unless a task explicitly requires a strategy/check.

### Supabase TEST registration

- Registered `pacogo-curriculum@0.5.0-candidate` in PacoGO TEST only.
- Row ID: `a16cc3d9-5715-4c22-8d9e-094f7082d07c`.
- Supersedes `0.4.0-candidate` (row `f4b7b7e1-8d28-45de-9a6b-3c51f9d2a4e7`).
- Source: `docs/curriculum/PacoGO_Curriculum_Registry_v0.5.json`.
- SHA-256 of the exact source file: `fdc3712704304d563b2b1db0620dd089d8b328724d5a4d1b2416781d95a7f422`.
- TEST read-back confirms six skill models and B4 presence. No schema migration was required.
- Learner profiles, guardian links, evidence, longitudinal state and decision traces remain empty; no real learner data has been created. LIVE was not touched.

### Verification and current next step

- Full Regression #2953 / run ID `42016251309`, exact commit `5cefc2237602439bda7d9dfb7ff71b0e1343c8cd`: **GREEN**.
- Dedicated B4 browser proof run #640 / ID `42016251705`, same exact commit: **GREEN**.
- The B4 browser test covers all fourteen tasks, both division representation modes, quotient/remainder capture and the synthetic persistence cycle. The full regression includes the maintained Node, Vitest, architecture and browser checks.
- Branch: `refactor/professional-v1`. `main` remains LIVE and untouched.
- Next concrete step: review the division task wording/visual progression against the learner's actual grade-six needs, then continue with B5 only after its SLO scope and existing registry dependencies are inspected. Do not assume B4 candidate order or mastery parameters are validated.
- Continue the legacy Skills/Skill Editor dependency and history inventory before removing legacy routes or data. Multi-guardian invitations, account recovery, correction, deletion and retention remain open before production.


## 28. B5 Bewerkingen combineren en structureren — eerste learner-practice kandidaat

Deze sectie actualiseert de status na B4. B5 is nu als afzonderlijke candidate skill en geauthenticeerde learner-practice route gebouwd. De bestaande SLO-mapping blijft leidend; deze implementatie wijzigt geen goedgekeurde curriculumdoelen, claims, evidence targets of masterycriteria.

### Curriculum en oefencatalogus

- Registry: `docs/curriculum/PacoGO_Curriculum_Registry_v0.6.json`, versie `0.6.0-candidate`.
- B5 bevat zes kandidaatontwikkelingen (B5.D1–B5.D6), zes claims (B5.C1–B5.C6), twaalf evidence targets (B5.ET1–B5.ET12) en zes task models (B5.TM1–B5.TM6).
- Afzonderlijke oefencatalogus: `docs/curriculum/PacoGO_B5_Learner_Task_Catalogue_v0.5.json`, met twaalf taken, twee per ontwikkeling. De catalogus heeft eigen schema_version `0.5` en verwijst expliciet naar registry `0.6.0-candidate`; dit zijn twee afzonderlijke versienummers.
- B5 oefent het herkennen en representeren van samengestelde bewerkingen, rekenvolgorde, uitvoering met tussenresultaten, gelijkwaardige herstructurering en flexibele controle.
- B5-L05 controleert expliciet links-naar-rechts rekenen bij bewerkingen met gelijke voorrang.
- B5-L12 registreert de tussenstappen en de gekozen controlemethode. De twee controlemethoden hebben elk een eigen prompt en verwacht antwoord: terugrekenen (30) en uitgaven opnieuw berekenen (28).
- De zes ontwikkelingsstappen en hun volgorde blijven kandidaat-hypothesen; zij zijn niet empirisch gevalideerd. Registry masteryparameters zijn prototype-only en de learner route toont geen masterybeslissing.

### Learner route en technische grenzen

- Toegevoegd: `curriculum-b5-learner.html`, aangesloten op de bestaande ouderauthenticatie, learner-profielen, geschiedenis en atomic persistence-service.
- Toegevoegd: `pacogo-engine/b5-controller.js` en controller-tests voor taakgebonden antwoorden, tussenstappen en controlemethoden.
- De route gebruikt de gedeelde browser vertical-slice runtime en registreert de observaties onder de bijbehorende B5-taskidentiteit.
- Browserregressie gebruikt een synthetische Supabase-testdouble. Er zijn geen echte learner-profielen of leerlingobservaties aangemaakt.
- Geen Supabase-schemawijziging of migratie uitgevoerd.

### Root cause en oplossing

- Full Regression #2978 op commit `f9c8e41f793744fd2c53e6ccd258ffaac2c30f65` faalde uitsluitend in de B5-browserregressie.
- De controlemethode-handler wijzigde `checkLabel.textContent`. Omdat het input-element in dat label was genest, verwijderde deze DOM-operatie ook het invoerveld. Playwright kon het veld daarna niet meer via zijn toegankelijke labelnaam vinden.
- Oplossing: labeltekst en input zijn nu afzonderlijke DOM-kinderen; bij methodekeuze wordt alleen de tekstnode aangepast. De browser-test controleert dat het veld beschikbaar blijft bij het wisselen tussen beide methoden.
- Geen curriculumcontract of bestaande testverwachting is afgezwakt.

### Verificatie

- Oplossingscommit: `77139b1482a7ebd34bae18e58c1654193026f147`.
- Testversterkingscommit: `b5aeb8e10bd2df54b714218fd2bdbcc28cd8668a`.
- Full Regression #2980 / run ID `42022760597`, exact commit `b5aeb8e10bd2df54b714218fd2bdbcc28cd8668a`: **GREEN**. Alle stappen zijn geslaagd, inclusief curriculum-engine, architectuurgrenzen, Double or Nothing, maintained Node, Vitest, browserregressie en clean working tree.
- Dedicated browser proof #646 / run ID `42022760747`, dezelfde commit: **GREEN**.
- Branch: `refactor/professional-v1`; branch head bij verificatie: `b5aeb8e10bd2df54b714218fd2bdbcc28cd8668a`. `main` is niet gewijzigd.

### Huidige status en volgende stap

- De B5-route is een eerste werkende practice-kandidaat, geen empirisch gevalideerde leerlijn en geen bewijs dat alle rekenvaardigheden van groep 6 zijn afgedekt.
- Laat de route nu inhoudelijk beoordelen op begrijpelijkheid, taakbelasting en aansluiting bij Zyons huidige rekenwerk. Verzamel eerst echte ouder-/leerkrachtinformatie over de gebruikte schoolmethode voordat methode-specifieke instructie of feedback wordt toegevoegd.
- Houd uitleg/ondersteuning gescheiden van beoordeling; een juist antwoord op één taak kent geen mastery toe.
- Volgende technische stap pas na een nieuwe groene Full Regression: inspecteer de bestaande SLO-scope en de resterende mapped skills om de eerstvolgende noodzakelijke skill te bepalen. Geen willekeurige extra interface of Supabase-wijziging toevoegen.
- Scientific Validation blijft een afzonderlijke toekomstige werkstroom. Synthetische browserobservaties zijn geen leerlingdata en leveren geen empirische validatie.


## 29. B1 task coverage specification — 2026-11-05

This section supersedes earlier handoff statements that describe the executable registry as containing only A1, B1 and FR2, or that still name B4 as the next skill build. See the later B2–B5 sections and the current registry v0.6.0-candidate.

### Current verified repository position before this documentation change
- Branch: `refactor/professional-v1`; `main` remains LIVE and must not be touched.
- Branch HEAD before this documentation change: `b3898f46cf4f21576c5e4b90cef284211b5315c9`.
- Full Regression #2983 / run ID `42023370351`, exact commit `b3898f46cf4f21576c5e4b90cef284211b5315c9`: GREEN.
- Dedicated browser proof #647 / run ID `42023370323`, same exact commit: GREEN.
- The latest regression above was checked before the B1 specification documentation commit. It does not verify subsequent documentation commits until rerun on the final resulting HEAD.

### B1 source and model review
- Current curriculum registry: `docs/curriculum/PacoGO_Curriculum_Registry_v0.6.json`, registry version `0.6.0-candidate`.
- B1 remains the existing skill Optellen with four developments and four claims. Its existing evidence targets include relation/representation/execution, strategy, checking, independence, robustness and transfer.
- Current practice catalogue: `docs/curriculum/PacoGO_B1_Learner_Task_Catalogue_v0.1.json`, with only B1-L01–L03. It currently covers one small-quantity task and two symbolic two-digit addition tasks; it contains no operational task for B1.D3 or B1.D4.
- The catalogue declares registry version `0.4.0-candidate`, while the current registry is `0.6.0-candidate`. Do not mechanically change the pointer. Compare B1 model versions and inspect runtime/persistence compatibility before revising the catalogue.
- The SLO mapping remains `docs/curriculum/PacoGO_Curriculum_Rekenen_SLO_10-18_Mapping.md`. KD10A includes whole/decimal numbers, operations, strategy/rekenvorm choice, mental calculation, estimation and written calculation. These do not automatically become separate skills.

### New specification
- Added `docs/curriculum/PacoGO_B1_Task_Coverage_Specification_v0.1.md`.
- This is an analysis/design specification only. It proposes task families mapped to existing B1 developments, claims, evidence targets and task models.
- It identifies missing operational coverage of D3/D4 and ET2/ET4/ET5/ET6/ET7/ET8 in the current three-task catalogue.
- It preserves existing skill/development/claim/evidence/task-model and mastery contracts. No executable tasks, runtime code, interface, learner data or Supabase schema were changed.
- The specification is grounded in the supplied Minimum 8B and Extra 8B workbooks and the supplied Basis 8B Theme 7 pages only. It does not infer unseen Basis workbook themes.
- The specification explicitly avoids imposing a universal written algorithm. A method-specific interface requires verified school-method information and must preserve the adaptive instruction architecture.

### Next concrete step
1. Compare the B1 skill object in registry v0.4 and v0.6 and determine whether the model contract changed.
2. Inspect the B1 learner route/runtime version compatibility and persisted evidence/task references.
3. Produce a task-level traceability design covering D3/D4 and the uncovered evidence targets before authoring executable tasks.
4. Do not change the registry, catalogue version pointer, mastery rules or Supabase until the compatibility and contract analysis supports it.
5. Before the next build, verify Full Regression on the exact current branch HEAD. A green run on the prior commit is not a substitute.

### Verification after this handoff update
- Specification commit: `068d431b3a3ccc3c765935b1349dd00887505fc6`.
- Handoff update commit: pending at the time of writing.
- Full Regression for the final documentation commit: pending; do not report green until actually verified.


### Follow-up compatibility finding
- Direct comparison of the B1 skill object in registry v0.4 and v0.6 confirms the B1 definition, four developments, four claims, eight evidence targets, six task models and all B1 development/evidence/mastery/decision rules are identical.
- The B1 learner route nevertheless explicitly fetches registry file v0.4 and resolves the registered version using the catalogue's `0.4.0-candidate` value. That version is also passed to learner-history loading and persistence. The pointer is therefore an active runtime/persistence contract, not merely descriptive metadata.
- Before changing B1 to registry v0.6, inspect TEST registration/read-back for v0.6 and existing B1 evidence/history by registry version. Determine whether switching versions would split or strand history. Preserve v0.4 compatibility or design an explicit migration/reconciliation path; do not silently switch the route.
- The B1 coverage specification was amended to record this finding. No route, catalogue, registry or Supabase changes were made.


### PacoGO TEST version/history read-only audit
- Supabase TEST project was inspected read-only. Registered `pacogo-curriculum` versions are `0.2.0-seed`, `0.3.0-candidate`, `0.4.0-candidate` and `0.5.0-candidate`; `0.6.0-candidate` is not registered in TEST at this point.
- B1-linked row counts in `student_evidence`, `student_longitudinal_state` and `curriculum_decision_trace` were zero for each registered version queried.
- This means no B1 evidence/history rows currently exist in those TEST tables, but the runtime still pins the B1 route to v0.4 and the catalogue to v0.4. The registry v0.6 is not available in TEST yet. Do not switch the route/catalogue until registry registration and runtime compatibility are deliberately designed and verified.
- No database writes, migrations, or schema changes were made.
- The B1 coverage specification now records the registry comparison, route pinning and TEST read-only audit.


### B1 runtime capability audit — 2026-11-05
- Full Regression #2989 / run ID `42026197894` is GREEN on exact pre-audit commit `180b0a0b5fe4929d66fb78d79cff4de49f5a8e78`. This verified the preceding handoff and B1 TEST-audit documentation. It does not yet verify the runtime-audit documentation commit below.
- Inspected `curriculum-b1-learner.html`, `pacogo-engine/addition-controller.js`, `addition-learning-interface-contract.js`, `addition-learning-interface.js` and `browser-vertical-slice.js`.
- Current addition interface only accepts `quantity_groups` and `symbolic_expression`. Renderer currently shows quantity dots or a symbolic equation and an integer-step answer input. It has no number-line, decimal-place, money-context, estimation/checking or strategy-selection UI.
- Controller has internal strategy/prompted-example recording methods, but the current route supplies no strategy options and the current renderer cannot invoke these interactions. Controller observation currently hardcodes `independent: true` and prompt level `none`; this cannot substantiate ET7 or prompted-vs-independent distinctions.
- Therefore new catalogue entries alone would be misleading for decimal, strategy, checking, representation-conversion, independence, robustness or transfer claims. These need end-to-end learner interaction and observation contracts first.
- Added a runtime capability audit to `PacoGO_B1_Task_Coverage_Specification_v0.1.md`. It is design documentation only; no runtime/catalogue/route/database/Supabase changes were made.
- Next step: create B1 task-level traceability + interaction contract, then choose the smallest complete vertical slice. D3/D4 tasks must wait until their evidence is actually captured. Do not widen the catalogue by adding tasks the UI cannot faithfully execute.
- Documentation commit for runtime audit: `0f82e7dd6004b58412aa22db46561bf923b78ce6`; Full Regression for this commit is pending.


## 30. B1 task traceability and ET7 contract review — 2026-11-05

### Verified starting point
- Branch: `refactor/professional-v1`; never touch LIVE `main`.
- Current HEAD before this documentation phase: `aecb1944874f0401a8c7e712c6305e49327345b0`.
- Full Regression #2991 / run ID `42028335668` is GREEN on exact commit `aecb1944874f0401a8c7e712c6305e49327345b0`. This includes the browser regression and clean working-tree verification.

### New design artifact
- Added `docs/curriculum/PacoGO_B1_Task_Traceability_Interaction_Contract_v0.1.md`.
- It maps candidate B1 task families to existing developments, claims, task models and evidence targets, and specifies learner-visible interactions, observation requirements, coding constraints and acceptance criteria.
- This is design-only. No executable tasks, learner catalogue, route, engine code, database or Supabase schema changed.

### ET7 finding
- B1.ET7 (zelfstandigheid) exists in the B1 registry under C3, but none of the six existing B1 task models maps to ET7. The catalogue contract test requires task evidence targets to exactly match the selected task model, so ET7 cannot be added to a task catalogue entry without changing an underlying contract.
- C3 documents independently define independence as a cross-cutting evidence-coding dimension with statuses INDEPENDENT, PROMPTED, DEPENDENT and UNKNOWN, and require prompt/instruction exposure to be observed. This supports cross-cutting independence coding generally but does not prove that B1.ET7 was intended to be cross-cutting or resolve its omission from B1 task models.
- The B1 addition controller currently hardcodes `independent: true`, which does not satisfy C3's requirement to classify from observed assistance/prompt exposure. It must not be used to claim ET7 or independent performance when the interaction does not capture the relevant conditions.
- Provisional finding: cross-cutting independence coding is supported by C3; B1-specific ET7 mapping remains unresolved. Do not remove ET7, attach it to TM4, or create a new task model by inference.

### Runtime capability and candidate task design
- Current B1 UI supports only quantity groups and symbolic expression, with integer-step numeric response. It does not yet support number-line/representation mapping, decimal input, strategy selection, explicit checking, or designed robustness/transfer pairs.
- Controller has internal strategy/prompted-example methods but current learner route does not expose those interactions.
- B1 traceability artifact distinguishes Q1 (quantity composition, TM1/ET1), R1 (representation mapping, TM2/ET1+ET2), S1 (whole-number execution, TM3/ET3), D1 (decimal execution, TM3/ET3), ST1 (strategy/checking, TM4/ET4+ET5), V1 (robustness, TM5/ET6) and T1 (transfer, TM6/ET8). These are candidate families, not approved catalogue tasks.
- Do not add catalogue entries for capabilities the UI cannot execute and the observation contract cannot evidence.

### Next concrete step
1. Resolve the B1-specific meaning/mapping of ET7 against the C3 coding architecture and registry contract. This is a curriculum-contract decision, not a code patch.
2. If that decision requires changes, design and test the underlying contract before implementation.
3. Then select the smallest complete learner-facing vertical slice whose UI and event capture genuinely support its declared evidence target. A D1 quantity-group extension is the most immediately supported candidate; do not pretend it closes D3/D4.
4. Before any code build, verify Full Regression on the exact current branch HEAD. If red, stop and isolate the root cause.

### Verification after documentation update
- Traceability artifact initial commit: `4f2299766c5e63c51d74b0e978fd089c788f2099`.
- ET7/C3 cross-check amendment: `885c594b7f88b9f12514d38571c65f1cdb3233e4`.
- Handoff update commit: `aabcf83e81887e89c1c1f79445ac8115a62efe95`.
- Full Regression #2994 / run ID `42029018689` completed GREEN on exact resulting HEAD `aabcf83e81887e89c1c1f79445ac8115a62efe95`; all 19 regression steps succeeded, including browser regression and clean working-tree verification.


## 31. Task support conditions and independence contract — 2026-11-05

### Verified starting point
- Branch: `refactor/professional-v1`; `main` remains LIVE and untouched.
- Starting HEAD: `aabcf83e81887e89c1c1f79445ac8115a62efe95`.
- Full Regression #2994 / run ID `42029018689` was GREEN on that exact starting commit.

### Design decision proposed
- Ordinary learning/practice tasks permit help-seeking by default.
- A task may explicitly declare an independent-performance condition before the learner starts.
- Planned task condition, learner help request, support actually delivered, and C3 independence assessment are separate concepts.
- A help request alone does not mean assistance was delivered and does not automatically mean PROMPTED or DEPENDENT.
- Target-relevant assistance delivered during an independent-performance attempt prevents coding the affected target as INDEPENDENT. Preserve the raw response and correctness.
- If the learner switches to supported practice, that continuation must be a distinct attempt; do not merge it with or overwrite the independent attempt.
- Neutral interface clarification must be distinguished from mathematical assistance that supplies target reasoning.
- Missing/incomplete support-event capture must result in UNKNOWN, never assumed INDEPENDENT.
- Existing C3 candidate categories INDEPENDENT, PROMPTED, DEPENDENT and UNKNOWN are retained pending canonical codebook reconciliation.

### Design artifact
- Added `docs/curriculum/PacoGO_Task_Support_Conditions_and_Independence_Contract_v0.1.md`.
- This is a candidate design only. It does not change B1 developments, claims, evidence targets, task models, ET7 mapping, mastery rules, learner catalogue, runtime, learner data or Supabase.
- B1.ET7 remains unresolved: it is present under C3 but not mapped by any of the six B1 task models. This proposal clarifies operational conditions but does not infer a registry mapping.

### Implementation blockers retained
1. B1 addition controller currently hardcodes `independent: true`, `prompt_level: none` and `hints: 0`; these cannot substantiate independence.
2. Observation contract/schema mismatch remains: runtime emits singular `evidence_target_id`, Empirical Observation Schema v0.1 specifies `evidence_target_ids`, Pilot DataSchema v0.2 uses singular target fields.
3. C3 Evidence Coding Specification v0.1, Evidence Coding Manual v0.1 and Pilot DataSchema v0.2 have differing prompt/independence vocabularies; canonical versioned codebook/schema reconciliation is required before event-to-code implementation.
4. Existing B1 catalogue validation still requires exact task-model/evidence-target matching.
5. B1 learner UI does not yet expose a complete help-request/support-delivery interaction.

### Next concrete step
Reconcile the canonical C3 codebook and observation/event schema, then explicitly resolve the B1.ET7 curriculum-contract role. Before any runtime, registry, catalogue or persistence implementation, run Full Regression on the exact current HEAD; if red, stop and isolate the root cause.

### Verification
- Design artifact commit: `86003d46f58179f970f2c78cf272890ba35087b0`.
- Handoff update commit: `b3f722ff8390944f1af3db943297bdf0d8ee4747`.
- Full Regression #2996 / run ID `42030868182` completed GREEN on exact commit `b3f722ff8390944f1af3db943297bdf0d8ee4747`.
- No runtime, registry, catalogue, learner-data or Supabase changes have been made.


## 32. Task support condition integrated with C3 design — 2026-11-05

### Verified starting point
- Branch: `refactor/professional-v1`; `main` remains LIVE and untouched.
- Starting HEAD: `b3f722ff8390944f1af3db943297bdf0d8ee4747`.
- Full Regression #2996 / run ID `42030868182` completed GREEN on that exact commit.

### C3 source review
- Reviewed C3 Canonical Codebook Reconciliation Proposal v0.1 and v0.2, C3 Evidence Coding Specification v0.1, Evidence Coding Manual v0.1, Pilot_DataSchema v0.2, Empirical_Observation_Schema v0.1, synthetic anchor packet/adjudication guidance and C1-C3 test specification.
- C3 proposal v0.2 already separates actual assistance events from target-specific independence judgement. It explicitly leaves PROMPTED versus DEPENDENT operational boundary unresolved.
- The additional missing product concept is the planned task support condition, which must be separate from help-seeking, actual delivered support and C3 coding.

### New addendum
- Added `docs/curriculum/PacoGO_Task_Support_Condition_C3_Addendum_v0.1.md`.
- Ordinary learning/practice defaults to help permitted.
- Independent performance is explicitly declared and communicated before the attempt.
- A help request is not equivalent to delivered assistance.
- Delivered support is recorded as an event; neutral interface clarification must be distinguished from target-relevant mathematical assistance.
- Supported continuation after an independent attempt is a separate attempt/response episode.
- Existing C3 target-specific independence coding is retained as the candidate measurement layer; no new parallel independence vocabulary is introduced.
- A single primary task field `support_condition` is proposed conceptually to avoid redundant flags. Legacy missing-field interpretation requires versioned backward-compatibility review before implementation.
- This addendum does not approve a canonical schema/codebook, choose PROMPTED/DEPENDENT boundary, or resolve B1.ET7.

### Remaining blockers
1. Reconcile runtime singular `evidence_target_id`, Empirical Observation Schema v0.1 array `evidence_target_ids`, and Pilot DataSchema v0.2 singular target/coding fields.
2. Approve canonical assistance event representation and target-relevance anchors.
3. Resolve PROMPTED versus DEPENDENT with explicit coder anchors; synthetic examples do not establish reliability.
4. Define attempt boundary and backward compatibility for task definitions lacking `support_condition`.
5. Resolve B1.ET7 curriculum/task-model relationship before emitting ET7 evidence.
6. Do not infer a Supabase migration; persistence changes require a demonstrated approved runtime-contract need.

### Next concrete step
Prepare a consolidated contract reconciliation covering raw response episode, task support condition, help request/support delivery events, target-specific assessment cardinality, schema versioning and history compatibility. Then make the explicit B1.ET7 curriculum-contract decision. No implementation until those decisions are approved and Full Regression is green on the exact current HEAD.

### Verification
- Task support C3 addendum commit: `abb071ac49d6f0b3385dc138dd92bd890c8a8733`; Full Regression #2997 / run ID `42033059236` completed GREEN on that exact commit.
- Handoff update commit: `3ab6ab665c03d33713ee544c530be4b11703ab5a`; Full Regression #2998 / run ID `42033100117` completed GREEN on that exact commit.
- Branch HEAD was verified as `3ab6ab665c03d33713ee544c530be4b11703ab5a` after #2998. `main` remains untouched.
- No runtime, registry, catalogue, learner data or Supabase changes.

## 33. C3 observation/event contract reconciliation — 2026-11-05

### Verified design result
- Added `docs/curriculum/PacoGO_C3_Consolidated_Observation_Event_Coding_Contract_Reconciliation_v0.1.md`.
- The reconciliation consolidates the conflicting C3 source contracts without silently choosing a canonical schema or codebook.
- It distinguishes the administered task/response episode, raw interaction and assistance events, target-specific assessments, coding provenance, and downstream inference.
- It records ten unresolved decisions (D1–D10), their dependencies and a proposed resolution order.
- It preserves the key boundary that one response episode remains one observation even when multiple evidence targets are assessed; those assessments do not become multiple independent observations.
- It explicitly leaves unresolved the singular-versus-array schema conflict, quality scale, target-alignment vocabulary, assistance coding anchors, PROMPTED/DEPENDENT boundary, historical compatibility and B1.ET7.
- This is design/reconciliation documentation only. No runtime, registry, learner catalogue, learner data, persistence or Supabase changes were made.

### Verification
- Reconciliation document commit: `831f547d204388d1ab16ae34fa8d260bef303c30`.
- Full Regression #3000 / run ID `42036785672` completed **GREEN** (`completed / success`) on that exact commit.
- Branch verified as `refactor/professional-v1` at that commit; `main` remains untouched.

### Next concrete step
- Do not start another broad C3 documentation cycle.
- Resolve only the B1.ET7 curriculum-contract question against the current registry and historical B1 prototype. Present the alternatives and consequences; do not remove ET7, map it to TM4/TM7 or add a task model without an explicit decision.
- After that decision, return to the smallest useful B1 learner-facing task slice for Zyon, starting from the already supported quantity-composition task family. Before any code build, run Full Regression on the exact current HEAD; if green, implement one complete task interaction and its observation path, then rerun Full Regression.


## 34. Centrale Skills-ingang — legacy runtime vervangen — 2026-11-05

### Startpunt en verificatie
- Branch: `refactor/professional-v1`; LIVE `main` niet aangeraakt.
- Startcommit: `4f17b8c2565a0b46170a88cc1d65403f92cbe866`.
- Full Regression #3008 / run ID `42076550855` was GREEN op die exacte commit.
- Na vervanging van de runtime: commit `8b96642107087c5b66f8ac883f83258a1f103f76`.
- Full Regression #3009 / run ID `42077377663` completed GREEN op exact `8b96642107087c5b66f8ac883f83258a1f103f76`.

### Uitgevoerd
- `src/features/skills/runtime.js` is vervangen: geen oude timed arithmetic sessies, score/high-score, oude Skill-definitions/configuration of `math-skill-*` opslag meer.
- De centrale ingang leest `docs/curriculum/PacoGO_Curriculum_Registry_v0.6.json` en toont A1, B1 en FR2.
- De centrale ingang verwijst naar de bestaande learner/curriculum-pagina's:
  - A1 → `curriculum-a1-numberline.html`
  - B1 → `curriculum-b1-learner.html`
  - FR2 → `curriculum-fr2-fractions.html`
- Statusverschil is expliciet: B1 gebruikt leerlingprofielen en opgeslagen voortgang; A1 en FR2 zijn prototypes zonder gekoppelde leerlingvoortgang.
- Toegevoegd: `test/skills-runtime-source-contract.test.js`, die registrybinding, bestemmingen, statusonderscheid en afwezigheid van legacy timed-practice-afhankelijkheden controleert.
- De route `skills.html` blijft bestaan en wijst naar de nieuwe runtime.
- De oude Supabase-tabellen zijn niet verwijderd; `game_results` en gedeelde game-functionaliteit blijven behouden.

### Vervolgcontrole
- De nieuwe centrale runtime is broncode- en regressiegetest; de test bewijst niet dat alle drie de learner-pagina's al dezelfde persistente learner-flow hebben.
- De A1- en FR2-prototypes gebruiken momenteel synthetische student keys en mogen niet als echte opgeslagen leerlingvoortgang worden gepresenteerd.
- De route krijgt de gedeelde tile-stylesheet mee.
- Nog uit te voeren: browsermatige controle van `skills.html` via de centrale router, verificatie van navigatie/contextbehoud, en volledige afhankelijkheidsaudit vóór verwijdering van legacy services, tabellen of oude pagina-assets.
- Verwijder geen oude Supabase-tabellen zonder data- en dependency-audit.
- Pas na die audit kunnen oude servicebestanden, oude skillpagina's, math-domain helpers/tests en legacy tabellen gecontroleerd worden verwijderd.

### Volgende concrete stap
1. Browser-test de centrale Skills-route inclusief navigatie naar A1, B1 en FR2 en controleer contextbehoud.
2. Inventariseer alle resterende imports/verwijzingen naar `skill_definitions`, `skill_assignments`, oude runtime helpers en legacy pagina's.
3. Verwijder alleen aantoonbaar ongebruikte code in een coherente cleanup-commit; behoud gedeelde game-resultaten en de nieuwe curriculum-engine.
4. Daarna terug naar B1 learner-facing werk voor Zyon; B1.ET7 en C3/schema-contract blockers blijven ongewijzigd en mogen niet worden omzeild.

### Handoff-verificatie
- Runtime replacement commit: `8b96642107087c5b66f8ac883f83258a1f103f76`; Full Regression #3009 GREEN.
- Handoff/route-styles update commit: pending; Full Regression pending.


## 35. Centrale Skills-route browserverificatie — 2026-11-05

### Resultaat
- De browser-test voor de centrale Skills-route is toegevoegd en uitgevoerd.
- De test start nu vanaf `/skills.html`, zodat het relatieve curriculum-registry-pad vanuit de applicatieroot wordt opgelost.
- De centrale Skills-route toont A1, B1 en FR2 en behoudt de learner-context (`viewStudent` en `mode`) bij navigatie.
- De eerdere mislukking op commit `eedc698` kwam door de testfixture-URL onder `/docs/curriculum/`; daardoor werd het relatieve registry-pad verkeerd opgebouwd. Dit was een testopstellingsfout, niet een vastgestelde runtimefout.
- Er is geen legacy code, Supabase-tabel of learner-data verwijderd.

### Verificatie op exacte commit
- Branch: `refactor/professional-v1`.
- Commit: `6a076cd2d9855d80cd1e5545030ca09ea484fa5b`.
- Full Regression #3012 / run ID `42079579031`: completed GREEN op exact deze commit.
- Browser Proof #651 / run ID `42079578874`: completed GREEN op exact deze commit.
- LIVE `main` is niet gewijzigd.

### Volgende concrete stap
Voer de dependency-audit uit van de oude Skills-implementatie: inventariseer imports, routes, tests, HTML-pagina's, services, migrations, schema- en datagebruik. Classificeer ieder onderdeel als actief, gedeeld, legacy maar nog contract-/data-afhankelijk, of aantoonbaar ongebruikt. Verwijder niets op basis van alleen een ontbrekende centrale route; Supabase-tabellen blijven buiten scope totdat data- en dependency-gebruik aantoonbaar zijn onderzocht.


## 36. Legacy Skills dependency-audit en eerste veilige opruiming — 2026-11-05

### Vastgestelde code-afhankelijkheden
- De centrale router registreert uitsluitend `skills.html` voor de nieuwe curriculumgedreven Skills-runtime.
- `skill-create.html` en `skill-editor.html` starten de algemene Paco-runtime, maar hebben geen eigen route in `src/app/routes.js`.
- De oude management runtimes zijn niet door de centrale route geregistreerd.
- De oude editor verwacht `app.skillDefinitions` en `app.skillConfiguration`; deze services worden niet door `src/app/bootstrap.js` opgebouwd of teruggegeven.
- De oude services en hun geïsoleerde tests blijven behouden: de bijbehorende tabellen bevatten bestaande gegevens.
- De oude math-domain helpers en tests blijven behouden totdat alle importrelaties en opvolging expliciet zijn afgesloten. De nieuwe Skills-runtime importeert deze helpers niet.

### Eerste opruiming
- Verwijderd: niet-geregistreerde legacy HTML-pagina's `skill-create.html` en `skill-editor.html`.
- Verwijderd: niet-geregistreerde management runtimes `skill-creation-runtime.js` en `skill-editor-runtime.js`.
- Behouden: centrale `skills.html`, nieuwe curriculum-runtime, gedeelde managementomgeving, oude services/tests als historische contracten, math-domain helpers/tests, curriculum-engine en learner-state.
- Geen Supabase-schema, tabel, rij of migratie gewijzigd.

### Alleen-lezen databasecontrole — PacoGO TEST
- `skill_definitions`: 13 rijen, waaronder twee aangepaste definities naast de oorspronkelijke catalogus.
- `skill_assignments`: 37 rijen verdeeld over drie learner-profielen; één assignment betreft de aangepaste Skill Breuken. Alle 37 rijen zijn aanwezig; 28 assignments zijn enabled en 9 disabled.
- `game_results`: 5 rijen over drie game keys (`double-or-nothing`, `flash-question`, `word-reveal`).
- Oude Skill-data is niet leeg en wordt niet verwijderd.
- Nieuwe engine-tabellen bevatten eveneens `skill_id`-kolommen in evidence, longitudinal state en decision trace. Dit zijn aparte curriculumcontracten.
- De productie-Supabase-omgeving is niet gewijzigd.

### Verificatie en vervolgstap
- Branch: `refactor/professional-v1`.
- Parent commit: `886c9da63347c6d595f730cb1d60fe4deeda3c5b`.
- Full Regression op parent: #3013 / run ID `42083415081`, completed GREEN.
- Cleanup-commit: `ac80edd2d0d6a1a28c57f513fcae730df2dc0d8f`; Full Regression #3014 / run ID `42103326026`, completed GREEN op exact deze commit.
- De vier verwijderde legacybestanden zijn op de cleanup-commit afwezig geverifieerd.
- Volgende stap: Full Regression op cleanup-commit; bij groen resterende import-/contractaudit afronden. Migreer of archiveer bestaande Skill-data uitsluitend na een expliciet ontworpen dataovergang. Behoud `game_results` en nieuwe curriculumtabellen.


## 37. Legacy Skill-data audit — orphan assignments and migration boundary — 2026-11-05

### Exact TEST database findings (read-only)
- `skill_definitions`: 13 rows; all 13 are enabled, none archived or trashed.
- `skill_assignments`: 37 rows; 28 enabled and 9 disabled.
- Three enabled assignments (`Zyon`, `Zenith`, `Zephon`) point to `math-mixed`, for which no definition exists.
- The `math-mixed` definition was explicitly deleted by migration `20261025070000_refine_skill_math_definitions.sql`; the old assignment migration had inserted those assignments, and no foreign key or cleanup migration removed them.
- Two custom definitions exist: `optellen tot 30` (no assignment) and `Breuken` (assigned to Zenith). Their IDs and definitions do not prove equivalence to curriculum skill IDs; do not map them automatically to B1 or FR2.
- `game_results`: 5 rows for `double-or-nothing`, `flash-question`, and `word-reveal`; no math/legacy-skill game result rows.
- `game_access_state` contains only `lexo`, `memory`, `rock-paper-scissors`, and `word-chase`; no legacy math Skill game keys.
- The old `skill_assignments` table has no FK to `skill_definitions`; this explains why orphan assignment rows remain.
- Curriculum engine `skill_id` columns in `student_evidence`, `student_longitudinal_state`, and `curriculum_decision_trace` are separate contracts and must not be merged with legacy IDs.

### Code contract findings
- `skill-definition-service.js` and `skill-configuration-service.js` are not constructed in the active app bootstrap. Their only confirmed direct imports in the inspected code are their isolated Vitest tests.
- The definition service includes list/get/save/archive/trash/permanent-delete operations. The configuration service reads and upserts per-student assignments but does not reconcile or delete stale assignments.
- The active Skills route imports only the new curriculum-driven runtime. The old timed math-domain/session helpers are not imported by that runtime.
- The two old services and their tests are retained temporarily to preserve an inspectable path for non-destructive extraction/migration of the 13 definitions and 37 assignments. Do not reattach them to the new Skills runtime.

### Decision / next step
- Do not delete or rewrite any TEST data. Do not create automatic B1/FR2 mappings.
- Before removing the two persistence services, design a non-destructive data disposition for custom definitions, learner assignments, and the three orphan `math-mixed` rows; distinguish archive/export from deletion.
- Keep `game_results`, game-access tables, curriculum engine tables, and learner state unchanged.
- No Supabase DDL/DML was performed; production project untouched.


### Regression-verificatie van sectie 37
- Full Regression #3016 / run ID `42104475497`: completed GREEN op exact commit `60da68d22845442ffc183add4c40ed6a825b74f7`.
- De handoff met deze bevindingen is inhoudelijk geverifieerd op die commit.
- Er is geen applicatiecode of database aangepast in deze auditstap.


## 38. Legacy Skills data disposition plan v0.1 — 2026-11-05

### Regression baseline
- Full Regression #3017 / run ID `42109605705`: completed GREEN op exact commit `38e61e26facc1d39ce56b07f48be4ffd3bbc4cdc`.

### Ontwerp vastgelegd
- Nieuw ontwerpdocument: `docs/curriculum/PacoGO_Legacy_Skills_Data_Disposition_Plan_v0.1.md`.
- Standaardbesluit: legacy Skills-data blijft dormant en ongewijzigd in de bestaande tabellen; dataretirement is geen voorwaarde om de oude learner-appcode uit te faseren.
- De 13 definities en 37 assignments zijn als aparte datacategorieën beschreven. Custom `optellen tot 30` en `Breuken` blijven herkenbaar; de drie `math-mixed`-orphan assignments blijven behouden en expliciet unresolved.
- Geen automatische mapping naar A1/B1/FR2; geen vermenging met curriculum-engine `skill_id`-contracten.
- Shared game data, game-access tabellen, historische migraties en curriculum learner-state blijven buiten scope.
- Het document definieert een lossless backup/restore protocol en gefaseerde retirement. Geen export is uitgevoerd; geen DDL/DML is uitgevoerd.

### Grenzen en open punten
- De volledige branch-specifieke code dependency scan is nog niet afgerond; GitHub code search dekt alleen de default branch en is hiervoor geen bewijs.
- De database audit moet voor een eventuele fysieke dataretirement nog object-/trigger-/policy-/view-/function-afhankelijkheden volledig controleren.
- Retentie, restricted backup-locatie en eventuele latere handmatige curriculumbeoordeling van custom Skills zijn open beslissingen.
- Volgende concrete stap: complete current-branch dependency proof uitvoeren vóór verwijdering van services, math modules of tests.

### Verificatie
- Ontwerpdocument en deze handoff-wijziging worden geverifieerd met Full Regression op de resulterende commit.
- Branch blijft `refactor/professional-v1`; LIVE `main` en productie-Supabase blijven onaangeroerd.


## 39. Legacy Skills dependency proof — 2026-11-05

### Exact-branch inventory completed
Audited the current branch at commit `9657fed4c65177fc8f607f90732588c87f74fa9f` across:
- 351 production/source JavaScript and MJS files;
- 64 HTML pages;
- 193 JavaScript/MJS/TypeScript test files;
- all 57 Supabase SQL migrations.

The scan covered the legacy table names, old service names and constructors, old runtime/page names, legacy math-session helpers and `math-skill-` game keys.

### Findings and classification
- The active `skills.html` route uses the curriculum-driven `src/features/skills/runtime.js`. The active route registry does not register the removed legacy Skill Editor pages.
- The active app bootstrap does not construct or expose `createSkillDefinitionService` or `createSkillConfigurationService`. Their remaining direct imports are their dedicated service tests. Those tests are explicitly included in the maintained Vitest regression, so the service/test pair remains a deliberate test dependency until a separately approved retirement step.
- The old `math-domain.js` session/question helpers are not imported by the central Skills runtime. Their remaining `createMathSession` references are within the legacy module and its dedicated test. Keep both until the retirement decision explicitly covers their test contract.
- `game-result-service.test.js` contains a `math-skill-addition` fixture for the generic game-result service. This is a test fixture, not an active Skills runtime dependency. The TEST database inventory found no matching legacy math Skill game-result rows.
- Legacy `skill_definitions` / `skill_assignments` references in SQL are confined to their historical creation/refinement/recovery/privilege migrations. Later curriculum-engine migrations use `skill_id` for separate evidence, longitudinal-state and decision-trace contracts; these must not be treated as legacy Skill-table dependencies.
- No additional legacy service, route, page or table references were found in the audited source, HTML, test or migration inventory.

### Database and data-retention boundary
- The prior read-only TEST catalog audit found no foreign keys, triggers, views, materialized views or database functions referencing the legacy Skill tables.
- Existing RLS policies on the legacy tables remain database dependencies. The public-read policy on `skill_assignments` and the public-read policy on `skill_definitions` are security findings requiring a separately designed ownership/security decision; do not silently alter them as part of code retirement.
- Preserve all 13 legacy definitions and 37 assignments, including the two custom definitions and three unresolved `math-mixed` orphan assignments. No data export, DDL, DML, policy change or production Supabase access was performed.
- The dormant-data disposition in section 38 remains authoritative. Physical data retirement is not required for retirement of obsolete learner-facing code.

### Decision and next gate
- **Stage A application dependency inventory is complete** for the audited source, HTML, tests and migrations on this exact branch commit.
- This does not authorize deletion of database rows, schema, RLS policies, shared game data or curriculum-engine learner-state.
- Next: verify Full Regression on the current branch head, then make a separate Stage B decision about retiring the isolated legacy service/math modules and their tests while leaving dormant database data intact. Do not combine code retirement with data retirement.
- No application code, tests, schema, migrations or data were changed in this audit.

### Verification status
- Branch: `refactor/professional-v1`.
- Audited base commit: `9657fed4c65177fc8f607f90732588c87f74fa9f`.
- Full Regression #3018 was reported GREEN by the user, but a new run on the post-handoff commit is still required. No new regression is claimed here.
- LIVE `main` remains untouched.


## 40. B1 three-group quantity-composition practice — 2026-11-06

### Implemented
- Added operational learner task `B1-L05`: three visible quantity groups, `2 + 3 + 4 = 9`.
- The task remains mapped to the existing `B1.D1 → B1.C1 → B1.TM1 → B1.ET1` contract. No registry, evidence-target, mastery, development-order or task-model change was made.
- The existing quantity-groups interface already renders one group per addend. No new interaction or persistence contract was required.
- Updated the learner catalogue and B1 task-coverage specification.
- Added interface-model, controller, catalogue-contract and browser coverage. The browser test verifies three groups, nine dots, completion, and persistence of the fifth learning cycle.
- Corrected the browser test sequence to explicitly advance from B1-L04 to B1-L05 after the fourth task completes.

### Regression and failure isolation
- Pre-build baseline: Full Regression #3019 / run ID `42131597064`, GREEN on `c19ca4eded641fc2585f8de5dd3f0798a9a67a82`.
- Initial implementation commit: `22693a1f299e7416e57f4ddb33b3eb27eb681ce6`.
- Full Regression #3020 / run ID `42207387133`: FAILED. 57 tests passed; one browser test failed because the test attempted to assert B1-L05 before clicking the existing “Volgende oefening” control after B1-L04. All preceding engine, architecture, Node and Vitest steps passed.
- Root cause was isolated to the browser-test sequence; no application defect was found from that failure.
- Test correction commit: `1a19e53ff8266acd665226693bd429ef54f5619f`.
- Full Regression #3021 / run ID `42207597254`: completed GREEN on exact commit `1a19e53ff8266acd665226693bd429ef54f5619f`.

### Boundaries
- Branch remains `refactor/professional-v1`; LIVE `main` untouched.
- No Supabase schema, migration, data or RLS change.
- ET7 remains unresolved in the B1 task-model mapping. This task does not claim independence evidence.
- The practice / interim-assessment / final-assessment mode contract and help-request termination rule remain a separate central design decision; no assessment runtime was implemented here.

### Current status and next step
- Current branch HEAD before this handoff metadata update: `70baad52350f38a20a2556c37619373aea469d52`.
- Full Regression #3022 / run ID `42207815956`: completed GREEN on exact commit `70baad52350f38a20a2556c37619373aea469d52`.
- Feature implementation commit: `22693a1f299e7416e57f4ddb33b3eb27eb681ce6`; browser-test sequence correction: `1a19e53ff8266acd665226693bd429ef54f5619f`.
- This handoff metadata update must itself be verified by Full Regression on its resulting commit.
- Next: continue the B1 learner-facing task design from supported quantity composition, while keeping ET7 and assessment-mode semantics explicit blockers for any independence or assessment implementation.


## 41. B1 representation-mapping task design — 2026-11-06

### Design completed
- New design artifact: `docs/curriculum/PacoGO_B1_Representation_Mapping_Task_Design_v0.1.md`.
- Provisional learner task B1-L06 is designed for the existing B1.D2 → B1.C2 → B1.TM2 contract.
- TM2's exact evidence target set is preserved: ET1 + ET2.
- The learner sees quantity groups, selects the symbolic equation that represents those groups, and separately enters the total. Mapping and total remain distinct raw response facts and distinct target-specific correctness values.
- Mixed responses (correct total / incorrect mapping, or the reverse) must remain distinguishable.
- The task is practice-only. It does not claim ET7, strategy, checking, independence, assessment validity or mastery.
- This is a design artifact, not an operational catalogue task. B1-L06 is provisional and has not been added to the learner catalogue or runtime.

### Architectural and persistence gates
- Extend the reusable Addition Learning Interface in separate pedagogical/function, interaction/state/evidence and rendering layers; do not create a B1-only widget.
- Before implementation, inspect the existing observation and persistence path to prove that the target-specific raw response can be preserved losslessly.
- Preserve the existing registry version/history scope (catalogue points to 0.4.0-candidate; TEST does not register 0.6.0-candidate).
- No Supabase schema, RPC, RLS, registry mapping, mastery or learner-state change is authorized by this design.
- ET7 and the central practice/interim-assessment/final-assessment support contract remain unresolved blockers for any independence or assessment implementation.

### Verification
- Branch: `refactor/professional-v1`.
- Design commit: `a97c299b3b7c441aefaefe8c35570defbc71aaeb`.
- Full Regression #3024 / run ID `42216716227`: completed GREEN on exact commit `a97c299b3b7c441aefaefe8c35570defbc71aaeb`.
- LIVE `main` and Supabase remain untouched.

### Next concrete step
Inspect the existing B1 controller → observation → browser vertical-slice → persistence path for lossless preservation of the two response dimensions. If the current contract supports it, implement the reusable interface extension and B1-L06 with unit, controller, catalogue, browser and Full Regression coverage. If it does not, stop and design the underlying contract before changing code or persistence.


## 42. Multi-target task evidence contract — 2026-11-06

### Exact baseline
- Branch: `refactor/professional-v1`.
- Full Regression #3024 / run ID `42216716227`: completed GREEN on exact commit `a97c299b3b7c441aefaefe8c35570defbc71aaeb`.
- Handoff-only commit `48799d803f1ddaa6b6efce68b5c0bb87480e0b86` follows that verified design commit. The branch head was re-inspected before writing; no force update was used.

### Inspection result — implementation gate not met
- Inspected B1 representation-mapping design, `interaction-contract.js`, `curriculum-registry.js`, `prototype.js`, `addition-controller.js`, `learner-curriculum-service.js`, registry v0.4 and the evidence persistence migration.
- The persistence service passes the full observation object into JSONB, so nested raw responses can be preserved without lossy field selection.
- The inference contract is single-target: task instances have one primary claim/development, observations expose only the first `evidence_target_id`, evidence assessment computes one quality, and inference attributes that one evidence item to one development.
- B1.TM2 maps to ET1 + ET2; ET1 belongs to C1/D1 and ET2 belongs to C2/D2. The current B1 catalogue test also assumes all task targets belong to one task claim. This cannot correctly represent the designed B1-L06.
- A combined correctness boolean or assigning both targets to the primary C2/D2 would misattribute evidence. Do not implement this task on the current contract.

### Design decision
- New design artifact: `docs/curriculum/PacoGO_Multi_Target_Task_Evidence_Contract_v0.1.md`.
- Separate one task attempt (raw learner interaction episode) from multiple target-specific evidence units.
- Resolve each target's claim and development through the registry.
- Assess ET1 and ET2 independently; preserve mixed responses.
- Ensure multiple target units from one attempt do not count as multiple independent attempts.
- Candidate persistence uses the existing JSONB observation/evidence-assessment fields with one row per task attempt, subject to explicit compatibility decisions for the scalar target column and legacy history. No Supabase change is made or authorized yet.

### Boundaries and next step
- B1-L06 remains designed but not implemented.
- No runtime, test, catalogue, registry, database, Supabase or learner data changed in this design step.
- ET7 and central assessment/help semantics remain separate unresolved contracts.
- Next: reconcile target-level evidence and task-attempt counting with C1-C9, validation data design, mastery and next-action semantics; settle persistence compatibility before coding.

### Verification
- This design and handoff update must be verified by Full Regression on the resulting commit.
- LIVE `main` remains untouched.


## 43. Multi-target evidence architecture reconciliation — 2026-11-06

### C1–C9 reconciliation completed — design only
- Full Regression #3026 / run ID `42218253663` completed GREEN on exact commit `e0a4309f6ff92568df8051d8c4d00b050ba96bd7`.
- Reviewed the multi-target proposal against C2 Student Data Model, C3 consolidated observation/event reconciliation and C3 codebook proposal v0.2, C6 Mastery Decision Protocol, C7 Next-Action Decision Protocol v0.2, C8 Student Model protocol, C9 Vertical Chain Validation protocol and the Scientific Validation Data Specification.
- New design artifact: `docs/curriculum/PacoGO_Multi_Target_Evidence_Architecture_Reconciliation_v0.1.md`.

### Reconciled architecture direction
- One administered task attempt remains one immutable raw observation.
- Multiple target-specific assessments may reference that observation; each target resolves its own claim/development through the registry.
- C6 mastery remains separate per claim/development/scope/time context. Evidence from ET1 (C1/D1) and ET2 (C2/D2) must not be pooled into one cross-claim mastery result.
- Target expansion never creates extra independent observations. Distinct attempt IDs alone do not prove independence; target-specific support/assistance provenance and an approved C3 judgement are required.
- Coverage, stability, variation and contradiction remain target-/scope-specific and must not be inflated by expansion.
- C7 next actions remain tied to their own C6 context and explicit ordering state.
- C8 temporal records retain one consistent learner/claim/development/scope identity. A shared raw observation can feed separate development histories through separate target assessments.
- C9 validates each claim/development branch while retaining the shared source-observation link; it must not collapse target ownership into the task's primary claim.

### Implementation gates remain closed
- C3 canonical codebook v0.2 remains a proposal, not approved. Quality scale, evidence vocabulary, assistance/independence boundaries, contradiction states and coder cardinality remain unresolved.
- Singular-versus-array observation schema conflict remains unresolved.
- The scalar database target column and all consumers require inspection before choosing persistence representation.
- Existing runtime inference/mastery semantics must be mapped to the claim/development-scoped fan-out without changing thresholds by assumption.
- No runtime, test, task catalogue, registry, Supabase, schema, learner-state or mastery changes are authorized by this reconciliation.
- B1-L06 remains designed only and is not implemented.

### Next concrete step
Prepare a focused versioned contract decision for observation-to-target-assessment cardinality and C6–C9 fan-out, including a compatibility decision for legacy single-target observations and scalar target columns. Only after that and explicit C3 codebook approval should implementation be reconsidered.

### Verification
- Design starting commit: `e0a4309f6ff92568df8051d8c4d00b050ba96bd7`.
- The design artifact and this handoff update require Full Regression on their resulting commit.
- Branch remains `refactor/professional-v1`; LIVE `main` and Supabase remain untouched.


## 44. Observation cardinality and legacy compatibility decision — 2026-11-06

### Exact baseline and inspection
- Full Regression #3027 / run ID `42219020009`: completed GREEN on exact commit `1ab93d17c0afbc782b10641c36e38824ac201578`.
- Inspected C2, empirical observation schema v0.1, Pilot_DataSchema v0.2, C3 reconciliation/codebook proposals, validation data specification, current interaction/registry/prototype engine, learner curriculum service, evidence/state/trace migrations and current persistence RPC.
- New design artifact: `docs/curriculum/PacoGO_Observation_Cardinality_Legacy_Compatibility_Decision_v0.1.md`.

### Proposed logical decision
- One separately administered task attempt = one immutable raw observation.
- One raw observation may have zero or more separately justified, versioned target-specific assessments.
- Target assessment resolves its own claim/development through the registry; task routing context does not overwrite target ownership.
- Rejected duplicating one source observation row per target because it would conflict with source-event uniqueness and inflate observation/independence counts.
- Historical single-target rows remain immutable and are exposed through a virtual legacy target-assessment read view without recoding old values or inventing provenance.
- A JSONB target-assessment array in one source row is the leading product compatibility candidate; a normalized child relation may still be preferable for scientific coder/round/adjudication records. Final canonical research storage remains undecided.
- Proposed scalar compatibility: populate scalar target/claim/development only for an unambiguous single-target record; use null for zero/multiple target assessments. This still requires complete consumer validation before implementation.

### Current blockers confirmed
- Current interaction/observation/registry/prototype/history adapter supports only one scalar target assessment.
- Current runtime produces one development/mastery/next-action result; state and persistence are skill-scoped, while C6–C8 require coherent claim/development/scope branches.
- JSONB raw-response preservation does not itself implement correct target fan-out or C6 independence semantics.
- C3 codebook v0.2 and observation schema remain unapproved candidates.
- No code, tests, catalogue, registry, Supabase, database schema, learner state or data changed.

### Next concrete step
Complete the scalar-field and learner-state consumer inventory, then specify the C6–C9 branch-state representation and read/write compatibility tests. Keep the JSONB-vs-normalized research-store decision open until coder/adjudication requirements are resolved. B1-L06 remains unimplemented.

### Verification
- Design starting commit: `1ab93d17c0afbc782b10641c36e38824ac201578`.
- New design artifact and this handoff update require Full Regression on their resulting commit.
- Branch remains `refactor/professional-v1`; LIVE `main` and Supabase remain untouched.


## 45. Integrated multi-target decision contract — 2026-11-06

### Design artifact created — candidate only
- New artifact: `docs/curriculum/PacoGO_Integrated_Multi_Target_Decision_Contract_v0.1.md`.
- Design commit: `4ee28ee8aa24261adaa04ac2ab6418cfecf1e867`.
- Starting baseline: Full Regression #3028 / run ID `42221996232`, GREEN on `59383d44022b926ae885daef7c6d7d74bb79272e`.

### Reconciled logical contract
- One administered task attempt remains one immutable raw observation.
- One observation may have zero or more separately justified target-specific C3 assessments.
- Each target assessment resolves its own claim/development through the exact registry version.
- Canonical C6–C9 branch identity is the six-part tuple: learner key, registry-version ID, claim ID, development ID, scope ID and time-window ID.
- C6 output must be a collection of fully identified branch results, not a map keyed only by claim ID. A legacy map adapter may be used only when claim-to-branch mapping is unambiguous; ambiguity must fail closed.
- C7 consumes the exact C6 branch. C8 retains separate histories by that same branch identity. C9 validates one branch at a time while preserving shared source-observation references.
- Multiple target assessments from one source observation never increase independent-observation counts.
- Persistence must represent one source observation and multiple branch assessments/traces atomically; event replay with conflicting payload/branch sets must fail rather than silently return an earlier result.

### Confirmed implementation gaps
- `interaction-contract.js` requires one claim/development and copies only the first target into the observation.
- Registry/prototype inference, mastery and next-action currently run once at skill level with scalar target/development attribution.
- C6 groups results by claim ID although it validates development/scope/time-window.
- C7 adapter does not enforce the complete six-part branch identity.
- C8/C9 do not validate registry-version and time-window identity.
- Learner service and persistence RPC write one evidence row, one skill-level state and one decision trace per source event.
- Existing scalar target/claim/development columns, skill-level state uniqueness and event-only trace uniqueness cannot represent the proposed multi-branch semantics without an approved compatibility design.

### Open decisions and implementation boundary
- JSONB assessment collection versus normalized target-assessment relation remains open pending C3 coder/round/adjudication requirements.
- Physical branch-state persistence model, branch-ID canonical serialization, legacy read projections, scope/time-window lifecycle and RPC replay comparison remain open.
- C3 codebook v0.2 remains a proposal; no unresolved evidence vocabulary, quality scale or independence boundary is approved by this artifact.
- No runtime, tests, catalogue, registry, schema, migration, Supabase, learner data or LIVE `main` changes are authorized.
- B1-L06 remains unimplemented.

### Next concrete step
Review this v0.1 contract and resolve O1–O7. The current browser/controller, engine, adapter, learner-service, SQL/RPC and regression-test consumer inventory has been completed to the scope recorded in sections 2.1–2.8. Do not begin implementation until the logical contract and required C3 boundaries are approved.

### Verification
- The design artifact was created on `refactor/professional-v1`.
- This handoff update and design artifact require Full Regression on the resulting commit. No regression result is claimed until the run completes on that exact commit.
- LIVE `main` and Supabase remain untouched.


## 46. Multi-target consumer inventory completed — 2026-11-06

### Exact baseline
- Branch head before this design-only inventory update: `e808938316c07440cb41f86d61ad827d5f4f4916`.
- Full Regression #3029 / run ID `42230086941`: completed GREEN on exact commit `4ee28ee8aa24261adaa04ac2ab6418cfecf1e867`.
- The handoff-only commit `e808938316c07440cb41f86d61ad827d5f4f4916` followed the tested design commit; this next commit is intended to trigger verification of the combined document state.

### Additional verified consumers
- Browser runtime `browser-vertical-slice.js` checks only task skill against observation skill before calling `runSkillCycle`; it does not validate the complete task/target/claim/development/registry relationship.
- Addition controller creates a task instance with one claim/development and a target array, then receives the current first-target scalar projection from `createObservation`.
- The controller adds provisional scalar evidence fields. They are not an approved C3 target-assessment set.
- Existing C3, registry/prototype, C6, C7, C8/C9 and vertical-slice tests validate the current single-target/single-branch contract only.
- Learner ownership and write-context migrations enforce guardian-scoped access, deny direct client writes and protect the atomic RPC boundary. These protections must remain unchanged in any future multi-branch persistence design.
- SQL integration tests currently prove one-row/one-state/one-trace persistence, guardian isolation, idempotent replay and rollback; they do not prove multi-branch persistence or conflicting replay rejection.

### Design update
- Contract v0.1 now records the browser/controller validation gap, existing test boundary and persistence security requirements.
- No runtime, tests, catalogue, registry, SQL, RLS, Supabase or learner data changed.
- JSONB versus normalized target-assessment storage and the physical branch-state model remain open.
- No implementation is authorized.

### Next concrete step
Review the integrated contract and resolve its open decisions O1–O7, starting with the C3 assessment/coder-round requirements and the exact branch-state/read-model contract. Only then define the implementation sequence.

### Verification
- Full Regression #3029 was GREEN on `4ee28ee8aa24261adaa04ac2ab6418cfecf1e867`.
- The new combined documentation commit requires its own Full Regression result; no result is claimed until that run completes on its exact commit.
- Branch remains `refactor/professional-v1`; LIVE `main` and Supabase remain untouched.


## 47. Multi-target decision review and staged evidence lifecycle — 2026-11-06

### Verification baseline
- Full Regression #3031 / run ID `42230443621` completed GREEN on exact commit `ac01f16538639537d0a91940c936c224fc4965b1`.
- All workflow steps passed, including browser regression and clean working-tree verification.
- Review document created after that baseline: `docs/curriculum/PacoGO_Multi_Target_Decision_Review_v0.1.md`.
- Review document commit: `be1e3b9070deaea79e6e227fe3c709a404f9fb9b`.

### Important architecture correction
- The raw observation ingestion cannot require all C3 coder assessments to exist in the same transaction. C3 v0.2 explicitly supports independent coder records, multiple coding rounds, later adjudication and versioned recoding.
- Separate lifecycle stages are now recommended: (1) immutable observation ingestion, (2) append-only target assessment/coder batches, (3) C6–C9 decision evaluation against a frozen assessment snapshot/version.
- Atomicity and idempotency apply separately to each stage. Later legitimate coder batches must not conflict with or mutate the original raw observation.
- One observation remains one source episode regardless of target/coder cardinality.

### O1–O7 review disposition
- O1: recommend normalized target-assessment and coder-provenance relations; keep raw observation payload in the parent JSONB record. Owner approval and exact relation design remain required.
- O2: recommend branch-keyed state projection plus append-only decision history; skill-level state remains derived. Exact concurrency/read model remains open.
- O3: recommend versioned canonical serialization of the six-part tuple and a SHA-256 surrogate while retaining all six inspectable fields. Byte-level test vectors remain required.
- O4: recommend a read-only legacy adapter; scalar target/claim/development projection only when exactly one target assessment is present. Full consumer classification remains required.
- O5: unresolved. A separate Scope and Time-Window Lifecycle Contract is required. Current C6 defines scope/window as explicit inputs but not their lifecycle; C8 currently lacks time-window identity.
- O6: unresolved. C3 codebook v0.2 remains a candidate. Explicit scientific/product-owner decisions in its Section 13 remain required.
- O7: recommend separate idempotency boundaries for raw observation ingestion, immutable assessment batches and decision evaluations. Same-key/different-payload conflicts reject; later coding is appended as a new versioned batch.

### Next concrete step
Author the Scope and Time-Window Lifecycle Contract and reconcile C8's time-window identity. In parallel, obtain explicit C3 v0.2 owner decisions. Do not implement runtime or persistence until these are approved and the integrated contract is updated.

### Boundaries
- No code, tests, catalogue, registry, curriculum content, schema, SQL, RPC, RLS, Supabase, learner data or LIVE `main` changed.
- B1-L06 remains unimplemented.
- Existing C6 gates, C7 candidate actions, mastery thresholds and C1–C9 meanings remain unchanged.
- Branch remains `refactor/professional-v1`.

### Verification
- The review is documentation-only and must be verified by Full Regression on the resulting combined commit after this handoff update.
- Latest verified Full Regression at the time of this handoff update: #3031 GREEN on `ac01f16538639537d0a91940c936c224fc4965b1`.
- No GREEN status is claimed for the new review/handoff commit until its own exact-commit run completes.


## 48. Scope and time-window lifecycle contract drafted — 2026-11-06

### Exact starting verification
- Full Regression #3033 / run ID `42241864483` completed GREEN on exact commit `663d434804ba113cb0f3a4e46d2d96ba4da3d365`.
- The review and lifecycle-contract documents were created after that verified baseline.

### New design artifact
- `docs/curriculum/PacoGO_Scope_and_Time_Window_Lifecycle_Contract_v0.1.md`.
- Commit: `ad5b6808210c18f17bd94c20025a5b26f76e3353`.
- Status: design proposal; owner review required; not approved for implementation.

### Core lifecycle direction
- Scope is a versioned specification of the evidence universe and decision question; it is not a task, session, UI or hidden threshold.
- Time window is a versioned temporal eligibility boundary; it is not implicitly the last N days, school term, browser session or task count.
- Both definitions are immutable once referenced by a decision evaluation. A changed definition creates a new identity/branch.
- Raw observation ingestion, later target assessment/coding and C6–C9 decision evaluation are separate lifecycle stages.
- Each decision snapshot freezes eligible observation IDs, target-assessment/coding versions, event-time interval, assessment-availability cut-off, registry and protocol versions.
- Late coding may enter a later snapshot without rewriting the earlier decision. Late observations after closure remain disallowed by default pending explicit policy.
- Overlapping windows are discouraged unless justified; they cannot count as independent replications.
- Successive windows remain separate six-part branches. C8 may compare them descriptively but cannot pool their evidence into a new mastery result.

### C6–C9 consequences
- C6 continues to use its existing seven gates and decision order; it receives explicit scope/window definitions and cannot create or infer them.
- C7 preserves the exact C6 branch and snapshot identity.
- C8 v0.1 is incomplete for the six-part branch identity. A new version must add registry-version and time-window identity and distinguish one-branch history from higher-level descriptive comparisons across windows.
- C9 must validate all six identity components for each branch independently.
- Operational decision windows are not automatically scientific longitudinal measurement waves.

### Owner decisions still required
The contract lists nine decisions, including scope/window authority, fixed versus rolling/event-defined windows, authoritative event timestamp/time zone, late-arrival rules, coding cut-off/finalization, overlap policy, mandatory scope dimensions, C8 presentation and retention/deletion.

### Boundaries
- No code, tests, registry, catalogue, curriculum mapping, SQL, schema, RPC, RLS, Supabase or learner data changed.
- No C3 codebook or C6 mastery thresholds were approved or changed.
- B1-L06 remains unimplemented.
- Branch remains `refactor/professional-v1`; LIVE `main` untouched.

### Next concrete step
Reconcile C8 and C9 into explicit versioned proposals using the full six-part identity and staged snapshot lifecycle. In parallel, obtain owner decisions on the scope/window questions and C3 v0.2 Section 13. Then update the integrated multi-target contract to v0.2.

### Verification
- Latest verified Full Regression before this design change: #3033 GREEN on `663d434804ba113cb0f3a4e46d2d96ba4da3d365`.
- Scope contract commit and this handoff update require Full Regression on the resulting combined commit. No GREEN status is claimed until that exact-commit run completes.

## 49. C8/C9 full branch identity and snapshot reconciliation — 2026-11-06

### Exact starting verification
- Full Regression #3035 / run ID `42242645809` completed GREEN on exact commit `a98c46458d1d14ee55ae73b8dd977abe5ad86953`.
- Full Regression #3034 / run ID `42242618808` completed GREEN on exact commit `ad5b6808210c18f17bd94c20025a5b26f76e3353`.
- Both runs completed all steps successfully, including curriculum-engine, architecture, maintained Node, Vitest, browser regression and clean-working-tree verification.

### New versioned C8/C9 proposals
- Added `docs/curriculum/PacoGO_C8_Student_Model_Learning_Status_Protocol_v0.2.md`.
  - Commit: `3fe9410f4bf106a43e56646c11f61efa39d3f2ae`.
- Added `docs/curriculum/PacoGO_C9_Vertical_Learning_Chain_Validation_Protocol_v0.2.md`.
  - Commit: `9f0804a1e1abf387cc8e34a5ca8f178561077878`.
- Both are versioned design proposals, owner review required, NOT approved for implementation. The v0.1 documents remain historical.

### C8 v0.2 reconciliation
- Canonical temporal histories require the complete six-part branch identity: learner key, registry-version ID, claim ID, development ID, scope ID and time-window ID.
- Every history item references an immutable decision snapshot, exact C6 evaluation and exact C7 decision.
- Snapshot event-time boundaries and assessment-availability cutoff remain separate; late coding can enter only a later snapshot and cannot rewrite prior history.
- Single-branch summaries preserve the exact latest C6 mastery state and C7 action without recomputation.
- A separate, explicitly typed higher-level projection may compare successive branches/windows descriptively, but must retain every source identity and may not pool evidence or create new mastery/next-action decisions.
- Legacy v0.1 histories remain legacy/unscoped where registry/window/snapshot provenance is missing; no fields are inferred or fabricated.

### C9 v0.2 reconciliation
- C9 validates every branch independently against the complete six-part identity.
- The required graph now includes raw observation, target-specific assessment/coder provenance, immutable scope/window definitions, frozen snapshot, C6 evaluation, exact C7 handoff and C8 single-branch history.
- One raw observation may be referenced by multiple target assessments/branches without duplication or inflated observation counts.
- C9 checks event-time eligibility separately from assessment-availability cutoff, exact record/version membership, and shared-observation lineage.
- Multi-branch requests return per-branch structural results only; no pooled mastery or next-action output is permitted.
- Historical v0.1 chains may be checked under their historical contract but cannot be labelled canonical v0.2 branches.

### Boundaries and open decisions
- Both documents are design-only. No code, tests, catalogue, registry, learner state, SQL, schema, RPC, RLS, Supabase or learner data changed.
- Scope/window owner decisions remain open under `PacoGO_Scope_and_Time_Window_Lifecycle_Contract_v0.1.md`.
- C3 codebook v0.2 and target-assessment/coder-provenance decisions remain unapproved.
- Canonical branch-ID serialization, physical branch-state persistence/read model, legacy projection API and integrated C3/C6–C9 contract v0.2 remain open.
- B1-L06 remains designed only and unimplemented.
- Branch remains `refactor/professional-v1`; LIVE `main` remains untouched.

### Next concrete step
Update the integrated multi-target decision contract to v0.2 so it incorporates the staged lifecycle, immutable snapshots, exact six-part C8/C9 contracts and unresolved implementation gates. Then reconcile its open decisions and request explicit owner decisions for scope/window and C3 codebook v0.2. Do not begin runtime or persistence implementation until those decisions and compatibility contracts are approved.

### Verification
- This handoff update follows C8 v0.2 commit `3fe9410f4bf106a43e56646c11f61efa39d3f2ae` and C9 v0.2 commit `9f0804a1e1abf387cc8e34a5ca8f178561077878`.
- Full Regression for the combined C8/C9/handoff document state is pending; no GREEN status is claimed until a run completes on the exact resulting handoff commit.
- Latest verified Full Regression before these three documentation commits: #3035 GREEN on `a98c46458d1d14ee55ae73b8dd977abe5ad86953`.



## 50. Integrated multi-target decision contract v0.2 — 2026-11-06

### Exact starting verification
- Full Regression #3040 / run ID `42243391852` completed GREEN on exact commit `5c4dd08a4b1788dabcff38a9d6f1a1fb9f75915d`.
- All workflow steps succeeded: dependency/security checks, canonical ownership boundaries, curriculum-engine regression, architecture boundary tests, Double or Nothing runtime regression, maintained Node regression, maintained Vitest regression, Chromium setup, fixture server, browser regression and clean-working-tree verification.

### New integrated contract
- Added `docs/curriculum/PacoGO_Integrated_Multi_Target_Decision_Contract_v0.2.md`.
- Commit: `7b0684bdae55f0a384841379e42628ed78458c7f`.
- This is an integrated logical architecture proposal / owner review required / NOT approved for implementation. v0.1 remains historical; its implementation observations are explicitly tied to its old verified baseline, not represented as a fresh current-branch audit.

### Integrated decisions now reconciled
- Three distinct lifecycle stages: immutable raw-observation ingestion; append-only target-specific C3 assessment/coding; frozen branch-specific decision snapshot and evaluation.
- One administered task-instance response episode produces one raw observation. One observation may link to multiple target assessments and branches without duplicating source observations or inflating independence counts.
- Target assessment, coder round and adjudication are not new learner observations. Late coding/correction is append-only and can only enter a later eligible snapshot.
- Every canonical C6–C9 branch retains the full six-part identity: learner, registry version, claim, development, scope and time window.
- Scope/window definitions are immutable and versioned once referenced. Event-time eligibility and assessment-availability cutoff are separate. A frozen snapshot lists exact observation IDs, target-assessment IDs/versions, codebook/protocol versions and exclusions.
- C6 retains its seven gates/order but requires branch-keyed results rather than claim-only output. C7 consumes the exact C6 branch, snapshot and evaluation. C8 preserves exact branch histories and only permits descriptive cross-branch projections. C9 validates each branch independently while retaining shared observation identity.
- Observation ingestion, assessment/coding ingestion and decision evaluation have separate idempotency boundaries. Conflicting same-identity payloads reject.
- Recommended but unapproved directions: normalized target-assessment/coder-provenance relations; branch-keyed state projection plus append-only decision history; read-only legacy adapter; versioned canonical tuple serialization with SHA-256 surrogate while retaining all six fields.

### Owner decisions still open
- C3 codebook vocabulary, target-assessment lifecycle, coder rounds/adjudication and physical storage.
- Scope/window ownership, timestamp authority/timezone, late arrivals, closure/finalization, overlap and retention.
- Canonical branch-ID serialization and compatibility.
- Physical branch-state/read-model, atomicity, idempotency and legacy consumer projections.
- Exact C6/C7 snapshot envelope reconciliation and product-facing cross-branch projection rules.

### Boundaries
- No code, tests, task catalogue, registry, learner state/data, SQL, schema, RPC, RLS, Supabase or LIVE `main` changes were made.
- B1-L06 remains designed only and unimplemented.
- Branch remains `refactor/professional-v1`.

### Next concrete step
Conduct a focused owner-decision review against the open items in Sections 18–19 of the integrated v0.2 contract, starting with C3 codebook/assessment provenance and scope/window authority/lifecycle. Then reconcile C6/C7 snapshot envelope and canonical branch-ID serialization. Do not start runtime or persistence implementation until the relevant contracts are explicitly approved.

### Verification
- Integrated contract v0.2 commit: `7b0684bdae55f0a384841379e42628ed78458c7f`.
- Full Regression for the integrated contract plus this handoff update is pending; no GREEN status is claimed until a run completes on the exact resulting handoff commit.
- Latest verified Full Regression: #3040 GREEN on `5c4dd08a4b1788dabcff38a9d6f1a1fb9f75915d`.


## 51. Owner-confirmed learner assessment modes: oefenen, tussentoets and toets — 2026-11-06

### Verified documentation review

The current handoff and the two task-support documents were checked on `refactor/professional-v1`.

- Section 17 already distinguished assessment from teaching support, but did not define the three learner-facing assessment modes.
- `PacoGO_Task_Support_Conditions_and_Independence_Contract_v0.1.md` already defined supported practice and independent performance. It explicitly left open whether a help request during independent performance pauses or ends the attempt.
- `PacoGO_Task_Support_Condition_C3_Addendum_v0.1.md` contained the same unresolved product choice.
- The following owner decision therefore closes that product-interaction question; it was not previously fully recorded.

### Confirmed product policy

1. **Oefenen:** Zyon may ask PacoGO for help, such as an explanation, hint or example. Help-seeking is normal learning behaviour and is not a failure.
2. **Tussentoets:** PacoGO administers an independent assessment of a smaller, explicitly defined part of an existing curriculum objective.
3. **Toets:** PacoGO administers an independent assessment of a broader part of the existing curriculum objective.
4. Before either assessment, PacoGO clearly tells the learner that it is independent and that content help is not available during the attempt.
5. If the learner requests content help during a tussentoets or toets, the independent attempt ends immediately. PacoGO records the request and marks that assessment attempt as ended/incomplete, not as a failed test or an incorrect learner response. The learner returns to oefenen, where help is available.
6. Any subsequent supported work is a separate practice attempt; it must not be merged with or overwrite the ended independent assessment attempt.
7. A help request and support actually delivered remain separate recorded events. The request ends the assessment by product policy, but does not prove that help was delivered.
8. Neutral interface clarification (for example, how to enter an answer) remains distinct from content help and must not supply target reasoning.

### Assessment and mastery boundaries

- **PacoGO is the single operational assessor** in the learner product. No second human assessor or parallel rating workflow is introduced into normal learner use.
- PacoGO evaluates the evidence against the existing curriculum contracts and mastery decision process.
- Oefenen, tussentoets and toets are learner-facing **afnamevormen**, not new skills, developments, claims, evidence targets or mastery rules.
- Tussentoets and toets differ in the scope of the existing objective being assessed; they do not create a new mastery threshold.
- Existing C6 seven-gate mastery protocol, target-specific evidence requirements, scope/time boundaries and no-automatic-promotion rule remain unchanged. A single assessment or one correct response does not automatically establish mastery.
- The future scientific validation of PacoGO's decisions is separate from the operational learner experience. It does not require multiple assessors in the normal product flow.

### Documentation changes in this update

- Updated `PacoGO_Task_Support_Conditions_and_Independence_Contract_v0.1.md` to select the help-request interaction and distinguish the assessment formats.
- Updated `PacoGO_Task_Support_Condition_C3_Addendum_v0.1.md` to close the previously open pause/end product choice.
- No curriculum registry, skill, task catalogue, mastery rule, runtime, event schema, SQL, RLS, Supabase or learner data was changed or approved by this decision.

### Next concrete step

Continue the planned PacoGO build without creating a separate assessment engine or second assessor. When the learner-facing assessment flow is implemented, design it against this policy and the existing curriculum/C3/C6 contracts. Any required event/schema changes must be specified first and must pass the regression-first workflow.

### Verification

- Branch: `refactor/professional-v1`; LIVE `main` was not changed.
- Documentation commits:
  - Task Support Conditions contract: `f8f242e56d98b75d0b2e888046e8e05e1c4dd31c`.
  - C3 addendum: `c7f564062c9696707d29e0d6aa96b06db89654db`.
  - This handoff decision: `3dca3031f619319be031ac14ac77bf493615d252`.
- Full Regression #3045 / run ID `42247081822`: GREEN on exact handoff commit `3dca3031f619319be031ac14ac77bf493615d252`; all 16 workflow steps succeeded.
- This verification statement is itself a handoff update. Full Regression must run again on the exact resulting commit; no GREEN status is claimed for that new commit until it completes.


## 52. Legacy Skills dependency audit — current-branch reconciliation — 2026-11-06

### Exact starting verification
- Branch: `refactor/professional-v1`; exact HEAD before this handoff update: `676ed8f276a3759b04060335e3e877e258ef7af3`.
- Full Regression #3046 / run ID `42252273430`: completed GREEN on that exact commit.
- LIVE `main` was not changed.

### Reconciliation of the prior audit counts
- Re-inspected the recursive Git tree at the exact current branch HEAD and compared all changes since the Stage A dependency-proof base `9657fed4c65177fc8f607f90732588c87f74fa9`.
- The prior production/source count of 351 is consistent when the 14 existing test-oriented runtime modules (for example `test-engine.js`, `test-runtime.js` and `practice-test-runtime.js`) are not classified as production curriculum/application source.
- The repository contains 64 HTML pages and 57 SQL migrations, matching the prior inventory.
- The prior count of 193 test files covers the `test/`, `tests/` and `vitest/` test directories. A further 113 `.test/.spec` files are located under `src/` and `pacogo-engine/`; these were not represented in that 193 count.
- All 113 additional test files were inspected on exact HEAD `676ed8f` for legacy Skill table/service/runtime identifiers and old math-session references.

### Additional test-file findings
- `src/features/skills/math/math-domain.test.js` imports `math-domain.js` and exercises `createMathSession`. This is the isolated test contract for the retained legacy math-domain module.
- `src/services/game-result-service.test.js` contains the string `math-skill-addition` as a fixture for the generic game-result service. It is not an import or runtime dependency on the retired Skills module.
- No other legacy Skill table, service, page, runtime or math-session references were found in the 113 additional test files.
- The previously identified dedicated tests `test/skill-definition-service.test.js` and `test/skill-configuration-service.test.js` remain the only test consumers of the two retained legacy persistence services.

### Current-branch change check
- Compared `9657fed` through `676ed8f`: 19 changed paths, consisting of curriculum documentation/handoff files and four test files.
- No production JavaScript/MJS/TypeScript source, HTML route/page, SQL migration or Supabase file changed in that interval. The four changed tests were inspected; their changes concern the B1 three-group quantity task and introduce no legacy Skills dependency.
- Re-inspected current `src/app/bootstrap.js`, `src/app/routes.js` and `src/features/skills/runtime.js`: none constructs or imports the legacy definition/configuration services or old math-session module.
- The old definition/configuration service files remain in the repository but are not constructed by the active app bootstrap. Their dedicated tests remain isolated.
- The legacy math-domain module remains isolated to its dedicated test. The central curriculum Skills route remains the active Skills entry point.

### Audit disposition and boundaries
- Stage A read-only dependency inventory is now reconciled for the current branch, including the 113 embedded test files omitted from the earlier 193-file test-directory count.
- The old learner-facing editor pages and management runtimes remain retired as recorded in Section 36.
- The two legacy persistence services, their isolated tests, the math-domain module and its isolated test remain present pending a separate Stage B retirement decision.
- Existing legacy TEST data remains dormant and unchanged under the disposition plan: no automatic mapping to SLO skills, no deletion or rewrite. The earlier read-only inventory of 13 definitions, 37 assignments and three unresolved `math-mixed` orphan assignments remains the recorded database baseline; no new Supabase inspection or database operation was performed in this audit.
- No production conclusion is made from this repository audit. No code, tests, schema, migration, data, RLS, Supabase or LIVE `main` changes were made.

### Next concrete step
Prepare the Stage B owner decision: whether to retire the now-isolated legacy persistence services and old math-domain code/tests while keeping all legacy database rows and tables untouched. Do not delete code or data until that decision and its exact compatibility/test consequences are documented.

### Verification
- Exact audit baseline: `676ed8f276a3759b04060335e3e877e258ef7af3`.
- Full Regression #3046 / run ID `42252273430`: GREEN on that exact baseline.
- This handoff update requires its own Full Regression on the resulting commit. No post-update GREEN status is claimed until that exact-commit run completes.

## 53. Owner decision: replace legacy Skills persistence within the existing Supabase project — 2026-11-06

### Exact starting verification
- Branch: `refactor/professional-v1`.
- Exact starting HEAD: `5729daeab08c2e5e9f777037f2f93fd09ddb0aeb`.
- Full Regression #3047 / run ID `42253821751`: completed successfully on that exact SHA. All 19 workflow steps completed successfully, including curriculum-engine, architecture, maintained Node, maintained Vitest, browser regression and clean-working-tree verification.
- LIVE `main` was not changed.

### Owner-confirmed decision
The owner authorizes retirement of the old Skills implementation and its old Skills persistence data model. The replacement is to be built **inside the existing Supabase project**. A separate Supabase project is explicitly rejected because the rest of PacoGO must continue using the current project.

The intended disposition is:
- Retire the isolated legacy Skills definition/configuration services, their obsolete tests, and the old math question/session generator and its tests, after final consumer/dependency verification.
- Replace the legacy Skills tables and their associated rows with a curriculum-aligned Skills persistence structure in the existing Supabase project, but only after the new contract and migration sequence are designed, reviewed and tested.
- Legacy Skills rows/IDs do not need to be mapped into the new SLO curriculum identifiers. Do not silently translate old keys such as `addition-100` or `math-mixed`.
- Preserve the current Supabase project, authentication, parent accounts, learner profiles, lessons and lesson data, shared student data, curriculum registry/evidence/state contracts, and all unrelated modules.
- Preserve the active curriculum Skills route (`src/features/skills/runtime.js`) and the current curriculum registry. These are not the retired legacy Skills system.
- Preserve shared game infrastructure/data such as `game_results`, `game_access_state`, and shared `games` rows unless a precise dependency audit proves that a narrowly identified seed row belongs exclusively to legacy Skills. No broad deletion from shared tables is authorized.
- Do not rewrite historical migration files. Any eventual schema replacement must use new forward migrations.
- Do not change C1–C9 contracts, evidence semantics, mastery rules, assessment policy or learner-state contracts merely to fit a new table design. Reuse existing curriculum persistence where it already satisfies the approved contracts.
- No Supabase DDL/DML, old table deletion, source deletion or migration creation is authorized by this decision alone. The destructive operation remains gated by a complete dependency audit, a defined backup/export and recovery plan, a tested replacement contract and a verified cutover sequence.

### Reconciliation of Section 52
This owner decision supersedes the previous Section 52 default disposition of dormant preservation for the legacy Skills tables and rows. The read-only inventory in Section 52 remains historical evidence only; it is not a current live database assertion. The retirement scope is now approved in principle, while the exact table/data deletion set remains subject to dependency verification.

### Current B1 learner-route finding
The existing curriculum B1 learner route is a real starting point, not the old Skills module:
- `curriculum-b1-learner.html` uses the current curriculum engine, the B1 learner task catalogue and the existing learner-curriculum persistence services.
- The current operational catalogue contains five fixed practice tasks. Its coverage specification identifies the absence of operational tasks for B1.D3 and B1.D4 and gaps in ET2, ET4, ET5, ET6, ET7 and ET8.
- The B1 page currently submits an answer and persists the resulting learning cycle, but does not yet provide the approved learner help-request/support-delivery interaction.
- The task-support contract identifies unresolved C3 codebook/event-schema mismatches and the unresolved B1.ET7 relationship. These are design gates; do not implement help/independence coding by guessing or by hardcoding independence.
- The B1 route currently references curriculum registry 0.4 while the current Skills runtime/catalogue and registry candidate are at 0.6. Its version/history/persistence implications must be reconciled before changing that pointer.

### Next concrete step
Perform a read-only, exact-scope audit of legacy Skills database dependencies and reconcile the B1/C3 implementation gates. Produce the replacement persistence contract and safe migration/cutover plan before creating migrations or deleting anything. In parallel, specify the B1 practice-route improvements against the approved SLO/B1 task coverage and support contracts. Keep the existing Supabase project and shared learner/lesson data intact.

### Verification
- This handoff update is documentation-only and must be followed by Full Regression on its exact resulting commit.
- No GREEN status is claimed for the handoff update until that exact-commit run completes.
- No source code, tests, SQL migrations, Supabase data/schema, or LIVE `main` changes are included in this decision record.


## 54. Owner-confirmed scope correction — new SLO Skills build phase — 2026-11-06

### Superseding decision
This section records the owner's latest explicit direction and supersedes the legacy Skills retirement decision in Section 53 wherever they conflict.

- Existing/legacy Skills remain in the repository and are preserved for now.
- No legacy Skills deletion, migration, retirement, re-investigation or cleanup is in scope for the current build phase.
- Legacy Skills cleanup is deferred to a separate future phase.
- Games remain outside this development.
- Existing lessons, learner profiles, assessment history and unrelated Supabase components remain untouched.
- No new Supabase project will be created.
- C1–C9 contracts are not to be changed to accommodate legacy systems.
- Build the new SLO-based Skills on the existing curriculum engine, beginning with the existing B1 addition developmental line.
- Work only on `refactor/professional-v1`; LIVE `main` remains untouched.

Section 53's owner decision to retire legacy Skills is superseded by this newer scope decision. Its historical audit observations remain historical records only; they do not authorise deletion, migration or further legacy investigation during this phase.

### Verified starting baseline
- Branch: `refactor/professional-v1`.
- Exact HEAD: `5f7223cd5f09e105e51e8acf903fcc27d2afef83`.
- Full Regression #3048 / run ID `42256163216`: completed successfully on that exact SHA.
- All 19 workflow steps completed successfully, including curriculum-engine, architecture, maintained Node, maintained Vitest, browser regression and clean-working-tree verification.
- LIVE `main` was not changed.

### B1 starting point and constraints
- B1 remains the existing SLO-mapped skill `Optellen` with its current four developments, four claims, eight evidence targets, six task models and existing mastery/decision rules.
- The current learner catalogue v0.1 contains five tasks (B1-L01–L05) and declares registry 0.4.0-candidate, while the current registry candidate is 0.6.0-candidate. The B1 skill object is unchanged between registry 0.4 and 0.6, but the route/version integration must still be handled deliberately.
- Existing catalogue coverage analysis identifies missing operational tasks for D3 and D4 and missing explicit coverage for ET2, ET4, ET5, ET6, ET7 and ET8.
- B1.ET7 is not mapped by any of the six existing task models. Do not silently attach ET7 to a task model, remove it, or invent a replacement mapping.
- Existing C3/codebook and observation-schema reconciliation proposals remain candidate design artifacts, not approved canonical contracts. Do not derive target-specific independence codes or change persistence/schema by guessing.
- The owner-confirmed product interaction policy remains: supported practice permits help; tussentoets and toets are independent assessment formats; a content-help request during either ends that attempt as incomplete and returns the learner to a separate supported-practice attempt. This does not itself approve a runtime/event/schema implementation.
- Preserve raw responses, ordered interaction events and the separation between observation, evidence assessment, inference, mastery and next action.
- Do not change B1 curriculum meanings, C1–C9, mastery thresholds, learner history, Supabase or unrelated modules merely to make the first interface slice easier.

### Next concrete step
Continue the B1 build from the verified baseline. First identify the smallest complete, contract-valid learner-practice vertical slice that can be implemented without unresolved evidence/schema assumptions. Then extend task coverage along the existing B1 developmental line. Independent tussentoets/toets support must not be represented as implemented until its event and observation contract is sufficiently resolved and tested.

### Verification of this handoff update
This documentation update is a repository change. Full Regression must run on the exact commit created by this update. Do not claim post-update GREEN until that exact-commit workflow completes.


## 55. B1 supported-practice interaction — first implementation slice — 2026-11-06

### Implemented
The first B1 learner-practice support slice is implemented on top of the existing addition controller and learner route.

New reusable interaction component:
- `pacogo-engine/task-support-controller.js`
- `pacogo-engine/task-support-controller.test.js`

B1 pedagogical support content:
- `pacogo-engine/addition-support-content.js`
- `pacogo-engine/addition-support-content.test.js`

Integrated:
- `pacogo-engine/addition-controller.js`
- `pacogo-engine/addition-learning-interface.js`
- `curriculum-b1-learner.html`
- `pacogo-engine/addition-controller.test.js`
- `test/browser/curriculum-b1-learner.browser.test.js`

The learner can request and receive a conceptual explanation, hint or worked example during supported practice. Content is versioned by content ID/version and avoids prescribing a school-specific calculation algorithm. The interaction records separate immutable-in-observation events for:
- `help_requested`;
- `support_delivered`;
- `help_request_dismissed`;
- `help_request_unresolved` when the task is submitted before requested support is delivered.

The actual delivered content and support type are preserved in the event payload. A help request is not treated as delivered assistance. The recorded hint count reflects delivered hint events. When support was delivered, the legacy prompt-level field is left null rather than falsely asserting `none`.

### Preserved boundaries
- B1 skill/development/claim/evidence-target/task-model definitions are unchanged.
- ET7 remains unresolved and is not claimed by this slice.
- Raw support events are captured; no target-specific C3 independence classification is derived from them.
- Observation independence remains `UNKNOWN`; support does not automatically change correctness, mastery or next-action rules.
- C1–C9 contracts, curriculum registry, learner-history schema, Supabase, lessons, learner profiles and unrelated modules are unchanged.
- No Supabase migration or data operation was required.
- Independent tussentoets/toets runtime and incomplete-assessment persistence are not yet implemented. They remain gated by the unresolved event/observation contract; do not represent them as complete.

### Regression and commit
- Implementation commit: `f9081bf36c4f0e5950c107bb9086138011f76c17`.
- Initial Full Regression #3050 exposed an integration wiring error in `addition-controller.js`; the exact cause was isolated and corrected without changing tests to hide the failure.
- Corrective commit: `8f9ebb070e5d04968e3e63a87e5544b6e1f2b7cb`.
- Full Regression #3051 / run ID `42267647378`: GREEN on that exact corrective commit.
- All 19 workflow steps passed, including maintained Node, Vitest, 58 browser tests and clean-working-tree verification.
- Additional lesson-save browser proof #654 completed successfully on the implementation commit.
- LIVE `main` was not changed.

### Next concrete step
Continue the B1 operational module by extending meaningful task coverage along the existing B1 developmental line, preserving B1-L01–L05 identities and all existing curriculum contracts. Keep the supported-practice event path reusable. Resolve the B1/C3 observation and support-condition contract before implementing independent tussentoets/toets attempt persistence or deriving independence judgements. Do not change registry mastery or Supabase merely to accelerate task coverage.

### Verification of this handoff update
This handoff update is a repository change and requires Full Regression on its exact resulting commit. No post-update GREEN status is claimed until that exact-commit run completes.


## 56. B1 D2 task coverage extension — operational catalogue v0.2 — 2026-11-06

### Implemented
Created `docs/curriculum/PacoGO_B1_Learner_Task_Catalogue_v0.2.json` and moved the B1 learner route to this catalogue version.

- B1-L01–L05 are retained unchanged.
- B1-L06 adds a two-digit whole-number symbolic addition without regrouping: 34 + 25 = 59.
- B1-L07 adds a three-digit whole-number symbolic addition with regrouping: 126 + 37 = 163.
- Both new tasks remain within B1.D2 / B1.C2 / B1.TM3 / B1.ET3.
- Both use the existing symbolic-expression renderer, integer response contract and supported-practice help layer.
- No strategy, checking, independence, transfer or mastery claim is inferred from these tasks.

The operational catalogue now contains seven tasks. The existing registry pointer remains `0.4.0-candidate`; no registry version or Supabase registration change was made.

### Verification
- Implementation commit: `aa42075a9a1938c9d043f6bb0861126dbf3309ef`.
- Full Regression #3053 / run ID `42268307961`: GREEN on that exact commit.
- All 19 workflow steps passed, including maintained Node, Vitest, 58 browser tests and clean-working-tree verification.
- The catalogue contract test verifies exact B1.D2/C2/TM3/ET3 mapping and unique task/variation IDs.
- The browser regression completed and persisted all seven learning cycles through the existing learner-curriculum path.
- LIVE `main` was not changed.

### Next concrete step
Continue B1 by implementing an observable representation-mapping task within the existing B1.TM2 / ET1+ET2 contract. The learner must actively construct or select a representation of the same addition relation; merely displaying an equation and collecting a numeric answer is not ET2 evidence. Reuse the existing pedagogical interface architecture where appropriate. Do not create new claims, task models, mastery rules or Supabase schema to bypass the current interaction/evidence requirements.

### Verification of this handoff update
This handoff update is a repository change and requires Full Regression on its exact resulting commit. No post-update GREEN status is claimed until that exact-commit run completes.



## 57. B1 TM2 multi-target evidence contract blocker — 2026-11-06

### Verified finding
The next planned operational task is a representation-mapping task under the existing B1.TM2 contract, whose registry definition declares both B1.ET1 and B1.ET2.

The current observation/persistence path does not preserve both targets:
- `createTaskInstance` retains the complete `evidence_target_ids` array.
- `createObservation` reduces that array to the singular `evidence_target_id` by selecting index 0.
- `createLearnerCurriculumService.persistLearningCycle` sends only that singular target to the persistence RPC.
- `student_evidence` stores a singular `evidence_target_id`; its unique idempotency index is on `(student_key, source_event_id)`.

Therefore a TM2 task using the current path would persist ET1 while silently losing ET2. Merely adding a representation-selection UI or event would not fix the missing target-level evidence persistence. Do not implement the TM2 learner task until this contract is resolved.

### Scope boundaries
- This is an evidence/observation/persistence contract issue, not a curriculum-definition issue.
- B1 meanings, TM2, ET1/ET2, C1–C9, mastery rules and the registry remain unchanged.
- No Supabase migration or runtime persistence change has been made.
- Do not duplicate evidence rows with the same source event or fabricate target-specific observations without a defined assessment and idempotency contract.
- Old Skills, games, lessons, learner profiles, test history and unrelated Supabase areas remain untouched.

### Next concrete step
Design and test a canonical multi-target evidence contract: how one learner interaction produces separately assessable evidence for each declared target; how target-specific assessments, observation identity, event provenance and idempotent persistence work; and how inference consumes those records without double-counting one performance as multiple independent observations. Determine from that design whether a genuine persistence contract change is required. Only then implement the smallest complete vertical slice.

### Verification context
- Branch: `refactor/professional-v1`.
- Starting commit for this finding: `e7c6bdf553b99a1a03b6bcc770921ec200fe7c49`.
- Full Regression #3054 / run ID `42268591207`: GREEN on that exact starting commit; all 19 workflow steps completed successfully, including browser regression and clean-tree verification.
- This handoff update itself requires Full Regression on its resulting exact commit. No post-update GREEN status is claimed until that run completes.



## 58. B1 multi-target readiness review and verified gate — 2026-11-06

### Regression gate completed before further design work
- Branch: `refactor/professional-v1`.
- Handoff finding commit: `e68f7aeb0f363699508f1ee838c41e589157880a`.
- Full Regression #3055 / run ID `42271228515`: GREEN on that exact handoff commit.
- Verification-only commit with the same tree: `9b0ba488f0fee3dc06f160fa32ac974055c63bf0`.
- Full Regression #3056 / run ID `42272241927`: GREEN on that exact branch HEAD; all 19 workflow steps passed, including Node, Vitest, Chromium/browser regression and clean-working-tree verification.
- LIVE `main` was not changed.

### Existing design work located — do not recreate
The branch already contains the following candidate design work:
- `PacoGO_Multi_Target_Task_Evidence_Contract_v0.1.md`;
- `PacoGO_Multi_Target_Evidence_Architecture_Reconciliation_v0.1.md`;
- `PacoGO_Observation_Cardinality_Legacy_Compatibility_Decision_v0.1.md`;
- `PacoGO_Integrated_Multi_Target_Decision_Contract_v0.2.md`;
- `PacoGO_Multi_Target_Decision_Review_v0.1.md`;
- `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md`;
- `PacoGO_Scope_and_Time_Window_Lifecycle_Contract_v0.1.md`;
- C6, C7, C8 v0.2 and C9 v0.2 protocol/design files.

The accepted logical direction in the candidate documents is one immutable raw observation per separately administered attempt, linked to zero or more separately justified target assessments. Target assessments retain their registry-resolved claim/development ownership. Shared source-observation identity prevents target expansion from inflating independent-observation counts.

These documents remain proposals requiring owner review. In particular, the integrated v0.2 contract is explicitly NOT approved for implementation; its O1–O9 decisions remain open. C3 v0.2, scope/time-window v0.1, C8 v0.2 and C9 v0.2 also remain unapproved design proposals. Do not treat their presence or recommendations as approval.

### Current implementation gaps reconfirmed
- `createTaskInstance` stores a primary scalar claim/development and an evidence-target array.
- `createObservation` exposes only the first target as scalar `evidence_target_id`.
- `curriculum-registry.js` assesses relevance against one scalar target.
- `prototype.js` emits one assessment/evidence projection, one skill-cycle development/mastery result and one next-action result.
- `learner-curriculum-service.js` reads/writes one skill-scoped state and sends scalar claim/development/target columns alongside JSONB observation/assessment payloads.
- The current product persistence/read path therefore does not implement the six-part branch fan-out proposed by C6–C9. JSONB preservation of raw response data alone does not solve inference, branch identity, history or compatibility.
- No runtime, test, registry, catalogue, SQL/RPC/RLS, Supabase or learner-data changes were made in this review.

### Task identity correction
The operational B1 catalogue v0.2 already assigns:
- B1-L06 to 34 + 25, mapped to B1.D2 / B1.C2 / B1.TM3 / B1.ET3;
- B1-L07 to 126 + 37, mapped to the same existing TM3/ET3 contract.

Therefore the older provisional B1 representation-mapping design's use of B1-L06 is stale and must not be reused. Preserve B1-L01–L07 unchanged. The representation-mapping task must receive the next unused identity, currently B1-L08, after a final repository-wide collision check at implementation time.

### Next concrete step
Complete owner review of `PacoGO_Integrated_Multi_Target_Decision_Contract_v0.2.md` together with its O1–O9 decision table, using the existing `PacoGO_Multi_Target_Decision_Review_v0.1.md` recommendations as input. Review C3 v0.2 and the scope/time-window lifecycle proposal as explicit separate scientific/product decisions. Reconcile the task-ID correction to B1-L08 in the representation-mapping design.

Do not implement the B1 multi-target learner task, inference fan-out, read-model or persistence changes until the relevant contracts are explicitly approved and the remaining consumer/security/atomicity gates are closed. No C1–C9 meaning, curriculum mapping, mastery threshold, old Skill, lesson, learner profile, test history, game or unrelated Supabase area may be changed.

### Verification of this handoff update
This handoff update is a repository change and requires Full Regression on its exact resulting commit. No post-update GREEN status is claimed until that exact-commit run completes.


## 59. Owner-directed multi-target architecture decisions — 2026-11-06

### Decision record
Created:
- `docs/curriculum/PacoGO_Multi_Target_Owner_Architecture_Decisions_v0.1.md`

The owner instructed us to proceed with the reviewed recommendations. This record establishes the logical architecture baseline for O1–O4 and O7–O8 while explicitly leaving O5, O6 and O9 open. It does not authorize runtime or persistence implementation.

### Logical decisions recorded
- O1: normalized logical target-assessment records linked to one immutable raw observation, with separate append-only coder/round/adjudication provenance. Physical schema is deferred until C3 and persistence/security design are approved.
- O2: branch-specific state and append-only decision history are authoritative; skill-level state is a derived projection only. Physical read-model/table design remains open.
- O3: the six explicit branch fields remain authoritative. No derived branch hash/serialization is approved; a separate canonical serialization contract would be required.
- O4: historical scalar records remain unchanged/readable; a read-only legacy adapter is the forward direction. Exact API/mapping waits for consumer inventory.
- O7: observation, assessment/coding and decision evaluation have separate idempotency boundaries. Lifecycle is staged; each write stage is atomic internally and supports durable retry/recovery. Exact status/retry/concurrency design remains a pre-implementation gate.
- O8: C6 consumes one frozen snapshot per exact six-part branch; C7 consumes the exact C6 branch/snapshot/evaluation and does not recompute mastery.

### Explicitly open
- O5: scope/time-window owner, event clock/timezone, closure, grace/late-arrival, overlap, C8 presentation and retention policy.
- O6: canonical C3 vocabulary, quality scale, evidence-status/missingness rules, independence anchors, contradiction, coder/adjudication and reliability design, schema versioning.
- O9: exact learner-facing cross-branch presentation and wording. Descriptive summaries must preserve branch lineage and cannot pool evidence or recompute mastery/actions.

### Invariants and scope
- One separately administered task-instance response episode = one immutable raw observation.
- One observation may have zero or more target-specific assessments; assessment/coder/adjudication cardinality never inflates raw observation counts.
- A shared observation may be referenced by multiple branch snapshots but is never duplicated.
- Existing SLO meanings, skills, developments, claims, targets, task models, C1–C9 meanings and mastery criteria remain unchanged.
- Legacy Skills, lessons, learner profiles, assessment history, games and unrelated Supabase components remain untouched.
- No runtime, tests, registry, catalogue, SQL/RPC/RLS, Supabase or learner-data changes are authorized by this decision record.
- B1-L08 multi-target task remains blocked until the contracts and implementation-readiness gates are closed.

### Next concrete step
Produce a consolidated implementation-readiness matrix identifying each remaining gate, owner, required artifact/evidence, dependencies and implementation authorization point. Then close O5/O6/O9 and the remaining C6–C9, consumer, identity, persistence, security and atomicity gates before considering a pure contract implementation slice.

### Verification
- Starting branch: `refactor/professional-v1`.
- Starting exact commit: `8ec132ed609ec9563ec2f1ea663982a4a708279c`.
- Full Regression #3057 / run ID `42272691896`: GREEN on that exact commit (all 19 workflow steps).
- Decision record commit: `655bd8c80771733f76e0cd787c2d2bf14b6f3d36`.
- This handoff update is a documentation change and requires Full Regression on the exact resulting commit. No post-update GREEN is claimed until that run completes.
- LIVE `main` was not changed.


## 60. Multi-target implementation-readiness matrix — 2026-11-06

### Artifact created
- `docs/curriculum/PacoGO_Multi_Target_Implementation_Readiness_Matrix_v0.1.md`
- Commit: `8b70571666ee218c0623908e59d454416142eb04`

The matrix translates the accepted logical architecture decisions into explicit gates, accountable roles, required evidence/artifacts, dependencies and authorization checkpoints. It distinguishes owner/scientific/product decisions from engineering and data/security design. It explicitly records that completing individual gates does not authorize implementation; G12 is the explicit implementation authorization checkpoint.

### Gate structure
- G0: exact-branch baseline and Full Regression.
- G1: O5 scope/time-window lifecycle approval.
- G2: O6 canonical C3 codebook and measurement approval.
- G3: C3 coding reliability readiness.
- G4: O9 learner-facing cross-branch product policy.
- G5: C6–C9 contract reconciliation.
- G6: task-definition / task-instance / observation identity.
- G7: legacy and runtime consumer inventory.
- G8: physical persistence and read-model design.
- G9: staged writes, idempotency, concurrency and recovery.
- G10: security, privacy and child-data governance.
- G11: contract and migration verification suite.
- G12: explicit narrow implementation authorization.
- G13: separate empirical validation and product-claim authorization.

### Current disposition
- O1–O4 and O7–O8 remain accepted at logical level only.
- O5, O6 and O9 remain open.
- C3 v0.2 and Scope/Time-Window v0.1 remain proposals.
- C6 v0.1, C7 v0.2, C8 v0.2 and C9 v0.2 still require cross-contract reconciliation; the matrix does not silently approve them.
- G6 and G7 read-only audit work can proceed in parallel with owner decisions; no runtime behavior change is authorized.
- G8–G11 remain dependent on approved contracts and complete consumer/security inventories.
- B1-L08 remains blocked. B1-L01–L07 and existing curriculum meanings remain unchanged.
- No runtime, tests, registry, catalogue, task models, SQL/RPC/RLS, Supabase or learner data were changed.
- Scientific Validation remains distinct from engineering regression and structural chain validation.

### Verification
- Branch: `refactor/professional-v1`.
- Before matrix work, Full Regression #3059 / run ID `42315420685` completed GREEN on exact handoff commit `8d840d220d0c2feed7100f53756385c409f1c5ad`; all 19 workflow steps passed.
- The current branch verification-only commit `043a649f903c5bf04da65c2035451eb27a069a79` has the exact same tree as `8d840d2`.
- Matrix commit: `8b70571666ee218c0623908e59d454416142eb04`.
- Full Regression #3061 / run ID `42315810808`: GREEN on that exact matrix commit; all 19 workflow steps passed, including maintained Node/Vitest regression, browser regression and clean-working-tree verification.
- This handoff update is itself a repository change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.
- LIVE `main` was not changed.

### Next concrete step
Resolve the owner/scientific decisions in G1 (O5) and G2 (O6), and obtain the product decision in G4 (O9). In parallel, complete only the read-only G6 task/attempt identity audit and G7 consumer inventory. Do not implement B1-L08 or persistence/runtime fan-out until G0–G11 are closed and G12 explicitly authorizes a bounded slice.


## 61. G6/G7 read-only identity and consumer audit — 2026-11-06

### Artifact created
- `docs/curriculum/PacoGO_G6_G7_Read_Only_Identity_and_Consumer_Audit_v0.1.md`
- Audit commit: `c01af851c2b133b7f028cebf0060b2784b27b752`

The audit is based on the exact branch source, learner HTML entry points, engine modules/tests, service code and committed SQL migrations. It is read-only. No code, tests, registry, catalogue, task models, SQL/RPC/RLS, Supabase or learner data were changed. Migration files were inspected as repository artifacts only; deployed Supabase state is not asserted.

### G6 — verified identity findings
- `createTaskInstance` sets `task_instance_id` equal to the supplied stable catalogue `task_id`; task definition and administered attempt are conflated.
- The shared contract does not define a unique administration/attempt identity or a complete immutable task-definition snapshot.
- `createObservation` derives observation identity from task-instance ID plus timestamp, stores the task-instance ID in `task_id`, and retains only `evidence_target_ids[0]` as scalar `evidence_target_id`.
- Scalar claim/development ownership is copied from the task instance. A future multi-target task cannot yet produce separately owned target assessments through this path.
- Interaction event IDs are composed from task-instance ID, event type and timestamp. Controllers use the last event as `source_event_id`; there is no separate canonical administration identity.
- Controllers hard-code task-definition version values (mostly `0.1`; B5 `0.3`). Some pages also store catalogue version in provenance, but no single canonical immutable task-definition/interface configuration identity is carried through the whole chain.
- The runtime observation is only shallowly frozen; nested cloned payloads are not recursively frozen.
- The current B1 learner catalogue v0.2 contains B1-L01–L07 and each currently declares one evidence target. The first-target loss is therefore a latent multi-target contract defect, not a failure exercised by those seven current entries. B1-L06/L07 remain TM3/ET3. B1-L08 remains blocked.
- The addition controller is data-driven over catalogue tasks; it is not a separate implementation per arithmetic sum.

**G6 disposition: OPEN.** Define versioned task definition, task model/interface identity, administered task instance/attempt, event/retry semantics, immutable observation identity, timestamps/provenance and canonical payload/replay semantics before changing controllers.

### G7 — verified runtime and consumer findings
- The browser learner cycle is `browser-vertical-slice → curriculum-registry → prototype`. It assesses one scalar target, infers development/mastery and chooses a next task in a skill-centric cycle.
- The separate C6–C9 modules are not wired into the reviewed browser learner cycle. C6/C7 and C8/C9 are exercised through separate constructed vertical-slice tests.
- C6 currently returns a claim-keyed `mastery_state_by_claim` map. Same-claim results across distinct development/scope/window contexts can overwrite. Current C6/C7 adapters select by claim ID and do not preserve the full six-part branch plus exact snapshot/evaluation envelope.
- Current C8/C9 code validates a four-part learner/claim/development/scope identity, not the six-part identity in the v0.2 design proposals.
- B1–B5 persisted learner pages use the skill-centric browser cycle and `learner-curriculum-service` for history and persistence.
- A1 number-line, FR2 fraction and B1 experimental/variant pages call the browser cycle but the reviewed pages do not call learner-curriculum persistence.
- Clock interface/controller demo pages use their own interface/controller path and do not call the learner curriculum persistence service.
- `mastery-service` is a separate local-storage streak service, not C6. Test-history and practice-result services are separate product histories, not C8 branch history.

### G7 — verified persistence findings
- `student_evidence` stores scalar target/claim/development/task fields and one JSONB observation/assessment per row; unique key is learner + source event.
- `student_longitudinal_state` is unique by learner + registry version + skill, not by six-part branch identity.
- `curriculum_decision_trace` is constrained to one trace per learner + source event.
- `persist_curriculum_learning_cycle` inserts one evidence row, upserts one skill-level state and inserts one trace in one RPC.
- The duplicate path checks that related rows exist but does not compare the existing immutable payload to a canonical replay payload; same-key conflicting payloads are not currently distinguished as integrity conflicts.
- Guardian ownership, RLS, the later SECURITY INVOKER write path and transaction-local capability cleanup are existing security boundaries to preserve. No deployed database state is inferred from migrations.

**G7 disposition:** runtime and persistence inventory baseline recorded. Consumer-by-consumer compatibility/rollout, physical persistence redesign and C6–C9 integration remain gated; no implementation authorized.

### Verification
- Branch: `refactor/professional-v1`.
- Starting exact commit: `6ec1b879d80d8635902508e891b35f24f33c4b23`.
- Full Regression #3062 / run ID `42316250165`: GREEN on that exact starting commit; all 19 steps passed.
- Audit commit: `c01af851c2b133b7f028cebf0060b2784b27b752`.
- Full Regression #3063 / run ID `42316716344`: GREEN on that exact audit commit; all 19 workflow steps passed, including Node, Vitest, browser regression and clean-working-tree verification.
- This handoff update is itself a repository change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.
- LIVE `main` was not changed.

### Next concrete step
Close G1/O5 and G2/O6 with explicit owner/scientific decisions, and obtain G4/O9 product approval. Reconcile C6–C9 contracts (G5) against the verified code findings. Then use this audit to author the canonical task/attempt/observation identity contract and consumer-by-consumer legacy compatibility plan. Keep G8–G11 closed until those upstream contracts are approved. Do not implement B1-L08, runtime fan-out or persistence changes before G12 explicitly authorizes a bounded slice.


## 62. [WITHDRAWN] C3 scientific measurement and coding review — 2026-11-06

> This section records an invalid human-coder premise and is superseded in full by sections 63–64. Do not use its coder rounds, adjudication, double-coding or inter-rater reliability requirements as PacoGO learner-runtime architecture.

### Artifact created
- `docs/curriculum/PacoGO_C3_Scientific_Measurement_and_Coding_Review_v0.1.md`
- Review commit: `2f34e93896a7d6961fcdcad2d604265ce654cf4f`

The review compares the current C3 v0.2 candidate, coding specification/manual, blinded synthetic packet, descriptive reliability layer and the two conflicting observation schemas against methodological literature on assessment validity, observational coding, ordinal agreement and generalizability theory.

### Main findings
- Keep task-instance alignment, response-to-target relation, objective performance, raw process availability, target-specific evidence status, assistance exposure, independence and contradiction as separate coding dimensions. They answer different questions and must not be collapsed into one score.
- Correctness must not automatically determine evidence status, evidence quality, independence, contradiction or mastery.
- The three-level quality scale in the coding manual and five-level scale in the C3 specification remain incompatible. Neither is approved. The synthetic coder packet does not include a quality dimension, so it cannot test quality anchors.
- Evidence quality has no sufficiently operationalised construct/anchor set yet. A numeric scale must not be selected for convenience or treated as interval data without justification.
- The exact PROMPTED/DEPENDENT boundary remains unresolved and needs observable assistance-event anchors.
- Reliability statistics must follow the actual measurement level, coding unit, coder assignment (crossed/nested), number of coders, missing-rating structure and category prevalence. No coefficient or threshold is selected.
- The current descriptive reliability layer's exactly-two-coder pairing is a reporting limitation, not a scientific requirement. Unpaired and multi-coder records must remain visible.
- Synthetic examples can test instruction clarity and category boundaries; they cannot establish empirical inter-rater reliability, population prevalence, construct validity or mastery validity.
- A further lifecycle distinction is required: no target-assessment record exists yet is not necessarily the same as an existing assessment record whose field remains NOT_CODED.
- The singular target/coding fields in Pilot_DataSchema v0.2 and array/separate coding boundary in Empirical_Observation_Schema v0.1 remain unresolved. No schema selection or migration is authorized.

### O6 disposition
**O6 remains OPEN.** This review is evidence for owner/scientific review, not approval of a canonical codebook. Required decisions remain the final labels/anchors, missingness and NO_RESPONSE rules, evidence-status boundaries, quality construct/scale, assistance/independence anchors, contradiction rationale, coder/adjudication lifecycle, reliability design and canonical schema/version compatibility.

### Verification
- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3064 / run ID `42316871653`: GREEN on exact preceding handoff commit `4b29000ed67d6ff7e7b64db21c2873f115cc5c93`, all 19 workflow steps.
- C3 review commit: `2f34e93896a7d6961fcdcad2d604265ce654cf4f`.
- Full Regression #3065 / run ID `42317293805`: IN PROGRESS on the exact C3 review commit at the time of this handoff update. Do not claim GREEN until completion.
- This handoff update requires its own Full Regression on the exact resulting commit.

### Next concrete step
Prepare the explicit O6 owner/scientific decision record using the C3 v0.2 proposal and this review. Do not select categories, quality scale, reliability statistic or threshold on the owner's behalf. In parallel, O5's existing Scope/Time-Window Lifecycle Contract remains the candidate for owner review, and O9 still requires a product decision. Only after O5/O6/O9 and G5–G11 are resolved may G12 implementation authorization be considered. B1-L08, runtime fan-out, schema changes and Supabase work remain blocked.


## 63. Correction — learner assessment ownership and C3 coder premise — 2026-11-06

### Owner-confirmed learner interaction contract

Source: `PacoGO_Task_Support_Conditions_and_Independence_Contract_v0.1.md`.

- **OEFENEN:** the learner may ask PacoGO for help, including explanation, hints or examples. Help-seeking is a normal learning action, not failure.
- **TUSSENTOETSEN:** independent assessment of a smaller, explicitly defined part of an existing learning objective/scope; no content help.
- **TOETSEN:** independent assessment over a broader part of the existing learning objective/scope; no content help.
- A content-help request during TUSSENTOETSEN or TOETSEN immediately ends that attempt. PacoGO records the attempt as ended/incomplete and the request; it is not a failed learner result or incorrect answer. The learner returns to OEFENEN in a separate attempt.
- A help request is distinct from assistance actually delivered.
- TUSSENTOETSEN and TOETSEN are **afnamevormen**, not new skills, developments, evidence targets or mastery rules.
- **PacoGO is the single operational assessor. No second human assessor, coder rounds, adjudication workflow or parallel rating process is part of learner runtime.**

### Corrected learner evidence pipeline

`task definition → administered attempt → immutable raw observation → PacoGO target-specific assessment under a versioned C3 contract → C6 inference/mastery → C7 next action → learner state/history`

The human-coder premise in recent multi-target/C3 documents was incorrectly imported into the learner evidence pipeline. It is withdrawn.

The following distinctions remain valid:
- raw learner response/process is not the same as its assessment;
- one raw observation may relate to multiple separately justified target assessments;
- task target opportunities are not automatically evidence;
- objective correctness alone does not establish mastery, independence or reasoning;
- planned support condition, learner help request and support actually delivered are distinct;
- assessment status and provenance must be versioned and inspectable;
- one learner episode must never be duplicated to inflate evidence counts.

The following are **not** part of the PacoGO learner-runtime architecture or prerequisites:
- human coder IDs or coder rounds;
- independent double-coding;
- coder adjudication;
- inter-rater reliability as a production gate;
- human assessment of each learner observation.

PacoGO's operational C3 assessment rules still require scientific/technical specification: target alignment, response relation, performance, process availability, evidence status, assistance/independence, contradiction, quality (if retained), unknown/insufficient-data behavior and schema/version provenance. This is an assessment-contract question, not a human-coder workflow.

Future Scientific Validation must independently evaluate PacoGO's claims and decisions against suitable independent measures. That research stream is separate from learner assessment and must not silently reintroduce human coders into runtime.

### Impacted artifacts requiring reconciliation

- `PacoGO_Multi_Target_Owner_Architecture_Decisions_v0.1.md` — O1/O4/O7 and O6;
- `PacoGO_Multi_Target_Implementation_Readiness_Matrix_v0.1.md` — G2/G3/G8/G9/G11;
- `PacoGO_Integrated_Multi_Target_Decision_Contract_v0.2.md`;
- `PacoGO_Scope_and_Time_Window_Lifecycle_Contract_v0.1.md`;
- `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md`;
- `PacoGO_C3_Consolidated_Observation_Event_Coding_Contract_Reconciliation_v0.1.md`;
- `PacoGO_C3_Descriptive_Coding_Reliability_Layer_v0.1.md`;
- `PacoGO_C3_Scientific_Measurement_and_Coding_Review_v0.1.md` — WITHDRAWN as an architecture basis;
- `PacoGO_Evidence_Coding_Manual_v0.1.md` and related synthetic coder packet/key.

The owner-confirmed task-support contract is the source for the three learner modes and single-assessor policy. No runtime, registry, schema, database, Supabase or learner-data changes are authorized by this correction. Existing legacy skills remain untouched; B1-L08 remains blocked.

### Verification and next step

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3066 / run ID `42317429411`: GREEN on exact commit `1ef4ac5ea08598e05078e4a186ee92e4290de6a2`; all 19 workflow steps passed.
- These documentation corrections are not yet verified. Full Regression must run on the exact resulting commit before this correction is considered complete.
- Next: reconcile the impacted candidate contracts against this owner-confirmed product policy. Do not implement code or persistence while those contracts remain inconsistent.


## 64. C3 / multi-target document quarantine and correction status — 2026-11-06

Following section 63, the following candidate artifacts have now been explicitly marked as superseded, withdrawn, archived or requiring recasting because they embed a human-coder / adjudication workflow in the learner evidence pipeline:

- `PacoGO_Integrated_Multi_Target_Decision_Contract_v0.2.md`;
- `PacoGO_Scope_and_Time_Window_Lifecycle_Contract_v0.1.md`;
- `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md`;
- `PacoGO_C3_Consolidated_Observation_Event_Coding_Contract_Reconciliation_v0.1.md`;
- `PacoGO_C3_Descriptive_Coding_Reliability_Layer_v0.1.md`;
- `PacoGO_C3_Evidence_Coding_Specification_v0.1.md`;
- `PacoGO_Evidence_Coding_Manual_v0.1.md`;
- `PacoGO_C3_Blinded_Synthetic_Coder_Packet_v0.1.md`;
- `PacoGO_C3_Synthetic_Coder_Adjudication_Key_v0.1.md`.

The owner decision record now describes PacoGO as the single operational assessor and replaces the human-coder stage with PacoGO target-assessment evaluation/recording. The readiness matrix replaces double-coding/reliability gates with operational assessment-rule verification. The C3 scientific review is explicitly withdrawn as an architecture basis.

### What remains valid versus what is quarantined

Retain as candidate measurement distinctions, subject to explicit C3 review:
- raw observation versus assessment;
- task-instance alignment versus learner performance;
- objective performance versus target-specific evidence;
- process availability versus process interpretation;
- planned support condition versus help request versus support actually delivered;
- target-specific independence and contradiction semantics;
- unknown/insufficient/not-assessed states;
- one raw observation may support multiple separately justified target assessments without duplicating the learner episode.

Do not carry forward as learner-runtime architecture:
- human coder identity/provenance;
- independent double-coding;
- coder rounds or adjudication;
- human assessment of learner observations;
- inter-rater reliability as a production readiness gate.

### Current repository state

- Branch: `refactor/professional-v1`.
- Latest documentation commit before this handoff update: `db9cb2f76d23ae4bb20d4dd3f2a8d85a1af99c6c`.
- LIVE `main` remains untouched.
- No runtime, curriculum registry, tests, database schema, SQL/RPC/RLS, Supabase or learner data was changed.
- Full Regression #3066 was GREEN on its exact earlier commit `1ef4ac5ea08598e05078e4a186ee92e4290de6a2`; it does not verify the later correction commits.
- The final corrected document set and this handoff update require Full Regression on the exact resulting commit. No GREEN status is claimed for the latest tree until that run completes.

### Next concrete step

Perform a source-by-source reconciliation of the quarantined candidate artifacts into one coherent PacoGO assessment contract. Resolve the exact C3 dimensions and machine-operational rules without importing human assessors. Preserve the owner-confirmed three learner modes. Only after the contract is internally consistent should G2/G3 be reconsidered. No runtime or persistence implementation is authorized.


## 65. Operational assessment contract consolidated — 2026-11-06

### Contract artifact
- Added `docs/curriculum/PacoGO_Operational_Assessment_Contract_v0.1.md`.
- Commit: `618336f47e5e5035896bbadb397ce37fcd15e504`.
- The contract consolidates the owner-confirmed learner modes, raw observation/target-assessment separation, accepted multi-target logical invariants, branch/snapshot boundaries and the remaining assessment/persistence gates.
- It records the source-by-source disposition of the superseded candidate documents so they are not treated as parallel operational contracts.
- It distinguishes task definition, administered attempt, immutable raw observation, PacoGO target-specific assessment and downstream C6–C9 decisions.
- It records the owner-confirmed OEFENEN / TUSSENTOETS / TOETS interaction policy.
- It preserves the six-part branch identity and the rule that one observation is never duplicated or counted as multiple independent attempts.
- It does not select unresolved C3 vocabulary, an evidence-quality scale, physical schema, persistence model, scope/window policy or learner-facing cross-branch presentation.

### Current-runtime findings consolidated
The source review confirmed:
- task-definition ID and administered attempt ID are currently conflated in `createTaskInstance`;
- `createObservation` retains only the first evidence target in its scalar projection;
- the browser vertical-slice validates skill binding but not the full task/target/claim/development/registry relationship;
- the current browser cycle remains single-target and skill-scoped;
- the Addition controller derives its provisional `quality` value from correctness and supplies fixed relevance/contradiction values, while the prototype converts those fields into evidence;
- the support controller records supported-practice help events, but does not implement the independent-assessment attempt-ending lifecycle;
- current persistence does not implement target fan-out or the full six-part branch model.

These are contract gaps, not permission to patch individual fields or alter C1–C9 meanings. No runtime, tests, registry, catalogue, database, SQL/RPC/RLS, Supabase or learner data changed in this step.

### Verification
- Starting exact HEAD: `123127a3dd034d760d3d90876fde81a0ff8c3c70`.
- Starting Full Regression #3081 / run ID `42318137979`: GREEN on that exact commit.
- Contract commit: `618336f47e5e5035896bbadb397ce37fcd15e504`.
- Full Regression #3082 / run ID `42319143630`: GREEN on that exact contract commit; all workflow jobs and checks completed successfully, including curriculum-engine, architecture, maintained Node, maintained Vitest, browser regression and clean-working-tree verification.
- LIVE `main` remains untouched.

### Next concrete step
Use this consolidated contract as the single operational assessment design basis. Reconcile only the remaining unresolved O5/O6/O9 and G5–G11 decisions that materially affect the first bounded implementation slice. Then select a slice that can be implemented without unsupported target fan-out, guessed assessment semantics or unapproved persistence changes. Keep B1-L08 and multi-target runtime/persistence fan-out blocked until their contracts and explicit authorization are complete.


## 66. G6 implementation attempt rejected and rolled back — 2026-11-06

### What happened
- Commit `6bc486ef432b450b266594d4a237938ecba32414` attempted to separate the stable task-definition ID from a newly generated administered-attempt ID.
- It also changed the observation ID format to `obs:attempt:<uuid>` and changed the Addition controller's event/version handling.
- Full Regression #3091 / run ID `42321042513` FAILED on that exact commit.
- Curriculum engine, architecture, maintained Node and maintained Vitest checks passed. Browser regression failed 5 of 59 tests: A1-T01 and FR2-T02 through FR2-T05. Each failure was an assertion that the decision trace observation ID still contained the stable task ID; the implementation instead returned an attempt-derived ID. Working-tree verification was skipped after the browser failure.

### Root-cause classification
The failed assertion is not permission to change the browser tests to accept an unapproved ID format. G6 was still explicitly OPEN:
- exact task/attempt/observation identity contract;
- event and retry/replay semantics;
- immutable task-definition snapshot and interface identity;
- timestamps and provenance;
- canonical payload/replay semantics.

The operational assessment contract explicitly leaves exact ID format and retry/replay identity unresolved. The implementation selected an ID format and modified controllers before those upstream contracts and the G6/G7 consumer compatibility plan were closed. The browser failure exposed that incomplete contract transition; it is not to be fixed by changing assertions alone.

### Disposition
- The incomplete implementation is rolled back as a whole. The code tree is restored to the pre-attempt baseline `2b59128f0c5464e8c62bfd8b98eb1649c6989b7f`; no browser or unit test is weakened or rewritten.
- No curriculum registry, task catalogue, C1–C9 rule, persistence schema, SQL/RPC/RLS, Supabase or learner data is changed by this rollback.
- The rollback and this handoff correction were committed together as `beec853681cd3892e60bde1731b36c2d7f4809c4`.
- Full Regression #3092 / run ID `42321723716`: **GREEN** on that exact commit; all 19 workflow steps passed, including curriculum engine, architecture, maintained Node, maintained Vitest, browser regression and clean-working-tree verification.
- This subsequent handoff status update is itself a repository change and requires Full Regression on its exact resulting commit.
- LIVE `main` remains untouched.

### Next concrete step
Return to the approved gate sequence in Section 65: reconcile the remaining O5/O6/O9 and G5–G11 decisions that materially affect the first bounded implementation slice. In particular, close G6/G7 with a versioned identity/lifecycle contract and consumer compatibility plan before changing controllers or updating browser expectations. Do not expand B1 coverage, introduce target fan-out or change persistence until the required upstream gates and bounded-slice authorization are complete.

## 67. O5 minimum scope/window policy approved — 2026-11-07

The owner directed PacoGO to use the simplest workable policy now, with the explicit requirement that it remain changeable later. The following **minimum, reversible logical policy** is approved:

- Select scope explicitly from existing curriculum definitions; never infer it from a practice session.
- Configure each time window with an explicit start and end. Do not invent a universal duration or create automatic rolling/session windows.
- Version window definitions. A later policy change creates a new version and never rewrites prior definitions or frozen snapshots.
- Determine membership from event time using a half-open interval: start inclusive, end exclusive.
- Keep event time separate from assessment-availability time. Record the availability cutoff on each evaluation snapshot.
- Keep each snapshot immutable. Newly available or late-arriving information can enter only a new snapshot/evaluation; prior results remain unchanged and inspectable.
- Store canonical timestamps as UTC instants. Learner-facing timezone is presentation configuration only.
- Do not add grace periods, finalization machinery or a universal overlap rule in this minimum policy. Those remain future versioned decisions if needed.
- Operational windows are not scientific measurement waves.

This closes the **core logical portion** of O5 only. Detailed permissions/ownership, overlap presentation and retention/deletion remain open; G1 is not fully closed. This is an architecture decision, not runtime implementation authorization. Existing curriculum definitions, C1–C9 meanings, learner data and Supabase remain unchanged.

### Verification at decision baseline
- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Baseline commit: `241943c1dd0846bcabf26b8a16d15347d73f1fc4`.
- Full Regression #3093 / run ID `42321850470`: GREEN on that exact baseline commit.
- The O5 decision and this handoff update are new repository changes and require Full Regression on their exact resulting commit. No post-change GREEN is claimed here.

### Next concrete step
Apply this minimum policy to the C6–C9 branch/snapshot contract crosswalk (G5) without inventing C3 assessment semantics or physical persistence. Keep O6 and O9 open, and do not implement runtime or Supabase changes before the remaining gates and G12 authorization are satisfied.

## 68. Full Regression #3094 verified; G5 preliminary crosswalk completed — 2026-11-07

### Verification baseline
- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- O5 decision commit: `9fb5c40b07c49ffffcd7b4851fbe772c0134684e`.
- Full Regression #3094 / run ID `42356418882`: **GREEN** on that exact commit; all workflow steps completed successfully, including browser regression and clean-working-tree verification.

### G5 source reconciliation performed
Compared:
- C6 Mastery Decision Protocol v0.1;
- C7 Next-Action Decision Protocol v0.2;
- C8 Student Model / Learning Status Protocol v0.2;
- C9 Vertical Learning Chain Validation Protocol v0.2;
- Operational Assessment Contract v0.1;
- Multi-Target Implementation Readiness Matrix v0.1;
- current C6/C7 runtime findings already recorded in the handoff.

Confirmed:
- C8/C9 proposals explicitly require the six-part branch identity.
- C6/C7 candidate protocols do not yet define a complete shared six-field branch/snapshot envelope.
- Current C6 result storage and C7 adapter remain claim-keyed, so they cannot safely distinguish separate branches sharing a claim.
- The required lineage is one immutable branch snapshot → exact C6 evaluation → exact C7 decision → C8 history item → C9 validation of that same chain.
- C9 validates structural integrity only; it does not validate scientific truth or learning outcomes.
- O5's approved minimum policy can be carried through this envelope without selecting a universal duration or automatic rolling windows.

The readiness matrix now contains a preliminary G5 crosswalk, updated O5 gate status and corrected G5 dependencies. **G5 remains OPEN** because O6 assessment-input semantics and the remaining contract/compatibility details are not resolved. O9 remains open for learner-facing cross-branch presentation.

### Repository change and regression
- Documentation changes: readiness matrix and this handoff only.
- No runtime code, tests, curriculum registry/catalogue, C1–C9 decision meanings, database schema, SQL/RPC/RLS, Supabase or learner data changed.
- The documentation change is based on the verified O5 baseline above. Its own Full Regression must run on the exact resulting commit; no post-change GREEN is claimed yet.

### Next concrete step
Continue G5 by defining the exact C6→C7 branch/snapshot envelope and rejection cases, while keeping C3 target-assessment fields explicitly unresolved under O6. In parallel, continue the read-only G6/G7 identity and consumer inventory. Do not change runtime code until G5–G11 and explicit G12 authorization permit a bounded implementation slice.

## 69. G5 C6→C7 handoff and rejection rules specified — 2026-11-07

### Work completed

The G5 readiness matrix now defines the minimum logical C6→C7 handoff and its rejection behavior in Sections 7.7–7.9.

The handoff requires:
- unchanged six-part branch identity across snapshot, C6 evaluation and C7 decision;
- one exact immutable `decision_snapshot_id`;
- one unique `c6_evaluation_id` linked to that snapshot and branch;
- one of the five existing C6 mastery outcomes, consumed unchanged by C7;
- the seven-gate C6 trace and protocol provenance;
- snapshot scope/window versions, event-time bounds, assessment-availability cutoff, eligible source references and exclusions;
- separate C7 inputs for prerequisite ordering, next-development ordering, explicit candidate actions and action-policy version;
- a C7 decision trace retaining the exact C6 evaluation and snapshot references.

The rejection rules now explicitly cover missing or mismatched branch fields, snapshot/definition/cutoff mismatch, missing or ambiguous evaluation references, invalid C6 outcomes, incomplete gate/protocol provenance, claim-only result selection, late-arriving material outside the frozen cutoff, and missing/invalid C7 ordering or candidate inputs.

A rejected handoff is an integrity/input-availability problem, not a learner failure and not a new mastery outcome. C7 may not reconstruct mastery, select a different/latest C6 result, infer missing identity or ordering, or emit an action outside its explicit candidate set.

### Deliberately unresolved

- O6 still determines the exact C3 target-assessment vocabulary and assessment-version fields. No substitute vocabulary or physical payload schema was invented.
- O9 still governs any learner-facing cross-branch presentation.
- No branch hash, JSON serialization, physical schema, database key or persistence API was selected.
- No runtime, tests, curriculum registry/catalogue, C1–C9 meanings, learner data or Supabase changed.
- G5 remains OPEN: C8/C9 cross-reference reconciliation, full contract examples/test vectors and O6-dependent assessment-input semantics remain to be completed.
- G6/G7 read-only identity and consumer inventories remain open.
- No implementation authorization is implied; G12 remains required.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Before this work, Full Regression #3095 / run ID `42377842782` was verified **GREEN** on exact commit `ca2f7259f35839f7e02bc1c87cbb9f0f405cbf6c`; all 16 job steps completed successfully, including browser regression and clean-working-tree verification.
- Matrix update commit: `c098238e8f6385e7d55fd84908805172de79e85e`.
- Full Regression #3107 / run ID 42380216412: **GREEN** on exact commit f288fd95ae7a3fdb6ebcaaf63ebb6842b71cec21; all workflow steps passed, including browser regression and clean-working-tree verification.
- This verification-status reconciliation is itself a repository change and has its own Full Regression run on the resulting exact commit.
- No runtime or persistence implementation was performed.

### Next concrete step

Reconcile the C6→C7 handoff against the exact C8/C9 snapshot, history and validation references, then complete the G6/G7 read-only identity and consumer inventory. Keep O6-specific assessment fields unresolved until O6 is approved. Do not implement runtime or persistence before G5–G11 and explicit G12 authorization are complete.

## 70. C8/C9 lineage reconciled against C6→C7 handoff — 2026-11-07

### Work completed

The readiness matrix now adds Sections 7.10–7.11, aligning the C8 history item and C9 structural result with the exact C6→C7 handoff.

**C8 history item** must preserve:
- one exact six-part branch identity;
- the immutable snapshot ID;
- the exact C6 evaluation ID and C7 decision ID;
- validated evaluation time and snapshot event-time/availability boundaries;
- unique source-observation references and the target-assessment record/version references admitted by that snapshot;
- the unchanged C6 mastery outcome and C7 action/hold outcome;
- applicable registry, assessment, C6, C7 and C8 version provenance;
- explicit exclusion/correction/supersession references where relevant.

C8 ordering uses validated evaluation time and a stable identity tie-breaker, not caller array order. A new snapshot/evaluation creates a new history item; it does not rewrite an earlier item. One canonical branch history contains one six-part identity. Empty history remains distinguishable from evidence of absence.

**C9 structural validation** is per branch. It verifies identity and registry relationships, snapshot eligibility/cutoff, exact C6→C7 references, C8 history lineage, shared-observation identity, legacy boundaries and negative permissions. Results are traceable by the full six-field identity and report explicit checks and stage-attributed errors. A multi-branch request may report independent per-branch results and shared source references, but cannot pool mastery or next actions.

### Remaining boundaries

- O6 still owns the exact C3 assessment-state vocabulary and assessment-version semantics; these remain unspecified here.
- O9 still blocks any learner-facing cross-branch projection.
- C8/C9 remain design proposals requiring owner review; this reconciliation does not approve their implementation.
- G5 remains OPEN until protocol versions are approved as one coherent set, cross-stage positive/negative/missing/mismatch examples are agreed, and legacy/scalar compatibility is resolved with G6/G7.
- No runtime, tests, registry/catalogue, C1–C9 meanings, learner data, physical schema or Supabase changed.
- No implementation authorization is implied; G12 remains required.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3097 / run ID `42378110545`: **GREEN** on exact commit `1cc2800e5cda710710174acd6eabdc7f640e219e`; all 19 workflow steps completed successfully, including browser regression and clean-working-tree verification.
- Subsequent readiness-matrix commits: `2c305b135d2be38dd9acdc5aa211dc8b7a3a0a69` and `e3c3034866ddb5d46e57597655ff2400c8d234b9`.
- This handoff update is another repository change. Full Regression must run on its exact resulting commit before this documentation block is considered verified. No post-update GREEN is claimed yet.

### Next concrete step

Complete cross-stage positive, negative, missing and mismatch examples plus the legacy/scalar compatibility disposition. Then finish the G6/G7 read-only identity and consumer inventories. Keep O6-specific assessment fields unresolved until O6 is approved. No runtime or persistence work before G5–G11 and explicit G12 authorization are complete.

## 71. Initial G6/G7 runtime source inventory — 2026-11-07

### Verified source findings

An initial read-only inspection of the current branch recorded these findings in readiness matrix Section 8:

1. **Task/attempt identity:** `interaction-contract.js` reuses the stable task ID as `task_instance_id`. Task definition and administered instance are conflated.
2. **Observation identity/cardinality:** observation ID derives from task-instance ID plus timestamp; `task_id` receives the instance ID; only the first evidence target is projected into the scalar observation field.
3. **Browser route:** `browser-vertical-slice.js` checks task-to-skill identity, then delegates to the skill-level `registry.runSkillCycle`. It does not validate the full task/target/claim/development/registry/branch relationship.
4. **C6:** `c6-mastery-decision.js` implements the existing seven gates and five outcomes, but returns `mastery_state_by_claim`; it has no full six-field branch identity, snapshot ID or evaluation ID.
5. **C6→C7:** both `c6-c7-adapter.js` and `c7-from-c6.js` exist as separate claim-keyed adapters. They validate some safety and development fields and pass the two ordering inputs separately, but neither preserves full branch/snapshot/evaluation lineage. Their validation details differ. No canonical adapter is selected.
6. **C7:** the decision result contains candidate action, reason, gate, claim/development and supporting evidence references, but not the exact C6 evaluation, snapshot or six-field branch.
7. **C8:** `c8-c9-adapter.js` normalizes a claim-keyed result and builds a simplified timestamp-based history observation. `c8-student-model.js` uses only learner/claim/development/scope identity and observed-time ordering. It does not preserve the full snapshot/C6/C7 lineage.
8. **C9:** `c9-vertical-validation.js` checks the current four-field identity and a simplified vertical slice. It does not validate registry-version/time-window identity, frozen snapshot eligibility or exact C6→C7→C8 references.
9. **Separate older progress paths:** `prototype.js` and `curriculum-registry.js` execute a skill-centric cycle; `student-evidence-store.js` stores learner/registry/skill entries; `src/services/mastery-service.js` stores lesson/item local streak mastery. These are not equivalent to canonical six-part C6 mastery.

### Test inventory

Existing tests cover C6 gate classification and safety flags; claim-keyed C6→C7 selection and ordering separation; C7 candidate gates; simplified C8 state preservation; and C9 consistency under the four-field prototype identity.

They do not yet cover six-field branch isolation, registry/window mismatch, exact snapshot/evaluation lineage, task/attempt separation, multi-target raw-observation cardinality or cross-consumer compatibility. These are upstream contract gaps; this is not authorization to add tests around an unapproved design.

### G6/G7 status

- G6 remains OPEN: task-definition, attempt, event, observation, retry/replay and provenance identity are not yet reconciled.
- G7 remains OPEN: the duplicate C6→C7 adapters, C8/C9 adapter, skill-centric browser route, evidence store and separate local mastery service need a complete consumer ownership/compatibility disposition.
- This is an initial source inventory, not a claim that every application consumer has been enumerated.
- No runtime, tests, registry/catalogue, database, learner data or Supabase changed. No canonical adapter, migration, backfill or scalar compatibility adapter was selected.

### Verification

- Branch: `refactor/professional-v1`; LIVE `main` was not a target of these changes.
- Full Regression #3100 / run ID `42378236663`: **GREEN** on exact baseline commit `ab7bd9a5b70f123dcfb5fe09c42b982eef8f6eba`; all workflow steps passed, including browser regression and clean-working-tree verification.
- Readiness-matrix inventory commit: `876eb1d4a2b0071915799fdbd1674f7f955c6a03`.
- This handoff update is another repository change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed yet.

### Next concrete step

Continue G7 by enumerating the actual application/page/service consumers of the identified adapters and legacy state paths, then assign each a read/write/derived/legacy disposition. In parallel, complete the cross-stage G5 mismatch examples. Do not select a canonical adapter or change runtime until the upstream contracts, G5–G11 and explicit G12 authorization permit it.

## 72. Focused G7 application consumer map — 2026-11-07

### Consumer findings

The readiness matrix Section 8.3 now records the following inspected paths:

- A1 Number Line, B1 Addition and the five FR2 browser pages call the shared browser vertical-slice runtime, which delegates into the skill-centric curriculum registry. They do not call the C6→C7 or C8→C9 adapters.
- Additional B1/B-family demonstration pages (countertask, prompted-independent, strategy-variation and symbolic-addition) use the same skill-centric browser runtime.
- B1, B2, B3, B4 and B5 learner pages call `app.learnerCurriculum.loadLearningHistory` and `persistLearningCycle`.
- `src/services/learner-curriculum-service.js` reads/writes `student_evidence` and `student_longitudinal_state` and calls `persist_curriculum_learning_cycle`. Its current persistence boundary is learner + registry version + skill, with development/claim/target/task and observation/assessment details; it does not carry the six-part snapshot/evaluation lineage.
- `src/app/bootstrap.js` constructs and exposes `learnerCurriculum` and a separate local `mastery` service.
- Clock demonstrations remain separate interface/controller prototypes.

### Current disposition

- The browser demonstrations are skill-centric prototype consumers, not canonical C6–C9 consumers.
- The B1–B5 learner pages are existing persisted skill-scoped consumers and must retain their behavior until a separately approved compatibility/migration plan exists.
- The existing Supabase RPC is a compatibility boundary. No schema/RPC change is authorized or presumed.
- The local `mastery` service is exposed through bootstrap, but its complete direct call-site inventory remains open.
- This is a focused named-page/service inventory, not yet a complete repository-wide import graph. G7 remains OPEN.
- No existing learner route, old skill or persistence path was deleted, redirected or reinterpreted.

### Verification

- Branch: `refactor/professional-v1`; LIVE `main` was not a target of these changes.
- Full Regression #3102 / run ID `42378520783`: **GREEN** on exact baseline commit `b278a54198bd2f6a5c7eaa78f5e72d8c548acd14`.
- Readiness-matrix consumer-map commit: `c278e880c068c6e410a611b70c9d718045817af0`.
- Handoff consumer-map commit: `3ae2368c7bff9523a422eee5f4edcc3fd777700a`.
- Full Regression #3104 / run ID `42378856627`: **GREEN** on exact commit `3ae2368c7bff9523a422eee5f4edcc3fd777700a`; all workflow steps passed, including browser regression and clean-working-tree verification.
- This status reconciliation is itself a repository change and requires Full Regression on its exact resulting commit. No post-reconciliation GREEN is claimed until that run completes.

### Next concrete step

Finish the repository-wide import/call-site inventory for the local mastery service and remaining learner routes. Then define the legacy/scalar compatibility disposition and complete cross-stage G5 positive/negative/missing/mismatch examples. Do not select or implement a canonical adapter before G5–G11 and explicit G12 authorization.

## 73. G5 cross-stage examples and legacy boundary — 2026-11-07

### Work completed

Readiness matrix Sections 7.12–7.13 now contain symbolic cross-stage examples and a proposed compatibility boundary.

**Cross-stage examples**
- P1 records a complete coherent six-part branch through one frozen snapshot, exact C6 evaluation, exact C7 decision, one C8 history item and one C9 per-branch validation result.
- P2 demonstrates that prerequisite ordering and next-development ordering remain independent; a prerequisite-assessment candidate may remain available when only the next-development ordering is uncertain, if the explicit C7 policy permits it.
- N1–N10 cover branch mismatch, ambiguous claim-keyed results, C6/C7 snapshot mismatch, forbidden advancement from insufficient evidence, merged ordering fields, C8 reference mismatch, legacy identity inference, late-arriving assessments, duplicated raw observations and foreign items in a single-branch history.
- Missing-input cases cover each branch field, snapshot, C6 evaluation/trace, both C7 ordering domains, candidate set/policy version and exact C8/C9 references.

These are symbolic design examples, not executable fixtures. O6-specific assessment vocabulary/version fields remain unresolved.

**Legacy/scalar compatibility boundary**
- Existing claim-keyed, four-field, skill-scoped and lesson/item state remains under its original contract.
- Missing canonical identity/provenance remains explicitly legacy/unknown; it is never inferred from current registry, policy, task metadata, timestamps or claim equality.
- Legacy state cannot overwrite or satisfy canonical branch state.
- Any future adapter must be separately approved, versioned, traceable and non-destructive; no adapter has been selected.
- Existing B1–B5 persistence and the current Supabase RPC remain unchanged.
- The local lesson/item mastery service remains distinct from C6 mastery.

### Remaining limits

- G5 remains OPEN: these examples still require protocol-owner reconciliation, O6 assessment-input decisions, and coherent C6/C7/C8/C9 contract approval.
- G7 remains OPEN: the complete direct/indirect consumer inventory and per-consumer ownership/read/write/derived/legacy disposition are not yet complete.
- The local mastery service is imported and constructed by app bootstrap and exposed on the app object. A scan of all root HTML pages found no direct app.mastery/record/get/save references. Selected lesson runtime modules also showed no references. This is not yet a complete indirect JavaScript import/call graph, so no claim is made that the service is globally unused.
- The existing browser demonstrations and B1–B5 persisted pages remain as inventoried in Section 8.3.
- No runtime, tests, curriculum registry/catalogue, schema, RPC, Supabase or learner data changed.

### Verification

- Branch: refactor/professional-v1; LIVE main untouched.
- Before this work, Full Regression #3105 / run ID 42379189921 was GREEN on exact commit 9c59056c6a3528d15e328617a19a3a1602a8a1d2; all workflow steps passed, including browser regression and clean-working-tree verification.
- Readiness-matrix examples/compatibility commit: b97f5ab118d34e21d52710b667ed6baf09ed6040.
- This handoff update is a separate repository change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.

### Next concrete step

Complete the direct and indirect JavaScript import/call graph for the app-exposed mastery service and all learner curriculum routes. Assign each confirmed consumer an explicit read/write/derived/legacy disposition. Then present the G5 symbolic examples for protocol-owner reconciliation. Do not implement an adapter, migration, runtime branch identity or persistence change before G5–G11 and explicit G12 authorization.


## 74. G7 local mastery and learner-route call graph — 2026-11-07

### Work completed

A read-only static scan covered all 351 JavaScript files under `src/` on baseline commit `06f591ab8c227bdbe2ff1a0d7eb7fb5e0d903fe8`. The direct and indirect local mastery path is now traced:

- `src/app/bootstrap.js` imports `createMasteryService`, constructs one service using the app's localStorage dependency, and exposes it as `app.mastery`.
- The active consumer is `src/features/practice/lesson-practice-runtime.js`. It passes `app.mastery` to `createPracticePresentation`.
- `src/features/lessons/practice-presentation.js` forwards that service to `createPracticeRuntimeEntry`.
- `src/features/lessons/practice-runtime-entry.js` uses the injected service and calls `record(student, lesson.id, item.id, correct)` for a learner response when the session mode is `mastery`.
- `src/services/mastery-service.js` stores a streak and local `mastered` flag in localStorage under learner + lesson + item. Three consecutive correct responses set the local flag. This remains separate from C6 mastery and has no canonical registry/development/claim/scope/window/snapshot/evaluation identity.
- The runtime entry also imports `createMasteryService` and creates a fallback when no service is injected. The Toets and Oefentoets routes share the presentation/runtime entry but set `practiceMode: 'assessment'`, which selects `single-pass`; the mastery-write condition is therefore not entered on those routes.
- The B1–B5 learner pages are direct consumers of `app.learnerCurriculum`: learner listing/profile creation, registry-version lookup, history loading and learning-cycle persistence. The service reads/writes the existing learner/evidence/state tables and uses the existing RPC. Its current identity remains learner + registry version + skill.
- `src/features/wordtrainer/index.js` accepts a generic `recordResult` callback but does not import or call the local mastery service. Its callback wiring is not established by the `src/` scan.
- The `mastery` value returned by the skill-centric browser curriculum cycle is a separate prototype result; it is not the localStorage service and is not canonical six-part C6 mastery.

The readiness matrix Section 8.3–8.4 now records these routes, reads/writes and compatibility boundaries.

### Deliberately unchanged

- No runtime code, tests, curriculum registry/catalogue, learner route, database schema, SQL/RPC/RLS, Supabase or learner data changed.
- No local mastery state was migrated, deleted, renamed or reinterpreted.
- Existing B1–B5 skill-scoped persistence remains unchanged.
- G7 remains OPEN: non-`src/` entrypoints and any external/dynamic callback consumers still need final disposition. This scan does not claim proof about consumers outside the inspected repository paths.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Baseline Full Regression #3108 / run ID `42380365733`: **GREEN** on exact commit `06f591ab8c227bdbe2ff1a0d7eb7fb5e0d903fe8`; all 16 workflow steps passed, including browser regression and clean-working-tree verification.
- Readiness matrix update commit: `d821dcc5a38c19c60435bb8a51dd458c51d17279`.
- Full Regression #3110 / run ID `42393582395`: **GREEN** on exact commit `8f772291b09ffd66f03bc3d6ee9ecbe08ee3f972`; all 16 workflow steps passed, including browser regression and clean-working-tree verification.
- This verification-status reconciliation is itself a repository change and requires Full Regression on its exact resulting commit.
- No runtime or persistence implementation was performed.

### Next concrete step

Complete the remaining non-`src/` import/call-site and callback-wiring disposition for the local mastery service and learner curriculum routes. Then close the remaining G7 inventory gaps without changing legacy runtime or persistence. G5 remains OPEN and no implementation authorization is implied.


## 75. G7 non-`src/` consumer and legacy-callback disposition — 2026-11-07

### Work completed

A read-only scan extended the earlier 351-file `src/` inventory to the root-level HTML entrypoints and the relevant `pacogo-engine` modules.

- A1, B1, FR2 and the additional B1 demonstration pages expose `cycle.mastery` from the older skill-centric prototype cycle. This is not the bootstrap-exposed `app.mastery` service and is not canonical C6 mastery.
- B1–B5 learner pages directly use `app.learnerCurriculum` for learner-profile creation/listing, history reads, registry-version lookup and learning-cycle persistence. Their existing identity remains learner + registry version + skill.
- No additional direct local mastery-service or learner-curriculum-service calls were found in the scanned root HTML entrypoints.
- `prototype.js`, `curriculum-registry.js` and `longitudinal-state.js` form a distinct skill-centric mastery/longitudinal route. `student-evidence-store.js` is a separate in-memory evidence store. None is an alias for the local lesson/item service or the canonical C6–C9 branch history.
- The inspected C6/C7 and C8/C9 adapter modules do not import or call the local `mastery-service`. Their canonical ownership and full downstream consumer disposition remain open under G5/G7.
- `src/features/wordtrainer/index.js` accepts and conditionally invokes a generic `recordResult` callback. No in-repository caller wiring that callback to `app.mastery` or `learnerCurriculum` was found in the `src/` and root HTML scans. Its destination remains UNKNOWN; external or dynamic wiring is not proven absent.

### Compatibility disposition

- Local lesson/item mastery, skill-centric prototype mastery, Supabase learner curriculum history, in-memory student evidence and C6–C9 decision/history remain separate systems.
- No direct non-`src/` local mastery-service consumer was identified in the scanned HTML entrypoints.
- No legacy callback destination is inferred.
- G7 remains OPEN: remaining adapter/history/report/export consumers and external/dynamic callback wiring still require explicit disposition. G5 and G6 remain open; no implementation authorization follows from this inventory.

### Deliberately unchanged

No runtime code, tests, curriculum registry/catalogue, database schema, SQL/RPC/RLS, Supabase, learner data or local mastery state was changed.

### Verification and repository state

- Branch: `refactor/professional-v1`; HEAD before documentation update: `38114915242a450e858e8f8973b4c577c49cd242`; LIVE `main` untouched.
- Full Regression #3111 / run ID `42393751796`: **GREEN** on exact commit `38114915242a450e858e8f8973b4c577c49cd242`. All 16 workflow steps completed successfully, including curriculum engine regression, architecture boundary tests, Node/Vitest regressions, browser regression and clean-working-tree verification.
- This inventory update is documentation-only and requires its own Full Regression on the exact resulting commit. No post-update GREEN is claimed until that run completes.

### Next concrete step

Complete the remaining explicit consumer disposition for the adapter/history/report/export paths and unresolved external/dynamic callback boundary. Keep runtime and persistence unchanged. G5–G7 remain open; no implementation is authorized.

## 76. G7 adapter, history, report and export disposition — 2026-11-07

### Work completed

A focused read-only inspection extended the G7 map across the C6/C7/C8/C9 adapters, prototype registry/history, evidence store, pilot analysis/export utilities and the ordinary test-history route. The readiness matrix Section 8.6 records the consumer-by-consumer findings.

- `c6-c7-adapter.js` is directly imported by its test. `c7-from-c6.js` is imported by its own test and the C6–C7/C8–C9 vertical-slice tests. Neither was identified as a learner-page/application-runtime import in the inspected paths. Their duplicate/canonical ownership remains unresolved.
- `c8-c9-adapter.js` is used by its adapter and vertical-slice tests to build a simplified C8 history observation and C9 structural validation input. It is not the identified persisted learner-history route and does not carry full branch/snapshot/evaluation lineage.
- `curriculum-registry.js` calls the skill-centric `prototype.js` cycle and `longitudinal-state.js`. The A1/B1/FR2 and B-family demonstration pages use this separate prototype result; it is not the local lesson/item service or canonical C6–C9 history.
- `student-evidence-store.js` is an in-memory learner/registry-version/skill store. No active learner-page consumer was identified in the inspected paths.
- `pilot-analysis-report.js` is called by `empirical-pilot-analysis-pipeline.js` to produce a descriptive-only research report. The identified direct pipeline invocation is its test; no learner-facing route was identified in the inspected application paths.
- `empirical-pilot-execution.js` and `pilot-execution-package.js` create validated research execution snapshots/packages/exports. Their identified direct invocations are tests; they are not learner-runtime persistence paths.
- `src/services/test-history-service.js` and `src/features/test-history/*` read and display ordinary `test_attempts` and answers. This is separate from curriculum evidence, C8 longitudinal history and C6 mastery.
- External/deployment-side and runtime-generated consumers cannot be ruled out by repository inspection. The Wordtrainer `recordResult` callback destination remains unknown; no destination is inferred or approved.

### Current disposition

The known in-repository routes are now separated into:
1. local lesson/item mastery writes through the practice runtime;
2. Supabase skill-scoped learner curriculum reads/writes on B1–B5 pages;
3. skill-centric prototype cycle/history;
4. in-memory evidence storage;
5. C6–C9 adapter/validation test paths;
6. research-only report and execution/export utilities;
7. separate ordinary test-attempt history reads.

G7 remains OPEN because external/dynamic callback wiring is still unknown and the repository scan cannot prove absence of consumers outside the inspected source/deployment boundary. G5 and G6 remain OPEN. No canonical adapter, migration, schema change, Supabase work or runtime write path is authorized.

### Deliberately unchanged

No runtime code, tests, curriculum registry/catalogue, database schema, SQL/RPC/RLS, Supabase, learner data or local mastery state changed.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Before these documentation updates, Full Regression #3113 / run ID `42398239637`: **GREEN** on exact commit `6408380ee065296b6ed30026753e694a519d5de2`; all 16 workflow steps completed successfully, including browser regression and clean-working-tree verification.
- Readiness matrix update commit: `8b245160ae29c352d913e39775a82e19c495cf21`.
- This handoff update is another documentation-only repository change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.

### Next concrete step

Perform a final bounded check of the remaining application import/callback boundary and deployment configuration for externally supplied or dynamically loaded consumers. If that boundary cannot be evidenced from the repository, retain it explicitly as UNKNOWN and keep G7 open rather than infer absence. Then reconcile the G5 cross-stage examples and G6 identity contracts; do not implement adapters or persistence changes before G5–G11 and explicit G12 authorization are complete.

## 77. Final bounded G7 application-route check and verified status — 2026-11-07

### Final application-route check

A final read-only check of `src/app/routes.js`, `src/app/bootstrap.js`, `src/app/runtime.js`, `src/features/wordtrainer/index.js` and the application package scripts confirms:

- The application route registry statically imports and registers its known feature runtimes; no Wordtrainer route is registered there.
- Wordtrainer accepts an optional `recordResult` callback and invokes it only when supplied. The checked bootstrap/route/runtime path does not supply or wire that callback to `app.mastery` or `app.learnerCurriculum`.
- The callback destination therefore remains UNKNOWN. This does not prove absence of external scripts, deployment-side injection or integrations outside the checked source.
- No new runtime route, import, callback, persistence or external integration was added.

### G7 status

The in-repository consumer map is now substantially complete for the inspected source surfaces and is recorded in readiness matrix Sections 8.3–8.6. The distinct ownership paths are:
- local lesson/item mastery writes via the practice runtime;
- Supabase skill-scoped learner curriculum reads/writes via B1–B5 learner pages;
- skill-centric browser prototype cycle/history;
- in-memory evidence store;
- C6/C7/C8/C9 adapter and vertical-slice test paths;
- research-only analysis/report and execution/export utilities;
- separate ordinary test-attempt history reads.

G7 remains OPEN because the external/dynamic callback boundary cannot be established from the repository. Do not infer absence, select a callback destination or migrate any of these paths.

### G5 contract cross-check — current verified interpretation

The existing C7 v0.2 decision protocol and executable C7 logic agree on the key ordering separation: prerequisite assessment is gated by prerequisite ordering only; next-development actions are gated by next-development ordering only. The existing P2 example is consistent with that behavior when the explicit action policy authorizes prerequisite assessment.

The remaining G5 gaps are not resolved:
- C6 v0.1 remains a candidate protocol and the executable result remains claim-keyed; it does not yet carry the approved six-part branch, immutable snapshot ID or evaluation ID.
- C7 v0.2 remains a candidate protocol. The executable adapter passes a claim-selected mastery result and ordering fields, but not the complete six-part identity or exact snapshot/evaluation lineage.
- C8/C9 v0.2 define the proposed six-part branch and exact snapshot/C6/C7 history references, while the current executable C8/C9 path still uses the narrower four-field identity and simplified timestamp/evidence-count projection.
- O6 remains open; target-assessment input semantics and version provenance are not approved. C8/C9 v0.2 also remain owner-review proposals, not implementation authorization.

G5 and G6 remain OPEN. No runtime implementation is authorized.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3113 / run ID `42398239637`: **GREEN** on `6408380ee065296b6ed30026753e694a519d5de2`.
- Readiness matrix consumer disposition commit: `8b245160ae29c352d913e39775a82e19c495cf21`.
- G7 handoff update commit: `f26ae161866eacb7bb928cf24a305b2933915ec7`.
- Full Regression #3115 / run ID `42400366410`: **GREEN** on exact commit `f26ae161866eacb7bb928cf24a305b2933915ec7`; all 16 workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification.
- This handoff update is another documentation-only repository change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.

### Next concrete step

Continue G5 with a bounded contract crosswalk: map each field and reference in the proposed six-part snapshot/C6/C7/C8/C9 envelope to the current protocol and executable shape, classify each mismatch as missing, differently named, or semantically unresolved, and keep O6 explicitly unresolved. Do not implement or change tests to bless the candidate envelope. Then reconcile G6 task-definition/task-instance/attempt/observation identity. No runtime or persistence work before G5–G11 and explicit G12 authorization are complete.

## 78. G5 executable six-part envelope crosswalk — 2026-11-07

### Work completed

A read-only crosswalk now compares the current C6–C9 executable modules with the proposed C7 v0.2, C8 v0.2 and C9 v0.2 contracts. The full field-by-field matrix is in readiness matrix Section 8.7.

Confirmed mismatches:
- `learner_key` and registry-version identity are missing from current C6/C7; current C8/C9 use `learner_id` and omit registry-version identity.
- `claim_id` is present throughout but C6's claim-keyed result map is not a unique branch identity.
- `development_id` exists with differing C7 naming (`current_development_id`); `scope_id` is omitted at the C7 handoff; `time_window_id` is carried by C6 but not propagated through C7/C8/C9.
- Current executable C6/C7/C8/C9 has no immutable decision snapshot ID, stable C6 evaluation ID or stable C7 decision ID.
- Current C8 history uses a four-field parent and derives an observation ID from the timestamp; it does not reference the exact snapshot, C6 evaluation and C7 decision required by C8 v0.2.
- Current C8 derives evidence state from whether C6 evidence_count is greater than zero. This is not an approved C3/O6 evidence-sufficiency rule.
- Current C9 validates the narrower four-field prototype identity and basic vertical links; it does not validate the proposed six-field branch, snapshot eligibility or exact C6→C7→C8 lineage.

The positive C7 ordering separation is internally consistent: prerequisite assessment depends on prerequisite ordering; next-development actions depend on next-development ordering. The existing P2 example matches the executable logic when the explicit policy authorizes prerequisite assessment.

### Interpretation and gates

- C6 v0.1 remains a candidate protocol; the executable output does not yet implement the O8 snapshot envelope.
- C7 v0.2 remains a candidate protocol; the current adapters do not preserve the proposed six-field branch/snapshot/evaluation lineage.
- C8/C9 v0.2 remain owner-review proposals and are not implementation authorization.
- O6 remains open. Target-assessment states, coding semantics and version provenance cannot be finalized from the current count-based shortcut.
- G5 remains OPEN; G6 remains OPEN because task/attempt/observation identity still needs a reconciled lifecycle contract; G7 remains OPEN for the external/dynamic consumer boundary.

No runtime, tests, registry, database schema, SQL/RPC/RLS, Supabase or learner data changed. No implementation was started.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3115 / run ID `42400366410`: **GREEN** on exact commit `f26ae161866eacb7bb928cf24a305b2933915ec7`.
- Final bounded G7 handoff commit: `f0537cc36eb30fee05404feea1302a7a6bd74351`; Full Regression #3116 / run ID `42400511399`: **GREEN** on that exact commit.
- G5 crosswalk readiness-matrix commit: `e6cbf8cf4b82f2a4d42cfd213e304165ad58c92b`.
- Full Regression #3117 / run ID `42400596188` is running on exact commit `e6cbf8cf4b82f2a4d42cfd213e304165ad58c92b`; no GREEN is claimed yet.
- This handoff update is another documentation-only change and requires Full Regression on its exact resulting commit.

### Next concrete step

After the current documentation regression is green, continue G5 by reconciling the C6 output contract with the O8 six-part snapshot envelope and the still-open O6 target-assessment semantics. Keep candidate protocol fields distinct from approved fields. Then reconcile G6 identity/lifecycle for task definition, task instance, attempt, event and raw observation. No runtime or persistence work before G5–G11 and explicit G12 authorization are complete.

## 79. G6 task/attempt/observation identity crosswalk — 2026-11-07

### Work completed

A read-only crosswalk of `interaction-contract.js`, browser runtime/controllers, the pilot execution path, the learner-curriculum persistence service, the existing evidence migration and the C2/C3/multi-target candidate contracts is recorded in readiness matrix Section 8.8.

Confirmed current gaps:
- `createTaskInstance` assigns the stable task ID directly to `task_instance_id`; task definition and administered instance are conflated.
- `createObservation` then stores that instance ID in `task_id`, so the original definition ID is not preserved as a distinct field there.
- The task-definition version is hardcoded as `0.1` in the current controllers.
- No separate `task_attempt_id` is generated. Controllers record `attempts: 1` and prevent repeat submission.
- Event IDs and observation IDs are timestamp-composed; no complete stable event/idempotency/attempt hierarchy is established.
- The task instance carries an evidence-target array, but the observation projects only its first target into scalar `evidence_target_id`.
- The browser vertical-slice runtime validates skill equality only, not full task/instance/target/registry lineage.
- The pilot execution path distinguishes `task_id` and `task_instance_id`, but has no explicit `task_attempt_id`; it is a separate research execution model, not an approved runtime contract.
- The current Supabase evidence row has scalar task-instance and target fields. The service maps `observation.task_id` into `task_instance_id`; the complete observation is also preserved in JSONB. This is a persistence compatibility boundary for later G8 review, not authorization for a schema change.

### Contract interpretation

C2 defines task-instance, interaction/observation, evidence assessment, inference and decision as separate layers. C3's candidate reconciliation defines a raw response episode containing ordered attempts/events and treats a separately started supported episode as distinct. The multi-target task/evidence proposal uses `task_attempt_id` for one learner interaction episode and links multiple target evidence items to that same attempt.

These documents do not yet establish one approved, unambiguous hierarchy between task definition, administered task instance, task attempt/response episode, interaction event and raw observation. That relationship must be explicitly reconciled; no identity format or retry/support lifecycle is selected here.

### Current gate status

- G5 OPEN: current C6–C9 executable lineage does not match the proposed six-part snapshot envelope; O6 remains open.
- G6 OPEN: task definition, instance, attempt, event and observation identities/lifecycle are not reconciled.
- G7 OPEN: known in-repository consumers are classified; external/dynamic callback boundary remains UNKNOWN.
- No runtime, tests, registry, Supabase, schema, SQL/RPC/RLS or learner data changed.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3118 / run ID `42400675363`: **GREEN** on exact commit `8984ecac04351ee32e8fac8e3eedad46ffb7eef4`; all 16 workflow steps passed, including browser regression and clean-working-tree verification.
- G6 readiness-matrix update commit: `c5af70a6afe9880e5e240c4206d53f988931ed70`.
- This handoff update is another documentation-only change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.

### Next concrete step

Reconcile the candidate C2/C3/multi-target definitions into an explicit identity/lifecycle decision table: what creates a task instance, what creates a new response attempt/episode, which events belong to it, when a new immutable observation is created, and how independent-to-supported transitions are represented. Preserve the unresolved product/protocol decisions rather than inventing retry rules. Then map the resulting logical contract to existing C6/C7/C8/C9 provenance and only later to G8 persistence. No implementation before G5–G11 and explicit G12 authorization are complete.

## 80. G6 candidate identity hierarchy and lifecycle questions — 2026-11-07

### Work completed

Readiness matrix Section 8.9 now consolidates the candidate identity layers from C2, C3 and the multi-target task/evidence contract:

`task definition/version → task model → administered task instance → response episode/task attempt → ordered interaction events → immutable raw observation → zero or more target-specific assessments → inference/decision`

This is a candidate reconciliation structure only. It is not an approved runtime contract.

The main unresolved semantic conflict is explicit:
- C3 describes one task-instance response episode containing ordered attempts/events and requires a separate supported episode after an independent episode.
- The multi-target contract uses `task_attempt_id` for one learner interaction episode.
- C2 identifies a task instance but does not settle the task-attempt identity/cardinality.

The identity/lifecycle decision table therefore leaves these questions open:
1. whether `task_attempt_id` identifies the whole response episode or an individual attempt inside it;
2. whether an ordinary retry remains an event/attempt inside the same episode or starts a new episode;
3. whether an independent-to-supported transition reuses the task instance or creates a new one;
4. what marks completion, abandonment, timeout, interruption and resume;
5. whether one raw observation is exactly one response episode and which stable source-event key makes replay idempotent;
6. how multiple target assessments link to one observation without duplicating raw evidence or inflating independent-observation counts.

No retry, support, timeout or resume behavior has been selected. D9 support-condition/attempt-boundary decisions remain open.

### Current gate status

- G5 OPEN: six-part branch/snapshot/evaluation lineage is absent from the current executable C6–C9 envelope; O6 remains open.
- G6 OPEN: task definition, task instance, attempt/episode, event and raw-observation identities and lifecycle are not yet reconciled.
- G7 OPEN: known repository consumers are classified; external/dynamic callback destination remains UNKNOWN.
- No runtime, tests, registry, Supabase, schema, SQL/RPC/RLS or learner data changed.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3120 / run ID `42401075527`: **GREEN** on exact commit `a133548ec618f222aeef4e868d2422a936434767`; all 16 workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification.
- G6 identity crosswalk commit: `c5af70a6afe9880e5e240c4206d53f988931ed70`.
- G6 candidate identity hierarchy commit: `ac4b262cfde37e22353c32e7cbedbf1dd36442f0`.
- This handoff update is another documentation-only change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.

### Next concrete step

Reconcile the six lifecycle questions above against the C3 D9 decision and the multi-target task/evidence contract, without inventing retry or support semantics. Record which points are already determined by the source contracts and which require an explicit owner decision. In parallel, keep O6 unresolved until the target-assessment contract is approved. No runtime or persistence work before G5–G11 and explicit G12 authorization are complete.

## 81. G6 lifecycle reconciliation — 2026-11-07

### Work completed

Readiness matrix Section 8.10 now reconciles the candidate identity hierarchy against:
- C3 v0.2 raw observation and response-episode definitions;
- the multi-target task/evidence contract;
- the owner-confirmed Oefenen / Tussentoets / Toets support policy;
- approved logical decisions O1 (one immutable raw observation with zero or more target-specific assessments) and O7 (separate idempotency boundaries).

### Determined contract meaning

- A task definition is reusable and versioned; a task instance is one concrete administration/presentation and records what was actually presented.
- `task_attempt_id` should identify the complete response episode, not an individual click/edit/retry. This aligns the multi-target contract's explicit definition with C3's response-episode observation unit.
- A retry is not automatically a new observation. Clicks, edits and retries remain ordered within the response episode unless a defined lifecycle transition starts a separately administered episode.
- A content-help request during Tussentoets/Toets ends the independent attempt immediately. It is recorded as ended/incomplete, not learner failure or incorrect performance. The request and any delivered support are distinct events.
- The subsequent supported-practice continuation is a separate attempt/response episode and raw observation; it must not be merged with the ended independent attempt.
- One separately administered response episode produces one immutable raw observation. That observation may have zero, one or multiple target-specific assessments. Each target assessment links to exactly one observation and one target, with claim/development resolved from the registry.
- O7 establishes the idempotency rule: same identity + same canonical immutable payload is a replay; same identity + different payload is an integrity conflict. Raw observation, assessment and decision are separate idempotency boundaries.

### Remaining explicit decisions

- Whether the independent-to-supported transition always creates a new task-instance ID. Recommended default for review: yes, because the administered support condition/presentation changes; the source decision requires a separate attempt/observation but does not explicitly settle task-instance reuse.
- Generic practice abandonment, interruption, timeout, resume and restart boundaries.
- Canonical event ID, event sequence/order, source-event idempotency key and opaque ID generation/collision semantics.
- Neutral interface clarification versus target-relevant content help operational anchors.
- Final target-assessment vocabulary, rules and version provenance under O6.

No retry, timeout or resume behavior was invented. No runtime, tests, registry, schema, SQL/RPC/RLS, Supabase or learner data changed.

### Gate status

- G5 OPEN: six-part branch/snapshot/evaluation lineage and O6 dependencies remain unresolved.
- G6 OPEN: core response-episode and observation cardinality are reconciled; the remaining lifecycle/identity decisions above still require contract resolution.
- G7 OPEN: in-repository consumer inventory is classified; external/dynamic callback destination remains UNKNOWN.

### Verification and repository state

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3122 / run ID `42401383327`: **GREEN** on exact commit `a1e8e78e809be5ec7988064f9c4e85a36b6a3520`; all workflow steps passed, including browser regression and clean-working-tree verification.
- G6 lifecycle readiness-matrix commit: `6a9ce01ebd18e8eeeed44a9db2afbac01ab828a6`.
- This handoff update is another documentation-only repository change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.

### Next concrete step

Resolve the narrow remaining G6 lifecycle points against the owner-confirmed product policy: task-instance identity when support condition changes; generic interruption/resume/restart boundaries; event ordering and idempotency identity. Keep recommended defaults separate from approved decisions. In parallel, O6 must be completed before final target-assessment semantics or implementation. No runtime or persistence work before G5–G11 and explicit G12 authorization are complete.


## 82. G6 task / attempt / observation lifecycle proposal — 2026-11-07

### Verification before this documentation block

The previously pending Full Regression runs have completed:
- Full Regression #3123 / run ID `42401897036`: **GREEN** on exact commit `6a9ce01ebd18e8eeeed44a9db2afbac01ab828a6`; all 16 workflow steps passed.
- Full Regression #3124 / run ID `42401913249`: **GREEN** on exact commit `79b1e952a5062c3abd2d8c88c1325a135037a10d`; all 16 workflow steps passed, including browser regression and clean-working-tree verification.

### Work completed

Created `docs/curriculum/PacoGO_Task_Observation_Identity_Lifecycle_Proposal_v0.1.md` and recorded its disposition in readiness matrix Section 8.11.

The proposal makes the candidate identity chain explicit:

`versioned task definition → task model → administered task instance → response episode (task_attempt_id) → ordered events/internal retries → one immutable raw observation → zero or more target-specific assessments`

It gives concrete proposed lifecycle rules:
- Ordinary clicks, edits and retries remain events inside the same response episode.
- A change in support condition should create a new task instance, response episode and observation. This is the recommended default because the actual administration/presentation changes; explicit owner approval is still required.
- A temporary interruption may resume the same episode only when the exact task presentation and support condition can be restored. A reissued or materially changed presentation starts a new administration.
- A timeout is terminal only if an explicit, versioned task/session policy says so; no universal timeout is inferred from elapsed time.
- Explicit restart after completion/abandonment creates a new task instance and episode.
- Event order uses a per-episode monotonic sequence; timestamps are separate. O7 same-identity/same-payload replay and same-identity/different-payload conflict rules apply.
- Incomplete/no-response episodes are preserved without inventing an O6 assessment label.

### Gate status and limits

- G6 is materially narrowed but remains OPEN. Its final contract must be reconciled with the approved C3/O6 model because the readiness matrix explicitly makes G6 dependent on G2.
- O6 target-assessment vocabulary, operational status labels, assessment rules and assessment-version provenance remain open under G2.
- G5 and G7 remain OPEN; G8–G12 remain unclosed. No implementation is authorized.
- No runtime, tests, registry, catalogue, database, SQL/RPC/RLS, Supabase or learner data changed.

### Repository and verification

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Lifecycle proposal commit: `bca0e1cd29776f621cc3b96b44c06135558ba3f5`.
- Readiness matrix update commit: `8eb3adafd374d7ab27e4c0093509cddb4d94acef`.
- This handoff update is a further documentation-only repository change. Full Regression must run on the exact resulting handoff commit; no post-update GREEN is claimed until that run completes.

### Next concrete step

Do not reopen the already reconciled identity questions. Continue with the next readiness blocker: complete the G2/O6 operational C3 assessment contract, preserving PacoGO as the single operational assessor and keeping target-assessment semantics separate from raw observations. Once O6 is approved, reconcile the G6 lifecycle proposal against it and close G6 only if its acceptance criteria are met. No runtime or persistence work before G0–G11 and explicit G12 authorization.


## 83. O6 operational assessment contract proposal — 2026-11-07

### Verification of the preceding G6 documentation phase

Full Regression #3127 / run ID `42402964108`: **GREEN** on exact handoff commit `ab5c3d734a8ee827bdaffcdd7fb484947bb66528`; all 19 workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification. The preceding proposal and matrix commits also passed #3125 and #3126.

### Source review and work completed

Reviewed the current operational assessment contract, C3 v0.2 proposal, historical C3 specification/manual, observation/event reconciliation, task-support addendum, owner architecture decisions and both candidate observation schemas.

Created `docs/curriculum/PacoGO_Operational_Assessment_Contract_v0.2.md` and recorded it in readiness matrix Section 8.12.

The proposal recasts O6 around PacoGO's single operational assessment path. It does not carry forward historical human-coding workflow assumptions. It separates:
- actual task-instance alignment;
- response-to-target relation;
- objective task performance;
- per-stream process/capture availability;
- target-specific evidence status;
- planned support, help request, delivered support and target-specific independence;
- target-specific contradiction with evidence reference/rationale;
- a structured quality profile for C6 M2 instead of an unsupported generic numeric quality score;
- alternative contextual facts from later claim-specific explanation;
- assessment rule/engine/registry provenance from immutable raw observations.

The proposal supplies candidate categories and explicit operational definitions, including:
- `PRESENT` / `ABSENT` / `INDETERMINATE` / `NOT_ASSESSED` / `NOT_APPLICABLE` evidence states;
- no-response is preserved as an observed event and defaults to INDETERMINATE, not ABSENT;
- independence is target-specific and based on actual delivered support; a request alone is not delivery;
- missing/incomplete event capture cannot produce INDEPENDENT;
- contradiction is not an incorrect answer, missingness, task mismatch or help request;
- no generic quality score or averaging; structured capture/scoring/interpretability inputs are proposed for the existing M2 gate without changing its meaning.

Synthetic cases are included as future rule-test vectors only; they are not learner evidence or scientific validation.

### Gate status and limits

- G2/O6 remains OPEN pending explicit approval of categories, anchors, the M2 profile, no-response exceptions and target-specific rules.
- G3 remains OPEN; operational rules and test vectors follow approved O6.
- G5 remains OPEN; the C3 output-to-C6/C7/C8/C9 handoff still requires reconciliation.
- G6 remains OPEN pending reconciliation of the lifecycle proposal with the approved O6 contract.
- G7 remains OPEN; G8–G12 remain unclosed. No implementation is authorized.
- No runtime, tests, registry, catalogue, database, SQL/RPC/RLS, Supabase or learner data changed.

### Repository and verification

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- O6 contract proposal commit: `3eefe762dd193152711cb2bb8f975e91da0cdefa`.
- Readiness matrix update commit: `9f865e96036532bea50f7a9a714aaba353bc4c47`.
- This handoff update is a further documentation-only repository change and requires Full Regression on its exact resulting commit. No post-update GREEN is claimed until that run completes.

### Next concrete step

Review the O6 proposal against the current curriculum and task contracts, then resolve any category/anchor conflicts before creating the versioned canonical C3 contract. In particular, verify that `PROMPTED` versus `DEPENDENT` is target-specific and behaviorally distinguishable; that `ABSENT` requires an adequate aligned opportunity and sufficient capture; and that the structured M2 profile preserves C6's existing gate meaning. Do not implement or change C6–C9 until the O6 contract is approved and G5 is reconciled. No runtime or persistence work before G0–G11 and explicit G12 authorization.


## 84. O6 operational assessment reconciliation review — 2026-11-07

### Verification baseline

Full Regression #3130 / run ID `42403229733`: **GREEN** on exact prior commit `492c965a4230ab9c11f2d6b9625d3c886a7cf6b4`; all 19 workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification.

### Work completed

Created `docs/curriculum/PacoGO_O6_Operational_Assessment_Reconciliation_Review_v0.1.md` to critically reconcile O6 proposal v0.2 against O1–O4/O7–O8, C1–C6, owner-confirmed task-support policy, O5 and the G5/G6 boundaries.

The review confirms the overall separation of measurement dimensions but identifies ambiguities that must be resolved before O6 approval:
- applicability, assessment execution and assessment result are currently conflated by `NOT_ASSESSED`;
- `PARTIALLY_ALIGNED` needs explicit target-component semantics;
- response relation `NONE` must not be used for no response;
- `NOT_OBSERVED` versus `NOT_SCORABLE` must distinguish no submitted response from an existing unscorable response;
- `ABSENT` requires an aligned opportunity and sufficient target-relevant capture;
- C3 assistance independence and C6 M5 evidence-set independence are separate constructs;
- `PROMPTED` versus `DEPENDENT` needs a target-specific behavioral rule;
- C3 contradiction is observation-local; C6 M7 is evidence-set-level;
- M2's structured adequacy profile must not duplicate M1 or redefine either existing C6 gate;
- contextual data capture must be pre-specified/minimised and aligned with G10;
- event time and assessment-availability provenance remain aligned with O5.

The readiness matrix now records the review in Section 8.13. All recommendations remain proposals. No owner approval is implied.

### Gate status

- G2/O6: OPEN; category/anchor and logical output approval still required.
- G3: OPEN; deterministic rules/test vectors follow O6 approval.
- G5: OPEN; C3 output and six-part branch/snapshot/C6–C9 handoff not yet finalized.
- G6: OPEN; lifecycle proposal must be reconciled after O6 approval.
- G7: OPEN; external/dynamic consumer boundary remains unknown.
- G8–G12: OPEN; no physical schema, persistence or runtime authorization.
- Scientific Validation remains separate; no empirical validity claim is made.

### Repository and verification

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- O6 reconciliation review commit: `d4068f41dc52ab3a3da64a70403fe8c0246bdb68`.
- This matrix + handoff update is being committed as one coherent documentation commit based on that review.
- Full Regression must run on the exact resulting commit. The #3130 GREEN result above is for the parent commit only and is not a claim about the new handoff commit.

### Next concrete step

Continue with a bounded O6 decision-ready contract: resolve the R1–R13 recommendations against actual A1/B1/FR2 target requirements and existing C6 semantics. Produce concrete domain examples for support boundaries and partial target elicitation, without changing curriculum meanings. Then present the exact remaining owner decisions, rather than reopening settled architecture. No runtime or persistence work before G2/G3/G5–G11 and explicit G12 authorization.


## 85. O6 domain anchor examples and verified regression — 2026-11-07

### Work completed

Created `docs/curriculum/PacoGO_O6_Domain_Anchor_Examples_v0.1.md` after reviewing the existing A1 reference slice, B1 task/evidence contracts and FR2 task/evidence alignment specification against O6 v0.2 and the O6 reconciliation review.

The examples use only existing curriculum meanings. They do not add, rename or remap skills, developments, claims, evidence targets or task models. They are hypothetical rule-test vectors, not learner data, approved codebook anchors or empirical validation.

The examples cover:

- A1 representational meaning, mapping/invariant value and coordination;
- B1 part-whole relation, representation, execution, strategy, checking, robustness and transfer;
- FR2 recognition, superficial-cue discrimination, same-value reasoning, representation change, functional use and contradiction/counterevidence;
- partial target elicitation, mixed responses, unscorable responses, no-response, missing process capture and strict preconditions for ABSENT;
- neutral interface clarification, target cues, supplied operations/reasoning, answer delivery and help requests without delivered support;
- one raw observation with multiple target-specific assessments, without counting those assessments as independent observations;
- the boundaries between C3 target-specific assistance/independence and C6 M5, and between observation-local C3 contradiction and evidence-set-level C6 M7.

The examples explicitly preserve the unresolved B1 ET7 mapping and do not authorize curriculum/task changes.

### Gate status and limits

- G2/O6 remains OPEN. The examples do not constitute approval of categories, labels, anchors, M2 profile, ABSENT rules, support rules or assessment provenance.
- G3 remains OPEN; deterministic operational rules and tests follow O6 approval.
- G5 remains OPEN; the exact C3 output and C6–C9 branch/snapshot lineage still require reconciliation.
- G6 remains OPEN pending final reconciliation of its task/attempt/observation lifecycle with approved O6.
- G7 remains OPEN because the external/dynamic callback boundary remains unknown. G8–G12 remain OPEN; no implementation authorization exists.
- Scientific Validation remains distinct; no empirical validity claim is made.
- No runtime, tests, registry, catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.

### Repository and verification

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Domain-anchor examples commit: `ff07b3e9eb477ebcff44dec16b052c50c0d9d73f`.
- Full Regression #3133 / run ID `42403744862`: **GREEN** on that exact commit. The workflow completed successfully; curriculum engine, architecture boundaries, dependency audit, Node/Vitest, browser regression and clean-working-tree checks passed.
- The readiness matrix and this handoff update are one documentation-only commit. Full Regression must run on that exact resulting commit; the #3133 GREEN result above does not cover the subsequent handoff commit.

### Next concrete step

Produce one compact O6 decision brief that separates (a) what is already determined by accepted architecture/product decisions, (b) the specific recommendations supported by the A1/B1/FR2 examples, and (c) the remaining explicit owner approvals. Do not reopen settled observation cardinality, raw-versus-assessment separation or C3/C6 boundaries. Once the O6 decisions are approved, finalize the canonical versioned C3 contract, then proceed to G3 and reconcile G5/G6. No runtime or persistence work before the applicable readiness gates and explicit G12 authorization.


## 86. O6 decision brief — 2026-11-07

### Verification baseline

Full Regression #3134 / run ID `42404191375`: **GREEN** on exact handoff commit `be3fad09f427dbbf6af6df4c0c54bac317717543`; all workflow steps passed, including curriculum engine, architecture boundaries, dependency audit, Node/Vitest, browser regression and clean-working-tree verification.

### Work completed

Created `docs/curriculum/PacoGO_O6_Decision_Brief_v0.1.md` after reading O6 contract v0.2, reconciliation review R1–R13 and the A1/B1/FR2 domain-anchor examples.

The brief separates:
- already determined architecture/product facts (one immutable raw observation per response episode; zero or more target-specific assessments; exact observation/target reference per assessment; no evidence-count inflation; raw facts, assessment and inference remain separate);
- recommended O6 dimension model and operational vocabularies;
- strict no-response and ABSENT boundaries;
- target-specific support/independence anchors;
- observation-local C3 contradiction versus evidence-set C6 M7;
- structured, non-scored M2 adequacy profile;
- minimal, pre-specified context capture and immutable assessment provenance;
- the exact owner approvals needed to close G2/O6.

The brief is a recommendation package. It does not silently approve any proposal, alter curriculum meanings or authorize implementation.

### Gate status and limits

- G2/O6 remains OPEN pending explicit owner approval of the decision package or specific revisions.
- G3 follows O6 approval and must define deterministic operational-rule cases.
- G5 must reconcile the exact C3 output and provenance with C6–C9.
- G6 must reconcile task/attempt/observation lifecycle with the approved O6 contract.
- G7 remains OPEN because the external/dynamic callback boundary remains unknown. G8–G12 remain open; no implementation authorization exists.
- Scientific Validation remains separate; no empirical validity claim is made.
- No runtime, tests, registry, catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.

### Repository and verification

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Decision brief, readiness matrix Section 8.15 and this handoff Section 86 are committed together.
- Full Regression #3135 / run ID `42418832606`: **GREEN** on exact decision-brief commit `84ecb723ed38654417c76850eebe5446adbfbdd3`; all workflow steps passed, including curriculum engine, architecture boundaries, dependency audit, Node/Vitest, browser regression and clean-working-tree verification. This verifies the decision brief, matrix Section 8.15 and handoff Section 86 as committed in that SHA.

### Next concrete step

Obtain the owner's O6 decision on the compact package. Once approved, freeze the versioned logical C3/O6 contract and proceed to G3, then reconcile G5/G6. If the owner requests revisions, change only the identified decision items and retain all already-settled architecture boundaries. No runtime or persistence work before the applicable gates and explicit G12 authorization.


## 87. G3 candidate operational assessment verification specification — 2026-11-07

### Baseline and owner direction

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3136 / run ID `42418979978`: **GREEN** on exact baseline commit `67ebfdb37b90c4d136b28d22c3d7d1e36bd2cc97`; workflow completed successfully. This is the verified pre-build baseline, not verification of the G3 documents created afterward.
- The owner authorized continued work using O6 Decision Brief v0.1 as the working baseline. Treat this as authorization to develop the G3 candidate specification, not as an irreversible or final freeze of every O6 category/anchor. Do not claim G2 closed.

### Work completed

Created `docs/curriculum/PacoGO_G3_Operational_Assessment_Rule_Verification_Specification_v0.1.md`.

The specification contains 40 deterministic logical vectors covering applicability/execution, alignment/relation, performance and missingness, strict ABSENT conditions, support/independence, Tussentoets/Toets help-request lifecycle, contradiction, multi-target cardinality, provenance/idempotency/reassessment/O5 cutoff, and A1/B1/FR2 anchors. It preserves existing curriculum meanings and explicitly prohibits O6 outputs from deciding mastery or next action.

The specification is design-only. It does not create executable tests or authorize runtime, registry, task catalogue, learner-state, database, SQL/RPC/RLS, Supabase or learner-data changes.

Updated readiness matrix Section 8.16 to record the candidate specification and its gate disposition.

### Gate status

- G2/O6 remains OPEN until the exact versioned operational contract is frozen.
- G3 remains OPEN until G2 is frozen, the vectors are converted into executable contract tests, and Full Regression is GREEN on the exact implementation commit.
- G5 and G6 remain separate dependent gates; no shortcut or automatic closure.
- The specification intentionally leaves unresolved target-specific prompt anchors, required process streams, quality anchors (if retained), final identity/payload semantics, O5 snapshot details and C3-to-C6 M1/M2 mapping to their proper gates.
- No runtime or persistence implementation was performed.

### Repository commits and verification

- G3 specification commit: `321799bb03ce665d6430e241afc667cca7147a29`.
- Readiness matrix Section 8.16 commit: `a90cbc288b72754670bf84d577f9ffe7df86e50d`.
- This handoff update is being committed next. Full Regression must run on the exact resulting handoff commit; #3136 does not cover these subsequent documentation changes.

### Next concrete step

First verify the final handoff commit with Full Regression. Then freeze the exact O6 contract from the owner's working-baseline direction, resolving only the still-open O6 anchors and semantics. After that, convert the G3 vectors into executable contract tests. Do not implement runtime or persistence before the applicable gates and explicit G12 authorization.


## 88. O6 consolidated operational assessment contract v0.3 — 2026-11-07

### Baseline and workflow

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Before this documentation block, Full Regression #3139 / run ID `42420412667` was **GREEN** on exact baseline commit `dd76caeabf25de44417f62d8e29643f951a75b88`, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree checks.
- The O6 v0.3 work below is documentation-only. A new Full Regression is required on the final handoff commit; #3139 does not verify these subsequent changes.

### Work completed

Created `docs/curriculum/PacoGO_Operational_Assessment_Contract_v0.3.md` as the consolidated O6 working contract. It integrates O6 v0.2, Decision Brief v0.1, reconciliation review, A1/B1/FR2 domain anchors, the owner-confirmed support-condition policy and the G3 candidate vectors.

The v0.3 contract specifies:
- one immutable raw observation per response episode; zero or more target-specific assessments per observation;
- strict separation of raw facts, target assessment and downstream inference;
- applicability, rule execution and dimension result as separate layers;
- distinct task alignment, response relation, objective performance, process availability and target evidence dimensions;
- strict preconditions for `ABSENT`; `NO_RESPONSE` → `NOT_OBSERVED` + `INDETERMINATE` by default;
- planned support condition, help request, delivered support and target-specific independence as separate facts;
- Tussentoets/Toets content-help request immediately ends the independent attempt as incomplete; any supported continuation is a separate episode/observation;
- observation-local contradiction and a structured, non-scored M2 adequacy profile;
- immutable assessment history, version provenance and O5 availability-cutoff lineage;
- preservation of existing A1/B1/FR2 target meanings and unresolved B1 ET7 mapping.

Updated readiness matrix Section 8.17 to record v0.3 and its gate disposition.

### Gate status

- G2/O6 remains OPEN until the owner accepts this exact v0.3 as the approved versioned contract and any required governance review is complete. The earlier "i guess" is treated as permission to continue using the decision brief as a working baseline, not silently converted into final approval of every category.
- G3 remains OPEN until G2 is frozen and the 40 candidate vectors are reconciled to v0.3 and converted into executable contract tests.
- G5 and G6 remain separate dependent gates.
- No runtime, executable tests, registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.

### Commits and verification

- G3 candidate specification: `321799bb03ce665d6430e241afc667cca7147a29`.
- O6 v0.3 contract: `e4132f2d7d56af1920ce7b26f0d1750c53185475`.
- Readiness matrix Section 8.17: `bc0b58ed16bf635d8e1a2cdb3d67f1190f4824e4`.
- This handoff update is the final documentation commit in this block. Full Regression must verify the exact resulting commit before any further build step.

### Next concrete step

Verify the exact handoff commit with Full Regression. Then reconcile the G3 candidate vectors against O6 v0.3 and prepare the G2 owner acceptance checkpoint without reopening settled product policy or curriculum mappings. Do not implement runtime or persistence before the applicable gates and explicit G12 authorization.


### Verification update — 2026-11-07

- Full Regression #3142 / run ID `42422816647`: **GREEN** on exact commit `cecc708bcae805eb3a28bb80bb6c7d3f680f77d4`; all workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification. This verified O6 v0.3, readiness matrix Section 8.17 and handoff Section 88 at that commit.
- Readiness matrix regression record added in commit `f10894ce507be339433d85bb7fcd88da89af8f57`.
- This handoff verification update is the next commit; its exact resulting SHA must receive its own Full Regression before the work block is closed.


### Final verification for this documentation block — 2026-11-07

- Full Regression #3144 / run ID `42422960987`: **GREEN** on exact commit `27789c9fd4758ac40b18e73c43493c86cd22856d`; all workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification. This verifies the handoff update and the preceding O6 v0.3/matrix changes.
- This final handoff status update must itself be verified on its resulting commit before the block is considered closed.


## 89. G3 ↔ O6 v0.3 traceability review — 2026-11-07

### Baseline and verification status

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Full Regression #3145 / run ID `42423068970`: **GREEN** on exact prior handoff commit `7a666f22ddf7d6219c1e17417043dc8d6e7b3c05`; all workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree checks.
- The traceability review below is documentation-only and requires a new Full Regression on its final handoff commit.

### Work completed

Created `docs/curriculum/PacoGO_G3_O6_v0.3_Traceability_and_Gap_Review_v0.1.md`.

The review maps all 40 G3 candidate vectors and A1/B1/FR2 domain anchors to O6 v0.3. It classifies direct mappings and explicitly identifies dependencies that must not be guessed:
- exact task/target elicitation and required process streams;
- target-specific PROMPTED/DEPENDENT anchors;
- partial-alignment component definitions;
- G6/G9 assessment identity, replay/conflict and reassessment semantics;
- O5 snapshot/availability cutoff;
- G5 C6 M1/M2 mapping;
- any future separately approved quality construct.

It also proposes the executable G3 suite structure and negative assertions. No executable tests or runtime code were added.

Updated readiness matrix Section 8.18.

### Gate status

- G2/O6 remains OPEN pending owner acceptance of exact `PacoGO_Operational_Assessment_Contract_v0.3.md`. Earlier "i guess" authorizes continuing from the decision brief as a working baseline, not silently final approval of every category.
- G3 vectors are now reconciled to O6 v0.3 at design level. G3 remains OPEN until G2 is frozen and executable contract tests are implemented and verified.
- G5, G6/G9 and O5 dependencies remain separate.
- No runtime, executable tests, registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.

### Commits

- O6 v0.3 contract: `e4132f2d7d56af1920ce7b26f0d1750c53185475`.
- G3 traceability review: `66b5dcba8d6b81b1246d1dbc39d62adfc7db1988`.
- Readiness matrix Section 8.18: `ba6716f24d5c3bd8f7b04e11c9c2a69b4754bda0`.
- This handoff update must receive its own Full Regression on the resulting exact commit.

### Next concrete step

After verifying this documentation block, obtain the owner's acceptance of exact O6 v0.3. Then freeze G2 and convert the reconciled G3 vectors into executable contract tests. Do not implement runtime or persistence before all applicable gates and explicit G12 authorization.


### Final verification for G3/O6 traceability block — 2026-11-07

- Full Regression #3148 / run ID `42423237193`: **GREEN** on exact commit `626b2b823959964e5dd09e53e8a4cd4983ecb664`; the workflow completed successfully, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification. This verifies the G3↔O6 traceability review, readiness matrix Section 8.18 and handoff Section 89.
- This final handoff status update must itself be verified on its resulting commit before the block is considered closed.
