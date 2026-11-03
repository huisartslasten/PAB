# PacoGO Scientific Validation Protocol v0.1

## 1. Purpose and status

This document converts the PacoGO validation data specification into a protocol-level research design. It does **not** claim that PacoGO is scientifically validated. It defines what must be tested before claims about validity, mastery, developmental ordering, next-action quality, learner-state prediction, or Learning Interface effectiveness can be defended.

Scientific status: **scientifically grounded, scientifically designed, empirically testable, not yet scientifically validated**.

The protocol follows an argument-based view of validation: validity concerns the defensibility of intended interpretations and uses, not a one-time property of a test or software system. The 2026 *Educational Measurement* fifth edition describes validation as constructing and evaluating arguments for and against intended score interpretations and uses. The AERA/APA/NCME *Standards for Educational and Psychological Testing* provide the broader assessment-quality framework. See also Kane-oriented validation guidance and the learning-sciences assessment literature.

## 2. Core PacoGO validity argument

For each proposed PacoGO decision, the study program must test a chain of assumptions rather than validating the software against its own outputs:

`learner interaction → observed performance → evidence representation → evidence assessment → inference → decision → educational consequence`

Each link requires empirical support appropriate to the claim. Internal consistency of the software is not evidence that the educational interpretation is valid.

## 3. Research claims to validate

### V1 — Evidence interpretation
PacoGO evidence coding and evidence assessment should represent the intended learner performance and process constructs with acceptable reliability and validity.

### V2 — Developmental ordering
For claims for which PacoGO proposes developmental ordering, observed longitudinal data should support the proposed ordering better than credible alternatives. Cross-sectional association alone is insufficient.

### V3 — Mastery decisions
PacoGO mastery states should correspond to independently established evidence of the learner having acquired the intended construct, while avoiding systematic false mastery and false non-mastery.

### V4 — Next-action decisions
PacoGO next-action decisions should improve or appropriately target subsequent learning relative to credible alternative decision rules. Correctness of the internal rule alone is insufficient.

### V5 — Learner-state representation
PacoGO learner-state variables should predict independently measured subsequent performance/change better than simpler or relevant alternative models, where prediction is an intended use.

### V6 — Learning Interfaces
A Learning Interface should produce measurable learning benefit and/or transfer attributable to its pedagogical mechanism, not merely high usability, engagement, completion, or interaction frequency.

### V7 — Generalisation and fairness
The evidence supporting these claims should generalise across relevant learners, task forms, contexts, languages/cultural settings where applicable, and interface presentations without unacceptable systematic subgroup differences.

## 4. Study sequence

### Phase 0 — Construct and claim audit
Before learner data collection:
- freeze the claim, construct and intended-use definitions for the study;
- identify all assumptions in the validity argument;
- specify primary and secondary outcomes;
- specify credible alternative explanations;
- identify independent measures and external criteria;
- pre-specify exclusion, missingness and stopping rules;
- define the population and intended generalisation scope.

### Phase 1 — Measurement/evidence quality
Purpose: establish that the measurement/evidence layer is sufficiently reliable to support downstream inference.

Minimum components:
- inter-rater reliability for human-coded evidence where applicable;
- test/retest or repeated-measurement reliability where the construct is expected to remain stable;
- measurement error estimation where scores are interpreted quantitatively;
- agreement and adjudication procedures;
- content/construct alignment review;
- response-process investigation where learner strategy/process is part of the claim.

Reliability is treated as measurement precision, not as validity. A highly reliable measure can still measure the wrong construct.

### Phase 2 — Construct and external validity
For each important construct, specify a priori hypotheses involving:
- convergent relationships with independent measures of the same or closely related constructs;
- discriminant relationships with measures of different constructs;
- known-group or developmental contrasts where theoretically justified;
- content alignment and expert review;
- response-process evidence where relevant;
- subgroup/fairness analyses where relevant.

PacoGO must not use its own mastery, next-action, or learner-state outputs as the sole criterion for validating those same outputs.

### Phase 3 — Longitudinal development / C5
A minimum of three substantively meaningful time points is required for a C5 developmental-ordering analysis. Two time points may establish repeated measurement and temporal association but do not by themselves establish developmental ordering.

The longitudinal design must specify:
- learner identity across waves;
- construct-equivalent or appropriately linked measurements;
- timing and spacing rationale;
- task-form variation;
- prior instruction/exposure;
- practice/retest effects;
- attrition and missingness;
- alternative developmental models;
- model-comparison criteria;
- measurement invariance or equivalent comparability checks where required.

Ordering is supported only when longitudinal evidence distinguishes the proposed ordering from credible alternatives. It must not be inferred from correlation, task difficulty, or registry order alone.

### Phase 4 — Mastery validation / C6
For each mastery rule, compare PacoGO decisions with an independently designed external criterion or composite criterion appropriate to the construct.

Evaluate at minimum:
- false mastery;
- false non-mastery;
- uncertainty/insufficient-evidence behaviour;
- stability across repeated observations;
- sensitivity to task variation;
- independence from prompting and instruction exposure;
- subgroup/fairness patterns;
- consequences of erroneous decisions.

Thresholds and acceptable error trade-offs must be pre-specified per intended use rather than chosen after observing results.

### Phase 5 — Next-action validation / C7
Next-action validation requires a prospective design because the question concerns what happens after a decision.

Preferred design family:
- randomised or strong quasi-experimental comparison of PacoGO next-action policy against one or more credible alternatives;
- independent pre/post or longitudinal learning outcomes;
- outcome measures that are not identical to the decision rule's internal evidence;
- analysis that accounts for baseline differences and repeated observations.

Primary question: does the PacoGO decision policy produce better targeted subsequent learning than the comparison policy, under the intended use conditions?

A next action is not validated merely because it follows the curriculum ordering correctly.

### Phase 6 — Learner-state validation / C8
Learner-state variables should be evaluated prospectively against independently measured subsequent outcomes.

Analyses should compare:
- PacoGO learner-state model;
- simple baseline model(s);
- relevant alternative state models.

The study must report calibration/discrimination or other model-appropriate predictive performance, uncertainty, missingness sensitivity, subgroup performance, and temporal generalisation. Overfitting and leakage from future observations must be explicitly prevented.

### Phase 7 — Learning Interface validation
Each Learning Interface study must distinguish at least:
1. usability/interaction quality;
2. immediate task performance;
3. retention;
4. transfer/generalisation;
5. possible mechanism-specific effects.

An interface is not considered educationally effective solely because learners prefer it, spend longer with it, complete more interactions, or make fewer interface errors.

Where feasible, compare the interface mechanism against a credible alternative representation or instructional condition while holding the target learning objective constant.

## 5. Required independent measures

The validation program must maintain a separation between:
- PacoGO process data;
- PacoGO evidence assessments;
- PacoGO decisions;
- external outcome measures.

External measures should be selected independently of PacoGO's internal scoring logic and should be appropriate to the target construct. Where no established external criterion exists, the protocol must explicitly justify a multi-method criterion rather than treating PacoGO's own output as ground truth.

## 6. Analysis principles

All confirmatory analyses should have a pre-specified analysis plan covering:
- estimand/primary research question;
- population and inclusion criteria;
- unit of analysis;
- clustering/repeated-measure structure;
- missing-data handling;
- covariates and confounders;
- primary and secondary outcomes;
- model specification;
- uncertainty intervals;
- multiplicity where applicable;
- sensitivity analyses;
- subgroup analyses where justified;
- criteria for supporting, weakening, or rejecting the proposed claim.

Exploratory findings must be labelled exploratory and must not silently become product rules.

## 7. Sample-size and power requirements

No universal sample size is fixed in this protocol. Sample size must be determined per study from the primary estimand, expected effect or precision target, design, clustering, number of repeated observations, attrition, model complexity and subgroup requirements.

For C5 and other longitudinal models, power/precision must account for repeated measures and the fact that learners, not observations, are the independent sampling units for many questions.

For decision-validation studies, sample-size planning must consider classification error and the precision required around clinically/educationally meaningful error rates or effect estimates.

## 8. Reproducibility and governance

Each confirmatory study should have:
- frozen protocol version;
- versioned curriculum/registry;
- versioned task/interface definitions;
- immutable analysis dataset snapshot;
- pre-specified analysis code/version;
- documented deviations;
- audit trail from observation to reported result;
- separation between development data and validation data where model development creates leakage risk.

Where scientifically appropriate, preregistration should precede confirmatory analysis.

## 9. Child-data, privacy and ethics

Because PacoGO is intended for learners who may be children, research data collection must be purpose-limited and proportionate.

The research protocol must define:
- lawful/ethical basis for collection;
- parental/guardian consent and child assent requirements as applicable;
- data minimisation;
- retention periods;
- access controls;
- pseudonymisation/de-identification;
- separation of product operations from research datasets where appropriate;
- handling of sensitive or unexpected findings;
- withdrawal procedures;
- governance for secondary use;
- security and breach procedures.

Research-critical fields must not be collected merely because the platform can technically collect them.

## 10. Decision gates

A scientific result must not automatically change the PacoGO engine.

### Gate A — Measurement adequacy
Evidence quality/reliability is adequate for the intended inference.

### Gate B — Construct/validity adequacy
Evidence supports the intended interpretation and relevant alternatives have been considered.

### Gate C — Decision adequacy
Mastery/next-action/state decisions demonstrate the required external performance for their intended use.

### Gate D — Generalisation/fairness adequacy
The result is sufficiently robust across the intended population and relevant contexts.

### Gate E — Product adoption decision
Only after A–D, with documented uncertainty and consequences, may a research finding be considered for a curriculum-engine rule change.

A failed gate does not justify patching the engine to make the result pass. It triggers a scientific/design investigation and a new versioned protocol or construct specification.

## 11. Interpretation language

Allowed before empirical validation:
- scientifically grounded;
- scientifically designed;
- empirically testable;
- candidate model;
- candidate developmental ordering;
- proposed mastery rule;
- proposed next-action policy.

Not allowed without corresponding empirical evidence:
- scientifically validated;
- proven learning effect;
- validated developmental sequence;
- validated mastery classifier;
- validated next-action policy.

## 12. Evidence base used for protocol design

The protocol is informed by contemporary educational measurement and assessment literature, including:

- Lane & Marion (2026), *Educational Measurement*, 5th ed., chapter on Validity and Validation. The chapter treats validity as an argument concerning interpretation and use and emphasises that validation is cumulative rather than a binary certification.
- AERA, APA, NCME (2014), *Standards for Educational and Psychological Testing*. These standards frame validity, reliability/precision and fairness as central to defensible assessment.
- Cook et al. / Kane-oriented assessment validation literature: validation requires explicit claims, assumptions and empirical evidence supporting or challenging the intended decision use.
- Pellegrino (2022), learning-sciences perspective on assessment: assessment is reasoning from evidence and should be connected to models of learning and validity.
- COSMIN measurement-property framework, used here only as a methodological analogy for explicit treatment of reliability, measurement error, construct validity and responsiveness. COSMIN was developed for health measurement instruments and is not adopted as a PacoGO-specific educational standard.

## 13. Next research work

Before locking PacoGO's final empirical validation program:
1. perform construct-specific literature reviews for A1, B1 and FR2;
2. identify suitable independent/external measures for each claim family;
3. specify candidate longitudinal designs and estimands for C5;
4. specify mastery decision-validation designs for C6;
5. specify prospective policy-comparison designs for C7;
6. specify predictive validation designs for C8;
7. specify controlled learning/transfer studies for Learning Interfaces;
8. conduct formal sample-size/power/precision planning;
9. define preregistration and analysis-plan requirements;
10. obtain appropriate ethics/privacy review before child-data collection.

This protocol remains v0.1 until those study-specific specifications have been completed and reviewed.