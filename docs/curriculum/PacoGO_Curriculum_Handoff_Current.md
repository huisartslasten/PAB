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
- validation data specification;
- scientific validation protocol;
- W2 repeated-measurement protocol and analysis contract;
- construct-specific validation design;
- A1 study protocol;
- A1 preregistration-readiness specification;
- A1 population/instrument selection gate.

The scientific protocol remains a design baseline, not evidence that PacoGO is scientifically validated. PacoGO remains scientifically grounded, designed and empirically testable, but not empirically validated.

## 6. W2 / C5 boundary

W2 is design-only longitudinal readiness infrastructure. Developmental ordering, prerequisite inference, causal inference, mastery classification, registry promotion and mastery-rule changes remain explicitly blocked.

## 7. Learning Interface System

Build reusable pedagogical instruments, not one traditional lesson per skill.

Conceptual chain:
`skill → development → required interaction forms → Learning Interface(s) → task/evidence`

Interfaces must separate pedagogical/function state from visual/rendering state and remain ready for future PacoGO Deluxe / Upper Tier integration.

The interface runtime contract must preserve:
`interaction → observable event → evidence target → coding dimension → validation dataset field`.

## 8. Current engineering implementation

A1 Number Line and FR2 Fraction Equivalence already demonstrate browser → interaction controller → observation → curriculum registry → learner-state/decision flow.

New generalisation slice completed:
- `pacogo-engine/addition-controller.js` — reusable B1 quantity-addition interaction controller;
- `pacogo-engine/addition-controller.test.js` — evidence/interaction contract test;
- `curriculum-b1-addition.html` — B1 browser vertical slice using B1-T01.

The B1 slice captures strategy choice, answer, interaction events, task identity, evidence target, provenance and variation, then sends the observation through the same curriculum registry path as A1/FR2. No Supabase change was required.

## 9. Current next engineering step

Continue generalising the browser/engine vertical slice across the candidate curriculum without duplicating curriculum logic in pages. Prefer reusable Learning Interface/controller contracts and keep page code thin. Do not add scientific claims or freeze construct-specific mastery rules from synthetic browser data.

## 10. Latest regression state

Latest user-confirmed complete Full Regression before the B1 build:
- Commit: `11ec9bc5bb0cabe9c24ba7a469521d003c837851`
- Branch: `refactor/professional-v1`
- Status: **GREEN** (user-confirmed)

B1 implementation commits:
- `513236407ad5ac98d86deeb026748340208a3796` — addition controller
- `c83be2b1b08806717d296ce1362547e28af1f808` — controller test correction
- `5bfd5edf0554fa709697bb375735113795498caa` — B1 browser vertical slice

Isolated B1 controller test: **PASS** in a local reconstructed test harness.
Full Regression on the final B1 commit has **not been independently verified** through the available GitHub/CI tooling.

## 11. Supabase

No Supabase schema/runtime change is required for the B1 browser vertical slice. Change Supabase only for a real persistence/runtime contract requirement.

## 12. Strategy

**Build the brain → prove the vertical chain → build reusable Learning Interfaces/controllers → connect multiple curriculum cases through the same engine → empirically validate with real learners → then build the larger Deluxe world.**
