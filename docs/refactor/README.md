# PacoGO Professional Refactor

## Safety rules

- LIVE/main is untouched.
- TEST V4.78 is the functional parity baseline.
- This refactor is developed on `refactor/professional-v1`.
- Existing functionality is the specification; refactoring must not silently redesign behavior.
- Database migrations are not changed as part of the structural refactor.

## Final state

Professional V1 is closed on the refactor branch. The agreed four-day scope produced a modular lesson/editor/runtime architecture, a professional Player runtime, a professional Agenda runtime, deterministic domain/service boundaries, separate Agenda import/review handling, and removal of superseded legacy runtime ownership.

## Verification

The canonical full regression workflow is `.github/workflows/full-regression-refactor-v1.yml`.

Current validated HEAD: `60a31d519e27a8c23e321a1accba1a902ed7890`.

Final recorded gate: GitHub Actions run `37634366676` — 366 Node tests, 24 Vitest tests, and 21 browser tests passed; Agenda and Player ownership checks passed; working-tree cleanliness passed.

The authoritative V4.78 source remains `backup-test-v478-before-professional-rewrite/index.html`.
