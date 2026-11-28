# PacoGO A1 — Population & Instrument Selection Record v0.1

## 1. Purpose

This record converts the A1 preregistration-readiness specification into an evidence-based selection decision without inventing unresolved study parameters.

Scientific status: **selection framework with conditional recommendations; not yet a frozen population/instrument protocol**.

The rule is simple: a study parameter is frozen only when the construct, target population, administration context and measurement properties justify the choice.

## 2. Population evidence boundary

The current A1 repository materials define the construct and task architecture but do not define an exact learner age, grade, administration language or recruitment population. Therefore these parameters must not be inferred from the curriculum JSON or from the candidate TEMA-3 instrument.

The literature nevertheless gives a useful feasibility envelope for the construct:

- Number-line estimation has been studied across a broad developmental range; a major meta-analysis covered samples with mean ages from 4 to 14 years and found a robust association with broader mathematical competence. The association was stronger for fractions than whole numbers. citeturn345386search4
- A 3-year longitudinal study followed children aged 5–8 years with number-to-position tasks every six months and found reciprocal longitudinal relations between number-line acuity and mathematics performance. citeturn345386search9
- Longitudinal work on number comparison has included children around the start of formal schooling; one study with a mean age of 6 years 4 months found that numerical magnitude comparison predicted later mathematics achievement independently of age, intellectual ability and number-identification speed. citeturn345386search1
- Recent large longitudinal work also shows that competing developmental accounts can fit adequately in isolation, reinforcing the PacoGO requirement to compare alternative developmental models rather than assuming one direction. citeturn345386search12

### Decision

Use **early-primary / early-number-development populations as the feasibility envelope**, but do not freeze an exact age or grade until the intended PacoGO learner population and the final independent measures are explicitly selected.

This is a research-design boundary, not a registry claim.

## 3. Administration-language decision

The repository currently contains Dutch-language curriculum definitions and task descriptions, but this alone is insufficient evidence for the language of a validation study.

Language must be frozen from the actual study population and administration context. The A1 design should retain language-reduced task variants where possible because the study explicitly needs to distinguish representational competence from unnecessary language-comprehension demands.

### Decision

**No language is frozen at v0.1.** The preregistration must state the exact administration language and justify translation/adaptation procedures if an external instrument is not originally validated in that language.

## 4. Independent-measure selection

### 4.1 Number-line estimation — retain

Retain as a primary candidate external numerical-magnitude measure.

Evidence supports its relevance: meta-analytic work confirms a relation with mathematics competence, including after controlling for general cognitive ability, although the adjusted relation is smaller. citeturn345386search0

The measure must not be treated as a pure measure of A1 because number-line performance can depend on ordinal knowledge, scaling and task-format characteristics. Recent work continues to show that different components of number-line performance can reflect different underlying skills. citeturn345386search7turn345386search10

### 4.2 Independent numerical-magnitude comparison — retain

Retain as a second candidate because it provides convergent numerical-magnitude evidence through a response format distinct from PacoGO's mapping tasks.

Longitudinal studies support its predictive relevance for later mathematics achievement, while other developmental work shows that symbolic and non-symbolic comparison can make different contributions. citeturn345386search1turn345386search5

The exact symbolic/non-symbolic form must remain open until population and construct-discrimination requirements are frozen.

### 4.3 Broad mathematics criterion — retain as required external criterion

A broad mathematics measure remains necessary because A1 construct validity cannot be established solely against closely related numerical-magnitude tasks.

TEMA-3 is a plausible candidate for an early-childhood population because published product information places its age range at 3–8 years 11 months and describes coverage of numbering, number comparison, numeral literacy, number facts, calculation and mathematical concepts. citeturn345386search16

However, it is a commercial instrument and its licensing, language suitability and population fit have not been verified for the intended study.

### Decision

TEMA-3 remains **conditional**, not frozen.

### 4.4 Non-symbolic quantity comparison — conditional

Non-symbolic comparison should not automatically be added merely because it is common in the literature. Evidence indicates that its relation to mathematics can depend on fluency and other task characteristics. citeturn345386search13

Include it only if the final construct model requires discrimination between symbolic representational mapping and more general quantity processing.

## 5. Candidate measurement package

The strongest current package is therefore:

1. **PacoGO A1 task battery** — construct-specific evidence.
2. **Number-line estimation** — convergent numerical-magnitude evidence.
3. **Independent magnitude comparison** — convergent evidence with a different response format.
4. **Broad mathematics criterion** — external criterion for broader competence.
5. **Optional non-symbolic comparison** — only if needed for discriminant interpretation.

No component is considered a gold standard.

## 6. Longitudinal schedule evidence

The literature supports repeated measurement but does not justify importing one universal interval into PacoGO.

Examples include:
- every six months in a 3-year study of ages 5–8; citeturn345386search9
- four occasions at three-month intervals in a longitudinal study of 5-year-olds; citeturn345386search11
- two waves separated by eight months in preschool children. citeturn345386search2

### Decision

Retain the existing **minimum three meaningful waves**, but select the exact interval only after the target population, school calendar and expected developmental change are frozen.

## 7. What is now narrowed

The evidence review reduces the measurement search space substantially:

- number-line estimation: **retain**;
- independent magnitude comparison: **retain**;
- broad mathematics criterion: **required; exact instrument conditional**;
- non-symbolic quantity comparison: **conditional**;
- exact age/grade: **not frozen**;
- administration language: **not frozen**;
- exact task forms/scoring: **not frozen**;
- wave spacing: **not frozen**.

## 8. Freeze gate

A1 may move from this record to a formal population/instrument freeze only when all of the following are documented:

1. intended learner population is explicitly selected;
2. administration language is explicitly selected;
3. exact number-line task form and scoring are selected;
4. exact magnitude-comparison task form and scoring are selected;
5. broad mathematics criterion is selected and licensing/permission is confirmed;
6. translation/adaptation requirements are resolved;
7. administration burden is feasible for all waves;
8. primary estimands can be stated against the selected measures;
9. the resulting package supports the required construct/discriminant validity questions;
10. power/precision assumptions can be justified from the selected design.

## 9. Scientific conclusion

The correct outcome of this block is **not** an invented frozen population. The evidence supports a defensible early-number-development feasibility envelope and a narrowed external-measure package, while the exact population, language and instruments remain explicit decision variables.

The next block is therefore **formal population selection + exact instrument feasibility/licensing review**, followed by the power/precision analysis. Only then should the A1 preregistration document freeze numerical study parameters.
