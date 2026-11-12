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


### Verified handoff state — 2026-11-07

- Full Regression #3149 / run ID `42423357578`: **GREEN** on exact commit `65f735dd938132ab56c94d13d48c9acdf49402ae`; all workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, browser regression and clean-working-tree verification. This verified the G3/O6 traceability review, readiness matrix Section 8.18 and handoff Section 89.
- This handoff now records #3149 as the latest verified regression for the completed traceability block. Its present update must receive the next Full Regression on the resulting exact commit.


## 90. G2/O6 v0.3 approved and frozen — 2026-11-07

### Owner decision

The owner approved the exact logical contents of `docs/curriculum/PacoGO_Operational_Assessment_Contract_v0.3.md` by directing continuation after the explicit approval checkpoint. The approval is recorded as acceptance of the versioned logical assessment contract, not authorization to implement runtime or persistence.

- G2/O6: **CLOSED — logical contract v0.3 approved and frozen**.
- G3: OPEN; next step is executable contract-test implementation for the 40 candidate vectors.
- G5, G6/G9 and O5 remain separate dependencies. G3 must not invent missing identity, lineage, snapshot or C6 mapping semantics.
- G12 and all applicable downstream gates remain prerequisites for runtime/persistence work.
- No runtime, learner state, registry, task catalogue, database, SQL/RPC/RLS, Supabase or learner data changed as part of this approval.

### Baseline and next step

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Pre-build Full Regression #3150 / run ID `42423466418`: GREEN on exact baseline commit `9639f8c60b1be39368fd957bcd3a91e4c81c7100`.
- This approval/matrix/handoff documentation change requires Full Regression on its exact final commit before the G3 build begins.
- Next build is limited to deterministic G3 contract tests against frozen O6 v0.3. No learner-facing runtime or persistence changes.


## 91. First executable G3 contract-conformance suite — 2026-11-07

### Work completed

- G2/O6 v0.3 is approved and frozen as the logical assessment contract.
- Added `pacogo-engine/operational-assessment-contract.test.js`, a test-only normalized logical record conformance harness.
- It exercises the direct O6 boundaries represented by G3-001–036, A1/B1/FR2 preservation anchors and the structured non-scored M2 profile.
- G3-037–039 remain blocked on G6/G9 identity and canonical payload semantics. G3-040 remains blocked on O5 snapshot/availability cutoff semantics.
- This test file is not a production assessor: it does not derive judgments from raw learner responses and its fixture representation is not a persisted schema/API.
- No runtime, registry, learner state, task catalogue, database, SQL/RPC/RLS, Supabase or learner data changed.

### Verification

- Pre-build Full Regression #3153 / run ID `42424128734`: **GREEN** on exact baseline commit `f243b6273345ea9d53df5d772ed6adadb0a4a8ef`.
- G3 test commit: `4ae2420753e9a10bcfc094b695d3b42d20792264`.
- Full Regression #3154 / run ID `42424440906`: **GREEN** on that exact test commit. Curriculum-engine regression, architecture boundaries, Node/Vitest, browser regression and clean-working-tree checks passed.
- This handoff/matrix/traceability documentation update requires its own Full Regression on the exact resulting commit.

### Gate status and next step

- G2/O6: **CLOSED** — exact logical contract v0.3 approved and frozen.
- G3: **OPEN** — first conformance suite exists; continue by strengthening vector-level assertions and negative cases. Keep G6/G9 and O5-dependent vectors blocked rather than inventing identity or cutoff semantics.
- G5, G6/G9, O5 and G12 remain separate. No production assessor/runtime/persistence implementation is authorized by this test-only suite.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.


## 92. G3 conformance-suite strengthening and final Full Regression #3159 — 2026-11-07

### Work completed

- Strengthened `pacogo-engine/operational-assessment-contract.test.js` with cross-dimension O6 invariants, independent-attempt policy checks and structured non-scored M2 adequacy-profile checks.
- Added negative cases to reject prohibited shortcuts and incomplete/aggregate M2 profiles.
- Full Regression #3158 / run ID `42424698111` was RED on exact commit `337369086e9e7f189251dcfadae4cf3f480160c5`. Three tests exposed a test fixture factory defect: partial overrides shallow-replaced nested defaults, unintentionally dropping default dimensions.
- Corrected the fixture factory to merge nested `task_instance`, `dimensions`, `criterion`, `support` and `process` defaults. This was a test-fixture construction defect, not a production engine defect. No tests were disabled or weakened.
- Correction commit: `0b1c2ad17daa1ed432cd2c191d570b407b2c6e2f`.

### Full Regression and browser verification

- Full Regression #3159 / run ID `42424761647`: **GREEN** on exact commit `0b1c2ad17daa1ed432cd2c191d570b407b2c6e2f`.
- Browser regression completed successfully in the `agenda-cutover-and-regression` job:
  - Playwright: **59 tests passed**, 0 failed, one worker.
  - Startup diagnostics: `no browser errors observed`.
  - The clean-working-tree check after browser tests passed.
- The same workflow also passed curriculum-engine regression, architecture-boundary tests, Double or Nothing runtime regression, maintained Node regression and maintained Vitest regression.
- This is the latest verified Full Regression at the time of this handoff update. The documentation changes in this section and the accompanying readiness-matrix update must receive their own Full Regression on the exact resulting commit.

### Scope and gate status

- Changes remain limited to the test-only normalized logical-record conformance harness and its fixture construction.
- This harness is not a production assessor; it does not infer judgments from raw learner responses and its fixture representation is not a persisted schema/API.
- No learner-facing runtime, registry, task catalogue, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.
- G2/O6: **CLOSED** — logical contract v0.3 approved and frozen.
- G3: **OPEN** — continue genuine vector-level positive and negative assertions.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 and G12 remain separate dependencies/gates.
- No production assessor, runtime or persistence implementation is authorized by this test-only work.

### Repository state

- Branch: `refactor/professional-v1`.
- LIVE `main`: untouched.
- Last verified code commit: `0b1c2ad17daa1ed432cd2c191d570b407b2c6e2f`.
- Latest Full Regression: #3159 / `42424761647`, GREEN on that exact code commit.
- The documentation update now being committed must itself be regression-verified before the next build step.

### Next concrete step

After verifying this documentation update with Full Regression, continue G3 test coverage vector by vector using the frozen O6 v0.3 contract and the G3 traceability review. For each vector, assert meaningful accepted and rejected/indeterminate cases. Preserve explicit blocks for G5/G6/G9/O5 dependencies. Do not begin production runtime or persistence work without all applicable gates and explicit G12 authorization.



## 93. Duplicate chat handoff cleanup — 2026-11-07

- Removed the redundant file `docs/curriculum/PacoGO_Chat_Handoff_2026-11-07.txt`; the authoritative cross-chat handoff remains this `PacoGO_Curriculum_Handoff_Current.md`.
- Cleanup commit: `f76b2b4d149ac10ea86ff3e276e4883dc4842115`.
- Branch: `refactor/professional-v1`; LIVE `main` was not changed.
- Full Regression #3162 / run ID `42425104869` completed GREEN on parent commit `565d9d62528e5624fba8492f323eba7bd4dfb35e`, not on cleanup commit `f76b2b4d149ac10ea86ff3e276e4883dc4842115`.
- Therefore the cleanup commit itself is not yet regression-verified. Run Full Regression on the exact resulting branch HEAD before any further build step.



## 94. G3-008 partial-alignment conformance strengthening — 2026-11-07

### Work completed
- Reviewed O6 v0.3 §5.1 and the G3↔O6 traceability requirement for G3-008.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js`: `PARTIALLY_ALIGNED` now requires the elicited `component_id` to be included in the target contract's pre-defined `separable_component_ids`.
- The test covers a valid declared component, an undeclared component and a missing component identifier. Negative cases exercise the shared `assertAssessment` conformance assertion rather than test-local simulated failures.
- This remains a test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification
- Pre-build Full Regression #3164 / run ID `42425497446`: GREEN on exact baseline commit `79d0521ba5fb8dce27e7f0af8747e58a66356a84`.
- Test implementation commit: `1f6b41e4c1126ed18eceff623a453424e49f6c99`.
- Full Regression #3165 / run ID `42425645992`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.

### Gate status and next step
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN; continue vector by vector with meaningful positive and negative assertions.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Next: inspect and strengthen the next directly specified G3 vector through the shared conformance assertion. Do not invent unresolved G5/G6/G9/O5 semantics and do not begin production runtime or persistence work without applicable gates and explicit G12 authorization.



## 95. G3-009 response-relation conformance strengthening — 2026-11-07

### Work completed
- Reviewed O6 v0.3 §5.2 and the G3↔O6 traceability requirement for G3-009.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js` so `NONE` is accepted only when a response is explicitly present and inspectable.
- The test now covers a valid present/inspectable response, a `NO_RESPONSE` case rejected as `NONE`, and a present-but-uninspectable response rejected as `NONE`. All negative cases call the shared `assertAssessment` conformance assertion.
- The valid `NONE` example retains target evidence as `INDETERMINATE`; no unsupported `ABSENT` inference is added.
- Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification
- Pre-build Full Regression #3167 / run ID `42425766377`: GREEN on exact baseline commit `5a0aae4efb1fa19ce57bb2aa4266810b3f64c816`.
- Test implementation commit: `d482e8c78188e5e04f9fceeca7e66e110af12cda`.
- Full Regression #3168 / run ID `42425888671`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.

### Gate status and next step
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN; continue vector by vector with meaningful positive and negative assertions.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Next: inspect and strengthen the next directly specified G3 vector through the shared conformance assertion. Do not invent unresolved G5/G6/G9/O5 semantics and do not begin production runtime or persistence work without applicable gates and explicit G12 authorization.



## 96. G3-010 uncertain-response-relation conformance strengthening — 2026-11-07

### Work completed
- Reviewed the exact G3-010 input condition and expected/prohibited outcomes in the G3 verification specification, and O6 v0.3 §5.2.
- Added a test-only fixture condition `relation_basis_sufficient: false`. The shared `assertAssessment` now requires relation `INDETERMINATE` when the fixture states that the relation basis is insufficient.
- G3-010 accepts the indeterminate relation and rejects guessed `DIRECT`, `PARTIAL`, `INDIRECT` and `NONE` results through the shared conformance assertion.
- This fixture condition is not a persisted field, API or new production contract. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification
- Pre-build Full Regression #3170 / run ID `42425981837`: GREEN on exact baseline commit `db2d1abf39e42f2f80869f01f647b299b9a52049`.
- Test implementation commit: `fd0eb7c78b175967a6546c5ad3ef1f87b8aa0fbd`.
- Full Regression #3171 / run ID `42426099815`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.

### Gate status and next step
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN; continue vector by vector with meaningful positive and negative assertions.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Next: inspect and strengthen G3-011 against its exact input condition and prohibited shortcut. Do not invent unresolved G5/G6/G9/O5 semantics and do not begin production runtime or persistence work without applicable gates and explicit G12 authorization.



## 97. G3-011 objective performance/evidence separation — verified

### Work implemented
- Inspected G3-011 in the verification specification and O6 v0.3 §§5.3 and 5.5.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js` with a test-only `objective_scoring_result` fixture value. The shared assertion checks that the performance result preserves that objective scoring-rule result.
- G3-011 now accepts objective `CORRECT` with target evidence `INDETERMINATE` where target evidence cannot be concluded, rejects auto-setting evidence `PRESENT` when the target criterion is not met, and rejects a performance result that disagrees with the fixture's objective scoring result.
- This is a test-only fixture, not a production scoring API, persisted field or learner assessor. No production runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Implementation commit: `ff375c40e7859575d7e3e9307224fba981344b22`.
- Full Regression #3174 / run ID `42426297601`: **GREEN** on exact implementation commit `ff375c40e7859575d7e3e9307224fba981344b22`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 98. G3-012 incorrect-performance/contradiction separation — verified

### Work implemented
- Inspected G3-012 in the verification specification and O6 v0.3 §§5.3 and 5.7.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js`: objective performance `INCORRECT` is tied to the test-only objective scoring-rule result, while target evidence and contradiction remain separate.
- The positive fixture accepts `INCORRECT` with evidence and contradiction both `INDETERMINATE` where those conclusions are not independently established. A negative fixture rejects contradiction `PRESENT` when no specific contradiction source material is supplied.
- This is a test-only normalized logical-record fixture, not a production assessor, persisted field or API. No production runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Implementation commit: `3d2d1baa55f82707935cd384f02adfdbff7099c3`.
- Pre-build Full Regression #3177 / run ID `42426432508`: GREEN on exact baseline commit `16c134c91674eba76b75674af9c89e88df867a3b`.
- Full Regression #3178 / run ID `42426573789`: **GREEN** on exact implementation commit `3d2d1baa55f82707935cd384f02adfdbff7099c3`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 99. G3-013 mixed-performance component provenance — verified

### Work implemented
- Inspected G3-013 in the verification specification and O6 v0.3 §5.3.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js` with a test-only `assertMixedComponentMapping` assertion for the G3-013 fixture. The fixture uses objective `MIXED` and retains separate component identifiers and results for one `CORRECT` and one `INCORRECT` component.
- Negative cases reject a flattened single-component result, duplicate component identifiers and loss of the incorrect component. The assertion is scoped to this G3-013 fixture and does not redefine every task's mixed-scoring scheme.
- This remains a test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Implementation commit: `6107e6b2eb146e8a857714b7d57b59feda6272a2`.
- Pre-build Full Regression #3180 / run ID `42426674545`: GREEN on exact baseline commit `64d47cf4316101b0e3d2968eaa168e5e44c12ce5`.
- Full Regression #3184 / run ID `42426831166`: **GREEN** on correction commit `3684aa7d5a00b0ed937f9d107a2d82bf6e1e71c9`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 100. G3-013 Full Regression #3182 failure isolation and diagnostic correction — 2026-11-07

### Exact failure
- Full Regression #3182 / run ID `42426785582` failed in the `Run curriculum engine regression` step on implementation commit `6107e6b2eb146e8a857714b7d57b59feda6272a2`.
- The complete curriculum-engine test run reported 282 tests: 281 passed, 1 failed.
- The sole failing test was G3-013. Its negative fixture correctly triggered the intended minimum-component assertion, but `assert.throws` expected the diagnostic text to match `/at least 2/` while the assertion's actual message did not contain that phrase.
- This is an assertion-diagnostic mismatch in the test harness, not a production-engine defect and not evidence that the positive mixed-component case failed. The positive case and other negative cases ran before the failing assertion.

### Correction
- Updated only the assertion's diagnostic message to state `MIXED result must retain at least 2 separable component results`, aligning the message with the already-existing condition `component_results.length >= 2`.
- No assertion condition was weakened or removed; no expected result was changed.
- Correction commit: `3684aa7d5a00b0ed937f9d107a2d82bf6e1e71c9`.
- Full Regression #3184 / run ID `42426831166`: **GREEN** on exact correction commit `3684aa7d5a00b0ed937f9d107a2d82bf6e1e71c9`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.



## 101. G3-014 no-response default and prohibited outcomes — verified

### Work implemented
- Inspected G3-014 in the verification specification and O6 v0.3 §§5.2–5.5.
- Expanded `pacogo-engine/operational-assessment-contract.test.js` to assert the valid `NO_RESPONSE` combination: performance `NOT_OBSERVED`, relation `INDETERMINATE` and target evidence `INDETERMINATE`.
- Added negative cases through the shared `assertAssessment` assertion to reject `INCORRECT`, relation `NONE` and evidence `ABSENT` for the same no-response event.
- Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Implementation commit: `c87f8e93e7ce6bad94ff1f6b87ca02805937ca78`.
- Pre-build Full Regression #3186 / run ID `42426951926`: GREEN on exact baseline commit `9f4ba92e4f8dfadccbeaa6e0e09f78b2b051ee25`.
- Full Regression #3188 / run ID `42427054170`: **GREEN** on exact implementation commit `c87f8e93e7ce6bad94ff1f6b87ca02805937ca78`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 102. G3-015 existing but unscorable response — verified

### Work implemented
- Inspected G3-015 in the verification specification and O6 v0.3 §§5.3 and 5.5.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js` with a test-only `scoring_rule_interpretable` fixture condition. When an existing response is present and the approved scoring rule cannot interpret it, the shared `assertAssessment` requires performance `NOT_SCORABLE`.
- The positive case retains target evidence as `INDETERMINATE`; the negative case rejects conversion to `INCORRECT`.
- The fixture condition is test-only, not a persisted field or production scoring API. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Implementation commit: `669be29b0bc31854664fdf1e68b4dff3538199d9`.
- Pre-build Full Regression #3190 / run ID `42427198962`: GREEN on exact baseline commit `9ca59b6e8fb563f3909ee7d4d78801dd1240b1bd`.
- Full Regression #3192 / run ID `42427295240`: **GREEN** on exact implementation commit `669be29b0bc31854664fdf1e68b4dff3538199d9`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 103. G3-016 per-stream process availability — verified

### Work implemented
- Inspected G3-016 in the verification specification and O6 v0.3 §5.4.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js` with a test-only `process_streams` fixture collection and `assertRequiredProcessStreams` assertion. Each required stream has its own identifier and O6 availability value.
- The positive case retains one `AVAILABLE` stream and a separate `NOT_COLLECTED` required stream while target evidence remains `INDETERMINATE`.
- Negative cases reject an aggregate-only capture flag with no per-stream records and reject evidence `ABSENT` while a required stream remains uncollected.
- These are test-only fixture structures, not a persisted schema or production API. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Implementation commit: `f387b72ea179b1d583fd79bab94708df631e115f`.
- Pre-build Full Regression #3195 / run ID `42427406449`: GREEN on exact baseline commit `33ca66ebd95a3148af86b90da34c5a6b614feca1`.
- Full Regression #3196 / run ID `42427522460`: **GREEN** on exact implementation commit `f387b72ea179b1d583fd79bab94708df631e115f`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 104. G3-017 technical capture failure — verified

### Work implemented
- Inspected G3-017 in the verification specification and O6 v0.3 §§5.3–5.5.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js` so a required process stream marked `TECHNICAL_FAILURE` explicitly blocks the affected performance rule.
- The valid case requires performance execution `BLOCKED` with no learner performance result and target evidence `INDETERMINATE`.
- Negative cases reject `INCORRECT` and target evidence `ABSENT` for the same technical capture failure.
- This remains a test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification
- Pre-build Full Regression #3199 / run ID `42427646099`: GREEN on exact baseline commit `ef7da3458c865067646cb739f69139705907c667`.
- Implementation commit: `eefa0c9e5dfe0f954f78c9760665fb32e14ea65b`.
- Full Regression #3200 / run ID `42427783561`: **GREEN** on that exact implementation commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.

### Gate status and next step
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN; continue vector by vector with meaningful positive and negative assertions.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Next: inspect and strengthen G3-018 against its strict preconditions for target evidence `ABSENT`. Do not invent unresolved G5/G6/G9/O5 semantics and do not begin production runtime or persistence work without applicable gates and explicit G12 authorization.



## 105. G3-018 strict ABSENT preconditions — verified

### Work implemented
- Inspected G3-018 in the G3 verification specification and O6 v0.3 §5.5.
- Reworked `pacogo-engine/operational-assessment-contract.test.js` so the valid `ABSENT` case passes through the shared `assertAssessment` conformance assertion.
- Added eight negative cases, also through the shared assertion: misaligned task, criterion not pre-defined, required material not pre-defined, required material not fully captured, required material not inspectable, incomplete required streams, criterion actually met, and target rule not completed.
- This strengthens the existing frozen O6 contract; it does not change the contract or production semantics. Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3202 / run ID `42427882277`: GREEN on exact baseline commit `073e353c549f7330e9865a592f23b223ac59ea45`.
- Implementation commit: `f91513784da49a48212f426f190724ca3fcc282c`.
- Full Regression #3203 / run ID `42428008931`: **GREEN** on exact implementation commit `f91513784da49a48212f426f190724ca3fcc282c`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 106. G3-019 positive target-evidence preconditions — verified

### Work implemented
- Inspected G3-019 in the G3 verification specification and O6 v0.3 §§1, 5.5 and 9.
- Strengthened the shared `assertAssessment` so target evidence `PRESENT` requires valid target elicitation, a pre-defined criterion, pre-defined required material, the criterion being met, and inspectable material. The evidence dimension must also pass the existing completed-rule/result validation.
- Expanded G3-019 with one valid positive case and six negative cases: misalignment, criterion not pre-defined, required material not pre-defined, criterion not met, required material not inspectable, and target rule not completed.
- This is test-only conformance work against frozen O6 v0.3. It does not infer mastery, transfer or next action from `PRESENT`; those remain outside O6. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3206 / run ID `42428186877`: GREEN on exact baseline commit `5945d521d4dbf8c774cfc705e080965c7f6da156`.
- Final test implementation commit: `67c77d2b824b9ec0b3304db0e80c499ab63c8330`.
- Full Regression #3208 / run ID `42428302970`: **GREEN** on exact final implementation commit `67c77d2b824b9ec0b3304db0e80c499ab63c8330`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 107. G3-020 help request versus delivered support — verified

### Work implemented
- Inspected G3-020 in the G3 verification specification and O6 v0.3 §1.
- Expanded `pacogo-engine/operational-assessment-contract.test.js` to preserve a help request with `delivered: false` as a request event only. The accepted result remains `NOT_REQUIRED` for independence in this fixture.
- Added negative cases through the shared `assertAssessment` assertion: a request without delivered support cannot be classified as `PROMPTED` or `DEPENDENT`.
- Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3211 / run ID `42428410315`: GREEN on exact baseline commit `1b8c43e93ee21aa3ed428e1259fa862260080ead`.
- Implementation commit: `2fa2689a401d30135375845d57dd9cfe0d1aa336`.
- Full Regression #3212 / run ID `42428510380`: **GREEN** on exact implementation commit `2fa2689a401d30135375845d57dd9cfe0d1aa336`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 108. G3-021 neutral interface clarification — verified

### Work implemented
- Inspected G3-021 in the G3 verification specification and O6 v0.3 §1.
- Strengthened the shared `assertAssessment` for the test fixture's `interface_clarification` support kind: it must be actually delivered, not target-relevant, and must not supply the required target operation/reasoning.
- The positive case records a delivered neutral clarification with independence `NOT_REQUIRED`. Negative cases reject a clarification marked target-relevant or one that supplies the required operation.
- This remains test-only normalized logical-record conformance work. No production support delivery, assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3215 / run ID `42428623106`: GREEN on exact baseline commit `4deef55ebc67cb67412a25f36f6b5ca02a515a0e`.
- Implementation commit: `11f2881f92f885ae4110e7551a0bdaae710aa058`.
- Full Regression #3216 / run ID `42428731369`: **GREEN** on exact implementation commit `11f2881f92f885ae4110e7551a0bdaae710aa058`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 109. G3-022 actual independence conditions — verified

### Work implemented
- Inspected G3-022 in the G3 verification specification and O6 v0.3 §5.6.
- Expanded `pacogo-engine/operational-assessment-contract.test.js` to verify that `INDEPENDENT` is accepted only when actual required event capture is sufficiently complete and no target-relevant support was delivered.
- Added negative cases through the shared `assertAssessment` assertion for incomplete event capture and delivered target-relevant assistance. The positive case explicitly records no delivered support and complete event capture.
- This remains test-only normalized logical-record conformance work. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3219 / run ID `42428855949`: GREEN on exact baseline commit `f96379871016013fa17e68b121ad6a3df3d059e7`.
- Implementation commit: `c134cc15fff565095e9f7db137d14bb7b93a9ec8`.
- Full Regression #3220 / run ID `42428971731`: **GREEN** on exact implementation commit `c134cc15fff565095e9f7db137d14bb7b93a9ec8`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 110. G3-023 target cue versus supplied operation — verified

### Work implemented
- Inspected G3-023 in the G3 verification specification and O6 v0.3 §5.6.
- Expanded `pacogo-engine/operational-assessment-contract.test.js` so `PROMPTED` requires support actually delivered, classified as target-relevant, while leaving the required target operation/reasoning to the learner.
- Added negative cases through the shared `assertAssessment` assertion for support not delivered, support not target-relevant, and support that supplies the required operation. The latter must not be classified as `PROMPTED`.
- This remains test-only normalized logical-record conformance work. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3223 / run ID `42429090347`: GREEN on exact baseline commit `c847b6b412a4ed0e749be07d20c605a3bfb3716e`.
- Implementation commit: `9bb43290e834ff8b19b27eb16e21f41ee17576aa`.
- Full Regression #3224 / run ID `42429183898`: **GREEN** on exact implementation commit `9bb43290e834ff8b19b27eb16e21f41ee17576aa`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 111. G3-024 delivered support supplies a required operation — verified

### Work implemented
- Inspected G3-024 in the G3 verification specification and O6 v0.3 §5.6.
- Expanded `pacogo-engine/operational-assessment-contract.test.js` so `DEPENDENT` requires support actually delivered, target-relevant, and supplying a required target operation/reasoning/strategy.
- The positive case preserves objective performance `CORRECT` while independence is `DEPENDENT`, preventing a support classification from automatically changing task performance to `INCORRECT`.
- Negative cases reject support not delivered, support not target-relevant, and support that did not supply the required operation.
- Test-only normalized logical-record harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3227 / run ID `42429291175`: GREEN on exact baseline commit `51c3632ca3ec99b66e43a6f4c4bbd53865a28015`.
- Implementation commit: `73148881908de05538de42f62d791daccd350b00`.
- Full Regression #3228 / run ID `42429410466`: **GREEN** on exact implementation commit `73148881908de05538de42f62d791daccd350b00`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 112. G3-025 incomplete support provenance — verified after regression correction

### Initial implementation and regression investigation
- Inspected G3-025 in the G3 verification specification and O6 v0.3 §5.6.
- Initial implementation commit `dcbc8bc9f38ce179b4a0fce775f0b08f3cbbaf53` failed Full Regression #3232 / run ID `42429627050`. The new rule forced `UNKNOWN` even when the target contract did not require an independence judgement. Six curriculum-engine tests failed, including G3-011, G3-016, G3-017, G3-022 and G3-032, plus the aggregate negative-contract test.
- Root cause: the harness did not distinguish a required independence judgement from a target contract where independence is `NOT_REQUIRED`. O6 v0.3 §5.6 explicitly defines `NOT_REQUIRED` when the target contract does not require an independence judgement.
- The corrected fixture added test-only `target_contract.independence_required`: required targets cannot use `NOT_REQUIRED`; non-required targets must use it; incomplete support provenance/event capture requires `UNKNOWN` only when the target requires an independence judgement.

### Follow-up regression and fixture correction
- Full Regression #3234 / run ID `42429805676` and #3235 / run ID `42429837840` both failed only in G3-020.
- Exact cause: the G3-020 negative fixtures attempted `PROMPTED`/`DEPENDENT` without declaring that the target contract required an independence judgement. The new contract gate correctly rejected those fixtures earlier as `NOT_REQUIRED`.
- Updated the G3-020 negative fixtures to set `target_contract.independence_required: true`, so they now test the intended prohibition: a request without delivered support cannot be `PROMPTED` or `DEPENDENT`.
- Corrected implementation commit: `d7b06192a47954ee21f10b405772e7fc77b40169`.

### Verification status
- Pre-build Full Regression #3231 / run ID `42429517399`: GREEN on exact baseline commit `f19934a0caf5b662961b49c70cf6d600cacce390`.
- Full Regression #3237 / run ID `42429883320`: **GREEN** on exact corrected implementation commit `d7b06192a47954ee21f10b405772e7fc77b40169`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 113. G3-026 same support event, target-specific independence — verified

### Work implemented
- Inspected G3-026 in the G3 verification specification and O6 v0.3 §5.6.
- Strengthened `pacogo-engine/operational-assessment-contract.test.js` to represent the same delivered support event (`event_id: support-event-1`) in two separate target assessments.
- The same event is assessed as `PROMPTED` for target A, where it leaves the required operation to the learner, and `DEPENDENT` for target B, where it supplies a required operation. The test verifies the shared event reference, distinct target references and distinct target-specific results.
- This remains test-only normalized logical-record conformance work. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3240 / run ID `42429996862`: GREEN on exact baseline commit `c4227192bd69dd2736c04622ec956a5139813f67`.
- Implementation commit: `732f3db91e93aab918f9ec2146ea91dc1b603219`.
- Full Regression #3241 / run ID `42430112666`: **GREEN** on exact implementation commit `732f3db91e93aab918f9ec2146ea91dc1b603219`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 114. G3-027 content-help request ends independent attempt incomplete — verified

### Work implemented
- Inspected G3-027 in the G3 verification specification and O6 v0.3 §5.6.
- Expanded `pacogo-engine/operational-assessment-contract.test.js` to verify that a content-help request during Tussentoets/Toets immediately ends the attempt as `INCOMPLETE`, even when no support is subsequently delivered.
- Negative cases reject an attempt that remains open and attempts marked `FAILED` or `INCORRECT`.
- This remains test-only attempt-lifecycle conformance work. No production attempt runtime, assessor, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Regression investigation and correction
- Full Regression #3245 / run ID `42430334151` was **RED** on implementation commit `b311a88804f82f1ac51fcd081e541b102638a8b2`.
- The only failing case was the negative fixture for an attempt that remains open. The shared assertion correctly rejected it with diagnostic `content-help request ends the independent attempt`; the test incorrectly expected the different text `/ended true/`.
- Corrected only the expected diagnostic pattern. No assertion condition or expected behavior was changed.
- Correction commit: `2afba1afa9358a06b69ae25d8c7d3b2b463d29da`.

### Verification status
- Pre-build Full Regression #3244 / run ID `42430232236`: GREEN on exact baseline commit `b012c1640c7a9de80faaaccc39f59a49379343a1`.
- Full Regression #3247 / run ID `42430379823`: **GREEN** on exact correction commit `2afba1afa9358a06b69ae25d8c7d3b2b463d29da`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 115. G3-028 neutral answer-entry clarification does not end independent attempt — verified

### Work implemented
- Inspected G3-028 in the G3 verification specification and O6 v0.3 §5.6.
- Expanded `pacogo-engine/operational-assessment-contract.test.js` to record a delivered neutral interface clarification that supplies no mathematical/content reasoning and leaves the Tussentoets/Toets attempt open.
- Added a negative case rejecting an attempt that is ended solely because of that neutral clarification.
- This remains test-only attempt-lifecycle conformance work. No production attempt runtime, assessor, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3250 / run ID `42430506962`: GREEN on exact baseline commit `7d4e0c2c051c35038f640cdc6423fc15a26a2011`.
- Implementation commit: `a442ab120fa2cefa14bb01c136b0d382251a8688`.
- Full Regression #3251 / run ID `42430611392`: **GREEN** on exact implementation commit `a442ab120fa2cefa14bb01c136b0d382251a8688`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 116. G3-029 preserve prior work and separate supported continuation — verified

### Work implemented
- Inspected G3-029 in the G3 verification specification and O6 v0.3 §5.6.
- Added test-only `assertSeparateSupportedContinuation` to verify that a content-help request closes the independent attempt as `INCOMPLETE`, all pre-request raw events are retained, and later supported work uses a distinct observation in `Oefenen`.
- The G3-029 positive case preserves two pre-request events and creates a separate practice observation. Negative cases reject erased prior work, reusing the same observation for continuation, and continuation in an independent assessment mode.
- Test-only normalized attempt/observation fixtures. No production attempt runtime, assessor, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3252 / run ID `42430621661`: GREEN on exact baseline commit `805e68e8db39ed283b9466509b3283298173e12a`.
- Implementation commit: `d62f29e00275223ebe6978c430628405853239d2`.
- Full Regression #3255 / run ID `42430758236`: **GREEN** on exact implementation commit `d62f29e00275223ebe6978c430628405853239d2`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 117. G3-030 incorrect performance does not imply contradiction — verified

### Work implemented
- Inspected G3-030 in the G3 verification specification and O6 v0.3 §5.7.
- Expanded `pacogo-engine/operational-assessment-contract.test.js` with objective performance `INCORRECT`, target evidence `INDETERMINATE`, and contradiction `ABSENT` when the completed contradiction rule finds no conflicting material.
- Added a negative case rejecting contradiction `PRESENT` when no specific conflicting source material is supplied.
- This remains test-only normalized logical-record conformance work. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3258 / run ID `42430890658`: GREEN on exact baseline commit `3a60437b1e0dbd7577b8069159ed469d2e87d6a8`.
- Implementation commit: `242e5ac6d8e187a8d576fce750fd45c80b38bc32`.
- Full Regression #3259 / run ID `42431013705`: **GREEN** on exact implementation commit `242e5ac6d8e187a8d576fce750fd45c80b38bc32`. The subsequent handoff-only commit `218d5157ff19a299ea3a22c9b169c6194ac0ec6b` also passed Full Regression #3260 / run ID `42431025892`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 118. G3-031 target-specific contradiction — verified

### Work implemented
- Inspected G3-031 in the G3 verification specification and O6 v0.3 §5.7.
- Replaced the prior minimal single-record fixture in `pacogo-engine/operational-assessment-contract.test.js` with two assessments for distinct targets sharing one observation.
- The explanation-dependent target retains objective performance `CORRECT` while its contradiction is `PRESENT`, citing an exact response event, source material and the target-specific interpretation it conflicts with.
- The recognition target retains evidence `PRESENT` and contradiction `ABSENT`. A negative case rejects propagation of the explanation contradiction to that recognition target.
- Test-only normalized logical-record fixtures; no production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3262 / run ID `42462282079`: GREEN on exact baseline commit `f99edffce9887d8d6fb2c011c4622418994e12bf`.
- Implementation commit: `2702f36e6ec95dc95d23e8b5e8fcc2062515d147`.
- Full Regression #3263 / run ID `42462402832`: **GREEN** on exact implementation commit `2702f36e6ec95dc95d23e8b5e8fcc2062515d147`. Handoff/matrix documentation commit `1a49fb03b1dbde942a4fa3da9254151fdc8110da` also passed Full Regression #3264 / run ID `42462414663`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 119. G3-032 missing process / task misalignment cannot establish contradiction — verified

### Work implemented
- Inspected G3-032 in the G3 verification specification and O6 v0.3 §5.7.
- Strengthened the shared `assertAssessment` conformance assertion: when target alignment is `MISALIGNED` or required process streams are incomplete, contradiction cannot be `PRESENT`.
- Replaced the prior weak G3-032 fixture (which did not actually set the alignment result to `MISALIGNED`) with explicit cases for: misalignment plus incomplete process yielding `INDETERMINATE`; misalignment where the contradiction rule is `NOT_APPLICABLE/NOT_RUN`; and missing process yielding `INDETERMINATE`.
- Added negative cases with otherwise source-cited contradiction `PRESENT` to verify that neither task misalignment nor incomplete process can support it.
- Test-only normalized logical-record conformance harness. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3267 / run ID `42462527928`: GREEN on exact baseline commit `b283a9da8756bb1d4fd428bb927f67f5f7c40399`.
- Implementation commit: `c0b500230486d076f783a573c2681a82c0c6b34d`.
- Full Regression #3268 / run ID `42462685732`: **GREEN** on exact implementation commit `c0b500230486d076f783a573c2681a82c0c6b34d`. Handoff/matrix documentation commit `8a45b79f760172a9657fd9c2b16aa3ad025d90ef` also passed Full Regression #3269 / run ID `42462698260`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 120. G3-033 help request alone is not contradiction — verified

### Work implemented
- Inspected G3-033 in the G3 verification specification and O6 v0.3 §5.7.
- Strengthened the shared `assertAssessment` assertion so a contradiction cannot cite the same event as a help request when no support was delivered.
- Replaced the minimal fixture with three cases: a help request alone with contradiction `ABSENT`; a negative case rejecting `PRESENT` when its only cited source is the help request; and a control case preserving `PRESENT` when a separate response event independently contains target-conflicting material.
- This prevents help-seeking itself from being treated as contradictory evidence without overblocking a genuinely separate contradiction within the same observation.
- Test-only normalized logical-record fixtures; no production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3272 / run ID `42462810181`: GREEN on exact baseline commit `5e24b2b3efd118a27a23bc7c881a6e0186efbf68`.
- Implementation commit: `54e118375de73e880b0f13cc77fe241f9ae787a8`.
- Full Regression #3273 / run ID `42462935286`: **GREEN** on exact implementation commit `54e118375de73e880b0f13cc77fe241f9ae787a8`. Handoff/matrix documentation commit `4873b312a03a03f2d561c259910eaa853e2be0cc` also passed Full Regression #3274 / run ID `42462946984`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 121. G3-034 one observation, multiple target-specific assessments — verified

### Work implemented
- Inspected G3-034 in the G3 verification specification and O6 v0.3 §2.
- Replaced the weak two-record test with one explicit raw-observation fixture and two target-specific assessment fixtures referencing that same observation.
- Added `assertOneObservationManyTargetAssessments` to verify exactly one raw observation, shared observation reference, distinct target identifiers, and no embedded duplicate raw observation in an assessment.
- The positive case preserves different target-specific evidence results (`PRESENT` and `INDETERMINATE`) from the same response episode. Negative cases reject duplicated raw observations, a detached assessment reference, and duplicate target assessments.
- Test-only normalized logical-record fixtures; no production observation store, assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3277 / run ID `42463050793`: GREEN on exact baseline commit `ee977cc2e64eae712cb58b7c85ed50c4ebe6c3b5`.
- Implementation commit: `263dfcf14aa946f2aa43053c541058609ddf6533`.
- Full Regression #3278 / run ID `42463163132`: **GREEN** on exact implementation commit `263dfcf14aa946f2aa43053c541058609ddf6533`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed. Handoff/matrix documentation commits `d85490f64d2f505c0a649c60e16caadd49f0ff0f` and `a08092226f2d56792ad5892d8ccb585b79297da5` also passed Full Regression #3281 / run ID `42463286584` and #3282 / run ID `42463289970`.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 122. G3-035 declared opportunity versus actual elicitation — verified

### Work implemented
- Inspected G3-035 in the G3 verification specification and O6 v0.3 §2.
- Strengthened the shared `assertAssessment` assertion: a task model's declared target opportunity cannot produce evidence `PRESENT` when a test-only fixture explicitly records that the actual task instance did not elicit that target.
- Replaced the prior weak fixture with: a declared-but-not-elicited target assessed as alignment `MISALIGNED` and evidence `INDETERMINATE`; a negative case rejecting auto-assessment as `PRESENT`; and a control case where the actual task instance did elicit the target and the assessment is valid.
- The `actual_target_elicited` value is test-fixture-only; it does not define a production persisted field or API. No production assessor/runtime, curriculum mapping, registry, catalogue, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3284 / run ID `42463423482`: GREEN on exact baseline commit `f2b0dce8f0c715c3c674ceb09a200eb9b3fb7c94`.
- Implementation commit: `0d9daa89c78199796c69f2bd81daa6450755cb14`.
- Full Regression #3285 / run ID `42463541450`: **GREEN** on exact implementation commit `0d9daa89c78199796c69f2bd81daa6450755cb14`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed. The handoff/matrix documentation updates were verified by Full Regression #3288 / run ID `42463665274` and #3289 / run ID `42463668637`.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 123. G3-036 logical assessment provenance completeness — verified

### Work implemented
- Inspected G3-036 in the G3 verification specification and O6 v0.3 §7.
- Replaced the prior truthiness-only provenance check with `assertLogicalAssessmentProvenance`, requiring non-empty logical references/versions for task instance, task definition, task model, curriculum registry, task scoring rule, O6/C3 contract, target rule and assessment engine, plus event time and assessment-availability time.
- The fixture also preserves source event references. Existing `assertAssessment` checks the observation and evidence-target references.
- Added negative cases removing each required provenance field individually and a case omitting source event references.
- This is logical test-fixture conformance only. It does not prescribe physical storage keys, an assessment identity format, canonical payload semantics or a persistence schema. G6/G9 identity semantics remain blocked and untouched. No production assessor/runtime, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3290 / run ID `42463781726`: GREEN on exact baseline commit `bdb6cebfbc5312414b07e333b84c7ed35f212f1f`.
- Initial implementation commit: `1ba0ecc5236a4bbb5167461f7d48562864770f1e` (RED as documented below).
- Corrected implementation commit: `3e9a7a66640a422a3ce3780e37f7723c166636e9`.
- Full Regression #3295 / run ID `42463916536`: **GREEN** on the exact correction commit. The subsequent handoff-only commit `bc096bd2ff2394733a2fddb44ab9dd441746e1a9` also passed Full Regression #3296 / run ID `42463932797`. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks passed.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains separate.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 124. G3-036 regression failure isolation and correction — verified

### Exact failure
- Full Regression #3292 / run ID `42463863331` failed on implementation commit `1ba0ecc5236a4bbb5167461f7d48562864770f1e`; the handoff-only commit `f991b89df2a6aef524d48810325ed8a88a2abbcb` failed in #3293 / run ID `42463881545`; and the matrix-only commit `bae6c2a37363cf7ca87d730c5b8bf2529a824f68` failed in #3294 / run ID `42463884328`.
- Curriculum-engine regression: 282 tests, 281 passed, 1 failed. The sole failure was G3-036's negative case for an empty `source_event_ids` array.
- Root cause: `Array.prototype.every()` returns true for an empty array. The helper checked that every supplied event reference was non-empty but did not require at least one event reference, so the negative fixture did not throw.
- This was an incomplete test assertion, not a production engine failure. No tests outside the new G3-036 case failed.

### Correction
- Correction commit: `3e9a7a66640a422a3ce3780e37f7723c166636e9`.
- The provenance helper now requires a non-empty source-event-reference list before validating each identifier. The negative fixture expects that specific diagnostic.
- No assertion was weakened; the missing required provenance condition is now explicitly enforced.
- Full Regression #3295 / run ID `42463916536`: **GREEN** on exact correction commit `3e9a7a66640a422a3ce3780e37f7723c166636e9`. Handoff-only commit `bc096bd2ff2394733a2fddb44ab9dd441746e1a9` also passed Full Regression #3296 / run ID `42463932797`.



## 125. A1/B1/FR2 domain-anchor conformance strengthening — verified

### Work implemented
- Re-read the G3↔O6 traceability review and O6 Domain Anchor Examples v0.1, then verified target identifiers against curriculum registry v0.6.
- Strengthened the A1 anchor to use canonical `A1.ET2`: co-display without an actual mapping action remains `MISALIGNED/INDETERMINATE`; a genuinely elicited mapping can be `ALIGNED/PRESENT`; an auto-assessed positive result for the non-elicited target is rejected.
- Strengthened B1 anchors to use canonical `B1.ET3`, `B1.ET4` and `B1.ET5`. One raw response observation now has separate target assessments: execution is `PRESENT`, while strategy and checking remain `INDETERMINATE` because the actual administration did not elicit them. B1.ET7 remains explicitly unmapped, using its canonical registry ID.
- Strengthened FR2 anchors to use canonical `FR2.ET1` and `FR2.ET3` from one observation. Recognition `PRESENT` does not imply same-value reasoning; text presence alone cannot produce reasoning evidence; wrong selection alone cannot produce contradiction.
- All new flags/patterns are test-fixture-only. No curriculum target, task-model mapping, registry, production runtime, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Pre-build Full Regression #3304 / run ID `42464335034`: GREEN on exact baseline commit `a1eb8ba3008733d9bfc52e59047b3bdc2b38ed23`.
- Implementation commit: `253afb6b59052ad6b35d3fd544359b18ab3101b9`.
- Full Regression #3305 / run ID `42464593360`: **GREEN** on exact implementation commit `253afb6b59052ad6b35d3fd544359b18ab3101b9`. Handoff/matrix documentation commit `160186d4357f2f6bb5b1af73566f8c251ba6b4c5` also passed Full Regression #3306 / run ID `42464612413`. All required steps passed, including browser regression and clean-working-tree verification.

### Gate status
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN for directly specified domain-anchor strengthening; G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics; G3-040 remains blocked on O5 snapshot/availability-cutoff semantics.
- G5, G6/G9, O5 and G12 remain separate dependencies/gates.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.



## 126. C6 M2 descriptive-profile conformance — verified

### Work implemented
- Reviewed the direct C6 M2 descriptive-profile anchor against G3 verification specification §7 and the frozen O6 v0.3 non-scored profile requirement.
- Verified that the five required components remain separately inspectable: `capture_integrity`, `response_interpretability`, `scoring_validity`, `administration_fidelity` and `source_provenance_integrity`.
- The test harness rejects missing components, non-record values and prohibited score/ordinal/weighted/composite aggregates at any nesting depth. It also rejects compound and camelCase aggregate field names, while permitting descriptive nested detail.
- The profile remains descriptive and non-scored. No numeric/ordinal total is introduced; this does not decide G5's downstream M1/M2 relationship or redefine C6 gates.
- Scope is test-only. No production assessor/runtime, curriculum mapping, registry, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.

### Verification status
- Full Regression #3310 / run ID `42466388550`: **GREEN** on exact commit `5a11956729812febf919e1e7fc7919e9d89a5592`.
- Additional compound-field coverage commit: `dd65d1026151d3d91e7bb6b7be2de0adaf1f4117`.
- Full Regression #3311 / run ID `42466547557`: **GREEN** on that exact commit. Curriculum-engine regression, architecture boundaries, Double or Nothing runtime regression, maintained Node, Vitest, browser regression and clean-working-tree checks all passed.

### Gate status and next step
- G2/O6: CLOSED; logical contract v0.3 remains frozen.
- G3: OPEN; this closes the reviewed direct C6 M2 descriptive-profile conformance gap, not G3 as a whole.
- G3-037–039 remain blocked on G6/G9 identity/canonical-payload semantics. G3-040 remains blocked on O5 snapshot/availability-cutoff semantics. G5 remains a separate dependency; no M1/M2 mapping is decided here.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Next: inspect the remaining directly specified G3↔O6 anchors for an eligible, unblocked gap. Do not infer G6/G9 or O5 semantics.



## 127. G3-040 — O5 snapshot availability-cutoff conformance verified

### Contract review
- Rechecked G3-040 against the approved minimum O5 logical policy in Section 67, O6 v0.3 §7 and G3 verification specification §4.6.
- O5 now explicitly separates event-time window membership from assessment-availability time, records an availability cutoff per evaluation snapshot, keeps snapshots immutable, and permits late-arriving information only in a new snapshot/evaluation.
- This is sufficient for a logical test-fixture assertion. It does not require a physical snapshot ID, storage key, table or persistence contract.

### Test change
- Replaced the former G3-040 blocked placeholder with a test-fixture-only snapshot-eligibility check.
- The tests verify that an assessment whose event falls inside the O5 window but whose assessment-availability time is after the snapshot cutoff is excluded from that immutable snapshot.
- A later snapshot/evaluation with a later cutoff may include the assessment; the original snapshot remains unchanged and continues to exclude it.
- Boundary cases verify inclusive window start, exclusive window end, availability exactly at cutoff, and availability after cutoff.
- Event-time membership and assessment availability remain separate logical checks.

### Scope and verification
- Test-only normalized logical fixture. No physical snapshot identity, schema/API, production evaluator/runtime, curriculum mapping, learner state, persistence, SQL/RPC/RLS, Supabase or learner data changed.
- Implementation commit: `d5d7c8095405c4ab6d9401c89784396db05dc956`.
- Full Regression #3314 / run ID `42466872610`: **GREEN** on that exact commit. All required steps passed, including curriculum-engine regression, architecture boundaries, maintained Node/Vitest, browser regression and clean-working-tree verification.

### Gate status and next step
- O5 core logical scope/window and availability-cutoff policy: approved; detailed governance items remain open under G1.
- G3-040: verified; no longer blocked on the minimum O5 cutoff semantics.
- G3 remains OPEN because G3-037–039 still depend on G6/G9 identity and canonical-payload semantics.
- G2/O6 remains CLOSED. G5, G6/G9 and G12 remain separate gates. No production implementation authorization is implied.
- Next: reconcile the existing G6 task/attempt/observation lifecycle proposal with approved O6 v0.3, clearly separating determined contract requirements from owner decisions still needed. Do not infer G6/G9 identity or canonical-payload behavior and do not begin runtime/persistence work.


## 128. G6 support-condition identity boundary — owner-approved logical decision

### Decision
- On 2026-11-08 the owner approved the explicit logical identity consequence for a material change in support condition.
- A material support-condition change creates a new task instance, a new response episode and a new immutable raw observation.
- In the confirmed Tussentoets/Toets flow, a content-help request ends the independent episode as incomplete. The supported-practice continuation is a separate administration and must not be merged into the independent episode.
- All pre-request events and the incomplete independent episode remain preserved.
- A neutral interface clarification that supplies no target reasoning does not itself change the support condition and does not create a new administration identity.
- Ordinary answer revisions/retries within the same administration remain events in the same response episode.

### Implementation and verification
- Added test-fixture-only G6 checks for three distinct identities across a material support-condition transition and for identity continuity during neutral interface clarification.
- The tests use logical fixture identifiers only; they do not define physical ID formats, storage keys, schema, API or runtime behavior.
- Test commit: `e14fd5fced63d3db4c1e94d9fbf397201256843e`; Full Regression #3317 / run ID `42498366233`: **GREEN** on that exact commit.
- G6 proposal update: `612599a46a8f807fbdc3b28cac9f43376b980251`; Full Regression #3318 / run ID `42498549925`: **GREEN** on that exact commit.
- Owner architecture decision record update: `abad589e70ca2f504b4eb02acaa8162a640ecfbd`; Full Regression #3319 / run ID `42498553242`: **GREEN** on that exact commit.
- All three runs passed curriculum-engine regression, architecture boundaries, maintained Node/Vitest, browser regression and clean-working-tree verification.

### Remaining G6/G9 work
- G6 remains OPEN. Explicit decisions/reconciliation are still required for completion, abandonment, interruption/resume, restart, timeout, event lifecycle and full alignment with the final C3/O6 model.
- G9 remains OPEN for canonical immutable payload representation, stage status, retries, concurrency and durable recovery. O7's logical same-identity/same-payload replay versus same-identity/different-payload conflict rule does not define a physical canonical serializer.
- G3-037–039 therefore remain BLOCKED until the relevant G6 and G9 semantics are fully approved and testable.
- No runtime, database, SQL/RPC/RLS, Supabase, curriculum registry, learner data or production assessment behavior changed.
- Branch remains `refactor/professional-v1`; LIVE `main` untouched.

### Next concrete step
- Reconcile the remaining G6 lifecycle transitions against C3 v0.2 and frozen O6 v0.3. Keep logical decisions separate from G9 payload serialization and G8/G10 persistence/security design. Do not implement runtime or persistence.


## 129. G6 lifecycle reconciliation — retry/restart/abandonment anchors tested

### Source reconciliation
- Reconciled the G6 proposal against C2 Student Data Model v0.1, retained C3 v0.2 observation-unit requirements, Multi-Target Task Evidence Contract v0.1 and owner-approved O6 v0.3.
- Determined: one administered task-instance response episode maps to one immutable raw observation; ordinary click/edit/answer retry remains an ordered event within the same episode; a separately administered restart is a new task instance/episode/observation.
- Determined: completion and abandonment are raw lifecycle events. A started abandoned episode preserves its captured events and immutable observation. O6's NO_RESPONSE handling remains an assessment rule (NOT_OBSERVED performance and INDETERMINATE target evidence), not a lifecycle status shortcut.
- Previously approved: a material support-condition change creates a new task instance, response episode and observation. A neutral interface clarification that supplies no target reasoning does not itself change administration identity.
- Still a candidate/product decision: whether an interruption can resume the same episode depends on exact restoration of the same administration state; timeout is not terminal merely because time elapsed and requires an explicit versioned task/session policy.

### Test and document work
- Added test-fixture-only G6 checks for ordinary retries retaining all three identities, explicit restart creating new identities while preserving the completed episode, and a started abandoned episode preserving one immutable observation and its captured events.
- The first test run exposed a test-diagnostic issue only: the negative assertion expected observation_id in Node's default assertion message. The identity check itself correctly failed. The assertion was given an explicit diagnostic message; no production or contract behavior was weakened.
- Test commit `661d7250ff15dce23c689cf5fbbc081061a45526`: Full Regression #3322 / run ID `42499243432`: **RED**, 289 passed / 1 failed. Exact failure: G6-003's negative test expected the field name in the default Node assertion message.
- Test diagnostic correction commit `61cd6917df18af3120e9a6a87f92675be17ab78a`: Full Regression #3323 / run ID `42499293139`: **GREEN** on exact commit.
- G6 lifecycle reconciliation proposal commit `bc95ab0f8c6d3fd0134d5bceac5e677be514fbc6`: Full Regression #3324 / run ID `42499416128`: **GREEN** on exact commit. All full-regression steps passed, including browser regression and clean-working-tree verification.

### Gate status
- G6 remains OPEN: exact interruption/resume restoration policy, timeout duration/consequence, learner-facing lifecycle wording, complete event ordering/identity semantics and final C3/O6 reconciliation remain.
- G9 remains OPEN for canonical immutable payload representation, stage status, retries, concurrency and durable recovery.
- G3-037–039 remain BLOCKED pending complete G6/G9 semantics.
- No runtime, production evaluator, registry, learner data, persistence, SQL/RPC/RLS or Supabase changes. O6 v0.3 remains frozen.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.

### Next concrete step
- Complete the G6 logical event/lifecycle table without inventing timeout policy or exact resume/recovery behavior. Then isolate which remaining G3-037–039 requirements depend on G6 versus G9. Keep canonical payload serialization and physical persistence/security outside this G6 logical step.


## 130. G3-037–039 dependency split, G3-039 logical lineage test and exact-commit CI verification

### G3 dependency split
- G3-037 (same assessment identity + same canonical immutable content): requires G6's exact logical assessment-identity boundary and G9's canonical-payload equality/idempotent stage-write semantics. Remains BLOCKED.
- G3-038 (same assessment identity + different canonical content): requires the same G6 identity boundary plus G9's canonical-payload conflict detection and preserve-original behavior. Remains BLOCKED.
- G3-039 (correction/reassessment under a new rule/version): O6 v0.3 §7 already specifies logical provenance, stable assessment identity, prior-assessment linkage and correction reason. A test-fixture-only logical lineage check now verifies a new assessment identity, same source observation and target, prior-assessment link, non-empty correction reason, changed rule version and preservation of the prior assessment.
- G3-039's logical lineage requirement is verified; durable append-only/idempotent recording and exact identity realization remain dependent on G6/G9. Do not mark the complete persistence/replay case closed.

### G6/O6 identity reconciliation
- Corrected the G6 proposal's target-assessment identity row: O6 v0.3 governs logical provenance and correction lineage; exact identity semantics, canonical immutable payload and replay/conflict behavior are G6/G9 responsibilities.
- This avoids assigning exact identity semantics to O6 when O6 §7 explicitly defers them to G6/G9.

### Test and CI verification
- G3-039 logical lineage test commit: `43b2bf519d249da0ccde1e1bcd50d5dd5fab9011`; this run's trigger SHA did not match the SHA actually checked out because the workflow checked out the moving branch name. Its result is not accepted as exact-commit evidence.
- Corrected fixture snapshot and updated G6 identity reconciliation commit: `8e2837d04c36bcc7a14d27d81e361b7cc2fc24ab`.
- CI root cause: `.github/workflows/full-regression-refactor-v1.yml` checked out literal branch `refactor/professional-v1`. When pushes arrived before runner checkout, multiple runs could test the same later branch HEAD while reporting different triggering SHAs.
- Historical audit: #3318 was triggered by `612599a46a8f807fbdc3b28cac9f43376b980251` but checked out `abad589e70ca2f504b4eb02acaa8162a640ecfbd`; #3327 and #3328 both checked out `43b2bf519d249da0ccde1e1bcd50d5dd5fab9011` despite different trigger SHAs; #3329 checked out `b35d98e45598e66cfc79e11c4bb0925df7769d3d` rather than its triggering SHA. Their run conclusions are not exact-commit verification for their metadata SHAs.
- Fixed workflow commit: `b35d98e45598e66cfc79e11c4bb0925df7769d3d`. It checks out `github.sha`, asserts `GITHUB_REF` is exactly `refs/heads/refactor/professional-v1`, and asserts `git rev-parse HEAD = GITHUB_SHA`.
- Full Regression #3330 / run ID `42500399488`: **GREEN** on exact commit `b35d98e45598e66cfc79e11c4bb0925df7769d3d`; the exact-checkout guard, all curriculum/architecture/Node/Vitest checks, browser regression and clean-working-tree check passed.

### Current gate status
- G3-039 logical lineage test: verified; persistence/idempotency portion remains dependent on G9.
- G3-037 and G3-038: BLOCKED on G6/G9.
- G6 remains OPEN for interruption/resume policy, timeout policy, full event identity/order and final C3/O6 reconciliation.
- G9 remains OPEN for canonical payload serialization/equality, staged write states, retry, concurrency and durable recovery.
- No production runtime, physical schema, database, SQL/RPC/RLS, Supabase or learner data changed. O6 v0.3 remains frozen.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.

### Next concrete step
- Define only the remaining logical G6 event identity/order boundary, keeping canonical payload serialization and durable write/retry mechanics in G9. Then re-evaluate whether G3-037/038 have sufficient approved logical inputs for executable contract tests.


## 131. G6 logical event identity and ordering boundary — fixture-tested

### Logical boundary
- Each interaction event belongs to exactly one response episode.
- Event identity is stable and unique within its parent response episode.
- The raw observation preserves the event stream in source/episode order. Event timestamps are provenance; they do not silently reorder events.
- Event time and assessment-availability time remain separate O5/O6 facts.
- A numeric event-sequence field is not mandated by the logical contract; preserving ordered event identity is required, while the physical representation remains open.
- O7's replay/conflict outcome applies to event identity plus canonical immutable payload. Exact payload fields, serialization/equality, idempotency-key mechanics and durable retry/concurrency/recovery remain G9 work.
- A corrected event must not rewrite the original raw event; a linked/versioned correction remains the logical direction, with physical lineage implementation deferred.

### Test and document work
- Added G6-006 test-fixture coverage for event identity uniqueness within an episode, exactly one parent episode and preservation of source event order even when timestamps are not chronological.
- Test commit `0033986c909ce5b37a8448174ebcc01966591466`: Full Regression #3333 / run ID `42501201552`: **GREEN** on exact commit. The exact-checkout guard, curriculum-engine, architecture, Node/Vitest, browser and clean-working-tree checks passed.
- G6 proposal event-boundary update commit `27ccd9b570b0668c2ad9a6bacb0cf6de8fd99c74`: Full Regression #3334 / run ID `42501204468`: **GREEN** on exact commit.

### Gate status
- G6 logical event parentage/identity/order boundary: specified and fixture-tested; G6 remains OPEN for interruption/resume, timeout, exact assessment-identity semantics and complete C3/O6 lifecycle reconciliation.
- G9 remains OPEN for canonical payload representation/equality, idempotency mechanics, stage status, retry, concurrency and durable recovery.
- G3-039 logical lineage remains tested; G3-037/038 remain BLOCKED on exact G6 assessment identity and G9 canonical payload semantics.
- No production runtime, physical event schema, persistence, SQL/RPC/RLS, Supabase or learner data changed. O6 v0.3 remains frozen.
- Branch: `refactor/professional-v1`; LIVE `main` untouched.

### Next concrete step
- Isolate the exact logical assessment-identity boundary needed by G3-037/038 from G9's canonical-payload equality/conflict mechanics. Keep the G6 identity decision logical and inspectable; do not invent physical keys or serializers.


## 132. G6 logical target-assessment identity boundary — fixture-tested

- Added G6-007 test-fixture coverage: one immutable observation can have separate target assessments; each target assessment has one non-empty stable logical assessment identity, one observation reference and one existing target reference; one assessment identity cannot identify multiple assessment records.
- The test deliberately does not select ID generation, physical uniqueness constraints, canonical payload serialization, equality or persistence.
- Test commit `4ec0bad47f4f76b880c55e26c5d48dbf92ec6f9e`; Full Regression #3339 / run ID `42501694960`: **GREEN** on exact commit. Exact checkout guard, curriculum engine, architecture boundaries, Node/Vitest, browser regression (59 passed) and clean-working-tree verification all passed.
- G6 proposal records the fixture coverage but keeps final owner approval and full C3/O6 reconciliation open.
- G3-037/038 remain BLOCKED pending approved exact G6 assessment identity plus G9 canonical payload equality/conflict and durable idempotent stage-write behavior. G3-039 logical lineage remains tested; durable persistence remains open.
- G6 remains OPEN for interruption/resume, timeout, final owner approval of logical lifecycle/assessment identity and complete C3/O6 reconciliation. G9 remains OPEN for payload representation/equality, idempotency mechanics, stage status, retry, concurrency and recovery.
- No production evaluator/runtime, physical schema, database, SQL/RPC/RLS, Supabase or learner data changed. O6 v0.3 remains frozen. Branch `refactor/professional-v1`; LIVE `main` untouched.
- Next: reconcile this logical assessment identity candidate against C3/O6 and the owner architecture decision record; then determine which G3-037/038 assertions can be safely authored without specifying G9 mechanics.


## 133. G6 target-assessment identity source reconciliation

### Source-derived boundary
- Multi-Target Task Evidence Contract v0.1 §§3–4: one task attempt/raw observation remains singular; each separately justified target receives its own target-specific evidence unit. Target expansion does not create additional independent observations. The contract does not define a canonical assessment ID.
- Retained C3 Consolidated Observation/Event Coding Contract Reconciliation v0.1 explicitly marks itself superseded for learner-runtime architecture and not an approved schema. It is historical context only; it is not used to introduce a new schema or identity format.
- O6 v0.3 §7 is the controlling logical assessment record: each target-specific assessment references exactly one immutable observation and exactly one existing evidence target, preserves a stable assessment identity under G6/G9, and carries prior-assessment linkage/reason for correction or reassessment.
- Owner decision O7 separates raw-observation ingestion, target-assessment evaluation/recording and decision evaluation into distinct idempotency boundaries. Same identity/same canonical immutable payload is replay; same identity/different payload is an integrity conflict. O7 does not specify canonical serialization or physical write/recovery mechanics.
- G6 logical responsibility: one distinct stable identity per target-specific assessment instance, bound to exactly one observation and one target; correction/reassessment uses a new linked identity and does not mutate prior history. G9 owns canonical payload equality/conflict and durable idempotent recording.

### Verification
- G6-007 fixture test commit `4ec0bad47f4f76b880c55e26c5d48dbf92ec6f9e`: Full Regression #3339 / run ID `42501694960`: **GREEN** on exact commit.
- Proposal fixture note commit `1336151d074f48158a82367948f2e193238962e5`: Full Regression #3340 / run ID `42502143871`: **GREEN**.
- Handoff and readiness matrix updates: handoff commit `ef5c72ba7ecb9731fd5b185323493b77233646ab`, Full Regression #3341 / run ID `42502148198`: **GREEN**; matrix commit `4b5c388b1b5ba04d58481207634d9dc471771042`, Full Regression #3342 / run ID `42502254738`: **GREEN**.
- Proposal source reconciliation commit `76cf44f84c615921754518a0c27194c550003af9`: Full Regression #3343 / run ID `42502527256`: **GREEN** on exact commit. All runs passed the exact-checkout guard, curriculum engine, architecture, Node/Vitest, browser regression and clean-working-tree verification.

### Gate status
- G6 assessment identity: source-reconciled and fixture-tested as a logical candidate; final owner approval and full lifecycle closure remain open.
- G6 interruption/resume and timeout decisions remain open. No default timeout or automatic terminal transition is introduced.
- G9 remains OPEN for canonical payload definition/serialization/equality, stage status, idempotency mechanics, retry, concurrency and durable recovery.
- G3-037/038 remain BLOCKED on G9 even though the logical G6 assessment identity boundary is now specified and tested. G3-039 logical lineage is tested; its durable persistence/idempotency remains open.
- No production assessor/runtime, physical schema, database, SQL/RPC/RLS, Supabase or learner data changed. O6 v0.3 remains frozen. Branch `refactor/professional-v1`; LIVE `main` untouched.

### Next concrete step
- Move to a read-only G9 requirements reconciliation from O7 and the existing persistence/consumer audit. Separate canonical payload semantics and stage idempotency/recovery from the physical database/RLS design (G8/G10). Do not modify the RPC or Supabase.


## 134. G9 staged idempotency requirements review — source-derived, no implementation

### O7 logical requirements extracted
- Three separate idempotency boundaries: raw-observation ingestion; PacoGO target-assessment evaluation/recording; decision evaluation.
- For each boundary: same identity + same canonical immutable payload is replay; same identity + different payload is an integrity conflict and must be rejected; correction/reassessment uses a new linked/versioned identity and never overwrites prior history.
- A changed eligible evidence set or protocol creates a new snapshot/evaluation.
- Each stage commits atomically within its own write unit and exposes durable, inspectable state for retry/recovery. The entire observation-to-decision timeline is not one transaction.
- O7 does not prescribe canonical payload fields/serialization, status vocabulary, retry/outbox mechanism, concurrency/locking or failure-recovery implementation.

### Current implementation finding from the existing read-only audit
- Current `persist_curriculum_learning_cycle` is one atomic operation inserting evidence, upserting skill-level state and inserting a decision trace.
- Its current learner + source-event duplicate path checks that records exist and returns `duplicate: true`; it does not compare the existing payload to a canonical immutable payload. It therefore does not distinguish same-identity/same-payload replay from same-identity/different-payload conflict.
- This is a documented architecture gap, not a reason to patch the RPC. The audit describes repository source/migrations and does not claim deployed Supabase state.

### G9 review artifact
- Created `docs/curriculum/PacoGO_G9_Staged_Idempotency_Requirements_Review_v0.1.md`.
- It separates canonical payload contract, identity/idempotency scope, durable stage state, atomicity/failure behavior, retry/concurrency/conflict handling and security/persistence boundaries.
- It leaves unresolved status names, canonicalization details, key scope, transaction/outbox/locking design and physical storage. G8/G10 remain responsible for persistence/security design.
- Review artifact commit `0f4051612662d8a77e4dbaeded4bf2d1a9a5ff19`: Full Regression #3345 / run ID `42502755601`: **GREEN** on exact commit.
- Preceding handoff commit `3f2db0bb91ffe984fa1f736278aeecf5ba0fa26d`: Full Regression #3344 / run ID `42502692074`: **GREEN** on exact commit. Both runs passed exact-checkout verification and all full-regression steps, including browser regression and clean-working-tree verification.

### Gate status
- G6: logical event identity/order and target-assessment identity candidate are fixture-tested; final owner approval, interruption/resume, timeout and full lifecycle closure remain open.
- G9: requirements review completed; detailed canonical payload, stage state, idempotency, retry, concurrency and recovery contract remains OPEN.
- G3-037/038 remain BLOCKED until G9 semantics are defined and tested in addition to G6 identity. G3-039 logical lineage is tested; durable recording remains open.
- G8/G10 physical persistence/security and G12 implementation authorization remain separate.
- No runtime, production assessor, database, SQL/RPC/RLS, Supabase or learner data changed. O6 v0.3 remains frozen. Branch `refactor/professional-v1`; LIVE `main` untouched.

### Next concrete step
- Review the G9 requirements artifact against O7 and the current audit for any missing invariant; then formulate only the unresolved owner decisions required to freeze the logical G9 contract. Do not select physical serialization/storage mechanisms or modify the RPC.


## 135. G9 review refined with stage-specific payload source boundaries

- Refined `PacoGO_G9_Staged_Idempotency_Requirements_Review_v0.1.md` to map the logical content protected by each O7 stage:
  - raw-observation ingestion: C2 interaction/observation layer, immutable raw events/response/missingness/provenance, with G6 identity and ordering;
  - target-assessment evaluation/recording: O6 v0.3 §7 exact one-observation/one-target references, dimension applicability/execution/results, source/rationale/support references, rule/contract/engine versions, event/availability times and correction lineage;
  - decision evaluation: O8 complete six-part branch identity, snapshot/evaluation IDs, protocol/version provenance, gate trace and exact observation/assessment references; C7 must preserve the validated C6 identity rather than recompute it.
- Explicitly left the precise boundary between C6 evaluation and C7 decision records to the approved C6/C7/O8 contracts. G9 must not merge stage identities because the learner-facing flow is continuous.
- This is a source-derived logical payload boundary, not a canonical serialization or physical schema.
- Stage-boundary refinement commit `5b8391d6afaf7ee719a34e5297b0711df600fa53`: Full Regression #3348 / run ID `42503487582`: **GREEN** on exact commit.
- Section-number correction commit `b818be5818f8a20d7d1a7ccea0f32f8d5c9386cd`: Full Regression #3349 / run ID `42503548664`: **GREEN** on exact commit.
- Both runs passed exact-checkout guard and all full-regression steps, including browser regression and clean-working-tree verification.

### Next concrete step
- Prepare a G9 candidate logical contract that maps each stage to its existing source identity (observation ID, target-assessment ID, snapshot/evaluation identity) and proposes content-equality rules only where the source contracts support them. Explicitly mark unresolved canonicalization, null/absence, collection ordering, status, retry and concurrency decisions as proposals requiring review. Do not implement or modify persistence/RPC/Supabase.


## 136. G9 logical idempotency contract candidate drafted

- Created `docs/curriculum/PacoGO_G9_Logical_Idempotency_Contract_Candidate_v0.1.md`.
- The candidate maps O7's three separate idempotency boundaries to the current logical identities:
  - Stage A raw observation: G6 `observation_id` candidate; exact namespace/uniqueness scope remains open.
  - Stage B target assessment: G6 `assessment_id`, exactly one observation and one existing target; correction/reassessment is new linked history.
  - Stage C decision evaluation: O8's six-part branch identity, `snapshot_id`, `evaluation_id`, protocol provenance, gate trace and exact observation/assessment references. Whether C7 requires a separate stage identity or a shared evaluation identity plus stage discriminator remains unresolved.
- It defines source-derived logical payload content for each stage, proposes a complete versioned semantic equality envelope, and lists explicit unresolved decisions for null/absence, normalization, collection order, timestamp handling, stage status, uncertain-commit recovery, retries, concurrency and timeout.
- It includes 16 conformance-test scenarios, but deliberately does not add tests for unresolved semantics or implement storage behavior.
- Candidate commit `06f1c6acf8a280db5e7c53541a56b1b290933fe8`: Full Regression #3351 / run ID `42504038523`: **GREEN** on exact commit. Exact-checkout guard, all curriculum/architecture/Node/Vitest checks, browser regression and clean-working-tree verification passed.
- This is a candidate for owner review, not a final G9 approval. O7/O8 and O6 v0.3 were not changed. G3-037/038 remain BLOCKED; G3-039 logical lineage is tested but durable recording remains open. No runtime, schema, database, SQL/RPC/RLS, Supabase or learner data changed.

### Next concrete step
- Review the ten explicit G9 open decisions against the source contracts and separate those already determined by O7/O8/O6/G6 from those requiring an owner choice. Do not begin G9 implementation until that distinction and the Stage C identity decision are resolved.


## 137. G9 source reconciliation — owner decisions separated from specification gaps

### Completed
- Read the current handoff and checked Full Regression before continuing.
- Full Regression #3352 / run ID `42504176404` completed **GREEN** on exact commit `41a305716d91046528934e84f991fc04b59616c3`. Exact branch/commit guard, curriculum, architecture, Node, Vitest, browser regression and clean-working-tree checks all passed.
- Read the G9 logical candidate against O7/O8, O6 v0.3, G6 identity lifecycle, C6/C7 and the C8/C9 preliminary crosswalk.
- Created `docs/curriculum/PacoGO_G9_Source_Reconciliation_v0.1.md`.
- Updated the implementation-readiness matrix with the source reconciliation.

### Findings
- O7 already approves three separate idempotency boundaries, replay/conflict outcomes, linked correction/reassessment, new snapshot/evaluation after changed eligible evidence/protocol, stage-local atomicity and durable inspectable retry/recovery state.
- G6/O1/O6 already determine observation/assessment cardinality and provenance boundaries, including one stable target-assessment identity bound to exactly one observation and one target. Actual reassessment under a changed rule/contract/engine gets a new linked identity.
- O5 already determines UTC instants, half-open event-time membership, separate assessment-availability cutoff and immutable snapshots.
- C6 `evaluation_id` and C7's consumed C6 identity must remain distinct from the C7 decision record. C8/C9 v0.2 and the preliminary G5 crosswalk identify a separate C7 decision identity referencing the exact C6 evaluation. This is a source-aligned candidate pending final G5 approval, not a claim that G5 is closed.
- Still open: Stage A/B identity namespace/uniqueness scope; final Stage A field envelope pending G6; null/absence, scalar/string normalization, collection ordering, timestamp precision and contract-version equality rules; stage-state vocabulary/transitions; uncertain-commit recovery; retry/concurrency/in-progress behavior; operation timeout semantics.
- Learner administration timeout (G6) and persistence operation timeout (G9) are separate concerns.
- G8/G10 physical persistence/security design remains downstream. No RPC/Supabase patch.

### Verification state
- Source reconciliation artifact commit: `8d6a9865511fdbc3f2fdebf4c1735fbbf6af9fbe`.
- Matrix and handoff documentation updates are being completed as one documentation-only block; their final commit must pass Full Regression before this phase is closed.
- No runtime, tests, registry, learner state, schema, SQL/RPC/RLS, Supabase or learner data changed.

### Next concrete step
1. Reconcile Stage C in the G9 candidate: separate the C6 evaluation identity from the C7 decision identity that references it, subject to G5 approval.
2. Draft field-by-field logical payload inventories for Stages A, B and C, marking required/conditional/optional fields from source contracts.
3. Keep canonicalization decisions open where sources do not decide them. Do not add tests for unresolved semantics.
4. Keep G6/G9 and G8/G10 dependencies explicit. No implementation until the required gates and explicit G12 authorization are complete.

Working branch remains `refactor/professional-v1`; `main` / LIVE untouched.


## 138. G9 stage payload field inventory and Stage C identity clarified

### Completed
- Full Regression #3355 / run ID `42504801468`: **GREEN** on exact handoff commit `a5b5b60939d68ff0fbef77bc21fa517deb3461b5`.
- Full Regression #3354 / run ID `42504798016`: **GREEN** on exact matrix commit `fbf841554ec6260c654ec851b9caca8c4826db4c`.
- Every required step passed on both runs: exact triggering-commit/ref guard, dependency audit, Agenda/practice ownership boundaries, curriculum engine, architecture tests, maintained Node/Vitest, browser regression and clean working tree.
- Updated G9 candidate Stage C to distinguish the immutable snapshot, C6 evaluation identity and separate C7 decision identity. C7's logical decision record references the exact C6 evaluation. The C8/C9 crosswalk uses `c6_evaluation_id` and `c7_decision_id`; O8 calls the C6 identifier `evaluation_id`. Final naming/approval remains under G5.
- Created `docs/curriculum/PacoGO_G9_Logical_Payload_Field_Inventory_v0.1.md`: field-by-field Stage A/B/C inventory with required, conditional, not-part-by-default and unresolved classifications.
- The inventory preserves source distinctions: raw observation versus target assessment versus inference; observation identity versus assessment identity; event time versus assessment availability; snapshot versus C6 evaluation versus C7 decision.

### Commits
- Stage C candidate clarification: `c90fd7532191dd7c56ca1896eeb863e01c48b18a`.
- Field inventory: `4d9907f237bd8f00f6237187e7919188e3c46b61`.
- Readiness matrix and this handoff are now being updated. Their final commit must pass Full Regression before this block is closed.

### Current gate status
- G2/O6 v0.3 remains CLOSED at logical-contract level and frozen.
- G5 remains OPEN for final C6/C7/C8/C9 identity and lineage approval.
- G6 remains OPEN for identity namespaces and complete task/episode lifecycle reconciliation.
- G9 remains OPEN for canonical equality, stage-state vocabulary, uncertain-commit recovery, retry and concurrency.
- G3-037/038 remain BLOCKED; G3-039 logical lineage remains fixture-tested but durable recording is open.
- G8/G10 physical persistence/security and G12 authorization remain separate.
- No runtime, tests, registry, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.

### Next concrete step
1. Review the field inventory against G6 and G5 source decisions.
2. Draft the logical G9 equality/state/recovery contract only where sources determine behavior.
3. Keep absent/null, scalar normalization, non-event collection ordering, timestamp precision, retry/concurrency mechanics and status transitions open until explicitly decided.
4. Do not implement persistence or modify the existing RPC.

Branch remains `refactor/professional-v1`; LIVE `main` untouched.


## 139. G9 source-determined logical stage contract baseline recorded

### Completed
- Re-read this handoff and confirmed the working branch is `refactor/professional-v1`; LIVE `main` remains untouched.
- Confirmed prior Full Regression #3359 / run ID `42505641953` GREEN on exact commit `cd0b62db48fe9079b1643db394d2cafb83d696f7` before beginning the next build step.
- Created `docs/curriculum/PacoGO_G9_Logical_Stage_Contract_Source_Determined_v0.1.md`. It consolidates only source-determined logical requirements from O5/O6 v0.3/O7/O8, C2, G6 and the C8/C9 crosswalk.
- Updated `PacoGO_Multi_Target_Implementation_Readiness_Matrix_v0.1.md` section 8.70.
- The contract separates determined invariants from unresolved decisions: O7's three idempotency boundaries and replay/conflict outcomes; immutable observation and target-assessment identities; source event ordering; immutable snapshot, distinct C6 evaluation and C7 decision lineage; stage-local atomicity/durable inspectable state; O5 UTC/half-open event-time and availability-cutoff semantics.
- It explicitly leaves G5 Stage C identity/atomic write-unit approval, G6 identity namespaces/lifecycle, canonical equality choices, stage-state vocabulary, uncertain-commit recovery, retry/concurrency and operation-timeout mechanics open. G8/G10 physical persistence/security and G12 authorization remain downstream prerequisites.

### Commits and Full Regression
- Source-determined G9 contract: commit `1271403de09bbe055b2ba6d3c0542bb444982dd6`; Full Regression #3360 / run ID `42506349687`: **GREEN** on exact commit.
- Readiness matrix section 8.70: commit `fffa4e8f305c379e4a4a6c35516b8d05e5badd52`; Full Regression #3361 / run ID `42506367094`: **GREEN** on exact commit.
- Both runs passed exact branch/triggering-SHA guard, dependency audit, Agenda/practice ownership boundaries, curriculum engine regression, architecture tests, Double or Nothing runtime regression, maintained Node/Vitest, browser regression and clean-working-tree verification.
- This handoff update is a project change; its own Full Regression must be run and verified before the block is closed.

### Gate status
- G5 remains OPEN for final C6/C7 identity and lineage approval and Stage C write-unit boundary.
- G6 remains OPEN for final observation/assessment identity namespaces and remaining administration lifecycle decisions.
- G9 remains OPEN for canonical equality details and durable stage-state/retry/concurrency/recovery contract.
- G3-037/038 remain BLOCKED; G3-039 logical lineage remains fixture-tested but durable recording is open.
- G8/G10 physical persistence/security and G12 implementation authorization remain separate prerequisites.
- No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed. O6 v0.3 remains frozen.

### Next concrete step
1. Inspect the exact open G5 and G6 decisions in their current source documents and owner decision records.
2. Produce a dependency/decision map showing which G9 choices are blocked by G5, which by G6, and which remain genuine G9 owner decisions after those dependencies.
3. Do not silently decide cross-gate identity, canonicalization, timeout, retry, concurrency or persistence behavior. Do not implement or modify the RPC.

Branch: `refactor/professional-v1`; LIVE `main` untouched.


## 140. Implementation Alignment & Build Phase 1 — repository audit baseline

### Audit baseline and method
- Branch: `refactor/professional-v1`.
- Exact HEAD at audit start: `62584ba81947e4516f03898f5c1e2c6758c88854`.
- Latest branch Full Regression at audit start: #3363 / run ID `42507549459`, conclusion `success`, exact same HEAD SHA. Browser regression and clean-working-tree verification were included in the workflow.
- The branch API independently confirmed that `refactor/professional-v1` points to this exact SHA. LIVE `main` was not changed.
- Read-only repository inventory: 135 files under `pacogo-engine`; 18 curriculum browser pages; 132 files under `docs/curriculum`; 320 test files, including 64 engine test files and 34 browser test files; 1,082 total Git-tree files.
- Rechecked the existing `PacoGO_G6_G7_Read_Only_Identity_and_Consumer_Audit_v0.1.md` against current source. Its main runtime, identity and persistence findings remain applicable. The comparison from its audited baseline showed the intervening implementation changes concentrated in the Addition Learning Interface and its representation-mapping path; the reviewed runtime/identity/persistence core files remain unchanged.
- No source code, tests, curriculum data, SQL/RPC/RLS, Supabase or learner data were changed during this audit.

### C1–C5 — research and measurement infrastructure
- C1–C3: empirical-pilot data validation, task-instance/observation/coding-input preparation, dataset snapshots and descriptive analysis helpers exist. `operational-assessment-contract.test.js` explicitly identifies itself as a fixture-only conformance harness, not a production assessor. No operational O6/C3 assessment runtime module was found in `pacogo-engine`.
- C4: candidate development-comparison and measurement-readiness modules exist, with tests. They validate supplied comparison/readiness results; they do not establish empirical developmental validity by themselves.
- C5: W0/W1/W2 feasibility, protocol and analysis validators exist. W0 requires a synthetic feasibility fixture; W1/W2 are explicitly design-only. W2 establishes repeated-measurement readiness/temporal-analysis readiness and explicitly blocks developmental-ordering, prerequisite, causal and mastery conclusions.
- These are useful research/pilot infrastructure, not evidence that the curriculum claims have been empirically validated.

### C6–C9 — modules exist, but the learner runtime does not consume them
- C6 mastery and C7 next-action modules exist with dedicated tests and an isolated C6→C7 test path.
- C8 student-model and C9 structural vertical-validation modules exist with adapters and tests.
- The active browser route remains `browser-vertical-slice.js → curriculum-registry.js → prototype.js`. The registry calls the generic `runCycle()` in `prototype.js`; it does not call the separate C6/C7 modules or the C8/C9 adapters.
- The current C6 result is keyed by `claim_id` only, so multiple results for the same claim in different branch contexts are not represented as distinct map entries.
- Current C8 validates learner/claim/development/scope identity, not the complete six-part branch identity. Its adapter derives an observation ID from `observed_at`.
- Current C9 validates a structural vertical slice with the same four-part identity and does not validate the proposed full snapshot/evaluation lineage. Its result explicitly does not prove developmental validity or empirical curriculum validity.
- Therefore C6–C9 are partially implemented candidate modules, not an integrated branch-specific learner decision runtime.

### Browser pages and Learning Interfaces
- 16 of the 18 curriculum pages call the shared browser vertical-slice runtime. The two clock demo pages use a separate clock interface/controller path.
- Five learner pages — B1 through B5 — use the learner-curriculum service to load history and persist the skill-cycle result. A1, B1 experimental/variant pages and FR2 pages use the runtime but do not use that persistence service.
- Existing reusable interface families include Number Line, Addition, Fraction, Clock, Quantity Representation and Division Representation. Their current separation varies: Number Line and Quantity/Division have distinct model/rendering modules; Addition and Fraction have contracts/controllers/renderers; the Clock interface combines DOM rendering and interaction handling inside its interface module.
- No Measurement or Ratio Learning Interface implementation was found in the current engine tree.
- Quantity Representation is currently used as a display representation in the inspected B3 learner path.
- FR2 is specifically the candidate skill “Breukequivalentie herkennen en gebruiken”. Its interface supports symbolic fractions and area models, but FR2 is not a complete fractions recovery curriculum. The five FR2 browser pages are not connected to the persisted learner-curriculum service.

### Persistence and learner-state boundaries
- The persisted B1–B5 path uses `src/services/learner-curriculum-service.js` and the committed `persist_curriculum_learning_cycle` RPC.
- The current RPC is one atomic write unit for one evidence row, one skill-level longitudinal-state upsert and one decision-trace row. The current database shape is scalar/skill-level, not the proposed staged observation → target-assessment → branch-decision model.
- Current duplicate handling checks whether the related evidence/state/trace rows exist for learner + source event. It does not compare the complete canonical immutable payload and therefore does not implement the G9 same-identity/same-payload replay versus different-payload integrity-conflict contract.
- The committed security migrations include guardian ownership checks, RLS-scoped writes, SECURITY INVOKER execution and transaction-local capability cleanup on success and error. This is source-code/migration evidence only; no deployed Supabase environment was inspected or certified.
- `student-evidence-store.js` is a simple in-memory helper exercised by engine tests; it is not the persistent store used by the B1–B5 learner pages.

### Implementation/contract crosswalk
| Area | Status | Exact finding |
|---|---|---|
| Existing skill-centric browser runtime | GEBOUWD | Used by 16 curriculum pages; routes through registry and `prototype.js`. |
| B1–B5 learner persistence | GEBOUWD | Loads/persists scalar skill evidence/state/decision through the existing service and RPC. |
| C1–C3 operational assessment | GEDEELTELIJK | Pilot/data-validation helpers and fixture conformance tests exist; production O6/C3 assessor runtime is absent. |
| C4–C5 research pipeline | GEDEELTELIJK | Candidate comparison, feasibility and design-only protocol/analysis validators exist; no empirical developmental conclusion is established. |
| C6–C9 branch decision chain | GEDEELTELIJK | Separate candidate modules/tests exist, but they are not integrated into the active browser runtime and do not yet satisfy the complete six-part snapshot/evaluation lineage. |
| Learning Interfaces | GEDEELTELIJK | Several reusable families exist; integration, state/evidence contracts and rendering separation are not uniform; Measurement/Ratio are absent. |
| FR2 fractions practice | GEDEELTELIJK | Fraction-equivalence interface and demos exist; no full fractions progression and no learner-curriculum persistence path. |
| Multi-stage persistence/idempotency | ONTWERP / GEDEELTELIJK | Logical O7/G9 direction exists; current scalar RPC does not implement staged canonical replay/conflict semantics. |
| Deployed Supabase state | ONDUIDELIJK | Committed migrations were inspected; deployed database state was not inspected. |

### Gates and next work
- The audit does not close G5, G6, G8, G9, G10 or G11. G5 branch-lineage approval, G6 complete identity/lifecycle approval and G9 canonical equality/stage recovery decisions remain open in the current source documents.
- G12 remains NOT AUTHORIZED. The readiness matrix requires G0–G11 before a narrow implementation authorization; runtime and persistence work require their own completed design/security gates. The uploaded Implementation Alignment handoff's Phase 4 must not be interpreted as permission to bypass these current gates.
- No implementation, test adjustment, registry change or Supabase change is authorized by this audit.
- Product priority remains to get Zyon effective mathematics practice quickly, especially fractions. The existing FR2 work is too narrow to represent a complete fractions recovery path. The next product-planning step is to define that learning progression from the existing curriculum/SLO basis and identify a bounded implementation slice; implementation starts only after the applicable gates and explicit G12 authorization are satisfied.
- The next engineering step is to reconcile the audit findings with G5/G6/G9 and the current owner-approved contracts, then prepare the exact gate package for a bounded implementation slice. Do not create another general architecture document; update this handoff or an existing contract only when a concrete decision requires it.



## 141. Fractions curriculum scope cross-check for Zyon

- Re-read `PacoGO_Curriculum_Rekenen_SLO_10-18_Mapping.md` against the current executable registry.
- The SLO mapping assigns KD10B (breuken) to FR1–FR2 plus relationships with A/B. Its scope includes the fraction as number/ratio/division, relationships with decimals/ratios/percentages, comparing/ordering/simplifying and calculating with fractions.
- Current executable registry v0.6 contains FR2 but not FR1. No FR1-named implementation or curriculum artifact path was found in the repository tree; this audit did not perform an exhaustive full-text search of every document for FR1 mentions.
- Current FR2 is specifically “Breukequivalentie herkennen en gebruiken”. Its interface supports symbolic fractions and area models. It does not cover the full KD10B scope and its browser pages are not connected to persisted learner-curriculum history.
- This is a source-based scope gap, not a decision to add curriculum content or a new skill. Do not expand FR2 informally to stand in for FR1 or the whole KD10B domain.
- Product-planning priority: define a coherent FR1–FR2 progression and its links to existing A/B skills from the SLO mapping; then select a small first practice slice based on an explicit learner starting-point check. Keep visual fraction representations central.
- No registry, curriculum, task catalogue, interface, test, runtime or persistence changes were made. G5/G6/G9 and G12 gates remain as recorded in section 140.
- Verification immediately before this handoff amendment: Full Regression #3364 / run ID `42510652470`, GREEN on exact commit `301cf6ca946d079622e7577e8b28b2888bfa470f`. This amendment itself requires a new Full Regression before it is considered verified.

Branch: `refactor/professional-v1`; LIVE `main` untouched.

## 142. G6 owner-approved lifecycle rules and regression verification

### Owner decision — 2026-11-08

The owner explicitly approved the following logical administration/attempt lifecycle rules:

- Ordinary answer edits, revisions and retries remain within the same response episode; they do not create a new attempt/observation.
- An explicit restart after completion is a new administration with a new task instance, response episode and immutable observation. The completed episode and its history remain preserved.
- Abandonment preserves the started episode's captured events/history and immutable raw observation. Abandonment alone must not fabricate a score or evidence result.
- A temporary interruption may resume the same task instance/response episode only if the exact same administration state is restored: same task content/version, presentation/representation, response mode, support condition and recorded progress/event history. If exact restoration is unavailable, do not resume the old episode as if unchanged.
- A material change to task content, presentation/representation, response mode or support condition is a new administration with a new task instance, response episode and observation. Neutral interface clarification that supplies no target reasoning is not itself a material support-condition change. The previously approved Tussentoets/Toets content-help boundary remains: the independent episode ends incomplete and supported practice is separately administered.
- Elapsed time alone never terminates an episode. Timeout termination is permitted only under an explicit, versioned task/session policy defining the timeout and its consequence. Without such a policy, there is no automatic timeout termination.

These are logical contract decisions only. They do not define physical IDs/keys, a snapshot/hash format, a universal timeout duration, persistence mechanics or runtime implementation.

### Contract updates

- Updated `PacoGO_Task_Observation_Identity_Lifecycle_Proposal_v0.1.md` to record the approved rules and distinguish them from the remaining open G6 work.
- Updated `PacoGO_G5_G6_G9_Dependency_Decision_Map_v0.1.md` so the G6 owner-approved rules are no longer described as candidate decisions.
- G6 remains OPEN. Remaining work includes policy-specific timeout definition before use, final lifecycle vocabulary/C3–O6 reconciliation, identity namespace/uniqueness scope, task-instance/episode cardinality finalization and operational verification of exact-state restoration.
- G5, G9, G8/G10 and G12 remain open/downstream as previously recorded. G12 implementation authorization has not been granted.
- No runtime, tests, curriculum registry/data, learner state, SQL/RPC/RLS, database or Supabase changes were made. No tests were changed.

### Regression and commit trail

- Previous matrix-status reconciliation commit: `20f4ee7970018c356ddc00ba1885c3a98d132c31`.
- Full Regression #3367, run ID `42511074361`, attempt 1 failed only at browser regression: the lesson-view canonical-shell test did not find the expected `.paco-template-version-badge` / `V7.0`; 58 browser tests passed. The other workflow stages passed.
- The failed browser job was rerun without code/test changes. Full Regression #3367, attempt 2, completed **GREEN** on the exact same commit `20f4ee7970018c356ddc00ba1885c3a98d132c31`. Browser regression and clean-working-tree verification both passed. The first failure was not reproduced; no root cause was established, so no code/test correction was made.
- G6 lifecycle proposal update: commit `edc8df09d4a96b2822a6761cb5db002cee01179c`.
- G5/G6/G9 dependency map update: commit `a559f1d3b906f3f88314fe94a1477f1d53e00e82`.
- This handoff update is itself a project change and requires its own Full Regression before this work block is considered verified.

### Next concrete step

Continue G5/G6/G9 contract work from the now owner-approved lifecycle baseline. Do not reopen the approved G6 lifecycle rules without a specific contradiction. Finish the remaining G6 identity/cardinality/C3–O6 reconciliation and G5 Stage C lineage/write-unit decisions, then address the genuine G9 canonical equality and durable recovery decisions. Do not implement runtime or persistence work until all required gates and explicit G12 authorization are satisfied.

Branch: `refactor/professional-v1`; LIVE `main` untouched.

## 143. G5 owner-approved Stage C C6/C7 record boundary

### Owner decision — 2026-11-08

The owner approved the G5 Stage C logical boundary:

- O7's three top-level idempotency boundaries remain unchanged: raw-observation ingestion, target-assessment evaluation/recording and decision evaluation.
- The immutable decision snapshot, C6 evaluation and C7 decision are distinct immutable logical records with distinct identities.
- C6 and C7 are separate ordered atomic writes within O7's existing decision-evaluation boundary. C7 may be committed only after the exact C6 evaluation it consumes has been committed.
- C7 preserves the exact six-part branch identity and snapshot/evaluation lineage; it does not recompute mastery or infer missing identity.
- If C7 fails, the committed C6 evaluation remains intact. A later C7 retry consumes that exact C6 evaluation without rerunning, rewriting or replacing C6.
- This is not a fourth O7 top-level idempotency boundary and not one shared indivisible C6/C7 write unit.

The decision is logical only. It does not select physical ID formats/namespaces, final field names, database keys/tables, canonical serialization/hash, transaction technology/layout, retry/backoff, concurrency/locking or persistence implementation.

### Repository documents updated

The decision is recorded in existing repository artifacts; no parallel architecture document was created:

- `PacoGO_G5_G6_G9_Dependency_Decision_Map_v0.1.md`: G5 Stage C boundary marked owner-approved; G9 dependency table and sequencing now leave only field names, uniqueness scopes and complete payload details open.
- `PacoGO_Multi_Target_Owner_Architecture_Decisions_v0.1.md`: added owner decision G5-S2 under the existing O7/O8 architecture baseline.
- `PacoGO_C6_Mastery_Decision_Protocol_v0.1.md`: records C6 as a separate immutable evaluation record with exact branch/snapshot/evidence lineage and its own atomic commit.
- `PacoGO_C7_Next_Action_Decision_Protocol_v0.2.md`: records the distinct C7 decision identity, exact committed C6 dependency, retry behavior and unchanged O7 boundary.
- `PacoGO_G9_Logical_Idempotency_Contract_Candidate_v0.1.md`: Stage C now applies replay/conflict per immutable C6/C7 record; a failed C7 write leaves C6 committed.
- `PacoGO_Multi_Target_Implementation_Readiness_Matrix_v0.1.md`: updated G5 closure status, approved partial-failure example, G9 dependencies and historical reconciliation notes.

C8 v0.2 and C9 v0.2 already carried separate C6 evaluation and C7 decision references; they were reviewed and not changed in this block. Their full cross-protocol reconciliation remains a G5 deliverable.

### Commits and Full Regression

All changes were documentation-only and made on `refactor/professional-v1`. Each commit below was tested by Full Regression on that exact commit:

| Run | Commit | Result |
|---|---|---|
| #3371 | `7ec61cc08c43b49e846ab0d97a8c016fff10dc29` | GREEN |
| #3372 | `4e039de5626adbe4cde29c87dd396e00bd0a1ad6` | GREEN |
| #3373 | `d62e64bb460f5a451bf600aa8e7b2b6abe5c884c` | GREEN |
| #3374 | `09adcb8a0a21c14d978d00d8ac251fd04f027681` | GREEN |
| #3375 | `57ee0ba01d590d2db32028e8db8ca7026699f764` | GREEN |
| #3376 | `2e365f0b27750d723cb6d8d52cb36e32a4e45db5` | GREEN |
| #3377 | `2a1ae64ad80ea21e8d0892bd16599bb98d856d39` | GREEN |
| #3378 | `53a32f2cd02623afd5241f93a7bbd0a16a298457` | GREEN |

The verified runs passed the required curriculum-engine, architecture-boundary, Double or Nothing, maintained Node/Vitest, browser regression and clean-working-tree steps. No runtime, tests, registry, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.

### Gate status and next step

- **G5 remains OPEN** for final C6/C7/C8/C9 protocol-version reconciliation, final field names and exact cross-stage references/provenance, O6 input/version alignment, positive/negative/missing/mismatch test vectors, negative permissions and legacy/scalar disposition.
- **G6 remains OPEN** for identity namespace/uniqueness, task-instance/episode cardinality, final C3/O6 reconciliation, policy-specific timeout configuration, lifecycle vocabulary and operational exact-state restoration verification. The owner-approved lifecycle rules in section 142 remain settled.
- **G9 remains OPEN** for canonical equality, payload envelopes, durable stage-state vocabulary, uncertain-commit recovery, retry and concurrency semantics.
- G8/G10 physical persistence/security and G12 narrow implementation authorization remain downstream. **G12 implementation authorization has not been granted.**
- No runtime or persistence implementation is authorized by this decision.

**Next concrete step:** continue the G5 cross-protocol reconciliation from the owner-approved C6/C7 boundary. Compare C6, C7, C8 and C9 field-by-field for exact inputs, outputs, branch/snapshot/evaluation/decision references, protocol provenance and rejection behavior. Record only source-supported agreements; keep unresolved names and mechanics open. Then finish G6 identity/cardinality reconciliation before freezing G9. Do not implement runtime or persistence and do not modify Supabase.

Branch: `refactor/professional-v1`; LIVE `main` untouched. The latest verified pre-handoff commit is `53a32f2cd02623afd5241f93a7bbd0a16a298457`, Full Regression #3378 GREEN. This handoff amendment itself requires Full Regression on its resulting commit.

## 144. G5 cross-protocol reconciliation audit after Stage C approval

### Read-only comparison completed

Compared the current C6 v0.1, C7 v0.2, C8 v0.2, C9 v0.2 and G9 candidate against the owner-approved G5 Stage C boundary and O7/O8.

Confirmed common logical requirements:
- C6 owns the seven-gate mastery evaluation and five existing outcomes; its immutable evaluation record carries one complete six-part branch, exact snapshot, consumed observation/target-assessment references, protocol provenance and gate trace.
- C7 consumes the exact committed C6 result, preserves branch/snapshot/evaluation lineage, keeps prerequisite and next-development ordering separate, and owns a distinct decision identity and decision trace.
- C8 consumes committed C6/C7 outputs descriptively. Its proposal names `decision_snapshot_id`, `c6_evaluation_id`, `c7_decision_id` and `c8_item_id`.
- C9 validates the exact six-part branch and snapshot → C6 → C7 → C8 lineage and rejects missing/mismatched references rather than repairing them.

Recorded in the existing `PacoGO_G5_G6_G9_Dependency_Decision_Map_v0.1.md` as unresolved G5 reconciliation items:
1. C6/O8 uses generic `evaluation_id`; C8/C9/G9 use `c6_evaluation_id`. C7's own protocol describes its identity generically while C8/C9 use `c7_decision_id`. Final logical field naming/uniqueness scope is not yet owner-approved.
2. C7's candidate-action list uses `HOLD_FOR_MORE_EVIDENCE`, while some decision-flow prose uses `HOLD`; C8 stores the exact C7 `next_action`. Do not silently normalize.
3. C7's first vertical-slice example still uses claim-keyed `mastery_state_by_claim`. This is explicitly qualified as a non-canonical prototype; it cannot satisfy the six-part branch/snapshot/evaluation envelope or be used as the canonical adapter implementation spec. G5/G7 must resolve adapter ownership and compatibility.
4. C8 is described as a descriptive projection of committed C6/C7 history, but its proposal also defines stable `c8_item_id`, append-only history items and replay/conflict behavior. Whether this is a derived read projection or a separately persisted record/write unit remains open. Do not infer a fourth O7 boundary.
5. C8/C9 mention coder/round/adjudication provenance where relevant. O1/O6 keep PacoGO as the single operational assessor and exclude human coder/adjudication workflows from learner runtime. G5 must scope such provenance to genuine historical/external records if applicable; no second-assessor learner workflow is introduced.
6. C6/C7/C8/C9 protocol versions and missing/mismatch/legacy rejection behavior still need one consistent approved crosswalk.

These are source-reconciliation findings, not additional owner decisions. C6 mastery gates, C7 action policy, C8 descriptive-only authority, C9 structural-only authority and frozen O6 v0.3 remain unchanged.

### Additional contract clarifications

- Corrected C6 protocol section numbering after adding its approved Stage C record boundary.
- Added an explicit C7 warning that its claim-keyed first vertical slice is a prototype, not a canonical branch-safe adapter contract.
- No C8/C9 protocol edit was necessary for the already explicit snapshot/C6/C7 references; their remaining status is proposal/owner-review, not implementation approval.

### Commits and Full Regression

- C6 section-number correction: commit `dbeecf98e90bdab165b2059f9c41ae4a599be7f3`; Full Regression #3380: **GREEN** on exact commit.
- C7 prototype-slice qualification: commit `92f2fec37254f0b2b7ce68f43dcaf76a86f7077e`; Full Regression #3381: **GREEN** on exact commit.
- G5 cross-protocol audit findings: commit `35051446fd7cb426b0df98066c0554ff33065bff`; Full Regression #3382: **GREEN** on exact commit.

All required regression steps passed, including browser regression and clean-working-tree verification. These changes were documentation-only. No runtime, tests, registry, learner state, database, SQL/RPC/RLS, Supabase or learner data changed.

### Next owner decision proposed — not yet approved

The C8/C9 crosswalk already uses these explicit logical names:
- `decision_snapshot_id`;
- `c6_evaluation_id`;
- `c7_decision_id`.

**Recommendation:** standardize the C6–C9 logical field names on those three names, and treat O8's `evaluation_id` as the generic description of the C6 evaluation identity rather than a second competing field name. This is only logical field naming; it does not choose physical IDs, keys, serializers or storage.

Do not record this recommendation as an owner decision until explicitly approved. The C8 derived-versus-persisted history boundary and other audit findings remain separate open decisions.

### Current gate status and next step

G5 remains OPEN for the six reconciliation items above. G6 remains OPEN for identity namespace/uniqueness, task-instance/episode cardinality, C3/O6 reconciliation, policy-specific timeout configuration, lifecycle vocabulary and operational exact-state restoration. G9 remains OPEN for canonical equality, payload envelopes, stage-state vocabulary, uncertain-commit recovery, retry and concurrency. G8/G10 and G12 remain downstream; G12 implementation authorization is not granted.

Branch: `refactor/professional-v1`; LIVE `main` untouched. Latest verified pre-handoff commit: `35051446fd7cb426b0df98066c0554ff33065bff`, Full Regression #3382 GREEN. This handoff amendment itself requires Full Regression on its resulting commit.

## G5-S3 — Official logical Stage C identity field names

**Owner decision: approved 2026-11-08.** The official logical field names are:

- `decision_snapshot_id` — identity/reference for the immutable decision snapshot;
- `c6_evaluation_id` — identity/reference for the immutable C6 mastery evaluation;
- `c7_decision_id` — identity/reference for the immutable C7 next-action decision.

O8's `evaluation_id` is the generic historical/source term for the C6 evaluation identity; it is not a second identity and must be interpreted as `c6_evaluation_id` in the reconciled cross-stage logical contract. C7's own decision identity is distinct and is named `c7_decision_id`.

This approval standardizes **logical field names only**. It does not decide physical ID formats, generation, namespaces or uniqueness scopes, database columns/keys/tables, serialization, hashing, storage, transactions, retry/concurrency mechanics or persistence APIs. Those remain assigned to their existing G6/G9/G8/G10 gates.

This decision resolves only G5's logical field-naming item. It does not close G5, G6 or G9; does not alter the approved Stage C record/write boundary; and does not authorize runtime, tests, schema, SQL/RPC/RLS, database or Supabase changes. G12 remains NOT AUTHORIZED.

## G5-S4 — C7 HOLD vocabulary: source-reconciled clarification

**Finding: source-derived; no separate owner policy decision is required for the current C7 v0.2 contract.**

The active C7 v0.2 candidate-action list (§3) defines exactly six candidate actions. Its only hold action is `HOLD_FOR_MORE_EVIDENCE`. The unqualified word `HOLD` appears in §6's explanatory decision-flow sketches; it is not defined there as a separate candidate action, decision-result enum, or persisted status.

This interpretation is corroborated by the existing C7 v0.2 validation matrix and maintained engine contract:
- `PacoGO_C7_Decision_Test_Matrix_v0.1.json` (matrix version 0.2) expresses each hold scenario as `expected.candidate_action = HOLD_FOR_MORE_EVIDENCE`;
- `pacogo-engine/c7-contracts.js` defines `HOLD_FOR_MORE_EVIDENCE` as the only hold candidate;
- `pacogo-engine/c7-next-action-decision.js` emits that candidate for insufficient evidence, unusable/unassessed mastery, unsupported/uncertain ordering and unauthorized next actions;
- maintained C7 tests assert the exact candidate value; they do not define or accept a separate `HOLD` candidate;
- C8 v0.2 stores the exact C7 output in `next_action`, without reinterpretation.

**Reconciled meaning:** in C7 v0.2 explanatory flow prose, `HOLD` is shorthand for selecting the explicit candidate action `HOLD_FOR_MORE_EVIDENCE`. It is not a seventh action, separate terminal status, or alternative serialized value. The decision reason and gate continue to explain why that candidate was selected. When a C7 output is recorded or passed downstream, the exact candidate value `HOLD_FOR_MORE_EVIDENCE` is preserved.

This clarification does not change the action policy, candidate set, gate behavior, decision reasons, C6 mastery outcomes, C8 descriptive authority or C9 validation authority. It does not authorize runtime/test changes, schema, SQL/RPC/RLS, persistence or Supabase work. Existing engine and test artifacts were inspected read-only; no code or tests were changed.

**G5 effect:** the HOLD vocabulary ambiguity is resolved at the logical contract level by the active protocol, validation matrix and maintained engine/test evidence. G5 remains OPEN for its other reconciliation deliverables. G6/G9 remain OPEN; G12 remains NOT AUTHORIZED.

## G5-S5 — C6→C7 adapter ownership and prototype-path audit

**Status: owner decision approved 2026-11-08; existing paths remain non-canonical prototypes.**

### Existing source paths inspected

1. `pacogo-engine/c6-c7-adapter.js` exports `validateC6SafetyBoundary` and `createC7InputFromC6`. It selects `c6Result.mastery_state_by_claim[options.claim_id]`, requires caller-supplied C7 context, and checks the supplied current development against the selected C6 result.
2. `pacogo-engine/c7-from-c6.js` exports `validateC6ResultForC7` and `buildC7InputFromC6`. It also selects `c6_result.mastery_state_by_claim[claim_id]`, but derives current development from the selected C6 result. It separately validates ordering/alternative states before building the C7 input.
3. Both paths enforce the existing C6 safety flags and construct the same general claim/development-keyed C7 input shape. They are distinct modules with overlapping adapter responsibility and different function/input contracts.
4. The maintained tests for each adapter exercise the corresponding path. `c6-c7-vertical-slice.test.js` and `c8-c9-real-vertical-slice.test.js` exercise `buildC7InputFromC6` from `c7-from-c6.js`. This proves test-fixture usage, not production runtime ownership.
5. `pacogo-engine/c8-c9-adapter.js` is a separate downstream bridge. It accepts either a claim-keyed C6 result plus claim ID or an already normalized claim result, then checks claim/development alignment and maps the C7 `candidate_action` to C8's `next_action`. It does not establish canonical six-part branch/snapshot/C6/C7 identity lineage.

### Contract gap established

The current C6 engine result exposes `mastery_state_by_claim` and safety flags, but no immutable `decision_snapshot_id`, `c6_evaluation_id` or complete six-part branch envelope. The current C7 engine output similarly contains claim/development, candidate action, reason, gate, supporting evidence and safety flags, but no `c7_decision_id` or exact upstream lineage references.

Therefore neither existing C6→C7 adapter can be designated the canonical Stage C adapter merely because its tests pass. Both are claim-keyed prototype paths, consistent with the explicit non-canonical warning in C7 v0.2 §9. The downstream C8/C9 adapter is also a prototype bridge, not a canonical lineage adapter.

### Ownership boundary and recommendation

- **G5 owns** the logical C6→C7 input/output envelope and exact lineage requirements, under the already approved Stage C record boundary and official names `decision_snapshot_id`, `c6_evaluation_id`, `c7_decision_id`.
- **G7 owns** consumer compatibility, inventory of existing call paths, and any explicit deprecation/transition plan. G7 must not choose a logical contract by implementation convenience.
- **G12 remains the only narrow implementation-authorization gate.**

**Owner decision approved 2026-11-08:** retain both existing C6→C7 adapters and the downstream C8/C9 bridge explicitly as non-canonical prototype/test paths. No existing path is designated as the canonical Stage C adapter. The canonical adapter must be defined from the reconciled full Stage C lineage envelope after G5/G7 reconciliation. Do not delete, merge, refactor or route runtime traffic based on this decision. No code or tests were changed; no runtime, curriculum, registry, learner state, schema, database, SQL/RPC/RLS or Supabase was changed. The existing adapters were inspected read-only.

**Decision effect:** adapter ownership is resolved only to the extent that all three existing paths remain non-canonical. G5 still owns the logical adapter envelope; G7 still owns consumer compatibility and migration/deprecation planning. This decision does not select a canonical adapter, change runtime routing, or authorize implementation.

## 145. G5 owner decision — existing C6/C7/C8/C9 adapters remain non-canonical

### Decision and rationale
The owner approved retaining both existing C6→C7 adapter paths and the downstream C8/C9 bridge as non-canonical prototype/test paths. No existing adapter is designated the canonical Stage C adapter.

The source audit established that the two C6→C7 adapters have overlapping responsibility but different input/function contracts, and that their maintained test usage does not establish production ownership. The downstream C8/C9 bridge also lacks the complete six-part branch/snapshot/C6/C7 lineage envelope. None can therefore be promoted to canonical status by inference or implementation convenience.

The canonical adapter contract must be derived from the reconciled full Stage C lineage envelope under G5. G7 owns consumer compatibility, existing call-path inventory and any later deprecation/transition plan.

### Scope and permissions
- Retain all three existing code paths unchanged as non-canonical prototype/test paths.
- Do not delete, merge, refactor, select, or route runtime traffic to any of them on the basis of this decision.
- No runtime, test, registry, learner-state, schema, database, SQL/RPC/RLS, Supabase or learner-data changes.
- G5 remains OPEN for the remaining protocol/lineage reconciliation items; G6 and G9 remain OPEN.
- G12 remains NOT AUTHORIZED. This decision is not implementation authorization.

### Verification
- Owner decision documentation commit: `87d8ca4d7963c1fae633d115ab04fb92881fedcd`.
- Full Regression #3387 / run ID `42555852084`: **GREEN** on that exact commit. Exact branch/triggering-commit guard, dependency installation and vulnerability check, Agenda/practice ownership boundaries, curriculum engine, architecture boundary tests, Double or Nothing, maintained Node, maintained Vitest, Chromium installation, fixture server, browser regression and clean-working-tree verification all passed.
- Full Regression #3386 / run ID `42555632006`: **GREEN** on the preceding audit commit `bc2dcfcebccd38b154b9f7a27347dbcb218e6c72`.

### Next concrete step
Continue G5 with a source-by-source C6/C7/C8/C9 protocol reconciliation: compare required inputs, outputs, exact branch/snapshot/evaluation/decision references, version provenance, and rejection behavior. Record only source-supported alignment and isolate unresolved differences. Do not implement runtime or persistence. G12 remains the implementation gate.

Branch: `refactor/professional-v1`; LIVE `main` untouched. Latest verified commit: `87d8ca4d7963c1fae633d115ab04fb92881fedcd`, Full Regression #3387 GREEN. This handoff verification update requires its own Full Regression.


## 146. G5 source-by-source reconciliation — C6/C7/C8/C9 follow-up

### Verification baseline

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Prior verified baseline: commit `efc860bf678927022c2d8d9a3bff931d49239f6f`, Full Regression #3388 / run ID `42556057022`: **GREEN**.
- Documentation reconciliation commit: `4d6c8f37e83fb382f70032e4e2d98ab6dfc6e932`.
- Full Regression #3389 / run ID `42556670623`: **GREEN** on that exact commit. Branch/SHA guard, dependency/vulnerability checks, ownership boundaries, curriculum engine, architecture, Double or Nothing, Node, Vitest, Chromium, fixture server, browser regression and clean working-tree verification all passed.
- Full Regression #3390 / run ID `42557051176`: **GREEN** on exact handoff commit `6a2f4b6e5b72e8bd5edc0f79ca09554e88b87fd6`, including all required checks through browser regression and clean working tree.

### Read-only reconciliation findings

The active protocol set was compared directly: C6 v0.1, C7 v0.2, C8 v0.2, C9 v0.2, G5 dependency map, G9 payload inventory/source-determined contract, C3 v0.2 proposal and the maintained readiness matrix.

**Resolved and aligned with recorded decisions/source authority:**
- G5-S3 official logical identity names: `decision_snapshot_id`, `c6_evaluation_id`, `c7_decision_id`. O8's `evaluation_id` is the generic C6 identity term.
- C6/C7 are separate immutable records and separate ordered atomic writes inside O7's existing decision-evaluation boundary. C7 consumes the exact committed C6 record; failure of C7 does not rewrite or rerun C6.
- G5-S4: C7's only hold candidate is `HOLD_FOR_MORE_EVIDENCE`; prose `HOLD` is shorthand.
- G5-S5: both C6→C7 adapter modules and the C8/C9 bridge remain non-canonical prototype/test paths. No canonical adapter/runtime route is selected.
- Operational assessment is performed by PacoGO as the single operational assessor. The former C3 human-coder/independent-coding/adjudication model is withdrawn for learner-runtime architecture. C8/C9 references to coder/round/adjudication can only preserve genuinely applicable historical/external provenance, not introduce a human second-assessor workflow.

**Remaining open items:**
1. C8 v0.2 defines a descriptive projection/history over committed C6/C7 records, but also specifies `c8_item_id`, append-only items and replay/conflict behavior. Owner disposition is required on derived read projection versus a separately persisted record/write unit. Do not assume a fourth O7 top-level boundary or physical storage.
2. C8/C9 assessment provenance fields must be aligned to frozen O6 v0.3. Operational provenance must identify PacoGO's applicable assessment engine/rule versions; optional human coder/adjudication references are historical/external only. Historical compatibility details remain to be reconciled with G6/G7.
3. Reconcile protocol versions as one proposed set: C6 v0.1, C7 v0.2, C8 v0.2 and C9 v0.2. C8's reject/quarantine-from-canonical-summary wording and C9's canonical-chain rejection/legacy historical validation need an explicit shared stage-attributed disposition.
4. Approve cross-stage positive, negative, missing and mismatch examples and complete legacy/scalar compatibility disposition. O6 v0.3 remains frozen; do not invent assessment labels or reopen it.

### G9 source-document correction

The G9 source-determined contract previously said G5 had not decided whether C6/C7 were one or separate atomic writes. That sentence was stale. It now reflects the 2026-11-08 owner-approved separate ordered atomic-write boundary and approved logical identity names. G9 equality, namespace, retry/concurrency and recovery decisions remain open.

### Scope and next step

This was a documentation/source-reconciliation change only. No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed. G5/G6/G9 remain OPEN; G12 remains NOT AUTHORIZED.

Next concrete step: prepare the owner decision brief for the C8 history boundary, grounded in the exact C8 v0.2 text and O7's three existing boundaries. Present the derived-read-model and separately persisted-record alternatives, consequences for `c8_item_id` and replay/conflict semantics, and a recommendation without recording it as approved. Do not implement.


## 147. G5 C8 history boundary — owner decision brief prepared

### Source reconciliation baseline

- C6 v0.1 §8 and C7 v0.2 §8 define distinct immutable C6/C7 records and separate ordered atomic writes within O7's existing decision-evaluation boundary.
- C8 v0.2 §§1–2 and §10 describe C8 as descriptive: it consumes committed C6/C7 outputs and does not create mastery, select actions or mutate learner state.
- C8 v0.2 §§5.2, 6 and 9 nevertheless define a stable `c8_item_id`, append-only history items, and replay/conflict behavior.
- C9 v0.2 §§5.5–6 and §10 validates the exact snapshot → C6 → C7 → C8 lineage and returns structural validation results; it does not repair records or create decisions.
- G5 map §3 and §5 retain the C8 history read/write boundary as an owner decision. No fourth top-level O7 boundary is approved.

### Decision brief

Created `PacoGO_G5_C8_History_Boundary_Decision_Brief_v0.1.md` with three logical alternatives: derived read projection, rebuildable/materialized read model, or separately persisted authoritative C8 history record. It explains the consequences for `c8_item_id`, append-only history, replay/conflict handling, failure/recovery, C9 validation and O7 boundaries.

**Recommendation only — NOT an owner decision:** define C8 as a descriptive, non-authoritative read projection of committed C6/C7 records. Any later materialization should be a rebuildable G8 read-model/cache choice, not an independent authoritative C8 write unit. C8 replay/conflict should inherit the immutable C6/C7 source-record semantics. Do not assign `c8_item_id` an independent durable identity or idempotency role; if a read model needs a row handle, its projection-local nature and derivation must be explicitly specified without inventing the still-open canonical serializer.

The owner has not yet approved this recommendation. G5 remains OPEN; G6/G9 remain OPEN; G12 remains NOT AUTHORIZED. No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed.

### Verification

- Prior handoff commit `6a2f4b6e5b72e8bd5edc0f79ca09554e88b87fd6`: Full Regression #3390 / run ID `42557051176` **GREEN** on exact commit.
- Full Regression #3391 / run ID `42557216641`: **GREEN** on exact decision-brief commit `58703ef599e5d2bcec8a9172b27576c3d9b0f4cc`. Branch/SHA guard, dependency/vulnerability checks, ownership boundaries, curriculum engine, architecture, Double or Nothing, Node, Vitest, Chromium, fixture server, browser regression and clean-working-tree verification all passed.

### Next step

Present the recommendation and alternatives for explicit owner disposition. Until approved, retain the C8 boundary as OPEN and do not change C8/C9 protocols or implement any persistence/read-model behavior.


## 148. G5 C8 history boundary — decision brief verification

### Verification of the decision-brief commit

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Decision-brief commit: `58703ef599e5d2bcec8a9172b27576c3d9b0f4cc`; Full Regression #3391 / run ID `42557216641`: **GREEN** on that exact commit.
- Handoff verification commit: `8caa0e43b6e91a63fc7d9e4c16954b18747d1622`.
- Full Regression #3392 / run ID `42557882155`: **GREEN** on exact commit `8caa0e43b6e91a63fc7d9e4c16954b18747d1622`. The branch/triggering-commit guard, dependency installation, zero-known-vulnerability check, Agenda/practice ownership boundaries, curriculum engine regression, architecture boundary tests, Double or Nothing runtime regression, maintained Node and Vitest regressions, Chromium installation, fixture server, browser regression and clean-working-tree verification all completed successfully.

### Current status and next owner action

The C8 history-boundary recommendation remains **NOT APPROVED**. The brief recommends Option A (derived, non-authoritative read projection), but the owner's prior instruction to continue is not approval of that decision. G5 remains OPEN; G6/G9 remain OPEN; G12 remains NOT AUTHORIZED.

Next concrete step: present the three alternatives and the Option A recommendation for explicit owner disposition. Until the owner explicitly chooses, do not update the logical C8 contract, choose persistence semantics, alter runtime/tests/schema, or treat any option as approved.

This handoff update records verification only. It changes no runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data.


## 149. G5 C8 history boundary — owner decision approved

The owner approved **Option A: C8 is a derived, descriptive, non-authoritative read projection over committed C6/C7 records** and explicitly chose to **remove `c8_item_id` as an authoritative domain identity**. Logical source lineage is the exact six-part branch identity plus `decision_snapshot_id`, `c6_evaluation_id` and `c7_decision_id`. C8 has no independent authoritative history record, write unit, idempotency key or replay/conflict lifecycle. Append-only history is inherited from immutable C6/C7 source records. Reprojection must not duplicate, mutate or reinterpret those source decisions. No fourth O7 top-level boundary is introduced.

Option B remains a possible future G8 physical optimization only if needed; any materialized read model must be rebuildable and non-authoritative. A technical row handle is projection-local, not a domain identity. Physical storage, refresh, query optimization, canonical equality/serialization and security remain open under G8/G9.

**Dependencies:** G5's C8 logical boundary is RESOLVED; G5 remains OPEN for protocol-version/rejection crosswalk, C3/O6 provenance, examples and legacy compatibility. G9 must not define C8-specific authoritative identity/write/idempotency semantics; it retains actual O7-stage equality/recovery/retry/concurrency and C9 validation/disposition alignment. G8 may later assess rebuildable materialization. G6 remains unchanged and OPEN. G12 remains NOT AUTHORIZED. Documentation only; no runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changes.

Prior baseline: commit `c6c1e299dd0c4e099224bd39f0ca63197619296e`, Full Regression #3393 / run ID `42558193355` GREEN on that exact commit. This decision documentation update requires its own Full Regression. Next step after verification: finish G5's remaining protocol/rejection, provenance, examples and legacy compatibility reconciliation. No runtime implementation.


## 150. G5 C8 owner decision — Full Regression verification

### Decision-documentation commit verified

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Owner-decision documentation commit: `8cd8ef014084397b130dbe5604f0e637e237ac1a`.
- Full Regression #3394 / run ID `42558789377`: **GREEN** on that exact commit.
- Verified branch and triggering SHA; dependency installation and zero-known-vulnerability check; Agenda/practice ownership boundaries; curriculum engine regression; architecture boundary tests; Double or Nothing runtime regression; maintained Node and Vitest regressions; Chromium installation; fixture server; browser regression; and clean working tree.

### Documentation consistency review

The C8 decision brief, G5/G6/G9 dependency map, G9 logical payload inventory and G9 source-determined stage contract were read back from the branch after commit. They consistently record Option A, remove `c8_item_id` as an authoritative domain identity, preserve the exact six-part branch plus snapshot/C6/C7 lineage, and keep C8 non-authoritative with no independent write/idempotency boundary. The G5 C8 logical boundary is RESOLVED; remaining G5 protocol/rejection, O6 provenance, examples and legacy compatibility work remains OPEN. G6/G9 remain OPEN; G12 remains NOT AUTHORIZED.

### Scope and next step

This was documentation-only. No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed. No implementation authorization was granted. Next: continue G5 source-by-source reconciliation of the remaining protocol-version/rejection crosswalk, C3/O6 provenance alignment, positive/negative/missing/mismatch examples and legacy compatibility. Do not implement.

This handoff verification update itself requires a separate Full Regression on its exact commit.


## 151. G5 C8 decision — handoff verification regression

### Verification

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Handoff commit `3d1c0b5f04bafaeacc747feddb263d643f5120b3`: Full Regression #3395 / run ID `42560647963`: **GREEN** on that exact commit.
- All workflow steps passed: exact branch/SHA guard, dependency installation, zero-known-vulnerability check, Agenda/practice ownership boundaries, curriculum engine regression, architecture boundary tests, Double or Nothing runtime regression, maintained Node and Vitest regressions, Chromium installation, fixture server, browser regression and clean-working-tree verification.

### Current project position

The approved C8 logical boundary remains RESOLVED: derived, descriptive, non-authoritative projection over committed C6/C7 records; no authoritative `c8_item_id`, independent C8 write/idempotency boundary or fourth O7 top-level boundary. The decision and dependency updates are recorded in the branch documentation and verified by Full Regression #3394; this handoff verification is verified by #3395.

Remaining work is G5 source-by-source reconciliation: protocol-version and stage-attributed rejection crosswalk; C3/O6 provenance alignment; positive, negative, missing and mismatch examples; and legacy/scalar compatibility. G6 and G9 remain OPEN. G12 remains NOT AUTHORIZED. No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changes are authorized by these decisions.

### Next concrete step

Resume G5 with a source-by-source protocol/rejection crosswalk across C6 v0.1, C7 v0.2, C8 v0.2, C9 v0.2 and frozen O6 v0.3. Separate direct source statements from unresolved or conflicting wording; attribute every rejection to its owning stage and do not invent shared behavior. Then reconcile provenance, examples and legacy compatibility. No implementation.


## 152. G5 Stage C protocol/rejection crosswalk audit prepared

### Verification baseline

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Handoff verification commit `848b50ef41ea05936532b0fdead78e6f543cc538`: Full Regression #3396 / run ID `42563135457`: **GREEN** on that exact commit. All required steps passed, including Chromium, fixture server, browser regression and clean-working-tree verification.

### Source-by-source audit

Created `PacoGO_G5_C6_C7_C8_C9_Protocol_Rejection_Crosswalk_Audit_v0.1.md` as a source-derived draft for owner review. It compares C6 v0.1, C7 v0.2, C8 v0.2, C9 v0.2, frozen O6 v0.3 and the superseded C3 v0.2 candidate material. The dependency map now points to this audit.

Principal findings:
- C6 inference outcomes, O6 assessment/execution states, C7 candidate actions, C8 projection eligibility and C9 structural validation failures are different domains; they must not be collapsed into a generic reject/hold status.
- C7 `HOLD_FOR_MORE_EVIDENCE` is a pedagogical candidate action, not a structural error code.
- Under the approved C8 derived-projection decision, C8 cannot durably quarantine or maintain an independent conflict/replay lifecycle. The precise ownership of projection-local diagnostics remains open.
- C9 reports exact stage/record mismatches; it does not repair or write.
- O6 v0.3 requires O6/C3 contract, target-rule and assessment-engine provenance. C3 v0.2 human-coder workflow assumptions are explicitly withdrawn for learner runtime and are not an approved canonical operational codebook.
- C6 M1/M2 consumption of O6's separate alignment/relation dimensions and non-scored adequacy profile remains unresolved.
- Positive, negative, missing, structural mismatch, late-arriving and legacy examples are drafted as logical examples only, not approved executable fixtures.

### Current status and next step

The audit is a documentation-only draft, not a frozen cross-stage contract or owner decision. G5 remains OPEN for owner review of stage-attributed rejection/C8 diagnostics, operational provenance terminology, C6 M1/M2 consumption, examples and legacy/scalar compatibility. G6/G9 remain OPEN; G12 remains NOT AUTHORIZED. No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed.

Next: obtain owner disposition on the bounded logical choices identified in audit §8. Do not alter frozen O6 v0.3, invent a C3 codebook version, implement runtime or add persistence.


## 153. G5 protocol/rejection crosswalk — regression verification

### Verification

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Audit commit `37866c6ff90d7ce8d5ff44605075f34719516633`: Full Regression #3397 / run ID `42563323724`: **GREEN** on that exact commit.
- Integrated audit + dependency-map + handoff commit `621c24452eb4991f1fab3c9f79e3fd3fc7e9a956`: Full Regression #3398 / run ID `42563358426`: **GREEN** on that exact commit.
- Both runs passed exact branch/SHA guard, dependency and vulnerability checks, Agenda/practice ownership boundaries, curriculum engine, architecture, Double or Nothing, Node, Vitest, Chromium, fixture server, browser regression and clean-working-tree verification.

### Verified audit state

The audit `PacoGO_G5_C6_C7_C8_C9_Protocol_Rejection_Crosswalk_Audit_v0.1.md` and its dependency-map/handoff references are committed and regression-verified. It remains a source-derived draft for owner review, not a frozen protocol set. It preserves the approved C8 projection boundary and frozen O6 v0.3.

G5 remains OPEN for owner disposition on stage-attributed rejection/C8 projection diagnostics, operational assessment provenance terminology, C6 M1/M2 consumption of O6, and the draft examples/legacy compatibility. G6/G9 remain OPEN; G12 remains NOT AUTHORIZED. No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed.

### Next concrete step

Obtain owner disposition on the bounded choices in audit §8. Only after that should the approved cross-stage wording be incorporated into the protocol documents. Do not infer owner approval from the audit or regression results; do not implement.

## 154. G5 protocol/rejection crosswalk — handoff verification

### Verification

- Branch: `refactor/professional-v1`; LIVE `main` untouched.
- Handoff/audit verification commit `1266614c314daa265f80bd799363aa8f39eb35b9`: Full Regression #3399 / run ID `42563484630`: **GREEN** on that exact commit.
- Verified exact branch and triggering SHA; dependency installation and zero-known-vulnerability check; Agenda/practice ownership boundaries; curriculum engine regression; architecture boundary tests; Double or Nothing; maintained Node and Vitest regressions; Chromium installation; fixture server; browser regression; and clean working tree. All workflow steps completed successfully.

### Current position — G5 bounded logical crosswalk and consistency review (2026-11-09)

The G5 source-by-source audit and delegated disposition are recorded in `PacoGO_G5_C6_C7_C8_C9_Protocol_Rejection_Crosswalk_Audit_v0.1.md` §9. The dependency decision map records the same decisions and marks **G5 LOGICAL CROSSWALK RESOLVED** for this bounded scope. This is not a claim that every G5 deliverable is closed or that the C6/C7/C8/C9 proposals are implementation-ready.

**Decision/verification chain**
- Audit disposition commit: `a207ed82b49d1ee456590bfd7b8d11dc8e77148e`; Full Regression #3401 / run ID `42612779144`, GREEN on that exact commit.
- Dependency-map disposition commit: `5a1c459cffdd260abbe9ea4169bf89ead3343e31`; Full Regression #3402 / run ID `42613034938`, GREEN on that exact commit.
- Handoff update commit: `379857abad9f5591d189a22d1dba95958c9b0055`; Full Regression #3403 / run ID `42626231987`, GREEN on that exact commit.
- Historical-status clarification in dependency map: `a6ea678a13077197c137dfd2bf68e3856acebeb0`; Full Regression #3404 / run ID `42626524495`, GREEN on that exact commit. All runs included browser regression and clean-working-tree verification.

**Approved logical boundaries**
1. Each producing stage owns validation of its own record; C9 reports cross-stage structural diagnostics without repair or mutation. Structural failures are not learner mastery outcomes or pedagogical hold actions.
2. C8 remains a non-authoritative descriptive projection over eligible C6/C7 lineage. No durable C8 quarantine/rejection ledger, independent identity, conflict lifecycle or idempotency authority.
3. New operational assessment provenance uses O6/C3 assessment-contract version, target-rule version and assessment-engine version, plus applicable exact task/registry/scoring/source provenance. C3 proposal v0.2 is not silently treated as an approved operational codebook; human coder/adjudication fields are historical/external only when genuinely present and relevant.
4. C6 M1/M2 retain their existing meanings and seven-gate structure. M1 is claim-specific and considers mapping, alignment, response relation and completed target rule together. M2 contextually assesses O6's non-scored adequacy dimensions; no composite score, universal threshold or automatic field-to-gate mapping.
5. Examples are logical illustrations, not executable fixtures. Legacy/scalar records remain read-only under their original schema/version; no coercion, inferred provenance, backfill or automatic canonicalization.

**Read-only consistency review**
- Compared audit §9 with the dependency-map disposition and the referenced C6 v0.1, C7 v0.2, C8 v0.2, C9 v0.2 and O6 v0.3 review documents.
- The historical G5 status paragraph in the dependency map was explicitly marked as pre-disposition and superseded for the bounded crosswalk questions. Other references saying G5 has remaining reconciliation work are intentionally retained: the bounded crosswalk resolution does not close every G5 deliverable.
- The C3 operational artifact/version is still not approved by this disposition; it must not be inferred from C3 proposal v0.2. G6/G9 identity, lifecycle, canonical equality, serialization, retry/concurrency and recovery remain open.
- No further contradiction was found that justifies changing the source protocols. The C6/C7/C8/C9/O6 protocol files were not edited or silently promoted.

**Unchanged constraints**
- C8 Option A remains controlling; O6 v0.3 remains frozen.
- G6 and G9 remain OPEN. G12 remains NOT AUTHORIZED.
- No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed. No implementation authorization is implied.
- `main` remains untouched.

### Next concrete step

Define the separate G6/G9 work boundary from the outstanding identity, lifecycle, canonical equality, serialization, retry/concurrency and recovery dependencies. Do not start runtime implementation or persistence work. Any implementation remains blocked unless a distinct G12 authorization is explicitly granted.

### Branch, commit and regression

- Branch: `refactor/professional-v1` (exclusive working branch; `main` untouched).
- Latest verified commit before this handoff update: `a6ea678a13077197c137dfd2bf68e3856acebeb0`.
- Latest verified Full Regression: #3404 / run ID `42626524495`, GREEN on that exact commit.
- This handoff update is a new documentation commit and requires its own Full Regression before it is considered verified.


---

## Current handoff update — 2026-11-09 (G6-A review)

**Verified branch:** `refactor/professional-v1`  
**Latest verified content commit before this handoff update:** `95664a4fc2b8a4178e2baa2ad1773d265374c7e2`  
**Full Regression:** #3407, run `42639332288`, GREEN on that exact commit.  
**Run:** https://github.com/huisartslasten/PAB/actions/runs/42639332288

### Completed in this continuation
- Confirmed Full Regression #3406 GREEN on G6 review commit `c6cf99a7e3b275e5ccc4125a1958755637e5de02`.
- Added the G6-A task-instance/response-episode cardinality review: `PacoGO_G6_Task_Instance_Response_Episode_Cardinality_Review_v0.1.md`.
- Added the G6-A candidate summary to `PacoGO_G5_G6_G9_Dependency_Decision_Map_v0.1.md`.
- Full Regression #3407 verified the dependency-map update commit `95664a4fc2b8a4178e2baa2ad1773d265374c7e2` GREEN.

### G6-A status — owner disposition still pending
The review recommends one started task instance ↔ one response episode (1:1), created together when a concrete administration starts; one episode ↔ one immutable raw observation; one observation may have zero or more separately identified target assessments. A preview that never starts creates no administration identities. Task definition/version and task model/version remain separate reusable references.

This is a **candidate recommendation only**, not an owner-approved decision. Do not mark cardinality closed or use it to authorize implementation until owner disposition is explicit.

### Current gate status
- G5 bounded logical crosswalk: RESOLVED.
- G6: OPEN; G6-A recommendation awaits owner disposition. Identity namespace/uniqueness, complete C3/O6 reconciliation, interruption restoration details and remaining lifecycle vocabulary are open.
- G9: OPEN; depends on approved G5/G6 logical inputs.
- G8/G10/G11: downstream/separately gated.
- G12: NOT AUTHORIZED. No runtime, test, registry, learner-state, database, SQL/RPC/RLS, Supabase or learner-data changes were made in this work.

### Next concrete steps
1. Obtain/record owner disposition for G6-A. Do not infer approval from a successful regression or from the instruction to continue.
2. Proceed with G6-B: source-led review of logical identity namespaces and uniqueness scopes for task definition/version, task model/version, task instance, response episode, event, raw observation and target assessment. Keep logical identity distinct from physical primary keys, UUID formats, composite hashes, serialization and storage constraints.
3. Reconcile the resulting identity contract against C2, C3 v0.2 and O6 v0.3, including correction/reassessment lineage and the existing G6 fixture coverage.
4. Only after G6 inputs are approved, move to G9 canonical payload equality, replay/conflict and durable stage recovery design.
5. Preserve the practical priority: Zyon should catch up in mathematics, especially fractions. Reuse the existing FR2 Fraction Learning Interface and its five technical demonstrations; do not wait for theoretical G6/G9 closure to plan appropriate learning support, but do not treat synthetic demo observations as learner evidence.

**Regression discipline:** the handoff update itself is a repository change and must receive a fresh Full Regression. Do not claim the handoff update is verified until that run completes GREEN on its exact resulting commit.


---

## Current handoff update — 2026-11-09 (G6-B identity namespace review)

**Verified branch:** `refactor/professional-v1`  
**Latest verified content commit before this handoff update:** `1965ef105fb6f83207fc4a81be2c0e2593121067`  
**Full Regression:** #3410, run `42650206429`, GREEN on that exact commit.  
**Run:** https://github.com/huisartslasten/PAB/actions/runs/42650206429

### Completed in this continuation

- Confirmed Full Regression #3409 GREEN on the G6-B review document commit `43b79e95cc511f7eb89a8e7af4714d779b05261b`.
- Created `PacoGO_G6_Identity_Namespace_Uniqueness_Scope_Review_v0.1.md`.
- Updated `PacoGO_G5_G6_G9_Dependency_Decision_Map_v0.1.md` with the G6-B source-derived candidate review and its ownership boundaries.
- Full Regression #3410 verified the dependency-map update commit `1965ef105fb6f83207fc4a81be2c0e2593121067` GREEN, including browser regression and clean-working-tree verification.
- No runtime code, tests, schema, persistence, database, SQL/RPC/RLS, Supabase or learner data were changed. `main` remains untouched.

### G6-B status — owner disposition still pending

The review distinguishes logical identities for reusable task definition/version, reusable task model/version, concrete task instance, response episode, interaction event, immutable raw observation and target assessment. It proposes candidate uniqueness scopes, including episode-qualified event identity and distinct observation/assessment identities.

It also identifies Learning Interface identity/version/configuration provenance as a separate unresolved gap. It does **not** equate a Learning Interface with a task model or invent a new identity contract.

Physical ID format/generation, deterministic hashes, canonical serialization, physical keys/constraints, idempotency-key encoding, persistence and recovery are explicitly deferred to their owning gates.

G6-B is a **candidate recommendation only**, not an owner-approved decision. G6-A cardinality is also still awaiting owner disposition. Neither recommendation is approved merely because its document or regression passed.

### Current gate status

- G5 bounded logical crosswalk: RESOLVED for its recorded scope; this does not close every G5 deliverable.
- G6: OPEN. G6-A cardinality and G6-B identity namespace/uniqueness recommendations await owner disposition. Remaining lifecycle vocabulary, C3/O6 provenance reconciliation, Learning Interface provenance and exact interruption-restoration verification remain open.
- G9: OPEN; canonical equality, replay/conflict and durable recovery work depends on approved G5/G6 logical inputs.
- G8/G10/G11: downstream/separately gated.
- G12: NOT AUTHORIZED. No implementation authorization is implied.

### Next concrete steps

1. Obtain/record explicit owner disposition for G6-A and G6-B. Do not infer approval from “ga door”, a successful regression or the existence of a recommendation.
2. Reconcile the resulting approved identity/lifecycle/provenance contract against C2, frozen O6 v0.3 and the applicable operational C3 contract. Do not silently promote C3 proposal v0.2 to an approved operational codebook.
3. Resolve Learning Interface identity/version/configuration provenance without assuming it is identical to task-model identity.
4. Specify how exact interruption-state restoration can be verified, while leaving physical snapshot/hash mechanics to the owning gate.
5. Only after G6 inputs are approved, proceed to G9 canonical equality, replay/conflict and durable stage recovery.
6. Preserve the practical priority: Zyon should catch up in mathematics, especially fractions. Reuse the existing FR2 Fraction Learning Interface and its five technical demonstrations. Learning support planning need not wait for G6/G9 closure, but synthetic demo observations are not learner evidence.

### Branch, commit and regression discipline

- Branch: `refactor/professional-v1`; `main` untouched.
- Latest verified content commit before this handoff update: `1965ef105fb6f83207fc4a81be2c0e2593121067`.
- Latest verified Full Regression: #3410 / run ID `42650206429`, GREEN on that exact commit.
- This handoff update is itself a repository change. Its resulting commit requires a fresh Full Regression; do not claim the handoff update verified until that run is GREEN on its exact commit.


---

## Current handoff update — 2026-11-09 (G6 provenance and repository traceability)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Verified work in this continuation

- G6 Learning Interface / presentation provenance review:
  `docs/curriculum/PacoGO_G6_Learning_Interface_Presentation_Provenance_Review_v0.1.md`
  - Full Regression #3412 / run `42653450846`: **GREEN** on exact commit `bc5c7db00955465495dbaed50b7a4d364aa79c54`.
- First concrete G6 contract-to-existing-repository traceability review:
  `docs/curriculum/PacoGO_G6_Contract_to_Repository_Traceability_Review_v0.1.md`
  - Full Regression #3413 / run `42667682449`: **GREEN** on exact commit `12256e42187071d18aa26a853a7d9c88bbb5ac2a`.
  - All 17 workflow steps passed, including Chromium, local fixture server, browser regression and clean-working-tree verification.

### What the repository traceability establishes

This is not a parallel documentation project: the G6 contracts have now been mapped to the existing Fraction implementation and shared runtime. The review traces the generic Learning Interface contract, Fraction configuration and renderers, controller bridge, FR2 controller and browser vertical-slice runtime.

It identifies concrete questions to resolve before any safe runtime change: explicit administration-start lifecycle, separately named response-episode identity, task-instance identity creation, effective interface configuration provenance, and renderer/presentation provenance. These are findings for contract reconciliation, not automatically confirmed code defects.

### Current gate and implementation boundary

- G6-A task-instance/response-episode cardinality: candidate recommendation; owner disposition still pending.
- G6-B identity namespace/uniqueness: candidate recommendation; owner disposition still pending.
- Learning Interface / presentation provenance: candidate recommendation and open questions; owner disposition still pending.
- G6 remains OPEN; G9 remains OPEN; G12 remains **NOT AUTHORIZED**.
- No runtime, tests, registry, learner state, schema, database, SQL/RPC/RLS, Supabase or learner data changed in this continuation.

### Practical priority and next work

Zyon's fraction learning is the product priority. Do not keep producing documents without moving toward PacoGO implementation. Continue with the shortest safe path:

1. Read-only audit `pacogo-engine/interaction-contract.js` and all relevant consumers to establish exactly how task-instance identity, events and observations are currently created and used.
2. Build a concise field-level contract-to-code matrix for the approved/current logical fields across Fraction, Clock, Addition and the A1/B1/FR2 browser slices.
3. Separate genuinely blocking contract gaps from details that can safely remain deferred. Keep the implementation scope minimal and centered on the existing FR2/Fraction path.
4. Present only bounded owner decisions that materially block implementation. “Ga door” means continue the investigation; it does not approve candidate contracts or grant G12.
5. Once the necessary logical contracts are reconciled, request explicit G12 authorization for a minimal FR2/Fraction implementation slice. Do not wait for unrelated theoretical closure, and do not change Supabase unless a real persistence/runtime contract requires it.
6. Preserve the five existing FR2 technical demonstrations. They are synthetic integration demonstrations, not learner evidence and not proof of learning.

### Verification baseline before this handoff update

- Latest verified content commit: `12256e42187071d18aa26a853a7d9c88bbb5ac2a`.
- Latest verified Full Regression: #3413 / run `42667682449`, **GREEN** on that exact commit.
- This handoff update is a repository change and requires its own Full Regression on the resulting exact commit before it is considered verified.


---

## Current handoff update — 2026-11-09 (G6 field-level repository matrix)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Verified work in this continuation

- Full Regression #3414 / run `42668139721`: **GREEN** on exact commit `35337d40b66f3d0592ed4b562167af556053cd56`.
- Created the G6 field-level contract-to-code matrix:
  `docs/curriculum/PacoGO_G6_Field_Level_Contract_to_Code_Matrix_v0.1.md`.
- Full Regression #3415 / run `42669734906`: **GREEN** on exact commit `8da41097b620624eef289d5cfe5bf78d91644e92`.
- Regression #3415 completed all 17 workflow steps, including exact branch/commit verification, dependency and vulnerability checks, curriculum engine regression, architecture tests, maintained Node/Vitest regression, Chromium browser regression and clean-working-tree verification.
- No runtime code, tests, registry, learner state, schema, persistence, database, SQL/RPC/RLS, Supabase or learner data changed.

### What the field-level matrix establishes

The matrix follows the current shared interaction contract through all eight direct controller consumers. Important current-code findings:

- `task_instance_id` currently receives the supplied catalogue `taskId`; the inspected path does not create a distinct concrete administration identity.
- The task-definition version is supplied as a literal `0.1` by the inspected controllers.
- There is no separately named response-episode identity in the current shared contract.
- Event identity is currently derived from task-instance ID, event type and timestamp.
- Observation identity is currently derived from task-instance ID and observation timestamp.
- The observation's `task_id` is populated from `task_instance_id`; the current output carries only the first evidence target ID.
- The Fraction controller constructs its task instance at controller construction, records presentation and interaction events, and creates one observation on submission.
- The browser vertical slice validates task lookup and skill binding, but the inspected path does not validate a separate administration/episode identity, complete target membership, or full Learning Interface configuration and renderer provenance.
- Existing tests establish important within-instance behavior, including submission locking, but do not establish uniqueness across repeated administrations or all the proposed G6 identity/provenance guarantees.

These are traceability findings, not a blanket assertion that every observed absence is an execution defect. The shared contract has eight direct controller consumers, so a future shared-contract change must assess compatibility across them. The first practical implementation can still be deliberately scoped to FR2 if a backward-compatible contract or adapter is justified.

### Current gate status

- G5 bounded logical crosswalk: RESOLVED for its recorded scope; not every G5 deliverable is thereby closed.
- G6: OPEN. G6-A cardinality, G6-B identity namespace/uniqueness and Learning Interface/presentation provenance remain candidate recommendations awaiting explicit owner disposition. The field-level matrix is a repository traceability audit, not approval of those candidates.
- G9: OPEN; canonical equality, replay/conflict and durable recovery remain downstream of approved logical inputs.
- G12: **NOT AUTHORIZED**. “Ga door” is not approval of candidate contracts and is not implementation authorization.
- No Supabase change is indicated by this documentation/traceability work.

### Next concrete step — keep the path short and product-focused

1. Reconcile only the G6 logical decisions that genuinely block a safe FR2 learner-facing implementation. Keep physical ID formats, persistence, concurrency and recovery details in their owning gates unless the minimal FR2 slice actually depends on them.
2. Present the owner with a small, explicit set of material G6 decisions; do not treat candidate recommendations or successful regressions as approval.
3. Prepare the smallest backward-compatible FR2/Fraction implementation slice using the existing reusable interface and five existing technical demonstrations. Preserve curriculum and evidence boundaries; synthetic demonstrations are not learner evidence.
4. Once the necessary logical contracts are explicitly dispositioned, request separate, bounded G12 authorization before making runtime changes.
5. Keep Zyon's fraction learning as the practical priority. Avoid further documentation-only expansion that does not resolve a real implementation blocker.

### Branch, latest verified commit and regression

- Working branch: `refactor/professional-v1`.
- Latest verified content commit before this handoff update: `8da41097b620624eef289d5cfe5bf78d91644e92`.
- Latest verified Full Regression before this handoff update: #3415 / run `42669734906`, **GREEN** on that exact commit.
- This handoff update is a new repository change and requires its own Full Regression on the resulting exact commit. Do not mark the handoff update verified until that run is GREEN.


---

## Current handoff update — 2026-11-09 (delegated G6 logical disposition)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Verified baseline before this decision record

- Full Regression #3416 / run `42670018033`: **GREEN** on exact commit `d34b511f143fcf21d741718e18aec7dd6f93c209`.
- All 17 workflow steps passed, including curriculum engine, architecture, maintained Node/Vitest, Chromium browser regression (59 tests) and clean-working-tree verification.

### Owner-delegated logical disposition

The owner asked the project to proceed using its best judgement. The bounded recommendations in G6-A, G6-B and the Learning Interface provenance review are therefore dispositioned as **APPROVED logical boundaries** in:

`docs/curriculum/PacoGO_G6_Logical_Boundary_Disposition_v0.1.md`.

Approved scope:

- A task instance represents one started concrete administration; one started task instance maps 1:1 to one response episode; one episode maps 1:1 to one immutable raw observation. A preview/unopened task creates none of these administration identities.
- Task definition/version, task model/version, task instance, response episode, event, raw observation and target assessment are distinct logical identities. Reusable definition/model versions are identified by their respective ID+version pair. Administration, episode, observation and assessment identities have distinct uniqueness scopes in their respective PacoGO operational identity domains. Event references are episode-qualified; no global event-ID uniqueness is required by the current contract.
- One observation may have zero or more separately identified target assessments; each assessment points to exactly one observation and one existing evidence target. Reassessment/correction is a new linked assessment, never an overwrite.
- A reusable Learning Interface has its own ID/version, distinct from task definition/model. The effective task-specific configuration, renderer ID/version where versioned, and materially relevant rendered presentation settings are captured as administration provenance anchored to the started task instance, with a stable path from the raw observation.
- Learning Interface and task-model identities remain distinct. Interaction state/events remain in the response episode; they are not part of reusable interface identity/configuration.

This disposition is logical only. It does not select UUID/ULID, ID generation, canonical serialization/hashing, physical keys/constraints, database/schema, persistence, idempotency encoding, retry/concurrency/recovery mechanics, or assessment/mastery semantics. Frozen O6 v0.3 is not changed.

### Remaining G6 work — still OPEN

- Versioned timeout policy duration and consequence before any timeout is used; no universal default is approved.
- Final lifecycle vocabulary/transitions for completion, incomplete, abandonment, interruption/resume and policy-triggered timeout, reconciled to frozen O6 v0.3 without inventing assessment labels.
- Operational method for verifying exact interruption-state restoration; physical snapshot/hash/storage mechanics remain deferred.
- Final field-level reconciliation of the administration/assessment provenance envelope against O6 v0.3 and the current operational C3 contract.
- Current logical provenance permits multiple Learning Interfaces where a composed task genuinely uses them; exact interface/configuration cardinality and renderer-versioning thresholds are not globally fixed. The FR2 first slice uses its existing Fraction interface.

G6 is **not closed**. G9 remains OPEN and depends on the complete approved G5/G6 inputs. G12 remains **NOT AUTHORIZED**. No runtime, tests, registry, learner state, schema, persistence, database, SQL/RPC/RLS, Supabase or learner data changed in this decision.

### Next concrete step

Prepare the narrow FR2 implementation authorization package against the existing Fraction interface and five existing technical demonstrations. It must state the exact runtime files/contract changes, compatibility strategy for the other seven shared-contract consumers, tests, exclusions and rollback boundary. Request separate explicit G12 authorization before any runtime change. Preserve the practical priority: Zyon catching up in fractions; do not let unrelated G9/physical-persistence questions delay a safe, bounded learner-facing FR2 slice.

### Latest verified branch/commit/regression before this handoff update

- Branch: `refactor/professional-v1`.
- Latest verified commit before this handoff update: `d34b511f143fcf21d741718e18aec7dd6f93c209`.
- Latest verified Full Regression: #3416 / run `42670018033`, **GREEN** on that exact commit.
- This handoff update is part of the new G6 disposition commit and requires Full Regression on that exact resulting commit before it is considered verified.


### Verification closure — G6 logical disposition handoff update

- Full Regression #3417 / run `42670649008`: **GREEN** on exact commit `a75e2266b1025585b01e70aa04a81392b5a525fb`.
- All 17 workflow steps passed, including 59 browser tests and clean-working-tree verification.
- The G6 logical disposition, the three review addenda, the field-matrix status clarification, dependency-map update and handoff update are therefore verified on that exact commit.
- Latest verified Full Regression before this verification-only handoff update: #3417 / run `42670649008`, GREEN on `a75e2266b1025585b01e70aa04a81392b5a525fb`.
- This verification-only handoff update itself requires its own Full Regression on the resulting exact commit.


---

## Current handoff update — 2026-11-10 (G12 FR2 learner practice implementation and regression closure)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### What was built

Under the owner's explicit, narrow G12 authorization, the first learner-facing FR2 practice slice was implemented using the existing Fraction Learning Interface:

- `pacogo-engine/fraction-practice-session.js`
  - Practice-only session/controller with three equivalent-fraction tasks.
  - Minimal progress counters and completed-task IDs stored locally per selected learner UUID.
  - Retry and reset support; no raw free-text learner explanation is stored.
- `curriculum-fr2-practice-learner.html`
  - Parent-authenticated learner selection using the existing PacoGO app pattern.
  - Visual explanation and guided practice using the existing Fraction Learning Interface/rendering.
  - Immediate formative feedback and learner-local progress display.
- `pacogo-engine/fraction-practice-session.test.js`
  - Unit coverage for progress, learner isolation, retry and validation.
- `test/browser/curriculum-fr2-practice-learner.browser.test.js`
  - Browser coverage for the learner page, practice flow, local storage isolation and absence of formal evidence/RPC writes.

This is a first practice slice for FR2 equivalent fractions, not a complete fraction catch-up curriculum and not proof of mastery. The three sample tasks do not establish Zyon's actual gaps. Further learning progression must be based on observed learner work and aligned with the school's taught method.

### Boundaries preserved

- No curriculum registry, task/evidence alignment, C3 assessment, inference, mastery, next-action or learner-state contract was changed.
- The practice controller is separate from the formal evidence/controller path; no synthetic demo observation is submitted as learner evidence.
- Practice progress is browser-local and learner-keyed; it is not synced across devices.
- No Supabase schema, migration, SQL, RPC, RLS, database or persistence contract was changed.
- The five existing synthetic Fraction technical demonstrations were not rebuilt or repurposed as learner evidence.
- G6 remains OPEN for its listed lifecycle/timeout/O6-C3/provenance/restoration questions; G9 remains OPEN. The narrow FR2 practice implementation does not close those gates.

### Regression investigation and correction

- Full Regression #3420 on implementation commit `9f611545176ed316eb6431e079ef28ac2610b495` was RED because a browser-test assertion expected two stored learner entries when only learner A had generated progress. The test expectation was corrected to assert one entry and verify that it belongs to learner A.
- Full Regression #3421 on commit `3f6005eba862d8ddfbebd0d4c0ab7273eea34c48` remained RED. Investigation isolated the FR2 browser fixture: its Supabase stub omitted `functions.invoke`, required during existing app initialization by the answer-grading and lesson-audio services. The existing B1 fixture already supplied this member.
- The correction changed only the FR2 browser test stub to include `functions.invoke`; no production code or test strength was changed.
- Corrective commit: `143571546488d26033e2ed2876724a91520fa19a`, message: `Complete Supabase browser test stub contract`.
- Full Regression #3422 / run `42821129258`: **GREEN** on that exact commit.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/42821129258
- All workflow job steps completed successfully, including exact branch/commit verification, dependency/vulnerability checks, curriculum engine regression, architecture boundaries, maintained Node and Vitest regression, Chromium browser regression and clean-working-tree verification.
- The branch head was verified as `143571546488d26033e2ed2876724a91520fa19a` on `refactor/professional-v1`.

### Current verified state and next concrete steps

1. Treat `143571546488d26033e2ed2876724a91520fa19a` as the latest verified implementation commit; Full Regression #3422 is GREEN on it.
2. This handoff update is a new repository change. Run Full Regression on its exact resulting commit before considering the handoff verified.
3. After that verification, inspect the actual learner-facing FR2 experience against the intended school-neutral visual pedagogy and accessibility requirements. Do not infer Zyon's mastery from the sample task data.
4. Plan the next fraction learning slice from a short diagnostic of Zyon's current understanding, using the school's taught representation/method where known. Prioritize catching up in fractions, but do not claim the three FR2 equivalence tasks cover the whole fraction domain.
5. Keep practice-only progress separate from formal evidence and mastery until the evidence-assessment contracts and validation requirements support that use.

### Branch, commit and regression

- Working branch: `refactor/professional-v1`.
- Latest verified content commit before this handoff update: `143571546488d26033e2ed2876724a91520fa19a`.
- Latest verified Full Regression before this handoff update: #3422 / run `42821129258`, **GREEN** on that exact commit.
- This handoff update requires a fresh Full Regression on its exact resulting commit.


---

## Current handoff update — 2026-11-10 (FR2 symbolic-option visual models and Full Regression #3424)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Verified change

The learner-facing FR2 practice page now shows an area-model visual alongside each symbolic fraction answer option. This corrects a didactic mismatch in FR2 practice tasks 2 and 3: the learner was instructed to compare the blue quantity while the answer choices showed only symbolic fractions.

Files changed in implementation commit:
- `curriculum-fr2-practice-learner.html`
- `pacogo-engine/fraction-learning-interface.css`
- `test/browser/curriculum-fr2-practice-learner.browser.test.js`

The change is scoped to the FR2 practice presentation. It does not change the shared Fraction interface contract or renderer, curriculum definitions, evidence assessment, inference, mastery, learner state, or Supabase. The browser regression explicitly verifies that both symbolic options have their own area-model visual.

### Regression verification

- Full Regression #3424 / run `42834029451`: **GREEN** on exact commit `d668344dfb49d74320189078dc930252b5aa51e0`.
- All 20 workflow steps completed successfully, including exact branch/commit verification, dependency and vulnerability checks, curriculum engine regression, architecture boundaries, maintained Node and Vitest regression, Chromium installation, local fixture server, browser regression and clean-working-tree verification.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/42834029451
- Branch head was verified as `d668344dfb49d74320189078dc930252b5aa51e0` on `refactor/professional-v1` before this handoff update.

### Next concrete steps

1. Run Full Regression on the exact commit containing this handoff update; do not mark the handoff update verified until that run is GREEN.
2. Review the learner-facing FR2 practice flow as a whole for clarity, accessibility and conceptual coherence. Keep symbolic fractions paired with meaningful visual representations where the task prompt asks the learner to compare quantities.
3. The current three practice tasks are only a first equivalent-fractions slice. They do not diagnose or establish Zyon's actual fraction knowledge or gaps. Next learning design should begin with a short, low-pressure diagnostic covering prerequisite fraction concepts and equivalent fractions, then sequence practice from the observed responses.
4. Where available, establish the method/representations used by Zyon's school before introducing method-specific steps. Do not claim alignment with an unknown school method.
5. Keep this formative practice and its browser-local progress separate from formal evidence, mastery and learner-state decisions. No Supabase change is indicated by the current practice-only slice.

### Branch, commit and regression

- Working branch: `refactor/professional-v1`.
- Latest implementation commit verified before this handoff update: `d668344dfb49d74320189078dc930252b5aa51e0`.
- Latest verified Full Regression before this handoff update: #3424 / run `42834029451`, **GREEN** on that exact commit.
- This handoff update is a new repository change and requires Full Regression on its exact resulting commit.


---

## Current handoff update — 2026-11-10 (Full Regression #3425 closure and Zyon fraction diagnostic design)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Verification closure

- Full Regression #3425 / run `42835157181`: **GREEN** on exact commit `fa5a91af98516dd3219b45a7b5533105d43bba07`.
- All 20 workflow steps completed successfully, including exact branch/commit verification, dependency/vulnerability checks, curriculum engine regression, architecture boundaries, maintained Node/Vitest regression, Chromium browser regression and clean-working-tree verification.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/42835157181

### Read-only FR2 learner-flow review

The learner-facing FR2 page was reviewed with its practice session/controller and Fraction Learning Interface styling. The page presents a short concept explanation, three equivalent-fraction tasks, visual feedback, retry/next controls and device-local progress. The two symbolic-choice tasks now show an area model beside each option, matching the prompt's instruction to compare the blue quantity.

Review boundary: this is a code/design review, not a live learner usability study. It does not establish how Zyon understands the prompts or whether the interface matches his school's taught method. The practice session records completion/attempt counters and correct-answer totals, not a diagnostic record of the learner's mathematical reasoning.

### New design-only deliverable

Created `docs/curriculum/PacoGO_Zyon_Fraction_Diagnostic_Design_v0.1.md` as a candidate, formative, school-neutral diagnostic design.

It proposes a brief 8–12 minute check with up to six core probes covering equal partitioning, part–whole meaning, representation mapping, fraction comparison, number-line meaning where taught, and FR2 equivalence recognition/explanation. Optional fraction-of-quantity and like-denominator operation probes are gated on confirmation that school has already taught them.

The document explicitly avoids treating untaught material as a deficit, one response as mastery, or an unknown school method as known. It keeps diagnostic observations separate from formal evidence/mastery and does not change registry, C3, learner-state or Supabase contracts.

### Next concrete step

Obtain a recent school workbook page, test or teacher/parent confirmation showing the fraction topics and representations currently taught to Zyon. Use that source to finalise the diagnostic prompts and choose the next instructional sequence. Do not implement a new diagnostic route or expand the prior narrow G12 authorization until the learner flow and minimal formative data boundary are defined.

### Branch, commit and regression

- Latest verified content commit before this handoff update: `fa5a91af98516dd3219b45a7b5533105d43bba07`.
- Latest verified Full Regression before this handoff update: #3425 / run `42835157181`, **GREEN** on that exact commit.
- This diagnostic-design and handoff update is a repository change and requires Full Regression on its exact resulting commit.


---

## Current handoff update — 2026-11-10 (School workbook review and fraction catch-up priority update)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Full Regression #3426 closure

- Full Regression #3426 / run `42836910292`: **GREEN** on exact commit `a33043a2dfbd5614491a125c59f6bd1c6017a857`.
- All workflow steps passed, including dependency checks, curriculum engine, architecture boundaries, maintained Node/Vitest, Chromium browser regression and clean-working-tree verification.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/42836910292

### Parent-supplied school workbook reviewed

A photograph supplied on 2026-11-10 shows school exercises for:
- generating equivalent fractions (e.g. chains based on 2/3, 3/4, 2/5, 5/6 and 7/8);
- adding fractions with unlike denominators;
- subtracting fractions with unlike denominators;
- a partially visible fractional comparison/difference task;
- a separate multiplication word problem (53 × 42), which is outside the fraction curriculum slice.

This establishes that these task types appear on the supplied page. It does not establish complete syllabus coverage, the school's exact written algorithm, or Zyon's mastery/gaps. The handwritten responses are not used as a formal score because the image is partial and some entries are hard to read.

### Diagnostic design updated

The candidate design document `docs/curriculum/PacoGO_Zyon_Fraction_Diagnostic_Design_v0.1.md` now records the workbook evidence and reprioritises the diagnostic around:
1. equivalent-fraction meaning/generation;
2. common denominators;
3. addition with unlike denominators;
4. subtraction with unlike denominators;
5. fraction comparison/difference where confirmed by the full workbook section.

Equal partitioning and part–whole meaning remain short prerequisite checks only when responses indicate they are needed. A provisional teaching path is recorded as a hypothesis, not a universal developmental claim: equivalent fractions → common denominators → addition → subtraction → comparison/mixed application. The school-specific written method remains unconfirmed; obtain a worked example or teacher/parent confirmation before claiming alignment with it.

The multiplication problem is explicitly kept separate from FR2 and the fraction diagnostic. No curriculum registry, formal evidence/mastery, learner-state or Supabase contract was changed.

### Next concrete step

Use the actual workbook method if a worked example is available, then finalise a short formative diagnostic that directly tests equivalent fractions, common denominators, unlike-denominator addition and subtraction. Start targeted teaching from the first concept that is genuinely uncertain; do not spend time reteaching prerequisites that Zyon already demonstrates. Keep the diagnostic formative and separate from formal engine evidence.

### Branch, commit and regression

- Latest verified content commit before this documentation update: `a33043a2dfbd5614491a125c59f6bd1c6017a857`.
- Latest verified Full Regression before this update: #3426 / run `42836910292`, **GREEN** on that exact commit.
- This workbook-informed diagnostic and handoff update requires Full Regression on its exact resulting commit.


---

## Current handoff update — 2026-11-10 (Classroom fraction method identified from board photographs)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Full Regression #3427 closure

- Full Regression #3427 / run `42851409567`: **GREEN** on exact commit `c51c0d6434a977fd0910c36b6e1ef1ee158b589c`.
- All 20 workflow steps passed, including curriculum engine, architecture boundaries, Node/Vitest, Chromium browser regression and clean-working-tree verification.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/42851409567

### Classroom board photographs reviewed

Two chalkboard photographs from the previous week show the teacher demonstrating:

- Product-denominator conversion to equivalent fractions for unlike-denominator addition/subtraction: e.g. `1/3 + 1/2 = 2/6 + 3/6 = 5/6`, `1/3 + 1/4 = 4/12 + 3/12 = 7/12`, `1/2 - 2/5 = 5/10 - 4/10 = 1/10`, and `3/4 - 2/5 = 15/20 - 8/20 = 7/20`.
- Mixed-number conversion before operating: e.g. `1 1/3 = 4/3`, `2 5/6 = 17/6`, and `5 - 1/2 = 10/2 - 1/2 = 9/2 = 4 1/2`.
- Conversion back to a mixed number for an improper result, e.g. `13/12 = 1 1/12`.

This is direct evidence that the teacher demonstrated this procedure in the photographed lesson. It does not prove it is the only school-approved method or that Zyon independently understands or masters it. The earlier workbook photo shows the corresponding task types: equivalent fractions, unlike-denominator addition/subtraction and mixed-number work.

### Diagnostic design refined

Updated `docs/curriculum/PacoGO_Zyon_Fraction_Diagnostic_Design_v0.1.md` to include the classroom worked examples and their limits. Diagnostic/teaching sequence should distinguish:
1. making equivalent fractions using the product of the denominators;
2. accurately multiplying numerator and denominator by the same factor;
3. adding/subtracting numerators once denominators match;
4. converting mixed numbers to improper fractions (whole × denominator + numerator);
5. converting an improper result back to a mixed number.

PacoGO may use fraction bars/area models to explain why the procedure works, but those visuals supplement rather than silently replace the demonstrated written method. The diagnostic must identify the step causing difficulty rather than infer it from a wrong final answer.

No curriculum registry, formal evidence/mastery, learner-state, runtime or Supabase contract changed. This is documentation-only curriculum/learning design work.

### Next concrete step

Prepare a short formative check using the classroom's demonstrated notation and procedure, with one small item per step above. Use the result to select the first targeted teaching activity. Keep visual explanation paired with the school's written sequence and avoid claiming mastery from a single response.

### Branch, commit and regression

- Latest verified content commit before this update: `c51c0d6434a977fd0910c36b6e1ef1ee158b589c`.
- Latest verified Full Regression before this update: #3427 / run `42851409567`, **GREEN** on that exact commit.
- This design and handoff update requires Full Regression on its exact resulting commit.


---

## Current handoff update — 2026-11-10 (Zyon formative fraction diagnostic implementation)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### What was built

Under the owner's explicit authorization, the repository now contains a separate learner-facing formative fraction diagnostic:

- `pacogo-engine/fraction-diagnostic-session.js`
  - Seven ordered probes covering equivalent-fraction generation, product common denominator, unlike-denominator addition and subtraction, mixed-to-improper conversion, a mixed-number subtraction combining those steps, and improper-to-mixed conversion.
  - Captures each requested numeric intermediate value separately, evaluates each field independently and preserves the complete step response.
  - After all probes, selects the earliest probe with an incorrect/incomplete field and returns a matched, structurally similar practice task with an explanation.
  - If all probes are answered correctly, recommends a broader application task rather than claiming mastery.
  - Progress is stored locally under a learner-keyed browser storage key. No learner name or raw free-text explanation is stored.
- `curriculum-fraction-diagnostic-learner.html`
  - Parent-authenticated learner selection using the existing PacoGO application/bootstrap and learner-profile service.
  - Presents one probe at a time without correctness feedback during the diagnostic.
  - Presents the selected instructional explanation and one new targeted practice task after the diagnostic.
- `pacogo-engine/fraction-diagnostic-session.test.js`
  - Covers seven-step progression, intermediate field validation, learner isolation, duplicate submission prevention, recommendation selection, practice validation and reset.
- `test/browser/curriculum-fraction-diagnostic-learner.browser.test.js`
  - Covers parent/learner flow, all seven probes, targeted practice and the absence of formal evidence/RPC writes.
- Added a visible entry button from `curriculum-fr2-practice-learner.html` to the diagnostic page.

### Curriculum and epistemic boundaries

- The sequence reflects the workbook task families and the teacher's photographed board procedure, including product denominators and mixed-number conversion.
- The diagnostic is **formative only**. Its local responses are not submitted to the formal curriculum registry, C3 evidence assessment, inference, mastery, decision trace or learner-state pipeline.
- FR2 registry v0.6 and its candidate claims/developments/evidence/task models were not changed. The diagnostic is a separate instructional probe set; its addition/subtraction and mixed-number probes must not be misrepresented as newly registered FR2 task models or as formal evidence.
- The broader 32-skill SLO mapping is not yet fully operationalised in the runtime. This implementation closes a practical fraction-learning gap, not the complete Grade 8 curriculum route.
- No Supabase schema, migration, RPC, RLS, persistence contract or real learner data was changed.

### Regression investigation and correction

- Full Regression #3429 on implementation commit `798d748fbee72ec916f5ae641c924e97019236af` was **RED**. The new page omitted the Supabase UMD loader required by `createPacoGOApp`, so the existing learner-profile bootstrap could not load the learner list.
- Corrected in commit `589cee126a701a64b3b86f1d9f56081007bf87e8`: added the same Supabase UMD loader used by the existing learner route and added the entry button from the existing FR2 practice page. Full Regression #3430 then exposed a browser assertion/content mismatch: the UI title was “Gelijkwaardige breuken” while the intended diagnostic label/test expected “Gelijkwaardige breuken maken”.
- Corrected the learner-facing step title, not the test, in commit `94157254c2b2af819c9ee8d4a9530eb8ef638b19`.
- Full Regression #3431 / run `42867640273`: **GREEN** on exact commit `94157254c2b2af819c9ee8d4a9530eb8ef638b19`. All workflow steps passed, including the 61-test Chromium browser suite and clean-working-tree verification.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/42867640273

### Next concrete step

1. Verify the new route in the actual PacoGO TEST environment with a real parent login and a test learner profile; do not use LIVE.
2. Review the seven probe prompts and the targeted practice explanations with Zyon's actual responses; the current browser regression uses synthetic learners and does not prove learner usability or instructional effectiveness.
3. Add visual fraction representations/step scaffolds where they materially improve comprehension, without revealing answers during diagnosis.
4. In a separate bounded step, define the exact relationship between these formative probes and the candidate FR2 registry (especially FR2.D1–D3) without submitting them as formal evidence or changing mastery rules.
5. Continue operationalising the wider SLO-to-runtime path after the fraction slice has been exercised. Do not claim all 32 skills or the Grade 8 endpoint are already runtime-complete.

### Branch, commit and regression

- Latest implementation commit: `94157254c2b2af819c9ee8d4a9530eb8ef638b19`.
- Latest verified Full Regression: #3431 / run `42867640273`, **GREEN** on that exact commit.
- This handoff update is itself a repository change and requires Full Regression on its exact resulting commit.


---

## Current handoff update — 2026-11-10 (FR2 route separation and diagnostic shell integration)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Root cause isolated

Full Regression #3438 failed on the existing browser test for FR2-T02:
- The test expected the original symbolic-equivalence task title, but the page rendered the PacoGO login screen.
- The integration had repurposed `curriculum-fr2-fractions.html` as the formative diagnostic route.
- That HTML replacement removed the existing FR2-T02 vertical-slice page implementation (including its Fraction Learning Interface, controller/bridge and browser vertical-slice runtime wiring).
- This was an application route/page ownership regression, not a missing login fixture and not a reason to weaken the existing FR2 test.

### Structural correction implemented

- Restored `curriculum-fr2-fractions.html` to the original FR2-T02 symbolic-equivalence browser vertical slice.
- Kept the formative diagnostic on its own existing dedicated URL: `curriculum-fraction-diagnostic-learner.html`.
- Replaced that diagnostic page's standalone bespoke markup with the central PacoGO application shell entry point.
- Registered `curriculum-fraction-diagnostic-learner.html` in `src/app/routes.js`, using the canonical `createFractionDiagnosticRuntime` and its feature stylesheet.
- Updated the diagnostic browser test to navigate to its dedicated URL.
- Preserved the original FR2-T02 browser test unchanged.
- No curriculum registry, evidence assessment, inference, mastery, learner-state, Supabase schema, RPC, RLS or learner-data changes.

### Regression verification

- Restoration commit: `8a074c5f7c9f58b742df02a893bed684001645de`.
- Diagnostic shell page commit: `e9967bc9b798e517cb4df2157efa67dcaab408a2`.
- Dedicated route commit: `5c9ff36050206f2157bea9348770c7c36ae0b060`.
- Diagnostic browser URL update / implementation HEAD: `493247023d9c3a9d5b72f1ee80a1439f61847734`.
- Full Regression #3442 / run `42877049189`: **GREEN** on exact HEAD `493247023d9c3a9d5b72f1ee80a1439f61847734`.
- All 20 workflow steps completed successfully, including the full browser regression and clean-working-tree verification.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/42877049189

### Current status and next concrete step

The original FR2-T02 exercise and the separate seven-probe formative diagnostic now coexist on separate URLs. The diagnostic is integrated into the canonical PacoGO shell and retains its parent-authenticated learner selection, local formative progress and no-formal-evidence boundary.

Next:
1. Verify the dedicated diagnostic route in the actual PacoGO TEST environment with a real parent login and a test learner profile; do not use LIVE.
2. Review the prompts and targeted explanation with Zyon's actual responses. Synthetic browser tests do not establish learner usability or instructional effectiveness.
3. Keep this formative diagnostic separate from formal FR2 registry evidence/mastery unless a separately reviewed curriculum/evidence contract authorises a change.

### Branch and verification state

- Working branch: `refactor/professional-v1`.
- Latest implementation commit verified: `493247023d9c3a9d5b72f1ee80a1439f61847734`.
- Latest verified Full Regression: #3442 / run `42877049189`, **GREEN** on that exact commit.
- This handoff update itself requires Full Regression on its resulting commit; do not claim the handoff update verified until that exact-commit run completes.

---

## Current handoff update — 2026-11-10 (FR2 diagnostic navigation cutover)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### What changed

The learner-facing PacoGO entry points now lead to the dedicated formative fraction diagnostic instead of the older FR2-T02 symbolic-equivalence demo page:

- Skills → FR2 now routes to `curriculum-fraction-diagnostic-learner.html`.
- Dashboard → Breuken now routes to the same dedicated diagnostic and preserves the current learner/mode context through the central router.
- The dashboard tile copy now accurately describes a formative diagnostic, not a saved-progress practice activity.
- If the parent session is missing, the diagnostic authentication return target now points back to the diagnostic page itself, not the old FR2-T02 page.
- The original `curriculum-fr2-fractions.html` FR2-T02 vertical slice remains intact and separately addressable for its curriculum/browser contract.

### Tests and regression

- Added browser navigation assertions for both Dashboard and Skills, including preservation of student and mode context.
- Updated the Skills source-contract test to reflect the intentional FR2 destination change.
- During verification, Full Regression #3448 exposed the stale source-contract assertion expecting the old FR2-T02 destination. That assertion was updated because the route contract intentionally changed.
- Full Regression #3450 then exposed a test-harness scope error in the new Skills browser assertion (a Node-side reference to the browser `document`). The assertion was moved inside the page evaluation; application code was not changed to accommodate the test.
- Browser proof #666 / run `42887721974`: **GREEN** on `c92e32d0ea2512ce282e1e7110cd2412f71ec1e9`.
- Full Regression #3451 / run `42887722335`: **GREEN** on exact implementation commit `c92e32d0ea2512ce282e1e7110cd2412f71ec1e9`.
- Full Regression run: https://github.com/huisartslasten/PAB/actions/runs/42887722335

### Boundaries retained

No curriculum registry, formal evidence, inference, mastery, learner-state, Supabase schema/RPC/RLS, or learner data was changed. The diagnostic remains formative and local-storage based. The old FR2-T02 page remains available as a distinct technical curriculum slice.

### Next concrete step

Verify the actual navigation in the local PacoGO TEST environment with a parent session:
1. Dashboard → Breuken → Start diagnose.
2. Skills → Breukequivalentie → Openen.
3. Confirm both routes show the modern PacoGO shell, the learner-profile selector and the seven-step diagnostic.
4. Confirm unauthenticated entry returns to the diagnostic after login.

Then run the diagnostic with Zyon and use his actual intermediate steps to choose the first targeted teaching activity. Do not treat this formative result as formal mastery.

### Branch, commit and regression

- Implementation commit: `c92e32d0ea2512ce282e1e7110cd2412f71ec1e9`.
- Latest verified Full Regression before this handoff update: #3451 / run `42887722335`, **GREEN** on that exact implementation commit.
- This handoff update is itself a repository change and requires Full Regression on its exact resulting commit.

---

## Current handoff update — 2026-11-10 (PacoGO roster ↔ curriculum learner identity)

**Branch:** `refactor/professional-v1`. LIVE Git branch `main` and Supabase project `PAB` were not changed.

### Problem and root cause

The modern FR2 diagnostic rendered the PacoGO shell greeting for the selected learner (e.g. Zyon), but then displayed that no curriculum learner profile existed. The two systems used separate identity sources:

- PacoGO's fixed roster in `src/core/student-registry.js` uses the application learner names.
- The curriculum engine uses opaque UUID keys from `public.learner_profiles`.

There was no explicit, owner-scoped mapping between these identities. Looking up profiles by display name would be unsafe and could silently map the wrong learner.

### Architecture decision

Add an explicit mapping from a stable application key to one opaque curriculum profile:

- Stable application keys: `zyon`, `zenith`, `zephon`.
- New table: `public.learner_profile_links`.
- Mapping is owner-scoped by `owner_user_id`; one application key per parent and one PacoGO roster identity per curriculum profile.
- No mapping is inferred from names.
- Authenticated SECURITY INVOKER RPCs:
  - `link_app_learner_profile` links an existing profile after checking ownership.
  - `create_app_learner_profile` atomically creates and links a profile, idempotently, protected by a transaction advisory lock.
- RLS is enabled. Only the authenticated owner can read or insert their own mappings. Anonymous execution of the new RPCs is denied.
- Existing profile selection is offered in Beheer to avoid creating a duplicate when a suitable profile already exists.

### Implemented

- Added stable `curriculumKey` values to the PacoGO student registry.
- Extended `learner-curriculum-service.js` with profile lookup, explicit linking and idempotent provisioning methods.
- Added a Curriculum-leerlingprofiel section to Beheer for the selected student. A parent can link an existing profile or create the profile for that roster identity.
- Changed the FR2 diagnostic to resolve the selected PacoGO learner through the explicit mapping. If missing, it gives a specific route to Beheer; it no longer offers a global, unassociated profile picker.
- Added service, registry, migration-contract and browser tests. Browser coverage verifies that selecting Zyon resolves Zyon's linked UUID and starts the diagnostic, and that an unlinked Zyon is directed to Beheer.
- Extended `supabase/tests/learner_ownership_rls.test.sql` to verify idempotence, owner isolation and denial of cross-guardian linking.
- The migration filename was aligned to the version actually recorded by Supabase TEST: `20261110232751_link_app_students_to_curriculum_learners.sql`.

### Supabase TEST deployment and verification

- Applied migration `20261110232751_link_app_students_to_curriculum_learners` to Supabase project **PacoGO TEST** (`btnhhvtpmuvrpbnkyjnm`) only.
- Confirmed the new table exists with RLS enabled, owner-scoped policies, and the expected foreign keys.
- Confirmed both new RPCs are SECURITY INVOKER, executable by `authenticated`, and not executable by `anon`.
- Executed the full learner-ownership SQL integration test against PacoGO TEST. It returned the explicit verification result: `learner ownership + app identity link integration passed`.
- Confirmed the test transaction rolled back its synthetic users and mappings; `learner_profile_links` remains empty. No real learner profile was created by this work.
- Supabase security advisors returned existing warnings about unrelated game-access SECURITY DEFINER functions and leaked-password protection. No warning identified either new RPC as SECURITY DEFINER.
- Supabase production project `PAB` was not modified.

### Regression verification

- Browser regression #668 / run `42923368198`: **GREEN** on application implementation commit `a9eeb7c40c5459e0ea3d5a20b3048bf892d5d948`.
- Full Regression #3465 / run `42923651330`: **GREEN** on `70a7d5dc13ee9a263ee76c5fada351a187646435`.
- Full Regression #3468 / run `42923870416`: **GREEN** on exact branch HEAD `7e0fca32a9addf507a57e6c2861ce126d6870c9c`. All workflow steps passed, including browser regression and clean working tree.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/42923870416

### Next concrete step — local PacoGO TEST UI

1. Use the local PacoGO TEST app with the parent account.
2. Select Zyon in the top navigation and open Beheer.
3. In **Curriculum-leerlingprofiel**, use **Maak profiel voor Zyon** (the TEST database currently has no curriculum learner profiles), or select an existing profile if one is present by the time this is tested.
4. Return to Dashboard → Breuken or Skills → Breukequivalentie. The diagnostic should resolve Zyon automatically and start without the former “no learner profile” message.
5. Verify that the created mapping persists after refresh. Then run the formative diagnosis with Zyon. It remains formative only: no formal evidence, inference, mastery or learner-state writes are made by this diagnostic.

If the UI cannot read the new table/RPC, inspect the exact Data API/RLS error; do not create profiles manually or weaken the ownership policy.

### Current branch / verification boundary

- Latest implementation branch commit verified: `7e0fca32a9addf507a57e6c2861ce126d6870c9c`.
- Latest verified Full Regression: #3468 / run `42923870416`, **GREEN** on that exact commit.
- This handoff update is itself a repository change and requires Full Regression on its exact resulting commit before the phase can be closed.


---

## Current handoff update — 2026-11-11 (stacked fraction notation and embedded answer fields)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### What changed

The formative fraction diagnostic now renders fraction expressions in conventional vertical notation:

- numerator above a horizontal fraction bar;
- denominator below the bar;
- missing numerator/denominator values are entered in-place, at the corresponding position in the fraction;
- embedded inputs are part of the actual diagnostic form and are included in submitted values;
- the same structural rule is applied to the targeted follow-up practice form.

The renderer maps the relevant missing-value fields into the expression for each diagnostic probe. Remaining supporting fields continue to be rendered in the normal field area. This is a presentation and form-structure change only.

### Regression investigation and final verification

Several Full Regression runs correctly exposed successive issues during implementation. These were investigated rather than bypassed:

- malformed parser/newline source caused an earlier runtime failure;
- the main diagnostic expression initially sat outside its form, so its embedded input was not submitted;
- after correcting that, the targeted practice expression was found to sit outside its own form, causing the practice input not to be found/submitted;
- the final correction moved the targeted practice expression inside the practice form and kept the expression, supporting fields and submit control together.

Final implementation commit: `aaaaa86c20743662f72d94b17d989723f76b3369`.

- Full Regression #3479 / run `43017375870`: **GREEN** on the exact implementation commit above.
- Workflow job `agenda-cutover-and-regression`: completed successfully.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/43017375870

### Scope boundaries retained

No curriculum skill/development/claim/task mapping, formal evidence, evidence assessment, inference, mastery rule, learner state, Supabase schema/RPC/RLS or learner data was changed. The diagnostic remains formative. No changes were made to LIVE `main`.

### Next concrete step

Verify the actual diagnostic in PacoGO TEST with Zyon: confirm the stacked notation is readable, each missing value appears inside the correct numerator/denominator position, and the targeted practice form accepts and evaluates the embedded response. Then use Zyon's actual diagnostic responses to select the first targeted fraction explanation/practice. Do not interpret the formative diagnostic as formal mastery.

### Branch and verification state

- Working branch: `refactor/professional-v1`.
- Latest verified implementation commit: `aaaaa86c20743662f72d94b17d989723f76b3369`.
- Latest verified Full Regression: #3479 / run `43017375870`, **GREEN** on that exact commit.
- This handoff update is itself a repository change and requires Full Regression on its exact resulting commit before the handoff can be considered verified.


---

## Current handoff update — 2026-11-11 (fraction diagnostic regression correction and assessment contract)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### Regression correction

Full Regression #3486 was RED because the diagnostic browser scenario filled every probe with correct values but asserted that the engine should recommend targeted practice. The engine correctly recommends broader application when all probes are correct.

Corrected the browser scenario so its first probe is intentionally incorrect, while the remaining six are correct. This exercises the targeted-practice branch the test name describes. The diagnostic engine was not altered to satisfy the stale assertion.

- Browser test file: `test/browser/curriculum-fraction-diagnostic-learner.browser.test.js`.
- Correction commit: `67b48c8c5a7aa392f07c83fcd4c07b8308228ef3`.
- Browser proof #673 / run `43073957373`: **GREEN** on exact commit above.
- Full Regression #3487 / run `43073957189`: **GREEN** on exact commit above.
- Full Regression URL: https://github.com/huisartslasten/PAB/actions/runs/43073957189

### Assessment contract documented

Created `docs/curriculum/PacoGO_Zyon_Fraction_Diagnostic_Assessment_Contract_v0.1.md` as a candidate design contract. It separates:
- mathematical validity from alignment with the classroom's demonstrated procedure;
- equivalent-fraction and common-denominator relationships from fixed expected-number comparisons;
- arithmetic errors from invalid conversions;
- downstream responses dependent on an earlier error from independent difficulties;
- formative diagnostic classifications from formal evidence/mastery.

The contract includes formulas for common denominators, addition/subtraction, mixed-number conversion and improper-to-mixed conversion, plus required test cases and implementation sequence.

This is a candidate design, not an approved or implemented runtime contract. The current seven probes still require a task-set review for overlap and learner burden, especially common-denominator versus addition, and mixed-to-improper versus mixed-subtraction.

### Boundaries

No diagnostic engine implementation, curriculum registry, FR2 evidence mapping, C1–C9, formal evidence, inference, mastery, learner state, Supabase schema/RPC/RLS or learner data changed in this phase. The diagnostic remains formative and local-storage based.

### Next concrete step

Review and reduce the current seven-probe set to the smallest set that distinguishes the learning decisions actually needed for Zyon's current schoolwork. Then implement pure mathematical evaluators with unit tests before integrating them into the session/runtime. Do not begin implementation until the task-set and response classifications are sufficiently specified.

### Verification state

- Last verified implementation/test commit: `67b48c8c5a7aa392f07c83fcd4c07b8308228ef3`.
- Latest verified Full Regression: #3487 / run `43073957189`, **GREEN** on that exact commit.
- Assessment contract documentation commit: `85598975cf3ab59843a32fd6b8b2301e334bd89b`.
- This handoff update is a repository change and requires Full Regression on its exact resulting commit before the handoff can be considered verified.


---

## Current handoff update — 2026-11-11 (reduced fraction diagnostic task-set design)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### Verification before this design step

- Full Regression #3489 / run `43074410195`: **GREEN** on exact handoff commit `f2f84d201dc6b8c3198dd99e680409a1ec20ae8c`.
- This is the verified baseline before the task-set design commit below.

### Task-set design created

Added `docs/curriculum/PacoGO_Zyon_Fraction_Diagnostic_Task_Set_v0.1.md` as a candidate design specification.

The proposed minimum route is:
- F1: equivalent fractions;
- F2: addition with unlike denominators, eliciting common-denominator construction, both numerator conversions and addition one action at a time;
- F3: subtraction with unlike denominators, eliciting the same component actions in a distinct operation;
- F4: conditional mixed-number subtraction, integrating mixed-number conversion with the already sampled subtraction procedure.

The design removes standalone common-denominator and mixed-to-improper probes as redundant. Improper-to-mixed is excluded from the core until confirmed as an immediate workbook/teacher requirement. F4 is conditional; dependent downstream responses must not be counted as independent errors.

Most importantly, the learner sees only one action at a time. PacoGO must not pre-fill intermediate work, show later fields early, or solve the setup for the learner. The diagnostic remains formative, with no correctness feedback until completion and no formal evidence/mastery/learner-state/Supabase writes.

This is a candidate design, not runtime implementation. Exact branch/stop rules, workbook scope and local-storage compatibility remain to be resolved before code changes.

### Next concrete step

Review the candidate task set and close the three design checks: whether improper-to-mixed is in the immediate school scope; the observable prerequisite rule for administering F4; and the exact staged response/session schema. Only then implement pure mathematical evaluators and tests, followed by the staged learner interface.

### Verification boundary

- Task-set specification commit: `5111a7823a9df850e5839b9cd8ffa2527d559b69`.
- Handoff update commit: pending Full Regression.
- Full Regression must run on the exact resulting handoff commit before this documentation phase is considered verified.


---

## Current handoff update — 2026-11-11 (fraction diagnostic branch and session contract closed)

**Branch:** refactor/professional-v1. LIVE main untouched.

### Design decisions completed

The fraction diagnostic task-set specification now defines:
- F1–F3 as the core route; one incorrect answer alone does not stop the diagnostic.
- F4 is administered only when the F3 common denominator, both equivalent-fraction conversions and subtraction arithmetic are all valid. Otherwise F4 is not administered because prerequisites were not demonstrated; this is not evidence that mixed-number conversion is deficient.
- Improper-to-mixed conversion remains outside the core until confirmed as an immediate workbook/teacher requirement.
- A versioned v2 local session schema with ordered per-action raw responses and classifications.
- v2 uses a separate local-storage namespace; legacy v1 data is preserved untouched and is not migrated or reinterpreted.
- No formal evidence, inference, mastery, next-action, learner-state, registry or Supabase writes.

### Next concrete step

Before any evaluator implementation, run Full Regression on the exact current branch HEAD. If green, implement pure mathematical evaluators and unit tests as a bounded first code phase. Do not yet change the learner-facing runtime. If red, stop and isolate the exact cause.

### Verification boundary

- Prior verified baseline: Full Regression #3491 / run 43074854767, GREEN on 39fda06747d3e59e6506626a2ba42a5436e69a85.
- Task-set contract update commit: 0456bd12402ad3f57e3d31b2c737e446706333e9.
- Handoff update commit: pending.
- The final handoff commit must receive its own Full Regression before this design phase is closed.

---

## Current handoff update — 2026-11-11/12 (staged fraction diagnostic v2 session engine)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### What was built

Added a separate formative v2 session engine:

- `pacogo-engine/fraction-diagnostic-session-v2.js`
- `pacogo-engine/fraction-diagnostic-session-v2.test.js`

The v2 engine exposes exactly one current learner action at a time and accepts one non-negative whole-number response per submission. It advances in the fixed F1 → F2 → F3 order, and exposes F4 only when every F3 action is classified `valid`.

The engine stores the raw submitted value, action ID, classification and explicit dependency action IDs in presentation order. It preserves incomplete work when the learner stops. F4 is recorded as `not_administered` with `prerequisite_not_demonstrated` when the F3 gate is not met.

F1–F4 use the previously implemented pure mathematical evaluators. The F4 first-numerator evaluation also preserves dependency on an incorrect mixed-number conversion, so work that correctly follows the learner's submitted conversion is not counted as a second independent error.

Storage uses the separate namespace `pacogo:fraction-diagnostic:v2:<learnerKey>`. The legacy v1 session module and its stored data are unchanged. No formal evidence, inference, mastery, next-action, learner-state, registry or Supabase writes were added.

### Regression investigation and verification

The first Full Regression attempts exposed source-formatting and test-fixture errors. They were inspected at the exact failing lines:
- an invalid named-export syntax was corrected;
- dependent-consistency expectations were aligned with the mathematical relation;
- the F4 positive and negative gate fixtures were separated so the positive case actually has four valid F3 actions and the negative case has an invalid common denominator;
- literal escaped newline sequences introduced while updating source files were replaced with real line breaks.

No tests were removed or skipped, and no production behavior was changed merely to satisfy an incorrect test expectation.

- Full Regression #3511 / run `43134106967`: **GREEN** on exact commit `f691be34069c30b2d8eb19f8d3ea304f71f28d51`.
- The run completed the maintained Node regression, Vitest regression, browser regression and clean-working-tree verification.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/43134106967

### Current boundary

The v2 session engine is implemented and unit-tested, but it is not yet connected to the learner-facing diagnostic UI. The seven-step v1 UI/session remains the current learner-facing runtime until the staged v2 interface is separately designed, implemented and browser-verified. Do not run v2 with Zyon yet.

### Next concrete step

Before changing the learner-facing UI, inspect the current diagnostic page and its rendering/submission flow. Design a v2 presentation adapter that renders only the current action, retains the learner's prior submitted work as context without revealing future fields or answers, and gives no correctness feedback until the diagnostic is complete. Add browser tests proving one visible input at a time, no prefilled intermediate work, the F4 gate, and no formal learner-state writes. Run Full Regression before and after that bounded UI integration.

### Branch and verification state

- Working branch: `refactor/professional-v1`.
- Latest implementation commit verified before this handoff update: `f691be34069c30b2d8eb19f8d3ea304f71f28d51`.
- Latest verified Full Regression: #3511 / run `43134106967`, **GREEN** on that exact commit.
- This handoff update is itself a repository change and requires Full Regression on its exact resulting commit before the handoff is considered verified.

---

## Current handoff update — 2026-11-12 (staged v2 fraction diagnostic learner UI)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### What changed

Connected the staged v2 session engine to the existing learner-facing diagnostic route:

- `src/features/curriculum/fraction-diagnostic-runtime.js` now uses `createFractionDiagnosticSessionV2`; it no longer uses the legacy seven-probe v1 session.
- `src/features/curriculum/fraction-diagnostic.css` adds clear styling for the ordered answer history and single response field.
- `test/browser/curriculum-fraction-diagnostic-learner.browser.test.js` now covers the staged learner flow.

The learner interface renders exactly one numeric response field per action. The current expression is contextualized using the learner's already submitted values (for example, after selecting a common denominator, the next numerator conversion shows that denominator). Earlier raw responses remain visible as a history, without correctness classifications or prefilled future answers.

The interface gives no correctness feedback during the diagnostic. At completion it shows a neutral completion summary; it does not yet make targeted-practice recommendations from v2 classifications. A learner can stop; only already submitted responses are retained. Reloading an in-progress session resumes from the next unsubmitted action through the v2 local storage namespace.

F4 is shown only when every F3 action is classified valid. Otherwise the learner sees a neutral explanation that the mixed-number extension was skipped because the required subtraction steps were not all demonstrated.

The learner-facing route does not write formal evidence, assessment records, inference, mastery, next action, learner state, registry data or Supabase records. Legacy v1 storage is not read, migrated, reset or overwritten.

### Browser and regression verification

The browser suite verifies:
- exactly one visible input per learner action;
- the learner performs F1, F2, F3 and conditional F4 actions sequentially;
- prior responses are displayed as learner-entered history;
- no future action fields are exposed;
- F4 appears after valid F3 and is skipped after an invalid F3 prerequisite;
- stopping retains only already submitted responses;
- local storage uses the v2 namespace/schema;
- no Supabase RPC/formal learner-state writes occur;
- unlinked learner handling remains intact.

Full Regression #3521 / run `43136054099`: **GREEN** on exact commit `79963a203b9cb13994db54b5364bc80ed1506455`. Browser regression and clean-working-tree verification succeeded.

Run URL: https://github.com/huisartslasten/PAB/actions/runs/43136054099

### Current boundary and next step

The v2 session engine and learner-facing staged interface are integrated and regression-verified, but this is not yet a learner-tested or scientifically validated diagnostic. Do not infer Zyon's actual skill status from synthetic browser fixtures.

Next:
1. Verify the exact branch head and Full Regression after this handoff update.
2. Review the final UI and task wording against Zyon's current workbook/classroom material before live use. Do not add extra probes unless the material demonstrates they are needed.
3. Run a controlled first session in PacoGO TEST, not LIVE. Confirm the learner sees one action at a time and can enter each step himself. Avoid resetting any prior v1 data.
4. After the controlled TEST session, inspect the v2 raw response sequence and classifications for mathematical correctness before drawing any learning conclusions.
5. Only then design the interpretation/next-practice layer; it must not convert a formative diagnostic into formal mastery without a separate validated contract.

### Branch and verification state

- Working branch: `refactor/professional-v1`.
- Latest implementation commit verified before this handoff update: `79963a203b9cb13994db54b5364bc80ed1506455`.
- Latest verified Full Regression: #3521 / run `43136054099`, **GREEN** on that exact commit.
- This handoff update is itself a repository change and requires Full Regression on its exact resulting commit before the handoff is considered verified.

---

## Current handoff update — 2026-11-12 (F1 sequential classification refinement and contract status)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### Additional evaluator refinement

A final review of the sequential F1 actions identified an important distinction: when a learner gives an incorrect multiplier but independently supplies the mathematically correct numerator for the fixed target denominator, the numerator itself is valid. If the numerator instead follows the learner's incorrect multiplier, it is `dependent_consistent`; if neither relation is supported, it remains `ambiguous`.

The v2 session evaluator now distinguishes these cases. Unit tests cover:
- incorrect multiplier + correct target numerator → `invalid_relation`, then `valid`;
- incorrect multiplier + numerator following that multiplier → `invalid_relation`, then `dependent_consistent`;
- incorrect multiplier + numerator following neither relation → `invalid_relation`, then `ambiguous`.

Full Regression #3524 / run `43136408114`: **GREEN** on exact implementation commit `6b8a4cd259b11a9c0bbadaa033cb125193d37fc1`.

### Documentation alignment

The task-set specification and assessment contract were updated to stop describing runtime implementation as still unauthorised/pending. Their current status is now: formative v2 implementation baseline exists; controlled learner use and empirical validation remain pending. No formal curriculum, FR2, C1–C9, evidence, mastery, learner-state or Supabase contracts were changed.

### Current verified implementation state

- Staged v2 session engine and learner UI are integrated.
- Browser regression confirms one visible learner action at a time, ordered learner-entered history, F4 positive/negative gate, stop behavior, v2-only local storage, and no formal learner-state writes.
- F1 sequential evaluation distinguishes independently correct numerator work from dependent work after an incorrect multiplier.
- Legacy v1 session code/data remain untouched.
- No live deployment or PacoGO TEST learner session has been performed by this work.

### Next concrete step

1. Run Full Regression on the exact latest documentation commit and verify clean working tree.
2. Review the implemented Dutch prompts and the current school workbook/classroom scope. Do not expand the probe set without source evidence.
3. Have the parent run the staged flow in PacoGO TEST, not LIVE. Confirm the learner can complete each step independently and that no later fields/answers are shown.
4. Inspect the resulting v2 raw responses and classifications before drawing any conclusions or designing targeted practice. The diagnostic remains formative and is not empirically validated.

### Branch and verification state

- Working branch: `refactor/professional-v1`.
- Latest implementation commit with Full Regression verified: `6b8a4cd259b11a9c0bbadaa033cb125193d37fc1`.
- Latest verified Full Regression: #3524 / run `43136408114`, **GREEN** on that exact implementation commit.
- Latest task-set, assessment-contract and handoff documentation changes are pending their own Full Regression on the final documentation commit.


---

## Current handoff update — 2026-11-12 (fraction diagnostic inline answer presentation verified)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### What was built

The fraction diagnostic now renders the single active answer field directly in the mathematical expression rather than in a separate wide answer panel.

- F1 multiplier and numerator responses use compact inline fields.
- F2/F3 common-denominator responses appear inline alongside the original operation.
- F2/F3 arithmetic expressions retain the common denominator visibly, so the learner supplies the missing result numerator in a complete fraction expression.
- F4 retains the mixed-number and denominator context during conversion and subtraction.
- Prompts and answer-history labels are shorter and less technical.
- The answer input is inside the form and inside the expression; browser tests assert this.
- The v2 session contract remains one non-negative whole-number response per ordered action. Existing v1/v2 stored sessions are not migrated, reset, overwritten or reinterpreted.

### Root cause found during verification

Full Regression #3528 was RED on implementation commit `aadfd629769b413671be2bef2658736893f1d229`. The exact browser failure was a stale expected expression in the F3 subtraction test: it expected `1/2 − 2/5` while the intentional new interface correctly displayed `1/2 − 2/5 → noemer ?`. The other 64 browser tests passed; the maintained Node, Vitest and curriculum-engine checks had passed.

The test expectation was updated to the approved inline-denominator presentation in commit `cf8dd28cffb5928a1d6bcf282e3852b288b05e43`. No production behavior was changed to satisfy an incorrect mathematical test.

### Verification

- Implementation commit: `aadfd629769b413671be2bef2658736893f1d229`.
- Browser contract correction: `cf8dd28cffb5928a1d6bcf282e3852b288b05e43`.
- Full Regression #3529 / run `43144462130`: **GREEN** on exact commit `cf8dd28cffb5928a1d6bcf282e3852b288b05e43`.
- The run completed curriculum-engine, architecture, maintained Node, maintained Vitest, all browser tests and clean-working-tree verification.
- Run URL: https://github.com/huisartslasten/PAB/actions/runs/43144462130

### Boundaries and next step

- No curriculum registry, FR2/C1–C9, formal evidence, inference, mastery, next-action, learner-state or Supabase contract changed.
- Simplification is not part of diagnostic F1–F4. It remains a separate learner-controlled step to design in the Fraction practice interface.
- No real learner session or PacoGO TEST visual review has been performed. Browser fixtures are technical verification, not learner validation.

**Next concrete step:** review the inline learner flow in PacoGO TEST, confirm it preserves the intended step-by-step experience and raw answers, then build the Fraction practice route that starts targeted teaching promptly. The practice route must preserve the same curriculum and evidence boundaries while allowing the learner to request simplification where the task requires it.


---

## Current handoff update — 2026-11-12 (Adaptive Instruction architecture; existing SLO curriculum retained)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### Completed in this phase

1. Added `docs/curriculum/PacoGO_Adaptive_Instruction_Layer_Architecture_Specification_v0.1.md` (commit `9928ae8c4ef7ee9baea5e8a939253de8e3663e4f`). It defines the separation between curriculum objective, sourced instructional method profile, episode-specific instruction configuration and reusable Learning Interface.
2. Added `docs/curriculum/PacoGO_Instructional_Method_Profile_Selection_Contract_v0.1.md` (commit `597688f744f1383162e5fe93c86ee353d1872474`). It defines profile/provenance fields, deterministic selection outcomes and conflict handling. This is an instructional-method contract; it does not define or replace SLO curriculum goals.
3. The separately created `PacoGO_SLO_Fraction_Scope_and_Curriculum_Boundary_Review_v0.1.md` was removed in commit `4a2a08d457a61c675587944ddf56a357b2226c9f`. It was redundant and must not be treated as a PacoGO curriculum source.

### Existing SLO curriculum remains authoritative

The existing source documents were inspected and remain the basis. Do not recreate or reinterpret their content:

- `PacoGO_Curriculum_Rekenen_SLO_10-18_Mapping.md` is the existing candidate mapping of SLO kerndoelen 10–18 to the PacoGO skill architecture. It maps KD10B (breuken) to **FR1–FR2 plus relations with A/B**. It explicitly says SLO goals do not automatically become skills and that the 32 existing candidate content skills remain the top-level architecture for now.
- `PacoGO_Curriculum_B10_Complete_Model.md` integrates the existing B1–B9 work into the complete curriculum model. B10 is an integration layer, not a new curriculum research exercise.
- `PacoGO_Curriculum_Registry_v0.6.json` is the executable candidate registry. FR2 is specifically `Breukequivalentie herkennen en gebruiken`, with its existing developments, claims, evidence targets and task models. Do not expand FR2 to cover all fraction operations.
- `PacoGO_Curriculum_MachineReadable_v0.1.json` is the earlier machine-readable reference model; do not mistake it for the complete current registry.
- `PacoGO_Fraction_Learning_Interface_Design_v0.1.md` defines the reusable Fraction interface and its FR2 task coverage.
- `PacoGO_Zyon_Fraction_Diagnostic_Design_v0.1.md`, `PacoGO_Zyon_Fraction_Diagnostic_Task_Set_v0.1.md` and the assessment contract define the separate formative diagnostic. F1–F4 are not new FR2 registry tasks and do not create formal evidence or mastery.

The SLO mapping is a **candidate mapping** and the registry's skill models are **candidate constructs**, not empirically validated constructs. Preserve those epistemic labels. The current short F1–F4 diagnostic is not a complete assessment of all fraction goals or end-group-8 / 1S attainment.

### Immediate learner and implementation boundary

The immediate objective remains to let Zyon begin targeted fraction practice promptly, using the already documented SLO curriculum, existing FR2 boundaries, the formative diagnostic and the supplied school-work examples. Do not invent a new fraction skill sequence from the diagnostic or from general SLO knowledge. Do not claim that FR2 alone represents the complete fraction domain.

The next work is an **inventory of existing SLO skills and their implementation status**, as already specified in this handoff: identify which existing mapped skills are complete, partial or not yet implemented; which existing Learning Interfaces and tasks support them; and what remains before learners can use them. This is an inventory, not curriculum redesign. Prioritise Zyon's current learning needs only within the existing curriculum and approved contracts.

Adaptive instruction remains a cross-interface architecture requirement. It may adapt explanations and representations to a sourced school method while preserving existing curriculum objectives and evidence boundaries. It does not authorise changing the SLO mapping, skills, developments, claims, evidence targets or mastery criteria.

### Verification

- Full Regression #3531 / run `43145347192`: GREEN on exact commit `9928ae8c4ef7ee9baea5e8a939253de8e3663e4f`.
- Full Regression #3532 / run `43145663498`: GREEN on exact commit `597688f744f1383162e5fe93c86ee353d1872474`.
- Full Regression #3533 / run `43145958687`: GREEN on exact commit `e2ff9c865ad5eb9e19c61a75d82f01dec3586883`; this run tested the then-current tree including the now-deleted SLO review document.
- Full Regression #3535 / run `43146457949`: GREEN on exact deletion commit `4a2a08d457a61c675587944ddf56a357b2226c9f`.
- No curriculum registry, skill, development, claim, evidence target, mastery criterion, learner state, runtime or Supabase contract was changed in this phase.

### Next concrete step

Complete the read-only inventory against the existing SLO mapping, B10 model, current registry and existing skill/task/interface implementation. Report exact existing coverage and gaps before selecting the next bounded implementation task. Do not create replacement SLO goals or a new curriculum mapping.

**Latest verified Full Regression:** #3535 / run `43146457949`, GREEN on exact commit `4a2a08d457a61c675587944ddf56a357b2226c9f`. Any subsequent handoff change requires its own Full Regression.


---

## Current handoff update — 2026-11-12 (fraction-only scope correction and traceability inventory)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Governing task scope confirmed

Read the complete user-provided `PacoGO_Overdracht_Complete_Breukenleerlijn_en_Uitvoerbare_Leerroute_2026-11-12(1).txt` (607 lines). Its B → C order is controlling for the immediate product:
- B: consolidate the already existing vertical fractions curriculum.
- C: connect it to an executable learner route.
- Only after the fractions line and route are completed should the same approach expand to other mathematics domains.

The user-provided handoff explicitly says not to begin a broad inventory of all mathematics domains and not to invent FR1/FR2 content, skills, developments, claims, evidence targets, task models, prerequisites or mastery rules.

### Scope correction

A broad 32-skill implementation inventory was briefly committed in `PacoGO_SLO_Skill_Implementation_Status_Inventory_v0.1.md` (commit `727a3f675508adc1a524e60d4f9c2f334702fe28`, Full Regression #3537 GREEN) and later clarified for the C6–C9 runtime boundary (commit `fcbe76bbae6116549c43313c96b15bcb61a1d883`, Full Regression #3538 GREEN). That broad artifact is removed in the current correction because it does not match the fractions-only scope of the user-provided handoff. Do not resume the all-domain inventory.

### Fraction-specific traceability findings

Created `docs/curriculum/PacoGO_Fraction_Curriculum_Traceability_Inventory_v0.1.md`. It consolidates only existing fraction sources and implementation:
- Existing SLO mapping: KD10B → FR1–FR2 plus documented A/B relationships.
- FR2 remains the registered candidate skill `Breukequivalentie herkennen en gebruiken`, with D1–D3, C1–C3, ET1–ET6 and TM1–TM5.
- The current registry v0.6 has FR2 but no FR1 entry. Earlier project conversations contain an FR1 working definition (“Breuken representeren en interpreteren”) and a previously discussed outline; this is recorded with provenance and is not silently promoted to a current registry contract.
- No FR1 formal claim/evidence/task IDs are invented. The original FR1 source/decision and any existing formal fields must be recovered before registry or task binding.
- FR2 T01–T05 remain synthetic technical demonstrations with the task/evidence alignment gaps already recorded in the FR2 audit.
- The three-item FR2 practice route remains a narrow equivalent-fraction slice with browser-local progress.
- Diagnostic v2 remains a staged formative F1–F4 route with local-only raw responses; it does not create formal evidence, mastery or learner state.
- Adaptive Instruction and method-profile selection remain design proposals; classroom photographs establish demonstrated procedures, not an exclusive universal school method.
- The current learner-facing fraction route is not an integrated canonical C1–C9 branch-specific runtime. No Supabase change is indicated.

### Next concrete step

Complete the **fractions-only source consolidation**:
1. Recover the original FR1 source/decision and exact already-defined formal structure, if it exists.
2. Bring FR1 and FR2, their source-supported developments/claims/evidence/task models and documented A/B/VR relationships into one traceable vertical fraction overview.
3. Mark only genuine missing source definitions or contract gaps as open; do not fill them with general didactic assumptions.
4. Use that overview immediately to design the smallest safe executable fraction practice route C, preserving the formal/formative boundary and requiring Zyon to perform the steps himself.

Do not begin a broad all-domain inventory. Do not expand FR2, invent FR1 identifiers or create FR3. Do not modify runtime, registry, C1–C9, Supabase or learner data without the applicable gate and explicit authorization.

### Verification before this handoff update

- Previous verified commit: `8d328dcfd2e67a93709696091974c2e84a9a42da`.
- Full Regression #3539 / run `43215088121`: GREEN on that exact commit.
- The current fraction-specific inventory + handoff update is a project documentation change and requires Full Regression on its exact resulting commit before closure.


---

## Current handoff update — 2026-11-12 (FR1 source recovery from prior curriculum handoffs)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Prior source artifacts recovered

A Library search and targeted reads recovered the earlier curriculum handoffs:
- `PacoGO_Curriculum_Overdracht_01-11-2026(1).txt`;
- `PacoGO_CURRICULUM_OVERDRACHT_01-11-2026-2(1).txt`;
- `PacoGO_Curriculum_Overdracht_B10(1).txt`;
- `PacoGO_Curriculum_Overdracht_Skillmodel_v0.1(1).txt`;
- `PacoGO_Curriculum_Overdracht_Volgende_Chat(1).txt`.

These sources establish FR1 as an existing skill, not a blank concept:
- FR1 — **Breuken representeren en interpreteren**;
- core: fractions as meaningful quantities/relationships, including quantity, part–whole, ratio and position; not primarily fraction calculations;
- FR2 remains the separate skill **Breukequivalentie herkennen en gebruiken**;
- the fraction skill family was recorded as two skills; no separate FR3 or separate skill for comparing, ordering, positioning, simplification or common denominator.

The prior network/prerequisite matrix records A1 → FR1 (S), A2/A6 → FR1 (O), FR1 → FR2 (E/S), FR1 → VR1 (S), and FR2 → VR1/VR2 (O/S). These remain candidate/supporting relationships, not automatically hard runtime gates.

### Exact FR1 gap after source recovery

The recovered handoffs confirm FR1's skill-level definition, prior status and cross-skill relationships. However, the inspected sources do not supply a source-verifiable formal FR1 development list, FR1 claims, evidence targets, task models or executable task catalogue. A prior summary described a possible development outline, but no matching source artifact was recovered; it is not promoted to a formal FR1 contract. No `FR1.D*`, `FR1.C*`, `FR1.ET*` or `FR1.TM*` IDs were invented.

The fraction-specific inventory was corrected accordingly at `docs/curriculum/PacoGO_Fraction_Curriculum_Traceability_Inventory_v0.1.md`. It now distinguishes the existing FR1 skill definition from the missing formal development/evidence/task contract.

### Next concrete step

Continue the three-level fractions inventory, not a broad all-domain inventory:
1. Curriculum: complete the source-supported FR1/FR2 structure and A/B relationships; recover the original FR1 Skill Development Pass / Development Evidence File if it exists. If it cannot be found, state the exact missing formal fields and obtain only the smallest necessary owner disposition. Do not recreate FR1 from general didactics.
2. Technical: map each existing FR1/FR2 curriculum element to actual task definitions, controllers, Fraction interface, learner pages, raw-response handling, task-skill binding, evidence path and tests.
3. Learner route: trace diagnostic completion → formative interpretation → first suitable practice → explanation/visual support → learner-entered steps → retained responses/progress → next step.

Then consolidate the three levels into one traceable fraction overview and move directly toward executable route C. Keep FR2 narrow; do not add FR3; do not invent FR1 IDs, claims, evidence, tasks or mastery rules. No runtime, registry, C1–C9, Supabase or learner data change is authorized by this source-recovery update.

### Verification before this handoff update

- Previous verified commit: `38b30031e9d81095eeead07366b4281db463f089`.
- Full Regression #3540 / run `43215478297`: GREEN on that exact commit.
- This source-recovery inventory + handoff update requires Full Regression on its exact resulting commit.


---

## Current handoff update — 2026-11-12 (fraction task, interface and learner-route traceability)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Read-only implementation trace completed

Inspected the exact current Fraction diagnostic/practice runtime, assessment functions, task set, Fraction Learning Interface contract/renderers, relevant unit/browser tests, route registry and current branch tree.

Key findings added to `docs/curriculum/PacoGO_Fraction_Curriculum_Traceability_Inventory_v0.1.md`:

- The pilot task set defines five candidate FR2 tasks T01–T05, but the current branch tree contains only two FR2 demo HTML pages: T01 and T02. T03 appears in a controller unit-test fixture; T04/T05 remain task-set definitions/audit items without current learner-facing pages or browser tests. Historical readiness-matrix entries listing five separate pages are stale relative to the current branch tree.
- Pilot task set v0.1 is `candidate` / `design_only`; tasks are test fixtures, not validated curriculum measures.
- FR2 alignment remains open: T01/T02 explanations do not themselves establish ET3; T03/T05 name ET3 while TM2 requires ET3+ET4; T04 is a countertask but mapped to TM1/ET1 rather than TM5/ET2+ET6; TM4/ET5 functional-use task T06 is absent.
- The two technical demo pages use registry v0.2 seed, pilot task set v0.1 and synthetic learner context. Their generated quality/relevance/independence/contradiction shortcuts are not approved C3 assessments.
- The Fraction Learning Interface supports proper fractions, symbolic/area models, multiple-choice selection and optional explanation text. It does not provide staged numeric inputs or mixed/improper fraction rendering. The diagnostic's one-at-a-time numeric field is custom to its runtime, not a reusable Fraction component.
- The three-item practice page stores only completed IDs, attempt counts and total correct answers. It does not preserve raw selected options or explanations and is not adaptively routed.
- Diagnostic v2 stores raw numeric answers/classifications/dependencies locally and presents one action at a time, but the completion view only shows a neutral summary/history. It does not interpret results into a next practice task and has no direct practice navigation.
- The practice page links to the diagnostic, but does not pass the selected learner context; the diagnostic does not link back to practice. The practice page is standalone, while the diagnostic is centrally registered in `src/app/routes.js`.
- The task-set design says to stop when the learner is struggling substantially in F1/common-denominator actions, but the v2 engine has no defined threshold or early-stop branch; only the F4 gate and manual stop are implemented.
- F1's fixed v2 classifier is hard-coded for its single item even though a general equivalent-fraction evaluator exists and is unit-tested. Keep this visible before generalizing task variants.
- Unit tests cover alternate common denominators; the current browser flow demonstrates only 12 and 10. Browser-level alternate-denominator integration is not demonstrated.

### Current learner-flow boundary

The current state is not yet the requested executable learning route C. It consists of a diagnostic route and a separate fixed three-item practice route. There is no result interpretation → targeted teaching → practice → next step chain. The two routes do not preserve learner context across navigation. No runtime changes were made during this inspection.

### Next concrete step

Finish the fractions-only three-level inventory by reconciling each FR1/FR2 curriculum element against its task contract, interface capability, learner route, raw-response storage, assessment boundary and test proof. Then select the smallest safe route-C implementation slice. The first slice must connect a completed formative diagnostic to an appropriate learner-controlled practice episode without creating formal mastery or filling intermediate answers. Do not start that implementation until the existing curriculum scope and route contract are explicit; use a separate narrow authorization if the work exceeds the existing FR2 practice/diagnostic scope.

### Verification before this handoff update

- Previous verified commit: `e43e249c6817ab986b389c6f775fb57367c8f36e`.
- Full Regression #3541 / run `43215897080`: GREEN on that exact commit; all 20 workflow steps passed, including browser regression and clean-working-tree verification.
- This inventory/handoff update is documentation-only and requires Full Regression on its exact resulting commit.


---

## Current handoff update — 2026-11-12 (first diagnostic-to-practice learner-route connection)

**Branch:** `refactor/professional-v1`. LIVE `main` untouched.

### Built

A deliberately narrow route-C navigation slice now connects the existing formative fraction diagnostic with the existing FR2 practice page:

- A learner who completes the diagnostic sees a neutral continuation action: **“Verder naar gelijkwaardige breuken oefenen”**.
- The action opens the existing three-item FR2 equivalent-fraction practice route.
- The selected PacoGO roster learner is carried as `viewStudent`.
- The practice page resolves that roster identity through the existing student registry and `getAppLearnerProfile`; it does not silently select a different learner.
- Returning from practice to the diagnostic preserves the same `viewStudent` context.
- A manually stopped/incomplete diagnostic does not show the completion continuation action.
- The browser regression exercises the full diagnostic → practice → diagnostic round trip and checks that Zyon remains selected.

The practice page remains a standalone HTML route; it is not falsely registered as a central router route. The transition uses a full page navigation because the destination is not in `src/app/routes.js`.

### Boundaries preserved

- This is navigation to the existing FR2 practice episode, **not** a diagnosis-based recommendation or adaptive instructional decision.
- The diagnostic answers are not interpreted into mastery, a permanent learner trait, or a targeted learning prescription.
- No new task, skill, development, claim, evidence target, task model, prerequisite or mastery rule was created.
- Existing diagnostic and practice task content and local-storage semantics were not changed.
- No curriculum registry, C1–C9, learner-state, Supabase, SQL/RPC/RLS or learner data changes were made.
- FR2 remains the narrow equivalent-fraction skill; this slice does not complete the full fraction learning route or the FR1 source gap.

### Regression history and root cause

- Full Regression #3545 / run `43217488740`: GREEN on `81f495ad4fb1a377d8a353c9931d879214ae71d9`; the route round-trip implementation and browser test passed.
- An intentional wording refinement changed the destination button label to identify the actual FR2 practice content. The intermediate commit `29efb3926bedd21c29a2803bbc5f38ee5456e099` had a stale browser assertion for the previous label; Full Regression #3546 was RED only at the browser step, with the test waiting for the old label. The runtime navigation itself was not the failure.
- The browser assertion was updated to the new precise label. Full Regression #3547 / run `43217736298`: GREEN on exact commit `d246a4c3eaebd8174e0c3940d8552475be262939`, including all 20 workflow steps and clean working tree.

### Next concrete step

Continue route C, not broad curriculum redesign: determine the smallest supported learner-facing practice episode that lets Zyon perform the required fraction steps himself, with visual explanation and small numeric input where the existing source/task contracts support it. Keep any activity without a formal FR1/FR2 task/evidence mapping explicitly formative/non-formal. Do not infer a targeted lesson from the diagnostic automatically, and do not fill the FR1 development/claim/evidence/task gap with invented curriculum. Reconcile the exact school method only from confirmed source material; do not impose an unverified method.

The route connection is an initial integration step, not completion of the user's goal. The complete executable fraction learning route remains open.


### Verification trigger for the 2026-11-12 route handoff update

The route implementation was verified by Full Regression #3547 (GREEN) on `d246a4c3eaebd8174e0c3940d8552475be262939`. The route handoff and fraction traceability inventory were then committed together in `c305953150c43134148157bf158f269bf0d07e6c`. This follow-up handoff commit includes that documentation update and is the exact commit submitted for Full Regression before this phase is closed.



---

## Current handoff update — 2026-11-12 (learner-entered equivalent-fraction construction practice)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Built

The existing three-item recognition practice remains unchanged. After completing it, the learner may choose a separate, extra practice episode: **Maak zelf een gelijkwaardige breuk**.

- The learner sees the target fraction as an area model and a symbolic expression with the target denominator supplied and the numerator left blank.
- The learner enters the numerator in a small, reusable numeric-input control; PacoGO does not prefill or calculate it.
- Three examples reuse fraction values already present in the existing practice set: 1/2 with denominator 4, 1/3 with denominator 6, and 2/3 with denominator 6.
- The response is checked for equivalent value by the mathematical equality of the two fractions. The feedback is deliberately conceptual and does not prescribe a school-specific procedure.
- The learner can retry an incorrect answer. Only after a correct response does the next item become available.
- Raw entered numerators and response classifications are stored locally under a separate learner-keyed, versioned storage key. The previous recognition-practice storage is not changed or migrated.

### Formal and instructional boundaries

- These three new local task identifiers are **formative practice identifiers only**, not FR2 registry task IDs, not FR2-T01–T05, and not formal evidence tasks.
- No FR2 development/claim/evidence mapping, assessment rule, mastery rule, learner-state decision or curriculum registry entry was changed.
- The activity is optional and is not automatically selected from the diagnostic. It does not turn a diagnostic classification into a learner trait or next-action decision.
- The prompt uses a method-neutral visual/conceptual explanation. It does not claim to match Zyon's school method and does not implement the unapproved Adaptive Instruction Layer proposal.
- The denominator is supplied; this first slice captures one learner-entered numerator action. It does **not** yet provide multi-step common-denominator addition/subtraction, mixed-number work, or the complete fraction route.
- No Supabase, database, RPC, RLS or formal learner-data changes were made.

### Implementation files

- `pacogo-engine/fraction-numerator-input.js` — reusable small numerator input control.
- `pacogo-engine/fraction-construction-practice-session.js` — separate learner-isolated formative session and raw response store.
- `pacogo-engine/fraction-construction-practice-session.test.js` — session, equivalence evaluator and learner-isolation tests.
- `curriculum-fr2-practice-learner.html` — optional construction practice entry and learner flow.
- `test/browser/curriculum-fr2-practice-learner.browser.test.js` — browser flow and local-storage boundary coverage.

### Regression history

- Feature commit `4908257e7e428e1cea47a0167b0fa44ac3e3b1f3`: Full Regression #3550 was RED in the new session unit test. The exact cause was an over-escaped digit pattern in the raw-numerator parser, which classified digit strings as invalid input. The failure was in implementation code, not the test.
- Corrected parser commit: `216e5b4c08b0e20c9ff59271d0a773d8d567982c`. The test was not weakened or changed to hide the defect.
- Browser proof #683 / run `43219389468` was GREEN on the feature commit, but it does not supersede the failed Full Regression.
- This handoff/inventory update is submitted as a separate documentation commit. Full Regression on its exact resulting commit is the verification gate for this phase; do not report the phase green until that run is actually complete and successful.

### Next concrete step

Review the learner-facing presentation in PacoGO TEST before using it with Zyon. Then continue the fraction route with the next source-supported practice capability. Before adding common-denominator operations or mixed-number teaching, resolve the appropriate SLO/FR1 curriculum scope and the instructional-method provenance/unknown-method boundary. Do not expand FR2 to absorb those operations, infer Zyon's school method from his answers, or implement the unapproved Adaptive Instruction Layer proposal as if it were approved.

The complete executable fraction learning route remains open.



### Regression closure — 2026-11-12

- Full Regression #3550 / run `43219389375`: RED on feature commit `4908257e7e428e1cea47a0167b0fa44ac3e3b1f3`. Root cause: the raw-numerator parser used an over-escaped digit pattern, so numeric strings were classified as invalid. Fixed in `216e5b4c08b0e20c9ff59271d0a773d8d567982c`; the test expectation was preserved.
- Full Regression #3551 / run `43219469622`: RED on parser-fix commit `216e5b4c08b0e20c9ff59271d0a773d8d567982c`. Root cause: the browser test expected the new construction-practice storage key before it had actually launched and completed that episode.
- Full Regression #3552 / run `43219620208`: RED on documentation commit `1a476ba08f9269b75e7714d2e0bf67a877751930` for the same browser-test coverage gap.
- The browser test was corrected to execute the entire learner flow before inspecting local storage. No assertion was removed or weakened.
- Full Regression #3553 / run `43219737675`: **GREEN** on exact commit `aa2e79a53aab4f624bf13732b445d0a8b681f9db`. All 20 workflow steps passed, including curriculum engine regression, architecture checks, Node/Vitest tests, browser regression and clean-working-tree verification.
- Browser proof #684 / run `43219737492` was also triggered on the same exact commit; its outcome should be read from the workflow record if needed.

The handoff and fraction inventory updates are included in this verified code/test tree. The follow-up documentation commit that records this closure must itself pass Full Regression before this phase is closed.


### Verification target for the 2026-11-12 handoff closure

The learner-entered equivalent-fraction practice and its browser coverage passed Full Regression #3553 on `aa2e79a53aab4f624bf13732b445d0a8b681f9db`. This follow-up commit records the regression history in the handoff and traceability inventory; Full Regression must also pass on this exact follow-up commit before the documentation phase is closed.



---

## Current handoff update — 2026-11-12 (staged formative fraction addition practice)

**Branch:** `refactor/professional-v1`; LIVE `main` untouched.

### Built

A separate optional practice episode now follows the learner-entered equivalent-fraction construction practice: **1/3 + 1/4**.

The learner completes four actions, one at a time:
1. choose a common denominator for 3 and 4;
2. enter the equivalent numerator for 1/3;
3. enter the equivalent numerator for 1/4;
4. add the two numerators.

The two original fractions are shown as area models. Only the active step and its small integer input are shown; future steps are not displayed or prefilled. The learner can retry a step before proceeding. Any valid common denominator is accepted, not just 12. The final fraction is shown using the denominator and numerators the learner supplied; PacoGO does not silently simplify it.

### Boundaries

- The sequence is based on the existing F2 episode in `PacoGO_Zyon_Fraction_Diagnostic_Task_Set_v0.1.md`, but this is a **separate non-formal practice activity**, not a diagnostic replay, formal FR task, registry task ID or evidence measure.
- It does not expand FR2 to include fraction addition and does not invent FR1 claims/evidence/task models.
- The feedback is method-neutral: it accepts any valid common denominator and does not claim alignment with Zyon's school procedure.
- Each step's raw input and practice classification are stored locally under a separate learner-keyed, versioned storage key. Diagnostic state and the other practice stores remain separate.
- No formal evidence, inference, mastery, next-action, learner-state or Supabase/database writes occur.

### Implementation files

- `pacogo-engine/fraction-addition-practice-session.js` — four-step practice state, any-valid-common-denominator check, response history and local progress.
- `pacogo-engine/fraction-addition-practice-session.test.js` — step order, valid/invalid denominator, equivalent numerator, arithmetic result, retry, raw response and learner isolation.
- `pacogo-engine/fraction-numerator-input.js` — generalized reusable integer-input primitive; numerator-specific wrapper remains for the previous practice.
- `curriculum-fr2-practice-learner.html` — visual F2 practice episode.
- `test/browser/curriculum-fr2-practice-learner.browser.test.js` — end-to-end step visibility, retry, progression, final result and local-only persistence.

### Verification

- Full Regression #3556 / run `43220904553`: **GREEN** on exact commit `287d327daa81928c1bbc9500ad0c5231b60ada51`. All 20 workflow steps passed, including browser regression and clean-working-tree verification.
- Browser proof #685 / run `43220904486`: GREEN on the same exact commit.
- This handoff and traceability-inventory update is a separate documentation change and must be included in a Full Regression run on its exact resulting commit before closure.

### Next concrete step

Build the analogous optional F3 subtraction practice from the existing task-set sequence: 1/2 − 2/5, learner-selected common denominator, both learner-entered equivalent numerators, and learner-entered subtraction result. Continue accepting any mathematically valid common denominator and keep the activity non-formal. Do not add mixed-number teaching or formal FR1/FR2 task bindings until the relevant curriculum scope and method provenance are resolved.

The complete executable fraction learning route remains open.


### Verification target for the 2026-11-12 addition-practice handoff

The staged F2 addition practice was verified by Full Regression #3556 (GREEN) on `287d327daa81928c1bbc9500ad0c5231b60ada51`. This follow-up handoff/inventory documentation commit must also pass Full Regression on its exact resulting commit before the phase is closed.


---

## Current handoff update — 2026-11-12 (learner-authored inline fraction results)

### User-approved Learning Interface requirement

The learner-facing arithmetic practice must keep the mathematical expression as the primary work surface. Numeric response fields belong directly in the expression at the missing mathematical position; they must not be presented only as a separate answer panel below the sum.

For an improper result such as 15/10, the learner may explicitly select a mixed-number representation. That action reveals the whole-number, numerator and denominator input positions in the equation, allowing the learner to enter 1 5/10. PacoGO must not calculate or prefill these values.

A separate learner-triggered **Vereenvoudigen** action then reveals a second equation for the fractional part (for example, 1 5/10 = 1 [numerator]/[denominator]). The learner enters both values, such as 1 and 2. PacoGO validates mathematical equivalence and the intended simplified form; it must not silently reduce the fraction or replace the learner's raw response.

This is a user-approved product/interface requirement for non-formal fraction practice, not a new curriculum skill, formal task, evidence target, diagnostic action or mastery rule. The diagnostic F1–F4 contract remains unchanged.

### Source and implementation check

- The diagnostic runtime already has an inline mathematical-expression renderer (renderMathExpression) that places its single active numeric input inside the expression.
- The separate F2 practice page currently renders its arithmetic expression as text and mounts the numeric input in a separate panel (#additionInput). It does not yet meet the inline-expression requirement.
- The reusable Fraction Learning Interface remains a proper-fraction recognition/equivalence instrument. Its current contract rejects improper fractions and it has no arithmetic numeric-entry or mixed-number/simplification workflow. Do not overload its FR2 recognition contract with arithmetic behavior.
- The F2 practice result is 7/12, so it does not exercise mixed-number conversion or simplification. The sample 15/10 is an interaction example, not an authorization to change the source diagnostic task set.

### Revised next implementation sequence

1. Create a reusable learner-facing arithmetic-expression input/rendering capability for non-formal practice, preserving one active learner-entered value at a time and keyboard accessibility.
2. Refactor the existing F2 practice so its missing values appear inside the equation rather than in a separate answer panel.
3. Add the optional learner-controlled mixed-number and simplification stages, preserving raw responses and validating equivalence without automatic completion.
4. Reuse the same capability for the separate F3 subtraction practice (1/2 − 2/5), based on the existing diagnostic task-set sequence. F3 remains optional, formative and local-only.
5. Review the result in PacoGO TEST before Zyon uses it. Technical regression does not establish pedagogical validation.

Preserve all existing formal/non-formal boundaries: no FR1/FR2 registry expansion, no invented developments/claims/evidence/task models, no C1–C9 changes, no mastery/next-action/learner-state writes, and no Supabase change absent a real persistence contract need.

### Verification target

This is a documentation-only clarification following Full Regression #3558 (GREEN) on baseline commit e771796b1929c787b99b79d87a1db6e08c97dfe9. Full Regression must run on the exact resulting documentation commit before this update is closed or the next implementation slice begins.


### Implementation update — reusable inline expression entry (F2 practice)

The F2 arithmetic practice has been refactored so its active numeric response is rendered directly inside the mathematical expression. The common-denominator step now appears as part of the original operation, and subsequent equivalent-numerator and result fields occupy the corresponding numerator/result positions. The separate input host contains only the action button. The new renderer supports multiple missing positions, accessible input labels, keyboard focus and locking; it is intended for reuse by subsequent non-formal arithmetic practice. Raw response storage and the F2 session contract are unchanged. The new browser coverage asserts that the field is inside the expression and that the learner still completes the same four steps. Mixed-number and simplification stages are not yet implemented; they remain the next interface increment.


### Regression investigation — inline F2 practice renderer

- Full Regression #3560 / run 43226149457: RED on exact commit 2da5177fe445a5197b94cab1981211f15ab07449. Curriculum engine, architecture, maintained Node and Vitest steps passed; browser regression failed at a stale assertion expecting the F2 numeric input under #additionInput.
- The new renderer correctly places that input inside #additionExpression; the browser test still contained a second old-location assertion at the second step. This is a test expectation that no longer matches the intentionally changed UI contract, not a runtime failure.
- The browser test is corrected to assert the input remains inside #additionExpression and that #additionInput contains no input. No coverage is removed or weakened. Full Regression on the exact follow-up commit is required before proceeding.


### Regression investigation — stale focus reference

- Full Regression #3561 / run 43226477223: RED on exact commit 921efb10cd078cb0fda5047e9d5f9016b33a9f73. Curriculum engine, architecture, Node and Vitest checks passed. Browser regression reached the complete F2 route but detected two page errors during incorrect-answer retries: a stale call still referenced the removed addition input instance when restoring focus.
- Root cause: one occurrence remained because the first code transformation replaced only the first matching focus call. This is an implementation defect, not a browser-test defect.
- The stale declaration and reference are removed; both invalid-response focus paths now target the active inline expression input. The browser test continues to exercise incorrect common denominator and incorrect arithmetic result, and continues to require zero page errors. Full Regression on the exact correction commit is the next gate.


### Regression closure — F2 inline expression input — 2026-11-12

- Implementation commit: `2da5177fe445a5197b94cab1981211f15ab07449` introduced the reusable `pacogo-engine/fraction-practice-equation.js` renderer and moved F2 practice inputs into the mathematical expression. The F2 session remains four learner-entered actions; raw storage and classification are unchanged.
- Full Regression #3560 / run 43226149457: RED because a second browser assertion still expected the input in the former separate host. The assertion was corrected to verify the inline location and no input in the old host.
- Full Regression #3561 / run 43226477223: RED because one invalid-response path still referenced the removed input instance for focus. That implementation reference and its stale declaration were removed; the browser retry coverage remains.
- Full Regression #3562 / run 43226779723: **GREEN** on exact commit `774bfeae618c301cd33c2d83c4b24d4ed3a57b82`. All 20 workflow steps passed, including curriculum engine, architecture boundaries, Node, Vitest, browser regression and clean working tree.
- This closure documentation update must itself pass Full Regression on its exact resulting commit before the phase is closed.

### Next concrete step

Implement the optional learner-controlled mixed-number conversion and simplification stages on the non-formal arithmetic practice result flow. Use a proper/improper fraction-capable equation renderer and preserve raw whole-number/numerator/denominator entries. Only after that shared result flow is verified, reuse the same inline equation input for the separate F3 subtraction practice (1/2 − 2/5). Do not modify the diagnostic F1–F4 contract or FR1/FR2 formal curriculum mappings.


### Implementation update — learner-entered mixed-number and simplification practice

Added a separate optional, non-formal practice episode using the user-provided example 15/10. It is offered after the existing F2 addition practice; it does not alter the F2 task (1/3 + 1/4), the diagnostic task set, FR1/FR2 curriculum scope or any formal evidence contract.

Stage 1 shows the inline equation `15/10 = ? ?/?`; the learner enters whole number, numerator and denominator. PacoGO validates the learner's decomposition and does not prefill the fields. Only after a valid response does the learner choose **Vereenvoudigen**.

Stage 2 shows `1 5/10 = 1 ?/?`; the learner enters a numerator and denominator. PacoGO validates equivalence and requires the entered fraction to be in lowest terms. It does not calculate or fill the answer. Raw values and classifications for valid and invalid attempts are stored in a separate learner-keyed, versioned local-only store. No formal evidence, mastery, next action, learner state or Supabase writes are made.

The shared inline renderer is reused with multiple input slots. Unit and browser regression cover incorrect decomposition, retry, a mathematically equivalent but unsimplified answer (2/4), successful 1/2 entry, learner isolation and the local-only boundary. This example is a non-formal practice activity based on the user's requested example, not a new formal curriculum task or empirical validation.

Next: verify this implementation through Full Regression on its exact commit. After green, proceed to the separate F3 subtraction practice (1/2 − 2/5) using the same inline entry capability.


### Regression closure — mixed-number and simplification practice — 2026-11-12

- Implementation commit: `892d7176fcbe17f9d66ca3d4af4dae6766f99ece` added the learner-entered non-formal 15/10 result-form episode, its own local-only learner-keyed store, unit tests, browser coverage and the shared inline renderer integration.
- Full Regression #3564 / run 43230489974: **GREEN** on exact commit `892d7176fcbe17f9d66ca3d4af4dae6766f99ece`. All 20 workflow steps passed, including curriculum engine, architecture, Node, Vitest, browser regression and clean working tree.
- The implementation is an optional practice example, not a new formal FR1/FR2 task or diagnostic task. It does not modify the F2 1/3 + 1/4 episode, diagnostic F1–F4, C1–C9, mastery, next action, learner state or Supabase contracts.
- This handoff closure update must itself pass Full Regression on its exact documentation commit.

### Next concrete step

Build the separate non-formal F3 subtraction practice based on the existing diagnostic F3 episode `1/2 − 2/5`, using the shared inline expression renderer. Keep the learner-entered sequence explicit: choose a valid common denominator, enter the equivalent numerator for each original fraction, and enter the subtraction result. Preserve raw attempts in a separate learner-keyed local-only store. Do not change the diagnostic F3 contract or formal FR1/FR2 mappings. After implementation, inspect the learner-facing page in browser regression and verify exact-commit Full Regression. Before Zyon uses it, review the actual PacoGO TEST presentation; automated regression is not pedagogical validation.


### Implementation update — separate F3 subtraction practice

Added a separate optional non-formal practice episode based on the existing diagnostic F3 task `1/2 − 2/5`. The four learner-entered stages follow the source sequence exactly: (1) choose any valid common denominator; (2) enter the equivalent numerator for 1/2; (3) enter the equivalent numerator for 2/5; (4) subtract the learner's converted numerators. The expression and one active inline input are visible at each stage; future actions are not shown or prefilled.

The practice accepts any positive common multiple of 2 and 5, not only 10. The browser regression exercises 20 as an alternate denominator and verifies 10 − 8 = 2, displaying the learner's result as 2/20 without automatically simplifying it. Invalid denominator, conversion and subtraction responses can be retried. Raw attempts and classifications are saved in a separate learner-keyed versioned local-only store. No diagnostic F3 session is started or modified; no formal evidence, mastery, next action, learner state or Supabase writes occur.

This is non-formal practice derived from the existing diagnostic action sequence, not a formal FR1/FR2 task/evidence mapping. Full Regression on the exact implementation commit is required before closure.


### Regression investigation — F3 browser scenario ordering — 2026-11-12

- Full Regression #3566 / run 43231374670: RED on exact implementation commit `a2d66787f702f89dca8eb0b98d93f504fcc49317`. Curriculum engine, architecture, Node and Vitest passed. Browser regression failed because the test asserted five local stores before executing the new F3 route; the snapshot therefore correctly contained only the four stores created by earlier episodes.
- This is a browser-test ordering defect: the F3 interaction scenario was appended after the local-storage snapshot/assertions. The F3 runtime had not yet been exercised by that run, so no conclusion about its browser behavior can be drawn from #3566.
- The complete F3 route is moved before the storage snapshot. No assertion is removed or weakened; the five-store assertion now checks after the F3 episode has actually run. Re-run Full Regression on the exact correction commit before proceeding.


### Regression investigation — F3 feedback assertion wording — 2026-11-12

- Full Regression #3567 / run 43231737163: RED on exact commit `62bfcb135a4e77c37b4b25e89bb727e882e0f521`. Curriculum engine, architecture, Node and Vitest passed. The browser route now reached F3 and successfully passed the earlier denominator retry and alternate common-denominator (20) steps. It stopped at the first equivalent-numerator retry because the test expected the substring `hoeveelheid gelijk`, while the learner-facing message says `De hoeveelheid moet gelijk blijven`.
- This is a wording mismatch in the assertion, not a calculation or UI runtime defect. The assertion is aligned to the exact existing learner-facing feedback text. No scenario or coverage is removed. Full Regression on the exact correction commit is required.


### Regression closure — F3 subtraction practice — 2026-11-12

- Implementation commit: `a2d66787f702f89dca8eb0b98d93f504fcc49317` added the separate non-formal F3 subtraction session, learner-facing four-step route, local-only store, unit tests and browser scenario.
- Full Regression #3566 / run 43231374670: RED because the browser test checked five local stores before running the F3 scenario. The scenario was moved before the storage snapshot without removing assertions.
- Full Regression #3567 / run 43231737163: RED because the browser test expected `hoeveelheid gelijk`, while the actual F3 feedback says `De hoeveelheid moet gelijk blijven`. The assertion was corrected to the exact learner-facing wording.
- Full Regression #3568 / run 43232097780: **GREEN** on exact commit `40eb0fe0ab45dcf82298bc106587ea89793fbdf4`. All 20 workflow steps passed, including curriculum engine, architecture, Node, Vitest, browser regression and clean working tree. The browser flow exercised F3's incorrect denominator retry, alternate denominator 20, numerator retries, subtraction retry and final result 2/20.
- This documentation closure must itself pass Full Regression on its exact resulting commit.

### Next concrete step

Review the complete learner-facing fraction route in PacoGO TEST before Zyon uses it: recognition practice, learner-created equivalent fractions, staged addition, the 15/10 mixed-number/simplification example, and staged subtraction. Check whether the prompts, visual models, field placement, feedback and navigation make pedagogical sense to the learner. Automated browser regression proves technical flow only, not learning effectiveness. Record observations before changing the instructional design. Keep F4 conditional and do not build it until the F3 prerequisites and source-backed method provenance are reviewed. The FR1 formal development/claim/evidence/task contract gap remains open; do not invent IDs to close it.


### Regression closure — F3 browser route and handoff — 2026-11-12

- Full Regression #3568 / run 43232097780 was GREEN on exact F3 implementation/test commit `40eb0fe0ab45dcf82298bc106587ea89793fbdf4`.
- Handoff/inventory closure commit: `cc2ea4093d548f00a5ef73dbb7c6c7fcd352610e`.
- Full Regression #3569 / run 43232481482: **GREEN** on exact closure commit `cc2ea4093d548f00a5ef73dbb7c6c7fcd352610e`. All 20 steps passed, including browser regression and clean working tree.
- Current verified branch HEAD is the closure commit above; LIVE `main` remains untouched.

### Fraction practice route now implemented

1. Existing visual recognition practice (three FR2-aligned demo practice items; non-formal local progress).
2. Learner-created equivalent-fraction practice (three items; raw learner numerator entries local-only).
3. Staged addition practice F2: `1/3 + 1/4`, four learner-entered steps, inline expression fields, accepts any valid common denominator.
4. Optional mixed-number/simplification practice using the user-provided example `15/10`: learner enters `1 5/10`, explicitly chooses **Vereenvoudigen**, then enters `1/2`.
5. Staged subtraction practice F3: `1/2 − 2/5`, four learner-entered steps, inline expression fields, accepts any valid common denominator. The test uses 20 and displays the result as `2/20`; no automatic simplification.

All newly added construction/addition/result-form/subtraction episodes are non-formal practice, separately learner-keyed and local-only. No formal FR1/FR2 registry/task/evidence changes, diagnostic F1–F4 changes, C1–C9 changes, mastery/next-action/learner-state writes or Supabase changes were made. Technical regression is not empirical or pedagogical validation.

Next: review the entire learner-facing route in PacoGO TEST with Zyon before use. Record where instructions, models, expression inputs, feedback or transitions are unclear. Do not build F4 yet; it is conditional on all four F3 diagnostic prerequisites and its method provenance needs review. The FR1 formal development/claim/evidence/task contract remains an explicit gap; do not invent IDs.
