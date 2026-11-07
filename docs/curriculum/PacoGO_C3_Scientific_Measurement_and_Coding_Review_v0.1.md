# PacoGO C3 — Scientific Measurement and Coding Review v0.1

Status: literature-informed design review / candidate recommendations / NOT an approved codebook  
Date: 2026-11-06  
Branch: `refactor/professional-v1`  
Reviewed materials:
- `PacoGO_C3_Canonical_Codebook_Reconciliation_Proposal_v0.2.md`
- `PacoGO_C3_Evidence_Coding_Specification_v0.1.md`
- `PacoGO_Evidence_Coding_Manual_v0.1.md`
- `PacoGO_C3_Blinded_Synthetic_Coder_Packet_v0.1.md`
- `PacoGO_C3_Descriptive_Coding_Reliability_Layer_v0.1.md`
- `PacoGO_Pilot_DataSchema_v0.2.json`
- `PacoGO_Empirical_Observation_Schema_v0.1.json`

## 1. Purpose and boundary

This review asks what is scientifically necessary before PacoGO approves a canonical C3 measurement/coding contract. It uses the repository's existing candidate documents and methodological literature on assessment validity, observational coding, ordinal ratings and inter-rater reliability.

This review does not:
- approve a C3 category, quality scale, reliability statistic or threshold;
- establish empirical reliability or validity for PacoGO;
- change curriculum meanings, SLO mappings, claims, evidence targets, task mappings or C6 mastery gates;
- authorize code, tests, registry, schema, runtime, persistence, SQL/RPC/RLS or Supabase changes;
- convert synthetic coder exercises into evidence from real learners.

## 2. Main conclusion

The C3 v0.2 proposal is directionally sound in separating distinct measurement questions. The most important requirement is to preserve the distinction between:

1. what the task instance afforded;
2. what the learner response/process was related to;
3. what was objectively scorable;
4. what raw process was actually captured;
5. what target-specific evidence was demonstrated;
6. what assistance was delivered;
7. what independence judgement is justified;
8. whether material contradicts a target-specific interpretation;
9. whether coding is complete and usable for the intended analysis.

These are not interchangeable labels for one general "evidence quality" score. Combining them would make it impossible to identify whether a weak result came from task design, response performance, missing process, assistance, coder uncertainty or an actual contradiction.

The proposal must remain a proposal until its category anchors, measurement units, coder workflow and schema cardinality are explicitly reviewed and approved.

## 3. Measurement distinctions that should be retained

### 3.1 Task-instance alignment is not learner performance

A task can fail to provide a valid opportunity to observe its intended target. That is a task/design/administration issue. The learner's answer may still be objectively correct or incorrect for the item that was presented, but it cannot automatically be interpreted as evidence for the intended target.

**Review finding:** retain task-instance alignment as a separate judgement. Record the exact administered task, not only the planned task definition. An administration departure may change alignment even when the catalogue definition is unchanged.

### 3.2 Response-to-target relation is not evidence status

A response can directly address a target but fail to demonstrate the required evidence. A response can also be indirectly informative without being sufficient. Therefore relation and demonstration answer different questions.

**Review finding:** retain separate fields, provided coders receive operational anchors and examples showing their different use. The old `MATCH / MISMATCH / UNCLEAR` vocabulary should not be mechanically translated into the candidate relation labels; the historical codebook version must remain attached to old records.

### 3.3 Performance is not target evidence or mastery

Objective correctness is a property of a response under a scoring rule. It does not by itself establish reasoning, independence, transfer, evidence quality or mastery. A correct selection can coexist with incompatible reasoning for a reasoning target; an incorrect response can occur on a task misaligned to the target.

**Review finding:** preserve raw response and scoring-rule provenance separately from target-specific assessment. Do not let a controller infer C3 status from correctness.

### 3.4 Process availability is not process interpretation

Not collected, technical failure, observer unable and not applicable describe collection/availability. They do not mean that a learner lacked the relevant reasoning. `NO_RESPONSE` should remain an observed response event; its interpretation depends on the administration protocol and available context.

**Review finding:** preserve collection state and response event separately. Do not automatically map missing process or no response to `ABSENT`.

### 3.5 Assistance exposure is not independence

The assistance actually delivered should be recorded before a coder judges its meaning for a particular target. Neutral task-management help, attention-directing prompts, strategy prompts and direct answer/strategy supply can have different implications.

**Review finding:** define an observable assistance-event taxonomy and target-specific anchors. The exact `PROMPTED`/`DEPENDENT` boundary remains open. Do not treat every prompt as contradiction or as proof that evidence is absent.

### 3.6 Contradiction is not incorrectness

Contradiction requires specific material that materially conflicts with a target-specific interpretation. A wrong answer, missing process, assistance or task mismatch alone does not establish contradiction.

**Review finding:** retain a separate target-specific contradiction judgement with a required rationale and reference to the exact source material.

## 4. Evidence quality scale — not ready to select

The repository currently contains incompatible candidates:
- C3 specification v0.1 proposes five numeric values: `0 / .25 / .50 / .75 / 1.00`;
- Evidence Coding Manual v0.1 proposes three values: `0 / .5 / 1.0`;
- Pilot_DataSchema v0.2 does not constrain the numeric scale;
- the v0.2 reconciliation proposal explicitly notes that the synthetic anchor exercise did not test quality-level anchors.

The current synthetic coder packet also omits a quality dimension from its candidate coding record. Therefore it cannot establish that coders can distinguish any proposed quality levels.

A scale cannot be selected merely because one option appears more precise. Before a scale is approved, the owner/scientific reviewer must define:
- the construct meant by evidence quality;
- whether quality is a property of the captured material, the task administration, the scoring process or a target-specific interpretation;
- observable anchors for each category;
- how quality differs from evidence status, objective performance and process availability;
- the intended measurement level (nominal, ordinal or genuinely quantitative);
- whether adjacent categories can be distinguished reliably in blinded coding;
- how unscorable and missing material is represented.

**Candidate recommendation:** do not approve an unrestricted decimal score. If the construct is an ordered judgement, use a versioned categorical/ordinal codebook with explicit anchors. Do not assume equal distances between categories, average values or use them as interval scores without separate evidence. The number of categories and labels remain undecided.

## 5. Coder reliability — design before coefficient

Reliability is about reproducibility of coding under a defined coding protocol. It is not proof that the underlying curriculum construct, developmental model, mastery inference or next-action policy is valid.

A reliability plan must be selected after the coding unit, measurement level, coder assignment design and missing-rating process are known.

### 5.1 Questions that must be fixed first

Before choosing a coefficient, specify:
- which fields are human-coded and which are objectively scored;
- whether the unit is observation × target, or another explicitly justified unit;
- whether each unit receives two or more independent ratings;
- whether the same coders rate all units (crossed), or coders are nested within tasks/sites/learners;
- whether the design is balanced or unbalanced;
- how missing ratings and unpaired units are handled;
- whether categories are nominal or ordinal;
- the expected category prevalence and whether rare categories are substantively important;
- whether the purpose is exact agreement, ordinal closeness, relative ranking or generalisation to a coder population;
- the planned uncertainty interval and minimum information needed for interpretation.

### 5.2 No universal coefficient

Methodological sources show that the choice of agreement/reliability measure depends on the scale and rater design. Cohen's kappa is designed for two raters and can be sensitive to category prevalence and marginal imbalance. Ordinal ratings require methods that respect ordering if adjacent disagreements are meaningfully less severe than distant disagreements. More-than-two-rater and missing-rating designs require methods that can represent their actual structure. Generalizability theory can model multiple variance sources and crossed/nested rater/task designs.

**Review finding:** no coefficient should be selected now. The current two-coder-only pairing rule in the descriptive reliability layer is an implementation limitation, not a scientific requirement that all future coding use exactly two coders. Keep unpaired and multi-coder groups visible; do not silently discard them or treat them as agreement observations.

### 5.3 Required reporting

At minimum, a pilot reliability report should retain:
- number of coding units and number of coders;
- coder assignment structure;
- missing/unpaired ratings and reasons where known;
- category prevalence and coder-specific marginal distributions;
- raw agreement and disagreement distributions;
- confusion matrices for categorical dimensions;
- an appropriately selected coefficient, if justified;
- uncertainty intervals and limitations;
- adjudication results separately from pre-adjudication independent ratings.

Do not report only one coefficient. Do not treat adjudicated consensus as independent agreement. Do not choose a coefficient or acceptance threshold after seeing which one makes results look best.

## 6. Synthetic exercises — what they can and cannot establish

The six-case synthetic anchor exercise and blinded packet can reveal:
- ambiguous wording;
- overlapping categories;
- missing instructions;
- disagreements about hypothetical edge cases;
- whether coders can follow the proposed record structure.

They cannot establish:
- agreement on real learner observations;
- population-level coding reliability;
- prevalence of categories in real use;
- quality-scale calibration;
- construct validity;
- validity of C6 mastery or C7 next-action decisions.

The packet is properly blinded from its adjudication key. Any exercise should preserve independent submissions before discussion and lock the initial records. The key must not be shared before independent coding is complete.

**Important gap:** because the current packet omits evidence quality, it cannot be used to validate quality anchors even as a synthetic feasibility exercise. If quality anchors are later proposed, add separate synthetic cases designed to test those anchors without implying that the exercise validates them.

## 7. Coding unit, cardinality and provenance

The existing proposal's observation model is conceptually necessary:

- one separately administered response episode = one immutable raw observation;
- one raw observation may have zero or more separately justified target-specific assessments;
- each target-specific assessment refers to one source observation and one target;
- coder rounds are independent assessment records, not new learner observations;
- adjudication is a linked resolution, not an overwrite;
- recoding under a new codebook creates a new versioned record;
- one observation assessed against multiple targets remains one raw observation.

The current schema mismatch must be resolved explicitly:
- Pilot_DataSchema v0.2 uses singular `evidence_target_id` and `coding_record`;
- Empirical_Observation_Schema v0.1 permits target arrays and a separate coding boundary.

Do not select one silently or implement first-target fan-out. A canonical versioned schema must follow the approved C3 model and preserve historical records under their original codebook/schema.

A further distinction should be explicit in the canonical contract: **no assessment record exists yet** is not necessarily the same as **an assessment record exists but a particular dimension is NOT_CODED**. The record lifecycle and each field's not-coded state should not be ambiguous.

## 8. Specific review actions before O6 can close

| Review item | Current state | Required next evidence/decision |
|---|---|---|
| Alignment vs response relation | Strong conceptual case for separation; labels remain candidates | Approve final labels and operational anchors |
| Evidence status | Candidate states defined | Resolve PRESENT/ABSENT/INDETERMINATE/NOT_CODED/NOT_APPLICABLE boundaries and record lifecycle |
| Performance | Separate objective dimension | Specify scoring-rule provenance and non-inference boundary |
| Process availability | Candidate collection states | Confirm source/technical missingness taxonomy and NO_RESPONSE protocol |
| Quality | Three-level vs five-level conflict; no anchor exercise | Define construct and anchors; test distinguishability; select measurement level |
| Assistance | Raw event plus target-specific independence | Define event taxonomy and PROMPTED/DEPENDENT anchors |
| Contradiction | Separate target-specific state | Approve material-conflict definition and rationale requirements |
| Coder workflow | Independent rounds/adjudication proposed | Approve coder assignment, blinding, lock, recoding and adjudication lifecycle |
| Reliability | No coefficient/threshold approved | Select study design first; then justify statistics and uncertainty reporting |
| Schema | Singular/array mismatch | Approve canonical observation/assessment cardinality and version compatibility |

O6 is not closed until these decisions have explicit scientific/product approval. The codebook cannot be inferred from the existence of the candidate proposal or synthetic packet.

## 9. Recommended next sequence

1. Review this scientific assessment and the C3 v0.2 proposal together.
2. Confirm the coding unit and target-assessment lifecycle before finalizing field names.
3. Resolve category definitions and anchors without changing curriculum meanings or C6 gates.
4. Define the quality construct and test proposed anchors; do not choose a scale based on numeric convenience.
5. Define the real pilot coder assignment and reliability design before choosing statistics.
6. Run a blinded synthetic feasibility exercise only to refine instructions/anchors; do not call it empirical reliability.
7. Approve a versioned canonical C3 codebook and derive the observation/assessment schema only after explicit review.
8. Reconcile FR2 task/evidence alignment against that approved contract.
9. Only then revisit G5/G6–G11 and the implementation gate. Full Regression remains mandatory before and after any implementation and after a handoff update.

## 10. Methodological references

1. **Validity as evidence for interpretations and uses:** [Validation of educational assessments: a primer for simulation and beyond](https://pmc.ncbi.nlm.nih.gov/articles/PMC5806296/).
2. **Interpretation of assessment data:** [Validity: on the meaningful interpretation of assessment data](https://doi.org/10.1046/J.1365-2923.2003.01594.X).
3. **Observational coding and inter-rater reliability:** [Computing Inter-Rater Reliability for Observational Data: An Overview and Tutorial](https://pmc.ncbi.nlm.nih.gov/articles/PMC3402032/).
4. **Ordinal agreement with multiple observers:** Vanbelle, Engelhart & Blix (2024), [A comprehensive guide to study the agreement and reliability of multi-observer ordinal data](https://link.springer.com/article/10.1186/s12874-024-02431-y).
5. **Nominal agreement with missing ratings:** [Measuring inter-rater reliability for nominal data – which coefficients and confidence intervals are appropriate?](https://pmc.ncbi.nlm.nih.gov/articles/PMC4974794/).
6. **Variance components and crossed/nested rater designs:** [A primer on Generalizability Theory for Pharmacy Education](https://pmc.ncbi.nlm.nih.gov/articles/PMC8102977/) and [Interrater reliability for multilevel data: A generalizability theory approach](https://pubmed.ncbi.nlm.nih.gov/33818118/).
7. **Transparency in coding and preregistered criteria:** [Validity and Transparency in Quantifying Open-Ended Data](https://doi.org/10.1177/25152459241275217).

These sources guide methodological choices; they do not validate PacoGO or determine a universal threshold. The correct analysis must be selected against the actual C3 variables, coder assignment and pilot data.
