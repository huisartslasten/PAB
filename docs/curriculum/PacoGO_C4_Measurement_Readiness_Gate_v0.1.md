# PacoGO C4 Measurement Readiness Gate v0.1

Status: Candidate implementation / [O]

This layer separates **being ready to test C4** from **obtaining a C4 developmental conclusion**.

## Gate logic

For each focal claim:

1. The existing pilot analysis must report `c4_ready=true`.
2. At least one independent C3 coding record must exist.
3. An explicit coding-reliability review must exist for the claim.
4. The reliability review must be `ACCEPTABLE_FOR_PILOT_CODING` before the claim is released to C4 comparison.

The implementation does not choose a universal agreement threshold. Agreement statistics remain descriptive C3 outputs; the reliability disposition is an explicit review decision so that a small pilot cannot silently convert an arbitrary numeric cutoff into a scientific validity rule.

## Measurement gate states

- `READY_FOR_C4` — measurement conditions are adequate for the pre-specified C4 comparison.
- `BLOCKED_BY_CODING_RELIABILITY` — C3 coding reliability is not yet acceptable for C4 inference.
- `REVISE_PROTOCOL` — observation coverage, process evidence, variation, provenance or independence requirements are not met.

## Scientific boundary

`READY_FOR_C4` does **not** mean that a development is supported. The returned `c4_decision_state` remains `NOT_TESTED` until the actual C4 comparison of the candidate developmental model against relevant alternatives has been performed.

The gate also permanently returns false for:

- automatic developmental conclusions;
- automatic curriculum-registry promotion;
- automatic mastery-rule changes;
- developmental-ordering inference.

C5 ordering/prerequisite questions remain separate.
