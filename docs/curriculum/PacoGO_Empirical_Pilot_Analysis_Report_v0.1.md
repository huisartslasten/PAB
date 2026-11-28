# PacoGO Empirical Pilot — Descriptive Analysis Report Contract v0.1

Status: Candidate / design-only / [O]

## Purpose

This layer converts validated raw observations and C3 coding records into a reproducible descriptive report. It is an analysis/reporting layer, not a mastery engine and not a developmental inference engine.

## Inputs

- validated raw observations;
- validated C3 coding records;
- the pre-specified pilot analysis result;
- the exact curriculum registry version used by the observations.

## Required descriptive outputs

1. observation count by focal claim;
2. observation count by evidence target;
3. explicit missingness by required field;
4. task and variation coverage;
5. target-match distribution;
6. performance and process distributions;
7. independence/prompting distribution;
8. evidence-quality distribution;
9. contradiction frequency;
10. alternative-explanation frequency;
11. double-coding agreement and confusion matrices;
12. C4 readiness state by focal claim.

## Scientific boundaries

The report must not:

- convert missingness into negative evidence;
- collapse independent coder records into one hidden code;
- infer developmental stage/order;
- infer prerequisite status;
- change mastery rules;
- promote a curriculum registry entry;
- generate a learner next-action decision.

## Interpretation

The report describes what was observed and how reliably it was coded. It does not by itself establish that a candidate developmental claim is true. Any later inferential analysis must use the pre-specified C4/C5 protocol and preserve the underlying observation and coding records.
