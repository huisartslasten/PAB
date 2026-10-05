# PacoGO professional refactor — migration status

Reference runtime: TEST V4.78.

## Safety
- LIVE/main is out of scope.
- `backup-test-v478-before-professional-rewrite` is the rollback point.
- `legacy/index-v4.78.html` is the immutable reference copy on this refactor branch.
- No Supabase schema changes are being introduced by the structural rewrite.

## Completed
- Architecture boundaries documented.
- Shared text/date utilities extracted.
- Central application state boundary created.
- Authentication/role boundary created.
- Supabase client boundary created.
- Lesson service boundary created, pending exact behavior parity review before wiring.
- Shared sidebar component extracted while preserving the current DOM contract; it is not mounted yet.
- Application context boundary created.
- Lesson data mapper extracted.
- Agenda domain normalization/matching extracted.
- Wordtrainer deterministic evaluator extracted; no AI behavior added.
- Photo lesson session state extracted.
- Photo storage service extracted from the existing storage implementation and connected to the composition root, but not mounted into the V4.78 runtime yet.

## Not yet migrated
- `index.html` remains the active runtime.
- Lesson editor/player.
- Agenda/import/matching UI orchestration.
- Wordtrainer UI/player.
- Photo lesson page/orchestration UI.
- Management/admin pages.
- Global CSS extraction.

## Current migration gate
The extracted modules are intentionally additive. They must not replace V4.78 merely because they exist. Before a module is wired, its exact current behavior and database contract must be compared with V4.78 and then verified in TEST.

## Rule for the next phases
A feature is migrated only after its current V4.78 behavior is mapped, the new module is wired behind the same DOM/data contracts, and the legacy path remains available until parity is checked.
