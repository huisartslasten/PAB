# PacoGO Construct-Specific Validation Design v0.1

## 1. Status

This document is the first construct-specific layer below `PacoGO_Scientific_Validation_Protocol_v0.1.md`.

It is a **research design baseline**, not empirical validation and not a product-rule specification.

The purpose is to prevent PacoGO from freezing Learning Interface evidence contracts before the scientific meaning of the evidence has been specified.

Scientific status: **grounded → designed → testable; not validated**.

## 2. Design principles established by the literature review

1. **Validate interpretations, not the software itself.** The intended interpretation and use of a measure/decision must be supported by multiple forms of evidence; reliability is necessary but not sufficient. The AERA/APA/NCME Standards provide the overarching educational measurement framework.
2. **Use independent measures.** PacoGO outputs cannot be the sole criterion used to validate PacoGO outputs.
3. **Treat task performance as construct-plus-method.** A task can reflect strategy, response demands, prior instruction and surface features in addition to the intended construct. This is especially important for number-line tasks, where bounded and unbounded formats can produce different strategic demands.
4. **Plan longitudinal studies around learners, not rows.** Repeated observations require models and power calculations that account for within-learner dependence, attrition and the number/timing of measurement occasions.
5. **Pre-specify confirmatory decisions.** Planned confirmatory hypotheses, estimands, exclusion rules and analyses should be frozen before confirmatory analysis; exploratory analyses remain explicitly exploratory.
6. **Do not import thresholds blindly.** Reliability and validity thresholds are decision- and construct-dependent. Generic thresholds can be useful starting points, but PacoGO decisions require construct-specific justification.

## 3. A1 — Getallen representeren en verbinden

### 3.1 Construct map

A1 contains three developments:

| Development | Construct focus | Primary evidence problem |
|---|---|---|
| A1.D1 | Representational meaning | Can the learner connect a numerical value with an appropriate representation/quantity/position? |
| A1.D2 | Mapping | Can the learner preserve numerical value while moving between representations? |
| A1.D3 | Coordination | Can the learner coordinate multiple representations independently and explain/justify the relation? |

The current A1 curriculum content explicitly requires identify/place/match/explain for D1, match/transform/compare/explain for D2, and select/combine/translate/justify for D3. Evidence must capture actions and independence rather than final correctness alone. This is consistent with the existing A1 reference design. fileciteturn263file0

### 3.2 Primary construct hypotheses

**A1-H1 — Representation mapping:** performance across independently designed symbolic, quantity and spatial representations will show positive convergent relationships while remaining distinguishable from unrelated task demands.

**A1-H2 — Invariance under surface variation:** if the target numerical relation is preserved while visual/surface form changes, construct-relevant performance should remain substantially stable after accounting for task difficulty.

**A1-H3 — Process evidence:** learner actions/process indicators will provide incremental information about the target construct beyond final-answer correctness alone, where process capture is theoretically relevant.

**A1-H4 — Development:** over repeated substantively meaningful occasions, improvement in A1 constructs should be distinguishable from simple familiarity with one fixed task form.

**A1-H5 — Transfer:** stronger A1 performance should generalise to an independently designed numerical-representation task not used in the PacoGO training/evidence pathway.

### 3.3 Independent/external measures to evaluate

No single external measure is frozen yet. The study design should use a **multi-method criterion set** selected after construct-specific review.

Candidate families for A1 are:

- independent number-line magnitude tasks, with bounded and/or unbounded forms selected according to the construct and age range;
- symbolic-to-quantity matching tasks;
- quantity-to-symbol tasks;
- comparison/ordering tasks using novel surface forms;
- broader mathematics achievement measures appropriate to the learner population;
- where theoretically justified, independent measures of spatial/magnitude reasoning.

Number-line performance has substantial empirical relations with broader mathematics performance, but the literature also shows that task format and strategy can influence what the task measures. Therefore PacoGO should not treat one number-line score as a pure gold standard for A1. citeturn214230search0turn214230search2turn214230search12

### 3.4 A1 measurement study

**Purpose:** establish reliability, measurement error, construct alignment and initial external validity before using A1 evidence to validate downstream mastery/next-action rules.

**Minimum design:**
- independent human coding for process/independence fields where coding is required;
- repeated measurement on a subset when the construct is expected to be sufficiently stable over the retest interval;
- at least two substantially different task forms;
- independent external measures not generated by the same PacoGO evidence pipeline;
- pre-specified missingness and exclusion rules;
- subgroup/fairness checks appropriate to the intended learner population.

**Reliability:**
- categorical coding → appropriate agreement statistic such as weighted/unweighted kappa or another justified coefficient;
- continuous scores → ICC model selected from the design, with agreement vs consistency explicitly justified;
- measurement error → report an absolute error measure where a quantitative score is interpreted;
- reliability is reported with uncertainty, not as a single unqualified coefficient.

COSMIN's measurement framework is used here as a methodological reference only. It prefers ICCs for continuous test-retest reliability and distinguishes agreement from consistency; it also illustrates that thresholds such as 0.70 are conventions rather than substitutes for construct-specific judgement. COSMIN is not adopted as a PacoGO educational standard. citeturn241279search43turn241279search44

### 3.5 A1 longitudinal design

A1 developmental-ordering validation must use repeated observations with substantively meaningful spacing. Three or more time points are the minimum design boundary inherited from the PacoGO W2/C5 contract; the actual number and spacing must be justified from the hypothesised developmental process, instructional calendar and expected rate of change.

The longitudinal analysis should compare:
- the proposed A1 ordering model;
- plausible alternative orderings;
- models with no developmental ordering where appropriate.

The analysis must account for within-learner dependence, missingness/attrition, task-form changes, prior exposure and practice/retest effects.

Number-line literature demonstrates why this matters: apparently developmental changes can partly reflect changes in strategy or task demands rather than a change in the underlying construct. citeturn214230search2turn214230search9turn214230search12

### 3.6 A1 mastery validation

For each A1 mastery rule, the criterion study must compare PacoGO's decision with an independently constructed criterion.

Primary outcomes should include:
- false mastery rate;
- false non-mastery rate;
- proportion classified as insufficient evidence;
- decision stability across repeated observations;
- performance on novel task forms;
- independent transfer performance.

Thresholds must be selected before confirmatory analysis according to the educational consequence of each error. A generic statistical threshold is not sufficient justification for a mastery decision.

### 3.7 A1 Learning Interface validation

For the Number Line and Quantity/Number Representation interfaces, distinguish:

1. interface usability/interaction quality;
2. immediate target performance;
3. retention;
4. transfer to an independent representation/task;
5. mechanism-specific evidence, such as whether the interface actually supports the intended mapping/coordination process.

A successful interaction rate or learner preference is not evidence of learning effectiveness by itself.

## 4. B1 — Optellen

B1 remains a candidate generalisation case. No empirical promotion is implied.

### 4.1 Construct map

| Development | Construct focus |
|---|---|
| B1.D1 | Samenvoegen begrijpen |
| B1.D2 | Optelling als getalrelatie uitvoeren |
| B1.D3 | Strategisch en flexibel optellen |
| B1.D4 | Geïntegreerd optellen |

### 4.2 Required construct-specific review before protocol freeze

The B1 review must distinguish at least:
- conceptual understanding of addition;
- procedural execution;
- strategy selection/flexibility;
- fluency/speed, where relevant;
- word-problem/application performance;
- transfer to novel representations.

Independent measures should therefore not collapse B1 into a single arithmetic-correctness score.

The early-numeracy literature supports separating non-symbolic/conceptual arithmetic from symbolic arithmetic because they can place different demands on learners. citeturn214230search1

### 4.3 Candidate external-measure families

- independently administered conceptual addition tasks;
- symbolic calculation tasks with novel item forms;
- strategy/process probes;
- untimed and, only where theoretically justified, timed fluency measures;
- independent addition/subtraction or mathematics achievement measures;
- transfer/application problems.

An established assessment battery may be used where its construct coverage and age range match the PacoGO construct; instrument selection must be documented rather than assumed.

## 5. FR2 — Breukequivalentie herkennen en gebruiken

FR2 remains a candidate generalisation case. No empirical promotion is implied.

### 5.1 Construct map

| Development | Construct focus |
|---|---|
| FR2.D1 | Equivalentie herkennen |
| FR2.D2 | Equivalentie verklaren |
| FR2.D3 | Equivalentie functioneel gebruiken |

### 5.2 Required construct-specific review before protocol freeze

The FR2 review must distinguish:
- perceptual recognition of visually equivalent representations;
- symbolic equivalence;
- conceptual explanation of why two fractions are equivalent;
- transformation/strategy use;
- transfer to unfamiliar representations and contexts.

The validation design must avoid making a correct symbolic transformation the sole criterion for conceptual equivalence understanding.

### 5.3 Candidate external-measure families

- independent fraction-equivalence recognition tasks;
- explanation/justification tasks scored with an independently developed rubric;
- fraction magnitude/comparison tasks;
- number-line fraction tasks where construct-relevant;
- transfer tasks using unfamiliar representations;
- broader fraction/mathematics achievement measures appropriate to the learner population.

## 6. Sample-size and precision policy

PacoGO will **not** adopt one universal participant number for A1/B1/FR2.

Each confirmatory study must specify:

`primary estimand → analysis model → target effect or precision → alpha/confidence level → power or precision target → repeated-measure structure → clustering → expected attrition → final recruitment target`

For longitudinal designs, sample-size calculations must reflect the intended repeated-measures model and correlation structure. If analytic formulas are inadequate, simulation-based power/precision analysis should be used and the simulation assumptions archived. citeturn241279search4turn241279search7

For measurement-property studies, precision for the reliability/measurement-error estimate may be more informative than an arbitrary participant count. COSMIN explicitly provides study-design and sample-size guidance for reliability/measurement-error studies. citeturn241279search11

Attrition must be incorporated into recruitment planning rather than treated only as a post-hoc reporting issue. citeturn241279search4turn241279search10

## 7. Confirmatory vs exploratory boundary

Before data collection or before opening confirmatory data:

**Confirmatory:**
- primary construct hypothesis;
- primary external criterion;
- primary estimand;
- primary model;
- decision thresholds;
- missingness/exclusion rules;
- multiplicity strategy;
- subgroup analyses that are sufficiently justified in advance.

**Exploratory:**
- unexpected task interactions;
- alternative model discovery;
- unplanned subgroup patterns;
- novel process features;
- new candidate developmental pathways.

Exploratory findings may generate the next protocol, but they do not silently become PacoGO engine rules. Preregistration is the preferred mechanism for freezing confirmatory plans before confirmatory analysis. citeturn241279search3

## 8. Ethics, child data and governance

Before any real learner validation study:
- define the research purpose separately from normal product operation;
- minimise research data to fields required by the protocol;
- define parental/guardian consent and child assent requirements according to the applicable jurisdiction and study setting;
- pseudonymise research identifiers;
- define retention and deletion rules;
- define access and audit controls;
- define withdrawal procedures;
- separate development/debug data from confirmatory research data where feasible;
- predefine handling of unexpected learner findings;
- obtain appropriate independent ethics/privacy review before collection.

No Learning Interface event should be collected merely because it is technically available.

## 9. Research decision gates

### Gate 1 — Construct readiness
Construct definition and independent measure set are sufficiently specified.

### Gate 2 — Measurement readiness
Reliability, measurement error and task comparability are adequate for the intended inference.

### Gate 3 — External validity readiness
Independent evidence can test the intended interpretation without circularity.

### Gate 4 — Longitudinal readiness
The timing, task variation, model comparison and power/precision plan can distinguish the proposed developmental interpretation from credible alternatives.

### Gate 5 — Decision readiness
Mastery/next-action/state decisions have an independently testable outcome and pre-specified error consequences.

### Gate 6 — Interface validation readiness
The interface study can separate usability, immediate performance, retention, transfer and mechanism-specific effects.

Failure at any gate means **stop and redesign the scientific specification**. It does not justify changing engine thresholds or tests merely to obtain a pass.

## 10. Consequence for the Learning Interface runtime contract

The runtime contract should remain evidence-capable but **not yet freeze construct-specific scientific fields that have not passed Gate 1**.

The stable lower-level event structure can capture:
- learner/task/interface identity;
- action/event sequence;
- observable response;
- timing where scientifically justified;
- prompt/help state;
- task/form variation;
- evidence-target identifier;
- provenance/version.

Construct-specific derived variables, mastery thresholds and scientific interpretation remain outside the interface renderer and must be versioned at the curriculum/evidence-analysis layer.

This preserves the architecture:

`interaction → observable event → evidence target → coding dimension → validation dataset field`

without prematurely turning an interface event into a scientific conclusion.

## 11. Next phase

The next research block is **not** to implement Learning Interface runtime logic.

It is to complete the A1 construct review and produce a study-ready protocol containing:
- exact age/population scope;
- exact independent measures;
- exact primary hypotheses and estimands;
- measurement occasions and spacing;
- reliability design;
- longitudinal model candidates;
- mastery criterion design;
- sample-size/power/precision analysis;
- preregistration plan;
- ethics/privacy/governance plan;
- confirmatory/exploratory separation.

B1 and FR2 should then receive the same treatment before any candidate is empirically promoted.

## 12. Evidence base

- AERA, APA, NCME. *Standards for Educational and Psychological Testing* (2014). The Standards provide the overarching framework for validity, reliability/precision and fairness in educational testing. citeturn241279search0turn241279search45
- COSMIN. *Manual for systematic reviews of outcome measurement instruments, Version 2.0* and measurement-property criteria. Used as methodological guidance for reliability/measurement-error design, not as a PacoGO-specific educational standard. citeturn241279search43turn241279search44
- Recent meta-analytic evidence indicates that number-line performance is related to mathematics outcomes, while construct interpretation remains sensitive to task demands and strategy. citeturn214230search0turn214230search2
- Longitudinal/repeated-measures methodology requires design-specific power/precision planning, explicit correlation assumptions and attrition planning. citeturn241279search4turn241279search7
- OSF guidance supports preregistration to distinguish planned confirmatory work from exploratory analysis. citeturn241279search3
