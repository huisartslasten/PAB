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
