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

## 4. Existing FR1 working design — recovered, not yet reconciled into the repository

Earlier PacoGO project conversations already established the following FR1 working definition:

- **FR1 — Breuken representeren en interpreteren.**
- Core: understand fractions as meaningful quantities and relationships; interpret, represent and connect fraction meanings across representations and situations.
- Meanings discussed: part–whole, quantity, position on a number line, ratio and division result.
- Previously discussed development outline: part of a whole → fraction as a quantity → represent through images/partitions/number line/notation → interpret numerator and denominator → connect meanings and representations (e.g. 1/2, “half”, a number-line position, 0.5 and 50%).
- Previously discussed complexity dimensions: representation variation and distance, abstraction, coordination of numerator/denominator/whole, and distance between given and requested information.
- Earlier discussions retained FR1 and FR2 and excluded a separate FR3.

**Status distinction:** this is recovered prior project design, not a newly invented skill. The exact FR1 source/decision artifact and a complete formal FR1 development/claim/evidence/task contract were not found in the current repository sources inspected for this inventory. Therefore this recovered outline is not silently promoted to a registry entry or implementation-ready contract.

No \`FR1.D*\`, \`FR1.C*\`, \`FR1.ET*\` or \`FR1.TM*\` identifiers are created here. Recover the original source/decision record and preserve its exact identifiers if they exist. If a formal field is genuinely absent, record that exact gap for owner disposition rather than filling it from general didactics.

Earlier conversations discussed relationships including FR1 supporting FR2 and connecting onward to VR1/VR2, and links with A1/A2/A6/B4, A2/A3/A6 for comparison/ordering/positioning, and B1–B4 for operations. These are retained as traceability leads, not converted here into rigid prerequisite edges. The wider curriculum was described as a network, not one universal linear order. The exact source contract for each cross-skill relation must be recovered before runtime uses it.

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

Five FR2 browser task pages exist as technical demonstrations. The FR2 task/evidence audit identifies these unresolved alignments:

- **T01/T02:** mapped to recognition ET1. The explanation field/task wording does not itself establish that ET3 reasoning was elicited or assessed.
- **T03/T05:** task instances currently identify ET3, while registry TM2 covers ET3 + ET4. The changed-representation contrast required for ET4 is not established merely by rendering different forms.
- **T04:** currently mapped as TM1/ET1 despite being described as a surface-familiarity countertask. The intended TM5 / ET2 + ET6 opportunity is not implemented by a changed visual surface alone.
- **ET5 / TM4:** the T01–T05 set does not establish functional use of equivalence for another purpose without an explicit cue.

The five pages are synthetic technical demonstrations. They are not pilot-ready coded evidence and are not empirical validation. Do not silently change the registry or task mappings to make the pages appear aligned.

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

## 8. Adaptive instruction and school-method provenance

The Adaptive Instruction Layer architecture specification exists as a design artifact. The Instructional Method Profile Selection Contract remains a proposal, not an approved runtime implementation.

The supplied classroom board photographs show examples of:
- product-denominator common-denominator construction;
- scaling the numerators;
- converting mixed numbers to improper fractions before operations.

These images establish what was demonstrated in the photographed lesson. They do not prove that the method is exclusive or universally required. Keep mathematical validity separate from school-method alignment. A valid alternative method must not be marked mathematically wrong where the task contract permits it.

No method selector or complete adaptive instruction runtime is established by the existence of these design documents.

## 9. Runtime, persistence and engine boundary

- FR2 technical demo pages use the earlier registry/pilot-task vertical-slice path and synthetic learner context; they are not the persisted B1–B5 learner-curriculum route.
- The three-item practice route uses browser-local learner-keyed progress only.
- Diagnostic v2 uses its separate browser-local formative session store only.
- The FR2 demos, practice route and diagnostic are not a complete integrated C1–C9 learner decision runtime.
- The current active learner route does not make the separate C6/C7 modules or C8/C9 adapters a canonical integrated branch-specific runtime.
- No Supabase schema, RPC, RLS or learner-data change is indicated by this inventory.

Keep formal engine stages inactive where the current task/evidence contracts do not support them. Do not bypass the engine or force formal evidence/mastery into the formative practice slice.

## 10. What the complete vertical fraction overview must still consolidate

The next consolidation must bring the existing sources together, not create replacements:

1. FR1 working definition, its exact original source/decision, and any already-defined developments/claims/evidence/task models.
2. FR2 D1–D3, C1–C3, ET1–ET6 and TM1–TM5 exactly as registered.
3. Explicitly documented relationships with A/B and any relevant VR skills, with their source status and without inventing strict prerequisites.
4. The existing FR2 task catalogues, task/evidence alignment findings and the distinction between formal task models and formative F1–F4 diagnostic probes.
5. The Fraction Learning Interface and existing task coverage.
6. The status of each vertical-chain stage in the current learner-facing route: curriculum binding, task, learner performance, evidence, evidence assessment, inference, mastery, next action, learner state and validation.
7. Exact gaps between the existing curriculum definition and what Zyon can actually do in PacoGO TEST.

Do not continue broad inventory work across A/B/VR/MG/GK/PA/MGK. Their wider architecture remains context only; fractions are the active product.

## 11. Next concrete work toward executable route C

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

## 12. Verification baseline

- Branch: \`refactor/professional-v1\`.
- Pre-change HEAD: \`8d328dcfd2e67a93709696091974c2e84a9a42da\`.
- Full Regression #3539 / run \`43215088121\`: GREEN on that exact commit.
- This fraction-specific inventory and its handoff update are documentation changes. Their resulting commit requires a new Full Regression before being considered verified.
- No runtime, tests, curriculum registry, C1–C9 contract, learner state, database, SQL/RPC/RLS, Supabase or learner data changed in this inventory.
