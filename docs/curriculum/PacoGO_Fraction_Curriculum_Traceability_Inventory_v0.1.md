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
