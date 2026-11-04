# PacoGO C3 — Canonical Codebook Reconciliation Proposal v0.2

Status: Revised design proposal / candidate / not approved for implementation  
Branch: `refactor/professional-v1`  
Supersedes for review: `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.1.md` (historical candidate retained)  
Inputs reviewed:
- `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.1.md`
- `PacoGO_C3_Evidence_Coding_Specification_v0.1.md`
- `PacoGO_Evidence_Coding_Manual_v0.1.md`
- `PacoGO_Pilot_DataSchema_v0.2.json`
- `PacoGO_Empirical_Observation_Schema_v0.1.json`
- `PacoGO_C3_Descriptive_Coding_Reliability_Layer_v0.1.md`
- `PacoGO_FR2_Task_Evidence_Alignment_Specification_v0.1.md`
- `PacoGO_C3_Synthetic_Codebook_Anchor_Exercise_v0.1.md`

## 1. Purpose and decision boundary

This revision incorporates the conceptual findings from the six-case synthetic anchor exercise and makes the unresolved measurement decisions more explicit.

The proposal concerns only the evidence/measurement contract for already-defined curriculum targets. Existing skills, developments, SLO mapping, claims, evidence-target meanings, learning progression and mastery criteria are fixed boundaries. If a coding decision appears to require changing any of those, stop and ask the product owner.

This is still a design proposal. It does not:
- establish a canonical approved codebook;
- choose a final quality scale, reliability coefficient or threshold;
- authorize changes to curriculum registry, task mappings, runtime, learner-state, schemas, persistence or Supabase;
- establish inter-rater reliability, construct validity, mastery validity or scientific validation of PacoGO.

## 2. Governing distinctions

The following are different questions and must not be collapsed into one field:

1. **Task-instance alignment:** did the task as actually administered provide a defensible opportunity to observe the specified target?
2. **Response-to-target relation:** how is this particular response/process related to that target?
3. **Evidence status:** does the available material demonstrate the evidence required by that target?
4. **Objective performance:** what was scorable about the response under a versioned scoring rule?
5. **Raw process availability:** was the relevant process material actually collected and available?
6. **Assistance exposure:** what assistance was actually delivered?
7. **Independence judgement:** what does that assistance mean for this target's independence requirement?
8. **Contradiction:** does specific material materially conflict with a target-specific interpretation?
9. **Coding workflow/readiness:** has coding been done, reviewed and judged usable for the planned analysis?

These dimensions describe different layers of the evidence process. None is a shortcut to mastery or developmental position.

## 3. Observation unit and cardinality

### 3.1 Raw observation

Retain the proposed unit from the FR2 alignment specification: one administered task-instance response episode, including the response and its ordered attempts/events. A click, edit or retry is an event within that episode, not automatically a new observation.

Separately administered task instances receive separate observations. A pre-specified bundle/contrast-set identifier may link those observations for later comparison.

The raw observation should preserve, where available:
- pseudonymous learner, session, task-instance and observation identifiers;
- exact registry, task-definition and relevant instrument versions;
- the items, options, representations, instructions and language actually presented;
- raw response and response modality;
- objectively scorable performance plus the scoring-rule version;
- ordered attempts and interaction events;
- prompts, hints, feedback and assistance actually delivered, with content/timing where feasible;
- process-collection availability and technical/data-quality events;
- source and collection provenance.

Raw observations are immutable. Corrections are linked/versioned records; they do not overwrite the original.

### 3.2 Multiple targets

One raw observation may inform more than one evidence target only where each relationship is separately justified. Each target receives its own target-specific assessment. The response is stored once.

A task model's target list describes potential evidence opportunities; it does not prove that every listed target was elicited or demonstrated in a particular task instance. Multiple assessments derived from one response are not multiple independent observations.

### 3.3 Schema conflict remains unresolved

`PacoGO_Pilot_DataSchema_v0.2.json` currently has singular `evidence_target_id` and `coding_record` fields. `PacoGO_Empirical_Observation_Schema_v0.1.json` permits an array of target IDs and places coded fields in a separate boundary. These are not yet one compatible canonical contract.

Do not silently choose either schema or patch around the mismatch. A new versioned schema must define observation-to-target-assessment cardinality, provenance, historical compatibility and migration before implementation. No persistence or Supabase change is authorized here.

## 4. Target alignment and response relation

### 4.1 Task-instance target alignment

Question: *Did this exact task instance, as designed and administered, afford a defensible opportunity to observe this target?*

Candidate categories for review:
- `ALIGNED`
- `PARTIALLY_ALIGNED`
- `MISALIGNED`
- `UNCLEAR`
- `NOT_ASSESSED`

This is a task/administration judgement, preferably specified before inspecting learner outcome. A mismatch is a task-design/administration finding, not automatically a learner failure.

### 4.2 Response-to-target relation

Question: *How does this particular response/process relate to the specified target?*

Candidate categories for review:
- `DIRECT`
- `PARTIAL`
- `INDIRECT`
- `NONE`
- `INDETERMINATE`
- `NOT_CODED`

This dimension describes the relation, not whether the target evidence was demonstrated. For example, a response may directly address a target but fail to demonstrate the required evidence. Conversely, a task may be misaligned even when the learner gives an objectively correct answer to the presented item.

The historical `MATCH / MISMATCH / UNCLEAR` vocabulary appears to conflate task alignment with response relation. Do not mechanically translate old values into the new candidates. Historical coding must retain its original codebook version.

## 5. Raw process availability, evidence status and workflow state

### 5.1 Raw process availability

Raw collection/availability describes what was captured, not what a coder concluded. Candidate collection states include:
- `COLLECTED`
- `NOT_COLLECTED`
- `TECHNICAL_FAILURE`
- `OBSERVER_UNABLE`
- `NOT_APPLICABLE`

`NO_RESPONSE` is an observed response event/state, not a generic missingness synonym. Preserve the reason/context where observable; do not guess why no response occurred.

### 5.2 Target-specific evidence status

Candidate assessment states:
- `PRESENT`: required target evidence is demonstrated in the available material.
- `ABSENT`: relevant material was available and inspected, and the required evidence was not demonstrated under the pre-specified protocol.
- `INDETERMINATE`: a coder inspected the available material but cannot make a defensible support/non-support judgement.
- `NOT_CODED`: the required coding judgement has not yet been made.
- `NOT_APPLICABLE`: this assessment dimension does not apply under the approved task/target protocol.

Do not encode `NOT_COLLECTED`, `TECHNICAL_FAILURE` or `NO_RESPONSE` automatically as `ABSENT`. A no-response event is normally `INDETERMINATE` when its meaning is unknown. It may be coded `ABSENT` only if a pre-specified administration/scoring protocol justifies that interpretation. Use `NOT_APPLICABLE` only when the target/dimension was not an applicable evidence opportunity, not merely because coding is difficult.

### 5.3 Coding workflow/readiness

C3 process/readiness states such as `NOT_RUN`, `FEASIBILITY_ONLY`, `CODING_UNRELIABLE`, `INDETERMINATE` and `READY_FOR_INFERENCE` describe the coding process or analysis readiness. They are not learner evidence statuses and belong at a study/analysis or coding-round level, not in the target's evidence-status field.

## 6. Objective performance and evidence quality

### 6.1 Performance

Retain objective performance as a separate field, using the existing candidate vocabulary where applicable:
- `CORRECT`
- `INCORRECT`
- `MIXED`
- `NOT_OBSERVED`
- `NOT_SCORABLE`

The raw response and scoring-rule version must remain inspectable. Correctness must not automatically populate evidence status, quality, independence, contradiction or mastery.

### 6.2 Quality scale is deliberately undecided

The C3 specification proposes five numeric values (`0 / .25 / .50 / .75 / 1.00`); the manual proposes three (`0 / .5 / 1.0`); Pilot_DataSchema v0.2 allows an unrestricted number. The synthetic anchor exercise did not test quality-level anchors and provides no basis to choose between these scales.

Before selecting a scale:
1. define evidence quality independently of correctness, learner ability and evidence status;
2. define observable anchors for every proposed category;
3. test whether independent coders can distinguish adjacent categories using blinded cases;
4. inspect disagreement, category prevalence and floor/ceiling concentration in a feasibility sample;
5. determine whether the scale is ordinal or whether any interval interpretation is defensible.

Provisional design recommendation: use an explicitly ordered categorical judgement in the future codebook, not an unrestricted decimal. Do not average codes or assume equal intervals without separate justification. The number and labels of categories remain open. Preserve historical numeric values with their original codebook version; never silently recode them.

## 7. Assistance exposure and independence

### 7.1 Raw assistance events

Record the assistance actually delivered before interpreting it. Where feasible, preserve:
- source/provider of assistance;
- event timing and sequence;
- exact content or standardised prompt identifier;
- whether assistance was standardised;
- whether it exposed, supplied or materially supported target-relevant reasoning/strategy/answer.

Distinguish neutral task-management support from target-relevant help.

### 7.2 Target-specific independence judgement

The judgement is made separately for each target and references the observed assistance events and that target's independence requirement.

The manual/schema categories `INDEPENDENT / PROMPTED / DEPENDENT / UNKNOWN` may be retained only if operational anchors distinguish:
- no target-relevant assistance;
- a prompt that directs attention but does not supply target reasoning;
- assistance that materially supports target reasoning;
- direct supply/disclosure of the target strategy or answer;
- insufficient information.

The exact boundary between `PROMPTED` and `DEPENDENT` remains open until coder anchors are tested. Do not treat every prompt as contradiction or as proof that evidence is absent. Performance/evidence and independence remain separate.

## 8. Contradiction and alternative explanations

Contradiction is target-specific and is not synonymous with an incorrect answer, missing process, prompting or task mismatch.

Candidate contradiction states:
- `PRESENT`
- `ABSENT`
- `INDETERMINATE`
- `NOT_CODED`
- `NOT_APPLICABLE`

A contradiction judgement must reference:
- the target/claim context;
- the specific observed response/process material;
- the interpretation that would otherwise be supported;
- why the material materially conflicts with that interpretation.

The synthetic anchor cases support these boundaries:
- a correct selection with incompatible reasoning may support a recognition target while contradicting a reasoning-dependent target;
- an incorrect answer alone is not automatically contradiction;
- missing process material is not contradiction;
- assistance alone is not contradiction;
- a misaligned task does not establish learner contradiction.

Alternative explanations (such as language comprehension, item familiarity, cueing, representation-specific strategy or technical problems) are hypotheses with provenance, not diagnoses. Their effect belongs in later claim-specific interpretation.

## 9. Coder provenance, independent records and adjudication

A target-specific coding record should be traceable at least by:

`observation_id × evidence_target_id × coder_id × codebook_version × coding_round`

Where applicable, also record task-instance alignment assessment, coding timestamp, coder training/version, rationale and links to the exact raw material.

- Independent coder records are immutable.
- Disagreement is retained before discussion/adjudication.
- Adjudication is a new linked resolution; it does not overwrite independent records.
- Recoding under a new codebook creates a new version and identifies the prior record it supersedes.
- One observation assessed against multiple targets remains one observation.
- A task target list is an opportunity, not automatic evidence.

## 10. Coding reliability design and reporting

Reliability must be designed after the variables, measurement levels, coding unit and coder workflow are specified.

Before confirmatory coding, define:
- human-coded versus objectively scored variables;
- coder training and qualification;
- the sampling design for independent duplicate coding;
- the unit of agreement and the number of coders per unit;
- whether coder assignment is crossed, nested or otherwise structured;
- treatment of missing ratings and categories not observed;
- disagreement capture and adjudication timing;
- statistic(s) and uncertainty intervals appropriate to each variable's measurement level and data pattern;
- minimum information/sample size for an interpretable estimate;
- drift monitoring and recoding rules.

Report raw agreement and category/confusion distributions alongside any chance-corrected coefficient, with the number of units, coders, missing ratings and category prevalence. Do not present a coefficient without its information limitations. Reliability concerns reproducibility of coding; it does not establish construct validity, developmental truth or mastery validity.

The current descriptive reliability layer v0.1 pairs only groups with exactly two distinct coders. That is a limitation of its current reporting implementation, not a scientific definition of reliability. A future reporting contract must preserve unpaired and multi-coder groups and support the coder assignment design selected for the study. Do not force all future studies into exactly two coders, and do not treat unpaired groups as agreement data.

## 11. Synthetic anchor exercise: conclusions and limits

The six synthetic cases (A–F) support the conceptual separation of task alignment, response relation, evidence status, performance, process availability, assistance events, independence and contradiction.

They highlight specific operational rules:
- A positive case may support more than one target only through separate target-specific assessments.
- A correct selection may support recognition while failing to support a reasoning target.
- Task mismatch plus an incorrect item response is a task/design issue, not automatically learner failure.
- Correct performance after target-relevant assistance may be evidence of performance but not independent performance.
- Uncollected process cannot be treated as absent reasoning.
- `NO_RESPONSE` is a raw event; its evidence interpretation requires a pre-specified protocol.

This was a desk-based conceptual exercise with synthetic examples. It was not independent human coding and does not establish coder agreement, reliability, quality-scale calibration, construct validity, mastery validity or next-action validity.

## 12. FR2 boundary

The FR2 alignment specification remains a separate candidate design document. Its task-level recommendations are not approved by this proposal. Preserve its boundaries:
- T01/T02 explanations remain raw supplementary process unless the task is deliberately redesigned and approved for a reasoning target.
- T03 cannot establish stability across representations without linked, separately administered contrast instances.
- T04 requires a genuine surface-cue countertask; visual layout change alone is insufficient.
- T05 requires an operationalised language condition and matched comparison; interface locale does not establish learner language.
- ET6 remains target-specific contradiction/counterevidence, not positive achievement evidence.

Current FR2 browser outputs remain synthetic technical demonstrations, not empirical learner observations or independently coded pilot evidence.

## 13. Decisions still required

Before a canonical codebook/schema is authored, the product/scientific owner must review and explicitly decide:

1. Whether task-instance alignment and response-to-target relation remain separate fields, and approve their final labels/anchors.
2. The exact raw collection/missingness vocabulary and treatment of `NO_RESPONSE`.
3. The exact evidence-status categories and operational boundaries for `ABSENT`, `INDETERMINATE` and `NOT_APPLICABLE`.
4. The quality construct, observable anchors, number of categories and ordinal/interval interpretation.
5. The assistance-event representation and exact boundary between `PROMPTED` and `DEPENDENT`.
6. The contradiction states and rationale requirements.
7. The target-specific assessment cardinality and immutable coder/adjudication provenance.
8. The pilot coder assignment, duplicate-coding sampling and reliability analysis design.
9. The canonical observation/schema versioning and compatibility strategy for the current singular-versus-array conflict.

No decision in this proposal changes curriculum meaning, SLO mapping, task mapping or mastery criteria. Any proposal that appears to require such a change must be stopped and referred to the product owner.

## 14. Recommended next sequence

1. Review this v0.2 proposal as an evidence/measurement contract only.
2. Resolve any product-owner decisions in Section 13; do not infer approval from the existence of this document.
3. Prepare a blinded coder packet and a separate adjudication key using synthetic cases. Coders receive the packet without the key and code independently before discussion.
4. Record disagreements and revise operational anchors transparently. This synthetic exercise can assess usability/feasibility only; it is not empirical learner validation.
5. Define the human coder reliability design before selecting coefficients or thresholds.
6. Only after explicit approval, author a versioned canonical C3 codebook and derive the canonical observation/assessment schema.
7. Review the FR2 task/evidence specification against the approved contract before any task/runtime/schema implementation.
8. Run Full Regression before every implementation step and after any required handoff update.

## 15. Methodological references

The methodological references listed in proposal v0.1 remain candidate background sources, not validation evidence for PacoGO. Their use does not select a reliability coefficient or threshold. Reassess the exact statistical method only after the measurement levels, coder design, missingness and sample information are defined.
