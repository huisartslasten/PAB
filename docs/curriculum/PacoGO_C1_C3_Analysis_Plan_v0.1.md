# PacoGO Curriculum — C1-C3 Analysis Plan v0.1

Date: 2026-11-02  
Status: Candidate analysis specification / [O]  
Scope: measurement-development pilot for A1, B1 and FR2.

## 1. Purpose

This plan defines what will be analyzed before PacoGO attempts C4 developmental classification. It is a measurement-readiness plan, not a validation result.

## 2. Analysis order

The analysis must proceed in this order so later interpretation cannot hide earlier data-quality problems.

1. provenance and integrity;
2. missingness and task coverage;
3. evidence-target observability;
4. coding reproducibility;
5. evidence quality and independence;
6. variation and alternative explanations;
7. readiness decision for C4.

## 3. C1 — design integrity

Check that every confirmatory claim has, before analysis:

- exact claim text;
- intended development;
- evidence targets;
- task models and task-instance definitions;
- expected evidence;
- relevant variation dimensions;
- plausible alternatives;
- contradiction conditions;
- inclusion/exclusion rules;
- planned analysis;
- revision/stopping rule.

### C1 pass condition
The study can be reconstructed from the protocol without using the observed results to fill missing design decisions.

A missing pre-specification is recorded as a design limitation, not repaired silently after seeing the data.

## 4. C2 — data integrity

For every observation, check:

- unique observation identity;
- learner/session/time;
- exact curriculum registry version;
- skill/development/claim/evidence target linkage;
- task model and task instance;
- performance record;
- context/language where relevant;
- provenance;
- coding version where coding exists.

### C2 missingness report
Report missingness by field and by claim/target, including the reason when known.

Do not replace missing values with negative evidence.

### C2 duplicate/familiarity check
Identify repeated task instances, repeated wording and repeated representations. Repetition is not automatically independent evidence.

## 5. C3 — coding reproducibility

### 5.1 Calibration
Before formal coding, coders independently code a calibration set containing clear positives, clear negatives, ambiguous cases, mismatches and alternative explanations.

Calibration disagreements are used to clarify the manual before the frozen coding phase. Changes create a new codebook version.

### 5.2 Double coding
A pre-specified subset of judgment-dependent observations is independently coded by at least two coders. The subset must include variation in claim, task type and expected evidence status rather than only easy cases.

### 5.3 Agreement analysis
Use an agreement statistic appropriate to the actual variable and its distribution.

For categorical evidence status and target match, report at minimum:

- raw agreement;
- the confusion matrix;
- the number of independently coded observations;
- the distribution of categories.

A chance-corrected coefficient may be added when its assumptions are appropriate, but it must not be reported as the sole reliability result. Rare categories, prevalence imbalance and small samples can make a single coefficient misleading.

For ordinal/graded judgments such as provisional quality, report the disagreement distribution and an appropriate ordinal agreement measure only when its assumptions are met.

For free-text or alternative-explanation coding, report category-level agreement plus adjudication patterns; do not reduce the entire coding process to one number.

### 5.4 Disagreement analysis
Every disagreement must be classified, where possible, as one of:

- ambiguous codebook rule;
- insufficient observation information;
- coder error;
- task-design problem;
- genuine evidence ambiguity;
- category definition overlap.

This diagnosis matters because improving a coder is different from improving the measurement model.

### 5.5 Adjudication
Adjudication creates a resolved coding record but never deletes the original independent codes. The adjudicated result is used for the planned evidence analysis only after disagreement has been preserved.

## 6. Evidence observability

For each evidence target calculate descriptively:

- number of observations linked to the target;
- proportion MATCH/MISMATCH/UNCLEAR;
- evidence status distribution;
- quality distribution;
- independence distribution;
- variation coverage;
- contradiction frequency;
- alternative-explanation frequency.

These are descriptive measurement diagnostics, not learner ability scores.

## 7. Evidence quality and independence

Do not collapse quality and independence into one score.

Examples:

- high-quality prompted evidence is still prompted;
- low-quality independent evidence is still independent but weakly interpretable;
- a correct response with no required process evidence may be indeterminate.

The engine may combine these dimensions later under a pre-specified mastery rule, but the pilot analysis keeps them visible separately.

## 8. Variation analysis

For each claim, inspect whether evidence is concentrated in one task form.

Report evidence across the pre-specified variation keys. If support disappears under a reasonable representation/context change, classify that as a finding requiring interpretation, not automatically as learner failure.

A variation effect may indicate:

- construct sensitivity;
- representation-specific knowledge;
- task familiarity;
- language/context effects;
- prompting effects;
- task-design failure.

The pilot does not choose among these explanations without evidence.

## 9. Alternative explanations

For every material alternative explanation, report:

- which observations it affects;
- what evidence would distinguish it from the intended construct;
- whether the pilot collected that evidence;
- whether the alternative remains unresolved.

An unresolved alternative blocks strong interpretation of the affected claim but does not invalidate the entire pilot.

## 10. C4 readiness gate

A claim is **not ready for C4** when any of the following is true:

- evidence target cannot be observed reliably;
- substantial coding ambiguity remains unresolved;
- observations are effectively one-task or one-variation evidence;
- prompting/familiarity cannot be separated from the target construct where relevant;
- critical process evidence is absent;
- provenance is incomplete;
- the candidate developmental distinction cannot yet be contrasted with a simpler explanation.

A claim may be ready for C4 when C1-C3 are sufficiently complete for the intended scope and the dataset contains the variation and evidence needed to test the developmental interpretation.

## 11. What this analysis does not establish

C1-C3 analysis does not establish:

- developmental stages;
- developmental ordering;
- mastery validity;
- causal learning mechanisms;
- curriculum effectiveness;
- generalization across populations or languages.

Those require later empirical work under C4-C10.
