# PacoGO professional refactor — migration status v2

## Current state

- Baseline: TEST V4.78.
- LIVE/main is outside this refactor and must remain untouched.
- `legacy/index-v4.78.html` is the immutable runtime reference on the refactor branch.
- New modules are assembled through a staged runtime but are not mounted by `index.html` yet.

## Completed structural layers

- Pure text/date utilities.
- Central application state and auth boundary.
- Supabase client boundary.
- Lesson repository/service boundary.
- Lesson mapping boundary.
- Agenda domain normalization/matching boundary.
- Deterministic Wordtrainer evaluator boundary.
- Photo lesson session and photo-storage boundary.
- Shared sidebar/page-shell component boundaries.
- Feature registry and staged runtime composition root.
- Node regression tests for the pure modules.
- Legacy compatibility bridge for staged migration.

## Next migration gate

The next work is not a visual rewrite. It is runtime parity work:

1. Compare exact V4.78 data-loading behavior with the new lesson repository/service.
2. Add repository-level tests using a mocked Supabase client.
3. Map the exact lesson filtering/archived/deleted/student rules before wiring the lesson feature.
4. Map the exact agenda storage and import contracts before wiring agenda.
5. Only after those checks pass, mount one read-only feature into a TEST-only runtime path.

## Safety rule

Do not replace `index.html`, remove legacy functions, rename database tables, or change the visual shell as part of this stage. Every migrated area must first pass parity checks against V4.78.
