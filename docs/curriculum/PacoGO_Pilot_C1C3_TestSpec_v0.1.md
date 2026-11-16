# PacoGO Curriculum — C1-C3 Test Specification v0.1

Status: Candidate / `[O]`

Purpose: verify that the pre-specified pilot task set and synthetic observations preserve the intended C1-C3 chain. This is a technical/reproducibility fixture, not empirical evidence.

## Required checks

1. Every task resolves to exactly one skill, development, claim, evidence target and task model.
2. Every task has a stable variation key and explicit prompt level.
3. Counter/alternative-explanation tasks are explicitly marked and linked to a plausible alternative explanation or diagnostic purpose.
4. Every synthetic observation resolves to a task definition and curriculum registry version.
5. Every synthetic observation contains provenance and coding fields.
6. Missing or unavailable process evidence is represented as `INDETERMINATE`, not silently converted to `ABSENT` or failure.
7. Prompted evidence is not treated as independent evidence.
8. A contradiction flag is only used where the observation directly conflicts with an inference that might otherwise be drawn.
9. Synthetic records remain explicitly labeled as non-empirical test data.
10. The complete chain remains auditable:

`curriculum version → skill → development → claim → evidence target → task model → task → performance → coding`

## Scientific boundary

Passing these checks means the pilot artifacts are internally coherent enough for collection/coding work. It does **not** support A1, B1 or FR2 as Supported or Validated claims.
