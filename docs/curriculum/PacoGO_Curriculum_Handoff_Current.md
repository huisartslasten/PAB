# PacoGO Curriculum — Current Handoff

> **HANDOFF IS THE CROSS-CHAT SOURCE OF TRUTH.** Every new chat working on PacoGO Curriculum must read this file first.

## 1. Current position

PacoGO is a learning/curriculum platform. The curriculum engine is the scientific decision layer; learner-facing Learning Interfaces are built on top of it.

Working branch: `refactor/professional-v1`  
`main` / LIVE must not be touched.

## 2. Engineering workflow

Before every build step: Full Regression → green means build → red means stop and isolate the exact root cause → classify cause → design the proper underlying solution → implement → Full Regression again. Never guess or symptom-patch. Tests are changed only when demonstrably incorrect or when an intentional contract change has been correctly designed.

Always report the exact commit tested and the actual regression result.

## 3. Scientific curriculum engine

C1–C9 are complete.

Core chain:
`curriculum → skill → development → claim → task → learner performance → evidence → evidence assessment → inference → mastery → next action → learner state → validation`

- C1: claim-centred validation design; feasibility, discriminating and longitudinal phases separated.
- C2: learner/context → task instance → interaction/observation → evidence assessment → inference → decision.
- C3: evidence coding includes target match, performance, process, quality, contradiction, prompting/independence, alternatives and reliability.
- C4: discriminating tasks and readiness gates; 19 tasks over 10 developments, model families M0–M4.
- C5: developmental ordering distinguished from sequence, temporal precedence, prediction, prerequisite and causality; alternatives, invariance, longitudinal design and model comparison explicit.
- C6: mastery is claim/development/scope/time bounded; seven gates; no automatic promotion.
- C7: prerequisite ordering and next-development ordering remain separate.
- C8: observed evidence, inference, mastery and decision remain distinct over time.
- C9: validates the complete vertical chain and explicit claim selection at multi-claim boundaries.

## 4. Curriculum cases

A1 — Getallen representeren en verbinden is the construction/reference case.

B1 — Optellen and FR2 — Breukequivalentie herkennen en gebruiken remain candidate generalisation cases. Registry presence is not empirical promotion.

## 5. Scientific validation — completed design baseline

Completed:
- `docs/curriculum/PacoGO_Validation_Data_Specification_v0.1.md`
- `docs/curriculum/PacoGO_Scientific_Validation_Protocol_v0.1.md`
- W2 repeated-measurement protocol and W2 analysis contract.
- `docs/curriculum/PacoGO_Construct_Specific_Validation_Design_v0.1.md`

The validation specification distinguishes product, curriculum-engine and scientific-validation data, defines external validation requirements, reliability, longitudinal validation, mastery validation, next-action validation, learner-state validation, Learning Interface validation, privacy/child-data governance and replication.

The construct-specific design now establishes the next research layer: A1 construct hypotheses and candidate independent-measure families; B1/FR2 construct boundaries; reliability/measurement-error design principles; longitudinal design constraints; study-specific power/precision policy; preregistration boundaries; ethics/data-governance requirements; and explicit gates before Learning Interface runtime contracts are scientifically frozen.

The scientific protocol is a design baseline, not evidence that PacoGO is scientifically validated. PacoGO remains scientifically grounded, designed and empirically testable, but not empirically validated.

## 6. W2 / C5 boundary

W2 is design-only longitudinal readiness infrastructure.

W2 permits analysis of repeated measurement and temporal association when the protocol requirements are satisfied. Developmental ordering, prerequisite inference, causal inference, mastery classification, registry promotion and mastery-rule changes remain explicitly blocked.

Current W2 analysis contract requires:
- provenance;
- timepoint coverage;
- within-learner repetition;
- measurement consistency;
- missingness/attrition;
- task variation;
- temporal association;
- alternative explanations;
- C5 ordering readiness.

At least three time points are required by the W2 ordering-readiness contract before an ordering design can be considered; even then the scientific inference remains blocked until the required empirical protocol and validation evidence exist.

## 7. Learning Interface System

Build reusable pedagogical instruments, not one traditional lesson per skill.

Examples: Number Line, Clock, Fraction, Quantity/Number Representation, Measurement, Ratio.

Conceptual chain:
`skill → development → required interaction forms → Learning Interface(s) → task/evidence`

Interfaces must separate pedagogical/function state from visual/rendering state and remain ready for future PacoGO Deluxe / Upper Tier integration.

The interface runtime contract must preserve the mapping:
`interaction → observable event → evidence target → coding dimension → validation dataset field`.

The current scientific design explicitly says not to freeze construct-specific evidence fields, mastery thresholds or scientific interpretations until the corresponding construct has passed the research readiness gates.

## 8. Supabase

No Supabase schema/runtime change is required for the current scientific validation design work. Change Supabase only for a real persistence/runtime contract requirement.

## 9. Current scientific next step

The next major research/engineering phase is to turn the construct-specific design into a study-ready A1 protocol. This requires:
- exact age/population scope;
- exact independent measures;
- primary hypotheses and estimands;
- measurement occasions and spacing;
- reliability design;
- longitudinal model candidates;
- mastery criterion design;
- sample-size/power/precision analysis;
- preregistration plan;
- ethics/privacy/governance plan;
- confirmatory/exploratory separation.

B1 and FR2 should receive the same construct-specific treatment before candidate promotion.

## 10. Latest verified regression state

Latest user-confirmed complete Full Regression:
- Commit: `f14fadb6cb6e3b7cd882928ec8619dbdffd836f5`
- Branch: `refactor/professional-v1`
- Status: **GREEN** (user-confirmed)

Current HEAD after the construct-specific design work:
- Commit: `54e173674c4e55f262d1c7a3dad61a54a81b634f`
- Full Regression: **NOT YET VERIFIED**

Automated GitHub workflow/status data has not been available for the recent commits through the connector, so no stronger CI claim is made.

## 11. Strategy

**Build the brain → prove the vertical chain → define how the brain will be scientifically validated → define construct-specific study designs → build reusable learning instruments with that validation contract → empirically validate with real learners → then build the larger Deluxe world.**
