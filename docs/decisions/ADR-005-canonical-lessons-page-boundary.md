# ADR-005 — Canonical LESSONS page boundary

**Status:** Accepted
**Branch:** `refactor/professional-v1`

## Decision

Move the student LESSONS flow out of the legacy `index.html` page shell and establish the canonical page-template boundary as:

`Mijn lessen → vak → leskeuze → Oefenen / later test & view`

The new student-facing pages are:

- `lessons.html` — lesson/subject selection
- `lesson-choice.html` — one lesson and its available actions
- `oefenen.html` — canonical practice shell
- `flashcards-template.html` — canonical flashcard shell

The shared `src/components/page-template.js` owns the shell and generic scroll memory. Lesson data is read through `createPacoGOApp().lessons`, and lesson-choice semantics come from `src/features/lessons/lesson-choice.js`.

## Context / problem

LESSONS was still rendered inside the V4.78 monolithic `index.html`, while OEFENEN and Flashcards had already moved to the canonical page template. A special `lesson-practice-navigation.js` module attempted to preserve the legacy LESSONS scroll position across the boundary.

That created two competing page ownership models and made scroll behavior dependent on a navigation patch instead of the canonical shell.

## Alternatives considered

1. Keep the legacy LESSONS page and add more scroll/navigation patches.
2. Duplicate the template inside `index.html`.
3. Move LESSONS through the canonical page-template boundary and remove the patch.

Option 3 was selected because it establishes one shell owner and removes the architectural dependency on the legacy monolith.

## Consequences

- Canonical LESSONS pages now use the same shell and TEST-version ownership as OEFENEN and Flashcards.
- Generic template scroll memory can operate on LESSONS without a cross-page special key.
- The legacy lesson implementation remains only as the parity/integration reference until its ownership can be deliberately removed after runtime proof.
- Test and view actions are intentionally not reimplemented in this boundary until their canonical runtime targets are source-verified; the migration does not invent behavior.
