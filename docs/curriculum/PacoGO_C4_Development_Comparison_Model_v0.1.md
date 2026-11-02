# PacoGO Curriculum — C4 Development Comparison Model v0.1

Date: 2026-11-02  
Status: Candidate model specification / [O]  
Scope: comparing candidate developmental interpretations without assuming the proposed sequence is true.

## 1. Core problem

The registry currently contains candidate developments and a candidate order. That is useful for curriculum design, but it creates a major empirical risk: the analysis could accidentally rediscover the assumptions that were put into the registry.

C4 therefore requires a comparison between the PacoGO developmental interpretation and plausible alternatives.

## 2. Model families

For a claim, construct at least these conceptual models:

| Model | Main explanation |
|---|---|
| M0 — Unordered | One underlying skill/performance dimension; no distinct developmental states required |
| M1 — Task | Performance primarily reflects task difficulty/representation/context |
| M2 — Familiarity | Performance primarily reflects exposure, memorization or cueing |
| M3 — Specific | Evidence reflects a task/representation-specific competence |
| M4 — Developmental | Candidate developments explain systematic evidence patterns |

Additional alternatives are added when the claim requires them.

## 3. What M4 must explain

The candidate developmental model must explain more than mean correctness.

It should account, where relevant, for:

- evidence-target patterns;
- response/process evidence;
- performance under variation;
- independence and prompting;
- contradictions;
- transfer/context change;
- repeated observations over time.

## 4. What would make M4 unnecessary

If M0 or another simpler model explains the observed pattern equally well without the extra developmental structure, the developmental claim has not earned empirical support merely because M4 is more detailed.

This is a model-comparison principle: additional developmental structure must add explanatory or predictive value sufficient to justify itself.

## 5. What would make M4 interesting

M4 becomes empirically informative when it predicts a pattern that competing models do not predict well, for example:

- coherent evidence across several task forms;
- stability under representation changes;
- systematic response-process differences;
- predictable transitions in later observations;
- improved out-of-sample classification or prediction compared with reasonable baselines.

The exact criterion is claim-specific and must be pre-specified.

## 6. Do not use candidate order as a predictor

`candidate_order` must not be entered as though it were an observed variable.

If D1, D2 and D3 are hypothesized to be ordered, C4 first asks whether the distinctions are meaningful. C5 then tests whether observations support the order.

## 7. Avoid circular validation

The following is circular and invalid as confirmation:

`registry says D2 → D3 → task designed for D2/D3 → learner succeeds → therefore D2 precedes D3`.

A valid design requires observations that can distinguish the proposed interpretation from alternatives.

## 8. Task-level confounding

For each task model, record the features that may explain performance independently of development:

- magnitude;
- representation;
- wording;
- response format;
- context;
- prompt level;
- familiarity;
- cognitive/operational demands not belonging to the target construct.

When these features are confounded with development, the result is limited and cannot be presented as evidence for a developmental distinction.

## 9. Repeated observations

Repeated observations should account for clustering by learner and task where statistically appropriate.

Repeated success on the same or highly similar item is weaker evidence of a general developmental property than success across genuinely varied observations.

The analysis must therefore distinguish:

- repeated rows;
- repeated evidence;
- independent information.

These are not synonyms.

## 10. Exploratory versus confirmatory

Exploratory analyses may identify promising patterns and generate revised candidate developments.

Confirmatory analyses test pre-specified claims against pre-specified alternatives.

A pattern discovered after inspecting the data may be valuable, but it must be labelled exploratory and should be tested again in separated data before being treated as strong support.

## 11. Interpretation rule

C4 should produce a claim-level conclusion of the form:

`candidate development + scope + evidence pattern + competing explanations examined + remaining uncertainty + conclusion`

Never reduce the result to a single percentage or score.

## 12. Current status

This is a candidate comparison framework. No A1, B1 or FR2 development has been empirically supported or validated by this document.
