# PacoGO — Fraction Curriculum Traceability Inventory v0.1

**Status:** source consolidation and implementation inventory; not a new curriculum proposal  
**Date:** 2026-11-12  
**Branch:** \`refactor/professional-v1\`  
**Pre-change HEAD:** \`8d328dcfd2e67a93709696091974c2e84a9a42da\`  
**Pre-change Full Regression:** #3539 / run \`43215088121\`, GREEN on the exact commit

## 1. Purpose and governing order

The product order is:

- **B — Complete existing vertical fractions curriculum:** bring the already developed fraction curriculum into one traceable structure.
- **C — Executable fractions learning route:** connect the existing curriculum to tasks, instruction, Learning Interfaces, interaction, storage and the permitted curriculum-engine stages.
- Only after B and C are completed should the same work expand to other mathematics domains.

This document is deliberately limited to fractions. It does not inventory all 32 mathematics skills, redesign the SLO mapping, create replacement skills, or invent missing curriculum fields.

The uploaded 607-line handoff and the repository handoff are complementary:
- the uploaded handoff defines the immediate product scope and B → C order;
- \`docs/curriculum/PacoGO_Curriculum_Handoff_Current.md\` remains the technical source of truth for repository branch, commits, gates and regression.

## 2. Sources inspected

Repository sources inspected on \`refactor/professional-v1\`:
- \`PacoGO_Curriculum_Rekenen_SLO_10-18_Mapping.md\`
- \`PacoGO_Curriculum_B10_Complete_Model.md\`
- \`PacoGO_Curriculum_Registry_v0.6.json\`
- \`PacoGO_Curriculum_MachineReadable_v0.1.json\`
- \`PacoGO_Multi_Target_Implementation_Readiness_Matrix_v0.1.md\`
- \`PacoGO_Curriculum_Verticaal_Prototype_FR2.md\`
- \`PacoGO_FR2_Task_Evidence_Alignment_Audit_v0.1.md\`
- \`PacoGO_FR2_Task_Evidence_Alignment_Specification_v0.1.md\`
- \`PacoGO_Fraction_Learning_Interface_Design_v0.1.md\`
- \`PacoGO_Zyon_Fraction_Diagnostic_Design_v0.1.md\`
- \`PacoGO_Zyon_Fraction_Diagnostic_Task_Set_v0.1.md\`
- \`PacoGO_Zyon_Fraction_Diagnostic_Assessment_Contract_v0.1.md\`
- \`PacoGO_Adaptive_Instruction_Layer_Architecture_Specification_v0.1.md\`
- \`PacoGO_Instructional_Method_Profile_Selection_Contract_v0.1.md\`
- Current Fraction interface, FR2 demo, practice, diagnostic and learner-curriculum runtime files and their tests.
- Earlier project-conversation context for the pre-existing FR1 working definition and relationships. These conversation details are marked separately below because a matching current FR1 repository contract was not found.

The inventory preserves each source's status. Candidate curriculum is not empirical validation; technical implementation is not proof of learning.

## 3. SLO and B10 fraction position

The existing SLO mapping assigns **KD10B (breuken) to FR1–FR2 plus relationships with A/B**.

The mapping explicitly treats SLO as a curriculum framework, not a one-to-one skill generator. B10 is the integration layer for the existing curriculum architecture, not a request to start a new curriculum study.

The current executable candidate registry v0.6 contains FR2 but no FR1 entry. The absence of an FR1 registry entry must not be “fixed” by expanding FR2.

## 4. Existing FR1 skill definition and source status

FR1 is an existing skill in the prior curriculum work. It is **not** a blank concept to invent.

### 4.1 Source-supported skill definition

The earlier curriculum handoff records the fraction domain as two skills, marked “voorlopig gevalideerd / domein gesloten”:
- **FR1 — Breuken representeren en interpreteren.**
- **FR2 — Breukequivalentie herkennen en gebruiken.**

FR1's core is recorded as interpreting fractions as meaningful quantities/relationships and representing/connecting those meanings. A second prior curriculum summary specifies the meaning as quantity, part–whole, ratio and position, and explicitly says FR1 is not primarily a skill for fraction calculations.

The prior Skillmodel handoff calls FR1 a **voorlopige skill**. Another curriculum handoff says FR1 and FR2 were worked out at the skill/domain level. These are curriculum-skill decisions; they do not by themselves prove that a complete FR1 developmental/evidence contract exists.

### 4.2 Source-supported cross-skill relationships

The prior 32-skill curriculum network and prerequisite matrix record:
- `A1 → FR1 = S` (strong supporting/prerequisite relationship);
- `A2/A6 → FR1 = O` (supporting);
- `FR1 → FR2 = E/S` (essential/strong candidate relationship);
- `FR1 → VR1 = S`;
- `FR2 → VR1/VR2 = O/S`.

The same sources state that prerequisites are supporting hypotheses until empirically shown to be necessary. Preserve the source labels, but do not turn them into hard runtime gates. The curriculum is a network; curriculum, instructional, task and empirical developmental order are not automatically identical.

### 4.3 Explicit skill-boundary decisions

The prior skill/domain handoff explicitly says:
- no separate skill for fraction comparison;
- no separate skill for fraction ordering;
- no separate skill for fraction positioning;
- no separate skill for simplification;
- no separate skill for common denominator;
- no broad “fraction operations” skill.

These are handled through FR1/FR2 together with relevant general skills such as A2/A3/A6 and B1–B4, depending on the primary learning objective. Do not create FR3 or split these items into new skills.

### 4.4 What the existing sources do not specify

The source files inspected contain the FR1 skill name, core meaning, status and cross-skill relationships. They do **not** provide a source-verifiable formal FR1 set of:
- named `FR1.D*` developments;
- `FR1.C*` developmental claims;
- `FR1.ET*` evidence targets;
- `FR1.TM*` task models;
- FR1-specific task catalogue and executable registry binding.

The phrase “FR1 and FR2 worked out” in a prior handoff is not enough to infer these missing formal fields. The B10 source inspected lists FR1 and the wider skill network, but its detailed development/claim/evidence/task sections do not add a formal FR1 contract. Registry v0.6 likewise has no FR1 entry.

A prior conversation summary described a more detailed possible FR1 development outline, but no matching source artifact was recovered in the existing handoffs searched. Do not promote that summary into formal developments or create IDs from it. Recover the original FR1 Skill Development Pass / Development Evidence File if it exists; otherwise record the exact missing contract fields for owner disposition.

### 4.5 Source provenance

The FR1 facts above are supported by these prior project artifacts:
- `PacoGO_Curriculum_Overdracht_01-11-2026(1).txt`, §6.C (FR1/FR2 skill definitions, domain status and explicit skill-boundary decisions).
- `PacoGO_CURRICULUM_OVERDRACHT_01-11-2026-2(1).txt`, §6 (FR1 core) and §§7–8 (network and prerequisite matrix).
- `PacoGO_Curriculum_Overdracht_Skillmodel_v0.1(1).txt`, §11 (FR1 provisional status; FR2 as framework test; no separate comparison/ordering/positioning or broad operations skill).
- `PacoGO_Curriculum_Overdracht_Volgende_Chat(1).txt`, §6 (FR1 and FR2 recorded as the completed fraction skill family at the skill level).
- `PacoGO_Curriculum_Overdracht_B10(1).txt`, §4 (FR1/FR2 included in the 32-skill model).

The current repository SLO mapping and B10 model remain the branch source of truth for technical integration. The older handoffs above recover prior curriculum decisions; they do not authorize a new registry or runtime change by themselves.

## 5. Existing FR2 curriculum contract

Registry v0.6.0-candidate defines:

**FR2 — Breukequivalentie herkennen en gebruiken**

- **FR2.D1 — Equivalentie herkennen**
- **FR2.D2 — Equivalentie verklaren**
- **FR2.D3 — Equivalentie functioneel gebruiken**

Existing claims:
- **FR2.C1:** the learner can recognise equivalence between two fractions.
- **FR2.C2:** the learner can meaningfully substantiate equivalence.
- **FR2.C3:** the learner can use equivalence as a tool for another purpose.

Existing evidence targets:
- **FR2.ET1:** correct recognition of equivalent and non-equivalent pairs.
- **FR2.ET2:** distinguish equivalence from superficial similarity.
- **FR2.ET3:** representation/reasoning evidence that the same value is meant.
- **FR2.ET4:** equivalence remains correct under changed representation.
- **FR2.ET5:** functional use of equivalence without an explicit prompt.
- **FR2.ET6:** contradictory evidence where the outcome is correct but the reasoning is incorrect.

Existing task models:
- **FR2.TM1:** ET1.
- **FR2.TM2:** ET3 + ET4.
- **FR2.TM3:** ET3.
- **FR2.TM4:** ET5.
- **FR2.TM5:** ET2 + ET6.

The registry's FR2 developments, claims, evidence targets, task models and prototype mastery parameters remain candidate constructs. Do not modify or promote them through this inventory.

## 6. Existing FR2 task/evidence implementation findings

The candidate pilot task set contains **five FR2 task definitions (T01–T05)**, but the current branch tree contains only **two dedicated FR2 HTML demo pages**:
- `curriculum-fr2-fraction-equivalence.html` implements FR2-T01.
- `curriculum-fr2-fractions.html` implements FR2-T02.
- FR2-T03 appears in a controller unit-test fixture, not as a current learner-facing HTML route.
- FR2-T04 and FR2-T05 exist in the candidate task set and alignment documents, but no corresponding current HTML pages or browser tests were found in the branch tree.

The readiness matrix and earlier historical handoffs list five separate FR2 HTML pages. That historical inventory does not match the current branch tree; use the exact current tree above and do not assume T03–T05 pages still exist.

The FR2 task/evidence audit identifies these unresolved alignments:
- **T01/T02:** mapped to recognition ET1. The explanation field/task wording does not itself establish that ET3 reasoning was elicited or assessed.
- **T03/T05:** task instances currently identify ET3, while registry TM2 covers ET3 + ET4. The changed-representation contrast required for ET4 is not established merely by rendering different forms.
- **T04:** currently mapped as TM1/ET1 despite being described as a surface-familiarity countertask. The intended TM5 / ET2 + ET6 opportunity is not implemented by a changed visual surface alone.
- **ET5 / TM4:** no T06 or later functional-use task exists in the current task set; T01–T05 do not establish functional use of equivalence for another purpose without an explicit cue.

The pilot task set is explicitly `candidate` / `design_only`, and its tasks are test fixtures, not validated curriculum measures. T01/T02 are synthetic technical demonstrations. T03 is a unit-test fixture. T04/T05 remain design/task-set definitions without current learner-facing pages. None is pilot-ready coded evidence or empirical validation. Do not silently change the registry or task mappings to make the pages appear aligned.

## 7. Existing Learning Interface and learner-facing fraction work

### 7.1 Fraction Learning Interface

The reusable Fraction Learning Interface exists:
- \`fraction-learning-interface-contract.js\`
- \`fraction-learning-interface-renderers.js\`
- \`fraction-learning-interface.js\`
- \`fraction-interface-controller-bridge.js\`
- \`fraction-learning-interface.css\`

It separates pedagogical/function configuration, interaction/controller state and visual rendering. Existing renderings include symbolic fractions and area models. It is a reusable instrument, not an FR2-only lesson or a curriculum decision-maker.

### 7.2 FR2 practice route

The learner-facing FR2 practice page currently contains **three fixed equivalent-fraction items**. It uses the Fraction interface and learner-keyed browser-local progress. It is a short practice slice, not the full fraction curriculum. It is not yet adaptively routed from diagnostic classifications and does not create formal evidence or mastery.

### 7.3 Fraction diagnostic v2

The staged diagnostic is integrated into the learner-facing route:
- F1: equivalent-fraction action.
- F2: addition with unlike denominators.
- F3: subtraction with unlike denominators.
- F4: conditional mixed-number subtraction, only after the specified F3 prerequisite actions are valid.

The learner sees one action at a time, enters the steps personally, and sees no correctness feedback during the diagnostic. Raw responses and classifications remain in the separate local v2 namespace. Legacy v1 data is untouched. The diagnostic is formative only: no formal evidence, assessment, inference, mastery, next-action, learner-state or Supabase writes.

F1–F4 are diagnostic probes, not new FR2 task models or registered skills. Addition, subtraction and mixed-number work must not be represented as FR2 merely because the diagnostic samples them.

Simplification is not part of F1–F4. It remains a separate learner-controlled practice step where the existing curriculum/task scope requires it; PacoGO must not simplify or fill an answer automatically.

### 7.4 Exact current interaction and routing gaps

- The diagnostic result view shows completion/stopped status and the learner's submitted action history only. It does not interpret classifications into an instructional recommendation and has no direct “start practice” route.
- The practice page links **to** the diagnostic, but the diagnostic does not link back to practice. The practice page is a standalone HTML page and is not registered in the central `src/app/routes.js`; the central route registry registers the diagnostic page only.
- The practice page's link to the diagnostic does not pass the selected learner context. The diagnostic expects the selected PacoGO roster learner in its view context and resolves that learner through the explicit profile link. The two routes therefore do not yet form one continuous learner flow.
- Practice stores only completed task IDs, attempt counts and a total correct-answer count. It does not store the selected option, explanation or raw interaction sequence, so it cannot yet support response-level adaptive interpretation.
- The diagnostic stores raw numeric actions, classifications and dependency action IDs locally. It is not formal evidence.
- The diagnostic task-set specification says to stop and move to targeted teaching if the learner is struggling substantially in F1 or the common-denominator actions. The v2 engine implements the conditional F4 gate and an explicit manual stop, but no defined early-struggle threshold or automatic early-stop branch. The threshold is not specified; do not invent one.
- The generic pure `evaluateEquivalentFraction` exists and has unit tests, but the current v2 session's fixed F1 classifier uses hard-coded values for its single `2/3 → ?/6` item rather than calling that evaluator. Keep this limitation visible before generalising F1 to task variants.
- The pure assessment tests include alternate common denominators (e.g. 24 and 36); the browser flow currently demonstrates 12 for F2 and 10 for F3. Browser-level alternate-denominator integration is not established by that browser test.

### 7.5 Fraction input and representation capability

The reusable Fraction Learning Interface currently supports:
- a proper-fraction target and answer options;
- symbolic-fraction or area-model rendering (bar/grid);
- multiple-choice option selection;
- an optional free-text explanation field.

Its contract rejects fractions whose numerator exceeds the denominator. It does not currently provide mixed-number/improper-fraction rendering, a number-line mode, or a small numeric answer field for staged arithmetic. The F1–F4 diagnostic builds its own inline numeric input in the diagnostic runtime; that input is not a reusable Fraction interface component. The repository search found a separate clock analog input, but no reusable fraction numeric-step input component.

Consequently, the current Fraction interface is useful for FR2 equivalence but is not yet a complete interface for the full FR1–FR2 fraction meaning/operation space. Mixed-number work in F4 is rendered by the diagnostic's custom expression renderer, not by the reusable Fraction interface.

## 8. Adaptive instruction and school-method provenance

The Adaptive Instruction Layer architecture specification exists as a design artifact. The Instructional Method Profile Selection Contract remains a proposal, not an approved runtime implementation.

The supplied classroom board photographs show examples of:
- product-denominator common-denominator construction;
- scaling the numerators;
- converting mixed numbers to improper fractions before operations.

These images establish what was demonstrated in the photographed lesson. They do not prove that the method is exclusive or universally required. Keep mathematical validity separate from school-method alignment. A valid alternative method must not be marked mathematically wrong where the task contract permits it.

No method selector or complete adaptive instruction runtime is established by the existence of these design documents.

## 9. Runtime, persistence and engine boundary

- The two current FR2 demo HTML pages load registry `0.2.0-seed` and pilot task set v0.1, and use the synthetic learner key `browser-synthetic-fr2`. They are not connected to the persisted B1–B5 learner-curriculum service.
- The demo controller emits synthetic shortcuts such as quality/relevance/independence/contradiction fields. The FR2 Task–Evidence specification explicitly says these are not approved C3 evidence assessments and must not be used as empirical evidence.
- The three-item practice route uses browser-local learner-keyed progress only; it does not preserve raw selected options or explanation text.
- Diagnostic v2 uses its separate browser-local formative session store only; it preserves raw numeric answers, classifications and dependency references.
- The diagnostic is centrally registered in `src/app/routes.js`; the three-item practice page is a standalone HTML page outside that route registry.
- The FR2 demos, practice route and diagnostic are not a complete integrated C1–C9 learner decision runtime. The active learner route does not consume the separate C6/C7 modules or C8/C9 adapters as a canonical branch-specific runtime.
- No Supabase schema, RPC, RLS or learner-data change is indicated by this inventory.

Keep formal engine stages inactive where the current task/evidence contracts do not support them. Do not bypass the engine or force formal evidence/mastery into the formative practice slice.



## 10. Three-level fraction traceability matrix

| Curriculum element | Task / technical implementation | Learner-facing route and current gap |
|---|---|---|
| FR1 — represent and interpret fractions | Skill-level definition and network links exist in prior curriculum handoffs; no formal FR1.D/C/ET/TM contract or registry entry was found. | No FR1 learner task or route. The Fraction interface exists but is not bound to FR1. |
| FR2.D1 — recognise equivalence | Registry D1/C1/ET1/TM1. Candidate tasks T01/T02; only T01 and T02 have current HTML demo pages. | Demo only, synthetic learner; separate three-item practice page is not connected to the formal registry and is local-only. |
| FR2.D2 — explain equivalence | Registry D2/C2; TM2 requires ET3 + ET4. T03/T05 definitions exist, but current task instances name ET3 only; T03 appears in a unit fixture, T05 has no current page. | No complete learner-facing cross-representation/transfer route. |
| FR2.D2 — counterevidence / surface discrimination | TM5 requires ET2 + ET6. T04 is described as a countertask but is mapped to TM1/ET1. | No current T04 page or browser test; task/evidence contract unresolved. |
| FR2.D3 — functional use | TM4 requires ET5. No T06 or later task in the current pilot task set. | No functional-use practice route beyond the fixed equivalence recognition items. |
| Zyon diagnostic F1 | One fixed equivalent-fraction item; formative probe, not a registered task model. | One inline numeric input per action; local-only; no FR1 meaning/number-line diagnosis. |
| Zyon diagnostic F2/F3 | Unlike-denominator addition/subtraction probes; not FR2 task models. | One learner-entered numeric action at a time; local-only; no instructional recommendation after completion. |
| Zyon diagnostic F4 | Conditional mixed-number subtraction probe; not a registered FR1/FR2 task model. | Uses a custom expression/input renderer; not the reusable Fraction interface. |
| Fraction practice 01–03 | Three fixed equivalent-fraction multiple-choice tasks; no raw option/explanation record. | Learner-keyed local progress; no adaptive route, no staged arithmetic inputs, and no direct path from diagnostic result. |
| Fraction Learning Interface | Proper fractions; symbolic and area-model; option selection; optional explanation text. | Does not yet cover improper/mixed numbers or reusable numeric step entry. |

## 11. What the complete vertical fraction overview must still consolidate

The next consolidation must bring the existing sources together, not create replacements:

1. FR1 working definition, its exact original source/decision, and any already-defined developments/claims/evidence/task models.
2. FR2 D1–D3, C1–C3, ET1–ET6 and TM1–TM5 exactly as registered.
3. Explicitly documented relationships with A/B and any relevant VR skills, with their source status and without inventing strict prerequisites.
4. The existing FR2 task catalogues, task/evidence alignment findings and the distinction between formal task models and formative F1–F4 diagnostic probes.
5. The Fraction Learning Interface and existing task coverage.
6. The status of each vertical-chain stage in the current learner-facing route: curriculum binding, task, learner performance, evidence, evidence assessment, inference, mastery, next action, learner state and validation.
7. Exact gaps between the existing curriculum definition and what Zyon can actually do in PacoGO TEST.

Do not continue broad inventory work across A/B/VR/MG/GK/PA/MGK. Their wider architecture remains context only; fractions are the active product.

## 12. Next concrete work toward executable route C

After the source consolidation in §10:

1. Inspect the current learner-facing diagnostic completion and navigation flow.
2. Determine what raw diagnostic patterns can safely inform a tentative instructional need under the existing formative contract; do not turn one response into a permanent learner trait.
3. Connect the first supported fraction practice episode to the existing Fraction interface.
4. Keep the mathematical objective within the existing curriculum boundary. Where fraction operations lack a formal FR1/FR2 task/evidence mapping, keep the practice explicitly formative/non-formal until the correct source contract is recovered and any necessary owner decision is recorded.
5. Present explanations and visual models, then let the learner perform each required step. No prefilled intermediate answers.
6. Keep practice, tussentoets and toets as distinct contexts; help may explain during practice but must not complete the learner's work. Tussentoets and toets do not offer help.
7. Preserve learner-local/formative state unless an actual approved persistence/runtime contract requires a change. No Supabase change by default.
8. Verify the full learner flow in PacoGO TEST with a real parent session and test learner before use with Zyon. Browser fixtures are not learner validation.
9. Run Full Regression on the exact implementation commit and update/verify the repository handoff.

## 13. Verification baseline

- Branch: \`refactor/professional-v1\`.
- Pre-change HEAD: \`8d328dcfd2e67a93709696091974c2e84a9a42da\`.
- Full Regression #3539 / run \`43215088121\`: GREEN on that exact commit.
- This fraction-specific inventory and its handoff update are documentation changes. Their resulting commit requires a new Full Regression before being considered verified.
- No runtime, tests, curriculum registry, C1–C9 contract, learner state, database, SQL/RPC/RLS, Supabase or learner data changed in this inventory.


---

## 14. Update 2026-11-12 — diagnostic-to-practice navigation slice

This section supersedes the earlier statement that the diagnostic and practice routes have no direct navigation between them.

### Implemented and browser-verified

- Completed formative diagnostic → neutral continuation action → existing FR2 equivalent-fraction practice page.
- The continuation action is shown only after a completed (not manually stopped) diagnostic.
- The destination is labelled **“Verder naar gelijkwaardige breuken oefenen”** so it does not imply that the narrow FR2 episode covers the entire fraction domain.
- The selected roster learner is preserved using `viewStudent`; the practice page resolves the linked curriculum profile via the existing student registry and learner-curriculum service.
- Practice → diagnostic navigation preserves the same roster learner.
- Browser coverage verifies the complete round trip and confirms that the same learner is selected when the diagnostic is reopened.

### Scope and limitations

- This is a navigation connection only. It does not interpret diagnostic patterns, select an adaptive next task, or claim the practice is targeted to the diagnostic result.
- The existing three-item FR2 practice content, local progress format, diagnostic response storage and formal/formative boundaries remain unchanged.
- No new curriculum/task/evidence/mastery contract, learner-state persistence, Supabase or database change was made.
- FR1's formal development/claim/evidence/task structure remains unresolved in the source inventory.
- The complete fraction route C is **not complete**. Zyon still needs a learner-facing practice flow that presents suitable visual explanations and requires him to enter the necessary intermediate fraction steps himself, within source-supported and explicitly formative boundaries.

### Verification

- Route implementation commit: `d246a4c3eaebd8174e0c3940d8552475be262939`.
- Full Regression #3547 / run `43217736298`: **GREEN** on that exact commit.
- Full Regression #3546 was RED on an intermediate UI-label-only commit because the browser assertion still expected the previous label; the assertion was corrected to the intentional, more precise label and #3547 passed.
- This inventory update and the repository handoff update are documentation changes and must be verified by Full Regression on their resulting exact commit.



---

## 15. Update 2026-11-12 — learner-entered equivalent-fraction construction practice

### Implemented as optional formative practice

The existing three-item recognition practice remains unchanged. After completing it, the learner can choose a separate construction episode:
- three examples reuse existing practice values: 1/2 → denominator 4, 1/3 → denominator 6, and 2/3 → denominator 6;
- the learner sees the target area model and a symbolic expression with the denominator supplied and numerator blank;
- the learner enters the numerator; PacoGO does not fill it in;
- a generic mathematical equivalence check compares the two fraction values;
- incorrect responses can be retried; progression occurs only after a correct response;
- raw entered numerators and classifications are kept in a separate versioned learner-keyed local store.

### Boundaries

- These are local formative practice identifiers, not FR2 registry task IDs and not formal evidence tasks.
- They do not change the FR2 task set, registry, C1–C9, mastery, next-action, learner state or formal evidence.
- They are not adaptively routed from diagnostic results.
- The explanation is method-neutral and does not claim school-method alignment. The Adaptive Instruction Layer remains a proposal, not runtime.
- This slice asks for one numerator action with a supplied denominator. It does not yet cover learner-selected common denominators, multi-step addition/subtraction, mixed numbers or the full fraction curriculum.
- No Supabase or database change was made. The existing recognition progress store is unchanged.

### Files and tests

- `pacogo-engine/fraction-numerator-input.js`
- `pacogo-engine/fraction-construction-practice-session.js`
- `pacogo-engine/fraction-construction-practice-session.test.js`
- updated `curriculum-fr2-practice-learner.html`
- updated `test/browser/curriculum-fr2-practice-learner.browser.test.js`

### Verification status

Full Regression #3550 was RED on intermediate feature commit `4908257e7e428e1cea47a0167b0fa44ac3e3b1f3` because the numeric parser pattern was over-escaped. The parser defect was corrected in `216e5b4c08b0e20c9ff59271d0a773d8d567982c`. This documentation commit is the next Full Regression target; its actual outcome must be read from the run for the exact resulting commit. Do not mark the feature green before that verification.




### Regression closure — 2026-11-12

- Full Regression #3550 was RED because the new raw-numerator parser's digit pattern was over-escaped; implementation fixed in `216e5b4c08b0e20c9ff59271d0a773d8d567982c`.
- Full Regression #3551 and #3552 were RED because the browser test asserted that construction-practice storage existed without first executing the construction-practice flow.
- The browser test now runs the complete construction episode, including incorrect response/retry, correct responses, progression, completion and learner-local raw-response storage.
- Full Regression #3553 / run `43219737675`: **GREEN** on exact commit `aa2e79a53aab4f624bf13732b445d0a8b681f9db`, all 20 workflow steps passed.
- The current documentation closure is a follow-up project change and must be verified by Full Regression on its exact resulting commit.



---

## 16. Update 2026-11-12 — staged formative fraction addition practice

A separate optional practice episode now implements the existing F2 step sequence for 1/3 + 1/4 as non-formal practice:
1. learner selects a common denominator;
2. learner enters the equivalent numerator for 1/3;
3. learner enters the equivalent numerator for 1/4;
4. learner enters the sum of those numerators.

Two original area models remain visible. Only the active action is shown; no future input or intermediate answer is prefilled. Any valid common denominator is accepted. Incorrect responses can be retried without advancing. The final fraction uses the learner's chosen denominator and is not automatically simplified.

The episode stores raw step responses and classifications in a separate learner-keyed local store. It is not a diagnostic replay or formal task/evidence measure. It does not alter FR2 scope, FR1 contracts, C1–C9, mastery, learner state or Supabase. Method alignment is not claimed.

Full Regression #3556 / run `43220904553`: **GREEN** on exact code/test commit `287d327daa81928c1bbc9500ad0c5231b60ada51`; all 20 steps passed. The documentation closure requires its own Full Regression on the exact resulting commit.


---

## 17. Update 2026-11-12 — inline arithmetic expression and learner-controlled result forms

A user-approved interface requirement now clarifies the next fraction-practice design:

- The equation itself is the work surface. Missing numeric values must be entered directly inside the mathematical expression, not solely in a separate answer panel.
- For an improper result such as 15/10, the learner may select a mixed-number option. The UI then reveals learner-editable whole-number, numerator and denominator positions (example: 1 5/10).
- A separate learner-triggered **Vereenvoudigen** action reveals another equation for the fractional part (example: 1 5/10 = 1 [numerator]/[denominator]). The learner enters the simplified fraction (example: 1/2). PacoGO validates the learner's entry but does not prefill, calculate or silently simplify it.
- Preserve raw responses and keep each stage explicit. This is non-formal practice behavior, not a new skill, task/evidence mapping or mastery rule.

Read-only implementation findings:
- The formative diagnostic runtime already implements an inline expression renderer with one active input embedded at the missing position. This behavior belongs to the diagnostic route and does not itself satisfy the practice-page requirement.
- The current F2 practice page still places its input in a separate host below the expression.
- The reusable FR2 Fraction Learning Interface only accepts proper fractions and supports recognition/representation tasks, not arithmetic entry or mixed/improper fraction rendering. Keep those contracts separate.
- Existing F2 practice result 7/12 does not trigger mixed-number or simplification paths. 15/10 is the user's example for the desired generic interaction, not a change to the diagnostic task set.

Revised order: (1) reusable inline arithmetic-expression input for non-formal practice; (2) refactor F2 practice to use it; (3) add optional learner-controlled mixed-number and simplification stages; (4) reuse the same capability in the F3 subtraction practice based on the existing 1/2 − 2/5 task-set episode. No diagnostic, formal curriculum, C1–C9, mastery, learner-state or Supabase contract changes are authorized by this UI requirement.

Baseline Full Regression #3558 / run 43221213403 was GREEN on e771796b1929c787b99b79d87a1db6e08c97dfe9. This documentation update must pass Full Regression on its exact resulting commit.


## 18. Update 2026-11-12 — F2 practice inline expression input

The non-formal F2 addition practice now renders its active numeric input directly inside the mathematical expression, reusing the same interaction principle already present in the diagnostic runtime. The separate input host now contains only the submit action. The common-denominator step explicitly shows an inline missing-value slot after the original operation; equivalent-numerator and result steps retain their missing slot inside fraction notation or the arithmetic expression. The reusable renderer supports multiple input slots, accessible labels, keyboard focus and locking.

The F2 step order, valid-denominator logic, raw-response storage, learner isolation and local-only boundary are unchanged. Browser regression now checks that the input is a descendant of the expression itself. Mixed-number and simplification controls are not yet built; they remain the next increment. This is still non-formal practice and does not alter FR1/FR2 curriculum scope or formal evidence.


### Regression note — F2 inline expression input

Full Regression #3560 / run 43226149457 was RED on commit 2da5177fe445a5197b94cab1981211f15ab07449. All non-browser checks passed. The browser failure was a stale second-step assertion that still expected the integer input inside #additionInput. The new UI intentionally places it inside #additionExpression. The assertion is corrected to verify the new location and the absence of an input in the old host; no assertion coverage is removed. Await Full Regression on the exact correction commit.


### Regression note — stale focus reference in inline F2 entry

Full Regression #3561 / run 43226477223 was RED on 921efb10cd078cb0fda5047e9d5f9016b33a9f73. Browser regression found a real implementation defect: a remaining error-retry path attempted to focus the removed separate input instance. The stale reference/declaration is removed and focus is directed to the inline equation field. Existing incorrect-answer retry coverage and zero-browser-error assertion remain intact. Await exact-commit Full Regression.


### Regression closure — F2 inline expression input — 2026-11-12

The F2 practice input now appears inside the equation through the new reusable arithmetic-expression renderer. The previous separate answer host contains only the submit action. Raw F2 session responses, step ordering, mathematical checks, local-only storage and learner isolation remain unchanged.

Regression history: #3560 RED due to a stale old-location browser assertion; #3561 RED due to a stale focus reference in an invalid-response path; both were corrected without weakening coverage. Full Regression #3562 / run 43226779723: **GREEN** on exact commit `774bfeae618c301cd33c2d83c4b24d4ed3a57b82`; all 20 steps passed, including browser regression and clean working tree. This documentation closure requires its own exact-commit Full Regression.

Next: build the optional learner-controlled mixed-number and simplification result stages; then reuse the inline equation input for F3 subtraction practice. No formal curriculum, diagnostic, mastery or Supabase changes.


## 19. Update 2026-11-12 — learner-entered mixed-number and simplification practice

An optional non-formal result-form practice episode is now added after the existing F2 addition practice, using the user-provided example 15/10. Stage 1 presents `15/10 = ? ?/?` with three learner-entered inline fields for whole number, numerator and denominator. After validation, the learner explicitly chooses **Vereenvoudigen**. Stage 2 presents `1 5/10 = 1 ?/?` with two learner-entered inline fields. PacoGO validates equivalence and requires lowest terms; it does not prefill or calculate the learner's values.

The activity has its own learner-keyed versioned local-only store, preserving raw inputs and classifications, including incorrect attempts. Unit and browser coverage test invalid decomposition, retry, non-simplest equivalent fraction, successful 1/2, learner isolation and no formal evidence writes. This is a non-formal practice example, not a new formal skill/task/evidence mapping. It does not change the diagnostic F1–F4 task set, the F2 1/3 + 1/4 practice task, C1–C9, mastery, next-action, learner-state or Supabase contracts.

Next: exact-commit Full Regression; then build the separate F3 subtraction practice using the shared inline equation entry.


### Regression closure — mixed-number and simplification practice — 2026-11-12

Implementation commit `892d7176fcbe17f9d66ca3d4af4dae6766f99ece` added the optional non-formal 15/10 episode with learner-entered mixed-number conversion and explicit simplification. Full Regression #3564 / run 43230489974: **GREEN** on that exact commit; all 20 workflow steps passed, including browser regression and clean working tree. This example is not a formal task/evidence mapping and does not alter diagnostic F1–F4, F2 addition, curriculum contracts or persistence boundaries. This documentation closure requires exact-commit regression.

Next: build separate F3 subtraction practice from the existing 1/2 − 2/5 diagnostic episode using the shared inline renderer, raw learner entries and local-only learner-keyed storage. Keep formal diagnostic and curriculum contracts unchanged.


## 20. Update 2026-11-12 — separate F3 subtraction practice

Added optional non-formal practice based on the existing diagnostic F3 episode `1/2 − 2/5`. It follows the source-defined four actions one at a time: choose a common denominator, enter the equivalent numerator for 1/2, enter the equivalent numerator for 2/5, then subtract the learner-entered numerators. Each active response appears inline in the mathematical expression; later actions are not prefilled or shown.

Any positive common multiple of 2 and 5 is accepted. Browser coverage uses 20 to prove that the learner is not restricted to the least common denominator, then checks the 10 − 8 = 2 subtraction. The final result is shown as 2/20 and is not automatically simplified. Invalid responses remain retryable and raw attempts/classifications are stored in a separate learner-keyed local-only store. This does not modify diagnostic F3, formal curriculum/evidence contracts, mastery, learner state or Supabase.

Next: exact-commit Full Regression; then review the complete fraction practice route in PacoGO TEST before Zyon uses it.


### Regression investigation — F3 browser scenario ordering — 2026-11-12

Full Regression #3566 / run 43231374670: RED on `a2d66787f702f89dca8eb0b98d93f504fcc49317`. All non-browser checks passed. Browser test failure was caused by asserting five local storage records before executing the new F3 route. The F3 browser scenario is moved before the local-storage snapshot; no assertion is removed or weakened. The failed run did not exercise the F3 browser route, so re-run exact-commit Full Regression is required before judging the runtime.


### Regression investigation — F3 feedback assertion wording — 2026-11-12

Full Regression #3567 / run 43231737163 was RED on `62bfcb135a4e77c37b4b25e89bb727e882e0f521`. The F3 browser route was exercised through denominator retry and accepted alternate denominator 20. It stopped at an assertion expecting `hoeveelheid gelijk`, whereas the actual feedback says `De hoeveelheid moet gelijk blijven`. The test assertion is aligned to the exact UI wording; no coverage is removed. Await exact-commit Full Regression.


### Regression closure — F3 subtraction practice — 2026-11-12

Implementation commit `a2d66787f702f89dca8eb0b98d93f504fcc49317` added optional non-formal F3 practice. Full Regression #3566 was RED due to test scenario ordering; #3567 was RED due to a mismatch between asserted and actual feedback wording. Both were corrected without removing coverage. Full Regression #3568 / run 43232097780: **GREEN** on exact commit `40eb0fe0ab45dcf82298bc106587ea89793fbdf4`; all 20 steps passed, including the complete browser F3 route and clean working tree.

Next: review the complete fraction practice route in PacoGO TEST with the learner before use. Technical regression is not pedagogical validation. Keep F4 conditional; verify its prerequisites and method provenance before implementation. FR1 formal contract gap remains open and must not be filled with invented registry IDs.


### Final regression closure — F3 and documentation — 2026-11-12

Full Regression #3568 / run 43232097780 was GREEN on F3 implementation/test commit `40eb0fe0ab45dcf82298bc106587ea89793fbdf4`. Handoff/inventory closure commit `cc2ea4093d548f00a5ef73dbb7c6c7fcd352610e` then passed Full Regression #3569 / run 43232481482: **GREEN** on that exact commit, all 20 steps passed. Current branch HEAD at this closure is `cc2ea4093d548f00a5ef73dbb7c6c7fcd352610e`.

The complete non-formal learner route now includes visual recognition, learner-created equivalent fractions, staged F2 addition, the learner-entered 15/10 mixed-number/simplification example, and staged F3 subtraction. All additional practice stores are separate, learner-keyed and local-only. No formal FR1/FR2 curriculum/evidence, diagnostic, C1–C9, mastery, next-action, learner-state or Supabase contracts were changed.

Next: learner-facing review in PacoGO TEST. F4 remains conditional and is not built. FR1 formal contract gap remains open.


### PacoGO TEST deployment readiness — 2026-11-12

The Netlify project `pacogo-test` exists at `https://test.pacogo.org`, but its latest ready deploy `6ad057585d4a377dd54bb132` was published 2026-10-15 from commit `67a39b26a42520fa2e04734798b897563b01c624` on `refactor/professional-v1`. This predates the current fraction practice implementation and must not be treated as the new route's review environment. The current branch HEAD at inspection is `68e6740c6072c1bb18ec426f5b24799825443f55`, Full Regression #3570 GREEN. Connected Netlify actions in this session provide read-only deploy inspection only; no deploy was triggered.

Required before learner review: deploy the current refactor branch through the authorized TEST deployment process, verify exact deployed commit SHA, then inspect the full fraction practice flow. No learner/pedagogical validation has yet occurred.


### Verification closure — TEST deployment readiness note — 2026-11-12

The TEST deployment readiness note is included in commit `bd770c68e58223337cd937adacc7d6341e53a181`; Full Regression #3571 / run 43233460099: **GREEN** on that exact commit. The Netlify TEST alias still points to an older deployment from commit `67a39b26a42520fa2e04734798b897563b01c624` (published 2026-10-15). Current learner route has not been reviewed in TEST. Next: authorized deploy of the current refactor branch, exact-SHA verification, then learner-facing review.


## 12. Current branch verification addendum — BREUKEN 01 (2026-11-13)

This addendum supersedes stale branch-tree and regression snapshots above where they conflict with the verified current branch. Historical findings remain preserved as historical context.

### 12.1 Exact repository and regression snapshot

- Branch: `refactor/professional-v1`.
- Current HEAD at inspection: `a275be231feddd3d8e81455a76e1b71080179e96`.
- Full Regression #3647 / run `43550134483`: **COMPLETED / SUCCESS** on that exact HEAD.
- Workflow: `.github/workflows/full-regression-refactor-v1.yml`.
- The prior handoff's #3646 / `0c40b6daf129ada9f2a5d18273b1b9c50f59b0be` is the preceding verified commit, not the current HEAD.
- LIVE `main` was not changed.

### 12.2 Authoritative SLO source checked

The repository mapping `PacoGO_Curriculum_Rekenen_SLO_10-18_Mapping.md` identifies SLO Kerndoelen primair onderwijs, version July 2026, as its source and maps KD10B (fractions) to FR1–FR2 plus relationships with A/B.

The official SLO July 2026 primary-education kerndoelen publication was independently located. KD10B states that the learner reasons and calculates with fractions as number, ratio and division. Its content includes:
- unit fractions, proper fractions, mixed numbers and improper fractions;
- relationships between fractions, decimals, ratios and percentages;
- relationships between fractions and division;
- reasoned ordering, simplification and comparison;
- fraction calculations in concrete situations, supported by models or number relations.

The SLO illustrative document adds examples such as placing fractions on a number line, fraction language, making common denominators, making wholes from fractions, writing whole numbers as fractions and calculating with named or unnamed fractions. These illustrations must remain distinguished from the formal KD10B wording.

KD10B itself does not supply PacoGO development IDs or a complete grade-by-grade developmental sequence. SLO's end-of-primary reference level and PacoGO's candidate development structure must not be conflated.

### 12.3 FR1 source finding — formal contract not recovered

The current branch tree contains no FR1-specific curriculum contract artifact and registry v0.6.0-candidate contains no FR1 entry.

The existing traceability sources and prior handoff provenance support the existing FR1 skill-level definition:
**FR1 — Breuken representeren en interpreteren.**

Its recorded conceptual scope includes fractions as meaningful quantities and relationships: quantity, part–whole, ratio and position. It is not defined as a primary fraction-calculation skill. Prior curriculum handoffs also record cross-skill relationships and explicit decisions not to create separate skills for comparison, ordering, positioning, simplification, common denominators or broad fraction operations.

However, the inspected current repository sources do not provide a recoverable, formal FR1 set of developments, claims, evidence targets, task models, task catalogue or registry binding. No FR1.D*, FR1.C*, FR1.ET* or FR1.TM* identifiers may be inferred from summaries or invented. The original FR1 Skill Development Pass / Development Evidence File remains the exact source-recovery target. If it cannot be recovered, the owner must decide how to handle the missing formal contract before formal FR1 implementation.

### 12.4 FR2 candidate contract confirmed

Registry v0.6.0-candidate contains FR2 — Breukequivalentie herkennen en gebruiken:
- FR2.D1 Equivalentie herkennen;
- FR2.D2 Equivalentie verklaren;
- FR2.D3 Equivalentie functioneel gebruiken;
- FR2.C1–C3;
- FR2.ET1–ET6;
- FR2.TM1–TM5.

The task/evidence audit and candidate alignment specification remain unresolved design artifacts. In particular:
- T01/T02 recognition ET1 does not make a required explanation proof of ET3 reasoning;
- TM2 covers ET3 + ET4, but an actual contrast/stability observation is required for ET4;
- TM5 covers ET2 + ET6; a changed visual surface alone does not establish that the countertask elicits those targets;
- TM4/ET5 functional use is not covered by the current T01–T05 task set;
- synthetic controller shortcuts for quality, relevance, independence and contradiction are not approved C3 assessment and are not empirical learner evidence.

Do not change registry mappings, C3 rules, mastery rules or persistence to conceal these gaps.

### 12.5 Corrected current branch implementation inventory

The current recursive Git tree at HEAD `a275be231feddd3d8e81455a76e1b71080179e96` confirms the following learner-facing files:
- `curriculum-fr2-fraction-equivalence.html` — FR2-T01;
- `curriculum-fr2-fractions.html` — FR2-T02;
- `curriculum-fr2-representation-transfer.html` — FR2-T03;
- `curriculum-fr2-surface-countertask.html` — FR2-T04;
- `curriculum-fr2-language-reduced-transfer.html` — FR2-T05;
- `curriculum-fr2-practice-learner.html` — short learner-facing practice route;
- `curriculum-fraction-diagnostic-learner.html` — formative diagnostic route.

The branch also contains browser tests:
- `test/browser/curriculum-fr2-fractions.browser.test.js`;
- `test/browser/curriculum-fr2-generalisation.browser.test.js`;
- `test/browser/curriculum-fr2-learning-path.browser.test.js`;
- `test/browser/curriculum-fr2-practice-learner.browser.test.js`;
- `test/browser/curriculum-fraction-diagnostic-learner.browser.test.js`.

This corrects the earlier section 6 statement that only two FR2 HTML demo pages existed. That was true of the older inspected tree but is no longer true at the verified current HEAD. The five task pages are still synthetic technical demonstrations, not validated assessment instruments or proof of a complete vertical curriculum.

The central Fraction Practice Template and shared interface/input components listed in section 7 and in the current handoff remain present. The diagnostic remains formative and local-only under its separate v2 contract; it is not FR1/FR2 formal task coverage.

### 12.6 Phase-01 conclusion and safe build boundary

The source reconstruction establishes:
1. KD10B is the authoritative SLO content anchor for fractions.
2. FR1 exists at skill-definition level in prior curriculum decisions, but its formal development/evidence contract is not recovered in the current repository.
3. FR2 has a complete candidate registry structure, but its task/evidence alignment remains unresolved.
4. The central Fraction Practice Template and reusable Fraction Learning Interface exist and are shared; they should be extended, not duplicated.
5. Five FR2 synthetic task pages, a short practice route and a formative diagnostic route exist; none constitutes the complete vertical fraction learner route to end group 8.

**First concrete action for BREUKEN 02:** construct the source-traceable vertical coverage matrix for KD10B using only recovered FR1/FR2 definitions, their existing cross-skill relations and the exact SLO wording. Mark each KD10B content element as covered, partially covered, cross-skill-dependent or unresolved. Keep the missing FR1 formal contract explicitly blocked; do not manufacture identifiers. Resolve source recovery/owner disposition before formal FR1 task/evidence implementation.

**No curriculum, registry, task, evidence, mastery, runtime, Supabase or learner-data contract was changed in this phase.**
