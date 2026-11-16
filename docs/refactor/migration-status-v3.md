# PacoGO professional refactor — migration status v3

## Baseline
- Functional reference: TEST V4.78.
- Working branch: `refactor/professional-v1`.
- LIVE/main is excluded.
- `legacy/index-v4.78.html` remains the fallback/reference copy.

## Newly completed extraction steps
1. Lesson choice flow isolated from the page runtime.
2. Existing lesson player state isolated and regression-tested.
3. Existing lesson editor model isolated and regression-tested.
4. Archive/trash/restore actions isolated behind a recovery boundary.
5. Agenda storage isolated behind an explicit-key adapter; no unverified V4.78 storage key is assumed.
6. Recovery regression tests added.
7. Agenda storage regression tests added.
8. Player state regression tests added.
9. Editor model regression tests added.
10. Migration status documented and kept additive.

## Exact V4.78 behavior confirmed during this stage
- `openLesson(id)` selects the lesson, stores it as `currentLesson`, opens the lesson-choice view and renders type-specific choices.
- V4.78 provides three choices for `words`: Oefenen, Toets, Bekijken.
- V4.78 provides three choices for `dictation`: Oefenen, Toets, Bekijken.
- V4.78 provides two choices for question lessons: Vragen maken, Bekijken.
- V4.78 `startPractice(type)` creates practice state from the current lesson items and uses a remaining-item set.
- V4.78 test-calendar persistence uses the verified key `pacogo_test_calendar`; this is separate from the general agenda import/persistence contract.

## Important caution
The refactor modules are still not mounted as the TEST runtime. One newly created agenda storage adapter deliberately requires its storage key to be supplied by the caller because the general agenda-import storage contract has not yet been fully verified. This prevents accidental creation of a second persistence format.

## Next migration gate
- Finish exact player behavior extraction: practice, test, dictation, questions, scoring/result recording, and navigation back to the lesson choice.
- Finish exact editor save/update behavior and item-type-specific editor rows.
- Finish archive/trash UI behavior and parent permissions.
- Finish agenda import/persistence contract separately from the test calendar.
- Run the complete Node regression suite.
- Only then mount a read-only route into TEST for parity comparison.

## Safety rules
- Do not replace `index.html` yet.
- Do not remove legacy functions yet.
- Do not change Supabase schema for this structural refactor.
- Do not change visual design during parity extraction.
- Do not touch LIVE/main.
- Do not add AI behavior to the lesson editor.
