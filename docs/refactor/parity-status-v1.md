# PacoGO refactor — parity status V1

## Scope
Reference: TEST V4.78.
Target: `refactor/professional-v1`.
LIVE/main is not part of this work.

## Current verified boundaries

### Lessons
- The new lesson service preserves the current broad query shape: `lessons` with nested `lesson_items`, ordered by lesson id.
- Nested lesson items are sorted by `sort_order` in the extracted service.
- Update/archive/trash/restore operations are isolated behind the service.
- The lesson feature calls the service and refreshes state after mutations.

### Agenda
- Agenda normalization and subject matching are isolated as deterministic helpers.
- Agenda UI/import remains in the V4.78 runtime until its exact storage and import contract is mapped.

### Wordtrainer
- Deterministic answer evaluation is isolated.
- No AI behavior has been introduced into the lesson editor.

### Photo lessons
- Photo session state and storage access are isolated.
- Existing photo-storage behavior remains the reference until its callers and storage contract are verified.

## Important unresolved parity items

The available source extraction is not yet sufficient to claim exact parity for:
- lesson filtering by student;
- archived/deleted visibility rules per page;
- all lesson loading call sites;
- exact agenda persistence/import behavior;
- exact editor/player rendering behavior;
- all parent/admin authorization paths.

Therefore the legacy implementation must remain active and must not be deleted yet.

## Next gate
1. Extract the exact V4.78 lesson filtering rules.
2. Encode those rules in the lesson service/repository tests.
3. Verify agenda storage/import contracts.
4. Mount only a read-only lesson path in a TEST-only harness.
5. Compare output against V4.78 before replacing any runtime path.

## Safety rule
No schema changes, no LIVE/main changes, no visual redesign, and no removal of legacy code until parity is demonstrated.
