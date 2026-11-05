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
