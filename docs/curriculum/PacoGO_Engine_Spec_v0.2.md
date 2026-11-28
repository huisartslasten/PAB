# PacoGO Engine Specification v0.2

Status: candidate technical specification
Datum: 2026-11-02

## 1. Scope

v0.2 extends the v0.1 engine contract with two persistence boundaries:

1. Versioned Curriculum Registry.
2. Student Evidence Store.

The engine remains generic. A1, B1 and FR2 are representative configurations, not hard-coded engine cases.

## 2. Contract

`student + curriculum_version + observation_history -> evidence -> inference -> mastery -> decision -> next action`

The exact curriculum version is part of the evidence provenance. Evidence must not silently change meaning when curriculum configuration changes.

## 3. Curriculum Registry

A registry version contains or references:
- skill definitions;
- development candidates;
- developmental claims;
- evidence targets;
- task models;
- development rules;
- evidence-assessment rules;
- mastery rules;
- decision priorities.

Registry versions have an empirical status:
- Candidate
- Supported
- Validated

The current seed is `0.2.0-seed` and is Candidate.

## 4. Student Evidence Store

Evidence is stored as observations plus a claim-relative evidence assessment and is linked to the exact curriculum registry version used for interpretation.

Minimum provenance:
- student key;
- registry version;
- skill;
- development/claim/evidence target where known;
- task model/task instance where known;
- performance;
- observation;
- evidence assessment;
- observation timestamp.

The current store is append-only at the application contract level. Decision traces and longitudinal state snapshots are deliberately deferred to the next step.

## 5. Generic runtime boundary

The runtime receives configuration and evidence; it does not know whether the skill is A1, B1 or FR2.

The same functions are used for all three representative seeds:
- evidence assessment;
- developmental inference;
- mastery inference;
- next-action selection.

Task models may declare multiple evidence targets. The runtime therefore treats `evidence_target_ids` as an array rather than assuming one target per task model.

## 6. Declarative evidence rules

The current prototype supports a deliberately small declarative rule vocabulary:
- `target_match` relevance;
- configurable quality field;
- configurable contradiction field;
- configurable default quality.

This is a technical starting point, not a final assessment ontology.

## 7. Scientific boundary

A successful runtime test demonstrates software execution and contract coherence only.

It does NOT demonstrate:
- that the 32 skills are valid constructs;
- that the proposed developments are real developmental stages;
- that the candidate ordering is correct;
- that mastery thresholds are valid cut scores;
- that next-action priorities improve learning.

Those remain Candidate until empirical work supports them. Supported and Validated require explicit empirical scope and evidence.

## 8. Next extension

1. Decision Trace.
2. Longitudinal state update.
3. Explicit contradiction and alternative-explanation representation.
4. Uncertainty representation without false precision.
5. Validation hooks for C1-C10.
