# Lessons feature

This directory owns the professional lesson-domain behavior extracted from the V4.78 application.

## Rules
- Preserve V4.78 behavior before improving behavior.
- Keep DOM rendering separate from Supabase access.
- Do not introduce AI behavior into the deterministic lesson editor.
- Keep lesson creation, editing, practice/player, archive/trash and restore semantics compatible with the current site.
- No database schema changes are part of this structural refactor.

## Professional architecture
The lesson/editor/runtime boundaries are integrated on `refactor/professional-v1`. Player execution is owned by the canonical player runtime modules and application bridge; legacy player ownership has been removed after regression proof.

The authoritative parity source is `backup-test-v478-before-professional-rewrite/index.html`. `legacy/index-v4.78.html` is not the parity source.
