# PacoGO Curriculum — Empirical Validation Protocol v0.1

Date: 2026-11-02  
Status: Candidate protocol / [O]  
Scope: curriculum claims, evidence targets, developmental inferences, mastery decisions and next-action decisions.

## 1. Purpose

This protocol defines what PacoGO must demonstrate before a curriculum component may move from `Candidate` to `Supported`, and what additional evidence is required before it may move from `Supported` to `Validated`.

The protocol validates **claims**, not merely software execution.

A technically correct engine run is not evidence that a developmental claim, mastery rule, ordering hypothesis or instructional decision is valid.

## 2. Unit of validation

The primary unit is the **claim**.

A claim must be traceable to:

`skill -> development -> developmental claim -> evidence target -> task model -> observed performance -> evidence assessment -> inference -> mastery/decision consequence`

Validation status is therefore claim-relative. A skill may contain claims with different statuses.

## 3. Epistemic boundaries

- `[W]` = directly supported by external scientific literature.
- `[S]` = PacoGO synthesis.
- `[O]` = PacoGO design choice.
- `Candidate` = plausible and operationalized, but not sufficiently empirically supported.
- `Supported` = predefined empirical requirements have been met for the stated scope, with limitations recorded.
- `Validated` = support has survived independent/replicated testing, out-of-sample evaluation and relevant competing explanations for the stated scope.

No status is promoted merely because a model is coherent, elegant, widely used, or technically reproducible.

## 4. Evidence classes

Validation evidence is separated into:

1. **Content evidence** — the operationalization represents the intended construct.
2. **Response/evidence evidence** — observed performance patterns are interpretable as intended.
3. **Structural evidence** — relationships among tasks/evidence/developments are consistent with the proposed structure.
4. **Developmental evidence** — the proposed developmental interpretation is supported, including ordering where ordering is claimed.
5. **Mastery evidence** — the proposed mastery decision is supported against an explicitly defined criterion or external reference.
6. **Predictive evidence** — current evidence/inference predicts later relevant outcomes where prediction is claimed.
7. **Comparative evidence** — the PacoGO model adds explanatory or decision value beyond reasonable alternatives where such a claim is made.
8. **Fairness/context evidence** — performance and inference are sufficiently robust across relevant language, context and learner groups.
9. **Revision evidence** — findings are incorporated through a documented curriculum revision process rather than silently changing rules.

## 5. Promotion gate: Candidate -> Supported

A claim can move to `Supported` only when all **applicable** required criteria have been satisfied for a pre-specified scope.

Required principles:

- the claim was specified before confirmatory analysis;
- the construct, evidence target and interpretation are explicit;
- data provenance and coding are auditable;
- evidence coding/measurement is sufficiently reliable for the intended use;
- the observed data provide affirmative evidence for the claim;
- relevant alternative explanations have been examined;
- limitations and scope are explicit;
- no contradictory finding that materially undermines the claim is ignored;
- the result is reproducible from the recorded data/procedure.

A claim does **not** need every C1-C10 criterion when a criterion is genuinely outside its scope. The exclusion must itself be documented and justified.

## 6. Promotion gate: Supported -> Validated

`Validated` is reserved for claims that have survived a stronger test than the data used to establish initial support.

At minimum, the validation record must show, where applicable:

- independent or otherwise genuinely separated replication;
- out-of-sample evaluation for predictive claims;
- comparison with relevant null, baseline and competing developmental explanations;
- robustness to reasonable task/context variation;
- examination of relevant language/context/group effects;
- pre-specified or transparently registered revision rules;
- no material unexplained contradiction within the claimed scope;
- an explicit statement of what the evidence does and does not generalize to.

Validated is therefore a **scope-bound scientific status**, not a permanent truth label.

## 7. C1-C10 validation criteria

### C1 — Pilot design

**Question:** Was the empirical test designed before interpreting the data?

Evidence must show: target population/scope, sampling logic, tasks, procedures, outcomes, exclusions, analysis plan and decision rules were specified sufficiently to reproduce the study.

**Gate contribution:** design credibility; protection against post-hoc interpretation.

### C2 — Student data model

**Question:** Can learner observations be linked to the intended construct without losing provenance?

Evidence must show: learner/session/task identifiers, curriculum version, observation time, relevant context, missingness and provenance are preserved.

**Gate contribution:** interpretable and auditable learner evidence.

### C3 — Evidence coding

**Question:** Is performance converted to evidence in a reproducible way?

Evidence must show: coding rules, examples, coder procedure where applicable, disagreements and resolution procedure, and reliability evidence appropriate to the coding method.

**Gate contribution:** evidence quality and measurement consistency.

### C4 — Development classification

**Question:** Does the observed evidence support the proposed developmental interpretation rather than merely task success?

Evidence must distinguish construct evidence from task difficulty and examine plausible alternative explanations.

**Gate contribution:** construct/developmental interpretation.

### C5 — Developmental ordering

**Question:** If PacoGO claims an ordering or prerequisite relation, is that ordering supported by data?

Evidence must test the proposed ordering rather than assume that curriculum sequence, age or task difficulty proves it.

**Gate contribution:** developmental sequence/prerequisite claims.

### C6 — Mastery decisions

**Question:** Does the proposed mastery rule identify the intended state with defensible evidence?

Evidence must evaluate the rule against an explicitly defined criterion, independent evidence source or decision standard, and must test sensitivity to contradictory and incomplete evidence.

**Gate contribution:** mastery inference; not merely score thresholds.

### C7 — Longitudinal validation

**Question:** Does the proposed developmental state or decision have evidence across time?

For claims involving progression or prediction, evidence must test whether earlier evidence/inference relates to later relevant outcomes. Longitudinal results must be separated from same-session performance evidence.

**Gate contribution:** temporal/developmental validity.

### C8 — Model comparison

**Question:** Does the PacoGO model provide explanatory or decision value beyond reasonable alternatives?

Comparisons should include appropriate null/baseline models and relevant alternative developmental explanations. Where justified, evaluate incremental value, out-of-sample performance, robustness and model complexity.

**Gate contribution:** prevents accepting a PacoGO-specific explanation merely because it fits the observed data.

### C9 — Bias, context & language

**Question:** Does the inference remain defensible across relevant learner, language and context conditions?

Evidence must identify relevant groups/contexts, inspect differential performance or inference, and document whether observed differences arise from the target construct or from language, familiarity, context, task presentation or other confounds.

**Gate contribution:** scope, fairness and transportability.

### C10 — Curriculum revision

**Question:** Does PacoGO revise the curriculum when evidence contradicts or limits a claim?

Every material empirical finding must produce a documented decision: keep, modify, split, merge, narrow, simplify, or reject the affected claim/rule. Old decisions remain reconstructable.

**Gate contribution:** scientific self-correction and versioned curriculum evolution.

## 8. Claim-level validation record

Each validated claim must have a record containing at least:

- claim identifier;
- exact claim text;
- curriculum registry version;
- epistemic status;
- validation status;
- scope/population/context;
- applicable C1-C10 criteria;
- evidence records and provenance;
- analysis/result summary;
- alternative explanations considered;
- contradictions/limitations;
- replication status;
- revision decision;
- date and responsible study/review record.

## 9. No automatic promotion

The runtime may expose validation state and block unsupported uses, but it must never infer `Supported` or `Validated` from learner performance alone.

Promotion is a documented research/curation decision based on empirical records.

## 10. Current PacoGO position

A1, B1 and FR2 remain `Candidate`.

The current runtime demonstrates technical traceability and supports empirical validation, but no C1-C10 criterion has yet been populated with empirical results. Therefore no curriculum claim is promoted by this protocol.

## 11. Next empirical work

The next work package is to instantiate C1-C3 for a reproducible pilot/data-coding workflow, then test C4-C6 on representative claims before attempting longitudinal, comparative and cross-context validation.
