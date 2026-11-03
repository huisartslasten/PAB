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

The validation specification distinguishes product, curriculum-engine and scientific-validation data, defines external validation requirements, reliability, longitudinal validation, mastery validation, next-action validation, learner-state validation, Learning Interface validation, privacy/child-data governance and replication.

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

## 8. Supabase

No Supabase schema/runtime change is required for the current scientific validation design work. Change Supabase only for a real persistence/runtime contract requirement.

## 9. Current scientific next step

The next major research/engineering phase is to convert the validation baseline into construct-specific protocol designs. This requires evidence-based decisions about:
- external measures per construct;
- reliability coefficients and thresholds appropriate to each decision;
- longitudinal measurement occasions and spacing;
- sample-size/power or precision justification;
- preregistration and confirmatory/exploratory separation;
- independent assessment and transfer measures;
- analysis and robustness plans;
- ethics, consent/assent, privacy and research governance;
- replication/generalisation criteria.

These decisions should be resolved before freezing the Learning Interface evidence/runtime contract.

## 10. Latest verified regression state

Latest user-confirmed complete Full Regression:
- Commit: `be4d34dc13b2c0d2951b6f3a4a7d469a52bcd98f`
- Branch: `refactor/professional-v1`
- Status: **GREEN** (user-confirmed)

Automated GitHub workflow/status data has not been available for the recent commits through the connector, so no stronger CI claim is made.

## 11. Strategy

**Build the brain → prove the vertical chain → define how the brain will be scientifically validated → build reusable learning instruments with that validation contract → empirically validate with real learners → then build the larger Deluxe world.**
