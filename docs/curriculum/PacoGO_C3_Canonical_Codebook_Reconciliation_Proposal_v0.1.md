# PacoGO C3 — Canonical Codebook Reconciliation Proposal v0.1

Status: Design proposal / candidate / not approved for implementation  
Branch: `refactor/professional-v1`  
Baseline: `015676e85d79c8036d660156ae15390f40549391`  
Scope: reconcile C3 coding concepts across the current specification, coding manual, pilot schema and empirical observation schema. This document does not replace those historical candidate versions.

## 1. Purpose and decision boundary

The source documents describe overlapping but non-identical concepts using different labels, scales and data locations. A canonical contract is needed before FR2 task/evidence changes can safely enter runtime or pilot persistence.

This proposal identifies which concepts should be separate, which fields belong to raw observation versus coded assessment, and which choices still require explicit approval. It does **not** silently select one of the existing scales, set a universal reliability threshold, change curriculum mappings, or authorize a database migration.

The governing principle is to preserve the distinction between:

1. what was administered and what the learner actually did;
2. whether the administered task was designed to elicit a target;
3. what the observed response does or does not show about that target;
4. how confidently and reproducibly coders can make that judgement;
5. what later inference may be warranted.

## 2. Source conflicts that must be resolved

| Concept | Existing candidate definitions | Problem |
|---|---|---|
| Target match | C3 specification: `direct / partial / indirect / none`; manual and Pilot_DataSchema: `MATCH / MISMATCH / UNCLEAR` | These appear to mix task-to-target design alignment with the evidential relationship of a particular response to a target. |
| Evidence/process status | C3 specification: process `present / absent / ambiguous / not_collected`; manual/schema: evidence `PRESENT / ABSENT / INDETERMINATE / NOT_CODED` | Raw process availability, coder judgement and coding workflow state are not the same variable. |
| Quality | C3 specification: five numeric points `0 / .25 / .50 / .75 / 1.00`; manual: `0 / .5 / 1.0`; schema: unrestricted number | The scales imply different granularity and may invite arithmetic treatment without evidence that intervals are equal. |
| Independence | C3 specification: five prompt/contamination descriptions; manual/schema: `INDEPENDENT / PROMPTED / DEPENDENT / UNKNOWN` | Actual assistance exposure and the judgement about whether it compromises a target-specific inference are conflated. |
| Contradiction | Specification/manual describe a boolean concept; schema uses nullable boolean | A boolean cannot distinguish not coded, indeterminate and not applicable. |
| Cardinality | Pilot_DataSchema has singular target/coding fields; Empirical_Observation_Schema permits target arrays | A single raw response can inform multiple targets, but must not become multiple independent observations. |

## 3. Proposed conceptual model

### 3.1 Raw observation: response episode

Retain the FR2 alignment specification's proposed unit: one administered task-instance response episode, including the learner's response and its ordered attempts/events. A click or retry is an event within the episode, not automatically a new observation. Separately administered task instances receive separate observations and may be linked by a pre-specified bundle/contrast-set identifier.

Raw observation fields should describe events and provenance, not developmental interpretation. At minimum, preserve:

- task instance, task-definition version, registry version, session and pseudonymous learner key;
- the exact items, options, representations, instructions and language actually shown;
- raw learner response and response modality;
- objectively scorable performance, together with scoring-rule version;
- ordered attempts and interaction events;
- actual prompts, hints, feedback and assistance delivered, including timing and content where feasible;
- whether process material was collected and is available;
- technical/data-quality events and missingness reasons.

Raw observations remain immutable. Corrections or later interpretations are linked records, not overwrites.

### 3.2 Separate task-design alignment from response evidence

**Proposal:** do not force the current two target-match vocabularies into one field. They answer different questions.

A. **Task-instance target alignment** asks: *Did the exact task instance as administered afford a defensible opportunity to observe this target?* This is a task-design/administration judgement, ideally specified before inspecting the learner's outcome.

Candidate values for review:
- `ALIGNED`
- `PARTIALLY_ALIGNED`
- `MISALIGNED`
- `UNCLEAR`
- `NOT_ASSESSED`

B. **Response-to-target relation** asks: *How does this particular response/process relate to the target?*

Candidate values for review:
- `DIRECT`
- `PARTIAL`
- `INDIRECT`
- `NONE`
- `INDETERMINATE`
- `NOT_CODED`

These are not interchangeable. A well-designed task can produce no usable response evidence; a misaligned task can still produce an interesting response that should not be treated as evidence for the intended target. A mismatch is a task/design finding, not automatically a learner failure.

The team must decide whether the proposed two-field model is sufficiently clear in coder instructions and feasible in the pilot. If the distinction cannot be applied reliably, simplify the model only after a documented coding exercise—not by collapsing the terms on paper.

### 3.3 Evidence status and process availability

Keep at least three separate layers:

1. **Raw collection/availability:** was the relevant response-process material collected and available?
2. **Coded evidence status:** after inspection, was target evidence demonstrated?
3. **Coding workflow state:** has coding been performed and is the result ready for the planned inference?

Candidate coded evidence statuses:
- `PRESENT`: required target evidence is demonstrated in the available material;
- `ABSENT`: relevant material was available and the required evidence was not demonstrated;
- `INDETERMINATE`: material was inspected but cannot distinguish support from non-support;
- `NOT_CODED`: no coding judgement has yet been made;
- `NOT_APPLICABLE`: the dimension does not apply to this target/observation under the protocol.

Raw collection/missingness should separately distinguish, where applicable:
- `COLLECTED`;
- `NOT_COLLECTED`;
- `TECHNICAL_FAILURE`;
- `NO_RESPONSE`;
- `OBSERVER_UNABLE`;
- `NOT_APPLICABLE`.

Do not encode missing raw material as `ABSENT`. Do not encode an unperformed judgement as `INDETERMINATE`. Do not use `NOT_CODED` as a missing-data reason.

C3 readiness states such as `NOT_RUN`, `FEASIBILITY_ONLY`, `CODING_UNRELIABLE`, `INDETERMINATE` and `READY_FOR_INFERENCE` describe the readiness of a coding process or analysis, not a learner's evidence status. Retain them in a separate process/readiness object if they remain needed.

### 3.4 Performance is not evidence quality

Keep objective performance distinct from construct interpretation:
- `CORRECT`;
- `INCORRECT`;
- `MIXED`;
- `NOT_OBSERVED`;
- `NOT_SCORABLE`.

The raw response and scoring-rule version must remain inspectable. Correctness must never automatically populate target evidence status, quality, independence or contradiction.

### 3.5 Quality scale: preserve the decision, do not choose by convenience

The current 3-point and 5-point proposals are both candidate conventions. Neither is empirically calibrated, and the schema's unrestricted numeric value is not an adequate codebook.

Before selecting a scale, the team should:
1. define what evidence quality means independently of correctness and learner ability;
2. write observable anchors for every proposed level;
3. test whether coders can distinguish adjacent levels using blinded examples;
4. inspect category use, disagreement and floor/ceiling concentration in a feasibility sample;
5. decide whether the intended scale is ordinal or has a defensible interval interpretation.

**Provisional recommendation:** represent quality as an explicitly ordered categorical judgement in the canonical codebook, not an unrestricted decimal. Do not average quality codes or treat a one-step difference as equal across the scale unless that interpretation is separately justified. The number and labels of levels remain open pending the anchor exercise. Preserve old numeric values with their original codebook version; never silently recode them.

### 3.6 Assistance exposure versus independence judgement

Record actual assistance as raw events: who/what supplied it, when it occurred, its content/type, whether it was standardised, and whether it exposed the target-relevant reasoning or answer.

Then make a separate, target-specific C3 judgement about independence/assistance. The judgement must reference the assistance events and the claim's stated independence requirement.

The current `INDEPENDENT / PROMPTED / DEPENDENT / UNKNOWN` set may be retained as a coarse judgement only if the manual defines each category and the coder can distinguish target-relevant assistance from neutral task-management support. The five detailed C3 labels may describe exposure conditions rather than a single independence scale. Do not combine these dimensions into one ordered score.

### 3.7 Contradiction and alternative explanations

Contradiction is not synonymous with an incorrect answer. It concerns material conflict with an interpretation that would otherwise be drawn from the same target/claim context.

Replace nullable boolean storage with an explicit status, subject to approval:
- `PRESENT`;
- `ABSENT`;
- `INDETERMINATE`;
- `NOT_CODED`;
- `NOT_APPLICABLE`.

Require a short rationale and reference to the response/process material. Keep contradiction distinct from performance status and from a general alternative-explanation flag.

Alternative explanations (for example language comprehension, familiarity, cueing, prompting, representation-specific strategy or technical problems) should be recorded as structured hypotheses with provenance. They are not diagnoses and should not automatically invalidate an observation; their effect belongs in the later claim-specific interpretation.

### 3.8 Target-specific assessments, coder provenance and adjudication

Use separate target-specific assessment records linked to the immutable raw observation. A logical assessment identity should include:

`observation_id × evidence_target_id × coder_id × codebook_version × coding_round`

The schema must also preserve task-instance alignment assessment and any adjudication record as distinct entities or clearly separate subrecords.

- Independent coder records remain immutable.
- Adjudication is a new, linked resolution; it never overwrites original coder judgements.
- Recoding under a new codebook creates a new version and records which prior assessment it supersedes.
- One observation assessed against multiple targets remains one observation. Target assessments are not independent learner responses.
- A task model's target list is an evidence opportunity, not automatic proof that each target was elicited or demonstrated.

## 4. Coding reliability requirements

The existing C3 specification correctly avoids declaring one universal reliability statistic or threshold. Keep that principle.

Before confirmatory coding, specify:
- coder training and qualification;
- which variables are human-coded versus objectively scored;
- the double-coding sampling design and how observations are selected;
- the unit on which agreement is calculated;
- how many coders assess each unit and whether coder assignment is crossed or nested;
- how disagreements and adjudication are handled;
- the statistic appropriate to each variable's measurement level and missingness pattern;
- uncertainty intervals and the minimum information/sample size needed for an interpretable estimate;
- the decision rule for coder drift and recoding.

Report raw agreement and category/confusion distributions alongside any chance-corrected coefficient. Report the number of units, number of coders, missing ratings and category prevalence. A high coefficient from very few or highly unbalanced ratings must not be presented without its information limitations.

The descriptive reliability layer may remain a reporting layer, but it must not hard-code an exclusive two-coder design if the future pilot may use more coders. Its current exact-two-coder pairing rule is a data-reporting constraint, not a universal scientific definition of reliability.

Reliability supports reproducibility of coding; it does not establish construct validity, developmental truth or mastery validity.

## 5. FR2 implications (no mapping changes authorised)

- T01/T02: preserve explanations as raw process material. A required text field is not itself evidence of reasoning or ET3.
- T03: one response may inform a target-specific assessment, but stability across representations requires a linked contrast across separately administered instances.
- T04: a changed visual surface alone does not establish discrimination. Task-instance alignment must be reviewed against the actual confusable equivalent/non-equivalent item set.
- T05: record the language and response conditions actually delivered. Do not infer learner language from interface locale; a language-reduced claim needs an operationalised and matched condition.
- ET6 remains contradiction/counterevidence, not positive achievement evidence.

All current FR2 browser outputs remain synthetic technical demonstrations, not empirical learner observations or independently coded pilot evidence.

## 6. Approval questions before a canonical codebook/schema is authored

1. Approve or reject the separation between task-instance target alignment and response-to-target relation.
2. Approve the separate raw collection, coded evidence and coding-readiness states.
3. Choose the quality scale only after defining anchors and testing coder usability; decide whether it is ordinal.
4. Separate actual assistance exposure from the target-specific independence judgement; approve the exact category definitions.
5. Approve explicit contradiction states including not-coded and not-applicable.
6. Confirm target-specific assessment cardinality and immutable coder/adjudication provenance.
7. Define the pilot's coder assignment and reliability design before selecting coefficients or thresholds.
8. Confirm which fields belong in raw observation, target assessment, task-instance alignment, and study-level coding-readiness records.

Until these decisions are approved, no runtime, registry, task mapping, mastery, learner-state or Supabase changes are authorised.

## 7. Recommended next sequence

1. Review this proposal against the current C3/C4 documents and FR2 alignment specification.
2. Run a small, blinded codebook-anchor exercise using synthetic examples only. Record disagreements and ambiguous definitions; do not treat this as empirical learner validation.
3. Resolve the approval questions and publish a versioned canonical C3 codebook.
4. Derive a versioned canonical observation/assessment schema from the approved codebook, with compatibility and historical-code handling.
5. Only then revise the FR2 task/evidence specification and design implementation contracts.
6. Run Full Regression before implementation, after implementation and after the required handoff update.

## 8. Scientific references informing this proposal

- AERA, APA & NCME. (2014). *Standards for Educational and Psychological Testing*. The standards frame validity around evidence and theory supporting proposed score interpretations and uses. Open-access information: https://www.testingstandards.net/ and https://ncme.org/resources/books/testing-standards/
- Artstein, R. & Poesio, M. (2008). Inter-Coder Agreement for Computational Linguistics. *Computational Linguistics*, 34(4), 555–596. https://doi.org/10.1162/coli.07-034-R2. (General discussion of agreement measures and coding design.)
- Krippendorff, K. (2011). Agreement and Information in the Reliability of Coding. *Communication Methods and Measures*, 5(2), 93–112. https://doi.org/10.1080/19312458.2011.568376. (Reliability coefficients also depend on the information available in the coding data.)
- Gisev, N., Bell, J. S., & Chen, T. F. (2013). Interrater agreement and interrater reliability: key concepts, approaches, and applications. *Research in Social and Administrative Pharmacy*, 9(3), 330–338. https://doi.org/10.1016/j.sapharm.2012.04.004.
- Hallgren, K. A. (2012). Computing Inter-Rater Reliability for Observational Data: An Overview and Tutorial. *Tutorials in Quantitative Methods for Psychology*, 8(1), 23–34. https://doi.org/10.20982/tqmp.08.1.p023.
- Wongpakaran, N. et al. (2013). A comparison of Cohen's Kappa and Gwet's AC1 when calculating inter-rater reliability coefficients: a study conducted with personality disorder samples. *BMC Medical Research Methodology*, 13, 61. https://doi.org/10.1186/1471-2288-13-61.
- Gwet, K. L. (2016). Measuring inter-rater reliability for nominal data – which coefficients and confidence intervals are appropriate? *BMC Medical Research Methodology*, 16, 93. https://doi.org/10.1186/s12874-016-0200-9. The choice of coefficient depends on measurement level and missingness; this is not a reason to choose a coefficient before the coding design is fixed.

References are methodological inputs, not validation evidence for PacoGO or its proposed constructs.
