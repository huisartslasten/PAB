# PacoGO Professional Refactor

## Safety rules

- LIVE/main is untouched.
- TEST V4.78 is the functional parity baseline.
- This refactor is developed on `refactor/professional-v1`.
- Existing functionality is the specification; refactoring must not silently redesign behavior.
- Database migrations are not changed as part of the structural refactor.

## Final state

Professional V1 is closed on the refactor branch. The agreed scope produced a modular lesson/editor/runtime architecture, a professional Player runtime, a professional Agenda runtime, deterministic domain/service boundaries, separate Agenda import/review handling, shared page navigation, and removal of superseded legacy runtime ownership and duplicate lesson helpers.

## Verification

The canonical full regression workflow is `.github/workflows/full-regression-refactor-v1.yml`.

Current validated HEAD: `1bdbbafa8e5cabbbca6bed8f84f69903889e43ea`.

Final cleanup gate: GitHub Actions run `38916626847` — maintained Node regression, Vitest regression, Agenda ownership, Player ownership, browser regression, and working-tree cleanliness all passed.

The authoritative V4.78 source remains `backup-test-v478-before-professional-rewrite/index.html`.
