# Lessons feature

This directory owns lesson-domain behavior during the V4.78 migration.

## Rules
- Preserve existing V4.78 behavior before improving behavior.
- Keep DOM rendering separate from Supabase access.
- Do not introduce AI behavior into the lesson editor.
- Keep lesson creation, editing, practice, archive/trash and restore semantics compatible with the current site.
- No database schema changes are part of this extraction.

## Migration order
1. Read-only lesson data mapping.
2. Lesson list and subject grouping.
3. Lesson editor.
4. Lesson practice/player.
5. Archive/trash/restore.
6. Regression comparison against `legacy/index-v4.78.html`.
