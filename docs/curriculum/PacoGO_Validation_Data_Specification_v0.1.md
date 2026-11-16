# PacoGO Scientific Validation Data Specification v0.1

## Status

Candidate research specification. This document defines what PacoGO would need to measure to empirically validate its scientific claims. It does not establish that those claims are currently validated.

## 1. Scientific boundary

PacoGO is currently scientifically grounded, scientifically designed and empirically testable. It is **not yet scientifically validated**.

The validation program must independently test whether:

- curriculum/development claims correspond to observable learner constructs;
- evidence coding is reliable;
- discriminating tasks distinguish relevant developmental models and alternatives;
- developmental ordering claims hold longitudinally;
- mastery decisions agree with defensible external criteria;
- next-action decisions improve subsequent learning or appropriately identify prerequisites;
- learner-state representations predict later outcomes without circular validation;
- Learning Interfaces support learning, transfer and appropriate evidence capture.

PacoGO must not validate itself solely against its own outputs.

## 2. Data classes

### A. Product-functionality data

Required to operate the learning product:
- learner/session identifiers;
- task/interface state;
- learner actions needed for immediate interaction;
- task completion and response state;
- technical quality needed to interpret an interaction.

### B. Curriculum-engine data

Required for evidence and decision logic:
- task/development/claim identifiers;
- task variation;
- interaction events relevant to the evidence target;
- performance/process status;
- prompt and instruction exposure;
- evidence-quality indicators;
- contradiction and alternative-explanation flags;
- repeated observations when stability or ordering is assessed.

### C. Scientific-validation data

Collected only when tied to a pre-specified research question:
- independent/external measures of the relevant construct;
- reliability observations and independent codings;
- longitudinal measurement occasions;
- comparison/control conditions where required;
- transfer outcomes;
- external learning outcomes;
- intervention exposure and fidelity;
- relevant confounders and contextual variables;
- missingness and attrition information;
- research-governance metadata.

### D. Data that should not be collected by default

Do not collect personal, behavioural or interaction data merely because they are technically available. A variable requires a defensible product, curriculum or research purpose, a defined retention need and an appropriate privacy/ethics basis.

## 3. Validation map

| Scientific question | Hypothesis | Construct | Required variable/data | Source | Measurement moment | Analysis | Validation criterion | Interpretation |
|---|---|---|---|---|---|---|---|---|
| Does each claim correspond to an observable construct? | Targeted tasks elicit evidence that differs from major alternatives. | Construct representation | Task response, process evidence, variation, alternative flags, external construct measure | PacoGO + independent measure | Baseline and task administrations | Construct validity; convergent/discriminant analyses | Pre-specified evidence pattern and acceptable relation to external measure | Supports, contradicts or leaves claim indeterminate |
| Can evidence be coded reliably? | Independent coders reach reproducible decisions. | Evidence-coding reliability | Double-coded observations, coder IDs, coding dimensions, adjudication | PacoGO research coding | Same observation | Agreement and appropriate reliability coefficients | Pre-specified reliability threshold justified for each coding dimension | Coding suitable or unsuitable for further inference |
| Do discriminating tasks distinguish candidate models? | Task patterns fit the intended model better than specified alternatives. | Developmental measurement | Multiple task forms, variation, process evidence, performance | PacoGO + external task comparison where available | W1 and subsequent waves | Measurement/model comparison | Pre-specified model-fit/discrimination criteria | Candidate model supported, contradicted or unresolved |
| Does developmental ordering hold over time? | Earlier development predicts later development beyond alternatives. | Developmental ordering | Repeated observations, time points, baseline ability, relevant covariates, external outcomes | PacoGO + external measures | At least two justified time points; preferably more for longitudinal models | Longitudinal/model-comparison analyses | Ordering survives alternative explanations and pre-specified robustness checks | Ordering supported only within studied scope; not automatically causal |
| Are prerequisite claims defensible? | Earlier state adds predictive/explanatory value beyond simpler alternatives. | Prerequisite relation | Longitudinal development measures, prior performance, alternative predictors | PacoGO + external measures | Multiple waves | Predictive/model comparison and sensitivity analyses | Incremental evidence meets pre-specified criterion | Candidate prerequisite supported, contradicted or unresolved |
| Does PacoGO mastery agree with an external criterion? | Mastery decisions correspond to independent evidence of competent performance. | Mastery/competence | PacoGO mastery state plus independent assessment | PacoGO + independent assessor/criterion | Decision point and validation window | Agreement, sensitivity/specificity or other justified criterion analyses | Criterion and uncertainty thresholds pre-specified before analysis | Mastery rule supported, revised or unresolved |
| Does mastery generalise across contexts? | Mastery predicts performance under novel but construct-relevant conditions. | Transfer/generalisation | Novel-task performance, context variation, transfer task results | Independent transfer tasks + PacoGO | After mastery decision | Transfer and subgroup analyses | Pre-specified transfer criterion | Evidence of generalisation or context-bound performance |
| Does the next action improve subsequent learning? | Learners receiving the selected next action show better subsequent outcomes than an appropriate comparison. | Instructional decision quality | Next-action decision, action exposure, fidelity, later learning outcome, baseline state | PacoGO + independent outcome | Decision, intervention window, follow-up | Experimental/quasi-experimental comparison | Pre-specified effect/decision-quality criterion | Next-action policy supported, ineffective or uncertain |
| Does the learner-state model predict later development? | State variables predict future outcomes beyond baseline and simple alternatives. | Longitudinal learner state | State history, prior evidence, later external outcome, exposure/context variables | PacoGO + external outcome | Repeated waves | Longitudinal predictive validation | Pre-specified calibration/discrimination/generalisation criteria | State model useful, limited or unsupported |
| Do Learning Interfaces cause learning gains rather than only engagement? | Interface-supported learning improves construct-relevant outcomes versus an appropriate comparison. | Learning effectiveness | Interface condition, exposure/fidelity, pre/post learning, transfer, usability as secondary variable | PacoGO + independent assessment | Pre, post and follow-up | Controlled comparison and mediation/moderation where justified | Pre-specified learning and transfer criteria | Interface supports learning, not merely usability |
| Does evidence capture remain valid across interface variants? | Equivalent construct interactions produce comparable evidence patterns across presentation variants. | Measurement invariance / interface equivalence | Interface variant, interaction/process evidence, performance, context | PacoGO | Across variants and relevant learner groups | Invariance/equivalence analyses where justified | Pre-specified invariance/equivalence criterion | Evidence contract is robust or interface-specific limitations identified |
| Does the system generalise beyond the first construction case? | Findings replicate across skills/domains/populations under pre-specified conditions. | Generalisability | Same core variables across A1, B1, FR2 and later domains; independent outcomes | PacoGO + external validation samples | Replication studies | Replication and heterogeneity analyses | Pre-specified replication criterion | Generalises, requires scope restriction or fails replication |

## 4. Reliability program

Reliability must be assessed separately for:

1. human coding reliability;
2. repeated-measurement stability where relevant;
3. technical event capture reliability;
4. task administration consistency;
5. external assessment reliability.

A single aggregate reliability number is insufficient. Reliability thresholds must be justified by the decision or research use of the measure.

## 5. External validation requirements

For high-stakes scientific claims, PacoGO needs measures that are not derived from the same evidence-processing chain being validated. Appropriate external criteria may include:

- independent expert scoring;
- established assessments where construct alignment is defensible;
- independently designed transfer tasks;
- later learning outcomes;
- independently administered developmental measures.

The final choice must be established by construct-specific research review rather than assumed globally.

## 6. Longitudinal requirements

A single observation cannot validate developmental ordering, prerequisite status or longitudinal learner-state claims.

For C5-related questions, the design must pre-specify:

- number and spacing of measurement occasions;
- learner inclusion/exclusion rules;
- exposure and intervention history;
- baseline measures;
- missingness and attrition handling;
- alternative developmental models;
- robustness/sensitivity analyses;
- what evidence would count as support, contradiction or indeterminacy.

Prediction alone must not be interpreted as prerequisite or causal evidence.

## 7. Mastery validation

C6 mastery rules must be validated externally rather than by checking whether future PacoGO decisions agree with previous PacoGO decisions.

Validation should examine:

- agreement with independent competence criteria;
- false-positive and false-negative consequences;
- stability across repeated observations;
- transfer beyond trained task surfaces;
- subgroup/context differences;
- uncertainty and insufficient-evidence states.

## 8. Next-action validation

C7 requires a decision-quality study, not merely a prediction study.

Where feasible, evaluate selected next actions against appropriate comparison conditions while controlling or accounting for baseline state, exposure, instructional fidelity and relevant confounders. Outcomes should include subsequent learning and transfer, not only immediate task completion.

## 9. Learning Interface validation

Interface research must distinguish:

- usability;
- engagement;
- immediate performance;
- learning gain;
- retention;
- transfer;
- evidence-capture validity.

A visually attractive or easy-to-use interface is not thereby a validated learning instrument.

## 10. Privacy, child data and governance

Research involving children requires explicit governance before collection. The protocol must determine:

- lawful basis and consent/assent requirements;
- data minimisation;
- pseudonymisation and access control;
- retention periods;
- deletion procedures;
- separation of product analytics from research datasets;
- handling of incidental or sensitive information;
- researcher access and auditability;
- preregistration/ethics requirements where applicable.

No research variable should be added merely because future analysis might be interesting.

## 11. Analysis and interpretation rules

Before confirmatory data analysis, the study must pre-specify:

- primary outcomes;
- secondary outcomes;
- inclusion/exclusion criteria;
- missing-data strategy;
- model specification;
- multiplicity handling where relevant;
- effect-size and uncertainty reporting;
- stopping rules where relevant;
- replication criteria;
- interpretation boundaries.

Results must allow `SUPPORTS`, `CONTRADICTS`, `INDETERMINATE` and `REVISE` outcomes. Absence of evidence must not automatically become evidence against a developmental claim.

## 12. Interface data-contract consequence

Before the Learning Interface System runtime contract is frozen, every evidence-bearing interaction must have a clear mapping to:

`interaction → observable event → evidence target → coding dimension → validation dataset field`

The interface must capture only what is needed for the intended learning and validation purposes, while preserving enough provenance to distinguish learner behaviour from prompts, technical failures, task variation and interface presentation.

## 13. Next research phase

This specification is a design baseline, not the final empirical protocol. The next scientific-validation phase should review the literature and construct-specific measurement requirements, then convert this specification into protocol-level study designs, including sample-size/power considerations, preregistration plans, independent measures, analysis plans and ethics/governance.
