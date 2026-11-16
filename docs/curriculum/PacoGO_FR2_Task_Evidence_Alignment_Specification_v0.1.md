# PacoGO FR2 — Task–Evidence Alignment Specification v0.1

Status: candidate design specification / review required / [O]  
Scope: FR2-T01–T05, raw observation contract, C3 coding boundary and task/evidence traceability  
Branch: `refactor/professional-v1`  
Design baseline: `3e9b9158f8042eca678deb7c550b997a0c46f1bf`  
Baseline Full Regression: #2884 / `41770424879` — GREEN  
Related documents:
- `PacoGO_FR2_Task_Evidence_Alignment_Audit_v0.1.md`
- `PacoGO_Curriculum_Registry_v0.2.json`
- `PacoGO_Pilot_TaskSet_v0.1.json`
- `PacoGO_C4_Discriminating_TaskSet_v0.1.json`
- `PacoGO_C3_Evidence_Coding_Specification_v0.1.md`
- `PacoGO_Evidence_Coding_Manual_v0.1.md`
- `PacoGO_Pilot_DataSchema_v0.2.json`
- `PacoGO_Empirical_Observation_Schema_v0.1.json`

## 1. Purpose and decision boundary

This specification defines how FR2 task instances, learner responses, raw observations and C3 evidence assessments must relate before FR2 task mappings or runtime contracts are changed.

It is a design decision proposal, not an implementation authorization. It does not:
- change registry version 0.2.0-seed or any FR2 development, claim, evidence target, task model or mastery rule;
- validate FR2 developmental ordering or establish that FR2 is a valid measure;
- authorize the current synthetic browser pages to collect pilot evidence;
- change the pilot data schema, runtime, database or Supabase;
- automatically score explanations, diagnose misconceptions or promote mastery.

All current FR2 browser pages remain synthetic technical demonstrations until the required task and coding contracts are approved and implemented.

## 2. Governing principles

1. **One learner response is one raw observation.** Do not duplicate the response merely because it may inform more than one evidence target.
2. **Raw observation is not evidence assessment.** Preserve what the learner did and said separately from a coder's interpretation of what it means.
3. **Task association is not target match.** A task's registry links do not prove that its response actually measures every linked target.
4. **Correctness is not evidence quality.** Objective correctness may be captured as performance; C3 quality, independence, target match and contradiction require their own assessment.
5. **An explanation field is not reasoning evidence by itself.** Presence, length or language of text does not establish mathematical meaning.
6. **Contradiction is not ordinary incorrectness.** It is a coded conflict with an otherwise plausible interpretation.
7. **Variation must be observed, not inferred from labels.** A task called transfer, countertask or language-reduced must implement the corresponding contrast.
8. **One observation assessed against multiple targets is still one observation.** Target-specific assessments do not become independent replications.
9. **Missing, ambiguous and not-coded remain distinct.** Never convert missing process or technical failure into learner failure.
10. **Synthetic demonstrations remain separate from empirical learner data.**

## 3. Proposed data boundary

### 3.1 Layer A — task definition and task instance

The task definition is versioned before administration. It identifies:
- task ID and task-definition version;
- skill, development and focal claim;
- task model;
- the evidence targets the task is designed to elicit;
- exact representation, item structure and planned variation;
- prompt and instruction conditions;
- response modes required and permitted;
- what is objectively scorable;
- what raw response-process material must be preserved;
- known alternative explanations and the planned contrasts used to examine them.

A task model describes the intended evidence opportunity for a family of tasks. A task instance may elicit only a subset of that opportunity. The subset must be explicitly declared in the task instance; do not automatically copy every task-model target into every observation.

### 3.2 Layer B — immutable raw observation

Create one raw observation for one administered task-instance response episode. The episode includes the learner's response and its ordered attempts/events for that instance; it is not automatically one database record per click or per retry. If a task bundle contains separately administered instances, each instance receives its own observation and the bundle links them through a pre-specified contrast-set/bundle identifier. This unit must be fixed in the canonical schema before implementation. It should preserve, where available:
- stable observation and task-instance IDs;
- learner pseudonymous key, session and observed time;
- exact registry and task-definition versions;
- skill, development, claim and task-model references;
- the pre-specified target IDs the task instance was designed to address;
- the actual target/item and option configuration shown;
- selected/constructed response and objectively scorable correctness;
- learner explanation verbatim, without automatic interpretation;
- response modality and input source (for example selection, typed text, speech transcript or constructed visual response);
- ordered interaction events and attempts;
- hints, prompts and assistance actually delivered;
- task instruction language and other relevant context;
- technical/data-quality status and provenance.

The raw record must not contain C3 conclusions such as evidence quality, target match, independence or contradiction as if these were direct facts. If an objective machine-scored performance field is recorded, retain the response and scoring-rule version that produced it.

Raw observations are immutable. A correction creates a linked correction/version record; it does not overwrite the original learner response.

### 3.3 Layer C — target-specific C3 evidence assessment

Create a separate evidence-assessment record for each assessed combination of:
`observation_id × evidence_target_id × coder_id × coding_version`.

The assessment references the raw observation; it does not copy or rewrite it. It records the C3 dimensions required for that target:
- target match: direct / partial / indirect / none (or the approved schema's equivalent);
- evidence status: present / absent / indeterminate / not coded;
- objective performance status where relevant;
- process status where the target requires process evidence;
- independence/prompting status;
- evidence quality with a versioned codebook;
- contradiction status and rationale;
- alternative-explanation flags;
- coder, codebook and coding version;
- coder note and, if required, separate adjudication provenance.

Independent coder records remain separate and immutable. Adjudication creates a distinct resolution record; it must not replace original coder values.

A machine-generated field may populate a C3 assessment only after a separately specified and validated scoring rule exists. The current Fraction controller's synthetic shortcuts (`quality` derived from correctness, `relevant: true`, `independent: true`, `contradiction: false`) are not approved C3 coding and must not be used as empirical evidence assessments.

### 3.4 Multiple evidence targets and cardinality

**Proposed logical model:** one raw observation may be linked to one or more pre-specified evidence targets, but each target receives its own assessment record. The raw response is stored once; target-specific interpretation is stored separately.

Rules:
- Every target assessment must justify why the raw response directly or indirectly informs that target.
- A target mismatch is a task/design finding, not automatically a learner failure.
- Do not create a target assessment solely because a registry task model lists that target.
- Do not count two target assessments from one response as two independent observations.
- If a target requires a contrast across multiple task instances (for example stability across representations), create a separate comparison/evidence synthesis that references all contributing observations. Do not pretend one response establishes stability.
- Keep ET6 contradiction evidence attached to the same relevant observation/claim context; it is not a second learner response or an extra independent positive observation.

This logical model is compatible in principle with the array-based target linkage in `PacoGO_Empirical_Observation_Schema_v0.1.json`, but it is not yet represented consistently in `PacoGO_Pilot_DataSchema_v0.2.json`, which has singular `evidence_target_id` and singular `coding_record` fields. Do not silently choose one schema or patch the runtime. Before implementation, define a new versioned canonical data contract with explicit observation-to-target-assessment cardinality and migration/compatibility rules. No Supabase change is authorized by this specification.

### 3.5 C3 codebook and schema vocabulary is not yet canonical

The reviewed source documents contain unresolved differences. This specification does not choose one vocabulary or scale by convenience.

| Dimension | C3 specification v0.1 | Evidence Coding Manual v0.1 | Pilot DataSchema v0.2 | Required resolution |
|---|---|---|---|---|
| Target match | `direct / partial / indirect / none` | `MATCH / MISMATCH / UNCLEAR` | `MATCH / MISMATCH / UNCLEAR / NOT_CODED` | Define whether match quality is categorical, graded, or two separate dimensions. Preserve the distinction between task-design mismatch and degree of target alignment. |
| Evidence/process status | Process: `present / absent / ambiguous / not_collected`; separate C3 decision states | Evidence: `PRESENT / ABSENT / INDETERMINATE / NOT_CODED` | Coding status: `PRESENT / ABSENT / INDETERMINATE / NOT_CODED` | Separate raw process availability from coded evidence status and from whether coding has been performed. |
| Quality | `0 / .25 / .50 / .75 / 1.00` | `0 / .5 / 1.0` | Numeric, no allowed values specified | Decide whether these are alternative protocol stages or conflicting scales; version and calibrate before confirmatory use. |
| Independence | Independent, standardised prompt, non-standard prompt, direct instruction, unresolved contamination | `INDEPENDENT / PROMPTED / DEPENDENT / UNKNOWN` | Same four broad categories as manual | Decide whether prompt exposure and inferred independence are separate fields; retain actual assistance events as raw data. |
| Contradiction | Boolean concept with examples | Boolean concept with examples | `true / false / null` | Define when null means not coded versus not applicable, and keep contradiction distinct from incorrect performance. |

Further distinctions that must be preserved:
- Raw `process_status` describes whether process material was collected/observable; it is not the C3 coder's judgement that required reasoning is present or absent.
- `NOT_CODED` means coding has not been performed. `NOT_COLLECTED` means the relevant raw process was not collected. They are not interchangeable.
- `INDETERMINATE` means a coder cannot decide from available material; it is not equivalent to missing data.
- The numeric quality value is an evidence-quality judgement, not learner ability and not correctness.
- The C3 specification's decision states (`NOT_RUN`, `FEASIBILITY_ONLY`, `CODING_UNRELIABLE`, `INDETERMINATE`, `READY_FOR_INFERENCE`) describe readiness of the coding process, not a learner's evidence status.

**Blocking rule:** before implementing the new observation/assessment contract, create an explicitly versioned canonical C3 coding codebook/schema that resolves these differences, states which fields are raw versus coded, and specifies calibration/reliability requirements. Do not silently translate old codes, collapse categories, or select the finer scale as if it were already approved. Historical candidate documents remain preserved and referenced by version.

## 4. FR2 evidence-target interpretation

The registry currently defines:

| Target | Intended meaning | Assessment implication |
|---|---|---|
| FR2.ET1 | Correct recognition of equivalent and non-equivalent pairs | Objective classification/recognition; does not alone establish value reasoning |
| FR2.ET2 | Distinguish equivalence from superficial similarity | Requires deliberately constructed contrasts where surface cues can mislead |
| FR2.ET3 | Representation/reasoning evidence for same value | Requires inspectable response process that is mathematically consistent |
| FR2.ET4 | Equivalence remains correct under changed representation | Requires a pre-specified representation contrast; stability is assessed across linked observations/conditions |
| FR2.ET5 | Functional use of equivalence without explicit cue | Not covered by T01–T05; belongs to a later task design |
| FR2.ET6 | Contradictory evidence when correct outcome is paired with incorrect reasoning | A counterevidence/coding target, not a positive achievement point; must not be counted as independent support |

ET2 requires more than a new-looking picture. The item set must include mathematically non-equivalent cases whose numerator/denominator or visual surface resembles an equivalent case, so that the learner's classification can discriminate value from superficial similarity.

ET4 requires more than the presence of two different representations on one screen. The design must specify the comparison condition and the repeated or paired response pattern that demonstrates whether the same value relation survives a change in representation.

ET6 must be interpreted under the C3 contradiction rule. A wrong answer alone is not ET6. A correct selection paired with an explanation that demonstrably conflicts with the relevant value relation may be contradictory evidence for the explanation-dependent claim. Preserve the raw explanation and let the approved coding process decide.

## 5. Task-by-task proposed disposition

These dispositions are design recommendations only. Existing task-set and registry mappings remain unchanged until a later approved version.

### FR2-T01 — area-model recognition

**Current:** D1 / C1 / ET1 / TM1; explanation required; area-model target and area-model options.

**Proposal:**
- Retain ET1/TM1 as the primary task purpose.
- Preserve the explanation as raw response-process data.
- Treat explanation presence as a completion requirement only, not as evidence that ET3 has been met.
- Do not infer explanatory mastery from a non-empty text field.
- If this task is intended to assess ET2 as well, redesign the item set to include deliberately confusable non-equivalent pairs and specify the surface-cue contrast. Only then should a future task version explicitly include ET2 and justify the task-model mapping.

### FR2-T02 — symbolic recognition

**Current:** D1 / C1 / ET1 / TM1; explanation required; symbolic target and symbolic options.

**Proposal:**
- Retain ET1/TM1 as the primary task purpose.
- Preserve the explanation separately from correctness.
- Do not treat a written rule or explanation field as ET3 without coding its mathematical relationship to the target.
- If ET2 is intended, include non-equivalent pairs with misleading numerator/denominator similarity and define the discriminating response pattern. Otherwise keep the task as recognition only.

### FR2-T03 — cross-representation explanation

**Current:** D2 / C2 / ET3 / TM2; area-model target and symbolic options; explanation required. Registry TM2 includes ET3 + ET4, while the task instance currently names ET3 only.

**Proposal:**
- The current single cross-representation response can be designed to elicit ET3: the explanation must connect the two forms to the same fraction value.
- Do not claim ET4 stability from one cross-representation screen or one response.
- If T03 is to cover both ET3 and ET4 under TM2, make it a versioned task bundle with a pre-specified matched comparison across representation conditions. Store each response as its own raw observation; assess ET3 per response and ET4 from the linked contrast. Do not count the bundle as multiple independent observations merely because it contains multiple conditions.
- Until that bundle exists, a future task-set revision should use the registry task model that genuinely matches ET3 alone (currently TM3), subject to registry/task-contract review. Do not change it in this implementation phase.

### FR2-T04 — surface-familiarity countertask

**Current:** D1 / C1 / ET1 / TM1; marked countertask; grid area-model target and symbolic options. Registry TM5 includes ET2 + ET6, and C4 FR2-D1 discriminators use TM1/TM5 and ET1/ET2.

**Proposal:**
- The grid layout is a useful visual variation, but by itself it does not establish a countertask.
- Redesign the item set so it includes equivalent and non-equivalent pairs with deliberately conflicting surface cues. The learner must classify and provide an inspectable rationale.
- ET2 can be assessed when the response demonstrates discrimination based on value rather than superficial similarity.
- ET6 can be assessed only when a response pattern genuinely contradicts an otherwise plausible explanation (for example correct classification paired with an incompatible rationale). A simple wrong selection is not automatically ET6.
- If both ET2 and ET6 are intended, TM5 is the candidate model, but the task must elicit both opportunities and the two target assessments must remain separate.
- Do not call the current T04 implementation a completed TM5 countertask.

### FR2-T05 — language-reduced transfer

**Current:** D2 / C2 / ET3 / TM2; marked countertask; area-model target and symbolic options; short Dutch prompt and free-text explanation. Current context records a fixed `nl` language value.

**Proposal:**
- The current page does not establish a language-reduced condition or language-independent reasoning.
- Define the exact language demand being reduced (for example sentence complexity or vocabulary), what remains constant, and what is allowed to vary.
- Record task instruction language, learner response language, response modality, prompt level and actual condition delivered. Never infer learner language from the interface locale.
- Use matched task content across a standard-language and reduced-language condition, with order/counterbalancing specified where appropriate, so that a difference is interpretable rather than confounded with item difficulty or practice.
- Preserve the learner's explanation in the language and modality actually used. Do not require a particular language as proof of mathematical understanding.
- ET3 may be assessed if the observed explanation/representation genuinely supports same-value reasoning. ET4 requires a linked representation contrast; it is not established merely by calling T05 transfer.
- Until the condition and comparison are operationalised, T05 remains a synthetic interface demonstration, not a language-reduced measurement task.

### FR2-T06 or later task family — functional use

T01–T05 do not assess ET5. A future task should require the learner to use equivalence for another mathematical purpose without the task explicitly naming equivalence as the strategy. This is a separate design problem and must not be inferred from successful recognition or explanation tasks.

## 6. Task model, instance and contrast-set rules

- The registry task model specifies the evidence opportunity for a task family.
- The task definition specifies which parts of that opportunity the task is designed to elicit.
- The task instance specifies the exact items, representation, prompt, response mode and variation actually presented.
- The raw observation records what happened in one response.
- The C3 assessment decides whether that observation matches and supports a particular target.
- A contrast-set ID links deliberately matched task instances used to assess stability or discrimination.
- A task bundle is not one observation: each learner response remains separately recorded.
- An observation linked to multiple target assessments is not multiple independent observations.
- Any change to task IDs, task models, evidence-target arrays or variation definitions must be versioned and justified against the registry and C4 matrix.

## 7. Approval gates before implementation

The following must be reviewed and explicitly approved before runtime or schema work begins:

1. **Raw observation and assessment model:** approve the immutable task-instance response-episode plus target-specific C3 assessment structure, including the treatment of retries and bundled instances.
2. **Canonical schema:** resolve the singular fields in Pilot_DataSchema v0.2 versus the array linkage in Empirical_Observation_Schema v0.1; define a new version rather than silently mutating either.
3. **Canonical C3 codebook:** reconcile target-match categories, evidence/process status, quality scale, independence/prompting and contradiction missingness across C3 specification v0.1, Evidence Coding Manual v0.1 and Pilot_DataSchema v0.2. Keep the existing candidate versions as historical records.
4. **T01/T02:** confirm whether they remain recognition tasks with supplementary explanations, or are redesigned to assess ET2.
5. **T03:** decide whether it remains ET3/TM3 or becomes a matched ET3+ET4 task bundle under TM2.
6. **T04:** approve a genuine surface-cue countertask that elicits ET2 and, where applicable, ET6.
7. **T05:** approve a defined language manipulation, response metadata and matched comparison.
8. **ET6:** confirm its role as contradiction/counterevidence and prohibit treating it as positive mastery evidence.
9. **Versioning and traceability:** specify task, registry, schema, codebook and coding-record version relationships.
10. **Synthetic/empirical separation:** ensure synthetic browser outputs cannot enter the empirical coding pipeline as if independently coded learner evidence.

After approval, implementation must proceed in a separate change set. Add contract tests for raw-response immutability, task-instance versioning, per-target assessment traceability, multiple-target non-duplication, missingness, coder provenance and contrast-set linkage. Then run Full Regression on the exact implementation commit.

## 8. Explicitly out of scope

This specification does not:
- change the current registry mappings;
- declare any FR2 task empirically valid;
- change C3 coding thresholds or mastery thresholds;
- infer ET2, ET3, ET4 or ET6 automatically from UI behavior;
- implement language detection or infer a learner's language;
- change live learner persistence or Supabase;
- authorize real learner data collection through current synthetic pages.

## 9. Next concrete step

First reconcile the C3 codebook vocabulary/scales and the raw observation unit. Then review and approve (or revise) this specification as a curriculum/evidence contract. Only after those contracts are approved should the project create a separately versioned task-set/schema change proposal and implement the smallest necessary runtime changes. The current FR2 pages remain synthetic demonstrations in the meantime.
