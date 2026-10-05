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
- Sidebar component extracted while preserving the current DOM contract.
- Duplicate experimental sidebar component removed.
- Application context boundary created.

## Not yet migrated
- `index.html` remains the active runtime.
- Lesson editor/player.
- Agenda/import/matching.
- Wordtrainer.
- Photo lessons/storage orchestration.
- Management/admin pages.
- Global CSS extraction.

## Rule for the next phases
A feature is migrated only after its current V4.78 behavior is mapped, the new module is wired behind the same DOM/data contracts, and the legacy path remains available until parity is checked.
