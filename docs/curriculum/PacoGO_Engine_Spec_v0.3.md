# PacoGO Engine Specification v0.3

Status: candidate technical specification
Datum: 2026-11-02

## 1. Scope

v0.3 extends v0.2 with two derived-state boundaries:

1. Longitudinal Student State.
2. Decision Trace.

The Versioned Curriculum Registry and Student Evidence Store remain the source boundaries for curriculum meaning and observations. A1, B1 and FR2 remain representative configurations, not hard-coded engine cases.

## 2. Contract

`student + curriculum_version + observation_history -> evidence -> inference -> mastery -> decision -> next action`

The exact curriculum version is part of the evidence provenance. Evidence and derived state must not silently change meaning when curriculum configuration changes.

## 3. Longitudinal State

Longitudinal state is derived from stored evidence under one exact curriculum registry version. It records evidence count and observed targets, developmental inference, mastery inference, contradiction information, unresolved developments, and the latest observation time.

The state is mutable because it is the current derived state. Historical evidence remains append-only, and historical decisions remain available through the Decision Trace.

A state such as `MASTERED` means only that the configured Candidate rule was satisfied. It is not a scientific validation of the mastery rule.

## 4. Decision Trace

Every registry-backed cycle can produce:

`EVIDENCE -> INFERENCE -> MASTERY -> DECISION -> NEXT ACTION`

The trace stores the exact curriculum registry version, observation identifiers when available, developmental inference, mastery inference, uncertainty/contradiction information, decision type/reason, and selected next action.

The trace is append-only and is intended to make decisions inspectable and reproducible without introducing false precision.

## 5. Generic Runtime Boundary

The runtime receives configuration and evidence; it does not know whether the skill is A1, B1 or FR2.

The same functions are used for all representative seeds:
- evidence assessment;
- developmental inference;
- mastery inference;
- longitudinal state derivation;
- decision explanation;
- next-action selection;
- decision trace creation.

Task models may declare multiple evidence targets.

## 6. Declarative Evidence Rules

The prototype currently supports:
- `target_match` relevance;
- configurable quality field;
- configurable contradiction field;
- configurable default quality.

This is a technical starting point, not a final assessment ontology.

## 7. Persistence Contract

Supabase now contains four linked curriculum-state boundaries:
- `curriculum_registry_versions` — versioned curriculum meaning;
- `student_evidence` — append-only observations;
- `student_longitudinal_state` — current derived state;
- `curriculum_decision_trace` — append-only historical decisions.

Derived records retain a foreign key to the exact registry version used for interpretation.

## 8. Scientific Boundary

Technical tests establish software execution and contract coherence only.

They do not establish that:
- skills are valid constructs;
- developments are real developmental stages;
- candidate ordering is correct;
- mastery thresholds are valid cut scores;
- next-action priorities improve learning;
- an engine `MASTERED` state is equivalent to scientifically validated mastery.

All current curriculum seeds and rules remain Candidate. Supported and Validated require explicit empirical scope and evidence.

## 9. Next Extension

1. Explicit alternative-explanation representation.
2. Better uncertainty representation without false precision.
3. Validation hooks for C1-C10.
4. Empirical workflow for Candidate -> Supported -> Validated under explicit criteria.
