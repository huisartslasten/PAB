# PacoGO V5.11 — LESSONS migration addendum

This addendum supplements `docs/refactor/PACOGO_HANDOFF.md` for the current V5.11 work.

## Current architecture

The student LESSONS flow now has a canonical page boundary on `refactor/professional-v1`:

`lessons.html → lesson-choice.html → oefenen.html → flashcards-template.html`

- `lessons.html` owns student lesson/subject selection through `createLessonService()`.
- `lesson-choice.html` owns the lesson-action boundary through `getLessonChoices()`.
- `oefenen.html` owns the practice-choice page through the canonical page template.
- `flashcards-template.html` remains a canonical child page and now links back to `lessons.html` through the shared navigation.
- `src/components/page-template.js` owns the readable TEST version and generic scroll memory.
- `src/features/practice/lesson-practice-navigation.js` was removed; its special lesson scroll key and navigation patch are no longer part of the architecture.

## TEST version

Readable TEST version: **V5.11**.

The version is owned centrally by `src/components/page-template.js`.

## Validation status

- Browser contract updated to cover LESSONS and LESKEUZE canonical shells.
- Netlify TEST deploy for commit `83bea78b5d98135141fe56d0a48f61a044dac3fd` reached `ready`.
- Public TEST site remains configured without password/SSO protection.
- The external web viewer cannot access `test.pacogo.org`, so browser runtime proof through that viewer is not available from this environment.
- GitHub Actions run for the latest commit had not yet appeared when this addendum was written; therefore no full Node/Vitest/Playwright regression is claimed.

## Remaining architectural work

The legacy lesson renderer in `index.html` is still retained as the V4.78 parity/reference implementation. It is no longer the intended canonical student LESSONS entry point. Its eventual removal must happen only after runtime parity proof of the canonical flow and after all required test/view targets have been source-verified.

No Supabase schema or data was changed. `main`/LIVE was not modified.
