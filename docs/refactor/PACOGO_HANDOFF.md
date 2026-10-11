# PacoGO — Persistent Technical Handoff

## Project identity
- Repository: `huisartslasten/PAB`
- Active refactor branch: `refactor/professional-v1`
- LIVE branch: `main` — **never touch**.
- Functional parity baseline: TEST V4.78.
- Authoritative source: `backup-test-v478-before-professional-rewrite/index.html`.
- Authoritative source blob: `de4ebcc75b1b333cc985936c86f7c654c818be24`.
- `legacy/index-v4.78.html` is **not** the parity source.

## Current verified TEST state
- Latest implementation checkpoint: canonical lesson-page read boundaries through the application boundary.
- Current readable TEST version: **V5.14**.
- Current TEST head being prepared for regression: `ad6f4aaa9c1bfc46238bd940f80d4bf2211fa9af`.
- Latest pre-change green regression: commit `e80f2a98146a1cce28ad90342943082cec3b8aff`.
- The current change routes the canonical LESSONS page's Dashboard navigation to `dashboard.html?student=...` instead of the legacy `index.html` shell.

## Mandatory engineering standard
**Before any implementation, read `docs/engineering/PACOGO_ENGINEERING_STANDARD.md`. Its rules are binding for all PacoGO development.**

## Non-negotiable rules
1. Preserve V4.78 behavior before improving/designing.
2. No visual redesign during parity work.
3. No Supabase schema changes.
4. Lesson editor remains deterministic; no new AI behavior.
5. Do not blindly patch the giant legacy monolith.
6. A module is not migrated until connected and parity-checked.
7. Runtime wiring only after source behavior and focused tests are proven.
8. Do not modify agenda-import unless explicitly requested.
9. Never claim a full `node --test` pass unless actually executed.
10. Work only on `refactor/professional-v1`.
11. **Patching is not an allowed refactor method.** Do not solve architectural or migration problems by adding local fixes, compatibility shims, duplicated logic, or incremental symptom patches.
12. **Legacy code is not a repair surface.** Modify legacy runtime only as a deliberate final integration/removal step after the replacement boundary is source-verified, focused-tested, and runtime-validated.
13. Every proposed change must identify V4.78 source behavior, architectural responsibility, target module/boundary, contract, and parity test.
14. **Refactor Gate:** classify every change as new/refactored architecture or patch/workaround. If workaround, redesign the boundary instead.
15. If an architectural mismatch, missing seam, or failed assumption is discovered, stop and redesign the boundary rather than patching the symptom.
16. Tests must prove contracts and behavior, not merely make the current implementation green. Do not weaken assertions.
17. **Every meaningful update must follow the permanent Engineering Standard, including the readable TEST-version update and the two-code handoff to the user.**

## Architecture / ownership
- Pages own presentation and user interaction.
- Services own data and domain logic.
- Shared functionality belongs in shared modules.
- Lesson reads for canonical student pages use `createPacoGOApp().loadLessons()` and the application-owned `mapLessons()` boundary.
- `src/features/lessons/lesson-mapper.js` remains owned by the application boundary; canonical pages do not import it directly.
- Canonical LESSONS flow is `dashboard → lessons → lesson-choice → oefenen / test / view / questions`.
- `dashboard.html` is the canonical student dashboard page.
- Canonical LESSONS navigation must not route back into the legacy `index.html` shell when a canonical dashboard target exists.
- Agenda/test legacy targets remain untouched until their own canonical target boundaries are source-verified; no invented replacements are allowed.

## Current canonical page state
- `lessons.html` reads via `app.loadLessons()` then `app.mapLessons()`.
- `lesson-choice.html` reads via `app.loadLessons()` then `app.mapLessons()`.
- `oefenen.html` reads via `app.loadLessons()` then `app.mapLessons()` for lesson capability availability.
- `flashcards-template.html` delegates runtime lesson loading to `src/features/practice/flashcards/flashcard-runtime.js`, which uses the application boundary.
- `test.html` reads via `app.loadLessons()` then `app.mapLessons()` and uses the professional player runtime.
- `lesson-view.html` reads via `app.loadLessons()` then `app.mapLessons()` and delegates presentation semantics to the lessons feature boundary.
- `questions.html` reads via `app.loadLessons()` then `app.mapLessons()` and delegates progression to `question-session.js`.
- Dashboard agenda presentation uses the existing `app.agenda` read model.

## Testing discipline
After every meaningful change:
1. verify changed functionality;
2. verify the full affected user flow;
3. verify existing consumers remain intact;
4. run relevant automated tests;
5. check regressions;
6. confirm TEST branch/environment.

The latest pre-change green regression was `e80f2a98146a1cce28ad90342943082cec3b8aff`. The new `ad6f4aaa9c1bfc46238bd940f80d4bf2211fa9af` change must be green before the next architectural change.

## Safety
- `main` / LIVE is untouched.
- No LIVE Supabase changes.
- No Supabase schema changes.
- No compatibility shim or legacy repair patch was introduced.
- The current navigation change removes a legacy route from the canonical LESSONS page rather than adding another route or fallback.
