# PacoGO Curriculum — Pilot Protocol v0.2

Date: 2026-11-02  
Status: Candidate protocol / [O]  
Supersedes: v0.1  
Purpose: C1 pilot design + C2 data integrity + C3 evidence-coding readiness.

## 1. Purpose of this version

This version operationalizes the measurement-development pilot after the technical curriculum engine, evidence store, longitudinal state and decision trace have been connected.

The pilot remains a **measurement-development pilot**, not proof that the PacoGO curriculum is correct or effective.

The pilot must establish that PacoGO can observe, code and preserve evidence in a way that is sufficiently reproducible and interpretable to justify later C4 developmental analyses.

## 2. Pre-specified measurement chain

The pilot uses:

`task model → task instance → performance → observation → evidence assessment → evidence profile → inference`

The runtime decision chain remains:

`evidence → inference → mastery → decision → next action`

The second chain cannot be used to retroactively define the first.

## 3. Observation and provenance

The atomic observation remains:

`Student × Time × Task × Response × Evidence`

Every observation must preserve:

- exact curriculum registry version;
- skill/development/claim/evidence-target linkage;
- task model and task-definition version;
- concrete task instance;
- observed performance;
- relevant context and language;
- source/provenance;
- coding record and codebook version where coding occurs.

Observed performance is immutable. A coding correction creates a new coding record that points to the superseded record.

## 4. Task variation

Each claim must specify the variation dimensions that are theoretically relevant before data interpretation.

At minimum, the pilot considers where applicable:

- representation;
- numerical magnitude;
- surface/context;
- response format;
- prompting;
- transfer/context change.

Variation is not a hidden difficulty scale. It is evidence about robustness, specificity and alternative explanations.

## 5. Evidence coding

Evidence coding is separated from developmental inference.

Coders record:

- evidence status;
- evidence-target match;
- quality;
- independence;
- variation key;
- contradiction;
- alternative explanations;
- coder note.

The coding manual is the normative source for these categories. Developmental labels are not coding targets.

## 6. Calibration and double coding

Before formal coding:

1. coders independently code a calibration set;
2. disagreements are reviewed;
3. ambiguous codebook rules are revised before the frozen coding phase;
4. the revised codebook receives a new version.

During the frozen coding phase, a pre-specified judgment-dependent subset is independently double-coded. The subset must cover meaningful claims, task forms and evidence categories rather than only easy observations.

Original coder records remain immutable.

## 7. C3 agreement analysis

Agreement analysis reports:

- raw agreement;
- confusion matrix for categorical codes;
- category frequencies;
- number of independently coded observations;
- disagreement categories;
- adjudication outcomes.

A chance-corrected coefficient may be reported only when appropriate to the variable, sample size and category distribution. No single reliability coefficient is treated as sufficient evidence of coding validity.

Reliability is interpreted as reproducibility of the coding procedure, not as proof that the developmental construct is valid.

## 8. Missingness and indeterminate evidence

The pilot distinguishes:

- no observation;
- evidence absent;
- evidence indeterminate;
- not coded;
- task/target mismatch.

Missingness must remain explicit. It is never silently converted to failure.

Indeterminate evidence is retained as a meaningful measurement result because it identifies cases in which the current task/observation design cannot discriminate among explanations.

## 9. Evidence aggregation

Evidence is aggregated by claim-relevant meaning, not by row count.

Repeated observations are not automatically independent. The analysis must inspect repeated item wording, representation, prompting, context and familiarity.

A single observation may inform multiple evidence targets only when each target is separately justified; it cannot thereby become multiple independent observations.

## 10. C1-C3 analysis sequence

### C1 — Design integrity
Confirm that claim, population/scope, tasks, variation, procedures, exclusions, coding and analysis rules were fixed before confirmatory interpretation.

### C2 — Data integrity
Confirm complete provenance, exact versioning, task identity, missingness, context and coding lineage.

### C3 — Coding reproducibility
Confirm that judgment-dependent coding can be reproduced sufficiently for the intended analysis and that disagreements are visible and diagnosable.

Detailed analysis is defined in `PacoGO_C1_C3_Analysis_Plan_v0.1.md`.

## 11. Readiness for C4

C4 developmental classification may begin only for claims where C1-C3 are sufficiently complete **and** the collected observations contain enough meaningful variation and process evidence to distinguish the candidate developmental interpretation from plausible alternatives.

C4 is not triggered merely because the engine can output a development label.

## 12. Revision and stopping rules

Stop or revise a pilot component when:

- target evidence cannot be observed reliably;
- coding remains materially ambiguous;
- task design measures an unintended feature;
- prompting, familiarity or language cannot be separated where relevant;
- critical provenance is missing;
- candidate developments cannot yet be distinguished empirically.

Every material protocol or codebook change creates a new version and preserves the previous version.

## 13. Scientific boundary

This protocol does not establish developmental stages, developmental ordering, mastery validity, causal learning mechanisms or curriculum effectiveness.

A1, B1 and FR2 remain `Candidate`. Synthetic observations are test data only and are not empirical learner evidence.
